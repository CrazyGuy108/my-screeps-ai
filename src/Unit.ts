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
    /** SpawnOfficial controlled by this Unit. */
    private readonly spawnOfficial: SpawnOfficial;

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
        this.spawnOfficial = new SpawnOfficial(this);
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
        this.mineOfficials.forEach((mine) =>
        {
            mine.run();
        });

        this.spawnOfficial.run();
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
        this.spawnOfficial.addSpawn(spawn);
    }

    /**
     * Requests a creep to be spawned.
     *
     * @param body Body of the creep.
     * @param target Target object. Used to identify the Official it belongs to.
     */
    public requestCreep(body: BodyPartConstant[], target: RoomObject | null):
        void
    {
        // delegate to the Unit's SpawnOfficial
        this.spawnOfficial.requestCreep(body, target);
    }
}
