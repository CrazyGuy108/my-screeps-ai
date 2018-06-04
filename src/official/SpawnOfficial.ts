import { Official } from "official/Official";
import { Unit } from "Unit";

/** Represents a request to spawn a certain creep. */
type CreepRequest =
{
    /** Creep's body. */
    body: BodyPartConstant[],
    /**
     * ID of the creep's target RoomObject. Used to identify which Official it
     * belongs to.
     */
    targetId?: string,
    /** Target of the creep. */
    target?: RoomObject,
    /** Index in the SpawnOfficial's creepQueue. */
    index: number
};

/**
 * Coordinates spawn actions in a Unit.
 */
export class SpawnOfficial extends Official
{

    /** Spawns managed by this SpawnOfficial. */
    public readonly spawns: StructureSpawn[];
    /** Requested creeps. */
    private readonly creepQueue: CreepRequest[];

    /**
     * Creates a SpawnOfficial.
     *
     * @param unit Unit that this SpawnOfficial belongs to.
     */
    constructor(unit: Unit)
    {
        super(unit);
        this.spawns = [];
        this.creepQueue = [];
    }

    public run(): void
    {
        // early return: no spawns to use and/or no creeps to spawn
        if (!this.spawns.length || !this.creepQueue.length)
        {
            return;
        }

        // go through every available spawn
        this.spawns.filter((spawn) => !spawn.spawning).forEach((spawn) =>
        {
            // prioritize the creep whose target is closest to the spawn
            // FIXME: doesn't consider other spawns that could be closer
            const request = _.min(this.creepQueue, (req) =>
                req.target ?
                    spawn.pos.getRangeTo(req.target)
                    // creeps without targets are lowest priority
                    : Infinity);

            // generate a name for the creep
            // FIXME: fails if two creeps are spawned in the same room at the
            //  same time (unlikely)
            // could use a Memory.counter to guarantee a unique identifier
            const name = `${this.room.name}-${Game.time}`;

            // spawn the creep
            const error = spawn.spawnCreep(request.body, name,
            {
                memory:
                {
                    home: this.room.name,
                    targetId: request.targetId,
                    // start out with no goal
                    goal:
                    {
                        id: "null",
                        isDone: true,
                        options: {}
                    }
                }
            });

            // if successfully spawned, the request has been processed and can
            //  be removed
            if (error === OK)
            {
                this.creepQueue.splice(request.index, 1);
            }
        });
    }

    /**
     * Adds a new spawn to be controlled.
     */
    public addSpawn(spawn: StructureSpawn): void
    {
        this.spawns.push(spawn);
    }

    /**
     * Requests a creep to be spawned. Note that other creeps may take priority.
     *
     * @param body Body of the creep.
     * @param target Target object. Used to identify the Official it belongs to.
     */
    public requestCreep(body: BodyPartConstant[], target?: RoomObject): void
    {
        this.creepQueue.push(
        {
            body: body,
            // every RoomObject should have an id except flags
            targetId: target ? (target as any).id : undefined,
            target: target,
            index: this.creepQueue.length
        });
    }
}
