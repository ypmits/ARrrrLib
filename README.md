# Information about ARrrrLib
*ARrrrLib* (try saying it like a pirate) is a collection of utility libraries for Facebook's AR platform **Spark AR Studio**.
The 'Pièce de Résistance' of this library is a complete and feature-rich tweening-library. It has a similar syntax as Greensock's TweenLite library. ARrrrLib also contains a few other gems that make developing a Spark AR filter a lot easier.

Feature | Description
--- | ---
[ARTween](../sr/ARTween) | A complete Tweening-library in the style of good old TweenLite
[CustomConsole](../src/CustomConsole) | Add a visual console to your project to debug your projects without using a console
[IKSystem](src/IKSystem) | A flexible IK-system. Handy if you need your character to use a bicycle
[CameraLookAt](src/CameraLookAt) | Make something happen by looking at a specific object in the scene
[CustomUI](src/CustomUI) | A utility-class with some handy UI-functions
[AudioObject](src/AudioObject) | For handling audio much easier
[DeviceInfo](src/DeviceInfo) | DeviceInfo provides some basic information about the device. It needs a reference to a canvas in Spark AR to do so.
[Math2](src/Math2) | Handy math functions
[ObjectFinder](src/ObjectFinder) | Find objects, or not and get some nice debug-logs
[SceneLoader](src/SceneLoader) | For easy scene-manager
[Patches](src/Patches) | A collection of ready-to-use patches

## Setup
When you're using ARrrrLib as an external library for your own Studio AR project then make sure to copy the ```package.json``` and ```package-lock.json``` to the root of this library. This folder, although it's an external library will also need to have the node_modules installed to function. To install the ```node_modules``` you will have to run:
```javascript
npm i
```
The node_modules folder is ignored through the ```.gitignore``` which can be found in the root of ARrrrLib.

![Arr! Said the pirate](https://github.com/ypmits/ARrrrLib/blob/develop/images/pirate.png?raw=true)
