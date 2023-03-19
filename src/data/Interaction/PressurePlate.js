import {BoxBufferGeometry} from "three";
import Entity from "../Entity";
import Camera from "../Camera";

export default class PressurePlate extends Entity{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures, width=1, height=0.1,depth=1,color="#333",scanHeight=2.5) { //Javascript allows only one constructor
        super(name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation, userUploaded, interactions, textures, color)
        this.height = height;
        this.width = width;
        this.depth = depth;
        this.color = color;
        this.scanHeight=scanHeight
        if(!y){
            this.y=height/2;
        }
        this.className = "PressurePlate" // this is needed because in production constructor.name isn't possible
        if (typeof PressurePlate.counterChild == 'undefined') { //init the static variable on the first constructor call
            PressurePlate.counterChild = 1;
        }
        this.name = "PressurePlate" + PressurePlate.counterChild; //set the name to class name + counter
        PressurePlate.counterChild++;
    }

    copyEntity(){
        let copiedObject=new PressurePlate() ;
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.height=this.height;
        copiedObject.width=this.width;
        copiedObject.depth=this.depth;
        copiedObject.color=this.color;
        copiedObject.scanHeight=this.scanHeight
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["height","width","depth"])
    }

    exportMeshGeometry(){
        return new BoxBufferGeometry(this.width,this.height,this.depth);
    }



    exportEntityToAFrame(assets,scene){
        return "<a-box "+this.exportAttributesToAFrame(assets,scene) +"></a-box>";
    }

    exportAttributesToAFrame(assets,scene) {
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        let playerID=""
        for (let index=0; index<scene.length;index++){
            if(scene[index] instanceof Camera){
                playerID=scene[index].getID();
            }
        }
        attributesData +=" color='" + this.color+"'"
            +" height='"+this.height+"'"
            +" width='"+this.width+"'"
            +" depth='"+this.depth+"' "

        attributesData +="pressure-plate-manager=\"scanHeight:"+this.scanHeight+"; height:"+this.height+";player:#"+playerID+"\" "
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+= " height='"+this.height+"'"
            +" width='"+this.width+"'"
            +" depth='"+this.depth+"'"
            +" color='"+this.color+"'"
            +" scanHeight='"+this.scanHeight+"' "
        return attributesData;
    }

    printScenegraph() {
        return "PressurePlate "+this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "color":
                this.color=value;
                break;
            case "height":
                this.height=parseFloat(value);
                break;
            case "width":
                this.width=parseFloat(value);
                break;
            case "depth":
                this.depth = parseFloat(value);
                break;
            case "scanHeight":
                this.scanHeight=parseFloat(value);
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getSize(){
        return [this.width,this.height,this.depth];
    }

    getLoadedSource(){
        return null;
    }

    getColor(){
        return this.color;
    }

    getAreaPosition(){
        return [ 0,
            this.scanHeight/2+this.height,
            0
        ]
    }
    getAreaSize(){
        return [
            this.width,
            this.scanHeight,
            this.depth
        ]
    }
    getAreaScale(){
        return [
            1,
            1/this.yScale,
            1
        ]
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {printName: "Color", inputType: "color", name: "color", value: this.color}, //color details
                {printName: "Scan Height", inputType: "number", name: "scanHeight", value: this.scanHeight, step: 0.1}, //height details
                {
                    categoryName: "Size",
                    containedElements: [
                        {printName: "Width", inputType: "number", name: "width", value: this.width, step: 0.1}, //width details
                        {printName: "Height", inputType: "number", name: "height", value: this.height, step: 0.1}, //height details
                        {printName: "Depth", inputType: "number", name: "height", value: this.depth, step: 0.1}, //height details
                    ]
                },
            ]
        );
    }

    getEvents(){
        let parentEvents=super.getEvents();
        return parentEvents.concat( [ //list all Events. Printname is used to describe the event. Value is used to save the javascript event name
            {printName: "Player entered ", value: "pressurePlateDown"}, // mouseenter event
            {printName: "Player left ", value: "pressurePlateUp"}, // mouseenter event
        ]);

    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
        ]);
    }
}