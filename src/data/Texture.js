import {TextureLoader} from "three";

export default class Texture {
    constructor(name, url, materialName, userUploaded) {
        this.name=name;
        this.url=url;
        this.materialName=materialName;
        this.userUploaded=userUploaded;
        this.texture=null;
        this.className="Texture" // this is needed because in production constructor.name isn't possible
        if (typeof Texture.counterChild == 'undefined') { //init the static variable on the first constructor call
            Texture.counterChild = 1;
        }
        this.id = "Texture" + Texture.counterChild; //set the name to class name + counter
        Texture.counterChild++;
    }

    loadEntity(callback,options){ //loads the texture of the geometry
        let loader = new TextureLoader(); //init loader
        loader.load(this.url, //load the first texture in the list
            texture => { //this is called after succesful loading the texture
                this.saveLoadedTexture(texture);
                callback(this);
            },
            ()=>{}, //do nothing
            event =>{
                console.log("error",event);
                callback(null)
            }
        );
    }

    saveLoadedTexture(texture){
        this.texture=texture;
    }
    getLoadedTexture(){
        return this.texture;
    }

    copyTexture(){
        return new Texture(this.name, this.url, this.materialName, this.userUploaded)
    }

    exportAttributes(){
        return " name='"+ this.name+"'"
            +" id='"+ this.id+"'"
            +" url='"+this.url+"'"
            +" materialName='"+this.materialName+"'"
            +" userUploaded='"+this.userUploaded+"' ";
    }

    exportTexture(){
        return "<Texture "+this.exportAttributes()+"/>";
    }

    checkIfAssetsIsNotIncluded(asset,assetsList){
        for (let index=0;index<assetsList.length;index++){
            if(asset===assetsList[index].src){
                return false;
            }
        }
        return true;
    }

    exportAssetsToAFrame(assets) {
        if(this.checkIfAssetsIsNotIncluded(this.url,assets)){
            assets.push({src:this.url, id:this.getID()+"-img"})
            return "<img alt='assets' id=\""+this.getID()+"-img\" src=\""+this.url+"\">"
        }
        return "";
    }

    fillFromAttributes(attributes){
        let attributeList=Object.entries(attributes); //convert Object to List of contained variables
        for (let index=0;index<attributeList.length;index++){
            this.setAttribute(attributeList[index][0],attributeList[index][1]);
        }
    }

    setAttribute(name,value){
        switch (name) {
            case "name":
                this.name=value;
                break;
            case "id":
                this.id=value;
                break;
            case "url":
                this.url=value;
                break;
            case "materialName":
                this.materialName=value;
                break;
            case "userUploaded":
                this.userUploaded=value;
                break;
            default:
                console.log("Variable "+name+" is unknown");
        }
    }

    getClassName(){ //this function returns name of the class object
        return this.className;
    }

    getID(){
        return this.id;
    }

    getName(){
        return this.name;
    }
    getMaterialName(){
        return this.materialName;
    }

    getUrl(){
        return this.url;
    }
}