import { Goal } from "goal/Goal";

/** Object types that can be harvested. */
export type HarvestTarget = Source | Mineral;

/**
 * Harvests a resource until the creep is full.
 */
export class HarvestGoal extends Goal
{
    /** Identification name. */
    public static readonly id = "harvest";
    /** Resource to harvest. */
    private readonly target: HarvestTarget;

    /**
     * Creates a HarvestGoal.
     *
     * @param target Object to harvest.
     */
    constructor(target: HarvestTarget)
    {
        super(
        {
            id: HarvestGoal.id,
            isDone: false,
            options: { targetId: target.id }
        });

        this.target = target;
    }

    public run(creep: Creep): void
    {
        // try to harvest the resource
        const error = creep.harvest(this.target);
        if (error === OK)
        {
            if (_.sum(creep.carry) >= creep.carryCapacity)
            {
                // the creep is full so we're done here
                creep.done();
            }
        }
        else if (error === ERR_NOT_IN_RANGE)
        {
            // still need to move towards the resource
            creep.moveTo(this.target);
        }
    }
}
