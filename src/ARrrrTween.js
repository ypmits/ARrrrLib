var Scene = require('Scene');
var Diagnostics = require('Diagnostics');
var Animation = require('Animation');
var Reactive = require('Reactive');

var rect = Scene.root.find("rect");

var tween = ARrrrTween(rect, [{x:0, duration: 2000},{y: 100, duration: 2000}, {rotationZ: 360, duration: 2000}, {scaleX: 2, duration: 2000}, {scaleY: 20, duration: 2000}]).onComplete(function(){
    Diagnostics.log("Done!");
});

function ARrrrTween(object, values) {

    //Set self, values and controls
    var self = {};
    self.object = object;
    self.values = values;

    self.offset = {
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

    self.defaultControls = {
        duration: 500,
        loopCount: 1,
        mirror: false,
        ease: "easeInOutCubic"
    }

    self.animations = [];

    StartTween();
    AssignSignals();

    //Functions
    self.onComplete = function(callback) {

        if (callback && typeof(callback) === "function") {

            var longestDuration = 0;
            var driver = null;
            self.animations.forEach(anim => {
                if(longestDuration < anim.duration) {
                    longestDuration = anim.duration;
                    driver = anim.driver;
                }
            });

            if(driver != null) {
                driver.onCompleted().subscribe(function(){
                    callback();
                });
            }
        }

        return self;
    }

    //Methods
    function StartTween() {
        //var driver = Animation.timeDriver({durationMilliseconds: self.defaultControls.duration, loopCount: self.defaultControls.loopCount, mirror: self.defaultControls.mirror});
        if(Array.isArray(self.values) == false) {
            EvaluateData(self.values)
            return;
        }
        
        self.values.forEach(valuesElement => {
            EvaluateData(valuesElement)
        });       
    }

    function AssignSignals() {
        var x = Reactive.val(0);
        var y = Reactive.val(0);
        var z = Reactive.val(0);

        var xSizeOffset = Reactive.val(0);
        var ySizeOffset = Reactive.val(0);
        var zSizeOffset = Reactive.val(0);

        var xRotationOffset = Reactive.val(0);
        var yRotationOffset = Reactive.val(0);

        //Assign signals and calculate offset
        self.animations.forEach(animation => {
            //MoveX
            if(animation.id == "x") {
                x = animation.signal;
            }
            //MoveY
            if(animation.id == "y") {
                y = animation.signal;
            }
            //MoveZ
            if(animation.id == "z") {
                z = animation.signal;
            }

            //RotationZ
            if(animation.id == "rotationZ") {
                var scaleX = Reactive.val(1);
                var scaleY = Reactive.val(1);
                
                self.animations.forEach(element => {
                    if(element.id == "scaleX") {
                        scaleX = element.signal;
                    }
                    if(element.id == "scaleY") {
                        scaleY = element.signal;
                    }
                });
                var angle = 0;
                var h = 0;

                h = Reactive.sqrt(Reactive.add(self.object.bounds.height.div(2).mul(scaleY).pow(2), self.object.bounds.width.div(2).mul(scaleX).pow(2)));

                angle = Reactive.atan2(self.object.bounds.height.div(2).mul(scaleY).mul(1),self.object.bounds.width.div(2).mul(scaleX).mul(-1));

                xRotationOffset = Reactive.cos(animation.signal.sub(angle)).mul(h).add(self.object.bounds.width.div(2).mul(scaleX));
                yRotationOffset = Reactive.sin(animation.signal.sub(angle)).mul(h).add(self.object.bounds.height.div(2).mul(scaleY));
                self.object.transform.rotationZ = animation.signal;
            }
            //RotationX
            if(animation.id == "rotationX") {
                var scaleX = Reactive.val(1);
                var scaleY = Reactive.val(1);
                
                self.animations.forEach(element => {
                    if(element.id == "scaleX") {
                        scaleX = element.signal;
                    }
                    if(element.id == "scaleY") {
                        scaleY = element.signal;
                    }
                });
                var angle = 0;
                var h = 0;

                h = Reactive.sqrt(Reactive.add(self.object.bounds.height.div(2).mul(scaleY).pow(2), self.object.bounds.width.div(2).mul(scaleX).pow(2)));

                angle = Reactive.atan2(self.object.bounds.height.div(2).mul(scaleY).mul(1),self.object.bounds.width.div(2).mul(scaleX).mul(-1));

                xRotationOffset = Reactive.cos(animation.signal.sub(angle)).mul(h).add(self.object.bounds.width.div(2).mul(scaleX));
                yRotationOffset = Reactive.sin(animation.signal.sub(angle)).mul(h).add(self.object.bounds.height.div(2).mul(scaleY));
                self.object.transform.rotationZ = animation.signal;
            }
            //ScaleX
            if(animation.id == "scaleX") {
                xSizeOffset = self.object.bounds.width.div(2).sub(self.object.bounds.width.div(2).mul(animation.signal));
                self.object.transform.scaleX = animation.signal;
            }
            //ScaleY
            if(animation.id == "scaleY") {
                ySizeOffset = self.object.bounds.height.div(2).sub(self.object.bounds.height.div(2).mul(animation.signal));
                self.object.transform.scaleY = animation.signal;
            }
        });

        self.object.transform.x = x.add(xSizeOffset).add(xRotationOffset);
        self.object.transform.y = y.add(ySizeOffset).add(yRotationOffset);
        self.object.transform.z = z;        
    }

    function EvaluateData(data) {
        //Fields
        var id = "";
        var start = 0;
        var end = 0;
        
        var value = null;

        //Controls
        var duration = self.defaultControls.duration;
        var loopCount = self.defaultControls.loopCount;
        var mirror = self.defaultControls.mirror;
        var ease = self.defaultControls.ease;

        var signal = Reactive.val(0);

        //Animatable
            //Move
        if(data.x != null) {
            id = "x";
            start = self.offset.transform.x;
            end = data.x;
        }
        if(data.y != null) {
            id = "y";
            start = self.offset.transform.y;
            end = data.y;
        }
        if(data.z != null) {
            id = "z";
            start = self.offset.transform.z;
            end = data.z;
        }
            //Rotate
        if(data.rotationX != null) {
            id = "rotationX";
            start = self.offset.transform.rotationX;
            end = DegToRad(data.rotationX);
        }
        if(data.rotationY != null) {
            id = "rotationY";
            start = self.offset.transform.rotationY;
            end = DegToRad(data.rotationY);
        }
        if(data.rotationZ != null) {
            id = "rotationZ";
            start = self.offset.transform.rotationZ;
            end = DegToRad(data.rotationZ);
        }
            //Scale
        if(data.scaleX != null) {
            id = "scaleX";
            start = self.offset.transform.scaleX;
            end = data.scaleX;
        }
        if(data.scaleY != null) {
            id = "scaleY";
            start = self.offset.transform.scaleY;
            end = data.scaleY;
        }
        if(data.scaleZ != null) {
            id = "scaleZ";
            start = self.offset.transform.scaleZ;
            end = data.scaleZ;
        }
            //Material
        if(data.opacity != null) {
            id = "opacity";
            start = self.offset.material.opacity;
            end = data.opacity;
        }

        //Controls
            //Duration
        if(data.duration != null) {
            duration = data.duration;
        }
            //Loops
        if(data.loopCount != null)
        {
            loopCount = data.loopCount;
        }
            //Mirror
        if(data.mirror != null) {
            mirror = data.mirror;
        }
            //Ease
        if(data.ease != null) {
            ease = data.ease;
        }

        var AnimationDriver = Animation.timeDriver({durationMilliseconds: duration, loopCount: loopCount, mirror: mirror});
        var AnimationValue = Animation.samplers[ease](start, end);
        var Animate = Animation.animate(AnimationDriver, AnimationValue);

        signal = Animate;

        AnimationDriver.start();
        
        self.animations.push({id: id, signal: signal, duration:duration, driver: AnimationDriver});
    }

    function DegToRad(deg) {
        return (deg * Math.PI) / 180.0;
    }

    return self;
}