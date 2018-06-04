// declaration to avoid circular dependencies
interface Goal
{
    run(creep: Creep): void
}

/**
 * Extend Creep interface.
 */
interface Creep
{
    /** Creep's home room. If not visible, reassigned to current room. */
    home: Room,
    /** Creep's current goal. */
    goal: Goal,
    /** True if the creep has achieved its Goal. */
    isDone: boolean,
    /** Runs goal actions. */
    run(): void,
    /** States that the Goal has been achieved. */
    done(): void
}

/**
 * Defines the typed memory kept by creeps.
 */
interface CreepMemory
{
    /** Name of the home room for this creep. */
    home: string,
    /** Target object ID. Used to identify the creep's Official. */
    targetId?: string,
    /** Memory for the creep's current Goal. */
    goal: GoalMemory
}

/**
 * Defines the typed memory kept by a creep's Goal.
 */
interface GoalMemory
{
    /** Name of the type of Goal the creep has. */
    id: string,
    /** States whether this Goal has been achieved. */
    isDone: boolean,
    /** Options for configuration. */
    options: GoalOptions
}

/**
 * Options used by Goal objects.
 */
interface GoalOptions
{
    /** Target object ID. */
    targetId?: string,

    /**
     * @name Used by TransferGoal
     * @{
     */

    /** Type of resource to transfer. */
    resourceType?: ResourceConstant,
    /** Amount of resources to transfer, or all available if undefined. */
    amount?: number

    /** @} */
}
