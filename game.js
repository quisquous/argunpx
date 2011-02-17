argunpx.game = function() {
    var paint;

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
                paint.clear(argunpx.display.tile.floor1);
                paint.draw(argunpx.display.tile.you, 0, 0);
                paint.draw(argunpx.display.tile.potion_first, 2, 4);
            }

            // TODO enne - need way more syntactic sugar here
            argunpx.input.get(menu.startMenu(paint, argunpx.input, function() {
                return menu.introScreen(paint, argunpx.input, tempDrawScreen);
            }));

            firstTime = false;
        }

    }

    var start = function(canvas, loader) {
        paint = new argunpx.display.Painter(canvas, loader.tileSheet, argunpx.width, argunpx.height);

        requestAnimationFrame(loop);
    };

    return {
        start: start,
    };
}();
