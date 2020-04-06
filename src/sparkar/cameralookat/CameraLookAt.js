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

		this.log = str => {
			if(this.obj.debug) Diagnostics.log(str);
		}
		/**
		 * This function will bind all the necessary parameters so you can use it
		 */
		this.doWatch = () =>
		{
			Diagnostics.log("[CameraLookAt] doWatch:" + this.objToWatch);
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
			]).monitor({ fireOnInitialValue: false }).subscribe(e => {this.subscribeFunc(e)});
		}

		/**
		 * Loads an object based on a search-string:
		 */
		this.loadObj = str =>
		{
			this.log(`[CameraLookAt] findObjectFromString: \"${str}\"`);
			return Scene.root.findFirst(str).then(foundObj => {
				this.objToWatch = foundObj;
				this.log(`[CameraLookAt] loaded Object: ${this.objToWatch} isReady: ${this.isReady}`);
				if (this.isReady) this.doWatch();
			});
		}

		/**
		 * Will watch an object
		 */
		this.watch = (str, subscribeFunc) =>
		{
			this.subscribeFunc = subscribeFunc;
			this.log(`[CameraLookAt] watch: ${str}`);
			this.loadObj(str);
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
				this.log(`camDir: ${camDirObj}`);
				this.log(`debug: ${debugCam}`);
				
				
				// Get Camera rotation from direction:
				this.camRotY = Reactive.atan2(Reactive.sqrt(Reactive.sum(camDirObj.worldTransform.x.pow(2), camDirObj.worldTransform.z.pow(2))), camDirObj.worldTransform.y).mul(-180 / Math.PI).add(90).mul(-1);//cameraDirectionObject.worldTransform.y.mul(-90);
				this.camRotXZ = Reactive.atan2(camDirObj.worldTransform.x.mul(-1), camDirObj.worldTransform.z.mul(-1)).mul(180 / Math.PI);
				this.camRotXZBack = Reactive.atan2(camDirObj.worldTransform.x, camDirObj.worldTransform.z).mul(180 / Math.PI);

				this.log("cam: " + camDirObj.name);
				this.log("debug: " + debugCam == null ? "null" : debugCam);
				this.log("radius: " + this.obj.radius);
				this.log("cameraRotationY: " + this.camRotY.pinLastValue());
				this.log("cameraRotationXZ: " + this.camRotXZ.pinLastValue());
				this.log("cameraRotationXZBack: " + this.camRotXZBack.pinLastValue());

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