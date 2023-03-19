import Activity from "./Activity";

export default class Task {
    constructor(name,description, activities) {
        this.name=name;
        this.description=description
        this.activities=activities;

        if ( typeof Task.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Task.counterChild = 1;
        }
        this.id="Task"+Task.counterChild; //set the name to class name + counter
        this.className="Task" // this is needed because in production constructor.name isn't possible
        if(!this.name){
            this.name=this.id
        }
        if(!this.activities){
            this.activities=[]
        }
        Task.counterChild++;
    }

    copyTask(){
        let activityList=[]
        for(let index=0;index<this.activities.length;index++){
            activityList=activityList.concat(this.activities[index].copyActivity())
        }
        return new Task(this.name,this.description, activityList)
    }

    exportAttributes(){
        return " name='"+this.name+"'"
        +" id='"+this.id+"' "
    }


    exportActivitiesToAFrame(scene){
        let exportData="";
        for(let index=0;index<this.activities.length;index++){
            exportData+= this.activities[index].exportActivityToAframe(this.getID(),scene)+"\n"
        }
        return exportData
    }
    exportTaskCheckerToAframe(){
        let activityList=""

        for(let index=0; index<this.activities.length;index++){
            activityList+="#"+this.activities[index].getID();
            if(index<this.activities.length-1){
                activityList+=" "
            }
        }
        return "task-checker=\"task:#"+this.getID()+"; activities:"+activityList+";\""
    }

    exportTaskToAFrame(scene){
        let taskData="<a-entity id='"+this.getID()+"' "+this.exportTaskCheckerToAframe() +"></a-entity>\n";
        taskData+=this.exportActivitiesToAFrame(scene);
        return taskData;
    }

    exportTask(){
        let taskData="<Task "+this.exportAttributes()+">\n";
        taskData+="\t\t<Activities>\n"
        for (let index=0;index<this.activities.length;index++){
            taskData+="\t\t\t"+this.activities[index].exportActivity();
        }
        taskData+="\t\t</Activities>\n"
        taskData+="\t\t<description>"+this.description+"</description>\n"

        taskData+="\t\t\t</Task>";
        return taskData;
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
            case "description":
                this.description=value;
                break;
            case "activities":
                if(Array.isArray(value)){
                    this.activities=value;
                }
                else{
                    this.activities=[value];
                }
                break;
            default:
                console.log("Variable "+name+" is unknown");
        }
    }

    canBeDeletedFromScene(){
        return true;
    }
    canBeCopiedInScene(){
        return true;
    }
    containsActivity(activity){
        for (let i=0; i<this.activities.length;i++) {
            if (this.activities[i].getID()===activity.getID()) {
                return true;
            }
        }
        return false;
    }

    addActivity(activity){
        if(activity instanceof Activity){
            if(this.activities){
                this.activities=this.activities.concat(activity)
            }
            else{
                this.activities=[activity]
            }
        }
    }

    getActivities(){
        return this.activities
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

    onRemove(){

    }

    removeActivity(activity){
        if(activity){
            const activityList= this.getActivities().slice();
            for( let elementIndex = 0; elementIndex < activityList.length; elementIndex++){ //remove the object from the list
                if ( activityList[elementIndex].getID() === activity.getID()){
                    activityList.splice(elementIndex, 1);
                    this.activities=activityList;
                    activity.onRemove(); // call the remove function of the object
                    break;
                }
            }
        }
    }

    printScenegraph(){
        return "Task "+ this.getName();
    }

    getDetails(){
        return [
            {printName: "Name", inputType: "text" ,name: "name",  value: this.name}, //name details
            {printName: "Description", inputType: "textarea", name: "description", value: this.description}, //text details
        ];
    }
}