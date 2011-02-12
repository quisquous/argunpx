argunpx.game = function() {
    var paint;

    function requestAnimationFrame(callback) {
        if (window.webkitRequestAnimationFrame)
            window.webkitRequestAnimationFrame(callback);
        else
            setTimeout(loop, 30);
    }

    function loop() {
        requestAnimationFrame(loop);

        paint.text("foobar", 5, 5);
    }

    var start = function(canvas, loader) {
        paint = new argunpx.display.Painter(canvas, loader.tileSheet, argunpx.width, argunpx.height);

        paint.clear(argunpx.display.tile.floor1);
        paint.draw(argunpx.display.tile.you, 0, 0);
        paint.draw(argunpx.display.tile.potion_first, 2, 4);

        requestAnimationFrame(loop);
    };

    return {
        start: start,
    };
}();
