import DirectionalLight from "./DirectionalLight";
import {Vector3} from "three";

export default class SpotLight extends DirectionalLight{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded, interactions,textures, color,intensity,distance=100,angle=22,targetX=0,targetY=-1,targetZ=0) {
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color,intensity,targetX,targetY,targetZ);
        this.distance=distance;
        this.angle=angle;
        this.className="SpotLight" // this is needed because in production constructor.name isn't possible
        if ( typeof SpotLight.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            SpotLight.counterChild = 1;
        }
        this.name="SpotLight"+SpotLight.counterChild; //set the name to class name + counter
        SpotLight.counterChild++;
    }

    copyEntity(){
        let copiedObject=new SpotLight();
        this.copyTo(copiedObject)
        return copiedObject;
    }
    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.distance = this.distance;
        copiedObject.angle = this.angle;
    }

    exportPosition(){
        return { //overrides the directional export
            x:this.x,
            y:this.y,
            z:this.z
        }
    }

    exportEntityToAFrame(assets,scene){
        return "<a-light type='spot' "+this.exportAttributesToAFrame(assets,scene)+">\n"
            +"\t<a-entity "
            +" id='"+this.getID()+"-target'"
            // +" position='"+this.targetX+" "+this.targetY+" "+this.targetZ+"' >"
            +" position='0 -1 0' >"
            +"</a-entity>\n"
            +"</a-light>";
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData +=" distance='"+this.distance+"'"
            +" angle='"+this.angle+"' "
            +" target='#"+this.getID()+"-target' "
        return attributesData;
    }


    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData +=" distance='"+this.distance+"'"
            +" angle='"+this.angle+"' "
        return attributesData;
    }

    printScenegraph(){ //called when the object has to be printed for the Scenegraph
        return "Spot Light "+ this.getName();
    }

    transform(mode,objectThree) {
        let lightSource = objectThree[0]; //light entity
        let target = objectThree[1]; //target from the light
        super.transform(mode,lightSource) //transform the light entity
        let convertedPosition= new Vector3();
        target.getWorldPosition(convertedPosition); //get the correct position from the target, independent from the parent entity
        this.setAttribute("target", [ //update the target
            convertedPosition.x,
            convertedPosition.y,
            convertedPosition.z
        ]);
    }

    setAttribute(name,value){
        switch (name) {
            case "distance":
                this.distance=parseFloat(value);
                break;
            case "angle":
                this.angle=parseFloat(value);
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getDefaultTarget(){
        return [0,-1,0]
    }

    getAngle(unit) {
        switch (unit) {
            case "degrees":
                return this.angle
            case "radians":
                return this.angle * Math.PI / 180
            default:
                return 0;
        }
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {printName: "Distance", inputType: "number" ,name: "distance",  value: this.distance, step:0.1}, //color details
                {printName: "Angle", inputType: "number" ,name: "angle",  value: this.angle, step:1}, //color details

            ]
        );
    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
            {
                printName:"Change Distance",
                id:"change-property_distance",
                module:"change-property",
                options:{
                    property:"distance"
                },
                parameterList: [
                    {printName: "Distance", inputType: "number" ,name: "distance",  value: this.distance, step:0.1},
                ],

            },
            {
                printName:"Change Angle",
                id:"change-property_angle",
                module:"change-property",
                options:{
                    property:"angle"
                },
                parameterList: [
                    {printName: "Angle", inputType: "number" ,name: "angle",  value: this.angle, step:1},
                ],
            },
        ]);
    }

    getEvents(){
        let parentEvents=super.getEvents();
        return parentEvents.concat(
        );
    }
}