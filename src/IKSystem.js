import Scene from 'Scene';
import Reactive from 'Reactive';
import console from 'Diagnostics';

export default class {
    constructor(bones,points,keepEndRotation) {
        //SetPosition
        bones.begin.transform.position = points.begin.transform.position;

        this.boneLength_01 = Reactive.sqrt(Reactive.add(Reactive.pow(bones.middle.transform.x,2),Reactive.pow(bones.middle.transform.y,2)));
        this.boneLength_02 = Reactive.sqrt(Reactive.add(Reactive.pow(bones.target.transform.x,2),Reactive.pow(bones.target.transform.y,2)));
        this.crossLength = Reactive.sqrt(Reactive.add(Reactive.pow(points.begin.transform.x.sub(points.end.transform.x),2),Reactive.pow(points.begin.transform.y.sub(points.end.transform.y),2)));

        var calculationBone1 = Reactive.div(Reactive.add(Reactive.pow(this.boneLength_02,2),Reactive.pow(this.crossLength,2)).sub(Reactive.pow(this.boneLength_01,2)),Reactive.mul(this.boneLength_02, this.crossLength).mul(2));
        var calculationBone2 = Reactive.div(Reactive.add(Reactive.pow(this.boneLength_01,2),Reactive.pow(this.crossLength,2)).sub(Reactive.pow(this.boneLength_02,2)),Reactive.mul(this.boneLength_01, this.crossLength).mul(2));
        var calculationBone3 = Reactive.div(Reactive.add(Reactive.pow(this.boneLength_01,2),Reactive.pow(this.boneLength_02,2)).sub(Reactive.pow(this.crossLength,2)),Reactive.mul(this.boneLength_01, this.boneLength_02).mul(2));
        var calculateDefaultRotation = Reactive.atan2(Reactive.sub(points.end.transform.x, points.begin.transform.x), Reactive.sub(points.end.transform.y, points.begin.transform.y));

        this.angle1 = Reactive.val(0);
        this.angle2 = Reactive.val(0);

        if(keepEndRotation) {
            bones.target.transform.rotationZ = points.end.transform.rotationZ.sub(bones.begin.transform.rotationZ).sub(bones.middle.transform.rotationZ);
        }

        Reactive.ge(calculationBone1,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
            if(e.newValue == true) {
                // console.log("zero");
                this.angle1 = Reactive.add(0, this.degToRad(90));
            } else {
                // console.log("not zero");
                this.angle1 = Reactive.add(this.degToRad(this.arccos(calculationBone1)), this.degToRad(90));
            }
            bones.begin.transform.rotationZ = this.angle1.add(calculateDefaultRotation.mul(-1));
        });

        Reactive.ge(calculationBone2,1).monitor({fireOnInitialValue:true}).subscribe((e)=>{
            if(e.newValue == true) {               
                this.angle2 = 0;
            } else {
                this.angle2 = this.degToRad(this.arccos(calculationBone2)).mul(-2);
            }
            bones.middle.transform.rotationZ = this.angle2;
        });

        // this.debug();
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