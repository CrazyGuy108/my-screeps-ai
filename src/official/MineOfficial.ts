import { Official } from "official/Official";
import { Unit } from "Unit";

/**
 * Manages a source to be mined.
 */
export class MineOfficial extends Official
{
    /** Source managed by this MineOfficial. */
    public readonly source: Source;
    /** Maximum amount of workers that this mine can have. */
    private readonly maxWorkers: number;

    /**
     * Creates a MineOfficial.
     *
     * @param unit Unit that this SpawnOfficial belongs to.
     * @param source Source managed by this MineOfficial.
     */
    constructor(unit: Unit, source: Source)
    {
        super(unit);
        this.source = source;
        this.maxWorkers = 1;
    }

    public run(): void
    {
        // run all creep actions
        let creepCount = 0;
        _.forEach(this.creeps, (creep) =>
        {
            this.creepActions(creep);

            // fire the creep if we have too many
            ++creepCount;
            if (creepCount > this.maxWorkers)
            {
                creep.memory.targetId = null;
            }
        });

        // request a new creep if we don't have enough
        if (creepCount < this.maxWorkers)
        {
            this.unit.requestCreep([ WORK, CARRY, MOVE ], this.source);
        }
    }

    /**
     * Runs creep actions.
     *
     * @param creep Creep to run.
     */
    private creepActions(creep: Creep): void
    {
        // mine the creep's assigned source
        if (_.sum(creep.carry) < creep.carryCapacity)
        {
            if (creep.harvest(this.source) === ERR_NOT_IN_RANGE)
            {
                creep.moveTo(this.source);
            }
        }
        else
        {
            // find something to do with the harvested energy
            // for now: deliver to spawn/extensions
            // find the first storage area back home
            const storages = creep.home.find(FIND_MY_STRUCTURES,
            {
                filter: ((s: StructureExtension | StructureSpawn) =>
                    (s.structureType === STRUCTURE_EXTENSION ||
                        s.structureType === STRUCTURE_SPAWN) &&
                    s.energy < s.energyCapacity) as (s: any) => boolean
            });

            // if one exists, go to it and transfer energy
            if (storages[0] && creep.transfer(storages[0], RESOURCE_ENERGY) ===
                    ERR_NOT_IN_RANGE)
            {
                creep.moveTo(storages[0]);
            }
        }
    }
}
