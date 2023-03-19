
import Geometry from "./Geometry";
import {SphereBufferGeometry} from "three";

export default class Tetrahedron extends Geometry{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures, color,radius=0.5, details=0,) { //Javascript allows only one constructor
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color);
        this.radius=radius;
        this.details=details;
        this.className="Tetrahedron" // this is needed because in production constructor.name isn't possible
        if ( typeof Tetrahedron.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Tetrahedron.counterChild = 1;
        }
        this.name="Tetrahedron"+Tetrahedron.counterChild; //set the name to class name + counter
        Tetrahedron.counterChild++;
    }

    copyEntity(){
        let copiedObject=new Tetrahedron() ;
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.radius=this.radius;
        copiedObject.details=this.details;
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["radius","details"])
    }
    exportMeshGeometry(){
        return new SphereBufferGeometry(this.radius,this.details);
    }

    exportEntityToAFrame(assets,scene){
        return "<a-tetrahedron "+this.exportAttributesToAFrame(assets,scene)+"></a-tetrahedron>";
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData+=" radius='"+this.radius+"'"
            +" detail='"+this.details+"' ";
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+=" radius='"+this.radius+"'"
            +" details='"+this.details+"' ";
        return attributesData;
    }

    printScenegraph() {
        return "Tetrahedron "+this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "radius":
                this.radius=parseFloat(value);
                break;
            case "details":
                this.details=parseInt(value);
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getSize(){
        return [this.radius,this.details];
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {printName: "Radius", inputType: "number" ,name: "radius",  value: this.radius,   step:0.1}, //width details
                {printName: "Details", inputType: "range" ,name: "details",  value: this.details,   step:1, min:0,   max:5}, //height details
            ]
        );
    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
        ]);
    }
}