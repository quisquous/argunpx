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
            var tempDrawScreen = function() {
                display.message.add("Welcome...");
                display.dungeon.clear(display.dungeon.tile.floor1);
                display.dungeon.draw(display.dungeon.tile.you, 0, 0);
                display.dungeon.draw(display.dungeon.tile.potion_first, 2, 4);
                display.stat.update();
            }

            var start = new argunpx.menu.StartMenu(display, argunpx.input);
            var intro = new argunpx.menu.IntroScreen(display, argunpx.input);
            start.nextMenu = intro;
            intro.postFunc = tempDrawScreen;
            start.begin();

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
