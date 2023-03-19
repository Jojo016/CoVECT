import Geometry from "./Geometry";
import {BoxBufferGeometry} from "three";

export default class Box extends Geometry{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures, color,width=1, height=1, depth=1) { //Javascript allows only one constructor
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color);
        this.height=height;
        this.width=width;
        this.depth=depth;
        this.className="Box" // this is needed because in production constructor.name isn't possible
        if ( typeof Box.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Box.counterChild= 1;
        }
        this.name="Box"+Box.counterChild; //set the name to class name + counter
        Box.counterChild++;

    }

    copyEntity(){
        let copiedObject=new Box();
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject){
        super.copyTo(copiedObject)
        copiedObject.height=this.height;
        copiedObject.width=this.width;
        copiedObject.depth=this.depth;
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["height","width","depth"])
    }

    exportMeshGeometry(){
        return new BoxBufferGeometry(this.width,this.height,this.depth);
    }


    exportEntityToAFrame(assets,scene){
        return "<a-box "+this.exportAttributesToAFrame(assets,scene)+"></a-box>";
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData+= " height='"+this.height+"'"
            +" width='"+this.width+"'"
            +" depth='"+this.depth+"' ";
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+= " height='"+this.height+"'"
            +" width='"+this.width+"'"
            +" depth='"+this.depth+"' ";
        return attributesData;
    }


    printScenegraph() {
        return "Box "+this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "depth":
                this.depth=parseFloat(value);
                break;
            case "height":
                this.height=parseFloat(value);
                break;
            case "width":
                this.width=parseFloat(value);
                break;
            default:
                super.setAttribute(name,value);
        }

    }

    getSize(){
        return [this.width,this.height,this.depth];
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {
                    categoryName:"Size",
                    containedElements: [
                        {printName: "Width", inputType: "number" ,name: "width",  value: this.width,step: 0.1}, //width details
                        {printName: "Height", inputType: "number" ,name: "height",  value: this.height,step: 0.1}, //height details
                        {printName: "Depth", inputType: "number" ,name: "depth",  value: this.depth,step: 0.1}, //width details
                    ]
                }
            ]
        );
    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
        ]);
    }


}