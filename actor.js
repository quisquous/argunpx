// Copyright (c) 2011 Google, Inc. All rights reserved.
// Use of this source code is governed by the Nethack General Public License.

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
