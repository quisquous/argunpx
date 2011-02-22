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

    // A tile-based interface to a canvas for drawing text, tiles, and colors.
    var Painter = function(canvas, image) {
        var context = canvas.getContext("2d");
        context.textBaseline = "top";
        context.textAlign = "left";
        // Note: text may not appear until font has been loaded.
        // See: https://bugs.webkit.org/show_bug.cgi?id=33998
        context.font = "16px kongtext";

        this.drawTile = function(idx, x, y) {
            var sx = (idx % sheetWidth) * tileWidth;
            var sy = Math.floor(idx / sheetWidth) * tileHeight;
            var ex = x * tileWidth;
            var ey = y * tileHeight;
            context.drawImage(image, sx, sy, tileWidth, tileHeight,
                ex, ey, tileWidth, tileHeight);
        }

        this.fillColor = function(fillColor, x, y, w, h) {
            context.fillStyle = fillColor; 
            context.fillRect(x * tileWidth, y * tileHeight,
                w * tileWidth, h * tileHeight);
        }

        this.drawText = function(str, x, y, fgcolor, bgcolor) {
            var len = str.length;
            if (bgcolor)
                this.fillColor(bgcolor, x, y, len, 1);
            context.fillStyle = fgcolor;
            var px = x * tileWidth;
            var py = y * tileHeight;
            // Write the string one char at a time to force monospacing.
            for (var i = 0; i < len; ++i) {
                context.fillText(str.charAt(i), px, py);
                px += tileWidth;
            }
        }

        this.clearTransparent = function() {
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    var TextArea = function(painter, x1, y1, x2, y2) {
        this.fgcolor = "white";
        this.bgcolor = "black";

        var width = x2 - x1;
        var height = y2 - y1;

        console.log("TextArea: " + [width, height]);

        this.width = function() { return width; }
        this.height = function() { return height; }

        function inBounds(x, y) {
            return x >= x1 && x <= x2 && y >= y1 && y <= y2;
        }

        this.clear = function() {
            painter.fillColor(this.bgcolor, x1, y1, x2 - x1, y2 - y1);
        }

        this.text = function(str, x, y) {
            var worldX = x + x1;
            var worldY = y + y1;
            if (!inBounds(worldX, worldY))
                return;
            painter.drawText(str, worldX, worldY, this.fgcolor, this.bgcolor);
        }

        this.formatText = function(str, startX, startY, endX, endY) {
            var len = str.length;
            var idx = 0;
            var x = startX;
            var y = startY;
             
            var space = undefined;
            while (y < height && idx < len) {
                var c = str.charAt(idx++);
                if (c == '\n') {
                    x = startX;
                    y++;
                    space = undefined;
                } else {
                    this.text(c, x, y);
                    x++;
                }

                if (str.charAt(idx) == ' ')
                    space = idx;

                if (x >= width - 1) {
                    if (space) {
                        var lastWord = x - idx + space;
                        var end = x2 - lastWord;
                        if (inBounds(x1 + lastWord, y1 + y))
                            painter.fillColor(this.bgcolor, x1 + lastWord, y1 + y, end, 1);
                        idx = space + 1;
                        space = undefined;
                    }
                    x = startX;
                    y++;

                    while (idx < len && str.charAt(idx) == ' ')
                        idx++;
                }
            }
        }
    }

    var MessageArea = function(textArea) {
        textArea.clear();

        var messages = [];

        this.add = function(str) {
            textArea.clear();
            messages.push(str);
            if (messages.length > textArea.height())
                messages.shift();
            for (var i = 0; i < messages.length; ++i)
                textArea.formatText(messages[i], 0, i);
        }
    }

    var StatArea = function(textArea) {
        textArea.clear();

        this.update = function() {
            textArea.clear();
            textArea.formatText("I am a stat area", 0, 0);
        }
    }

    var DungeonArea = function(painter, x1, y1, x2, y2) {
        this.tile = tile;

        var width = x2 - x1;
        var height = y2 - y1;

        this.width = function() { return width; }
        this.height = function() { return height; }

        this.clear = function(idx) {
            for (var x = 0; x < width; ++x) {
                for (var y = 0; y < height; ++y) {
                    this.draw(idx, x, y);  
                }
            }
        }

        function inBounds(x, y) {
            return x >= x1 && x <= x2 && y >= y1 && y <= y2;
        }

        this.draw = function(idx, x, y) {
            var worldX = x + x1;
            var worldY = y + y1;
            if (!inBounds(worldX, worldY))
                return;
            painter.drawTile(idx, worldX, worldY);
        }
    }

    var Display = function(container, image, width, messageHeight, dungeonHeight, statHeight) {
        var height = messageHeight + dungeonHeight + statHeight;

        this.width = width;
        this.height = height;

        var canvasWidth = width * tileWidth;
        var canvasHeight = height * tileHeight;

        container.width = canvasWidth;
        container.height = canvasHeight;

        var dungeonCanvas = document.createElement("canvas");
        dungeonCanvas.width = canvasWidth;
        dungeonCanvas.height = canvasHeight;
        dungeonCanvas.style.position = "absolute";
        dungeonCanvas.style.zIndex = "0";
        container.appendChild(dungeonCanvas);

        var menuCanvas = document.createElement("canvas");
        menuCanvas.width = canvasWidth;
        menuCanvas.height = canvasHeight;
        menuCanvas.style.position = "absolute";
        menuCanvas.style.zIndex = "1";
        container.appendChild(menuCanvas);

        var dungeonPainter = new Painter(dungeonCanvas, image);
        this.menuPainter = new Painter(menuCanvas, image);

        this.message = new MessageArea(new TextArea(dungeonPainter, 0, 0, width, messageHeight));
        this.dungeon = new DungeonArea(dungeonPainter, 0, messageHeight, width, messageHeight + dungeonHeight);
        this.stat = new StatArea(new TextArea(dungeonPainter, 0, height - statHeight, width, height));
    }

    return {
        Display: Display,
        TextArea: TextArea,
        tile: tile,
    }
}();

