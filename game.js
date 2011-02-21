argunpx.game = function() {
    var display;
    var firstTime = true;
    var you = {x:0, y:0};

    function requestAnimationFrame(callback) {
        if (window.webkitRequestAnimationFrame)
            window.webkitRequestAnimationFrame(callback);
        else
            setTimeout(loop, 30);
    }

    function drawScreen() {
        display.dungeon.clear(display.dungeon.tile.floor1);
        display.dungeon.draw(display.dungeon.tile.you, you.x, you.y);
        display.dungeon.draw(display.dungeon.tile.potion_first, 2, 4);
        display.stat.update();
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

    function defaultInput(e) {
        var move = translateToMovement(e);
        if (move) {
            you.x += move.x;
            you.y += move.y;
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
        display = new argunpx.display.Display(container, loader.tileSheet, argunpx.width, argunpx.height);

        requestAnimationFrame(loop);
    };

    return {
        start: start,
    };
}();
