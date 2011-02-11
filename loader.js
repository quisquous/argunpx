argunpx.loader = function() {
    var tileSheetSrc = "nhtiles.png";
    var tileSheet = new Image();
    var loaded = false;

    function loadTileSheet(callback) {
        tileSheet.onload = callback;
        tileSheet.src = tileSheetSrc;
    }

    var load = function(callback) {
        loadTileSheet(function() {
            loaded = true; 
            callback();
        });
    }

    return {
        load: load,
        tileSheet: tileSheet,
        loaded: loaded,
    };
}();
