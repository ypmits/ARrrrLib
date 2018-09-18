var Diagnostics = require("Diagnostics");
var Animation = require("Animation");
var Time = require('Time');

function MonkTween(element) 
{
    //Gets self
    var self = {};
    self.element = element;

    //Fields
//Variables
    self.variables = {
        move : {
            x : {
                offset:0,
                duration:0,
                ease:"easeInOutCubic"
            }, 
            y : {
                offset:0,
                duration:0,
                ease:"easeInOutCubic"
            }
        }, 
        rotation : {
            x : {
                offset:0,
                duration:0,
                ease:"easeInOutCubic"
            }
        },
        scale : {
            x : {
                offset:1,
                duration:0,
                ease:"easeInOutCubic"
            }, 
            y : {
                offset:1,
                duration:0,
                ease:"easeInOutCubic"
            }
        }
    }

//Animation Variables
    self.animationValues = {
        drivers : {
            driverMoveX:0,
            driverMoveY:0,
            driverRotate:0,
            driverScaleX:0,
            driverScaleY:0
        },
        values : {
            valueMoveX:0,
            valueMoveY:0,
            valueRotate:0,
            valueScaleX:0,
            valueScaleY:0
        },
        animations : {
            animateMoveX:0,
            animateMoveY:0,
            animateRotate:0,
            animateScaleX:0,
            animateScaleY:0
        }
    }

//Offset
    self.offset = {
        x:0,
        y:0,
        rotation:0,
        scaleX:1,
        scaleY:1
    }


    //Methods

//Moving
    self.moveX = function(offset, duration, ease) {
        self.variables.move.x.offset = offset;

        if(duration == null) {
            self.variables.move.x.duration = 500;
        } else {
            self.variables.move.x.duration = duration;
        }

        if(ease == null) {
            self.variables.move.x.ease = "easeInOutCubic";
        } else {
            self.variables.move.x.ease = ease;
        }

        return self;
    }

    self.moveY = function(offset, duration, ease) {
        self.variables.move.y.offset = offset;

        if(duration == null) {
            self.variables.move.y.duration = 500;
        } else {
            self.variables.move.y.duration = duration;
        }

        if(ease == null) {
            self.variables.move.y.ease = "easeInOutCubic";
        } else {
            self.variables.move.y.ease = ease;
        }

        return self;
    }
//Rotating
    self.rotate = function(offset, duration, ease) {
        self.variables.rotation.x.offset = offset;

        if(duration == null) {
            self.variables.rotation.x.duration = 500;
        } else {
            self.variables.rotation.x.duration = duration;
        }

        if(ease == null) {
            self.variables.rotation.x.ease = "easeInOutCubic";
        } else {
            self.variables.rotation.x.ease = ease;
        }

        return self;
    }

//Scaling
    self.scaleX = function(offset, duration, ease) {
        self.variables.scale.x.offset = offset;

        if(duration == null) {
            self.variables.scale.x.duration = 500;
        } else {
            self.variables.scale.x.duration = duration;
        }

        if(ease == null) {
            self.variables.scale.x.ease = "easeInOutCubic";
        } else {
            self.variables.scale.x.ease = ease;
        }

        return self;
    }

    self.scaleY = function(offset, duration, ease) {
        self.variables.scale.y.offset = offset;

        if(duration == null) {
            self.variables.scale.y.duration = 500;
        } else {
            self.variables.scale.y.duration = duration;
        }

        if(ease == null) {
            self.variables.scale.y.ease = "easeInOutCubic";
        } else {
            self.variables.scale.y.ease = ease;
        }

        return self;
    }

    self.wait = function(delay) {
        Time.setTimeout(function () {
            Diagnostics.log("test");
        }, delay);

        return self;
    }
    
//Animate
    self.start = function() {

        //SetDrivers
        self.animationValues.drivers.driverMoveX = Animation.timeDriver({durationMilliseconds: self.variables.move.x.duration});
        self.animationValues.drivers.driverMoveY = Animation.timeDriver({durationMilliseconds: self.variables.move.y.duration});
        self.animationValues.drivers.driverRotate = Animation.timeDriver({durationMilliseconds: self.variables.rotation.x.duration});
        self.animationValues.drivers.driverScaleX = Animation.timeDriver({durationMilliseconds: self.variables.scale.x.duration});
        self.animationValues.drivers.driverScaleY = Animation.timeDriver({durationMilliseconds: self.variables.scale.y.duration});

        //SetValues
        self.animationValues.values.valueMoveX = Animation.samplers[self.variables.move.x.ease](self.offset.x, self.offset.x + self.variables.move.x.offset);
        self.animationValues.values.valueMoveY = Animation.samplers[self.variables.move.y.ease](self.offset.y, self.offset.y + self.variables.move.y.offset);
        self.animationValues.values.valueRotate = Animation.samplers[self.variables.rotation.x.ease](self.offset.rotation, self.offset.rotation + self.variables.rotation.x.offset);        
        self.animationValues.values.valueScaleX = Animation.samplers[self.variables.scale.x.ease](self.offset.scaleX, self.offset.scaleX * self.variables.scale.x.offset);
        self.animationValues.values.valueScaleY = Animation.samplers[self.variables.scale.y.ease](self.offset.scaleY, self.offset.scaleY * self.variables.scale.y.offset);

        self.offset.x = self.offset.x + self.variables.move.x.offset;
        self.offset.y = self.offset.y + self.variables.move.y.offset;
        self.offset.rotation = self.offset.rotation + self.variables.rotation.x.offset;
        self.offset.scaleX = self.offset.scaleX * self.variables.scale.x.offset;
        self.offset.scaleY = self.offset.scaleY * self.variables.scale.y.offset;

        //SetAnimations
        self.animationValues.animations.animateMoveX = Animation.animate(self.animationValues.drivers.driverMoveX, self.animationValues.values.valueMoveX);
        self.animationValues.animations.animateMoveY = Animation.animate(self.animationValues.drivers.driverMoveY, self.animationValues.values.valueMoveY);
        self.animationValues.animations.animateRotate = Animation.animate(self.animationValues.drivers.driverRotate, self.animationValues.values.valueRotate);
        self.animationValues.animations.animateScaleX = Animation.animate(self.animationValues.drivers.driverScaleX, self.animationValues.values.valueScaleX);
        self.animationValues.animations.animateScaleY = Animation.animate(self.animationValues.drivers.driverScaleY, self.animationValues.values.valueScaleY);

        //MatchTransformToAnimation
        MatchTransformToAnimation();

        //StartAnimations
        self.animationValues.drivers.driverMoveX.start();
        self.animationValues.drivers.driverMoveY.start();
        self.animationValues.drivers.driverRotate.start();
        self.animationValues.drivers.driverScaleX.start();
        self.animationValues.drivers.driverScaleY.start();

        return self;
    }

    self.resume = function() {
        self.animationValues.drivers.driverMoveX.start();
        self.animationValues.drivers.driverMoveY.start();
        self.animationValues.drivers.driverRotate.start();
        self.animationValues.drivers.driverScaleX.start();
        self.animationValues.drivers.driverScaleY.start();

        return self;
    }

    self.pause = function() {
        self.animationValues.drivers.driverMoveX.stop();
        self.animationValues.drivers.driverMoveY.stop();
        self.animationValues.drivers.driverRotate.stop();
        self.animationValues.drivers.driverScaleX.stop();
        self.animationValues.drivers.driverScaleY.stop();
        
        return self;
    }

    self.reset = function() {
        Diagnostics.log("reset");

        self.element.transform.x = 0;
        self.element.transform.y = 0;
        self.element.transform.rotateX = 0;
        self.element.transform.scaleX = 1;
        self.element.transform.scaleY = 1;

        self.variables = {
            move : {
                x : {
                    offset:0,
                    duration:0,
                    ease:"easeInOutCubic"
                }, 
                y : {
                    offset:0,
                    duration:0,
                    ease:"easeInOutCubic"
                }
            }, 
            rotation : {
                x : {
                    offset:0,
                    duration:0,
                    ease:"easeInOutCubic"
                }
            },
            scale : {
                x : {
                    offset:1,
                    duration:0,
                    ease:"easeInOutCubic"
                }, 
                y : {
                    offset:1,
                    duration:0,
                    ease:"easeInOutCubic"
                }
            }
        };

        self.animationValues = {
            drivers : {
                driverMoveX:0,
                driverMoveY:0,
                driverRotate:0,
                driverScaleX:0,
                driverScaleY:0
            },
            values : {
                valueMoveX:0,
                valueMoveY:0,
                valueRotate:0,
                valueScaleX:0,
                valueScaleY:0
            },
            animations : {
                animateMoveX:0,
                animateMoveY:0,
                animateRotate:0,
                animateScaleX:0,
                animateScaleY:0
            }
        };

        self.offset = {
            x:0,
            y:0,
            rotation:0,
            scaleX:1,
            scaleY:1
        };

        return self;
    }

    self.onComplete = function(callback) {

        if (callback && typeof(callback) === "function") {
            self.animationValues.drivers.driverMoveX.onCompleted().subscribe(function(e){
                callback();
            });
        }

        return self;
    }

    function MatchTransformToAnimation() {
        if(self.variables.move.x.offset != 0)
        self.element.transform.x = self.animationValues.animations.animateMoveX;
        if(self.variables.move.y.offset != 0)
        self.element.transform.y = self.animationValues.animations.animateMoveY;
        if(self.variables.rotation.x.offset != 0)
        self.element.transform.rotationx = self.animationValues.animations.animateRotateX;
        if(self.variables.scale.x.offset != 0)
        self.element.transform.scaleX = self.animationValues.animations.animateScaleX;
        if(self.variables.scale.y.offset != 0)
        self.element.transform.scaleY = self.animationValues.animations.animateScaleY;
    }

    return self;
}
export default MonkTween;