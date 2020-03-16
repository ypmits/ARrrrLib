'use strict';

const Scene = require('Scene');
const Animation = require('Animation');
const Reactive = require('Reactive');
const Time = require('Time');

/**
 * Make sure you copy the files next to your standard script.js file in the folder 'scripts'
 * and add the scripts to Spark AR.
 * 
 * Example:
 * const Tweener = require("./ARTween").ARTween;
 * const Delay = require("./ARTween").Delay;
 * const Ease = require("./ARTween").Ease;
 * 
 * var rect = Scene.root.find("rect");
 * var tween = ARrrrTween(rect, [{x:0, duration: 2000},{y: 100, duration: 2000}, {rotationZ: 360, duration: 2000}, {scaleX: 2, duration: 2000}, {scaleY: 20, duration: 2000}]).onComplete(function(){
 *	Diagnostics.log("Done!");
 * });
 */
class ARTween {
	constructor(object, values, autoplay) {
		//Set values and controls
		this.object = object;
		this.values = values;

		this.isPlaying = false;


		if(autoplay != null) {
			this.autoplay = autoplay;
		} else {
			this.autoplay = true;
		}

		this.started = false;
		this.finished = false;

		this.offset = {
			transform: {
				x: 0,
				y: 0,
				z: 0,
				rotationX: 0,
				rotationY: 0,
				rotationZ: 0,
				scaleX: 1,
				scaleY: 1,
				scaleZ: 1,
			},
			material: {
				opacity: 1
			}
		};

		this.defaultControls = {
			duration: 500,
			loopCount: 1,
			mirror: false,
			ease: "easeInOutCubic",
			delay: 0,
			autoplay: true,
			onComplete: function(){},
			onIteration: function(){},
			onStart: function(){}
		};

		this.animations = [];
		
		this.StartTween();

		//Functions
		this.start = function () {
			if(this.finished) {
				this.animations = [];
				this.started = false;
				this.autoplay = true;
				this.StartTween();
			} else {
				this.StartPlaying();
			}

			return this;
		};

		this.pause = function () {
			this.StopPlaying();

			return this;
		};

		this.reset = function() {
			this.isPlaying = false;
			this.started = false;
			this.finished = false;

			this.animations.forEach(animation => {
				animation.driver.reset();
			});

			this.AssignSignals();
		};
		
		this.onComplete = function (callback) {
			if (callback && typeof (callback) === "function") {
				
				var longestDuration = 0;
				var driver = null;
				this.animations.forEach(anim => {
					if (longestDuration < (anim.duration+anim.delay)) {
						longestDuration = anim.duration+anim.delay;
						driver = anim.driver;
					}
				});
				
				if (driver != null) {
					driver.onCompleted().subscribe(() => {
						if(this.isPlaying) {
							callback();
						}
					});
				}
			}

			return this;
		};

		return this;
	}

	StartTween()
	{
		//Set offsets
		if(this.object.transform != null) {
			this.offset.transform.x = this.object.transform.x.pinLastValue();
			this.offset.transform.y = this.object.transform.y.pinLastValue();
			this.offset.transform.z = this.object.transform.z.pinLastValue();
			this.offset.transform.rotationX = this.object.transform.rotationX.pinLastValue();
			this.offset.transform.rotationY = this.object.transform.rotationY.pinLastValue();
			this.offset.transform.rotationZ = this.object.transform.rotationZ.pinLastValue();
			this.offset.transform.scaleX = this.object.transform.scaleX.pinLastValue();
			this.offset.transform.scaleY = this.object.transform.scaleY.pinLastValue();
			this.offset.transform.scaleZ = this.object.transform.scaleZ.pinLastValue();
			if(this.object.text == null) {
				if(this.object.material != null) {
					this.offset.material.opacity = this.object.material.opacity.pinLastValue();
				}
			}
		}
			
		if (Array.isArray(this.values) == false) {
			this.EvaluateData(this.values);
			
			if(this.autoplay) {
				this.StartPlaying();
			}
			return;
		}
		
		this.values.forEach(valuesElement => {

			this.EvaluateData(valuesElement);
		});
		
		if(this.autoplay) {
			this.StartPlaying();
		}
	}

	AssignSignals() {
		//Check if UI
		if(this.object.bounds != null) {
			var value = Reactive.val(0);
			var x = Reactive.val(this.offset.transform.x);
			var y = Reactive.val(this.offset.transform.y);
			var z = Reactive.val(this.offset.transform.z);

			var useX = false;
			var useY = false;
			var useZ = false;

			var xSizeOffset = Reactive.val(0);
			var ySizeOffset = Reactive.val(0);
			var zSizeOffset = Reactive.val(0);

			var zRotationOffsetX = Reactive.val(0);
			var zRotationOffsetY = Reactive.val(0);

			var xRotationOffsetY = Reactive.val(0);
			var xRotationOffsetZ = Reactive.val(0);

			var yRotationOffsetX = Reactive.val(0);
			var yRotationOffsetZ = Reactive.val(0);

			//Assign signals and calculate offset
			this.animations.forEach(animation => {
				//MoveX
				if (animation.id == "x") {
					x = animation.signal;
					useX = true;
				}
				//MoveY
				if (animation.id == "y") {
					y = animation.signal;
					useY = true;
				}
				//MoveZ
				if (animation.id == "z") {
					z = animation.signal;
					useZ = true;
				}

				//RotationX
				if (animation.id == "rotationX") {
					useY = true;
					useZ = true;

					var scaleY = Reactive.val(1);

					this.animations.forEach(element => {
						if (element.id == "scaleY") {
							scaleY = element.signal;
						}
					});

					var angle = 0;
					var h = 0;

					h = this.object.bounds.height.div(2).mul(scaleY);

					angle = Reactive.atan2(this.object.bounds.height.div(2).mul(scaleY).mul(1), 0);

					xRotationOffsetZ = Reactive.cos(animation.signal.sub(angle)).mul(h).mul(-1);
					xRotationOffsetY = Reactive.sin(animation.signal.sub(angle)).mul(h).add(this.object.bounds.height.div(2).mul(scaleY));
					this.object.transform.rotationX = animation.signal;
				}

				//RotationY
				if (animation.id == "rotationY") {
					useX = true;
					useZ = true;

					var scaleX = Reactive.val(1);
					this.animations.forEach(element => {
						if (element.id == "scaleX") {
							scaleX = element.signal;
						}
					});

					var angle = 0;
					var h = 0;
					
					h = this.object.bounds.width.div(2).mul(scaleX);
					
					angle = Reactive.atan2(this.object.bounds.width.div(2).mul(scaleX).mul(1), 0);

					yRotationOffsetZ = Reactive.cos(animation.signal.sub(angle)).mul(h);
					yRotationOffsetX = Reactive.sin(animation.signal.sub(angle)).mul(h).add(this.object.bounds.width.div(2).mul(scaleX));
					this.object.transform.rotationY = animation.signal;
				}

				//RotationZ
				if (animation.id == "rotationZ") {
					useX = true;
					useY = true;

					var scaleX = Reactive.val(1);
					var scaleY = Reactive.val(1);

					this.animations.forEach(element => {
						if (element.id == "scaleX") {
							scaleX = element.signal;
						}
						if (element.id == "scaleY") {
							scaleY = element.signal;
						}
					});

					var angle = 0;
					var h = 0;

					h = Reactive.sqrt(Reactive.add(this.object.bounds.height.div(2).mul(scaleY).pow(2), this.object.bounds.width.div(2).mul(scaleX).pow(2)));

					angle = Reactive.atan2(this.object.bounds.height.div(2).mul(scaleY).mul(1), this.object.bounds.width.div(2).mul(scaleX).mul(-1));

					zRotationOffsetX = Reactive.cos(animation.signal.sub(angle)).mul(h).add(this.object.bounds.width.div(2).mul(scaleX));
					zRotationOffsetY = Reactive.sin(animation.signal.sub(angle)).mul(h).add(this.object.bounds.height.div(2).mul(scaleY));
					this.object.transform.rotationZ = animation.signal;
				}
				
				//ScaleX
				if (animation.id == "scaleX") {
					useX = true;

					xSizeOffset = this.object.bounds.width.div(2/this.offset.transform.scaleX).sub(this.object.bounds.width.div(2).mul(animation.signal));
					this.object.transform.scaleX = animation.signal;
				}
				//ScaleY
				if (animation.id == "scaleY") {
					useY = true;

					ySizeOffset = this.object.bounds.height.div(2/this.offset.transform.scaleY).sub(this.object.bounds.height.div(2).mul(animation.signal));
					this.object.transform.scaleY = animation.signal;
				}

				//Opacity
				if(animation.id == "opacity") {
					this.object.material.opacity = animation.signal;
				}
			});

			if(useX) {
				this.object.transform.x = x.add(xSizeOffset).add(zRotationOffsetX).add(yRotationOffsetX);
			}
			if(useY){
				this.object.transform.y = y.add(ySizeOffset).add(zRotationOffsetY).add(xRotationOffsetY);
			}
			if(useZ) {
				this.object.transform.z = z.add(xRotationOffsetZ).add(yRotationOffsetZ);
			}
		} else {
			this.animations.forEach(animation => {
				//Value
				if (animation.id == "value") {
					this.object = animation.signal;
				}
				//Position
				if(animation.id == "x") {
					this.object.transform.x = animation.signal;
				}
				if(animation.id == "y") {
					this.object.transform.y = animation.signal;
				}
				if(animation.id == "z") {
					this.object.transform.z = animation.signal;
				}
				//Rotation
				if(animation.id == "rotationX") {
					this.object.transform.rotationX = animation.signal;
				}
				if(animation.id == "rotationY") {
					this.object.transform.rotationY = animation.signal;
				}
				if(animation.id == "rotationZ") {
					this.object.transform.rotationZ = animation.signal;
				}
				//Scale
				if(animation.id == "scaleX") {
					this.object.transform.scaleX = animation.signal;
				}
				if(animation.id == "scaleY") {
					this.object.transform.scaleY = animation.signal;
				}
				if(animation.id == "scaleZ") {
					this.object.transform.scaleZ = animation.signal;
				}
				//Materials
				//Opacity
				if(animation.id == "opacity") {
					this.object.material.opacity = animation.signal;
				}
			});
		}
	}

	EvaluateData(data)
	{
		//Fields
		var id = "";
		var start = 0;
		var end = 0;

		//Controls
		var duration = this.defaultControls.duration;
		var loopCount = this.defaultControls.loopCount;
		var mirror = this.defaultControls.mirror;
		var ease = this.defaultControls.ease;
		var delay = this.defaultControls.delay;
		var onComplete = this.defaultControls.onComplete;
		var onIteration = this.defaultControls.onIteration;
		var onStart = this.defaultControls.onStart;

		var signal = Reactive.val(0);

		//Animatable
		//Value
		if (data.value != null) {
			id = "value";
			var startEnd = this.CheckValue(data.value, 0);
			start = startEnd.start;
			end = startEnd.end;
		}
		//Move
		if (data.x != null) {
			id = "x";
			var startEnd = this.CheckValue(data.x, this.offset.transform.x);
			start = startEnd.start;
			end = startEnd.end;
		}
		if (data.y != null) {
			id = "y";

			var startEnd = this.CheckValue(data.y, this.offset.transform.y);
			start = startEnd.start;
			end = startEnd.end;
		}
		if (data.z != null) {
			id = "z";
			var startEnd = this.CheckValue(data.z, this.offset.transform.z);
			start = startEnd.start;
			end = startEnd.end;
		}
		//Rotate
		if (data.rotationX != null) {
			id = "rotationX";
			var startEnd = this.CheckValue(data.rotationX, this.offset.transform.rotationX, true);
			start = startEnd.start;
			end = startEnd.end;
		}
		if (data.rotationY != null) {
			id = "rotationY";
			var startEnd = this.CheckValue(data.rotationY, this.offset.transform.rotationY, true);
			start = startEnd.start;
			end = startEnd.end;
		}
		if (data.rotationZ != null) {
			id = "rotationZ";
			var startEnd = this.CheckValue(data.rotationZ, this.offset.transform.rotationZ, true);
			start = startEnd.start;
			end = startEnd.end;
		}
		//Scale
		if (data.scaleX != null) {
			id = "scaleX";
			var startEnd = this.CheckValue(data.scaleX, this.offset.transform.scaleX);
			start = startEnd.start;
			end = startEnd.end;
		}
		if (data.scaleY != null) {
			id = "scaleY";
			var startEnd = this.CheckValue(data.scaleY, this.offset.transform.scaleY);
			start = startEnd.start;
			end = startEnd.end;
		}
		if (data.scaleZ != null) {
			id = "scaleZ";
			var startEnd = this.CheckValue(data.scaleZ, this.offset.transform.scaleZ);
			start = startEnd.start;
			end = startEnd.end;
		}
		//Material
		if(this.object.text == null) {
			if(this.object.material != null && this.object.text == null) {
				if (data.opacity != null) {
					id = "opacity";
					var startEnd = this.CheckValue(data.opacity, this.offset.material.opacity);
					start = startEnd.start;
					end = startEnd.end;
				}
			}
		}

		//Controls
		//Duration
		if (data.duration != null) {
			duration = data.duration;

			if(duration <= 0) {
				duration = 1;
			}
		}
		//Loops
		if (data.loopCount != null) {
			loopCount = data.loopCount;
		}
		if(data.loop != null) {
			loopCount = data.loop;
		}
		if(data.repeat != null) {
			loopCount = data.repeat;
		}
		//Infinite Loop
		if(loopCount == -1) {
			loopCount = Infinity;
		}
		//Mirror
		if (data.mirror != null) {
			mirror = data.mirror;
		}
		if(data.yoyo != null) {
			mirror = data.yoyo;
		}
		if(data.pingpong != null) {
			mirror = data.pingpong;
		}
		//Ease
		if (data.ease != null) {
			ease = data.ease;
		}
		//Delay
		if(data.delay != null) {
			delay = data.delay;
		}
		//OnComplete
		if(data.onComplete != null) {
			onComplete = data.onComplete;
		}
		//OnIteration
		if(data.onIteration != null) {
			onIteration = data.onIteration;
		}
		//OnStart
		if(data.onStart != null) {
			onStart = data.onStart;
		}

		var AnimationDriver = Animation.timeDriver({ durationMilliseconds: duration, loopCount: loopCount, mirror: mirror });
		var AnimationValue = Animation.samplers[ease](start, end);
		var Animate = Animation.animate(AnimationDriver, AnimationValue);

		signal = Animate;

		AnimationDriver.onCompleted().subscribe(() => {
			if(this.isPlaying) {
				onComplete();
			}
		});
		AnimationDriver.onAfterIteration().subscribe(onIteration);
		AnimationDriver.onAfterIteration().subscribe(onStart);

		this.animations.push({ id: id, signal: signal, duration: duration, delay: delay, driver: AnimationDriver, onStart: onStart });
	}

	CheckValue(data ,offset, isRotation) {
		var startEnd = {
			start: 0,
			end: 0
		};

		if(isRotation) {
			if(data.from != null && data.to != null) {
				//From
				if(typeof(data.from) == "string") {
					data.from = Number(data.from);
					data.from = this.DegToRad(data.from);
				} else {
					data.from = this.DegToRad(data.from);
				}
				//To
				if(typeof(data.to) == "string") {
					data.to = Number(data.to);
					data.to = this.DegToRad(data.to);
				} else {
					data.to = this.DegToRad(data.to);
				}
			} else {
				if(typeof(data) == "string") {
					data = Number(data);
					data = this.DegToRad(data);
				} else {
					data = this.DegToRad(data);
				}
			}
		}

		//FromTo
		if(data.from != null && data.to != null) {
			//From
			if(typeof(data.from) == "string") {
				data.from = Number(data.from);
				startEnd.start = offset + data.from;
			} else {
				 startEnd.start = data.from;
			}
			//To
			if(typeof(data.to) == "string") {
				data.to = Number(data.to);
				startEnd.end = offset + data.to;
			} else {
				 startEnd.end = data.to;
			}
		//To
		} else {
			startEnd.start = offset;
			if(typeof(data) == "string") {
				data = Number(data);
				startEnd.end = offset + data;
			} else {
				startEnd.end = data;
			}
		}

		return startEnd;
	}

	StartPlaying() {
		this.isPlaying = true;

		if(this.started) {
			//Resume playing
			this.animations.forEach(anim => {
				anim.driver.start();
			});
		} else {
			//First time started
			this.AssignSignals();

			var longestDuration = 0;
			var driver = null;

			this.animations.forEach(anim => {
				//Get longest duration foreach driver
				if (longestDuration < (anim.duration + anim.delay)) {
					longestDuration = anim.duration + anim.delay;
					driver = anim.driver;
				}

				//Start drivers (or start after delay)
				if(anim.delay == 0) {
					anim.driver.start();
					anim.onStart();
				} else {
					Time.setTimeout(function(){
						anim.driver.start();
						anim.onStart();
					},anim.delay);
				}
			});

			//if finished
			if (driver != null) {
				driver.onCompleted().subscribe(() => {
					if(this.isPlaying) {
						this.finished = true;
						this.started = false;
					}
				});
			}

			this.started = true;
		}
	}

	StopPlaying() {
		this.isPlaying = false;

		this.animations.forEach(anim => {
			anim.driver.stop();
		});
	}

	DegToRad(deg)
	{
		return (deg * Math.PI) / 180.0;
	}
}

class Ease 
{
	static InBack (){ return "easeInBack"; }
	static OutBack (){ return "easeOutBack"; }
	static InOutBack (){ return "easeInOutBack"; }
	static InBounce (){ return "easeInBounce"; }
	static OutBounce (){ return "easeOutBounce"; }
	static InOutBounce (){ return "easeInOutBounce"; }
	static InCirc (){ return "easeInCirc"; }
	static OutCirc (){ return "easeOutCirc"; }
	static InOutCirc (){ return "easeInOutCirc"; }
	static InCubic (){ return "easeInCubic"; }
	static OutCubic (){ return "easeOutCubic"; }
	static InOutCubic (){ return "easeInOutCubic"; }
	static InElastic (){ return "easeInElastic"; }
	static OutElastic (){ return "easeOutElastic"; }
	static InOutElastic (){ return "easeInOutElastic"; }
	static InExpo (){ return "easeInExpo"; }
	static OutExpo (){ return "easeOutExpo"; }
	static InOutExpo (){ return "easeInOutExpo"; }
	static InQuad (){ return "easeInQuad"; }
	static OutQuad (){ return "easeOutQuad"; }
	static InOutQuad (){ return "easeInOutQuad"; }
	static InQuart (){ return "easeInQuart"; }
	static OutQuart (){ return "easeOutQuart"; }
	static InOutQuart (){ return "easeInOutQuart"; }
	static InQuint (){ return "easeInQuint"; }
	static OutQuint (){ return "easeOutQuint"; }
	static InOutQuint (){ return "easeInOutQuint"; }
	static InSine (){ return "easeInSine"; }
	static OutSine (){ return "easeOutSine"; }
	static InOutSine(){ return "easeInOutSine"; }
	static Linear() { return "linear"; }
}

const Scene$1 = require('Scene');

class Delay {
	constructor(delay, completeFunction) {
		var t = new ARTween(Scene$1.root,[{alpha:1, duration:delay, ease:Ease.Linear()}], true).onComplete(()=>{completeFunction();});
	}
}

/**
 * Some math utilities
 */
class Math2 {
	static deg2rad (degrees)
	{
		return (degrees * Math.PI) / 180.0;
	}
	static rad2deg (radians)
	{
		return (180.0 * radians) / Math.PI;
	}
	static getRandom (min, max)
	{
		return Math.floor(Math.random() * (max - min) + min);
	}
	static arrayShuffle (array)
	{
		for (var i = array.length-1;i > 0;i--)
		{
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}
}

const FaceTracking = require('FaceTracking');
const FaceGestures = require('FaceGestures');

//#region Base-classes
/**
 * Baseclasses for the FaceGestures
 */
class ARFaceBaseBoolGesture
{
	constructor(faceID, startCallback, stopCallback)
	{
		this.faceTracker = FaceTracking.face(faceID);
		this.startCallback = startCallback;
		this.stopCallback = stopCallback;
		this.subscribe = null;
	}

	stop() { if (this.subscribe) this.subscribe.unsubscribe(); return this; }
}

class ARFaceBaseEventGesture
{
	constructor(faceID, eventCallback)
	{
		this.faceTracker = FaceTracking.face(faceID);
		this.eventCallback = eventCallback;
		this.subscribe = null;
	}

	stop() { if (this.subscribe) this.subscribe.unsubscribe(); return this; }
}
//#endregion





/**
 */
class EyebrowsFrowned extends ARFaceBaseBoolGesture
{
	start()
	{
		this.subscribe = FaceGestures.hasEyebrowsFrowned(this.faceTracker).monitor().subscribe(
			e => { e.newValue ? this.startCallback() : this.stopCallback(); }
		);
		return this;
	}
}

/**
 */
class EyebrowsRaised extends ARFaceBaseBoolGesture
{
	start()
	{
		this.subscribe = FaceGestures.hasEyebrowsRaised(this.faceTracker).monitor().subscribe(
			e => { e.newValue ? this.startCallback() : this.stopCallback(); }
		);
		return this;
	}
}

/**
 * 
 */
class LeftEyeClosed extends ARFaceBaseBoolGesture
{
	start()
	{
		this.subscribe = FaceGestures.hasLeftEyeClosed(this.faceTracker).monitor().subscribe(
			e => { e.newValue ? this.startCallback() : this.stopCallback(); }
		);
		return this;
	}
}

/**
 * 
 */
class RightEyeClosed extends ARFaceBaseBoolGesture
{
	start()
	{
		this.subscribe = FaceGestures.hasRightEyeClosed(this.faceTracker).monitor().subscribe(
			e => { e.newValue ? this.startCallback() : this.stopCallback(); }
		);
		return this;
	}
}

/**
 * 
 */
class MouthOpen extends ARFaceBaseBoolGesture
{
	start()
	{
		this.subscribe = FaceGestures.hasMouthOpen(this.faceTracker).monitor().subscribe(
			e => { e.newValue ? this.startCallback() : this.stopCallback(); }
		);
		return this;
	}
}
/**
config:
{lipMix:0, threshold: 0, backlash:0}

lipMix: 0 is lower lip only, 1.0 is upper lip only
threshold:
backlash:
 */
class Smile extends ARFaceBaseBoolGesture
{
	constructor(faceID, startCallback, stopCallback)
	{
		super(faceID, startCallback, stopCallback);
		this.config = { lipMix: 0.5, threshold: 0, backlash: 0 };
	}

	start()
	{
		this.subscribe = FaceGestures.isSmiling(this.faceTracker, this.config).monitor().subscribe(
			e => { e.newValue ? this.startCallback() : this.stopCallback(); }
		);
		return this;
	}
}

/**
 * 
 */
class Surprised extends ARFaceBaseBoolGesture
{
	start()
	{
		this.subscribe = FaceGestures.isSurprised(this.faceTracker).monitor().subscribe(
			e => { e.newValue ? this.startCallback() : this.stopCallback(); }
		);
		return this;
	}
}

/**
config:
{angle:1, period: 100, swing:5}

angle: The minimum rotation for one swing, in radians
period: The maximum time limit for one swing, in milliseconds
swing: The count of consecutive alternating swings after which the gesture is detected
 */
class Shake extends ARFaceBaseEventGesture
{
	start()
	{
		this.subscribe = FaceGestures.onShake(this.faceTracker).subscribe(
			() => { this.eventCallback(); }
		);
		return this;
	}
}

/**
config:
{angle:1, period: 100, swing:5}

angle: The minimum rotation for one swing, in radians
period: The maximum time limit for one swing, in milliseconds
swing: The count of consecutive alternating swings after which the gesture is detected
 */
class Nod extends ARFaceBaseEventGesture
{
	start()
	{
		this.subscribe = FaceGestures.onNod(this.faceTracker).subscribe(
			() => { this.eventCallback(); }
		);
		return this;
	}
}

/**
config:
{lipMix:0, threshold: 0, backlash:0}

lipMix: 0 is lower lip only, 1.0 is upper lip only
threshold:
backlash:
 */
class Blink extends ARFaceBaseEventGesture
{
	start()
	{
		this.subscribe = FaceGestures.onNod(this.faceTracker).subscribe(
			() => { this.eventCallback(); }
		);
		return this;
	}
}
var ARFaceGestures = {
	EyebrowsFrowned,
	EyebrowsRaised,
	LeftEyeClosed,
	RightEyeClosed,
	MouthOpen,
	Smile,
	Surprised,
	Shake,
	Nod,
	Blink
};

const Scene$2 = require('Scene');
const Diagnostics = require('Diagnostics');

class ObjectFinder {
    // ------------Example------------
    // var object = ObjectFinder.find("objectToFind"); // Find a object in the Scene.root
    // var object = ObjectFinder.find("childObjectToFind",object); // Use a SceneObject to indicate the parent object (recommended)
    // var object = ObjectFinder.find("childObjectToFind","objectToFind"); // Use a string to indicate the parent object
    // --------------End--------------
    static find(object, inside = null) {
        if(object == null) {
            Diagnostics.log("[error] no object name given");
        } else if (typeof object != "string") {
            Diagnostics.log("[error] object type has to be a string");
        } else {
            try {
                if(inside == null) {
                    return Scene$2.root.find(object);
                } else {
                    if(typeof inside == "string") {
                        return Scene$2.root.find(inside).find(object);
                    } else {
                        return inside.find(object);
                    }
                }
            } catch(e) {
                if(inside == null) {
                    Diagnostics.log(`[error] could not find "${object}" in the scene`);
                } else {
                    Diagnostics.log(`[error] could not find "${object}" in ${(typeof inside == "string")?inside:inside.name}`);
                }
            }
        }
    }
}

const Time$1 = require('Time');
const console = require('Diagnostics');
const TouchGestures = require('TouchGestures');

/**
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * The Custom Console is a utility to create an on-screen console for debugging-
 * purposes. It does not draw the console on the screen, you have to do that in
 * Spark-AR yourself. The Console needs a reference to the debugging-textfield.
 * 
 * This is the documentation for a Custom Console API for Spark AR Studio.
 * To start using the API you first have to import it from FARlib.
 * You have to create the text field by yourself, its also possible to create
 * buttons like in the example below to control the console.
 * 
 * P.S.
 * Make sure you add 'TouchGestures' as a capability inside the properties-panel
 * (which can be found in the menu: Project/Edit Properties.../Capabilities)
 * 
 * More info:
 * https://github.com/ypmits/ARrrrLib/tree/develop/src/CustomConsole/README.md
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */
class CustomConsole
{
	constructor(background, textfield, fontSize, options)
	{
		//#region Settings
		var collapse = (options != null && options.collapse != null) ? options.collapse : false;
		var maxLines = (options != null && options.maxLines != null) ? options.maxLines : 5;
		var keepLog = (options != null && options.keepLog != null) ? options.keepLog : false;
		
		//#endregion
		
		//#region Fields
		var startAt = 0;
		var scrollStartAt = 0;
		var lines = [];
		textfield.text = "";

		var autoRefreshInterval;
		if (options.resizeText) {
			TouchGestures.onPinch(background).subscribe(e =>
			{
				const lastScaleX = textfield.transform.scale.x.pinLastValue();
				const newScaleX = e.scale.mul(lastScaleX);
				console.log("Pinch lastScale:"+lastScaleX+" newScale:"+newScaleX);
				textfield.fontSize += 1;
			});
		}
		//#endregion

		//#region Public Methods
		this.log = function (string)
		{
			switch (typeof string)
			{
				case "number":
				case "string":
				case "boolean":
					if (collapse)
					{
						for (var i = 0; i < lines.length; i++)
						{
							if (lines[i].type == "logObject")
							{
								if (lines[i].string == string)
								{
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
					try
					{
						string.pinLastValue();
						var log = new logObject(string.pinLastValue());
						lines.push(log);
						refreshConsole();
					} catch (err)
					{
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
		};

		this.watch = function (name, signal)
		{
			if (typeof signal == "function")
			{
				try
				{
					signal.pinLastValue();
					var log = new signalObject(name, signal);
					lines.push(log);

					refreshConsole();

					if (autoRefreshInterval == null)
					{
						autoRefreshInterval = Time$1.setInterval(() => { refreshConsole(); }, 100);
					}
				} catch (err)
				{
					var log = new logObject(name + ": [not a signal]");
					lines.push(log);
					refreshConsole();
				}

			} else
			{
				var log = new logObject(name + ": [not a signal]");
				lines.push(log);
				refreshConsole();
			}
		};

		this.clear = function ()
		{
			scrollStartAt = null;
			textfield.text = "";
			lines = [];
			startAt = 0;
		};

		this.scrollToTop = function ()
		{
			scrollStartAt = 0;
		};

		this.scrollUp = function ()
		{
			if (scrollStartAt != null)
			{
				scrollStartAt--;
			} else
			{
				scrollStartAt = lines.length - maxLines - 1;
			}
			if (scrollStartAt < 0) scrollStartAt = 0;
		};

		this.scrollDown = function ()
		{
			if (scrollStartAt != null)
			{
				scrollStartAt++;
			} else
			{
				scrollStartAt = lines.length - maxLines + 1;
			}
			if (scrollStartAt > lines.length - maxLines)
			{
				scrollStartAt = null;
			}
		};

		this.scrollToBottom = function ()
		{
			scrollStartAt = null;
		};

		/**
		 * Adds a button that will connects to a function when tapped on
		 */
		this.addButton = (buttonObj, clickFunc) =>
		{
			if (buttonObj == null || clickFunc == null) return;
			TouchGestures.onTap(buttonObj).subscribe(e =>
			{
				clickFunc();
			});
		};
		//#endregion

		// #region Private Methods
		var refreshConsole = function ()
		{
			if (!keepLog)
			{
				while (lines.length > maxLines)
				{
					lines.shift();
				}
			} else
			{
				if (lines.length < maxLines)
				{
					startAt = 0;
				} else
				{
					startAt = lines.length - maxLines;
				}
				// if(startAt)
			}

			var newText = "";

			for (var i = (lines.length > maxLines) ? maxLines - 1 : lines.length - 1; i >= 0; i--)
			{

				var index = i + startAt;
				if (scrollStartAt != null)
				{
					index = i + scrollStartAt;
				}

				if (lines[index].type == "logObject")
				{
					newText += ">>>" + ((lines[index].count <= 1) ? "   " : "[" + lines[index].count + "]") + " " + lines[index].string + "\n";
				} else if (lines[index].type = "signalObject")
				{
					newText += "<O>    " + lines[index].name + ":" + lines[index].signal.pinLastValue() + "\n";
				}
			}
			textfield.text = newText;

			var containsSignal = false;
			for (var i = lines.length - 1; i >= 0; i--)
			{
				if (lines[i].type == "signalObject")
				{
					containsSignal = true;
				}
			}
			if (!containsSignal)
			{
				if (autoRefreshInterval != null)
				{
					Time$1.clearInterval(autoRefreshInterval);
				}
			}
		};
		//#endregion

		//#region Classes
		class logObject
		{
			constructor(string)
			{
				this.type = "logObject";
				this.string = string;
				this.count = 1;
			}

			addCount()
			{
				this.count++;
			}
		}

		class signalObject
		{
			constructor(name, signal)
			{
				this.type = "signalObject";
				this.name = name;
				this.signal = signal;
			}
		}
		//#endregion
	}
}

// Spark AR:

module.exports = {
	ARTween, Ease, Delay, Math2, ARFaceGestures, ObjectFinder, CustomConsole
};
