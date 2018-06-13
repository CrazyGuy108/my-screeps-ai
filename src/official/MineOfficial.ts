import { Goals } from "goal/Goals";
import { HarvestGoal } from "goal/HarvestGoal";
import { Official } from "official/Official";
import { TransferGoal } from "goal/TransferGoal";
import { Unit } from "Unit";

/**
 * Manages a source to be mined.
 */
export class MineOfficial extends Official
{
    /** Source managed by this MineOfficial. */
    public readonly source: Source;
    /** Maximum amount of workers that this mine can have. */
    private readonly maxWorkers: number;

    /**
     * Creates a MineOfficial.
     *
     * @param unit Unit that this SpawnOfficial belongs to.
     * @param source Source managed by this MineOfficial.
     */
    constructor(unit: Unit, source: Source)
    {
        super(unit);
        this.source = source;
        this.maxWorkers = this.getOpenSquares();
    }

    public run(): void
    {
        // run all creep actions
        let creepCount = 0;
        this.creeps.forEach((creep) =>
        {
            this.creepActions(creep);

            // fire the creep if we have too many
            ++creepCount;
            if (creepCount > this.maxWorkers)
            {
                creep.memory.targetId = undefined;
            }
        });

        if (creepCount < this.maxWorkers)
        {
            // not enough creeps!
            this.unit.requestCreep([ WORK, CARRY, MOVE ], this.source);
        }
    }

    /**
     * Runs creep actions.
     *
     * @param creep Creep to run.
     */
    private creepActions(creep: Creep): void
    {
        // figure out what the creep should do if it has nothing else to do
        if (creep.isDone)
        {
            // transfer if full, else harvest
            if (_.sum(creep.carry) === creep.carryCapacity)
            {
                // creep has energy to store somewhere back home
                // find a suitable storage and set a Goal to transfer to it
                const storage = this.findStorage(creep.home, RESOURCE_ENERGY);
                if (storage)
                {
                    creep.goal = Goals.Transfer(storage, RESOURCE_ENERGY);
                }
                else
                {
                    // TODO: no structures at home so find somewhere else
                    creep.goal = Goals.Null();
                }
            }
            else
            {
                // creep must be empty and needs to fill up with some energy
                // if the creep was just spawned and doesn't have anything to do
                //  yet, this will be the first thing it does
                creep.goal = Goals.Harvest(this.source);
            }
        }

        // do assigned creep actions
        creep.run();
    }

    /**
     * Finds the amount of walkable tiles around the source.
     */
    private getOpenSquares(): number
    {
        // look at all adjacent tiles
        const sourcePos = this.source.pos;
        let count = 0;
        for (let x = -1; x < 2; ++x)
        {
            for (let y = -1; y < 2; ++y)
            {
                if ((x || y) && Game.map.getTerrainAt(sourcePos.x + x,
                        sourcePos.y + y, sourcePos.roomName) !== "wall")
                {
                    ++count;
                }
            }
        }
        return count;
    }
}
