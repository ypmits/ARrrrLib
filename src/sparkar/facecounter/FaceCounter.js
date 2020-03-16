export default class FaceCounter {
	constructor(countFunc = null) {
		this.countFunc = countFunc;
	}

	Start() {
		this.faceTrackingCount = FaceTracking.count;
		this.faceTrackingCount.monitor({ fireOnInitialValue: true }).subscribe((e) => {
			if (this.countFunc != null) this.countFunc(e.newValue);
		});
	}

	Stop() {
		this.faceTrackingCount = null;
	}
}