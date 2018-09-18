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
	constructor(object, values) {
		//Set values and controls
		this.object = object;
		this.values = values;

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
			materials: {
				opacity: 1
			}
		}

		this.defaultControls = {
			duration: 500,
			loopCount: 1,
			mirror: false,
			ease: "easeInOutCubic",
			delay: 0
		}

		this.animations = [];
		
		this.StartTween();
		this.AssignSignals();
		// Diagnostics.log("ARrrrTween");

		//Functions
		this.onComplete = function (callback) {

			if (callback && typeof (callback) === "function") {

				var longestDuration = 0;
				var driver = null;
				this.animations.forEach(anim => {
					if (longestDuration < anim.duration) {
						longestDuration = anim.duration;
						driver = anim.driver;
					}
				});

				if (driver != null) {
					driver.onCompleted().subscribe(function () {
						callback();
					});
				}
			}
		}
	}

	StartTween()
	{
		//var driver = Animation.timeDriver({durationMilliseconds: this.defaultControls.duration, loopCount: this.defaultControls.loopCount, mirror: this.defaultControls.mirror});
		if (Array.isArray(this.values) == false) {
			this.EvaluateData(this.values)
			return;
		}

		this.values.forEach(valuesElement => {
			this.EvaluateData(valuesElement)
		});
	}

	AssignSignals() {
		var x = Reactive.val(0);
		var y = Reactive.val(0);
		var z = Reactive.val(0);

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
			}
			//MoveY
			if (animation.id == "y") {
				y = animation.signal;
			}
			//MoveZ
			if (animation.id == "z") {
				z = animation.signal;
			}

			//RotationZ
			if (animation.id == "rotationZ") {
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
				xSizeOffset = this.object.bounds.width.div(2).sub(this.object.bounds.width.div(2).mul(animation.signal));
				this.object.transform.scaleX = animation.signal;
			}
			//ScaleY
			if (animation.id == "scaleY") {
				ySizeOffset = this.object.bounds.height.div(2).sub(this.object.bounds.height.div(2).mul(animation.signal));
				this.object.transform.scaleY = animation.signal;
			}
		});

		this.object.transform.x = x.add(xSizeOffset).add(xRotationOffset);
		this.object.transform.y = y.add(ySizeOffset).add(yRotationOffset);
		this.object.transform.z = z;
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
			end = data.x;
		}
		if (data.y != null) {
			id = "y";
			start = this.offset.transform.y;
			end = data.y;
		}
		if (data.z != null) {
			id = "z";
			start = this.offset.transform.z;
			end = data.z;
		}
		//Rotate
		if (data.rotationX != null) {
			id = "rotationX";
			start = this.offset.transform.rotationX;
			end = DegToRad(data.rotationX);
		}
		if (data.rotationY != null) {
			id = "rotationY";
			start = this.offset.transform.rotationY;
			end = DegToRad(data.rotationY);
		}
		if (data.rotationZ != null) {
			id = "rotationZ";
			start = this.offset.transform.rotationZ;
			end = DegToRad(data.rotationZ);
		}
		//Scale
		if (data.scaleX != null) {
			id = "scaleX";
			start = this.offset.transform.scaleX;
			end = data.scaleX;
		}
		if (data.scaleY != null) {
			id = "scaleY";
			start = this.offset.transform.scaleY;
			end = data.scaleY;
		}
		if (data.scaleZ != null) {
			id = "scaleZ";
			start = this.offset.transform.scaleZ;
			end = data.scaleZ;
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

		if(delay == 0) {
			AnimationDriver.start();
		} else {
			Time.setTimeout(function(){
				AnimationDriver.start();
			},delay);
		}
		this.animations.push({ id: id, signal: signal, duration: duration, driver: AnimationDriver });
	}

	DegToRad(deg)
	{
		return (deg * Math.PI) / 180.0;
	}
}