import Interaction from "./Interaction";

export default class ConditionInteraction extends Interaction {
    constructor(name, target, event, module,options, effect, values,conditions=[], showTargetInName=false) {
        super(name, target, event, module,options, effect, values)
        this.showTargetInName=showTargetInName;
        this.conditions=conditions;
        this.className="ConditionInteraction" // this is needed because in production constructor.name isn't possible
        if ( typeof Interaction.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            ConditionInteraction.counterChild = 1;
        }
        this.id="ConditionInteraction"+ConditionInteraction.counterChild; //set the name to class name + counter
        ConditionInteraction.counterChild++;
    }

    copyInteraction(){
        let copiedConditions=[];
        if(!this.conditions){
            for(let index=0;index<this.conditions.length;index++){
                copiedConditions.push(this.conditions[index].copyCondition())
            }
        }
        return new ConditionInteraction(this.name,this.target,this.event, this.module, this.options, this.effect, this.values.slice(),copiedConditions,this.showTargetInName)
    }

    exportConditions(){
        if(this.conditions.length>0) { //entity contains conditions
            let conditionData = "<conditions list='true'>\n";
            for (let i = 0; i < this.conditions.length; i++) {
                conditionData +="\t\t\t"+ this.conditions[i].exportCondition() + "\n";
            }
            conditionData += "\t\t</conditions>";
            return conditionData;
        }
        else{ //entity contains no conditions
            return "";
        }
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+= "showTargetInName='"+this.showTargetInName+"' "
        return attributesData;
    }

    exportInteraction(){
        let interactionData="<ConditionInteraction "+this.exportAttributes()+">\n";
        interactionData+="\t\t\t\t<values list='true'>\n"
        for(let i=0;i<this.values.length;i++){
            interactionData+="\t\t\t\t\t<entry>"+this.values[i]+"</entry>\n";
        }
        interactionData+="\t\t\t\t</values>\n"

        interactionData+="\t\t\t\t<options object='true'>\n"
        for(const [key, value] of Object.entries(this.options)){
            interactionData+="\t\t\t\t\t<"+key+">"+value+"</"+key+">\n";
        }
        interactionData+="\t\t\t\t</options>\n"
        if(this.hasConditions()){
            interactionData+="\n\t\t\t\t"+this.exportConditions()
        }
        interactionData+="\t\t\t</ConditionInteraction>";
        return interactionData;
    }

    exportInteractionToAframe(){
        let exportData=super.exportInteractionToAframe()
        let end= exportData.indexOf(";\"")
        if (end<0){
            end= exportData.indexOf("; \"")
        }
        if (end<0){
            console.log("Interaction could not exported correctly")
            return "";
        }
        exportData=exportData.substring(0,end); // remove the ;"
        exportData+="; condition:true; conditionHandler:#"+this.getID()+"-handler;\" ";
        return exportData
    }

    exportConditionComponentsToAframe(scene){
        let exportData="";
        let conditionIdList="";
        for(let index=0;index<this.conditions.length;index++){
            exportData+=this.conditions[index].exportConditionToAframe();
            conditionIdList+=this.conditions[index].getID().toLowerCase() + ((index===this.conditions.length-1)?"":", ");
        }
        exportData+="condition-checker=\"conditions:"+conditionIdList+";\" ";
        return exportData;
    }

    exportConditionAreasToAframe(scene){
        let areaEntities=""
        for(let index=0; index<this.conditions.length; index++){
            if(this.conditions[index].hasArea()){
                areaEntities+=this.conditions[index].exportConditionAreaToAframe()+"\n"
            }
        }
        return areaEntities
    }

    exportConditionsToAframe(scene){
            return "<a-entity id='"+this.getID()+"-handler' "+this.exportConditionComponentsToAframe(scene)+"></a-entity>"
    }

    setAttribute(name,value){
        switch (name) {
            case "showTargetInName":
                if (typeof value ==="string"){
                    this.showTargetInName = value==="true";
                }
                else{
                    this.showTargetInName = value;
                }
            case "conditions":
                this.conditions=value;
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    hasConditions(){
        if(!this.conditions){
            return false;
        }
        return this.conditions.length>0;
    }

    getName(){
        if (this.showTargetInName){
            return this.name+" "+this.target.getName();
        }
        return this.name;
    }

    getConditions(){
        return this.conditions;
    }


    checkInteractionAreEqual(interaction){
        return false;
    }
    checkInteractionContains(event,target,module,effect){
        return false;
    }

    removeCondition(condition){
        if(condition){
            const conditionList= this.getConditions().slice();
            for( let elementIndex = 0; elementIndex < conditionList.length; elementIndex++){ //remove the object from the list
                if ( conditionList[elementIndex].getID() === condition.getID()){
                    conditionList.splice(elementIndex, 1);
                    this.conditions=conditionList;
                    condition.onRemove(); // call the remove function of the object
                    break;
                }
            }
        }
    }

    onRemove(){

    }

    printScenegraph(){
        return "ConditionInteraction "+ this.getName();
    }

    getDetails() {
        let values="";
        for(let index=0;index<this.values.length;index++){
            values+=this.values[index]+" "
        }
        let conditionsDetailsList=[]
        for(let index=0; index<this.conditions.length;index++){
            conditionsDetailsList.push({printName: "Condition "+(index+1), inputType: "span", value: this.conditions[index].printCondition()})
        }
        return [
            {printName: "Target", inputType: "span", value: this.target.getName()}, //target details
            {printName: "Event", inputType: "span", value: this.event}, //target details
            {printName: "Effect", inputType: "span", value: this.effect}, //target details
            {printName: "Module", inputType: "span", value: this.module}, //target details
            {printName: "Values", inputType: "span", value: values}, //target details
        ].concat(conditionsDetailsList);
    }
}