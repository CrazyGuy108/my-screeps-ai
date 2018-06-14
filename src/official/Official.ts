import { Unit } from "Unit";

/**
 * Controls a single object or structure in a Room or the Room itself.
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

    /**
     * @name Helper Methods
     * @{
     */

    /**
     * Fires the creep at the start of the next tick. The creep will still have
     * its Goal but will have to be reassigned to another Official.
     *
     * @param creep Creep to fire.
     */
    protected fire(creep: Creep): void
    {
        creep.memory.targetId = undefined;
    }

    /**
     * Finds a structure in the given room that has a resource.
     *
     * @param room Room to find structures in.
     * @param resource Resource to be considered.
     * @param favorEmpty Whether it should consider empty (true) or full (false) structures.
     *
     * @return A suitable structure to transfer energy to.
     */
    protected findStorage(room: Room, resource: ResourceConstant,
        favorEmpty: boolean = true): Structure | undefined
    {
        // currently just picks the first spawn/extension that needs energy
        // TODO: prioritize based on other stuff like closeness/need
        let storages = room.find(FIND_STRUCTURES);
        if (resource === RESOURCE_ENERGY)
        {
            // make sure it's an EnergyStorage
            // FIXME: only considers spawns/extensions which have the energy and
            //  energyCapacity properties
            type EnergyStorage = StructureSpawn | StructureExtension;
            const energyStorages = storages.filter(
                (s: Structure) =>
                s.structureType === STRUCTURE_SPAWN ||
                    s.structureType === STRUCTURE_EXTENSION) as EnergyStorage[];

            // find the best EnergyStorage
            const f = (s: EnergyStorage) => s.energy;
            if (favorEmpty)
            {
                return _.min(energyStorages, f);
            }
            else
            {
                return _.max(energyStorages, f);
            }
        }
        else
        {
            // TODO
            return storages[0];
        }
    }

    /** @} */
}
