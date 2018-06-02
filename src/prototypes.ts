Object.defineProperty(Creep.prototype, "home",
{
    get()
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
    set(home: Room)
    {
        // assign property and memory
        this._home = home;
        this.memory.home = home.name;
    }
});
