import Scene from 'Scene';
import Diagnostics from 'Diagnostics';
import Animation from 'Animation';
import Reactive from 'Reactive';
import Time from 'Time';

export default class {
	/**
	 * Example:
		var rect = Scene.root.find("rect");
		var tween = ARrrrTween(rect, [{x:0, duration: 2000},{y: 100, duration: 2000}, {rotationZ: 360, duration: 2000}, {scaleX: 2, duration: 2000}, {scaleY: 20, duration: 2000}]).onComplete(function(){
			Diagnostics.log("Done!");
		});
	 */
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
		}

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
		}

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
		}

		this.pause = function () {
			this.StopPlaying();

			return this;
		}

		this.reset = function() {
			this.isPlaying = false;
			this.started = false;
			this.finished = false;

			this.animations.forEach(animation => {
				animation.driver.reset();
			});

			this.AssignSignals();
		}
		
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
					driver.onCompleted().subscribe(function () {
						if(this.isPlaying) {
							callback();
						}
					}.bind(this));
				}
			}

			return this;
		}

		return this;
	}

	StartTween()
	{
		//Set offsets
		if(this.object.transform != null) {
			this.offset.transform.x = this.object.transform.x.lastValue;
			this.offset.transform.y = this.object.transform.y.lastValue;
			this.offset.transform.z = this.object.transform.z.lastValue;
			this.offset.transform.rotationX = this.object.transform.rotationX.lastValue;
			this.offset.transform.rotationY = this.object.transform.rotationY.lastValue;
			this.offset.transform.rotationZ = this.object.transform.rotationZ.lastValue;
			this.offset.transform.scaleX = this.object.transform.scaleX.lastValue;
			this.offset.transform.scaleY = this.object.transform.scaleY.lastValue;
			this.offset.transform.scaleZ = this.object.transform.scaleZ.lastValue;
			if(this.object.text == null) {
				if(this.object.material != null) {
					this.offset.material.opacity = this.object.material.opacity.lastValue;
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

			this.EvaluateData(valuesElement)
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

		var value = null;

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

		AnimationDriver.onCompleted().subscribe(function(){
			if(this.isPlaying) {
				onComplete();
			}
		}.bind(this));
		AnimationDriver.onAfterIteration().subscribe(onIteration);

		this.animations.push({ id: id, signal: signal, duration: duration, delay: delay, driver: AnimationDriver, onStart: onStart });
	}

	CheckValue(data ,offset, isRotation) {
		var startEnd = {
			start: 0,
			end: 0
		}

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
				driver.onCompleted().subscribe(function(){
					if(this.isPlaying) {
						this.finished = true;
						this.started = false;
					}
				}.bind(this));
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