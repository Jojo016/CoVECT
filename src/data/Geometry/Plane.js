
import Geometry from "./Geometry";
import {PlaneBufferGeometry} from "three";

export default class Plane extends Geometry{
    constructor(name, x, y=0, z,xScale,yScale,zScale,xRotation=-90,yRotation,zRotation,userUploaded,interactions,textures, color,width=1, height=1,doubleSide=false) { //Javascript allows only one constructor
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color)
        this.height=height;
        this.width=width;
        this.doubleSide=doubleSide;
        this.className="Plane" // this is needed because in production constructor.name isn't possible
        if ( typeof Plane.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Plane.counterChild = 1;
        }
        this.name="Plane"+Plane.counterChild; //set the name to class name + counter
        Plane.counterChild++;
    }

    copyEntity(){
        let copiedObject=new Plane() ;
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.height=this.height;
        copiedObject.width=this.width;
        copiedObject.doubleSide=this.doubleSide;
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["height","width"])
    }

    exportMeshGeometry(){
        return new PlaneBufferGeometry(this.width,this.height);
    }

    exportEntityToAFrame(assets,scene){
        return "<a-plane "+this.exportAttributesToAFrame(assets,scene)+"></a-plane>";
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData+= " height='"+this.height+"'"
            +" width='"+this.width+"'"
        if(this.doubleSide){
            attributesData+=" side='double' ";
        }
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+= " height='"+this.height+"'"
            +" width='"+this.width+"'"
            +" doubleSide='"+this.doubleSide+"' ";
        return attributesData;
    }

    printScenegraph() {
        return "Plane "+this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "height":
                this.height=parseFloat(value);
                break;
            case "width":
                this.width=parseFloat(value);
                break;
            case "doubleSide":
                if (typeof value ==="string"){
                    this.doubleSide = value==="true";
                }
                else{
                    this.doubleSide = value;
                }
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getSize(){
        return [this.width,this.height];
    }
    isDoubleSide(){
        return this.doubleSide;
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {
                    categoryName: "Size",
                    containedElements: [
                        {printName: "Width", inputType: "number", name: "width", value: this.width, step: 0.1}, //width details
                        {printName: "Height", inputType: "number", name: "height", value: this.height, step: 0.1}, //height details
                    ]
                },
                {printName: "Double Side", inputType: "checkbox" ,name: "doubleSide",  value: this.doubleSide, step: 0.1}, //height details
            ]
        );
    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
            {
            },
        ]);
    }
}