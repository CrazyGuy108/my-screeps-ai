import { Unit } from "Unit";

/**
 * Controls a single object or structure in a room.
 */
export abstract class Official
{
    /** Unit that this Official belongs to. */
    public readonly unit: Unit;
    /** Creeps that this Official owns. */
    protected creeps: Creep[];

    /**
     * Creates an Official.
     *
     * @param unit Unit that this Official belongs to.
     */
    constructor(unit: Unit)
    {
        this.unit = unit;
        this.creeps = [];
    }

    /** Room that this Official operates in. */
    public get room(): Room
    {
        return this.unit.room;
    }

    /**
     * Runs Official actions.
     */
    public abstract run(): void

    /**
     * Adds a creep to be controlled by this Official.
     *
     * @param creep Creep to control.
     */
    public addCreep(creep: Creep): void
    {
        this.creeps.push(creep);
    }
}
