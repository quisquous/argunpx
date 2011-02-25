argunpx.actor = function() {
    function Actor() {
        this.hp = 1;
        this.x = 0;
        this.y = 0;
        this.items = [];

        this.dead = function() {
            return false;
        }

        this.tile = undefined;
    }

    function Player() {
        Actor.call(this);
        this.tile = argunpx.display.tile.you;
    }

    return {
        Actor: Actor,
        Player: Player,
    };
}();
