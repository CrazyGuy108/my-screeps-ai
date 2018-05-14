// declaration to avoid circular dependencies
interface Mission
{
}

// extend creep interface
interface Creep
{
    /** Mission currently being executed. */
    mission: Mission | null,
    /** Creep's home room. Homes can lose visibility. */
    home: Room | null
}

/**
 * Defines the typed memory kept by creeps.
 */
interface CreepMemory
{
    /** Name of the home room for this creep. */
    home: string,
    /** Target object ID. Used to identify the creep's Official. */
    targetId: string | null,
}

/**
 * Defines the typed memory kept by rooms and/or Units.
 */
interface RoomMemory
{
}
