Object.defineProperty(Creep.prototype, "home",
{
    get()
    {
        if (!this._home)
        {
            // unpack home from memory
            const home = Game.rooms[this.memory.home];
            this._home = home ? home : null;
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
