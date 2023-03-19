import {Vector3} from "three";

export default class Activity {
    constructor(name, description,type,parameters,area) {
        this.name=name;
        this.description=description
        this.type=type
        this.parameters=parameters

        if (!this.parameters) { //init parameters
            this.parameters = {};
        }
        if ( typeof Activity.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Activity.counterChild = 1;
        }
        this.className="Activity" // this is needed because in production constructor.name isn't possible
        if(area){
            this.x=(!area.x)?0:area.x;
            this.y=(!area.y)?1:area.y;
            this.z=(!area.z)?0:area.z;
            this.xScale=(!area.xScale)?2:area.xScale;
            this.yScale=(!area.yScale)?2:area.yScale;
            this.zScale=(!area.zScale)?2:area.zScale;
            this.xRotation=(!area.xRotation)?0:area.xRotation;
            this.yRotation=(!area.yRotation)?0:area.yRotation;
            this.zRotation=(!area.zRotation)?0:area.zRotation;
            this.color=(!area.color)?"#FFFFFF":area.color
        }
        else{
            this.x=0
            this.y=1;
            this.z=0;
            this.xScale=2;
            this.yScale=2;
            this.zScale=2;
            this.xRotation=0;
            this.yRotation=0;
            this.zRotation=0;
            this.color="#FFFFFF"
        }

        this.id="Activity"+Activity.counterChild; //set the name to class name + counter
        if (!this.name) { //init parameters
            this.name = this.id;
        }
        Activity.counterChild++;
    }

    copyActivity(){
        let parameterObject={}
        for (const [key, value] of Object.entries(this.parameters)) {
            parameterObject[key]=value;
        }
        let copiedObject=new Activity(this.name,this.description,this.type,parameterObject)
        copiedObject.x=this.x;
        copiedObject.y=this.y;
        copiedObject.z=this.z;
        copiedObject.xScale=this.xScale;
        copiedObject.yScale=this.yScale;
        copiedObject.zScale=this.zScale;
        copiedObject.xRotation=this.xRotation;
        copiedObject.yRotation=this.yRotation;
        copiedObject.zRotation=this.zRotation;
        copiedObject.color=this.color;
        return copiedObject;
    }

    exportAttributes(){
        return " name='"+this.name+"'"
            +" id='"+this.id+"'"
            +" type='"+this.type+"'"
            +" x='"+this.x+"'"
            +" y='"+this.y+"'"
            +" z='"+this.z+"'"
            +" xScale='"+this.xScale+"'"
            +" yScale='"+this.yScale+"'"
            +" zScale='"+this.zScale+"'"
            +" xRotation='"+this.xRotation+"'"
            +" yRotation='"+this.yRotation+"'"
            +" color='"+this.color+"'"
    }


    exportActivityToAframe(taskID,scene){
        if(this.hasArea()){
            return "<a-box"
                +" id='"+this.getID()+"'"
                +" height='1' width='1' depth='1'" //size
                +" position='"+this.x+" "+this.y+" "+this.z+"'"
                +" scale='"+this.xScale+" "+this.yScale+" "+this.zScale+"'"
                +" rotation='"+this.xRotation+" "+this.yRotation+" "+this.zRotation+"'"
                +" material='transparent:true; opacity:0.5; color:"+this.color+";' "
                +this.exportModuleToAframe(taskID,scene)
                +"></a-box>";
        }
        else{
            return "<a-entity id='"+this.getID()+"' "+this.exportModuleToAframe(taskID,scene)+"></a-entity>"
        }
    }

    exportModuleToAframe(taskID,scene){
        let exportData=""
        switch (this.type){
            case "playerGoTo":
                let playerID="#"+this.parameters.player;
                exportData="activity-area-listener-player=\"player:"+playerID+"; activity:"+this.getID()+";\" "
                exportData+="activity-checker__"+this.getID()+"=\"goal:"+playerID+"; event:areaEntered; task:#"+taskID+"; activity:#"+this.getID() +"; property: color; value:#FF00FF;\" "
                break;
            case "entityGoTo":
                exportData="activity-area-listener-entity=\"target:#"+this.parameters.entity+"; activity:"+this.getID()+";\" "
                exportData+="activity-checker__"+this.getID()+"=\"goal:#"+this.parameters.entity+"; event:areaEntered; task:#"+taskID+"; activity:#"+this.getID() +"; property: color; value:#FF00FF;\" "
                break;
            case "entityInteract":
                let entity="";
                for(let indexEntity=0;indexEntity<scene.length;indexEntity++){
                    let interactions=scene[indexEntity].getInteractions();
                    let found=false;
                    for(let indexInteraction=0;indexInteraction<interactions.length;indexInteraction++){
                        if(interactions[indexInteraction].getID()===this.parameters.interaction){
                            entity=scene[indexEntity].getID();
                            found=true;
                            break;
                        }
                    }
                    if(found){
                        break;
                    }
                }
                exportData="activity-check-interaction-performed=\"interaction:"+this.parameters.interaction+"; activity:#"+this.getID()+"; event:performedInteraction; entity:#"+entity+"; task:#"+taskID+"\" "
                break;
            default:
        }
        return exportData
    }

    exportActivity(){
        let activityData="<Activity "+this.exportAttributes()+">\n";
        activityData+="\t\t\t\t<description>"+this.description+"</description>\n"
        activityData+="\t\t\t\t<parameters object='true'>\n"
        for(const [key, value] of Object.entries(this.parameters)){
            activityData+="\t\t\t\t\t<"+key+">"+value+"</"+key+">\n";
        }
        activityData+="\t\t\t\t</parameters>\n"
        activityData+="\t\t\t</Activity>";
        return activityData;
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
            case "x":
                this.x=parseFloat(value);
                break;
            case "y":
                this.y=parseFloat(value);
                break;
            case "z":
                this.z=parseFloat(value);
                break;
            case "position":
                this.x=parseFloat(parseFloat(value[0]).toFixed(3));
                this.y=parseFloat(parseFloat(value[1]).toFixed(3));
                this.z=parseFloat(parseFloat(value[2]).toFixed(3));
                break;
            case "positionPOV":
                if (value instanceof Vector3){
                    this.x=parseFloat(value.x.toFixed(3));
                    this.y+=parseFloat(value.y.toFixed(3));
                    this.z=parseFloat(value.z.toFixed(3));
                }
                else{
                    this.x=parseFloat(parseFloat(value[0]).toFixed(3));
                    this.y+=parseFloat(parseFloat(value[1]).toFixed(3));
                    this.z=parseFloat(parseFloat(value[2]).toFixed(3));
                }
                break;
            case "xRotation":
                this.xRotation=parseFloat(value);
                break;
            case "yRotation":
                this.yRotation=parseFloat(value);
                break;
            case "zRotation":
                this.zRotation=parseFloat(value);
                break;
            case "rotation":
                this.xRotation=parseFloat(parseFloat(value[0]).toFixed(2));
                this.yRotation=parseFloat(parseFloat(value[1]).toFixed(2));
                this.zRotation=parseFloat(parseFloat(value[2]).toFixed(2));
                break;
            case "xScale":
                this.xScale=parseFloat(value);
                break;
            case "yScale":
                this.yScale=parseFloat(value);
                break;
            case "zScale":
                this.zScale=parseFloat(value);
                break;
            case "scale":
                this.xScale=parseFloat(value[0]);
                this.yScale=parseFloat(value[1]);
                this.zScale=parseFloat(value[2]);
                break;
            case "color":
                this.color=value;
                break;
            case "type":
                this.type=value;
                break;
            case "description":
                this.description=value;
                break;
            case "parameters":
                this.parameters=value;
                break;
            default:
                console.log("Variable "+name+" is unknown");
        }
    }

    static getActivityTypes(){
        return [
            {printName:"Player Go to Area", id:"playerGoTo"},
            {printName:"Put Entity on Area", id:"entityGoTo"},
            {printName:"Interact with Entity", id:"entityInteract"},
        ]
    }

    getInputByType(activityType){
        switch(activityType){
            case "playerGoTo":
                return [
                    {
                        printName: "Player",
                        inputType: "select" ,
                        name: "player",
                        selection: "all-camera-entities",
                        value:this.parameters["player"],
                    },
                ]
            case "entityGoTo":
                return [
                    {
                        printName: "Entity",
                        inputType: "select" ,
                        name: "entity",
                        selection: "all-dynamic-entities",
                        value:this.parameters["entity"],
                    },
                ]
            case "entityInteract":
                return [
                    {
                        printName: "Interaction",
                        inputType: "select" ,
                        name: "interaction",
                        selection: "all-interactions",
                        value:this.parameters["interaction"],
                    },
                ]
            default:
                return []
        }
    }

    canBeDeletedFromScene(){
        return true;
    }
    canBeCopiedInScene(){
        return true;
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
    getDescription(){
        if(!this.description){ // no description = empty string
            return "";
        }
        return this.description
    }

    getType(){
        return this.type
    }

    hasArea(){
        switch (this.type){
            case "playerGoTo":
            case "entityGoTo":
                return true;
            case "entityInteract":
            default:
                return false;
        }
    }

    transform(mode,objectThree){
        switch(mode){
            case "translate":
                this.setAttribute("position",
                    [
                        objectThree.position.x,
                        objectThree.position.y,
                        objectThree.position.z
                    ]
                );
                break;
            case "rotate":
                this.setAttribute("rotation",
                    [
                        objectThree.rotation.x*180/Math.PI,
                        objectThree.rotation.y*180/Math.PI,
                        objectThree.rotation.z*180/Math.PI
                    ]
                );
                break;
            case "scale":
                this.setAttribute("scale",
                    [
                        this.xScale*objectThree.scale.x,
                        this.yScale*objectThree.scale.y,
                        this.zScale*objectThree.scale.z
                    ]
                );
                break;
            default:
                console.log("transform "+mode+" not supported");
        }
    }
    getColor(){
        return this.color;
    }

    getPosition(){
        return [this.x,this.y,this.z]
    }

    getParameters(){
        return this.parameters;
    }

    getScale(){
        return [this.xScale,this.yScale, this.zScale]
    }

    isVisible(){
        return true;
    }

    getSize(){
        return [1,1,1]
    }

    getRotation(unit){
        switch (unit) {
            case "degrees":
                return [this.xRotation,this.yRotation, this.zRotation]
            case "radians":
                return [this.xRotation*Math.PI/180,this.yRotation*Math.PI/180, this.zRotation*Math.PI/180]
            default:
                return []
        }

    }

    onRemove(){

    }

    printScenegraph(){
        return "Activity "+ this.getName();
    }

    getDetails(){
        let areaDetails=[];
        if(this.hasArea()){
            areaDetails=[
                {printName: "Area Color", inputType: "color" ,name: "color",  value: this.color},
                {
                    categoryName:"Area Position",
                        containedElements: [
                    {printName: "X", inputType: "number" ,name: "x",  value: this.x,   step:0.1}, //x details
                    {printName: "Y", inputType: "number" ,name: "y",  value: this.y,   step:0.1}, //y details
                    {printName: "Z", inputType: "number" ,name: "z",  value: this.z,   step:0.1},// z details
                ]
                },
                {
                    categoryName:"Area Rotation",
                        containedElements: [
                    {printName: "X", inputType: "number" ,name: "xRotation",  value: this.xRotation,   step:1}, //x Rotation details
                    {printName: "Y", inputType: "number" ,name: "yRotation",  value: this.yRotation,   step:1}, //y Rotation details
                    {printName: "Z", inputType: "number" ,name: "zRotation",  value: this.zRotation,   step:1},// z Rotation details
                ]
                },
                {
                    categoryName: "Area Scale",
                        containedElements: [
                    {printName: "X", inputType: "number", name: "xScale", value: this.xScale, step: 0.1}, //x Scale details
                    {printName: "Y", inputType: "number", name: "yScale", value: this.yScale, step: 0.1}, //y Scale details
                    {printName: "Z", inputType: "number", name: "zScale", value: this.zScale, step: 0.1},// z Scale details
                ]
                },
            ]
        }
        return [
            {printName: "Name", inputType: "text" ,name: "name",  value: this.name}, //name details
            {printName: "Description", inputType: "textarea", name: "description", value: this.description}, //text details
            {printName: "Type", inputType: "span", value: this.type}, //target details
        ].concat(areaDetails);
    }
}