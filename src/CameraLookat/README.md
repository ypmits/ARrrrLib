# CameraLookAt
### Introduction
CameraLookAt is a api for SparkAR Studio that checks if the user is looking at an object.
This class will check if the pivot of sceneObjects is inside of the radius (so not the bounds)

Before you can use it, you have to create a null object inside of the camera (but outside of the focal distance!).
Name this object 'cameraDirection' and give it a z-position of 1.
![alt text](https://github.com/ypmits/ARrrrLib/blob/develop/images/cameraLookAt_setup.png)

```javascript
import CameraLookAt from '[PATH]/FARLib/src/CameraLookAt/CameraLookAt';
```

### Code Examples
You use the CameraLookAt like this:
```javascript
//First create a new camera lookat object (radius is the radius the objects will be spotted in, debug is optional)
let cameraLookAt = new CameraLookat(radius, debug);

//Example
let cameraLookAt = new CameraLookat(10);

//Example
let object = Scene.root.find("[object name]");
let inSideScreen = cameraLookAt.watch(object); // This returns a boolSignal
//So it is possible to store this inside of a variable or monitor it directly

//Monitored
cameraLookAt.watch(object).monitor({fireOnInitialValue:true}).subscribe((e)=>{
   if(e.newValue) {
      //... if object is inside radius
   } else {
      //... if object is outside radius
   }
});
```

### Settings
The settings can be 

settings | description
--- | ---
radius | Type: *float (between 0 and 180)* <br> Radius in which the object will be detected
debug | Type: *bool (optional)* <br> If true, the cameraLookAt will search of an object called 'debugDrawer', this has to be of the type SpotLight. This object has to be positioned inside the camera, but outside of the focal distance at the position of (0,0,0) and rotation (0,0,0). This will than show you the radius of the cameraLookAt. *this is optional*

### Methods

Methods | description
---|---
watch | *Parameters: sceneObject* <br> The sceneObject that will be watched by the CameraLookAt and returns a boolSignal. It is possible to watch multiple objects by calling this function multiple times for different objects.














