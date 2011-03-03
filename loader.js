// Copyright (c) 2011 Google, Inc. All rights reserved.
// Use of this source code is governed by the Nethack General Public License.

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
