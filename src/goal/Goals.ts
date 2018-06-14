import { BuildTarget, BuildGoal } from "goal/BuildGoal";
import { HarvestTarget, HarvestGoal } from "goal/HarvestGoal";
import { NullGoal } from "goal/NullGoal";
import { TransferTarget, TransferGoal } from "goal/TransferGoal";
import { WithdrawTarget, WithdrawGoal } from "goal/WithdrawGoal";

/**
 * Creates a Goal using options from memory.
 *
 * @param memory Goal memory to be used.
 *
 * @return A new or cached Goal object.
 */
export function createGoal(memory: GoalMemory): Goal
{
    // shorthand for goal options
    const options = memory.options;

    // find the goal's target object if possible
    let target;
    if (memory.options.targetId)
    {
        target = Game.getObjectById(memory.options.targetId);
    }

    // make sure the target exists first
    if (target)
    {
        switch (memory.id)
        {
            case BuildGoal.id:
                return Goals.Build(target as BuildTarget);
            case HarvestGoal.id:
                return Goals.Harvest(target as HarvestTarget);
            case TransferGoal.id:
                return Goals.Transfer(target as TransferTarget,
                    options.resourceType as ResourceConstant, options.amount);
            case WithdrawGoal.id:
                return Goals.Withdraw(target as WithdrawTarget,
                    options.resourceType as ResourceConstant, options.amount);
            default:
                console.log(`Invalid goal id "${memory.id}"!`);
                // fallthrough
            case NullGoal.id:
                return Goals.Null();
        }
    }
    else
    {
        return Goals.Null();
    }
}

/**
 * Goal factory object for convenience. Refer to the individual documentation of
 * each Goal's constructor for a description of the parameters.
 */
export const Goals =
{
    Build: (target: BuildTarget) => new BuildGoal(target),
    Harvest: (target: HarvestTarget) => new HarvestGoal(target),
    // NullGoal has no fields so it can be safely repeatedly returned
    Null: _.once(() => new NullGoal()),
    Transfer: (target: TransferTarget, resourceType: ResourceConstant,
            amount?: number) => new TransferGoal(target, resourceType, amount),
    Withdraw: (target: WithdrawTarget, resourceType: ResourceConstant,
            amount?: number) => new WithdrawGoal(target, resourceType, amount)
};
