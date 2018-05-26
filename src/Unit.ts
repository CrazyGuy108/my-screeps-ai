import { MineOfficial } from "official/MineOfficial";
import { SpawnOfficial } from "official/SpawnOfficial";
import { Whole } from "Whole";

/**
 * Controls a single room, while using the Whole to communicate with other
 * nearby Units.
 */
export class Unit
{
    /** Facilitates communication between other Units. */
    public readonly whole: Whole;
    /** Room to control. */
    public readonly room: Room;
    /** MineOfficials controlled by this Unit. */
    private readonly mineOfficials: MineOfficial[];
    /** SpawnOfficials controlled by this Unit. */
    private readonly spawnOfficials: SpawnOfficial[];

    /**
     * Creates a Unit.
     *
     * @param whole Facilitates communication between other Units.
     * @param room Room to control.
     */
    constructor(whole: Whole, room: Room)
    {
        this.whole = whole;
        this.room = room;
        this.mineOfficials = [];
        this.spawnOfficials = [];
    }

    /**
     * Runs initialization actions.
     */
    public init(): void
    {
        // TODO
    }

    /**
     * Runs actions that need to be done.
     */
    public run(): void
    {
        _.forEach(this.mineOfficials, (mine) =>
        {
            mine.run();
        });

        _.forEach(this.spawnOfficials, (spawn) =>
        {
            spawn.run();
        });
    }

    /**
     * Creates a MineOfficial to be managed by this Unit.
     *
     * @param source Source to be managed.
     *
     * @returns The MineOfficial that was created.
     */
    public addMine(source: Source): MineOfficial
    {
        const mineOfficial = new MineOfficial(this, source);
        this.mineOfficials.push(mineOfficial);
        return mineOfficial;
    }

    /**
     * Adds a spawn to be managed by this Unit.
     *
     * @param spawn Spawn to be managed. Must be in the same room.
     */
    public addSpawn(spawn: StructureSpawn): void
    {
        this.spawnOfficials.push(new SpawnOfficial(this, spawn));
    }

    /**
     * Requests a creep to be spawned.
     *
     * @param body Body of the creep.
     * @param memory Creep's memory.
     */
    public requestCreep(body: BodyPartConstant[], memory: CreepMemory): void
    {
        // generate a (hopefully) unique name
        // FIXME: fails when two spawns try to spawn a creep at the same time
        const name = Game.time.toString();

        // try each spawn, stopping at the one that is free
        _.forEach(this.spawnOfficials,
            (spawn) => spawn.spawnCreep(body, name, memory));
    }
}
