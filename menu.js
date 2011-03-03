// Copyright (c) 2011 Google, Inc. All rights reserved.
// Use of this source code is governed by the Nethack General Public License.

argunpx.menu = function() {
    function Menu(display, input) {
        this.painter = display.menuPainter;
        this.done = false;
        this.nextMenu = undefined;
        this.postFunc = undefined;

        var currentMenu = this;

        function clearMenuCanvas() {
            currentMenu.painter.clearTransparent();
        }

        this.baseInput = function(e) {
            var next = currentMenu.input(e);
            if (!currentMenu.done)
                return currentMenu.baseInput;

            if (currentMenu.postFunc)
                currentMenu.postFunc();
            
            if (currentMenu.nextMenu) {
                currentMenu.nextMenu.begin();
                return currentMenu.nextMenu.baseInput;
            }

            clearMenuCanvas();
            return undefined;
        }

        this.begin = function() {
            clearMenuCanvas();
            this.done = false;
            this.init();
            input.get(this.baseInput);
        }

        this.init = function() {}
        this.input = function(e) { return undefined; }
    }

    function FullScreenTextMenu(display, input) {
        Menu.call(this, display, input);
        this.output = new argunpx.display.TextArea(display.menuPainter, 0, 0, display.width, display.height);
        this.output.fgcolor = "white";
        this.output.bgcolor = "black";
    }

    function StartMenu(display, input) {
        FullScreenTextMenu.call(this, display, input);

        this.init = function() {
            this.output.clear();
            this.output.fgcolor = "white";
            this.output.text("Argun (PX), Copyright 2005-20XX", 1, 1);
            this.output.text("By Adrienne Walker", 13, 2);
            this.output.text("See license for details", 13, 3);
            // [enne] It's not like this makes a difference in Nethack.
            this.output.formatText("Shall I pick a character's race, role, gender, and alignment for you? [ynq]", 1, 5);
        }

        var errCount = 0;
        this.input = function(e) {
            // Note: text may not appear until font has been loaded.
            // See: https://bugs.webkit.org/show_bug.cgi?id=33998
            // TODO(enne) - do a pixel test to see if font shows up
            this.init();        

            var k = e.chr.toLowerCase();
            if (k == 'y' || errCount > 5) {
                this.done = true;
            } else if (k == 'q' || k == 'n' || e.spc == "escape") {
                this.output.fgcolor = "red";
                errCount++;
                for (var y = 0; y < errCount; ++y)
                    this.output.text("*** INTERNAL ERROR: unhandled key code", 3, 8 + y);
            }
        }
    }

    function IntroScreen(display, input) {
        FullScreenTextMenu.call(this, display, input);

        this.init = function() {
            this.output.clear();
            this.output.formatText(
                "It is written in the Book of Odin:"+
                "\n\n"+
                "After the Creation, the cruel god Moloch rebelled "+
                "against the authority of Marduk the Creator. "+
                "Moloch stole from Marduk the most powerful of all "+
                "the artifacts of the gods, the Amulet of Yendor, "+
                "and he hid it in the dark cavities of Gehennom, the "+
                "Under World, where he now lurks, and bides his time."+
                "\n\n"+
                "Your god Odin seeks to possess the Amulet, and with it "+
                "to gain deserved ascendance over the other gods."+
                "\n\n"+
                "You, a newly trained Stripling, have been heralded "+
                "from birth as the instrument of Odin.  You are destined "+
                "to recover the Amulet for your deity, or die in the "+
                "attempt.  Your hour of destiny has come.  For the sake "+
                "of us all:  Go bravely with Odin!", 1, 1);
        }

        this.input = function(e) {
            if (e.chr || e.spc == "escape")
                this.done = true;
        };
    }

    return {
        StartMenu: StartMenu,
        IntroScreen: IntroScreen,
    };
}();
