# CustomConsole
### Introduction
The Custom Console is a library to create a on screen console for debugging.
This is the documentation for a Custom Console API for Spark AR. To start using the API you first have to import it from SocialARLib.

You have to create the text field (and optional buttons) yourself, its also possible to create buttons like in the example below to control the console. <br>
WARNING! Unfortunately Spark AR does not have a 'prefab' system that makes building the visuals of a CustomConsole easy, so it's all up to you to make that.
![alt text](https://github.com/ypmits/ARrrrLib/blob/develop/images/console_structure.png?raw=true)


### Code Examples
To start using the console you first have to create a new console like in the first example.
```javascript
const Scene = require("Scene");
const CustomConsole = require("./socialarlib").CustomConsole;


/**
 * The first two parameters we need for the console are the background and the textfield.
 * So we bring them in the following way:
 * 
 * Promise.all([backgroundPromise, textfieldPromise]).then(**makeTheConsole**);
 * 
 * Once the are loaded we can build the console.
 * We connect the buttons to their functions by adding the string of
 * the scene-name of that button
 */

Promise.all([Scene.root.findFirst("CustomConsoleBackground"), Scene.root.findFirst("consoleTextfield")]).then(values => {
   var _console = new CustomConsole(values[0], values[1], 16, { collapse: true,    maxLines: 7, resizeText: true });
   _console.addClearButtonPromise( Scene.root.findFirst("ClearButton") );
   _console.addToTopButtonPromise( Scene.root.findFirst("ToTopButton") );
   _console.addScrollUpButtonPromise( Scene.root.findFirst("UpButton") );
   _console.addScrollDownButtonPromise( Scene.root.findFirst("DownButton"));
   _console.addScrollToBottomButtonPromise( Scene.root.findFirst("ToBottomButton"));
}, e => { console.log("Rejections: "+e)});



var console = new CustomConsole(textObject, {
   collapse:true, 
   maxLines: 3,
   keepLog: true
});

//Will add '>> hello world' to the console
console.log("hello world");

//Will add '<O> faceX: 0.434275532' to the console
//The variable will update in realtime
console.watch("faceX",face.cameraTransform.x);
```

### Settings

The settings are of the type "object".

Settings | description
:--- | :---
collapse | *Type: bool - Default: false* <br> If collapse is equal to true the console will collapse log items with the same value into a single entry with a count in front of it. <br><br> *Example:*<br>>> [3] consoleEntry <br> This means "consoleEntry" is logged three times
maxLines | *Type: int - Default: 5* <br> The maxLines setting are the amount of times shown inside of the text object. If the maxLines amount is bigger than what fits inside of the text field it will show "..." at the end of the last entry.
keepLog | *Type: bool - Default: false* <br> When keepLog is equal to true all entries will be saved until the console is cleared. This allows to scroll back to check previous logged items.

### Methods

Methods | description
:--- | :---
log | *Parameters: Any variable* <br> *[supports Number, String, Boolean, Object, Function, Signal, undefined]* <br> Logging a variable will show it in the console
watch | *Parameters: Name,Signal* <br> Watching a signal will show the update the signal value inside of the console with the given name as index
clear | Removes all the console entries
scrollToTop | Scrolls back to the first console entry, autoscroll will be disabled
scrollUp | Scrolls back one console entry, autoscroll will also be disabled
scrollDown | Scrolls forward one console entry, when reaching the newest entry autoscroll will be enabled again
scrollToBottom | Scrolls back to the last console entry and enabled autoscroll














