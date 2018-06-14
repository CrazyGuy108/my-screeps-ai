import { Goal } from "goal/Goal";

/** Object types that can have resources transfered to them. */
export type TransferTarget = Creep | Structure;

/**
 * Transfers a resource to a structure.
 */
export class TransferGoal extends Goal
{
    /** Identification name. */
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
        switch (error)
        {
            case OK: // transfered successfully
            case ERR_NOT_OWNER: // sanity checks
            case ERR_NOT_ENOUGH_RESOURCES:
            case ERR_INVALID_TARGET:
            case ERR_FULL:
            case ERR_INVALID_ARGS:
                creep.done();
                break;
            case ERR_NOT_IN_RANGE: // still need to move towards target
                creep.moveTo(this.target);
                break;
            case ERR_BUSY: // keep trying until the creep is spawned
                break;
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
