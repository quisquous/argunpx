argunpx.game = function() {
    var display;
    var firstTime = true;
    var you = new argunpx.actor.Player();
    var dgn = new argunpx.dungeon.Dungeon();
    var level = dgn.getLevel("main", 0);

    function requestAnimationFrame(callback) {
        if (window.webkitRequestAnimationFrame)
            window.webkitRequestAnimationFrame(callback);
        else
            setTimeout(loop, 30);
    }

    function drawScreen() {
        display.stat.update();

        for (var y = 0; y < argunpx.dungeonHeight; ++y) {
            for (var x = 0; x < argunpx.dungeonWidth; ++x) {
                display.dungeon.draw(level.cellTile(x, y), x, y);
            }
        }
        display.dungeon.draw(you.tile, you.x, you.y);
    }

    function translateToMovement(e) {
        var k = e.chr;

        var translateSpecial = {
            "num1": 'b',
            "num2": 'j',
            "num3": 'n',
            "num4": 'h',
            "num6": 'l',
            "num7": 'y',
            "num8": 'k',
            "num9": 'u',
            "up": 'k',
            "down": 'j',
            "left": 'h',
            "right": 'l',
        };

        if (e.spc && translateSpecial[e.spc])
            k = translateSpecial[e.spc];

        var basicInput = {
            'y': {x: -1, y: -1},
            'u': {x: 1, y: -1},
            'h': {x: -1, y: 0},
            'j': {x: 0, y: 1},
            'k': {x: 0, y: -1},
            'l': {x: 1, y: 0},
            'b': {x: -1, y: 1},
            'n': {x: 1, y: 1},
        };
        if (k && basicInput[k])
            return basicInput[k];

        return undefined;
    }    

    var tempMessage = 0;
    function defaultInput(e) {
        var move = translateToMovement(e);
        if (move) {
            you.x += move.x;
            you.y += move.y;
        } else if (e.chr == 't') {
            display.message.add("Testing: " + tempMessage++);
        } else if (e.chr == ',') {
            var cell = level.cell(you.x, you.y);
            if (cell.items.length == 0) {
                display.message.add("There is nothing here to pick up.");
                return;
            }
           
            display.message.add("You toss everything here into your bag."); 
            you.items = cell.items;
            cell.items = [];
        }
        drawScreen();
    }

    function loop() {
        requestAnimationFrame(loop);

        if (firstTime) {
            you.x = 10;
            you.y = 10;

            argunpx.input.setDefaultInput(defaultInput);
            var start = new argunpx.menu.StartMenu(display, argunpx.input);
            var intro = new argunpx.menu.IntroScreen(display, argunpx.input);
            start.nextMenu = intro;
            intro.postFunc = function() {
                display.message.add("Welcome...");
                drawScreen();
            }
            start.begin();

            firstTime = false;
        }
    }

    var start = function(container, loader) {
        display = new argunpx.display.Display(container, loader.tileSheet, argunpx.canvasWidth, argunpx.messageHeight, argunpx.dungeonHeight, argunpx.statHeight);

        requestAnimationFrame(loop);
    };

    return {
        start: start,
    };
}();
