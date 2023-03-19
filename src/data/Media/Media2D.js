import Entity from "../Entity";
import {PlaneBufferGeometry} from "three";

export default class Media2D extends Entity {
    constructor(url,userUploaded, width = 1, height = 1, name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation, interactions,textures) { //Javascript allows only one constructor
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures);
        this.height = height;
        this.width = width;
        this.url = url;
        this.yNotSet=true;
        this.className="Media2D" // this is needed because in production constructor.name isn't possible
        if (typeof Media2D.counter == 'undefined') { //init the static variable on the first constructor call
            Media2D.counter = 1;
        }
        this.name = "Media2D" + Media2D.counter; //set the name to class name + counter
        Media2D.counter++;
    }

    copyEntity(){
        let copiedObject=new Media2D();
        this.copyTo(copiedObject)
        return copiedObject;
    }
    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.height = this.height;
        copiedObject.width = this.width;
        copiedObject.url = this.url;
    }

    hasToBeLoaded(){
        return true;
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["width","height"])
    }

    exportMeshGeometry(){
        return new PlaneBufferGeometry(this.width,this.height); //the texture is not needed for the navmesh generation
    }

    exportAttributesToAFrame(assets,scene) {
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData += " width='" + this.width + "'"
            +" height='" + this.height + "' "
        return attributesData;
    }

    exportAttributes() {
        let attributesData = super.exportAttributes();
        attributesData += " url='" + this.url + "'"
            +" width='" + this.width + "'"
            +" height='" + this.height + "' ";
        return attributesData;
    }

    printScenegraph() {
        return "2DMedia " + this.getName();
    }

    setAttribute(name, value) {
        switch (name) {
            case "height":
                this.height = parseFloat(value);
                break;
            case "width":
                this.width = parseFloat(value);
                break;
            case "url":
                this.url = value;
                break;
            case "y": //a specific handling of y in model
                this.yNotSet=false;
                super.setAttribute(name,value); // still perform the standard set y
                break;
            default:
                super.setAttribute(name, value);
        }
    }

    getLoadedSource(){
        return null;
    }

    //calculates the format of a 2D media and returns the [height,width]
    calculateFormat(height, width){
        let heightFormat=height
        let widthFormat=width
        let biggerDimension= heightFormat>widthFormat?heightFormat:widthFormat; //choose the bigger dimension of both measures
        heightFormat=heightFormat/biggerDimension //adjust the height to format of the picture
        widthFormat=widthFormat/biggerDimension   //adjust the width to format of the picture
        return [heightFormat,widthFormat]
    }

    getSize() {
        return [this.width, this.height];
    }

    getDetails() {
        let parentDetails = super.getDetails();
        return parentDetails.concat(
            [
                {
                    categoryName: "Size",
                    containedElements: [
                        {printName: "Width", inputType: "number", name: "width", value: this.width, step: 0.1}, //width details
                        {printName: "Height", inputType: "number", name: "height", value: this.height, step: 0.1}, //height details
                    ]
                }
            ]
        );
    }

    getEffects() {
        let parentEffects = super.getEffects();
        return parentEffects.concat([
        ]);
    }
}
