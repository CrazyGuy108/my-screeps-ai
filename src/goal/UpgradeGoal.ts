import { Goal } from "goal/Goal";

/** Room controller. */
export type UpgradeTarget = StructureController;

/**
 * Upgrades a room controller using energy.
 */
export class UpgradeGoal extends Goal
{
    /** Identification name. */
    public static readonly id = "upgrade";
    /** Controller to upgrade. */
    private readonly target: UpgradeTarget;

    /**
     * Creates an UpgradeGoal.
     *
     * @param target Controller to upgrade.
     */
    constructor(target: UpgradeTarget)
    {
        super(
        {
            id: UpgradeGoal.id,
            isDone: false,
            options: { targetId: target.id }
        });

        this.target = target;
    }

    public run(creep: Creep): void
    {
        const error = creep.upgradeController(this.target);
        if (error === OK)
        {
            // upgraded successfully
            // after calculating the amount of energy consumed by the upgrade,
            //  we can accurately determine if the creep has just exhausted all
            //  of its energy, which isn't reflected until the next tick
            // TODO: take boosts into account as well
            if (creep.carry[RESOURCE_ENERGY] <=
                creep.getActiveBodyparts(WORK) * UPGRADE_CONTROLLER_POWER)
            {
                creep.done();
            }
        }
        if (error === ERR_NOT_ENOUGH_RESOURCES)
        {
            // the creep is now empty so we're done here
            creep.done();
        }
        else if (error === ERR_NOT_IN_RANGE)
        {
            // still need to move towards the controller
            creep.moveTo(this.target);
        }
    }
}
