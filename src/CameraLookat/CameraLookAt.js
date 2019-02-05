import Scene from 'Scene';
import Reactive from 'Reactive';
import Diagnostics from 'Diagnostics';

export default class CameraLookAt {
   constructor(radius, debug) {
      //Get camera diraction from null object attached to the camera
      let direction;
      try {
      direction = Scene.root.find("cameraDirection");
      } catch(e) {
      Diagnostics.log(`[error] could not find object called 'cameraDirection' for the CameraLookAt class, make sure to read the documentation on github before using`);
      }
      
      //Get Camera rotation from direction
      this.cameraRotationY = Reactive.atan2(Reactive.sqrt(Reactive.sum(direction.worldTransform.x.pow(2), direction.worldTransform.z.pow(2))),direction.worldTransform.y).mul(-180/Math.PI).add(90).mul(-1);//direction.worldTransform.y.mul(-90);
      this.cameraRotationXZ = Reactive.atan2(direction.worldTransform.x.mul(-1),direction.worldTransform.z.mul(-1)).mul(180/Math.PI);
      this.cameraRotationXZBack = Reactive.atan2(direction.worldTransform.x,direction.worldTransform.z).mul(180/Math.PI);

      this.radius = radius;

      if(debug === true) {
         try {
         this.debug = Scene.root.find("debugDrawer");
         this.debug.angleInner = 0;
         this.debug.angleOuter = this.radius * Math.PI / 180;
         this.debug.intensity = 0;
         } catch(e) {
            Diagnostics.log(`[warning] something went wrong with the 'debugDrawer' for the CameraLookAt class, make sure to read to documentation on github to see how to use it`);
         }
      }
   }

   watch(object) {
      let objectAngleXZ = Reactive.atan2(object.worldTransform.x, object.worldTransform.z).mul(180/Math.PI);
      let objectAngleXZBack = Reactive.atan2(object.worldTransform.x.mul(-1), object.worldTransform.z.mul(-1)).mul(180/Math.PI);
      let objectAngleY = Reactive.atan2(Reactive.sqrt(Reactive.sum(object.worldTransform.x.pow(2), object.worldTransform.z.pow(2))),object.worldTransform.y).mul(-180/Math.PI).add(90);

      return Reactive.andList([
         // vertical
         Reactive.lt(objectAngleY, this.cameraRotationY.add(this.radius/2)),
         Reactive.gt(objectAngleY, this.cameraRotationY.sub(this.radius/2)),
         // horizontal
         Reactive.or(
            //Use front size
            Reactive.andList([
                  Reactive.lt(Reactive.abs(objectAngleXZ).sum(Reactive.abs(this.radius/2)), 180),
                  Reactive.lt(objectAngleXZ, this.cameraRotationXZ.add(this.radius/2)),
                  Reactive.gt(objectAngleXZ, this.cameraRotationXZ.sub(this.radius/2)),
            ]),
            //Use back side
            Reactive.andList([
                  Reactive.ge(Reactive.abs(objectAngleXZ).sum(Reactive.abs(this.radius/2)), 180),
                  Reactive.lt(objectAngleXZBack, this.cameraRotationXZBack.add(this.radius/2)),
                  Reactive.gt(objectAngleXZBack, this.cameraRotationXZBack.sub(this.radius/2)),
            ])
         )
      ]);
   }
}