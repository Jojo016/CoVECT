import Geometry from "./Geometry";
import {CylinderBufferGeometry} from "three";

export default class Cylinder extends Geometry{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures, color,radiusTop=0.5,radiusBottom=0.5, height=1, radialSegments=32) { //Javascript allows only one constructor
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color);
        this.height=height;
        this.radiusBottom=radiusBottom;
        this.radiusTop=radiusTop;
        this.radialSegments=radialSegments;
        this.className="Cylinder" // this is needed because in production constructor.name isn't possible
        if ( typeof Cylinder.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Cylinder.counterChild = 1;
        }
        this.name="Cylinder"+Cylinder.counterChild; //set the name to class name + counter
        Cylinder.counterChild++;
    }

    copyEntity(){
        let copiedObject=new Cylinder();
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.height=this.height;
        copiedObject.radiusBottom=this.radiusBottom;
        copiedObject.radiusTop=this.radiusTop;
        copiedObject.radialSegments=this.radialSegments;
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["height","radiusBottom","radiusTop","radialSegments"])
    }
    exportMeshGeometry(){
        return new CylinderBufferGeometry(this.radiusTop,this.radiusBottom,this.height,this.radialSegments);
    }

    exportEntityToAFrame(assets,scene){
        //Aframe divides cylinder and cone in two different geometries
        //Cone supports all features from Three.js Cylinder
        //Therefore it is exported as cone
        return "<a-cone "+this.exportAttributesToAFrame(assets,scene)+"></a-cone>";
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData+=" height='"+this.height+"'"
            +" radius-bottom='"+this.radiusBottom+"'"
            +" radius-top='"+this.radiusTop+"'"
            +" segments-radial='"+this.radialSegments+"' ";
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+=" height='"+this.height+"'"
            +" radiusBottom='"+this.radiusBottom+"'"
            +" radiusTop='"+this.radiusTop+"'"
            +" radialSegments='"+this.radialSegments+"' ";
        return attributesData;
    }



    printScenegraph() {
        return "Cylinder "+this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "radialSegments":
                this.radialSegments=parseInt(value);
                break;
            case "height":
                this.height=parseFloat(value);
                break;
            case "radiusBottom":
                this.radiusBottom=parseFloat(value);
                break;
            case "radiusTop":
                this.radiusTop=parseFloat(value);
                break;
            default:
                super.setAttribute(name,value);
        }

    }

    getSize(){
        return [this.radiusTop,this.radiusBottom,this.height,this.radialSegments];
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {
                    categoryName:"Radius",
                    containedElements: [
                        {printName: "Bottom", inputType: "number" ,name: "radiusBottom",  value: this.radiusBottom,step: 0.1}, //radiusBottom details
                        {printName: "Top", inputType: "number" ,name: "radiusTop",  value: this.radiusTop,step: 0.1}, //radiusTop details
                    ]
                },
                {printName: "Height", inputType: "number" ,name: "height",  value: this.height,step: 0.1}, //height details
                {printName: "Segments", inputType: "range" ,name: "radialSegments",  value: this.radialSegments,step: 1,min:3,max:32}, //radialSegments details
            ]
        );
    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
        ]);
    }

}