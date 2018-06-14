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
        switch (error)
        {
            case OK:
                // current energy isn't reflected until the next tick so need to
                //  calculate how much energy was harvested
                const harvested = creep.getActiveBodyparts(WORK) *
                    HARVEST_POWER;
                // creep is now full or...
                if (_.sum(creep.carry) + harvested >= creep.carryCapacity ||
                    // ...target is a Source and it's now empty
                    // TODO: take boosts into account
                    ((this.target as Source).energy &&
                        (this.target as Source).energy - harvested <= 0))
                {
                    creep.done();
                }
                break;
            case ERR_NOT_OWNER: // sanity checks
            case ERR_NOT_FOUND:
            case ERR_NOT_ENOUGH_RESOURCES:
            case ERR_INVALID_TARGET:
            case ERR_NO_BODYPART:
                creep.done();
                break;
            case ERR_NOT_IN_RANGE: // still need to move towards target
                creep.moveTo(this.target);
                break;
            case ERR_BUSY: // keep trying until creep is spawned
                break;
        }
    }
}
