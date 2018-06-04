import { Goal } from "goal/Goal";

export type TransferTarget = Creep | Structure;

/**
 * Transfers a resource to a structure.
 */
export class TransferGoal extends Goal
{
    public static readonly id = "transfer";
    /** Structure to transfer resources to. */
    private readonly target: TransferTarget;

    /**
     * Creates a TransferGoal.
     *
     * @param target Object to store the resource into.
     * @param resourceType Type of resource to transfer.
     * @param amount Amount of resources to transfer, or all available if
     * undefined.
     */
    constructor(target: TransferTarget, resourceType: ResourceConstant,
        amount?: number)
    {
        super(
        {
            id: TransferGoal.id,
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
        const error = creep.transfer(this.target, this.resourceType,
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
