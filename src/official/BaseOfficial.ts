import { Goals } from "goal/Goals";
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
    /** Index in the BaseOfficial's creepQueue. */
    index: number
};

/**
 * Coordinates spawn actions and base management in a Unit.
 */
export class BaseOfficial extends Official
{

    /** Spawns managed by this BaseOfficial. */
    public readonly spawns: StructureSpawn[];
    /** Requested creeps. */
    private readonly creepQueue: CreepRequest[];
    /** Max amount of workers. */
    private readonly maxWorkers: number;

    /**
     * Creates a BaseOfficial.
     *
     * @param unit Unit that this BaseOfficial belongs to.
     */
    constructor(unit: Unit)
    {
        super(unit);
        this.spawns = [];
        this.creepQueue = [];
        this.maxWorkers = 3;
    }

    public run(): void
    {
        // do regular creep actions
        this.creeps.forEach((creep) => this.creepActions(creep));

        // spawn some more creeps if needed
        // TODO: how to let more essential creeps take priority?
        if (this.creeps.length < this.maxWorkers)
        {
            this.requestCreep([WORK, CARRY, MOVE], this.spawns[0]);
        }

        // early return: no spawns to use and/or no creeps to spawn
        if (!this.spawns.length || !this.creepQueue.length)
        {
            return;
        }

        // go through every available spawn
        this.spawns.filter((spawn) => !spawn.spawning)
            .forEach((spawn) => this.spawnActions(spawn));
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

    /**
     * Executes required creep actions.
     *
     * @param creep Creep to run.
     */
    private creepActions(creep: Creep): void
    {
        if (creep.isDone)
        {
            if (creep.carry[RESOURCE_ENERGY] === 0)
            {
                // fill up on energy
                const storage = this.findStorage(this.room, RESOURCE_ENERGY,
                    /*favorEmpty=*/false);
                if (storage)
                {
                    creep.goal = Goals.Withdraw(storage, RESOURCE_ENERGY);
                }
                else
                {
                    // TODO: find somewhere else or wait?
                    creep.goal = Goals.Null();
                }
            }
            else
            {
                // we have energy to use for something
                // first prioritize construction sites based on range
                let target: Structure | ConstructionSite =
                    creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES);
                if (!target)
                {
                    // maybe some things need repair
                    target = _.min(creep.room.find(FIND_STRUCTURES), (s) =>
                        s.hits / s.hitsMax);
                    if (!target)
                    {
                        if (this.room.controller)
                        {
                            // just go upgrade the controller then
                            target = this.room.controller;
                        }
                        else
                        {
                            // TODO
                            creep.goal = Goals.Null();
                        }
                    }
                }
                if (target)
                {
                    creep.goal = Goals.Build(target);
                }
            }
        }

        creep.run();
    }

    /**
     * Handles spawn-related actions.
     *
     * @param spawn Spawn to run.
     */
    private spawnActions(spawn: StructureSpawn): void
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
    }
}
