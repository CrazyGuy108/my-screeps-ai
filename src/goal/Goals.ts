import { HarvestTarget, HarvestGoal } from "goal/HarvestGoal";
import { NullGoal } from "goal/NullGoal";
import { TransferTarget, TransferGoal } from "goal/TransferGoal";

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

    switch (memory.id)
    {
        case HarvestGoal.id:
            return Goals.Harvest(target as HarvestTarget);
        case TransferGoal.id:
            return Goals.Transfer(target as TransferTarget,
                options.resourceType as ResourceConstant, options.amount);
        default:
            console.log(`Invalid goal id "${memory.id}"!`);
            // fallthrough
        case NullGoal.id:
            return Goals.Null();
    }
}

/**
 * Goal factory object for convenience. Refer to the individual documentation of
 * each Goal's constructor for a description of the parameters.
 */
export const Goals =
{
    Harvest: _.memoize((target: HarvestTarget) => new HarvestGoal(target)),
    Null: _.memoize(() => new NullGoal()),
    Transfer: _.memoize(
        (target: TransferTarget, resourceType: ResourceConstant,
            amount?: number) => new TransferGoal(target, resourceType, amount))
};
