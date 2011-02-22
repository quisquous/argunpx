var argunpx = function() {
    function log(str) {
        console.log(str);
    }

    function abort(str) {
        log(str);
    }

    var canvasWidth = 50;
    var canvasHeight = 28;
    var statHeight = 2;
    var messageHeight = 5;

    return {
        abort: abort,
        log: log,

        canvasWidth: canvasWidth,
        canvasHeight: canvasHeight,

        statWidth: canvasWidth,
        statHeight: statHeight,

        messageWidth: canvasWidth,
        messageHeight: messageHeight,

        dungeonWidth: canvasWidth,
        dungeonHeight: canvasHeight - statHeight - messageHeight,
    };
}();
