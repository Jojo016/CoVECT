import Light from "./Light";

export default class DirectionalLight extends Light{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded, interactions,textures, color,intensity,targetX=0,targetY=0,targetZ=0) {
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color,intensity);
        this.targetX=targetX;
        this.targetY=targetY;
        this.targetZ=targetZ;
        this.className="DirectionalLight" // this is needed because in production constructor.name isn't possible
        if ( typeof DirectionalLight.counter == 'undefined' ) { //init the static variable on the first constructor call
            DirectionalLight.counter = 1;
        }
        this.name="DirectionalLight"+DirectionalLight.counter; //set the name to class name + counter
        DirectionalLight.counter++;
    }

    copyEntity(){
        let copiedObject=new DirectionalLight();
        this.copyTo(copiedObject)
        return copiedObject;
    }
    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.targetX=this.targetX;
        copiedObject.targetY=this.targetY;
        copiedObject.targetZ=this.targetZ;
    }

    exportPosition(){
        return { //positon is used as direction vector. The direction is calculated from the position to 0 0 0
            //because the direction is calculated from the position to 0 0 0 the normal direction vector has to negated
            //=> -(targetX-x)=xPos-xTarget
            x:this.x-this.targetX,
            y:this.y-this.targetY,
            z:this.z-this.targetZ
        }
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData +=" distance='"+this.distance+"'"
        return attributesData;
    }

    exportEntityToAFrame(assets,scene){
        return "<a-light type='directional' "+this.exportAttributesToAFrame(assets,scene)+"></a-light>";
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData +=" targetX='"+this.targetX+"'"
            +" targetY='"+this.targetY+"'"
            +" targetZ='"+this.targetZ+"' "
        return attributesData;
    }

    printScenegraph(){ //called when the object has to be printed for the Scenegraph
        return "Directional Light "+ this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "targetX":
                this.targetX=parseFloat(value);
                break;
            case "targetY":
                this.targetY=parseFloat(value);
                break;
            case "targetZ":
                this.targetZ=parseFloat(value);
                break;
            case "target":
                this.targetX=parseFloat(value[0]);
                this.targetY=parseFloat(value[1]);
                this.targetZ=parseFloat(value[2]);
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {printName: "Target X", inputType: "number" ,name: "targetX",  value: this.targetX, step:0.1}, //TargetX details
                {printName: "Target Y", inputType: "number" ,name: "targetY",  value: this.targetY, step:0.1}, //TargetY details
                {printName: "Target Z", inputType: "number" ,name: "targetZ",  value: this.targetZ, step:0.1}, //TargetZ details
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
        );
    }
}