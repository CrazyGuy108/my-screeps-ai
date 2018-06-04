import { Goal } from "goal/Goal";

/**
 * Tells the creep to sit still and do nothing. Can also be used to represent
 * invalid Goals. This Goal is always considered to be completed when assigned
 * to a creep.
 */
export class NullGoal extends Goal
{
    /** Identification name. */
    public static readonly id = "null";

    /**
     * Creates a NullGoal.
     */
    constructor()
    {
        super({ id: NullGoal.id, isDone: true, options: {} });
    }

    public run(creep: Creep): void
    {
        // the creep has achieved its goal of doing nothing
        creep.done();
    }
}
