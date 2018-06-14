import { Goals } from "goal/Goals";
import { Official } from "official/Official";
import { Unit } from "Unit";

export class ControllerOfficial extends Official
{
    /** Controller managed by this ControllerOfficial. */
    private readonly controller: StructureController;
    /** Maximum amount of upgraders that this controller should have. */
    private readonly maxUpgraders: number;

    /**
     * Creates a ControllerOfficial.
     *
     * @param unit Unit that this ControllerOfficial belongs to.
     * @param controller Controller managed by this ControllerOfficial.
     */
    constructor(unit: Unit, controller: StructureController)
    {
        super(unit);

        this.controller = controller;
        this.maxUpgraders = 1;
    }

    public run(): void
    {
        // run all creep actions
        let creepCount = 0;
        this.creeps.forEach((creep) =>
        {
            this.creepActions(creep);

            // fire the creep if we have too many
            ++creepCount;
            if (creepCount > this.maxUpgraders)
            {
                this.fire(creep);
            }
        });

        // request a new creep if we don't have enough
        if (creepCount < this.maxUpgraders)
        {
            this.unit.requestCreep([ WORK, CARRY, MOVE ], this.controller);
        }
    }

    private creepActions(creep: Creep): void
    {
        // figure out what the creep should do if it has nothing else to do
        if (creep.isDone)
        {
            // if the creep is full with energy, go upgrade
            // else, find a structure to withdraw from
            if (_.sum(creep.carry) === creep.carryCapacity)
            {
                // creep is full of energy to use for upgrading
                creep.goal = Goals.Build(this.controller);
            }
            else
            {
                // needs to find a storage that has energy and withdraw from it
                const storage = this.findStorage(this.room, RESOURCE_ENERGY,
                    /*favorEmpty=*/false);
                if (storage)
                {
                    creep.goal = Goals.Withdraw(storage, RESOURCE_ENERGY);
                }
                else
                {
                    // TODO: find somewhere else or wait?
                    creep.goal = Goals.Null();
                }
            }
        }

        // do assigned creep actions
        creep.run();
    }
}
