// Copyright (c) 2011 Google, Inc. All rights reserved.
// Use of this source code is governed by the Nethack General Public License.

argunpx.input = function() {

    // The current input handler.
    var inputHandler;

    function normalInput(e) {
        if (e.chr)
            console.log("KEYPRESS: " + e.chr + "," + e.keyCode + "," + String.fromCharCode(e.keyCode));
        else
            console.log("KEYDOWN: " + e.spc + "," + e.keyCode + "," + e.shiftKey);
    }
    
    var defaultInput = normalInput;
    function setDefaultInput(func) {
        defaultInput = func;
    }

    function passToInput(e) {
        if (!inputHandler)
            inputHandler = defaultInput;
        if (e)
            inputHandler = inputHandler(e);
    }

    function specialKey(e) {
        switch (e.keyCode) {
            case 8: return "backspace";
            case 9: return "tab";
            case 13: return "enter";
            case 27: return "escape";
            case 33: return "pgup";
            case 34: return "pgdown";
            case 37: return "left";
            case 38: return "up";
            case 39: return "right";
            case 40: return "down";
            case 96: return "num0";
            case 97: return "num1";
            case 98: return "num2";
            case 99: return "num3";
            case 100: return "num4";
            case 101: return "num5";
            case 102: return "num6";
            case 103: return "num7";
            case 104: return "num8";
            case 105: return "num9";
        }

        return undefined;
    }

    var keyDownListener = function(e) {
        var special = specialKey(e);
        if (!special)
            return;
        e.chr = undefined;
        e.spc = special;
        passToInput(e);
    }

    var keyPressListener = function(e) {
        if (!e.keyCode)
            return;
        // Don't duplicate input if keyDown will also receive this.
        // TODO enne - this is hacky
        if (e.keyCode < 41 && e.keyCode != 32)
            return;
        e.spc = undefined;
        e.chr = String.fromCharCode(e.keyCode)
        passToInput(e);
    }

    var get = function(handler) {
        inputHandler = handler;
    }

    return {
        keyDownListener: keyDownListener,
        keyPressListener: keyPressListener,

        // "Get" input by setting an input handling function.
        // This function receives a key and returns the next input handler.
        // If nothing returned, go back to default input handling.
        get: get,
        setDefaultInput: setDefaultInput,
    };
}();
