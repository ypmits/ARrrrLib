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
			e => { e.newValue ? this.startCallback() : this.stopCallback() }
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
			e => { e.newValue ? this.startCallback() : this.stopCallback() }
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
			e => { e.newValue ? this.startCallback() : this.stopCallback() }
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
			e => { e.newValue ? this.startCallback() : this.stopCallback() }
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
			e => { e.newValue ? this.startCallback() : this.stopCallback() }
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
			e => { e.newValue ? this.startCallback() : this.stopCallback() }
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
			e => { e.newValue ? this.startCallback() : this.stopCallback() }
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
export default {
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
}