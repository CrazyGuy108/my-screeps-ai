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
    private readonly method: "upgradeController" | "build" | "repair";
    /** Energy consumed per WORK part. */
    private readonly workMultiplier: number;

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
            this.workMultiplier = 1;
        }
        else if ((target as ConstructionSite).progressTotal)
        {
            // only ConstructionSites (and controllers) have a progressTotal
            //  property
            this.method = "build";
            this.workMultiplier = BUILD_POWER;
        }
        else
        {
            this.method = "repair";
            this.workMultiplier = 1;
        }
    }

    public run(creep: Creep): void
    {
        const error: ScreepsReturnCode =
            (creep as any)[this.method](this.target);
        switch (error)
        {
            case OK:
                // after calculating the amount of energy consumed by the
                //  action, we can accurately determine if the creep has just
                //  exhausted all of its energy, which isn't reflected until the
                //  next tick
                const workDone = creep.getActiveBodyparts(WORK) *
                    this.workMultiplier;
                // creep is empty or...
                if (creep.carry[RESOURCE_ENERGY] <= workDone ||
                    // ...construction site is fully built or...
                    // TODO: take boosts into account
                    (this.method === "build" &&
                        (this.target as ConstructionSite).progress +
                                workDone * BUILD_POWER >=
                            (this.target as ConstructionSite).progressTotal) ||
                    // ...structure is fully repaired
                    // TODO: take boosts into account
                    (this.method === "repair" &&
                        (this.target as Structure).hits +
                                workDone * REPAIR_POWER >=
                            (this.target as Structure).hitsMax))
                {
                    creep.done();
                }
                break;
            case ERR_NOT_OWNER: // sanity checks
            case ERR_NOT_ENOUGH_RESOURCES:
            case ERR_INVALID_TARGET:
            case ERR_NO_BODYPART:
            case ERR_RCL_NOT_ENOUGH:
                creep.done();
                break;
            case ERR_NOT_IN_RANGE: // still need to move towards target
                creep.moveTo(this.target);
                break;
            case ERR_BUSY:
                // keep trying until the creep is spawned
                break;
        }
    }
}
