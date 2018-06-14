import { Goal } from "goal/Goal";

/** Things that can be built or maintained. */
export type BuildTarget = Structure | ConstructionSite;

/**
 * Maintains/builds a structure or upgrades a room controller using energy.
 */
export class BuildGoal extends Goal
{
    /** Identification name. */
    public static readonly id = "build";
    /** Structure to maintain. */
    private readonly target: BuildTarget;
    /** Creep method to be used on the structure. */
    private readonly method: string;

    /**
     * Creates a BuildGoal.
     *
     * @param target Structure to maintain.
     */
    constructor(target: BuildTarget)
    {
        super(
        {
            id: BuildGoal.id,
            isDone: false,
            options: { targetId: target.id }
        });

        this.target = target;

        // determine which creep method to use
        if (target.structureType === STRUCTURE_CONTROLLER)
        {
            this.method = "upgradeController";
        }
        else if ((target as ConstructionSite).progressTotal)
        {
            // only ConstructionSites (and controllers) have a progressTotal
            //  property
            this.method = "build";
        }
        else
        {
            this.method = "repair";
        }
    }

    public run(creep: Creep): void
    {
        const error: number = (creep as any)[this.method](this.target);
        if (error === OK)
        {
            // successful
            // after calculating the amount of energy consumed by the action, we
            //  can accurately determine if the creep has just exhausted all of
            //  its energy, which isn't reflected until the next tick
            // TODO: take boosts into account as well
            if (creep.carry[RESOURCE_ENERGY] <=
                creep.getActiveBodyparts(WORK) * UPGRADE_CONTROLLER_POWER)
            {
                creep.done();
            }
            else if (this.method === "repair" &&
                (this.target as Structure).hits >=
                    (this.target as Structure).hitsMax)
            {
                // trying to repair a structure that is already repaired
                creep.done();
            }
        }
        else if (error === ERR_NOT_ENOUGH_RESOURCES)
        {
            // the creep is now empty so we're done here
            creep.done();
        }
        else if (error === ERR_NOT_IN_RANGE)
        {
            // still need to move towards the structure
            creep.moveTo(this.target);
        }
    }
}
