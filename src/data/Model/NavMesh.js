import Model from "./Model";


export default class NavMesh extends Model{
    constructor(modelType,url,userUploaded,textures,name, x=0, y=0, z=0,xScale,yScale,zScale,xRotation,yRotation,zRotation, interactions) {
        super(modelType,url,userUploaded,textures,name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,interactions);
        this.isDynamic=false;
        this.isStatic=false;
        this.receiveShadow=false;
        this.castShadow=false;
        this.physicsDisabled=true
        this.visible=false;
        this.className="NavMesh" // this is needed because in production constructor.name isn't possible
        if ( typeof NavMesh.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            NavMesh.counterChild = 1;
        }
        this.name="Navigation"+NavMesh.counterChild; //set the name to class name + counter
        NavMesh.counterChild++;
    }

    loadEntity(callback,options){ //loads the Object3D of the model and calls the callback after finishing
        console.log("modelloader")
        if(!options){
            options={noCenter:true}
        }
        else{
            options["noCenter"]=true;
        }
        this.setAttribute("y",0)//this will prevent the automatic center of y
        this.performLoadModel(false,false,undefined,undefined,options,callback)
    }

    copyEntity(){
        let copiedObject=new NavMesh();
        this.copyTo(copiedObject)
        return copiedObject;
    }
    copyTo(copiedObject) {
        super.copyTo(copiedObject)
    }

    isExportedForNavmeshGeneration(){ //decides if the entity will be considered for the navigantion mesh generation
        return false;
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData+=" nav-mesh";
        return attributesData;
    }

    exportPositionToAFrame(){
        return {x:this.x,y:this.y,z:this.z} //overrides the model position function
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        return attributesData;
    }

    setAttribute(name,value){
        switch (name) {
            default:
                super.setAttribute(name,value);
        }
    }

    getDetails(){
        let parentDetails=super.getDetails();
        for(let index=parentDetails.length-1;index>=0;index--){ //remove static and autoscale
            if(["toggleStatic","isAutoscaled-with-performing"].includes(parentDetails[index].name)){
                parentDetails.splice(index, 1);
            }
        }
        return parentDetails.concat(
            [
                ]
        );
    }

    printScenegraph(){ //called when the object has to be printed for the Scenegraph
        return "Navigation "+ this.getName();
    }

    canBeCopiedInScene(){
        return false;
    }
}