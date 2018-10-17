import Scene from 'Scene';
import Reactive from 'Reactive';
import console from 'Diagnostics';

export default class {
    constructor(bones,points, keepEndRotation, useDepthRotation) {
        
        
        if(keepEndRotation == null) {
            this.keepEndRotation = false;
        } else {
            this.keepEndRotation = keepEndRotation;
        }

        if(useDepthRotation == null) {
            this.useDepthRotation = false;
        } else {
            this.useDepthRotation = useDepthRotation;
        }

        this.bones = bones;
        this.points = points;

        //SetPosition
        
        if(this.bones.array != null) {
            this.arrayOfBones();
        } else {
            this.TwoEqualBones();
        }

        // this.debug();
    }

    arrayOfBones() {
        this.bones.array[0].transform.position = this.points.begin.transform.position;

        this.armLength = Reactive.sqrt(Reactive.add(Reactive.pow(this.bones.array[1].transform.x,2),Reactive.pow(this.bones.array[1].transform.y,2))).mul(this.bones.array.length-1);
        this.crossLength = Reactive.sqrt(Reactive.add(Reactive.pow(this.points.begin.transform.x.sub(this.points.end.transform.x),2),Reactive.pow(this.points.begin.transform.y.sub(this.points.end.transform.y),2)));

        var firstCorner = Reactive.div(Reactive.add(Reactive.pow(this.armLength.div(2),2),Reactive.pow(this.crossLength,2)).sub(Reactive.pow(this.armLength.div(2),2)),Reactive.mul(this.armLength.div(2), this.crossLength).mul(2));
        var corner = Reactive.div(Reactive.add(Reactive.pow(this.armLength.div(2),2),Reactive.pow(this.crossLength,2)).sub(Reactive.pow(this.armLength.div(2),2)),Reactive.mul(this.armLength.div(2), this.crossLength).mul(2));
        var calculateDefaultRotation = Reactive.atan2(Reactive.sub(this.points.end.transform.x, this.points.begin.transform.x), Reactive.sub(this.points.end.transform.y, this.points.begin.transform.y));

        if(this.useDepthRotation) {
            var depthRotation = Reactive.atan2(Reactive.sub(this.points.end.transform.y, this.points.begin.transform.y), Reactive.sub(this.points.end.transform.z, this.points.begin.transform.z));
            this.bones.array[0].transform.rotationX = depthRotation.sub(this.degToRad(90));
        }

        if(this.keepEndRotation) {
            this.bones.array[this.bones.array.length-1].transform.rotationZ = this.points.end.transform.rotationZ.sub(this.bones.array[0].transform.rotationZ).sub(this.bones.array[1].transform.rotationZ.mul(this.bones.array.length-2));
        }
        Reactive.ge(this.points.target.transform.x, this.points.begin.transform.x).monitor({fireOnInitialValue:true}).subscribe((e)=>{
            if(e.newValue) {
                Reactive.ge(firstCorner,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                    if(e.newValue == true) {
                        this.angle1 = Reactive.add(0, this.degToRad(90));
                    } else {
                        this.angle1 = Reactive.add(this.degToRad(this.arccos(firstCorner)), this.degToRad(90));
                    }
        
                    this.cornerAngle = this.degToRad(this.arccos(corner)).mul(-1);
                    Reactive.ge(corner,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                        if(e.newValue == true) {               
                            this.cornerAngle = Reactive.val(0);
                        } else {
                            this.cornerAngle = this.degToRad(this.arccos(corner)).mul(-1);
                        }
                    });
        
                    this.bones.array[0].transform.rotationZ = Reactive.sub( this.degToRad(180),this.angle1.add(calculateDefaultRotation.mul(1)).sub(this.cornerAngle.div(this.bones.array.length / 4)));
                });
        
                Reactive.ge(corner,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                    if(e.newValue == true) {               
                        this.angle2 = Reactive.val(0);
                    } else {
                        this.angle2 = this.degToRad(this.arccos(corner)).mul(1);
                    }
                    
                    var i = 0;
                    this.bones.array.forEach(bone => {
                        if(i != 0 && i != this.bones.array.length-1) {
                            bone.transform.rotationZ = this.angle2.div(this.bones.array.length/4);
                        }
                        i++;
                    });
                });
            } else {
                Reactive.ge(firstCorner,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                    if(e.newValue == true) {
                        this.angle1 = Reactive.add(0, this.degToRad(90));
                    } else {
                        this.angle1 = Reactive.add(this.degToRad(this.arccos(firstCorner)), this.degToRad(90));
                    }
                    
                    this.cornerAngle = this.degToRad(this.arccos(corner)).mul(-1);
                    Reactive.ge(corner,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                        if(e.newValue == true) {               
                            this.cornerAngle = Reactive.val(0);
                        } else {
                            this.cornerAngle = this.degToRad(this.arccos(corner)).mul(-1);
                        }
                    });
        
                    this.bones.array[0].transform.rotationZ = this.angle1.add(calculateDefaultRotation.mul(-1)).sub(this.cornerAngle.div(this.bones.array.length / 4));
                });
        
                Reactive.ge(corner,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                    if(e.newValue == true) {               
                        this.angle2 = Reactive.val(0);
                    } else {
                        this.angle2 = this.degToRad(this.arccos(corner)).mul(-1);
                    }
                    
                    var i = 0;
                    this.bones.array.forEach(bone => {
                        if(i != 0 && i != this.bones.array.length-1) {
                            bone.transform.rotationZ = this.angle2.div(this.bones.array.length/4);
                        }
                        i++;
                    });
                });
            }
        });
        
    }

    TwoEqualBones() {
        this.bones.begin.transform.position = this.points.begin.transform.position;

        this.boneLength_01 = Reactive.sqrt(Reactive.add(Reactive.pow(this.bones.middle.transform.x,2),Reactive.pow(this.bones.middle.transform.y,2)));
        this.boneLength_02 = Reactive.sqrt(Reactive.add(Reactive.pow(this.bones.target.transform.x,2),Reactive.pow(this.bones.target.transform.y,2)));
        this.crossLength = Reactive.sqrt(Reactive.add(Reactive.pow(this.points.begin.transform.x.sub(this.points.end.transform.x),2),Reactive.pow(this.points.begin.transform.y.sub(this.points.end.transform.y),2)));

        var calculationBone1 = Reactive.div(Reactive.add(Reactive.pow(this.boneLength_02,2),Reactive.pow(this.crossLength,2)).sub(Reactive.pow(this.boneLength_01,2)),Reactive.mul(this.boneLength_02, this.crossLength).mul(2));
        var calculationBone2 = Reactive.div(Reactive.add(Reactive.pow(this.boneLength_01,2),Reactive.pow(this.crossLength,2)).sub(Reactive.pow(this.boneLength_02,2)),Reactive.mul(this.boneLength_01, this.crossLength).mul(2));
        var calculateDefaultRotation = Reactive.atan2(Reactive.sub(this.points.end.transform.x, this.points.begin.transform.x), Reactive.sub(this.points.end.transform.y, this.points.begin.transform.y));

        if(this.keepEndRotation) {
            this.bones.target.transform.rotationZ = this.points.end.transform.rotationZ.sub(this.bones.begin.transform.rotationZ).sub(this.bones.middle.transform.rotationZ);
        }

        if(this.useDepthRotation) {
            var depthRotation = Reactive.atan2(Reactive.sub(this.points.end.transform.y, this.points.begin.transform.y), Reactive.sub(this.points.end.transform.z, this.points.begin.transform.z));
            this.bones.begin.transform.rotationX = depthRotation.sub(this.degToRad(90));
        }

        Reactive.ge(this.points.target.transform.x, this.points.begin.transform.x).monitor({fireOnInitialValue:true}).subscribe((e)=>{
            if(e.newValue) {
                //Target Right
                Reactive.ge(calculationBone1,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                    if(e.newValue == true) {
                        // console.log("zero");
                        this.angle1 = Reactive.add(0, this.degToRad(90));
                    } else {
                        // console.log("not zero");
                        this.angle1 = Reactive.add(this.degToRad(this.arccos(calculationBone1)), this.degToRad(90));
                    }
                    this.bones.begin.transform.rotationZ = Reactive.sub(this.degToRad(180), this.angle1.add(calculateDefaultRotation.mul(1)));
                });

                Reactive.ge(calculationBone2,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                    if(e.newValue == true) {               
                        this.angle2 = 0;
                    } else {
                        this.angle2 = this.degToRad(this.arccos(calculationBone2)).mul(-2);
                    }
                    this.bones.middle.transform.rotationZ = Reactive.sub(this.degToRad(180),this.angle2.add(this.degToRad(180)));
                });
            } else {
                //Target Left
                Reactive.ge(calculationBone1,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                    if(e.newValue == true) {
                        // console.log("zero");
                        this.angle1 = Reactive.add(0, this.degToRad(90));
                    } else {
                        // console.log("not zero");
                        this.angle1 = Reactive.add(this.degToRad(this.arccos(calculationBone1)), this.degToRad(90));
                    }
                    this.bones.begin.transform.rotationZ = this.angle1.add(calculateDefaultRotation.mul(-1));
                });

                Reactive.ge(calculationBone2,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
                    if(e.newValue == true) {               
                        this.angle2 = 0;
                    } else {
                        this.angle2 = this.degToRad(this.arccos(calculationBone2)).mul(-2);
                    }
                    this.bones.middle.transform.rotationZ = this.angle2;
                });
            }            
        });
    }

    degToRad(x) {
        return Reactive.mul(x,Math.PI).div(180);
    }

    arccos(x) {
        return Reactive.sqrt(Reactive.abs(Reactive.val(7).mul(Reactive.val(1000).sub(Reactive.val(1000).mul(x))))).sub(0.5);
    }

    debug() {
        this.boneLength_01.monitor({fireOnInitialValue : true}).subscribe((e)=>{
            console.log("bone 1 : " + e.newValue);
        });

        this.boneLength_02.monitor({fireOnInitialValue : true}).subscribe((e)=>{
            console.log("bone 2 : " + e.newValue);
        });

        this.crossLength.monitor({fireOnInitialValue : true}).subscribe((e)=>{
            console.log("cross : " + e.newValue);
        });
    }
}