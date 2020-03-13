import Time from 'Time';

/**
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * The Custom Console is a utility to create a on-screen console for debugging-
 * purposes. It does not draw the console on the screen, you have to do that in
 * Spark-AR yourself. The Console needs a reference to the debugging-textfield.
 * 
 * This is the documentation for a Custom Console API for Spark AR Studio.
 * To start using the API you first have to import it from FARlib.
 * You have to create the text field by yourself, its also possible to create
 * buttons like in the example below to control the console.
 * 
 * More info:
 * https://github.com/ypmits/ARrrrLib/tree/develop/src/CustomConsole/README.md
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */
export default class Console {
    constructor(textfield, options) {
        //#region Settings
        var collapse = (options != null && options.collapse != null)?options.collapse:false;
        var maxLines = (options != null && options.maxLines != null)?options.maxLines:5;
        var keepLog = (options != null && options.keepLog != null)?options.keepLog:false;
        //#endregion

        //#region Fields
        var startAt = 0;
        var scrollStartAt;
        var lines = [];
        textfield.text = "";

        var autoRefreshInterval;
        //#endregion

        //#region Public Methods
        this.log = function(string) {
            switch(typeof string) {
                case "number":
                case "string":
                case "boolean":
                    if(collapse) {
                        for(var i = 0; i < lines.length; i++) {
                            if(lines[i].type == "logObject") {
                                if(lines[i].string == string) {
                                    lines[i].addCount();
                                    refreshConsole();
                                    return;
                                }
                            }
                        }
                    }
                    var log = new logObject(string);
                    lines.push(log);
                    refreshConsole();
                break;
             case "object":
                    var log = new logObject("[object]");
                    lines.push(log);
                    refreshConsole();
                break;
                case "function":
                    try {
                        string.pinLastValue();
                        var log = new logObject(string.pinLastValue());
                        lines.push(log);
                        refreshConsole();
                    } catch(err) {
                        var log = new logObject("[function]");
                        lines.push(log);
                        refreshConsole();
                    }
                break;
                case "undefined":
                    var log = new logObject("[undefined]");
                    lines.push(log);
                    refreshConsole();
                break;
                default:
                    var log = new logObject("[type not found]");
                    lines.push(log);
                    refreshConsole();
                break;
            }
        }

        this.watch = function(name, signal) {
            if(typeof signal == "function") {
                try {
                    signal.pinLastValue();
                    var log = new signalObject(name,signal);
                    lines.push(log);

                    refreshConsole();

                    if(autoRefreshInterval == null) {
                        autoRefreshInterval = Time.setInterval(()=>{refreshConsole()},100);
                    }
                } catch(err) {
                    var log = new logObject(name + ": [not a signal]");
                    lines.push(log);
                    refreshConsole();
                }
                
            } else {
                var log = new logObject(name + ": [not a signal]");
                lines.push(log);
                refreshConsole();
            }
        }

        this.clear = function() {
            scrollStartAt = null;
            textfield.text = "";
            lines = [];
            startAt = 0;
        }

        this.scrollToTop = function() {
            scrollStartAt = 0;
        }

        this.scrollUp = function() {
            if(scrollStartAt != null) {
                scrollStartAt--;
            } else {
                scrollStartAt = lines.length-maxLines-1;
            }
            if(scrollStartAt < 0) scrollStartAt = 0;
        }
        
        this.scrollDown = function() {
            if(scrollStartAt != null) {
                scrollStartAt++;
            } else {
                scrollStartAt = lines.length-maxLines+1;
            }
            if(scrollStartAt > lines.length-maxLines) {
                scrollStartAt = null;
            }
        }
        
        this.scrollToBottom = function() {
            scrollStartAt = null;
        }
        //#endregion

        // #region Private Methods
        var refreshConsole = function() {
            if(!keepLog) {
                while(lines.length > maxLines) {
                    lines.shift();
                }
            } else {
                if(lines.length < maxLines) {
                    startAt = 0;
                } else {
                    startAt = lines.length-maxLines;
                }
                // if(startAt)
            }

            var newText = "";

            for(var i = (lines.length>maxLines)?maxLines-1:lines.length-1; i >= 0; i--) {
                
                var index = i + startAt;
                if(scrollStartAt != null) {
                    index = i + scrollStartAt;
                }

                if(lines[index].type == "logObject") {
                    newText += ">>>"+((lines[index].count<=1)?"   ":"["+lines[index].count+"]")+" "+ lines[index].string + "\n";
                } else if (lines[index].type = "signalObject"){
                    newText += "<O>    " +lines[index].name+":"+ lines[index].signal.pinLastValue() + "\n";
                }
            }
            textfield.text = newText;

            var containsSignal = false;
            for(var i = lines.length-1; i >= 0; i--) {
                if(lines[i].type == "signalObject") {
                    containsSignal = true;   
                }
            }
            if(!containsSignal) {
                if(autoRefreshInterval != null) {
                    Time.clearInterval(autoRefreshInterval);
                }
            }
        }
        //#endregion
        
        //#region Classes
        class logObject {
            constructor(string) {
                this.type = "logObject";
                this.string = string;
                this.count = 1;
            }

            addCount() {
                this.count++;
            }
        }

        class signalObject {
            constructor(name,signal) {
                this.type = "signalObject";
                this.name = name;
                this.signal = signal;
            }
        }
        //#endregion
    }
}