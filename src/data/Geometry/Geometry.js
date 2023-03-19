import Entity from "../Entity";
import {MeshBasicMaterial} from "three";

export default class Geometry extends Entity{
    constructor(name, x, y=0.5, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded, interactions,textures, color="#787878") {
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures);
        this.color=color;
        this.className="Geometry" // this is needed because in production constructor.name isn't possible
    }

    finishLoadGeometryTexture(loadedTexture,callback){
        callback(this);
    }

    loadEntity(callback,options){ //loads the texture of the geometry
        this.loadTextures((texture)=>{this.finishLoadGeometryTexture(texture,callback)},options)
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.color=this.color
    }

    exportMeshMaterial(){
        return new MeshBasicMaterial({color:this.color});
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData +=" color='"+this.color+"' "
        if(this.hasTextures()){
            let assetID= this.getAssetsID(this.textures[0].url,assets)
            if(assetID===""){
                assetID= this.textures[0].getID()+"-img";
            }
            attributesData +=" src='#"+assetID+"' "
        }
        return attributesData;
    }
    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData +=" color='"+this.color+"' "
        return attributesData;
    }

    printScenegraph(){ //called when the object has to be printed for the Scenegraph
        return "Geometry "+ this.getName();
    }

    getColor(){
        return this.color;
    }

    hasToBeLoaded(){
        return this.hasTextures()
    }

    getLoadedSource(){
        if(this.hasTextures()){
            return this.textures[0].getLoadedTexture();
        }
        return null
    }

    setAttribute(name,value){
        switch (name) {
            case "color":
                this.color=value;
                break;
            case "delete-textures":
                this.textures=[];
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getConditionPropertyList(){
        let parentDetails=super.getConditionPropertyList();
        return parentDetails.concat(
            [
                {printName: "Color", id:"color", inputType: "color" ,name: "color",  value: this.color, typeValue:"color", comparable:false}, //color details
            ]
        );
    }

    getDetails(){
        let parentDetails=super.getDetails();
        const textureID=this.hasTextures()?this.textures[0].id:"undefined";
        return parentDetails.concat(
                [
                    {printName: "Color", inputType: "color" ,name: "color",  value: this.color}, //color details
                    {
                        categoryName:"Texture",
                        containedElements: [
                            {printName: "Texture", inputType: "select" ,name: "custom-texture",type: "texture-selector",  value:textureID }, //x details
                            {printName: "Add", inputType: "button" , type:"add-texture", name: "Upload",  value:this}, //y details
                            {printName: "Clear", inputType: "button" ,name: "Clear Texture", type:"clear-texture",  value:[],}, //y details
                        ]
                    },
                ]
        );
    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
            {
                printName:"Change Color",
                id:"change-property_color",
                module:"change-property",
                options:{
                    property:"color"
                },
                parameterList: [
                    {printName: "Color", inputType: "color" ,name: "color",  value: this.color},
                ],
            },
        ]);
    }

    getEvents(){
        let parentEvents=super.getEvents();
        return parentEvents.concat(
            [
                {printName: "Color is changed",  value: "colorChange"}, //color details
            ]
        );
    }
}