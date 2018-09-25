import Reactive from 'Reactive';
import Scene from 'Scene';
import console from 'Diagnostics';

export default class {
    constructor(UIObject, parentCanvas, worldObject, onlyInitialPosition) {

		if(onlyInitialPosition == false) {
			worldObject.transform.x = UIObject.transform.x.add(UIObject.bounds.x).add(UIObject.bounds.width.div(2)).sub(parentCanvas.width.lastValue/2);
			worldObject.transform.y = UIObject.transform.y.add(UIObject.bounds.y).add(UIObject.bounds.height.div(2)).add(parentCanvas.height.lastValue/4);
		} else {
			worldObject.transform.x = UIObject.bounds.x.add(UIObject.bounds.width.div(2)).sub(parentCanvas.width.lastValue/2);
			worldObject.transform.y = UIObject.bounds.y.add(UIObject.bounds.height.div(2)).add(parentCanvas.height.lastValue/4);
		}
        // var worldWidth;
		// var worldHeight;
		// var aspect;
		// var canvasHeight = parentCanvas.height.lastValue;
        // var canvasWidth = parentCanvas.width.lastValue;
        
        // if(onlyInitialPosition == null) {
        //     onlyInitialPosition = false;
        // }
        
		// var startedInPortrait = true;
        
		// console.log("width: " + canvasWidth + " - height: " + canvasHeight);
		// var landscape = this.isLandscapeMode();
		// landscape.monitor().subscribe(function() {
        //     //Landscape
		// 	if(landscape.lastValue) {
        //         if(startedInPortrait) {
        //             aspect = parentCanvas.height.lastValue / parentCanvas.width.lastValue;
		// 			worldWidth = Reactive.val(66.6);
		// 			worldHeight = worldWidth.div(aspect);
                    
		// 			canvasHeight = parentCanvas.width.lastValue;
		// 			canvasWidth = parentCanvas.height.lastValue;
		// 		} else {
        //             aspect = parentCanvas.width.lastValue / parentCanvas.height.lastValue;
		// 			worldWidth = Reactive.val(66.6);
		// 			worldHeight = worldWidth.div(aspect);
                    
		// 			canvasHeight = parentCanvas.height.lastValue;
		// 			canvasWidth = parentCanvas.width.lastValue;
		// 		}
                
		// 		console.log("width: " + canvasWidth + " - height: " + canvasHeight + " - aspect: " + aspect);
        //         //Portrait
		// 	} else {
        //         if(startedInPortrait) {
        //             aspect = parentCanvas.width.lastValue / parentCanvas.height.lastValue;
		// 			worldHeight = Reactive.val(50);
		// 			worldWidth = worldHeight.mul(aspect);
					
		// 			canvasHeight = parentCanvas.height.lastValue;
		// 			canvasWidth = parentCanvas.width.lastValue;
		// 		} else {
        //             aspect = parentCanvas.height.lastValue / parentCanvas.width.lastValue;
		// 			worldHeight = Reactive.val(50);
		// 			worldWidth = worldHeight.mul(aspect);
                    
		// 			canvasHeight = parentCanvas.width.lastValue;
		// 			canvasWidth = parentCanvas.height.lastValue;
		// 		}
                
		// 		console.log("width: " + canvasWidth + " - height: " + canvasHeight + " - aspect: " + aspect);
		// 	}
		// 	//Set Values
		// 	var centerOffsetY = UIObject.bounds.height.div(2);
		// 	var centerOffsetX = UIObject.bounds.width.div(2);
            
        //     if(onlyInitialPosition == false) {
        //         var positionX = UIObject.bounds.x.sum(centerOffsetX).sub(UIObject.transform.x).div(canvasWidth).mul(worldWidth.mul(-1)).sum(worldWidth.div(2));
        //         var positionY = UIObject.bounds.y.sum(centerOffsetY).sub(UIObject.transform.y).div(canvasHeight).mul(worldHeight.mul(-1)).sum(worldHeight.div(2));
        //     } else {
        //         var positionX = UIObject.bounds.x.sum(centerOffsetX).div(canvasWidth).mul(worldWidth.mul(-1)).sum(worldWidth.div(2));
        //         var positionY = UIObject.bounds.y.sum(centerOffsetY).div(canvasHeight).mul(worldHeight.mul(-1)).sum(worldHeight.div(2));
        //     }

		// 	worldObject.transform.x = positionX;
		// 	worldObject.transform.y = positionY;
		// 	worldObject.transform.z = 0;
		// }.bind(this));
        
		// //If PortraitMode
		// if(parentCanvas.width.lastValue >= parentCanvas.height.lastValue) {
        //     startedInPortrait = false;
		// 	aspect = parentCanvas.width.lastValue / parentCanvas.height.lastValue;
		// 	worldWidth = Reactive.val(66.6);
		// 	worldHeight = worldWidth.div(aspect);
		// } else {
        //     startedInPortrait = true;
		// 	aspect = parentCanvas.width.lastValue / parentCanvas.height.lastValue;
		// 	worldHeight = Reactive.val(50);
		// 	worldWidth = worldHeight.mul(aspect);
		// }
        
		// //Set first time
		// var centerOffsetY = UIObject.bounds.height.div(2);
		// var centerOffsetX = UIObject.bounds.width.div(2);
        
        // if(onlyInitialPosition == false) {
        //     var positionX = UIObject.bounds.x.sum(centerOffsetX).sub(UIObject.transform.x).div(canvasWidth).mul(worldWidth.mul(-1)).sum(worldWidth.div(2));
        //     var positionY = UIObject.bounds.y.sum(centerOffsetY).sub(UIObject.transform.y).div(canvasHeight).mul(worldHeight.mul(-1)).sum(worldHeight.div(2));
        // } else {
        //     var positionX = UIObject.bounds.x.sum(centerOffsetX).div(canvasWidth).mul(worldWidth.mul(-1)).sum(worldWidth.div(2));
        //     var positionY = UIObject.bounds.y.sum(centerOffsetY).div(canvasHeight).mul(worldHeight.mul(-1)).sum(worldHeight.div(2));
        // }
        
		// worldObject.transform.x = positionX;
		// worldObject.transform.y = positionY;
		// worldObject.transform.z = 0;
    }

    isLandscapeMode() {
		var camera = Scene.root.find("Camera");
		var landscape = Reactive.ge(camera.focalPlane.width,camera.focalPlane.height);

		return landscape;
	}
}