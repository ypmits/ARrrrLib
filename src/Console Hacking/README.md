# Console Hacking
### Introduction
It is possible to change some of Spark AR's annoying 'features/bugs/midboggling crappy ideas that were shit but still implemented'. One of them is the shear amount of warning you'll get when you use a deprecated API. You can simply turn off every single warning in the console but it's also possible to

## (Plan A:) Hiding specific warnings through javascript
Go to the file ScriptingConsole.js
Go to the method: logItem(baser64item, type, interfaceName)
Add the following below
```javascript
let lines = ...;
```
```javascript
if(type == "warning") return;
if(item.includes("[error]")) type = "error";
if(item.includes("[warning]")) type = "warning";
```
Congrats! You can now write your own custom warnings or errors.

## (Plan B:) Hiding all warnings through css
If this fails you can always fall back to plan B... 'Hide all warnings'
Go to the app inside the Finder and right click on it.
Choose ‘Show Package Contents’
Navigate to the folder: AR Studio.app/Contents/Resource/ScriptingConsole.html
Look at the following css code:

.warning {
	color: #FFD811;
}
Add: display: none;
Now the css-rule should look like this:
.warning {
	color: #FFD811;
	display: none;
}
