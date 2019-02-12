# IKSystem
### Introduction
This is the documentation for a IKSystem API for SparkAR Studio. To start using the API you first have to import it from FARlib.<br>
![alt text](https://github.com/ypmits/ARrrrLib/blob/develop/images/IK_structure.png?raw=true "An example of an IKSystem" =350x)
<br>
```javascript
import IKSystem from '[PATH]/FARLib/src/IKSystem/IKSystem';
```

### Code Examples
You can make a new tween object like this:
```javascript
//Syntax
new IKSystem(bones, points, settings);

//Example 1: Default
var points = {
   begin: Scene.root.find("begin"),
   target: Scene.root.find("target"),
   end: Scene.root.find("end")
}

var bones = {
   begin: Scene.root.find("BeginPosition"),
   middle: Scene.root.find("middleBone"),
   target: Scene.root.find("endPosition")
}

new IKSystem(bones, points, {keepEndRotation:true,useDepthRotation:true});

//Example 2: Chain
var points = {
   begin: Scene.root.find("begin"),
   target: Scene.root.find("target"),
   end: Scene.root.find("end")
}

var arrayOfBones = {
   array: [
       Scene.root.find("bone1"),
       Scene.root.find("bone2"),
       Scene.root.find("bone3"),
       Scene.root.find("bone4"),
       Scene.root.find("bone5"),
       Scene.root.find("bone6"),
       Scene.root.find("bone7"),
       Scene.root.find("bone8"),
   ]
}

new IKSystem(arrayOfBones, points, {keepEndRotation:true,useDepthRotation:true});
```

### Different IK Systems
There are two ways to create a IK System with this system:
- *Like example one:* <br> With this example you can create a IK System with two bones, this is perfect for arms and legs.
- *Like example two:* <br> With this example you can create a IK System with an array of bones, this could be used for something like a tail.

*!!! For both ways it is very important that the bones are all the same length. !!!*


### Settings

Settings | description
--- | ---
keepEndRotation | *Type: bool - Default: false* <br> If keepEndRotation is equal to true, the end bone of the chain will have the same rotation as the end point
useDepthRotation | *Type: bool - Default: false* <br> If useDepthRotation is equal to true, the IK chain will rotate according to the difference between the z values of the start end end point.  (from start to end)
