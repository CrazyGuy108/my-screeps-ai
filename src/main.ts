import * as Profiler from "screeps-profiler";
import { Whole } from "Whole";

// main point of execution
function main(): void
{
    const whole = new Whole();

    // initialize everything
    whole.init();

    // run all Unit actions
    whole.run();

    // automatically delete memory of missing creeps
    _.forOwn(Memory.creeps, (mem, name) =>
    {
        if (name && !Game.creeps.hasOwnProperty(name as string))
        {
            delete Memory.creeps[name];
        }
    });
}

Profiler.enable();

export function loop(): void
{
    Profiler.wrap(main);
}
