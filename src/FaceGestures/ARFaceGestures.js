const FaceTracking = require('FaceTracking');
const FaceGestures = require('FaceGestures');

/**
 * Baseclasses for the FaceGestures
 */
class ARFaceBaseBoolGesture {
    constructor(faceID, startCallback, stopCallback) {
        this.faceTracker = FaceTracking.face(faceID);
        this.startCallback = startCallback;
        this.stopCallback = stopCallback;
        this.subscribe = null;
    }

    stop() { if (this.subscribe) this.subscribe.unsubscribe(); }
}

class ARFaceBaseEventGesture {
    constructor(faceID, eventCallback) {
        this.faceTracker = FaceTracking.face(faceID);
        this.eventCallback = eventCallback;
        this.subscribe = null;
    }

    stop() { if (this.subscribe) this.subscribe.unsubscribe(); }
}

/**
config:
{lipMix:0, threshold: 0, backlash:0}

lipMix: 0 is lower lip only, 1.0 is upper lip only
threshold:
backlash:
 */
class ARSmile extends ARFaceBaseBoolGesture {
    constructor(faceID, startCallback, stopCallback) {
        super(faceID, startCallback, stopCallback);
        this.config = { lipMix: 0.5, threshold: 0, backlash: 0 };
    }

    start() {
        this.subscribe = FaceGestures.isSmiling(this.faceTracker, this.config).monitor().subscribe(
            (e) => { e.newValue ? this.startCallback() : this.stopCallback() }
        );
    }
}

/**
 * 
 */
class ARSurprised extends ARFaceBaseBoolGesture {
    start() {
        this.subscribe = FaceGestures.isSurprised(this.faceTracker).monitor().subscribe(
            (e) => { e.newValue ? this.startCallback() : this.stopCallback() }
        );
    }
}

/**
config:
{angle:1, period: 100, swing:5}

angle: The minimum rotation for one swing, in radians
period: The maximum time limit for one swing, in milliseconds
swing: The count of consecutive alternating swings after which the gesture is detected
 */
class ARShake extends ARFaceBaseEventGesture {
    start() {
        this.subscribe = FaceGestures.onShake(this.faceTracker).subscribe(
            () => { this.eventCallback(); }
        );
    }
}

/**
config:
{angle:1, period: 100, swing:5}

angle: The minimum rotation for one swing, in radians
period: The maximum time limit for one swing, in milliseconds
swing: The count of consecutive alternating swings after which the gesture is detected
 */
class ARNod extends ARFaceBaseEventGesture {
    start() {
        this.subscribe = FaceGestures.onNod(this.faceTracker).subscribe(
            () => { this.eventCallback(); }
        );
    }
}

/**
config:
{lipMix:0, threshold: 0, backlash:0}

lipMix: 0 is lower lip only, 1.0 is upper lip only
threshold:
backlash:
 */
class ARBlink extends ARFaceBaseEventGesture {
    start() {
        this.subscribe = FaceGestures.onNod(this.faceTracker).subscribe(
            () => { this.eventCallback(); }
        );
    }
}
module.exports = { ARSmile, ARSurprised, ARShake, ARNod, ARBlink }