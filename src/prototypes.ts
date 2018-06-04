import { Goal } from "goal/Goal";
import { createGoal, Goals } from "goal/Goals";

/**
 * Extend Creep interface for this file only.
 */
interface Creep
{
    /** Home room reference. */
    _home?: Room,
    /** Reference to current Goal. */
    _goal?: Goal
}

Object.defineProperties(Creep.prototype,
{
    home:
    {
        get(): Room
        {
            if (!this._home)
            {
                // unpack home from memory
                const home = Game.rooms[this.memory.home];
                if (!home)
                {
                    // creep's previous home lost visibility!
                    // reassign to current room
                    this._home = this.room;
                    this.memory.home = this.room.name;
                }
                else
                {
                    this._home = home;
                }
            }
            return this._home;
        },
        set(home: Room): void
        {
            // assign property and memory
            this._home = home;
            this.memory.home = home.name;
        }
    },
    goal:
    {
        get(): Goal
        {
            if (!this._goal)
            {
                // unpack goal from memory
                this._goal = createGoal(this.memory.goal);
            }
            return this._goal;
        },
        set(goal: Goal): void
        {
            // assign the goal field and its memory
            this._goal = goal;
            this.memory.goal = goal.getMemory();
        }
    },
    isDone:
    {
        get(): boolean
        {
            return this.memory.goal.isDone;
        }
    }
});

Creep.prototype.run = function(): void
{
    // delegate to Goal's run method
    this.goal.run(this);
}

Creep.prototype.done = function(): void
{
    // update memory
    this.memory.goal.isDone = true;
}
