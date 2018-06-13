import { Official } from "official/Official";
import { Unit } from "Unit";

/**
 * Makes all the high-level decisions of the AI as a Whole and facilitates
 * communication between each Unit.
 */
export class Whole
{
    /** Contains each Unit, each of which controls a single room. */
    private units: { [roomName: string]: Unit };
    /** Officials tied to a target RoomObject. */
    private officials: { [targetId: string]: Official };

    /**
     * Creates a Whole.
     */
    constructor()
    {
        this.units = {};
        this.officials = {};
    }

    /**
     * Runs initialization actions.
     */
    public init(): void
    {
        // find all visible rooms
        _.forOwn(Game.rooms, (room, roomName) =>
        {
            // create a Unit to manage that room
            const unit = new Unit(this, room);
            this.units[roomName as string] = unit;

            // add in the room controller
            if (room.controller)
            {
                this.officials[room.controller.id] =
                    unit.setController(room.controller);
            }

            // find all sources in that room
            room.find(FIND_SOURCES).forEach((source) =>
            {
                // for now, avoid sources that are currently guarded
                if (!source.pos.findInRange(FIND_HOSTILE_CREEPS, 1).length)
                {
                    // create a MineOfficial to manage that source
                    this.officials[source.id] = unit.addMine(source);
                }
            });
        });

        // find all spawns
        _.forOwn(Game.spawns, (spawn) =>
        {
            // assign the Unit's base to that spawn
            this.units[spawn.room.name].addSpawn(spawn);
        });

        // find all creeps
        _.forOwn(Game.creeps, (creep) =>
        {
            // connect that creep to its Official using its target id
            if (creep.memory.targetId &&
                this.officials.hasOwnProperty(creep.memory.targetId))
            {
                this.officials[creep.memory.targetId].addCreep(creep);
            }
            else
            {
                // creep is unemployed!
                // TODO
            }
        });

        // finally, run each Unit's initialization actions
        _.forOwn(this.units, (unit) =>
        {
            unit.init();
        });
    }

    /**
     * Runs actions for all Units.
     */
    public run(): void
    {
        // run Unit actions
        _.forOwn(this.units, (unit) =>
        {
            unit.run();
        });
    }
}
