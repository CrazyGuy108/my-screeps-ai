import { Goal } from "goal/Goal";

/** Object types that can have resources withdrawn from them. */
export type WithdrawTarget = Structure;

/**
 * Withdraws a resource from a structure.
 */
export class WithdrawGoal extends Goal
{
    /** Identification name. */
    public static readonly id = "withdraw";
    /** Structure to transfer resources to. */
    private readonly target: WithdrawTarget;

    /**
     * Creates a WithdrawGoal.
     *
     * @param target Object to withdraw the resource from.
     * @param resourceType Type of resource to withdraw.
     * @param amount Amount of resources to withdraw, or all available if
     * undefined.
     */
    constructor(target: WithdrawTarget, resourceType: ResourceConstant,
        amount?: number)
    {
        super(
        {
            id: WithdrawGoal.id,
            isDone: false,
            options:
            {
                targetId: target.id,
                resourceType: resourceType,
                amount: amount
            }
        });

        this.target = target;
    }

    public run(creep: Creep): void
    {
        const error = creep.withdraw(this.target, this.resourceType,
                this.amount);
        if (error === OK)
        {
            // successfully transfered!
            creep.done();
        }
        else if (error === ERR_NOT_IN_RANGE)
        {
            // still need to move towards the target
            creep.moveTo(this.target);
        }
    }

    /**
     * Private getter for resource type.
     */
    private get resourceType(): ResourceConstant
    {
        return this.options.resourceType as ResourceConstant;
    }

    /**
     * Private getter for resource amount.
     */
    private get amount(): number | undefined
    {
        return this.options.amount;
    }
}
