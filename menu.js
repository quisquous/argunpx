argunpx.menu = function() {
    var startMenu = function(display, input, postMenu) {
        display.clearScreen();
        display.text("Argun (PX), Copyright 2005-20XX", 1, 1, "white", "black");
        display.text("By Adrienne Walker", 13, 2, "white", "black");
        display.text("See license for details", 13, 3, "white", "black");
        // [enne] It's not like this makes a difference in Nethack.
        display.formatText("Shall I pick a character's race, role, gender, and alignment for you? [ynq]", 1, 5, "white", "black");

        var errCount = 0;
        var inputFunc = function(e) {
            var k = e.chr.toLowerCase();
            if (k == 'y' || errCount > 5) {
                if (postMenu)
                    return postMenu();
                else
                    return undefined;
            } else if (k == 'q' || k == 'n' || e.spc == "escape") {
                display.text("*** INTERNAL ERROR: unhandled key code", 3, 8 + errCount++, "red", "black");
                return inputFunc;
            } else {
                return inputFunc;
            }
        }

        return inputFunc;
    }

    var introScreen = function(display, input, postMenu) {
        display.clearScreen();
       
        display.formatText(
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
            "of us all:  Go bravely with Odin!", 1, 1, "white", "black");

        return input.more(postMenu);
    }
     
    return {
        startMenu: startMenu,
        introScreen: introScreen,
    };
}();
