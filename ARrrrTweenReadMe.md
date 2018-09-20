# ARrrrTween
### Introduction
ARrrrTween is a Tweening API for AR Studio. To start using ARrrrTween you first have to import it from FARlib.
It is also recommended to include the Ease file is you want to use different easings.

```javascript
import ARrrrTween from '../../../FARLib/src/ARrrrTween';
import Ease from '../../../FARLib/src/Ease';
```

### Code Examples
You make a new tween like this:
```javascript
//Syntax
new ARrrrTween(object, values, autoplay);

//Example 1: default usage
new ARrrrTween(object, {x: 100, duration: 1000}, true);

//Example 2: array of values
new ARrrrTween(object, [{x: 100, duration: 1000},{y: 100, duration: 1000}];

//Example 3: To relative position
new ARrrrTween(object, {x: "100", duration: 1000}, true);

//Example 4: from, to position
new ARrrrTween(object, {x: {from: -200, to: "100"}, duration: 1000});

//Example 5: callbacks
new ARrrrTween(object, {x: 100, duration: 1000, onStart:function(){
/*Executes when x starts tweening*/
}, onComplete: function() {
/*Executes when x is done with the tween*/
}});

//Example 6: methods
var tween = new ARrrrTween(object, [{x: 100, duration: 1000},{y: 100, duration: 1000}],false).onComplete(function(){
   //When all tweens are completed
});
tween.start();
```

The object can be an UI element, model or null object.
The value can be an object (example 1) or array of objects (example 2).
Autoplay is true on default and is not required to be set.

### Values
All values can be animated in a few different ways:
- To absolute value with a float or integer (example 1)
- To relative value with a string (example 3)
- From (absolute/relative) position, to (absolute/relative) position (example 4)

values | description
--- | ---
x | Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.x
y | Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.y
z | Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.z
rotationX <br/> *(in degrees)*| Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.rotationX
rotationY <br/> *(in degrees)*| Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.rotationY
rotationZ <br/> *(in degrees)*| Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.rotationZ
scaleX | Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.scaleX
scaleY | Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.scaleY
scaleZ | Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.scaleZ
opacity | Type: *float, string, {from: float/string,to:float/string}* <br> Tweens the transform.material.opacity (0 to 1)

### Properties
Properties are optional options for the tween, if there is no value set is will use the default value. You can also add callbacks to different stages of the tween (example 5).

Properties | description
---|---
duration <br> *(in milliseconds)* | *Type: int - Default: 500* <br> Sets the duration of the tween.
loopCount, loop, repeat | *Type: int - Default: 1* <br> Sets the amount of loops the tween does. <br> (-1 or Infinity make the tween loop forever)
mirror, yoyo, pingpong | *Type: bool* <br> Mirrors the tween after each loop
ease | *Type: string, Ease - Default: "easeInOutCubic"* <br> Sets the ease of the tween <br> <br> Possible strings: <br> "linear" <br> "easeInSine","easeOutSine","easeInOutSine", <br> "easeInQuad","easeOutQuad","easeInOutQuad", <br> "easeInCubic","easeOutCubic","easeInOutCubic", <br> "easeInQuart","easeOutQuart","easeInOutQuart", <br> "easeInQuint","easeOutQuint","eaeInOutQuint", <br> "easeInExpo","easeOutExpo","easeInOutExpo", <br> "easeInCirc","easeOutCirc","easeInOutCirc", <br> "easeInBack","easeOutBack","easeInOutBack", <br> "easeInElastic","easeOutElastic","easeInOutElastic", <br> "easeInBounce","easeOutBounce","easeInOutBounce"
delay <br> *(in milliseconds)* | *Type: float, default: 0* <br> Waits for delay to start tween
onComplete | *Type: function* <br> Executes function after tween is done.
onIteration | *Type: function* <br> Executes function after each loop.
onStart | *Type: function* <br> Executes function after each loop.

### Methods
Methods can be used on the end of a tween (example 6).

Methods | description
---|---
onComplete | *Parameters: function* <br> Executes function after all tweens in the object are completed.
start | Starts/resumes the tween.
stop | Pauses the tween.














