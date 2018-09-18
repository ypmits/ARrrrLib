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
			autoplay: true
		}

		this.animations = [];
		
		this.StartTween();

		//Functions
		this.start = function () {
			if(this.finished) {
				this.started = false;
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
						callback();
					});
				}
			}

			return this;
		}

		return this;
	}

	StartTween()
	{
		//Set offsets
		this.offset.transform.x = this.object.transform.x.lastValue;
		this.offset.transform.y = this.object.transform.y.lastValue;
		this.offset.transform.z = this.object.transform.z.lastValue;
		this.offset.transform.rotationX = this.object.transform.rotationX.lastValue;
		this.offset.transform.rotationY = this.object.transform.rotationY.lastValue;
		this.offset.transform.rotationZ = this.object.transform.rotationZ.lastValue;
		this.offset.transform.scaleX = this.object.transform.scaleX.lastValue;
		this.offset.transform.scaleY = this.object.transform.scaleY.lastValue;
		this.offset.transform.scaleZ = this.object.transform.scaleZ.lastValue;
		this.offset.material.opacity = this.object.material.opacity.lastValue;
		
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
		var x = Reactive.val(this.offset.transform.x);
		var y = Reactive.val(this.offset.transform.y);
		var z = Reactive.val(this.offset.transform.z);

		var useX = false;
		var useY = false;
		var useZ = false;

		var xSizeOffset = Reactive.val(0);
		var ySizeOffset = Reactive.val(0);
		var zSizeOffset = Reactive.val(0);

		var xRotationOffset = Reactive.val(0);
		var yRotationOffset = Reactive.val(0);

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

				xRotationOffset = Reactive.cos(animation.signal.sub(angle)).mul(h).add(this.object.bounds.width.div(2).mul(scaleX));
				yRotationOffset = Reactive.sin(animation.signal.sub(angle)).mul(h).add(this.object.bounds.height.div(2).mul(scaleY));
				this.object.transform.rotationZ = animation.signal;
			}
			//RotationX
			if (animation.id == "rotationX") {
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

				xRotationOffset = Reactive.cos(animation.signal.sub(angle)).mul(h).add(this.object.bounds.width.div(2).mul(scaleX));
				yRotationOffset = Reactive.sin(animation.signal.sub(angle)).mul(h).add(this.object.bounds.height.div(2).mul(scaleY));
				this.object.transform.rotationZ = animation.signal;
			}
			//ScaleX
			if (animation.id == "scaleX") {
				useX = true;

				xSizeOffset = this.object.bounds.width.div(2).sub(this.object.bounds.width.div(2).mul(animation.signal));
				this.object.transform.scaleX = animation.signal;
			}
			//ScaleY
			if (animation.id == "scaleY") {
				useY = true;

				ySizeOffset = this.object.bounds.height.div(2).sub(this.object.bounds.height.div(2).mul(animation.signal));
				this.object.transform.scaleY = animation.signal;
			}

			//Opacity
			if(animation.id == "opacity") {
				this.object.material.opacity = animation.signal;
			}
		});

		if(useX) {
			this.object.transform.x = x.add(xSizeOffset).add(xRotationOffset);
		}
		if(useY){
			this.object.transform.y = y.add(ySizeOffset).add(yRotationOffset);
		}
		if(useZ) {
			this.object.transform.z = z;
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

		var signal = Reactive.val(0);

		//Animatable
		//Move
		if (data.x != null) {
			id = "x";
			start = this.offset.transform.x;
			end = this.offset.transform.x + data.x;
		}
		if (data.y != null) {
			id = "y";
			start = this.offset.transform.y;
			end = this.offset.transform.y + data.y;
		}
		if (data.z != null) {
			id = "z";
			start = this.offset.transform.z;
			end = this.offset.transform.z + data.z;
		}
		//Rotate
		if (data.rotationX != null) {
			id = "rotationX";
			start = this.offset.transform.rotationX;
			end = this.offset.transform.rotationX + DegToRad(data.rotationX);
		}
		if (data.rotationY != null) {
			id = "rotationY";
			start = this.offset.transform.rotationY;
			end = this.offset.transform.rotationY + DegToRad(data.rotationY);
		}
		if (data.rotationZ != null) {
			id = "rotationZ";
			start = this.offset.transform.rotationZ;
			end = this.offset.transform.rotationZ + DegToRad(data.rotationZ);
		}
		//Scale
		if (data.scaleX != null) {
			id = "scaleX";
			start = this.offset.transform.scaleX;
			end = this.offset.transform.scaleX + data.scaleX;
		}
		if (data.scaleY != null) {
			id = "scaleY";
			start = this.offset.transform.scaleY;
			end = this.offset.transform.scaleX + data.scaleY;
		}
		if (data.scaleZ != null) {
			id = "scaleZ";
			start = this.offset.transform.scaleZ;
			end = this.offset.transform.scaleX + data.scaleZ;
		}
		//Material
		if (data.opacity != null) {
			id = "opacity";
			start = this.offset.material.opacity;
			end = data.opacity;
		}

		//Controls
		//Duration
		if (data.duration != null) {
			duration = data.duration;
		}
		//Loops
		if (data.loopCount != null) {
			loopCount = data.loopCount;
		}
		//Mirror
		if (data.mirror != null) {
			mirror = data.mirror;
		}
		//Ease
		if (data.ease != null) {
			ease = data.ease;
		}
		//Delay
		if(data.delay != null) {
			delay = data.delay;
		}

		var AnimationDriver = Animation.timeDriver({ durationMilliseconds: duration, loopCount: loopCount, mirror: mirror });
		var AnimationValue = Animation.samplers[ease](start, end);
		var Animate = Animation.animate(AnimationDriver, AnimationValue);

		signal = Animate;

		this.animations.push({ id: id, signal: signal, duration: duration, delay: delay, driver: AnimationDriver });
	}

	StartPlaying() {
		Diagnostics.log("play");
		if(this.started) {
			Diagnostics.log("play old");
			//Resume playing
			this.animations.forEach(anim => {
				anim.driver.start();
			});
		} else {
			Diagnostics.log("start new")
			Diagnostics.log(this.animations);
			//First time started
			this.AssignSignals();

			var longestDuration = 0;
			var driver = null;

			this.animations.forEach(anim => {
				if (longestDuration < (anim.duration + anim.delay)) {
					longestDuration = anim.duration + anim.delay;
					driver = anim.driver;
				}

				if(anim.delay == 0) {
					anim.driver.start();
				} else {
					Time.setTimeout(function(){
						anim.driver.start();
					},anim.delay);
				}
			});

			//if finished
			if (driver != null) {
				driver.onCompleted().subscribe(function(){
					this.finished = true;
					this.started = false;
					this.animations = [];
				}.bind(this));
			}

			this.started = true;
		}
	}

	StopPlaying() {
		this.animations.forEach(anim => {
			anim.driver.stop();
		});
	}

	DegToRad(deg)
	{
		return (deg * Math.PI) / 180.0;
	}
}