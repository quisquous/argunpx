argunpx.item = function() {
    function Item() {
        this.tile = argunpx.display.tile.item_unknown;
    }

    function Potion() {
        this.tile = argunpx.display.tile.potion_first;
    }

    function Wand() {
        this.tile = argunpx.display.tile.wand_first;
    }

    return {
        Item: Item,
        Potion: Potion,
        Wand: Wand,
    };
}();
