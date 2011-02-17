argunpx.display = function() {
    var tileWidth = 16;
    var tileHeight = 16;
    var sheetWidth = 40;

    function tileidx(x, y) {
        return x + y * sheetWidth;
    }

    var tile = {
        unseen: tileidx(29, 20),
        floor1: tileidx(8, 21),
        floor2: tileidx(9, 21),
        floor3: tileidx(10, 21),
        door_empty: tileidx(1, 21),
        stairs_down: tileidx(12, 21),
        stairs_up: tileidx(11, 21),
        portal: tileidx(6, 22),

        wall_dngn: tileidx(30, 20),
        wall_mine: tileidx(13, 25),
        wall_hell: tileidx(24, 25),
        wall_sokoban: tileidx(35, 25),
        wall_astral: tileidx(6, 26),

        you: tileidx(31, 9),

        // items
        item_unknown: tileidx(7, 25),
        potion_first: tileidx(24, 16),
        potion_last: tileidx(8, 17),
        potion_water: tileidx(9, 17),
        scroll_first: tileidx(10, 17),
        scroll_last: tileidx(34, 17),
        scroll_mail: tileidx(35, 17),
        scroll_blank: tileidx(36, 17),
        wand_first: tileidx(39, 18),
        wand_last: tileidx(25, 19),
        rock_one: tileidx(0, 29),

        scum: tileidx(11, 5),
        corpse: tileidx(36, 15),

        tomb: tileidx(16, 21),
        tomb_a: tileidx(0, 28),
        tomb_0: tileidx(26, 28),

        // monsters
        mon_gnome: tileidx(6, 4),
        mon_pudding: tileidx(10, 5),
    };

    var Painter = function(canvas, image, width, height) {
        canvas.width = width * tileHeight;
        canvas.height = height * tileWidth;

        var context = canvas.getContext("2d");
        context.textBaseline = "top";
        context.textAlign = "left";
        // Note: text may not appear until font has been loaded.
        // See: https://bugs.webkit.org/show_bug.cgi?id=33998
        context.font = "16px kongtext";

        this.draw = function(idx, x, y) {
            var sx = (idx % sheetWidth) * tileWidth;
            var sy = Math.floor(idx / sheetWidth) * tileHeight;
            var ex = x * tileWidth;
            var ey = y * tileHeight;
            context.drawImage(image, sx, sy, tileWidth, tileHeight,
                ex, ey, tileWidth, tileHeight);
        }

        this.clear = function(idx) {
            for (var x = 0; x < width; ++x) {
                for (var y = 0; y < height; ++y) {
                    this.draw(idx, x, y);
                }
            }
        }

        this.fill = function(fillColor, x, y, w, h) {
            context.fillStyle = fillColor; 
            context.fillRect(x * tileWidth, y * tileHeight,
                w * tileWidth, h * tileHeight);
        }

        this.text = function(str, x, y, fgcolor, bgcolor) {
            var len = str.length;
            if (bgcolor)
                this.fill(bgcolor, x, y, len, 1);
            context.fillStyle = fgcolor;
            var px = x * tileWidth;
            var py = y * tileHeight;
            // Write the string one char at a time to force monospacing.
            for (var i = 0; i < len; ++i) {
                context.fillText(str.charAt(i), px, py);
                px += tileWidth;
            }
        }

        this.formatText = function(str, startx, starty, fgcolor, bgcolor) {
            var len = str.length;
            var idx = 0;
            var x = startx;
            var y = starty;
            var space = undefined;
            while (y < height && idx < len) {
                var c = str.charAt(idx++);
                if (c == '\n') {
                    x = startx;
                    y++;
                    space = undefined;
                } else {
                    this.text(c, x, y, fgcolor, bgcolor);
                    x++;
                }

                if (str.charAt(idx) == ' ')
                    space = idx;

                if (x >= width - 1) {
                    if (space) {
                        this.fill(bgcolor, x - idx + space , y, width, 1);
                        idx = space + 1;
                        space = undefined;
                    }
                    x = startx;
                    y++;

                    while (idx < len && str.charAt(idx) == ' ')
                        idx++;
                }
            }
        }

        this.clearScreen = function() {
            this.fill("black", 0, 0, width, height);
        }
    }

    return {
        Painter : Painter,
        tile : tile,
    }
}();

