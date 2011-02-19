argunpx.game = function() {
    var display;

    function requestAnimationFrame(callback) {
        if (window.webkitRequestAnimationFrame)
            window.webkitRequestAnimationFrame(callback);
        else
            setTimeout(loop, 30);
    }

    var firstTime = true;

    function loop() {
        requestAnimationFrame(loop);

        if (firstTime) {
            var menu = argunpx.menu;
            var tempDrawScreen = function() {
                display.message.add("Welcome...");
                display.dungeon.clear(display.dungeon.tile.floor1);
                display.dungeon.draw(display.dungeon.tile.you, 0, 0);
                display.dungeon.draw(display.dungeon.tile.potion_first, 2, 4);
                display.stat.update();
            }

/*
            // TODO enne - need way more syntactic sugar here
            argunpx.input.get(menu.startMenu(paint, argunpx.input, function() {
                return menu.introScreen(paint, argunpx.input, tempDrawScreen);
            }));
*/

            tempDrawScreen();

            firstTime = false;
        }
    }

    var start = function(container, loader) {
        display = new argunpx.display.Display(container, loader.tileSheet, argunpx.width, argunpx.height);

        requestAnimationFrame(loop);
    };

    return {
        start: start,
    };
}();
