import Scene from 'Scene';
import Reactive from 'Reactive';
import Diagnostics from 'Diagnostics';

/**
CameraLookAt is a api for Spark AR Studio that checks if the user is looking at an object.
This class will check if the pivot of sceneObjects is inside of the radius (so not the bounds)

Before you can use it, you have to create a null object inside of the camera (but outside of the focal distance!).
Name this object 'cameraDirection' and give it a z-position of 1.

parameter:
obj: {
	radius: the radius of the trigger
	debug: will console.log all kinds of important information. default: false
	cameraDirectionObjectName: default: "cameraDirection"
	debugDrawerName: default: "debugDrawer"
}

example:
var obj = {
	radius: 3
}
var cla = new CameraLookAt(obj);
*/
export default class CameraLookAt
{
	constructor(obj = null)
	{
		this.objToWatch = null;
		this.isReady = false;
		this.subscribeFunc = null;

		this.log = str => {
			if(this.obj.debug) Diagnostics.log(str);
		}
		/**
		 * This function will bind all the necessary parameters so you can use it
		 */
		this.doWatch = () =>
		{
			if(obj.log) obj.log("[object CameraLookAt] doWatch:" + this.objToWatch);
			this.loadObj(this.objToWatch);
			let objectAngleXZ = Reactive.atan2(this.objToWatch.worldTransform.x, this.objToWatch.worldTransform.z).mul(180 / Math.PI);
			let objectAngleXZBack = Reactive.atan2(this.objToWatch.worldTransform.x.mul(-1), this.objToWatch.worldTransform.z.mul(-1)).mul(180 / Math.PI);
			let objectAngleY = Reactive.atan2(Reactive.sqrt(Reactive.sum(this.objToWatch.worldTransform.x.pow(2), this.objToWatch.worldTransform.z.pow(2))), this.objToWatch.worldTransform.y).mul(-180 / Math.PI).add(90);

			Reactive.andList([
				// vertical
				Reactive.lt(objectAngleY, this.camRotY.add(this.obj.radius / 2)),
				Reactive.gt(objectAngleY, this.camRotY.sub(this.obj.radius / 2)),
				// horizontal
				Reactive.or(
					//Use front size
					Reactive.andList([
						Reactive.lt(Reactive.abs(objectAngleXZ).sum(Reactive.abs(this.obj.radius / 2)), 180),
						Reactive.lt(objectAngleXZ, this.camRotXZ.add(this.obj.radius / 2)),
						Reactive.gt(objectAngleXZ, this.camRotXZ.sub(this.obj.radius / 2)),
					]),
					//Use back side
					Reactive.andList([
						Reactive.ge(Reactive.abs(objectAngleXZ).sum(Reactive.abs(this.obj.radius / 2)), 180),
						Reactive.lt(objectAngleXZBack, this.camRotXZBack.add(this.obj.radius / 2)),
						Reactive.gt(objectAngleXZBack, this.camRotXZBack.sub(this.obj.radius / 2)),
					])
				)
			]).monitor().subscribe(e => {this.subscribeFunc(e)});
			// ]).monitor({ fireOnInitialValue: false }).subscribe(e => {this.subscribeFunc(e)});
		}

		/**
		 * Loads an object based on a search-string:
		 */
		this.loadObj = str =>
		{
			// if(obj.log) obj.log(`[object CameraLookAt] findObjectFromString: \"${str}\"`);
			Scene.root.findFirst(str).then(foundObj => {
				this.objToWatch = foundObj;
				// if(obj.log) obj.log(`[object CameraLookAt] loaded Object: ${this.objToWatch} isReady: ${this.isReady}`);
				if (this.isReady) this.doWatch();
			});
		}

		/**
		 * Will watch an object
		 */
		this.watch = (objectName, subscribeFunc) =>
		{
			this.subscribeFunc = subscribeFunc;
			// if(obj.log) obj.log(`[object CameraLookAt] watch: ${objectName}`);
			this.loadObj(objectName);
		}

		this.obj = obj != null ? obj : {};
		this.obj.radius = this.obj.radius ? this.obj.radius : 10;
		var findCamDir = Scene.root.findFirst(this.obj.cameraDirectionObjectName ? this.obj.cameraDirectionObjectName : "cameraDirection");
		var findDebug = Scene.root.findFirst(this.obj.debugDrawerName ? this.obj.debugDrawerName : "debugDrawer");
		Promise.all([findCamDir, findDebug]).then(
			values =>
			{
				var camDirObj = values[0];
				var debugCam = values[1] == null ? null : values[1];
				
				// Get Camera rotation from direction:
				this.camRotY = Reactive.atan2(Reactive.sqrt(Reactive.sum(camDirObj.worldTransform.x.pow(2), camDirObj.worldTransform.z.pow(2))), camDirObj.worldTransform.y).mul(-180 / Math.PI).add(90).mul(-1);//cameraDirectionObject.worldTransform.y.mul(-90);
				this.camRotXZ = Reactive.atan2(camDirObj.worldTransform.x.mul(-1), camDirObj.worldTransform.z.mul(-1)).mul(180 / Math.PI);
				this.camRotXZBack = Reactive.atan2(camDirObj.worldTransform.x, camDirObj.worldTransform.z).mul(180 / Math.PI);

				if(obj.log)
				{
					// obj.log("cam: " + camDirObj.name);
					// obj.log("debug: " + debugCam == null ? "null" : debugCam);
					// obj.log("radius: " + this.obj.radius);
					// obj.log("cameraRotationY: " + this.camRotY.pinLastValue());
					// obj.log("cameraRotationXZ: " + this.camRotXZ.pinLastValue());
					// obj.log("cameraRotationXZBack: " + this.camRotXZBack.pinLastValue());
				}
				
				if(debugCam != null)
				{
					debugCam.angleInner = 0;
					debugCam.angleOuter = this.obj.radius * Math.PI / 180;
					debugCam.intensity = 0;
				}
				else
				{
					this.log(`[WARNING] there is no 'debugger' inside the scene, make sure to read to documentation on github to see how to use it`);
				}
				this.isReady = true;
				if (this.objToWatch != null) this.doWatch();
			},
			e =>
			{
				this.log("CameraLookAt went wrong!" + e);
			}
		)
	}
}