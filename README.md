# SocialARLib
*SocialARLib* is a collection of utility libraries for several Social Augmented Reality platforms, like Snapchat's [Lens Studio](https://lensstudio.snapchat.com/) and Facebook's [Spark AR](https://sparkar.facebook.com/ar-studio/) platform.
The *[Pièce-de-Résistance](https://www.dictionary.com/browse/piece-de-resistance)* of this library is a complete and feature-rich tweening-library for Spark AR, with a syntax and API comparable to that of Greensock's GSAP platform.

SocialARLib also contains a lot of other gems that make developing for Spark AR filter a lot easier.

## What's inside SocialARLib
SparkAR (Facebook / Instagram)
Feature | Description
:--- | :---
[ARTween](src/sparkar/artween/ARTween) | A complete Tweening-library in the style of good old TweenLite
[CustomConsole](src/sparkar/customconsole/CustomConsole) | Add a visual console to your scene so you can debug your projects on any device
[CameraLookAt](src/sparkar/cameralookat/CameraLookat) | Make something happen by looking at a specific object in the scene
[IKSystem](src/sparkar/iksystem/IKSystem) | A flexible IK-system. Handy if you need your character to use a bicycle
[Math2](src/sparkar/math2/Math2) | Handy math functions
[ObjectFinder](src/ObjectFinder) | Find objects, or not and get some nice debug-logs
<!-- [CustomUI](src/CustomUI) | A utility-class with some handy UI-functions
[AudioObject](src/AudioObject) | For handling audio much easier
[DeviceInfo](src/DeviceInfo) | DeviceInfo provides some basic information about the device. It needs a reference to a canvas in Spark AR to do so.
[SceneLoader](src/SceneLoader) | For easy scene-manager
[Patches](src/Patches) | A collection of ready-to-use patches -->

Lens Studio (Snapchat)
Feature | Description
:--- | :---
[...](src/ARTween) | A complete Tweening-library in the style of good old TweenLite

## Setup
##### Some basic Spark-AR script information
Spark-AR wants all scripts being used to sit in a folder called ***scripts***. It also wants all scripts that are being used in your project (even if they're referenced or imported in other scripts) to be added inside Spark-AR.

##### SocialARLib.js
For this library we are gonna output a script called ***socialarlib.js***. This will contain all the necessary library-functions you need.

When you want to use ARrrrLib as an external library for your own (or a new) Studio AR project then follow the following procedure:
-  make sure to copy the [package-lock.json](```package-lock.json```) and [package.json](```package.json```) to the root of your project. This folder, although it's an external library will also need to have the node_modules installed to function. To install the ```node_modules``` you will have to run:
```javascript
npm i
```
## Spark AR
When we look at the scripts-folder
After installing all the necessary node_modules we need to build the ***socialarlib.js*** file and fill it with all the classes of the library.

**P.S.**
The node_modules folder is ignored through the [.gitignore](.gitignore), which can be found in the root of ARrrrLib.

![Arr! Said the pirate](https://github.com/ypmits/ARrrrLib/blob/develop/images/pirate.png?raw=true)
