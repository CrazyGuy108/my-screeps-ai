import Official from "official/Official";
import Unit from "Unit";

/**
 * Controls a spawn in a Unit to handle storage and spawning actions.
 */
export default class SpawnOfficial extends Official
{
    /** Spawn managed by this SpawnOfficial. */
    public readonly spawn: StructureSpawn;

    /**
     * Creates a SpawnOfficial.
     *
     * @param unit Unit that this SpawnOfficial belongs to.
     * @param spawn Spawn managed by this SpawnOfficial.
     */
    constructor(unit: Unit, spawn: StructureSpawn)
    {
        super(unit);
        this.spawn = spawn;
    }

    public run(): void
    {
    }

    /**
     * Requests a creep to be spawned if not currently busy.
     *
     * @param body Body of the creep.
     * @param name Name of the creep.
     * @param memory Creep's memory.
     *
     * @returns True if not able to spawn, false otherwise.
     */
    public spawnCreep(body: BodyPartConstant[], name: string,
        memory: CreepMemory): boolean
    {
        return this.spawn.spawnCreep(body, name, { memory: memory }) !== OK;
    }
}
