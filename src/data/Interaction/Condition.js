import {Vector3} from "three";

export default class Condition {
    constructor(type, target, values,parameters, area, showArea=true) {
        this.type=type;
        this.target=target;
        this.parameters=parameters;
        this.values=values;

        this.showArea=showArea;
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

        this.className="Condition" // this is needed because in production constructor.name isn't possible
        if ( typeof Condition.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Condition.counterChild = 1;
        }
        this.id="Condition"+Condition.counterChild; //set the name to class name + counter
        Condition.counterChild++;
    }

    copyCondition(){
        return new Condition(this.type,this.target,JSON.parse(JSON.stringify(this.values)),JSON.parse(JSON.stringify(this.parameters)))
    }

    exportAttributes(){
        return " type='"+this.type+"'"
            +" id='"+this.id+"'"
            +" target='"+this.target.getID()+"'"
            +" x='"+this.x+"'"
            +" y='"+this.y+"'"
            +" z='"+this.z+"'"
            +" xScale='"+this.xScale+"'"
            +" yScale='"+this.yScale+"'"
            +" zScale='"+this.zScale+"'"
            +" xRotation='"+this.xRotation+"'"
            +" yRotation='"+this.yRotation+"'"
            +" color='"+this.color+"'"
            +" showArea='"+this.showArea+"'"
    }

    exportValueToAframe(){
        let valueList=this.values;
        let valueExport=""
        for (let index=0; index<valueList.length;index++){
            valueExport+=valueList[index]+" ";
        }
        return valueExport;
    }

    exportConditionToAframe(){
        let exportData=""
        switch (this.type){
            case "interactionPerformed":
                exportData="condition-interaction__"+this.id+"=\"interaction:"+this.parameters.interaction+"; target:#"+this.target.getID()+";\" "
                break;
            case "taskCompleted":
                exportData="condition-task__"+this.id+"=\"task:#"+this.parameters.task+"; target:#"+this.target.getID()+";\" "
                break;
            case "activityCompleted":
                exportData="condition-activity__"+this.id+"=\"activity:#"+this.parameters.activity+"; target:#"+this.target.getID()+";\" "
                break;
            case "attributeFulfilled":
                exportData="condition-property__"+this.id+"=\"target:#"+this.target.getID()+"; property:"+this.parameters.propertyModule+"; compare:"+this.parameters.compare+"; type:"+this.parameters.typeValue+"; value:"+ this.exportValueToAframe()+";\" "
                break;
            case "entityArea":
                exportData="condition-check-forwarder__"+this.id+"=\"target:#"+this.getID()+"-area; multicomponent:false; condition:condition-checker-entity-area;\" "
                break;
            case "playerArea":
                exportData="condition-check-forwarder__"+this.id+"=\"target:#"+this.getID()+"-area; multicomponent:false; condition:condition-checker-player-area;\" "
                break;
            default:
        }
        return exportData
    }

    exportAreaChecker(){
        let exportData=""
        switch (this.type){
            case "entityArea":
                exportData="condition-checker-entity-area=\"target:#"+this.target.getID()+";\" "
                break;
            case "playerArea":
                exportData="condition-checker-player-area=\"target:#"+this.target.getID()+";\" "
                break;
            default:
        }
        return exportData
    }

    exportConditionAreaToAframe(){
        return "<a-box"
            +" id='"+this.getID()+"-area'"
            +" height='1' width='1' depth='1'" //size
            +" position='"+this.x+" "+this.y+" "+this.z+"'"
            +" scale='"+this.xScale+" "+this.yScale+" "+this.zScale+"'"
            +" rotation='"+this.xRotation+" "+this.yRotation+" "+this.zRotation+"'"
            +" material='transparent:true; side:double; opacity:0.5; color:"+this.color+";' "
            +" visible='"+this.showArea+"' "
            +this.exportAreaChecker()
            +"></a-box>";
    }

    exportCondition(){
        let conditionData="<Condition "+this.exportAttributes()+">\n";
        conditionData+="\t\t\t\t<parameters object='true'>\n"
        for(const [key, value] of Object.entries(this.parameters)){
            conditionData+="\t\t\t\t\t<"+key+">"+value+"</"+key+">\n";
        }
        conditionData+="\t\t\t\t</parameters>\n"
        conditionData+="\t\t\t\t<values list='true'>\n"
        for(let i=0;i<this.values.length;i++){
            conditionData+="\t\t\t\t\t<entry>"+this.values[i]+"</entry>\n";
        }
        conditionData+="\t\t\t\t</values>\n"
        conditionData+="\t\t\t</Condition>";
        return conditionData;
    }

    fillFromAttributes(attributes){
        let attributeList=Object.entries(attributes); //convert Object to List of contained variables
        for (let index=0;index<attributeList.length;index++){
            this.setAttribute(attributeList[index][0],attributeList[index][1]);
        }
    }

    hasTarget(target){
        return target.getID()===this.target.getID();
    }

    hasArea(){
        switch (this.type){
            case "entityArea":
            case "playerArea":
                return true;
            default:
                return false;
        }
    }

    static hasConditionTypeAnArea(type){
        switch (type){
            case "entityArea":
            case "playerArea":
                return true;
            default:
                return false;
        }
    }

    setAttribute(name,value){
        switch (name) {
            case "type":
                this.type=value;
                break;
            case "id":
                this.id=value;
                break;
            case "target":
                this.target=value;
                break;
            case "parameters":
                this.parameters=value;
                break;
            case "values":
                if(Array.isArray(value)){
                    this.values=value;
                }
                else{
                    this.values=[value];
                }
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
                    if(!value){
                        this.x=parseFloat(parseFloat(value[0]).toFixed(3));
                        this.y+=parseFloat(parseFloat(value[1]).toFixed(3));
                        this.z=parseFloat(parseFloat(value[2]).toFixed(3));
                    }
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
            case "showArea":
                if (typeof value ==="string"){
                    this.showArea = value==="true";
                }
                else{
                    this.showArea = value;
                }
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
        if(this.hasArea()){
            return "Area " + this.target.getName();
        }
        return this.getID();
    }

    getType(){
        return this.type;
    }

    getTarget(){
        return this.target;
    }

    getValues(){
        return this.values;
    }
    getParameters(){
        return this.parameters;
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

    getScale(){
        return [this.xScale,this.yScale, this.zScale]
    }

    isVisible(){
        return this.showArea;
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
        return "Condition "+ this.getName();
    }

    getDetails() {
        let values="";
        for(let index=0;index<this.values.length;index++){
            values+=this.values[index]+" "
        }

        let areaDetails=[];
        if(this.hasArea()){
            areaDetails=[
                {
                    categoryName:"Area Style",
                    containedElements: [
                        {printName: "Visible", inputType: "checkbox" ,name: "showArea",  value: this.showArea,   step:0.1}, //x details
                        {printName: "Color", inputType: "color" ,name: "color",  value: this.color},
                    ]
                },

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
            {printName: "Target", inputType: "span", value: this.target.getName()}, //target details
            {printName: "Type", inputType: "span", value: this.type}, //target details
            {printName: "Values", inputType: "span", value: values}, //target details
        ].concat(areaDetails);
    }

    printCondition(){
        switch (this.type){
            case "taskCompleted":
                return "Task "+this.target.getName()+" completed"
            case "activityCompleted":
                return "Activity "+this.target.getName()+" completed"
            case "playerArea":
                return "Player "+this.target.getName()+" is in Area"
            case "entityArea":
                return "Entity "+this.target.getName()+" is in Area"
            case "interactionPerformed":
                let interactionList=this.target.getInteractions();
                let interactionName="not found"
                for (let index=0; index<interactionList.length; index++){
                    if(this.parameters){
                        if(interactionList[index].getID()===this.parameters.interaction){
                            interactionName=interactionList[index].getName()
                        }
                    }
                }
                return "Performed interaction "+interactionName
            case "attributeFulfilled":
                let compare="unknown"
                if(this.parameters){
                    switch (this.parameters.compare){
                        case "equal":
                        case "greater":
                        case "smaller":
                            compare=this.parameters.compare
                            break;
                        case "notequal":
                            compare="not equal"
                            break;
                        case "greaterequal":
                            compare="greater equal"
                            break;
                        case "smallerequal":
                            compare="smaller equal"
                            break;
                        default:
                    }
                }
                let propertyName="invalid property";
                let propertyList= this.target.getConditionPropertyList();
                for (let index=0; index<propertyList.length;index++){
                    if(this.parameters){
                        if(propertyList[index].id===this.parameters.property){
                            propertyName=propertyList[index].printName;
                        }
                    }
                }


                return "Entitiy "+this.target.getName()+" has property "+propertyName+" "+compare+" "+this.values[0]
            default:
                return "No condition name found"
        }
    }

    static getConditionTypes(){
        return [
            {printName:"Activity is completed", id:"activityCompleted"},
            {printName:"Entity fulfills specific attribute", id:"attributeFulfilled"},
            {printName:"Entity is in a specific area", id:"entityArea"},
            {printName:"Interaction is performed", id:"interactionPerformed"},
            {printName:"Player is in a specific area", id:"playerArea"},
            {printName:"Task is completed", id:"taskCompleted"},
        ]
    }


}