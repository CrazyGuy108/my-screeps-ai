import { BaseOfficial } from "official/BaseOfficial";
import { ControllerOfficial } from "official/ControllerOfficial";
import { MineOfficial } from "official/MineOfficial";
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
    /** BaseOfficial controlled by this Unit. */
    public readonly base: BaseOfficial;
    /** ControllerOfficial controlled by this Unit. */
    private controller?: ControllerOfficial;
    /** MineOfficials controlled by this Unit. */
    private readonly mines: MineOfficial[];

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
        this.base = new BaseOfficial(this);
        this.mines = [];
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
        if (this.controller)
        {
            this.controller.run();
        }

        this.mines.forEach((mine) =>
        {
            mine.run();
        });

        this.base.run();
    }

    /**
     * Sets the Unit's controller.
     *
     * @param controller Controller to be managed.
     *
     * @returns The ControllerOfficial that was created.
     */
    public setController(controller: StructureController): ControllerOfficial
    {
        this.controller = new ControllerOfficial(this, controller);
        return this.controller;
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
        const mine = new MineOfficial(this, source);
        this.mines.push(mine);
        return mine;
    }

    /**
     * Adds a spawn to be managed by this Unit.
     *
     * @param spawn Spawn to be managed. Must be in the same room.
     */
    public addSpawn(spawn: StructureSpawn): void
    {
        this.base.addSpawn(spawn);
    }

    /**
     * Requests a creep to be spawned.
     *
     * @param body Body of the creep.
     * @param target Target object. Used to identify the Official it belongs to.
     */
    public requestCreep(body: BodyPartConstant[], target?: RoomObject): void
    {
        // delegate to the Unit's base
        this.base.requestCreep(body, target);
    }
}
