import React from "react";
import ReactModal from "react-modal";
import "../../styles/DialogManager.css"
import ConditionDialog from "./ConditionDialog";
import ListSelectionDialog from "./ListSelectionDialog";
import ConditionInteraction from "../../data/Interaction/ConditionInteraction";
import Condition from "../../data/Interaction/Condition";




export default class InteractionWizard extends React.Component {
    constructor(props) {
        super(props);
        this.conditionDialogRef=React.createRef(); //reference to inform the conditionDialogRef about the staring values
        this.state = {
            showError:false,
            errorMessage:"",

            showWarning:false,
            warningMessage:"",

            showSelectEntityDialog:false, //show select dialog

            selectedSource:null, //selected Entity
            selectedTarget:null,
            chosenEvent:null,
            chosenEffect:null,
            chosenEffectValues:[],
            chosenModule:null,
            chosenModuleOptions: {},
            interactionName:"Interaction",
            conditionList:[],

            cameraPosition:{}, //saves the position of the viewpoint camera

            interactionMode:"create", //mode of the wizard create or edit
            selectionMode:"source", //where to save the selection
            shownPage:0, //shown page of the wizard

            showConditionDialog:false, //show the ConditionDialog

            conditionCreateId:0, // the id is used to destinguish the conditions to enable edition. The id only has to be unique in the process of the wizard. no setup needed in a saved state.
            removeList:[], //lists all ids which are deleted. This is needed to delete condition in the edit mode
            edittedInteraction:null,// saves the interaction which is editted to save the changes
        };
    }

    configureBeforeOpeningWithInteraction(mode,interaction,source,cameraPosition){
        let conditionDataList=interaction.getConditions();
        let tempConditionList=[];
        for(let index=0; index<conditionDataList.length; index++){
            let tempCondition={};
            tempCondition.id=conditionDataList[index].getID();
            tempCondition.target=conditionDataList[index].getTarget()
            tempCondition.values=conditionDataList[index].getValues().slice();
            tempCondition.type=conditionDataList[index].getType()
            tempCondition.parameters={};
            switch(conditionDataList[index].getType()){
                case "interactionPerformed":
                    tempCondition.parameters.interaction=conditionDataList[index].getParameters().interaction;
                    let interactionData=null;
                    let scene=this.props.scene
                    for (let indexEntity = 0; indexEntity < scene.length; indexEntity++) {
                        let found = false;
                        let interactionList = scene[indexEntity].getInteractions();
                        for (let indexInteraction = 0; indexInteraction < interactionList.length; indexInteraction++) {
                            if (interactionList[indexInteraction].getID() === conditionDataList[index].getParameters().interaction) {
                                interactionData = interactionList[indexInteraction]
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            break;
                        }
                    }
                    tempCondition.interaction=interactionData;
                    break;
                case "activityCompleted":
                    tempCondition.parameters.activity=conditionDataList[index].getParameters().activity;
                    let activityData=null;
                    let tasks=this.props.tasks
                    for (let indexTask = 0; indexTask < tasks.length; indexTask++) {
                        let found = false;
                        let activityList = tasks[indexTask].getActivities();
                        for (let indexActivity = 0; indexActivity < activityList.length; indexActivity++) {
                            if (activityList[indexActivity].getID() === conditionDataList[index].getParameters().activity) {
                                activityData = activityList[indexActivity]
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            break;
                        }
                    }
                    tempCondition.activity=activityData;
                    break;
                case "taskCompleted":
                    tempCondition.parameters.task=conditionDataList[index].getParameters().task;
                    let taskData=null;

                    for (let indexTask = 0; indexTask < this.props.tasks.length; indexTask++) {
                        if (this.props.tasks[indexTask].getID() === conditionDataList[index].getParameters().task) {
                            taskData = this.props.tasks[indexTask]
                            break;
                        }
                    }
                    tempCondition.task=taskData;
                    break;
                case "attributeFulfilled":
                    tempCondition.parameters.property=conditionDataList[index].getParameters().property;
                    tempCondition.parameters.propertyModule=conditionDataList[index].getParameters().propertyModule;
                    tempCondition.parameters.compare=conditionDataList[index].getParameters().compare;
                    tempCondition.parameters.typeValue=conditionDataList[index].getParameters().typeValue;
                    let propertyList=conditionDataList[index].getTarget().getConditionPropertyList();
                    for (let index=0;index<propertyList.length;index++){
                        if(tempCondition.parameters.property===propertyList[index].id){
                            tempCondition.property=propertyList[index];
                            break;
                        }
                    }
                    break;
                default:
            }
            tempConditionList.push(tempCondition)
        }

        let copiedModuleOptions={};
        for (const [key, value] of Object.entries(interaction.getOptions())) {
            copiedModuleOptions[key]=value;
        }
        this.setState({
            selectedSource:source, //selected Entity
            chosenEvent:interaction.getEvent(),
            selectedTarget:interaction.getTarget(),
            chosenEffect:interaction.getEffect(),
            chosenEffectValues:interaction.getValues().slice(),
            chosenModule:interaction.getModule(),
            chosenModuleOptions:copiedModuleOptions,
            cameraPosition:cameraPosition,

            conditionList:tempConditionList, //condition list
            interactionMode:mode,


            edittedInteraction:interaction,

            //default configuration
            selectionMode:"source",
            shownPage:0,
            showError:false,
            errorMessage:"",
            showWarning:false,
            warningMessage:"",
            showConditionDialog:false,
            removeList:[],
        })
    }

    configureBeforeOpening(mode,source,event,target,effect,values,module, moduleOptions,cameraPosition){
        this.setState({
            selectedSource:source, //selected Entity
            chosenEvent:event,
            selectedTarget:target,
            chosenEffect:effect,
            chosenEffectValues:values,
            chosenModule:module,
            chosenModuleOptions:moduleOptions,
            interactionMode:mode,
            cameraPosition:cameraPosition,

            //default configuration
            selectionMode:"source",
            shownPage:0,
            showError:false,
            errorMessage:"",
            showWarning:false,
            warningMessage:"",
            showConditionDialog:false,
            conditionList:[],
            removeList:[],
            edittedInteraction:null,
        })
    }

    saveSelectedEntity(entity){
        switch(this.state.selectionMode){
            case "source":
                let eventDefault=null;
                let eventSupported=false;
                if(this.state.chosenEvent){
                    let eventList=entity.getEvents()
                    for(let index=0;index<eventList.length;index++){
                        if(this.state.chosenEvent===eventList[index].value){
                            eventDefault=this.state.chosenEvent;
                            eventSupported=true;
                        }
                    }
                }
                if(!eventSupported){
                    eventDefault=entity.getEvents()[0].value
                }
                this.setState({
                    showSelectEntityDialog:false,
                    selectedSource:entity,
                    chosenEvent:eventDefault,
                })
                break;
            case "target":
                let effectDefault=null;
                let effectSupported=false;
                let values=[];
                if(this.state.chosenEffect){
                    let effectList=entity.getEffects()
                    for(let index=0;index<effectList.length;index++){
                        if(this.state.chosenEffect===effectList[index].id){
                            effectDefault=effectList[index];
                            effectSupported=true;
                            values=this.state.chosenEffectValues;
                        }
                    }
                }
                if(!effectSupported){
                    effectDefault=entity.getEffects()[0]
                    for(let index=0; index<effectDefault.parameterList.length;index++){
                        values.push(effectDefault.parameterList[index].value)
                    }
                }
                this.setState({
                    showSelectEntityDialog:false,
                    selectedTarget:entity,
                    chosenEffect:effectDefault.id,
                    chosenEffectValues:values,
                    chosenModule:effectDefault.module,
                    chosenModuleOptions:effectDefault.options,
                })
                break;
            default:
        }
    }
    saveInteraction(event){
        event.preventDefault();
        let conditionInteraction=null;
        if(this.state.interactionMode==="edit"){
            conditionInteraction =this.state.edittedInteraction;
            let conditions = conditionInteraction.getConditions().slice();
            let addedConditions=[]

            for (let index = 0; index < this.state.removeList.length; index++) { // delete all condition which were deleted in the wizard
                for (let indexCondition = 0; indexCondition < conditions.length; indexCondition++) {
                    if(conditions[indexCondition].getID()===this.state.removeList[index]){
                        conditions.splice(indexCondition,1); // remove the entry
                        break;
                    }
                }
            }


            for (let index = 0; index < this.state.conditionList.length; index++) { // edit editted condition and create new condition in a added list
                let entry = this.state.conditionList[index];
                let isNewCondition=true;
                for (let indexCondition = 0; indexCondition < conditions.length; indexCondition++) {
                    if(conditions[indexCondition].getID()===entry.id){
                        if(this.state.cameraPosition) { // if camera position is saved
                            if (!conditions[indexCondition].hasArea() && Condition.hasConditionTypeAnArea(entry.type)) { //setup area if previous type had no area
                                conditions[indexCondition].setAttribute("positionPOV", this.state.cameraPosition)
                            }
                        }
                        conditions[indexCondition].setAttribute("type",entry.type);
                        conditions[indexCondition].setAttribute("target",entry.target);
                        conditions[indexCondition].setAttribute("values",entry.values);
                        conditions[indexCondition].setAttribute("parameters",entry.parameters);
                        isNewCondition=false;
                        break;
                    }
                }
                if(isNewCondition){ //condition not found. Create a new one
                    let newCondition=new Condition(
                        entry.type,
                        entry.target,
                        entry.values,
                        entry.parameters
                    )
                    if(this.state.cameraPosition){
                        newCondition.setAttribute("positionPOV",this.state.cameraPosition)
                    }
                    addedConditions.push(newCondition)
                }
            }

            conditionInteraction.setAttribute("name",this.state.interactionName)
            conditionInteraction.setAttribute("target",this.state.selectedTarget)
            conditionInteraction.setAttribute("event",this.state.chosenEvent)
            conditionInteraction.setAttribute("module",this.state.chosenModule)
            conditionInteraction.setAttribute("options",this.state.chosenModuleOptions)
            conditionInteraction.setAttribute("effect",this.state.chosenEffect)
            conditionInteraction.setAttribute("values",this.state.chosenEffectValues)
            conditionInteraction.setAttribute("conditions",conditions.concat(addedConditions))
        }
        else {
            let conditionList = []
            for (let index = 0; index < this.state.conditionList.length; index++) {
                let entry = this.state.conditionList[index];
                let condition = new Condition(
                    entry.type,
                    entry.target,
                    entry.values,
                    entry.parameters
                );
                if(condition.hasArea()){
                    condition.setAttribute("positionPOV",this.state.cameraPosition)
                }
                conditionList.push(condition)
            }
            conditionInteraction = new ConditionInteraction(
                this.state.interactionName,
                this.state.selectedTarget,
                this.state.chosenEvent,
                this.state.chosenModule,
                this.state.chosenModuleOptions,
                this.state.chosenEffect,
                this.state.chosenEffectValues,
                conditionList
            );
        }
        this.props.save(conditionInteraction,this.state.selectedSource);
    }

    saveCondition(condition){
        let indexConditionList=-1;
        if (this.state.conditionList){
            for (let index=0; index<this.state.conditionList.length;index++) {
                if(condition.id===this.state.conditionList[index].id){
                    indexConditionList=index;
                    break;
                }
            }
        }
        if(indexConditionList<0) { // the condition is created
            this.setState({
                conditionList: this.state.conditionList.concat(condition),
                showConditionDialog: false, //show the ConditionDialog
            })
        }
        else { // condition is edited
            let copiedList=this.state.conditionList.slice();
            copiedList[indexConditionList]=condition //replace temporary saved condition
            this.setState({
                conditionList: copiedList,
                showConditionDialog: false, //show the ConditionDialog
            })
        }
    }

    removeCondition(condition){
        let indexConditionList=-1;
        if (this.state.conditionList){
            for (let index=0; index<this.state.conditionList.length;index++) {
                if(condition.id===this.state.conditionList[index].id){
                    indexConditionList=index;
                    break;
                }
            }
        }
        if(indexConditionList>=0) { // the condition is found
            let copiedList=this.state.conditionList.slice();
            copiedList.splice(indexConditionList,1);
            this.setState({
                removeList: this.state.removeList.concat(condition.id),
                conditionList: copiedList,
            })
        }
    }

    createCondition(){
        let conditionData={id:"id"+this.state.conditionCreateId} //create an empty temporary condition with a given id.
        this.setState({
            conditionCreateId:this.state.conditionCreateId+1,
        })
        this.openConditionDialog("create",conditionData)
    }

    openSelectEntity(mode){
        this.setState({
            showSelectEntityDialog:true,
            selectionMode:mode
        })
    }

    openConditionDialog(mode,conditionData){
        this.conditionDialogRef.current.configureDialogBeforeOpening(mode,this.state.conditionList,conditionData,this.state.edittedInteraction,this.props.scene,this.props.tasks)
        this.setState({
            showConditionDialog:true,
        })
    }

    nextPage(limit){
        let next=this.state.shownPage+1
        if(next<limit){
            this.setState({shownPage:next})
        }
    }
    previousPage(){
        let next=this.state.shownPage-1
        if(next<0){
            return;
        }
        this.setState({shownPage:next})
    }


    handleChangedEffect(effect){
        let effectList=this.state.selectedTarget.getEffects();
        let effectData=null;
        for(let index=0; index<effectList.length;index++){
            if(effectList[index].id===effect){
                effectData=effectList[index]
            }
        }
        let values=[];
        for(let index=0; index<effectData.parameterList.length;index++){
            values.push(effectData.parameterList[index].value)
        }
        this.setState({
            chosenEffect:effect,
            chosenEffectValues:values,
            chosenModule:effectData.module,
            chosenModuleOptions:effectData.options,
        })
    }

    handleChangeInEffectValue(index,value){
        let effectValues=this.state.chosenEffectValues.slice();
        effectValues[index]=value;
        this.setState({
                chosenEffectValues:effectValues,
            }
        );
    }

    createConditionName(condition){
        switch (condition.type){
            case "taskCompleted":
                return "Task "+condition.task.getName()+" completed"
            case "activityCompleted":
                return "Activity "+condition.activity.getName()+" completed"
            case "playerArea":
                return "Player "+condition.target.getName()+" is in Area"
            case "entityArea":
                return "Entity "+condition.target.getName()+" is in Area"
            case "interactionPerformed":
                return "Performed interaction "+condition.interaction.getName()
            case "attributeFulfilled":
                let compare="";
                if(condition.parameters){
                    switch (condition.parameters.compare){
                        case "equal":
                        case "greater":
                        case "smaller":
                            compare=condition.parameters.compare
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

                return "Entitiy "+condition.target.getName()+" has property "+condition.property.printName+" "+compare+" "+condition.values[0]
            default:
                return "No condition name found"
        }
    }


    render() {
        let eventSelection=[]
        if(this.state.selectedSource){
            eventSelection=this.state.selectedSource.getEvents().map((eventData, move)=>{
                return (
                    <option key={move+"_event"} value={eventData.value}>
                        {eventData.printName + " " + this.state.selectedSource.getName()}
                    </option>
                );
            })
        }
        let effectSelection=[]
        if(this.state.selectedTarget) {
            effectSelection = this.state.selectedTarget.getEffects().map((effectData, move) => {
                return (
                    <option key={move + "_effect"} value={effectData.id}>
                        {effectData.printName}
                    </option>
                );
            })
        }
        let selectedEffectsParameters=null;
        if(this.state.chosenEffect&&this.state.selectedTarget){
            let effectList=this.state.selectedTarget.getEffects();
            let effect=null;
            for(let index=0; index<effectList.length;index++){
                if(effectList[index].id===this.state.chosenEffect){
                    effect=effectList[index]
                    break;
                }
            }
            if(effect){
                selectedEffectsParameters=effect.parameterList.map((object, move) => {
                    if(object.inputType==="checkbox"){
                        return (
                            <div className="dialog-panel-content-input-element"
                                 key={this.state.selectedTarget.getID()+object.name}>
                                <span>
                                    {object.printName+":"}
                                </span>
                                <input
                                    type={object.inputType}
                                    name={object.name}
                                    checked={this.state.chosenEffectValues[move]}
                                    onChange={(e) => this.handleChangeInEffectValue(move,e.target.checked)}/>
                            </div>
                        );
                    }
                    return (
                        <div className="dialog-panel-content-input-element"
                             key={this.state.selectedTarget.getID()+object.name}>
                        <span>
                            {object.printName+":"}
                        </span>
                            <input
                                type={object.inputType}
                                value={this.state.chosenEffectValues[move]}
                                step={object.step}
                                min={object.min}
                                max={object.max}
                                onChange={(e)=>this.handleChangeInEffectValue(move,e.target.value)}/>
                        </div>
                    );
                });
            }
        }

        let sourcePage= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-element">
                    <span>
                        Source
                    </span>
                    <div className="dialog-panel-content-input-element-double">
                        <span>
                            {this.state.selectedSource?this.state.selectedSource.getName():"no entity"}
                        </span>
                        <button
                            onClick={() => this.openSelectEntity("source")}
                            type="button"
                        >
                            Select Entity
                        </button>
                    </div>
                </div>
                <div className="dialog-panel-content-input-element">
                    <span>
                        Event
                    </span>
                    <select
                        value={this.state.chosenEvent}
                        onChange={(event)=> this.setState({chosenEvent:event.target.value})}>
                        {eventSelection}
                    </select>
                </div>
                <div className={this.state.showError?"dialog-panel-error":"dialog-hidden"}>
                    <span>Error</span>
                    <span >{this.state.errorMessage}</span>
                </div>
                <div className={this.state.showWarning?"dialog-panel-warning":"dialog-hidden"}>
                    <span>Warning</span>
                    <span >{this.state.warningMessage}</span>
                </div>
                <div className="dialog-Panel-Buttons">
                    <button type="button" disabled={false} onClick={()=>this.previousPage()}>Previous Step</button>
                    <button type="button" onClick={() => this.props.cancel()}>Cancel</button>
                    <button type="button" disabled={this.state.selectedSource&this.state.chosenEvent} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let targetPage= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-element">
                    <span>
                        Target
                    </span>
                    <div className="dialog-panel-content-input-element-double">
                        <span>
                            {this.state.selectedTarget?this.state.selectedTarget.getName():"no entity"}
                        </span>
                        <button
                            onClick={() => this.openSelectEntity("target")}
                            type="button"
                        >
                            Select Entity
                        </button>
                    </div>
                </div>
                <div className="dialog-panel-content-input-element">
                    <span>
                        Effect:
                    </span>
                    <select
                        value={this.state.chosenEffect}
                        onChange={(event)=> this.handleChangedEffect(event.target.value)}>
                        {effectSelection}
                    </select>
                </div>
                {selectedEffectsParameters}
                <div className={this.state.showError?"dialog-panel-error":"dialog-hidden"}>
                    <span>Error</span>
                    <span >{this.state.errorMessage}</span>
                </div>
                <div className={this.state.showWarning?"dialog-panel-warning":"dialog-hidden"}>
                    <span>Warning</span>
                    <span >{this.state.warningMessage}</span>
                </div>
                <div className="dialog-Panel-Buttons">
                    <button type="button" disabled={false} onClick={()=>this.previousPage()}>Previous Step</button>
                    <button type="button" onClick={() => this.props.cancel()}>Cancel</button>
                    <button type="button" disabled={this.state.selectedTarget&this.state.chosenEffect} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let conditonList= this.state.conditionList.map((entry, move)=>{
            return(
                <div key={"condition" + move} className="dialog-panel-activity-list-entry">
                        <span >
                            {this.createConditionName(entry)}
                        </span>
                    <button type="button" onClick={()=>this.openConditionDialog("edit",entry)}
                    >
                        Edit
                    </button>
                    <button type="button" onClick={()=>this.removeCondition(entry)}>Remove</button>
                </div>
            )
        });

        let ConditionPage= (
            <form onSubmit={(e) => e.preventDefault()}>

                <div className="dialog-panel-content-input-element">
                                    <span>
                                        Condition:
                                    </span>
                    <button
                        type="button"
                        onClick={() => this.createCondition()}
                    >
                        Add an Condition
                    </button>
                </div>
                <div className={(this.state.conditionList.length>0)? "dialog-panel-activity-list":"dialog-hidden"}>
                    {conditonList}
                </div>
                <div className={this.state.showError?"dialog-panel-error":"dialog-hidden"}>
                    <span>Error</span>
                    <span >{this.state.errorMessage}</span>
                </div>
                <div className={this.state.showWarning?"dialog-panel-warning":"dialog-hidden"}>
                    <span>Warning</span>
                    <span >{this.state.warningMessage}</span>
                </div>
                <div className="dialog-Panel-Buttons">
                    <button type="button" disabled={false} onClick={()=>this.previousPage()}>Previous Step</button>
                    <button type="button" onClick={() => this.props.cancel()}>Cancel</button>
                    <button type="button" disabled={false} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let NamePage= (
            <form onSubmit={(e) => this.saveInteraction(e)}>
                <div className="dialog-panel-content-input-element">
                    <span>
                        Name:
                    </span>
                    <input
                        value={this.state.interactionName}
                        type="text"
                        onChange={(e) => this.setState({interactionName: e.target.value})}
                    />
                </div>
                <div className={this.state.showError?"dialog-panel-error":"dialog-hidden"}>
                    <span>Error</span>
                    <span >{this.state.errorMessage}</span>
                </div>
                <div className={this.state.showWarning?"dialog-panel-warning":"dialog-hidden"}>
                    <span>Warning</span>
                    <span >{this.state.warningMessage}</span>
                </div>
                <div className="dialog-Panel-Buttons">
                    <button type="button" disabled={false} onClick={()=>this.previousPage()}>Previous Step</button>
                    <button type="button" onClick={() => this.props.cancel()}>Cancel</button>
                    <button type="submit" disabled={!this.state.interactionName}>Save</button>
                </div>
            </form>
        )

        let pageList=[sourcePage,targetPage,ConditionPage,NamePage]
        return (
            <div>
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.props.show} //this state handles the visibility
                    contentLabel={this.state.interactionMode+" Interaction"}>
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>
                                {this.state.interactionMode.charAt(0).toUpperCase() + this.state.interactionMode.slice(1)+" an Interaction"}
                            </h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>
                               {this.state.interactionMode.charAt(0).toUpperCase() + this.state.interactionMode.slice(1)+" an interaction with an condition"}
                            </span>
                        </div>
                        <div className="dialog-Panel-Content">
                            {pageList[this.state.shownPage]}
                        </div>
                    </div>
                </ReactModal>
                <ListSelectionDialog
                    cancel={()=>this.setState({showSelectEntityDialog:false})}
                    show={this.state.showSelectEntityDialog}
                    result={(entity)=>this.saveSelectedEntity(entity)}
                    list={this.props.scene}
                />
                <ConditionDialog
                    cancel={()=>this.setState({showConditionDialog:false})}
                    show={this.state.showConditionDialog}
                    result={(condition)=>this.saveCondition(condition)}
                    scene={this.props.scene}
                    tasks={this.props.tasks}
                    ref={this.conditionDialogRef}
                />
            </div>
        );
    }
}
