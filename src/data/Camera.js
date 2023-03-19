import Entity from "./Entity";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {Box3, Vector3} from "three";

export default class Camera extends Entity{
    constructor(name,avatar,playerHeight, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions, textures ) { //Javascript allows only one constructor
        super(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions, textures )
        this.avatar=avatar
        this.playerHeight=playerHeight;
        this.model=null;
        this.rig="rig"
        this.className="Camera" // this is needed because in production constructor.name isn't possible
    }

    loadEntity(callback){
        let loader =new GLTFLoader()
        loader.load(this.avatar, model =>{
            this.model=model.scene
            this.model.rotation.set(0,Math.PI,0)
            this.performAutoScale()
            let bbox = new Box3().setFromObject(this.model);
            let size = bbox.getSize(new Vector3());
            this.model.position.y+=size.y/2
            // this.model.rotation.set(0,Math.PI,0)
            callback(this)
        }); //load the model and apply textures
    }

    performAutoScale(){ //the dummy class only resets the scale
        if(this.model){
            this.autoScale(this.model,this.playerHeight,this)
        }
        else{
            //there is no Threejs Object to autoscale
            this.setAttribute("scale",[1,1,1]) //reset scale in editor
        }
    }

    removeAutoScale(){ //the dummy class only resets the scale
        if(this.model){ //reset the internal autoscale
            this.model.position.set(0,0,0)
            this.model.scale.set(1,1,1)
            this.model.rotation.set(0,0,0)
        }
        this.setAttribute("scale",[1,1,1]) //reset scale in editor
    }

    isExportedForNavmeshGeneration(){ //decides if the entity will be considered for the navigantion mesh generation
        return false;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData +=" playerHeight='"+this.playerHeight+"'"
            +" avatar='"+this.avatar+"'"
            +" rig='"+this.rig+"' "
        return attributesData;
    }

    exportYRotation(){
        let limit=140

        if((this.xRotation>limit||this.xRotation<(-1*limit))&&(this.zRotation>limit||this.zRotation<(-1*limit))){ //in the transformation controll X rotation and Z rotation are adjusted when y Rotation goes beyond 90 or -90 degree
            if(this.yRotation<0){
                return -180-this.yRotation
            }
            return 180-this.yRotation
        }
        else{
            return this.yRotation
        }
    }

    exportEntityToAFrame(assets,scene){
        return "<a-entity id='"+this.getRigID()+"' movement-controls='constrainToNavMesh: true' rotation=' 0 "+this.exportYRotation() +" 0' position='"+this.x+" "+this.y+" "+this.z+"'>\n"
            +"\t<a-entity oculus-touch-controls='hand: left' static-body=\"shape: sphere; sphereRadius: 0.04;\" controller-collision-pass-event sphere-collider grab-one-listener></a-entity>\n"
            +"\t<a-entity oculus-touch-controls='hand: right' static-body=\"shape: sphere; sphereRadius: 0.04;\" controller-collision-pass-event sphere-collider grab-one-listener></a-entity>\n"
            +"\t<a-entity id="+this.getID()+" camera position='0 "+this.playerHeight+" 0'  look-controls=\"pointerLockEnabled:true\" >\n"
            +"\t\t<a-cursor far='20'></a-cursor>\n"
            +"\t</a-entity>\n"
            +"</a-entity>";
    }

    printScenegraph() {
        return "Camera "+this.getName();
    }

    canBeDeletedFromScene(){
        return false;
    }

    canBeCopiedInScene(){
        return false;
    }

    setAttribute(name,value){
        switch (name) {
            case "playerHeight":
                this.playerHeight=parseFloat(value);
                break;
            case "avatar":
                this.avatar=value;
                break;
            case "rig":
                this.rig=value;
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {printName: "Player Height", inputType: "number" ,name: "playerHeight",  value: this.playerHeight,   step:0.1}, //x Rotation details
            ]
        );
    }

    getEffects(){
        return [
            {
                printName:"Teleport To Position",
                id:"teleport-to_position",
                module:"teleport-to_position",
                options:{
                },
                parameterList: [
                    {printName: "X", inputType: "number" ,name: "x",  value: this.x}, //x details
                    {printName: "Y", inputType: "number" ,name: "y",  value: this.y}, //y details
                    {printName: "Z", inputType: "number" ,name: "z",  value: this.z}// z details
                ]
            },

        ];
    }

    getUrl(){
        return this.avatar
    }
    get3DModel(){
        return this.model
    }
    getRigID(){
        return this.rig;
    }
}