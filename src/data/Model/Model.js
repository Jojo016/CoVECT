import Entity from "../Entity";
import {Box3, ObjectLoader, Vector3} from "three";
import {ColladaLoader} from "three/examples/jsm/loaders/ColladaLoader";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";


export default class Model extends Entity{
    constructor(modelType,url,userUploaded=false,textures,name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation, interactions) {
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures);
        this.modelType=modelType //type of the 3D Model
        this.url=url; //Url of the Model
        this.className="Model" // this is needed because in production constructor.name isn't possible
        this.yNotSet=true;
        if ( typeof Model.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Model.counterChild = 1;
            Model.maxModelSpan = 4;
        }
        this.name="Model"+Model.counterChild; //set the name to class name + counter
        Model.counterChild++;
        this.model=null; // the Three.js Object of the Model
    }

    copyEntity(){
        let copiedObject=new Model();
        this.copyTo(copiedObject)
        return copiedObject;
    }
    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.modelType = this.modelType //type of the 3D Model
        copiedObject.url = this.url; //Url of the Model
    }

    isAboveMaxModelSpan(model){ //check if the model is above a maximum span
        let bbox = new Box3().setFromObject(model);
        let size = bbox.getSize(new Vector3());
        let maxAxis = Math.max(size.x, size.y, size.z);
        return maxAxis > Model.maxModelSpan
    }

    performLoadModel(texturesLoaded,modelLoaded,textures,model,options,callback){
        if(!texturesLoaded){ //first step loading textures
            this.loadTextures((loadedTextures)=>this.performLoadModel(true,false,loadedTextures,null,options,callback),options)
        }
        else{ //second step load model
            if(!modelLoaded){
                this.loadModel((loadedModel)=>this.performLoadModel(true,true,textures,loadedModel,options,callback),options)
            }
            else{ //last step
                if(!model||!textures){
                    callback(null)
                }
                else{
                    this.model=this.traverseTextures(model,textures); //apply textures
                    this.model.traverse( function( child ) {
                        if (child.type === "Mesh") {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    })
                    this.model.castShadow=true;
                    this.model.receiveShadow=true;

                    //autoscale model if it bigger than the max span
                    if(options){
                        if(options.autoscale){
                            if(this.isAboveMaxModelSpan(this.model)){
                                this.performAutoScale()
                            }
                            else{
                                if(!options.noCenter){
                                    this.centerModel(this.model)
                                }
                            }
                        }
                        else{
                            if(!options.noCenter){
                                this.centerModel(this.model)
                            }
                        }
                    }
                    else{
                        this.centerModel(this.model)
                    }
                    if(this.yNotSet){
                        let bbox = new Box3().setFromObject(this.model);
                        let size= new Vector3()
                        bbox.getSize(size);
                        this.y=size.y/2;
                    }
                    callback(this);
                }
            }
        }
    }

    loadModel(callback,options){
        switch (this.modelType) { //load the 3D Model
            case "json":
                new ObjectLoader().load(this.url, model => callback(model),()=>{},(e)=>{console.log(e); callback(null);});//load the model and apply textures
                break;
            case "collada":
                new ColladaLoader().load(this.url, model => callback(model),()=>{},(e)=>{console.log(e); callback(null);});//load the model and apply textures
                break;
            case "fbx":
                new FBXLoader().load(this.url, model => callback(model),()=>{},(e)=>{console.log(e); callback(null);});//load the model and apply textures
                break;
            case "obj":
                new OBJLoader().load(this.url, model => callback(model),()=>{},(e)=>{console.log(e); callback(null);}); //load the model and apply textures
                break;
            case "gltf":
                new GLTFLoader().load(this.url, model => callback(model.scene),()=>{},(e)=>{console.log(e); callback(null);}); //load the model and apply textures
                break;
            default:
                console.log("Not supported 3D model")
                callback(null);
        }
    }

    loadEntity(callback,options){ //loads the Object3D of the model and calls the callback after finishing
        this.performLoadModel(false,false,undefined,undefined,options,callback)
    }

    centerModel(mesh){
        mesh.updateMatrix()
        let worldPosition=new Vector3()
        mesh.getWorldPosition(worldPosition);
        let bbox = new Box3().setFromObject(mesh);
        let cent = bbox.getCenter(new Vector3());
        mesh.position.set(worldPosition.x-cent.x,worldPosition.y-cent.y,worldPosition.z-cent.z);
        this.isCentered=true;
        return mesh;
    }

    performAutoScale(){ //the dummy class only resets the scale
        if(this.model){
            this.autoScale(this.model,Model.maxModelSpan)
        }
    }

    // removeAutoScale(){ //the dummy class only resets the scale
    //     if(this.model){ //reset the internal autoscale
    //         this.model.position.set(0,0,0)
    //         this.model.scale.set(1,1,1)
    //         this.model.rotation.set(0,0,0)
    //         this.centerModel(this.model)
    //     }
    // }

    hasToBeLoaded(){
        return true;
    }

    exportMeshGeometry(){
        return this.model.geometry
    }
    exportMeshMaterial(){
        return this.model.material
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["modelType","url"])
    }

    exportAsMesh(){
        let mesh= this.model.clone();
        mesh.updateMatrix();
        let position = new Vector3(this.x,this.y,this.z)
        let scale = new Vector3(this.xScale,this.yScale,this.zScale)
        let adjustedRotation=this.getRotation("radians")
        mesh.rotation.set(adjustedRotation[0],adjustedRotation[1],adjustedRotation[2]);//the rotation of the mesh will be ignored
        mesh.scale.multiply(scale);
        mesh.position.multiply(scale);
        let bbox = new Box3().setFromObject(mesh);
        let cent = bbox.getCenter(new Vector3());
        let worldPosition=new Vector3()
        mesh.getWorldPosition(worldPosition);
        mesh.position.set(worldPosition.x-cent.x,worldPosition.y-cent.y,worldPosition.z-cent.z);
        mesh.position.add(position);
        mesh.updateMatrixWorld(true);
        return mesh;
    }

    exportPhysicsToAframe(){
        let physics=""
        if(this.physicsDisabled){
            return ""
        }
        if(this.isStatic){
            // physics+=" static-body=\"shape:hull\" ";
            physics+=" static-body=\"shape:box\" ";
        }
        else{
            if(this.isDynamic){
                physics+=" dynamic-body=\"shape:box\" ";
            }
        }
        return physics
    }

    exportAssetsToAFrame(assets) {
        if(this.checkIfAssetsIsNotIncluded(this.getUrl(),assets)) {
            assets.push({src:this.getUrl(),id:this.getID() + "-model"})
            return "<a-asset-item id=\"" + this.getID() + "-model\" src=\"" + this.url + "\"></a-asset-item>"
        }
        return "";
    }

    exportPositionToAFrame(){
        if(this.model){
            let modelPosition=this.exportAsMesh()
            let position={x:modelPosition.position.x, y:modelPosition.position.y,z:modelPosition.position.z}
            modelPosition.remove()
            return position
        }
        else{
            return super.exportPositionToAFrame();
        }
    }
    exportScaleToAFrame(){
        if(this.model){
            // let modelPosition=this.exportAsMesh()
            // return {x:modelPosition.scale.x, y:modelPosition.scale.y,z:modelPosition.scale.z}
            return {x:this.model.scale.x*this.xScale, y:this.model.scale.y*this.yScale,z:this.model.scale.z*this.zScale}
        }
        else{
            return super.exportPositionToAFrame();
        }
    }
    // exportRotationToAFrame(){
    //     if(this.model){
    //         let modelPosition=this.exportAsMesh()
    //         return {x:modelPosition.rotation.x/Math.PI*180, y:modelPosition.rotation.y/Math.PI*180,z:modelPosition.rotation.z/Math.PI*180}
    //     }
    //     else{
    //         return super.exportPositionToAFrame();
    //     }
    // }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        let assetID= this.getAssetsID(this.url,assets)
        if(assetID===""){
            assetID= this.getID()+"-model";
        }
        if(this.modelType==="gltf"){
            attributesData+=" class='loadmodel'"
            attributesData+=" gltf-model=\"#"+assetID+"\" ";
        }
        else{
            attributesData+=" class='loadmodel'"
            attributesData+=" src=\"#"+assetID+"\" ";
        }
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+=" modelType='"+this.modelType+"'"
            +" url='"+this.url+"' ";
        return attributesData;
    }

    //includes custom textures in the model
    traverseTextures(model,loadedTextures){
        if(this.textures.length>0&&loadedTextures.length===this.textures.length){ //model has textures
            model.traverse( child=>{ //apply texture to the material
                    if(child.type==="Mesh") { //element of the Model is a mesh
                        for (let i = 0; i < this.textures.length; i++) { //search if this mesh needs a texture
                            if(child.material.name===loadedTextures[i].materialName) { //texture is found
                                child.material.map= loadedTextures[i].texture;
                            }
                        }
                    }
                });
            }
        return model;
    }


    printScenegraph(){ //called when the object has to be printed for the Scenegraph
        return "Model "+ this.getName();
    }

    getUrl(){
        return this.url;
    }

    getModelType(){
        return this.modelType;
    }

    get3DModel(){
        return this.model;
    }

    setAttribute(name,value){
        switch (name) {
            case "url":
                this.url=value;
                break;
            case "modelType":
                this.modelType=value;
                break;
            case "userUploaded":
                this.userUploaded=value;
                break;
            case "y": //a specific handling of y in model
                this.yNotSet=false;
                super.setAttribute(name,value); // still perform the standard set y
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

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([

        ]);
    }

    getEvents(){
        let parentEvents=super.getEvents();
        return parentEvents.concat(
            [
            ]
        );
    }
}