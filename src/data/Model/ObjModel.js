import {MTLLoader} from "three/examples/jsm/loaders/MTLLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import Model from "./Model";


export default class ObjModel extends Model{
    constructor(modelType,url,materialUrl=null,userUploaded,textures,name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation, interactions) {
        super(modelType,url,userUploaded,textures,name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,interactions);
        this.materialUrl=materialUrl; //Url of the Model
        this.className="ObjModel" // this is needed because in production constructor.name isn't possible
    }

    copyEntity(){
        let copiedObject=new ObjModel();
        this.copyTo(copiedObject)
        return copiedObject;
    }
    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.materialUrl = this.materialUrl; //Url of the Model
    }

    loadModel(callback,options){ //loads the Object3D of the model and calls the callback after finishing
        if(!this.materialUrl){
            super.loadModel(callback,options)
        }
        else {
            new MTLLoader().load(this.materialUrl, (material) => { //first load the material
                material.preload();
                let loader = new OBJLoader();
                loader.setMaterials(material); //set Material to the Obj loader
                loader.load(this.url, (model) => callback(model))
            });
        }
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat("materialUrl")
    }

    exportAssetsToAFrame(assets) {
        let assetsData=""
        if(this.checkIfAssetsIsNotIncluded(this.url,assets)){
            assets.push({src:this.url,id:this.getID()+"-model"})
            assetsData+="<a-asset-item id=\""+this.getID()+"-model\" src=\""+this.url+"\"></a-asset-item>\n"
        }
        if(this.checkIfAssetsIsNotIncluded(this.materialUrl,assets)){
            assets.push({src:this.materialUrl,id:this.getID()+"-mtl"})
            assetsData+="<a-asset-item id=\""+this.getID()+"-mtl\" src=\""+this.materialUrl+"\"></a-asset-item>"
        }
        return assetsData
    }

    exportEntityToAFrame(assets,scene){
        return "<a-obj-model "+this.exportAttributesToAFrame(assets,scene)+"></a-obj-model>";
    }

    exportAttributesToAFrame(assets,scene){
        let assetID= this.getAssetsID(this.materialUrl,assets,scene)
        if(assetID===""){
            assetID= this.getID()+"-mtl";
        }
        let attributesData = super.exportAttributesToAFrame(assets);
        attributesData+=" mtl=\"#"+assetID+"\" ";
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+=" materialUrl='"+this.materialUrl+"' ";
        return attributesData;
    }

    setAttribute(name,value){
        switch (name) {
            case "materialUrl":
                this.materialUrl=value;
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [

            ]
        );
    }


}