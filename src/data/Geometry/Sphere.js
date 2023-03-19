
import Geometry from "./Geometry";
import {SphereBufferGeometry} from "three";

export default class Sphere extends Geometry{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures, color,radius=0.5, widthSegments=32, heightSegments=32) { //Javascript allows only one constructor
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color)
        this.radius=radius;
        this.heightSegments=heightSegments;
        this.widthSegments=widthSegments;
        this.className="Sphere" // this is needed because in production constructor.name isn't possible
        if ( typeof Sphere.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Sphere.counterChild = 1;
        }
        this.name="Sphere"+Sphere.counterChild; //set the name to class name + counter
        Sphere.counterChild++;
    }

    copyEntity(){
        let copiedObject=new Sphere() ;
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.radius=this.radius;
        copiedObject.heightSegments=this.heightSegments;
        copiedObject.widthSegments=this.widthSegments;
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["radius","heightSegments","widthSegments"])
    }
    exportMeshGeometry(){
        return new SphereBufferGeometry(this.radius,this.widthSegments,this.heightSegments);
    }

    exportEntityToAFrame(assets,scene){
        return "<a-sphere "+this.exportAttributesToAFrame(assets,scene)+"></a-sphere>";
    }
    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData+= " radius='"+this.radius+"'"
            +" segments-height='"+this.heightSegments+"'"
            +" segments-width='"+this.widthSegments+"' ";
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+= " radius='"+this.radius+"'"
        +" heightSegments='"+this.heightSegments+"'"
        +" widthSegments='"+this.widthSegments+"' ";
        return attributesData;
    }

    printScenegraph() {
        return "Sphere "+this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "radius":
                this.radius=parseFloat(value);
                break;
            case "heightSegments":
                this.heightSegments=parseInt(value);
                break;
            case "widthSegments":
                this.widthSegments=parseInt(value);
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getSize(){
        return [this.radius,this.widthSegments,this.heightSegments];
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {printName: "Radius", inputType: "number" ,name: "radius",  value: this.radius,   step:0.1}, //width details
                {
                    categoryName:"Segments",
                    containedElements: [
                        {printName: "Width", inputType: "range" ,name: "heightSegments",  value: this.heightSegments,   step:1, min:3,   max:32}, //height segment details
                        {printName: "Height", inputType: "range" ,name: "widthSegments",  value: this.widthSegments,   step:1,  min:3,  max:32} //width segment details
                    ]
                },
            ]
        );
    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
        ]);
    }
}