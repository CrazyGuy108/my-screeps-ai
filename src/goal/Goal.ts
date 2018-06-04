/**
 * Represents a goal that is assigned to a creep.
 */
export abstract class Goal
{
    /** Initial Goal memory when assigning a Goal to a creep. */
    private readonly _memory: GoalMemory;

    /**
     * Creates a Goal.
     *
     * @param memory Initial Goal memory. Must not be modified afterwards.
     */
    constructor(memory: GoalMemory)
    {
        this._memory = memory;
    }

    /**
     * Run creep actions to work towards its Goal.
     *
     * @param creep Creep to control.
     */
    public abstract run(creep: Creep): void;

    /**
     * Gets a copy of the initial Goal memory.
     *
     * @return A copy of the initial Goal memory.
     */
    public getMemory(): GoalMemory
    {
        return Object.assign({}, this._memory);
    }

    /**
     * Gets a reference to the initial Goal options.
     *
     * @return Initial Goal options.
     */
    protected get options(): GoalOptions
    {
        return this._memory.options;
    }
}
