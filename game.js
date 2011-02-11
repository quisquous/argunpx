argunpx.game = function() {
    var paint;

    var start = function(canvas, loader) {
        paint = new argunpx.display.Painter(canvas, loader.tileSheet, argunpx.width, argunpx.height);

        paint.clear(argunpx.display.tile.floor1);
        paint.draw(argunpx.display.tile.you, 0, 0);
        paint.draw(argunpx.display.tile.potion_first, 2, 4);
    };

    return {
        start: start,
    };
}();
