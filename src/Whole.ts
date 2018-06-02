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

            // find all sources in that room
            _.forEach(room.find(FIND_SOURCES), (source) =>
            {
                // create a MineOfficial to manage that source
                this.officials[source.id] = unit.addMine(source);
            });
        });

        // find all spawns
        _.forOwn(Game.spawns, (spawn) =>
        {
            // assign the Unit's SpawnOfficial to that spawn
            // doesn't need to be added to this.officials because SpawnOfficials
            //  currently don't need to control creeps
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
