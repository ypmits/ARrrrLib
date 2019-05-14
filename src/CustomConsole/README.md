# CustomConsole
### Introduction
The Custom Console is a library to create a on screen console for debugging.
This is the documentation for a Custom Console API for Spark AR Studio. To start using the API you first have to import it from FARlib.

You have to create the text field by yourself, its also possible to create buttons like in the example below to control the console. <br>
![alt text](https://github.com/ypmits/ARrrrLib/blob/develop/images/console_structure.png?raw=true)


```javascript
import CustomConsole from '[PATH]/FARLib/src/CustomConsole/CustomConsole';
```

### Code Examples
To start using the console you first have to create a new console like in the first example.
```javascript
//Syntax
var console = new CustomConsole(textObject, settings);

//Example
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
--- | ---
collapse | *Type: bool - Default: false* <br> If collapse is equal to true the console will collapse log items with the same value into a single entry with a count in front of it. <br><br> *Example:*<br>>> [3] consoleEntry <br> This means "consoleEntry" is logged three times
maxLines | *Type: int - Default: 5* <br> The maxLines setting are the amount of times shown inside of the text object. If the maxLines amount is bigger than what fits inside of the text field it will show "..." at the end of the last entry.
keepLog | *Type: bool - Default: false* <br> When keepLog is equal to true all entries will be saved until the console is cleared. This allows to scroll back to check previous logged items.

### Methods

Methods | description
---|---
log | *Parameters: Any variable* <br> *[supports Number, String, Boolean, Object, Function, Signal, undefined]* <br> Logging a variable will show it in the console
watch | *Parameters: Name,Signal* <br> Watching a signal will show the update the signal value inside of the console with the given name as index
clear | Removes all the console entries
scrollToTop | Scrolls back to the first console entry, autoscroll will be disabled
scrollUp | Scrolls back one console entry, autoscroll will also be disabled
scrollDown | Scrolls forward one console entry, when reaching the newest entry autoscroll will be enabled again
scrollToBottom | Scrolls back to the last console entry and enabled autoscroll














