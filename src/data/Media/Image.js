import {TextureLoader} from "three";
import Media2D from "./Media2D";

export default class Image extends Media2D {
    constructor(url,userUploaded, width, height, name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation, interactions,textures) { //Javascript allows only one constructor
        super(url,userUploaded, width, height, name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation, interactions,textures);
        this.className="Image" // this is needed because in production constructor.name isn't possible
        if (typeof Image.counterChild == 'undefined') { //init the static variable on the first constructor call
            Image.counterChild = 1;
        }
        this.name = "Image" + Image.counterChild; //set the name to class name + counter
        Image.counterChild++;
    }

    copyEntity(){
        let copiedObject=new Image();
        this.copyTo(copiedObject)
        return copiedObject;
    }

    loadEntity(callback,loadOptions) {
        let loader = new TextureLoader(); //init loader
        loader.load(this.url, //load the first texture in the list
            image => { //this is called after succesful loading the texture
                let format=this.calculateFormat(image.image.height,image.image.width)
                this.height=format[0];
                this.width=format[1];
                if(this.yNotSet){
                    this.y=this.height/2
                }
                this.image = image;
                callback(this);
            },
            () => {
            }, //do nothing
            event => console.log("error", event)
        );
    }

    exportAssetsToAFrame(assets) {
        if(this.checkIfAssetsIsNotIncluded(this.url,assets)){
            assets.push({src:this.url, id:this.getID()+"-img"})
            return "<img alt='assets' id=\""+this.getID()+"-img\" src=\""+this.url+"\">"
        }
        return "";
    }

    exportEntityToAFrame(assets,scene){
        return "<a-image "+this.exportAttributesToAFrame(assets,scene)+"></a-image>";
    }

    exportAttributesToAFrame(assets,scene) {
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        let assetID= this.getAssetsID(this.url,assets)
        if(assetID===""){
            assetID= this.getID()+"-img";
        }
        attributesData += " src='#"+assetID+"'" //sets the id of the added asset with the source
        return attributesData;
    }

    exportAttributes() {
        let attributesData = super.exportAttributes();
        return attributesData;
    }

    printScenegraph() {
        return "Image " + this.getName();
    }

    setAttribute(name, value) {
        switch (name) {
            default:
                super.setAttribute(name, value);
        }
    }

    getLoadedSource(){
        return this.image
    }

    getDetails() {
        let parentDetails = super.getDetails();
        return parentDetails.concat(
            [
            ]
        );
    }

    getEffects() {
        let parentEffects = super.getEffects();
        return parentEffects.concat(
            [
            ]
        );
    }
}
