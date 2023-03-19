import ConditionInteraction from "./ConditionInteraction";

export default class Interaction {
    constructor(name, target, event, module,options, effect, values) {
        this.name=name;
        this.target=target;
        this.event=event;
        this.module=module;
        this.options=options;
        this.effect=effect;
        this.values=values;
        this.className="Interaction" // this is needed because in production constructor.name isn't possible
        if ( typeof Interaction.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            Interaction.counterChild = 1;
        }
        this.id="Interaction"+Interaction.counterChild; //set the name to class name + counter
        Interaction.counterChild++;
    }

    copyInteraction(){
        return new Interaction(this.name,this.target,this.event, this.module, this.options, this.effect, this.values.slice())
    }

    exportAttributes(){
        return " name='"+this.name+"'"
        +" id='"+this.id+"'"
        +" target='"+this.target.getID()+"'"
        +" event='"+this.event+"'"
        +" module='"+this.module+"'"
        +" effect='"+this.effect+"' ";
    }

    exportValueToAframe(){
        let valueList=this.values;
        let valueExport=""
        for (let index=0; index<valueList.length;index++){
            valueExport+=valueList[index]+" ";
        }
        return valueExport;
    }

    exportInteractionToAframe(){
        let exportData=""
        switch (this.module){
            case "teleport-to_position":
                exportData="teleport-to_position__"+this.id+"=\"interaction:"+this.getID()+"; player:#"+this.target.getRigID()+"; event:"+this.event+"; value:"+ this.exportValueToAframe()+";\" "
                break;
            case "add-property":
            case "change-property":

                exportData=this.module+"__"+this.id+"=\"interaction: "+this.getID()+"; target:#"+this.target.getID()+"; event:"+this.event+"; property:"+this.options.property+"; value:"+ this.exportValueToAframe()+";\" "
                break;
            case "change-property-cond":
                exportData="change-property-cond__"+this.id+"=\"interaction: "+this.getID()+"; target:#"+this.target.getID()+"; event:"+this.event+"; property:"+this.options.property+"; value:"+ this.values[0]+"; cond:"+ this.values[1]+";\" "
                break;
            case "toggle-property":
                exportData="toggle-property__"+this.id+"=\"interaction: "+this.getID()+"; target:#"+this.target.getID()+"; event:"+this.event+"; property:"+this.options.property+";\" "
                break;
            case "pdf-set-page":
                exportData="pdf-set-page__"+this.id+"=\"interaction:"+this.getID()+"; target:#"+this.target.getID()+"; event:"+this.event+"; page:"+this.values[0]+";\" "
                break;
            case "video-set-to-second":
            case "video-skip-seconds":
                exportData=this.module+"__"+this.id+"=\"interaction:"+this.getID()+"; target:#"+this.target.getID()+"; event:"+this.event+"; second:"+this.values[0]+";\" "
                break;
            case "pdf-next-page":
            case "pdf-prev-page":
            case "video-play-pause":
            case "video-play":
            case "video-pause":
            case "reset-counter":
                exportData=this.module+"__"+this.id+"=\"interaction:"+this.getID()+"; target:#"+this.target.getID()+"; event:"+this.event+";\" "
                break;
            case "increase-counter":
            case "decrease-counter":
            case "increase-counter-once":
            case "decrease-counter-once":
                exportData=this.module+"__"+this.id+"=\"interaction:"+this.getID()+"; target:#"+this.target.getID()+"; event:"+this.event+"; value:"+this.values[0]+";\" "
                break;
            default:
                console.log("could not find module",this.module)
        }
        return exportData
    }

    exportInteraction(){
        let interactionData="<Interaction "+this.exportAttributes()+">\n";
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
        interactionData+="\t\t\t</Interaction>";
        return interactionData;
    }

    fillFromAttributes(attributes){
        let attributeList=Object.entries(attributes); //convert Object to List of contained variables
        for (let index=0;index<attributeList.length;index++){
            this.setAttribute(attributeList[index][0],attributeList[index][1]);
        }
    }

    hasTarget(target){
        return target.name===this.target.name
    }

    setAttribute(name,value){
        switch (name) {
            case "name":
                this.name=value;
                break;
            case "id":
                this.id=value;
                break;
            case "target":
                this.target=value;
                break;
            case "event":
                this.event=value;
                break;
            case "effect":
                this.effect=value;
                break;
            case "module":
                this.module=value;
                break;
            case "options":
                this.options=value;
                break;
            case "values":
                if(Array.isArray(value)){
                    this.values=value;
                }
                else{
                    this.values=[value];
                }
                break;
            default:
                console.log("Variable "+name+" is unknown");
        }
    }

    updateEffectValues(effect, values){
        this.effect=effect;
        this.values=values;
    }

    getClassName(){ //this function returns name of the class object
        return this.className;
    }

    getID(){
        return this.id;
    }

    getName(){
        return this.name +this.target.name;
    }

    getTarget(){
        return this.target;
    }

    getModule(){
        return this.module;
    }

    getValues(){
        return this.values;
    }

    getOptions(){
        return this.options;
    }

    getEffect(){
        return this.effect;
    }

    getEvent(){
        return this.event;
    }

    checkInteractionContains(event,target,module,effect){
        return (event === this.event) && (target.getID() === this.target.getID())&&( module === this.module) && (effect === this.effect);
    }

    checkInteractionAreEqual(interaction){
        if(interaction instanceof ConditionInteraction){
            return false;
        }
        return this.checkInteractionContains(interaction.event,interaction.target,interaction.module, interaction.effect);
    }

    onRemove(){

    }

    printScenegraph(){
        return "Interaction "+ this.getName();
    }

    getDetails() {
        let values="";
        for(let index=0;index<this.values.length;index++){
            values+=this.values[index]+" "
        }
        return [
            {printName: "Target", inputType: "span", value: this.target.getName()}, //target details
            {printName: "Event", inputType: "span", value: this.event}, //target details
            {printName: "Effect", inputType: "span", value: this.effect}, //target details
            {printName: "Module", inputType: "span", value: this.module}, //target details
            {printName: "Values", inputType: "span", value: values}, //target details
        ];
    }
}