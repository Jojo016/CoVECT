import {FontLoader, PlaneBufferGeometry} from "three";
import Entity from "../Entity";

export default class TaskBar extends Entity{
    constructor(name, x, y=0.5, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,task, width=2, height=1,color="#FFFFFF",background=true, backgroundColor="#000000") { //Javascript allows only one constructor
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color)
        this.height=height;
        this.width=width;
        this.task=task
        this.color=color;
        this.backgroundColor=backgroundColor;
        this.background=background;
        this.font="/fonts/Roboto_Regular.json"; // fixed Font
        this.fontThree=null;
        this.className="TaskBar" // this is needed because in production constructor.name isn't possible
        if ( typeof TaskBar.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            TaskBar.counterChild = 1;
        }
        this.name="TaskBar"+TaskBar.counterChild; //set the name to class name + counter
        TaskBar.counterChild++;
    }

    loadEntity(callback,options) {
        let loader = new FontLoader();
        loader.load( this.font ,  ( fontLoaded ) => {
            this.fontThree=fontLoaded //save font
            callback(this)
        });
    }

    hasToBeLoaded(){
        return true;
    }

    copyEntity(){
        let copiedObject=new TaskBar() ;
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.height=this.height;
        copiedObject.width=this.width;
        copiedObject.color=this.color;
        copiedObject.backgroundColor=this.backgroundColor;
        copiedObject.background=this.background;
        copiedObject.task=this.task;
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["height","width"])
    }

    exportMeshGeometry(){
        return new PlaneBufferGeometry(this.width,this.height);
    }

    exportEntityToAFrame(assets,scene){
        return "<a-text "+this.exportAttributesToAFrame(assets,scene)+"></a-text>";
    }
    exportTaskText(){
        if(this.task){

            let text=this.task.getName()+":\n"+this.task.getDescription()
            let activities=this.task.getActivities();
            for (let index=0; index<activities.length;index++){
                text+="\n    ( ) "+activities[index].getName()+": "+activities[index].getDescription()
            }
            return text;
        }
        return "No Task Selected";
    }

    exportAttributesToAFrame(assets,scene) {
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        let text =this.exportTaskText();
        let lines = text.split(/\r?\n/)
        let mostSymbols=0
        for(let index=0; index<lines.length;index++){ //calculate the longest string to configure the symbol wrapper
            if(lines[index].length>mostSymbols){
                mostSymbols=lines[index].length
            }
        }
        attributesData +=" wrap-count='"+mostSymbols+"'"
            +" color='" + this.color+"'"
            +" value='"+text+"'"
            +" height='"+(this.height-this.height/5)+"'"
            +" width='"+(this.width-this.height/5)+"'"
            +" anchor='center'"
            +" material='visible:"+this.background+";"
            +" side:double;"
            +" color:"+this.backgroundColor+";'"
            +" geometry='primitive:plane;"
            +" height:"+this.height+";"
            +" width:"+this.width+";'"


        if(this.task){
            let activityText="";
            let activity="";
            let activityList= this.task.getActivities();
            let description= this.task.getDescription();
            description=description.replace(/&/g, '&amp_amp_') //replace all &
                .replace(/</g, '&lt_') //replace all <
                .replace(/>/g, '&gt_') //replace all >
                .replace(/"/g, '&quot_') //replace all "
                .replace(/'/g, '&apos_') //replace all '
                .replace(/\n/g,'&newLine_') // replace all line breaks
                .replace(/ /g,'&space_'); // replace all line breaks
            for (let index=0;index<activityList.length;index++){
                let text=activityList[index].getName()+": "+activityList[index].getDescription()
                text=text.replace(/&/g, '&amp_amp_') //replace all &
                    .replace(/</g, '&lt_') //replace all <
                    .replace(/>/g, '&gt_') //replace all >
                    .replace(/"/g, '&quot_') //replace all "
                    .replace(/'/g, '&apos_') //replace all '
                    .replace(/\n/g,'&newLine_') // replace all line breaks
                    .replace(/ /g,'&space_'); // replace all line breaks
                activityText+=text+((index<activityList.length-1)?" ":"")
                activity+="#"+activityList[index].getID()+ ((index<activityList.length-1)?" ":"")
            }
            attributesData +="taskbar-manager=\"task:#"+this.task.getID()+"; textActivities: "+activityText+"; activities: "+activity+"; taskName: "+this.task.getName()+"; taskDescription: "+description+";\" "
        }
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        let taskID= (this.task)? this.task.getID():""
        attributesData+= " height='"+this.height+"'"
            +" width='"+this.width+"'"
            +" task='"+taskID+"'"
            +" color='"+this.color+"'"
            +" background='"+this.background+"'"
            +" backgroundColor='"+this.backgroundColor+"' "
        return attributesData;
    }

    printScenegraph() {
        return "TaskBar "+this.getName();
    }

    showsTask(task){
        if(task){
            if(this.task){
                return task.getID()===this.task.getID()
            }
        }
        return false;
    }

    setAttribute(name,value){
        switch (name) {
            case "color":
                this.color=value;
                break;
            case "backgroundColor":
                this.backgroundColor=value;
                break;
            case "background":
                if (typeof value ==="string"){
                    this.background = value==="true";
                }
                else{
                    this.background = value;
                }
                break;
            case "height":
                this.height=parseFloat(value);
                break;
            case "width":
                this.width=parseFloat(value);
                break;
            case "task":
                    this.task = value;
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getSize(){
        return this.height/4;
    }

    getBackgroundSize(){
        return [this.width,this.height];
    }

    getBackgroundColor(){
        return this.backgroundColor
    }

    hasBackground(){
        return this.background;
    }
    getColor(){
        return this.color;
    }
    getThreeFont(){
        return this.fontThree;
    }

    getText(){
        if(this.task){
            return this.task.getName();
        }
        return "no task"
    }

    getTextPosition(){
        return [
            -this.width/2+(this.width/10),
            -this.height/8,
            0.0001
        ]
    }

    getDetails(){
        let parentDetails=super.getDetails();
        let taskID= (this.task)?this.task.getID():"undefined";
        return parentDetails.concat(
            [
                {printName: "Task", inputType: "select" ,name: "all-tasks",type: "task-selector",  value:taskID }, //x details
                {
                    categoryName: "Color",
                    containedElements: [
                        {printName: "Text", inputType: "color", name: "color", value: this.color}, //color details
                        {printName: "Background", inputType: "color", name: "backgroundColor", value: this.backgroundColor}, //background details
                    ]
                },
                {
                    categoryName: "Size",
                    containedElements: [
                        {printName: "Width", inputType: "number", name: "width", value: this.width, step: 0.1}, //width details
                        {printName: "Height", inputType: "number", name: "height", value: this.height, step: 0.1}, //height details
                    ]
                },
                {printName: "Content", inputType: "textarea" ,lock:"true" ,name: "content",  value:this.exportTaskText() }, //x details

            ]
        );
    }

    getEvents(){
        let parentEvents=super.getEvents();
        let activityEvents=[]
        if(this.task){
            for (let index=0;index<this.task.getActivities().length;index++){
                activityEvents=activityEvents.concat({printName: "Activity "+(index+1)+" completed on ", value: "activityDone_"+index})
            }
        }
        return parentEvents.concat( [ //list all Events. Printname is used to describe the event. Value is used to save the javascript event name
            {printName: "Task completed on ", value: "taskDone"}, // mouseenter event
            {printName: "An Activity completed on ", value: "activityDone"}, //mouseleave event
        ]).concat(activityEvents);

    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
        ]);
    }
}