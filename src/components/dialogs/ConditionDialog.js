import React from "react";
import ReactModal from "react-modal";
import "../../styles/DialogManager.css"
import Condition from "../../data/Interaction/Condition";
import ListSelectionDialog from "./ListSelectionDialog";
import Camera from "../../data/Camera";




export default class ConditionDialog extends React.Component {
    constructor(props) {
        super(props);
        this.conditionTypesSelectOptions=Condition.getConditionTypes().map((type,move)=>{
            return (
                <option key={"typeSelection"+move} value={type.id}>
                    {type.printName}
                </option>
            )
        })
        this.listSelectionFunction=()=>{};
        this.state = {
            showError:false,
            errorMessage:"",
            showWarning:false,
            warningMessage:"",

            conditionID:0, //id of the condition
            selectedType:null, // a search value to filter the entities
            selectedTarget:null, //the current selected entity
            selectedValues:[],
            selectedInteraction:null, //used to save the selected interaction
            selectedProperty:null, // used to save the selected property
            selectedCompare:"equal", //saves the comparative sign of the property
            selectedTask:null, // used to save the selected task
            selectedActivity:null, // used to save the selected activity

            alreadyTakenProperties:[], // list of all taken properties
            alreadyTakenInteractions:[], // list of all taken interactions
            alreadyTakenActivities:[], // list of all taken activities
            alreadyTakenTasks:[], // list of all taken tasks
            alreadyTakenAreaEntities:[], // list of all entities used in areas
            alreadyTakenAreaPlayers:[], // list of all player used in areas

            conditionMode:"create", //mode of the dialog

            showSelectListDialog:false,
            listSelectionList:[],


        };
    }

    configureDialogBeforeOpening(mode,conditionList,condition,editedInteraction,scene,tasks){
        let alreadyTakenInteractions=[];
        let alreadyTakenProperties=[];
        let alreadyTakenTasks=[];
        let alreadyTakenActivities=[];
        let alreadyTakenAreaEntities=[];
        let alreadyTakenAreaPlayers=[];
        console.log("condData",condition)
        if(conditionList){
            for(let index=0;index<conditionList.length;index++){
                if(conditionList[index].parameters){
                    if(conditionList[index].parameters.property){
                        let ingnoreTakenProperty=false;
                        if(mode==="edit"){ // the previous selected interaction should be ignored to enable the user to select it again
                            if(condition.parameters.property){//edited condition has an interaction
                                ingnoreTakenProperty=(condition.parameters.property===conditionList[index].parameters.property)
                            }
                        }
                        if(!ingnoreTakenProperty){
                            alreadyTakenProperties.push((""+conditionList[index].target.getID()+"-"+conditionList[index].parameters.property));
                        }
                    }
                    if(conditionList[index].parameters.interaction){
                        let ingnoreTakenInteraction=false;
                        if(mode==="edit"){ // the previous selected interaction should be ignored to enable the user to select it again
                            if(condition.parameters.interaction){//edited condition has an interaction
                                ingnoreTakenInteraction=(condition.parameters.interaction===conditionList[index].parameters.interaction)
                            }
                        }
                        if(!ingnoreTakenInteraction){
                            alreadyTakenInteractions.push(conditionList[index].parameters.interaction)
                        }
                    }
                    if(conditionList[index].parameters.task){
                        let ignoreTakenTask=false;
                        if(mode==="edit"){ // the previous selected interaction should be ignored to enable the user to select it again
                            if(condition.parameters.task){//edited condition has an interaction
                                ignoreTakenTask=(condition.parameters.task===conditionList[index].parameters.task)
                            }
                        }
                        if(!ignoreTakenTask){
                            alreadyTakenTasks.push(conditionList[index].parameters.task)
                        }
                    }
                    if(conditionList[index].parameters.activity){
                        let ignoreTakenActivity=false;
                        if(mode==="edit"){ // the previous selected interaction should be ignored to enable the user to select it again
                            if(condition.parameters.activity){//edited condition has an interaction
                                ignoreTakenActivity=(condition.parameters.activity===conditionList[index].parameters.activity)
                            }
                        }
                        if(!ignoreTakenActivity){
                            alreadyTakenActivities.push(conditionList[index].parameters.activity)
                        }
                    }
                }
                if(conditionList[index].area){
                    let ignoreArea=false;
                    if(mode==="edit"){
                        if(condition.target){
                            ignoreArea=(condition.target.getID()===conditionList[index].target.getID())
                        }
                    }
                    if(!ignoreArea){
                        if(conditionList[index].target instanceof Camera){
                            alreadyTakenAreaPlayers.push(conditionList[index].target.getID())
                        }
                        else {
                            alreadyTakenAreaEntities.push(conditionList[index].target.getID())
                        }
                    }
                }
            }
        }

        if(editedInteraction){
            alreadyTakenInteractions.push(editedInteraction.getID())
        }

        if(condition){
            if (mode==="edit"){
                let copiedValues = condition.values.slice();
                let interaction = null;
                if (condition.parameters.interaction) { // search the interaction data
                    for (let indexEntity = 0; indexEntity < scene.length; indexEntity++) {
                        let found = false;
                        let interactionList = scene[indexEntity].getInteractions();
                        for (let indexInteraction = 0; indexInteraction < interactionList.length; indexInteraction++) {
                            if (interactionList[indexInteraction].getID() === condition.parameters.interaction) { //only saves the ID
                                interaction = interactionList[indexInteraction]
                                found = true;
                                break;
                            }
                        }
                        if (found) {
                            break;
                        }
                    }
                }
                let activity = null;
                let task = null;
                if (condition.parameters.activity||condition.parameters.task) { // search the interaction data
                    let foundTask=!condition.parameters.task; //if not set the task is found
                    let foundActivity=!condition.parameters.task //if not set the activity is found
                    for (let indexTask = 0; indexTask < tasks.length; indexTask++) {
                        if(!foundTask){ //search task
                            if (tasks[indexTask].getID() === condition.parameters.task) { //only saves the ID
                                task = tasks[indexTask]
                                foundTask = true;
                            }
                        }
                        if(!foundActivity) { //search activity
                            let activityList = tasks[indexTask].getActivities();
                            for (let indexActivity = 0; indexActivity < activityList.length; indexActivity++) {
                                if (activityList[indexActivity].getID() === condition.parameters.activity) { //only saves the ID
                                    activity = activityList[indexActivity]
                                    foundActivity = true;
                                    break;
                                }
                            }

                        }
                        if (foundActivity&&foundTask) {
                            break;
                        }
                    }
                }
                this.setState({

                    alreadyTakenProperties: alreadyTakenProperties,
                    alreadyTakenInteractions: alreadyTakenInteractions,
                    alreadyTakenTasks: alreadyTakenTasks,
                    alreadyTakenActivities: alreadyTakenActivities,
                    alreadyTakenAreaEntities:alreadyTakenAreaEntities,
                    alreadyTakenAreaPlayers:alreadyTakenAreaPlayers,

                    //condition data
                    selectedType: condition.type,
                    selectedTarget: condition.target, //the current selected entity
                    selectedValues: copiedValues,
                    selectedInteraction: interaction, //used to save the selected interaction
                    selectedProperty: condition.property, // used to save the selected property
                    selectedCompare:condition.parameters.compare, //saves the comparative sign of the property
                    selectedTask:task, // used to save the selected task
                    selectedActivity:activity, // used to save the selected activity
                    conditionID: condition.id,


                    conditionMode:mode,
                    showSelectListDialog: false,
                    listSelectionList: [],
                })
            }
            else{
                this.setState({
                    selectedType:"interactionPerformed",
                    alreadyTakenProperties:alreadyTakenProperties,
                    alreadyTakenInteractions:alreadyTakenInteractions,
                    alreadyTakenTasks: alreadyTakenTasks,
                    alreadyTakenActivities: alreadyTakenActivities,
                    alreadyTakenAreaEntities:alreadyTakenAreaEntities,
                    alreadyTakenAreaPlayers:alreadyTakenAreaPlayers,

                    selectedTarget:null, //the current selected entity
                    selectedValues:[],
                    selectedInteraction:null, //used to save the selected interaction
                    selectedProperty:null, // used to save the selected property
                    selectedCompare:"equal", //saves the comparative sign of the property
                    selectedTask:null, // used to save the selected task
                    selectedActivity:null, // used to save the selected activity

                    conditionID:condition.id,

                    conditionMode:mode,
                    showSelectListDialog:false,
                    listSelectionList:[],

                })
            }
        }
        else{ //error => default values
            let id=Math.floor(Math.random() * 10001) //random id between 0-1000
            this.setState({
                selectedType:"interactionPerformed",
                alreadyTakenProperties:alreadyTakenProperties,
                alreadyTakenInteractions:alreadyTakenInteractions,
                alreadyTakenTasks: alreadyTakenTasks,
                alreadyTakenActivities: alreadyTakenActivities,
                alreadyTakenAreaEntities:alreadyTakenAreaEntities,
                alreadyTakenAreaPlayers:alreadyTakenAreaPlayers,

                selectedTarget:null, //the current selected entity
                selectedValues:[],
                selectedInteraction:null, //used to save the selected interaction
                selectedProperty:null, // used to save the selected property
                selectedCompare:"equal", //saves the comparative sign of the property
                selectedTask:null, // used to save the selected task
                selectedActivity:null, // used to save the selected activity
                conditionID:"error"+id,

                conditionMode:mode,
                showSelectListDialog:false,
                listSelectionList:[],

            })
        }
    }

    saveSelectedTask(task){
        this.setState({
            selectedTarget:task,
            selectedTask:task,
            selectedValues:[],

            showSelectListDialog:false,
            listSelectionList:[],
        })
    }

    saveSelectedActivity(activity){
        this.setState({
            selectedTarget:activity,
            selectedActivity:activity,
            selectedValues:[],

            showSelectListDialog:false,
            listSelectionList:[],
        })
    }

    saveSelectedInteraction(entity,interaction){
        this.setState({
            selectedTarget:entity,
            selectedInteraction:interaction,
            selectedValues:[],

            showSelectListDialog:false,
            listSelectionList:[],
        })
    }

    saveSelectedValue(value){
        let seletedvalue=[]
        if(Array.isArray(value)){
            seletedvalue=value;
        }
        else {
            seletedvalue=[value]
        }
        this.setState({
            selectedValues:seletedvalue,
        })
    }

    saveSelectedCompare(compare){
        if(!compare){
            return;
        }
        this.setState({
            selectedCompare:compare,
        })
    }

    saveSelectedProperty(property){
        let value=[]
        if(Array.isArray(property.value)){
            value=property.value;
        }
        else {
            value=[property.value]
        }
        this.setState({
            selectedProperty:property,
            selectedValues:value,
            selectedCompare:"equal",

            showSelectListDialog:false,
            listSelectionList:[],
        })
    }


    saveSelectedEntity(entity,mode){
        switch (mode){
            case "player":
            case "grab":
            case"entity":
                this.setState({
                    selectedTarget:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            default:
                this.setState({
                    selectedTarget:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
        }
    }

    result(event){
        event.preventDefault();
        let condition={};
        condition.target=this.state.selectedTarget;
        condition.values=this.state.selectedValues;
        condition.type=this.state.selectedType;
        condition.parameters={};
        switch (this.state.selectedType){
            case"interactionPerformed":
                if(this.state.selectedInteraction){
                    condition.parameters={interaction:this.state.selectedInteraction.getID()};
                    condition.interaction=this.state.selectedInteraction
                }
                else {
                    condition.name="error"
                }
                break;
            case"taskCompleted":
                if(this.state.selectedTask){
                    condition.parameters={task:this.state.selectedTask.getID()};
                    condition.task=this.state.selectedTask
                }
                else {
                    condition.name="error"
                }
                break;
            case"activityCompleted":
                if(this.state.selectedActivity){
                    condition.parameters={activity:this.state.selectedActivity.getID()};
                    condition.activity=this.state.selectedActivity
                }
                else {
                    condition.name="error"
                }
                break;
            case"attributeFulfilled":
                if(this.state.selectedProperty){
                    condition.parameters={
                        property:this.state.selectedProperty.id,
                        propertyModule:this.state.selectedProperty.name,
                        compare:this.state.selectedCompare,
                        typeValue:this.state.selectedProperty.typeValue,
                    };
                    condition.property=this.state.selectedProperty;
                }
                else {
                    condition.name="error"
                }
                break;
            case"entityArea":
            case"playerArea":
                condition.area=true;
                break;
            default:
                condition.name="error"
        }

        condition.id=this.state.conditionID;

        this.props.result(condition)
    }

    setupDialog(type,parameters){
        switch (type){
            case"interactionPerformed":
                this.setState({
                    selectedType:type, // a search value to filter the entities
                    selectedTarget:null, //the current selected entity
                    selectedInteraction:null,
                    selectedValues:[],
                })
                break;
            case"taskCompleted":
                this.setState({
                    selectedType:type, // a search value to filter the entities
                    selectedTarget:null, //the current selected entity
                    selectedTask:null,
                    selectedValues:[],
                })
                break;
            case"playerArea":
            case"entityArea":
                this.setState({
                    selectedType:type, // a search value to filter the entities
                    selectedTarget:null, //the current selected entity
                    selectedValues:[],
                })
                break;
            case"activityCompleted":
                this.setState({
                    selectedType:type, // a search value to filter the entities
                    selectedTarget:null, //the current selected entity
                    selectedActivity:null,
                    selectedValues:[],
                })
                break;
            case"attributeFulfilled":
                this.setState({
                    selectedType:type, // a search value to filter the entities
                    selectedTarget:null, //the current selected entity
                    selectedProperty:null,
                    selectedCompare:"equal",
                    selectedValues:[],
                })
                // let entity=this.state.selectedTarget
                // if(entity){
                //     let propertyList=entity.getConditionPropertyList();
                //     let alreadyTakenList=[]
                //     if(this.state.alreadyTakenProperties.length>0){
                //         for(let index=0;index<this.state.alreadyTakenProperties.length;index++){
                //             if(this.state.alreadyTakenProperties[index].id===entity.getID()) {//property is already used
                //                 alreadyTakenList=this.state.alreadyTakenProperties[index].takenProperties;
                //                 break;
                //             }
                //         }
                //     }
                //     for(let index=propertyList.length-1;index>=0;index--){
                //         if(alreadyTakenList.includes(propertyList[index].name)) {//property is already used
                //             propertyList.splice(index,1);
                //         }
                //     }
                //     if(propertyList.length>0){ // user can choose a property
                //         this.setState({
                //             selectedType:type, // a search value to filter the entities
                //             selectedTarget:parameters.entity, //the current selected entity
                //             selectedProperty:propertyList[0].name,
                //             selectedValues:propertyList[0].value,
                //             shownDetails:[{type:propertyList[0].inputType, printName:propertyList[0].printName}]
                //         })
                //     }
                //     else{ // no property can be chosen
                //         this.setState({
                //             selectedType:type, // a search value to filter the entities
                //             selectedTarget:parameters.entity, //the current selected entity
                //             selectedProperty:null,
                //             selectedValues:null,
                //             shownDetails:[]
                //         })
                //     }
                //
                // }
                // else{
                //     this.setState({
                //         selectedType:type, // a search value to filter the entities
                //         selectedTarget:null, //the current selected entity
                //         selectedProperty:null,
                //         selectedValues:[],
                //     })
                // }
                break;
            default:
        }

    }


    openListDialog(event,mode){
        event.preventDefault();
        switch (mode){
            case "entity-grab":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"grab")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let selectableMoveableEntities=[]
                for(let indexEntity=0;indexEntity<this.props.scene.length;indexEntity++){
                    if(this.props.scene[indexEntity].canBeGrabbed())
                        if(!this.state.alreadyTakenAreaEntities.includes(this.props.scene[indexEntity].getID())){
                            selectableMoveableEntities.push({name:this.props.scene[indexEntity].getName(),entity:this.props.scene[indexEntity]})
                        }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:selectableMoveableEntities,
                })
                break;
            case "player":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.player,"player")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let selectablePlayers=[]
                for(let indexEntity=0;indexEntity<this.props.scene.length;indexEntity++){
                    if(this.props.scene[indexEntity] instanceof Camera)
                        if(!this.state.alreadyTakenAreaPlayers.includes(this.props.scene[indexEntity].getID())){
                            selectablePlayers.push({name:this.props.scene[indexEntity].getName(),player:this.props.scene[indexEntity]})
                        }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:selectablePlayers,
                })
                break;
            case "interaction":
                this.listSelectionFunction=(element)=>{this.saveSelectedInteraction(element.entity,element.interaction)}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let selectableInteractions=[]
                for(let indexInteractionEntity=0;indexInteractionEntity<this.props.scene.length;indexInteractionEntity++){
                    let interactionList=this.props.scene[indexInteractionEntity].getInteractions();
                    for(let indexInteraction=0;indexInteraction<interactionList.length;indexInteraction++){
                        if(!this.state.alreadyTakenInteractions.includes(interactionList[indexInteraction].getID())){
                            selectableInteractions.push({name:interactionList[indexInteraction].getName(),entity:this.props.scene[indexInteractionEntity] ,interaction:interactionList[indexInteraction]})
                        }
                    }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:selectableInteractions,
                })
                break;
            case "activity":
                this.listSelectionFunction=(element)=>{this.saveSelectedActivity(element.activity)}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let selectableActivities=[]
                for(let indexTasks=0;indexTasks<this.props.tasks.length;indexTasks++){
                    let activityList=this.props.tasks[indexTasks].getActivities();
                    for(let indexActivity=0;indexActivity<activityList.length;indexActivity++){
                        if(!this.state.alreadyTakenActivities.includes(activityList[indexActivity].getID())){
                            selectableActivities.push({name:activityList[indexActivity].getName(),task:this.props.tasks[indexTasks] ,activity:activityList[indexActivity]})
                        }
                    }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:selectableActivities,
                })
                break;
            case "task":
                this.listSelectionFunction=(element)=>{console.log(element);this.saveSelectedTask(element.task)}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let selectableTasks=[]
                for(let indexTasks=0;indexTasks<this.props.tasks.length;indexTasks++){
                    if(!this.state.alreadyTakenTasks.includes(this.props.tasks[indexTasks].getID())){
                        selectableTasks.push({name:this.props.tasks[indexTasks].getName(),task:this.props.tasks[indexTasks]})
                    }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:selectableTasks,
                })
                break;
            case "entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element,"property")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:this.props.scene,
                })
                break;
            case "entity-property":
                this.listSelectionFunction=(element)=>{this.saveSelectedProperty(element.property)}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)


                if(this.state.selectedTarget) {
                    let selectableProperties=[]
                    let propertyList = this.state.selectedTarget.getConditionPropertyList();
                    for (let index = 0; index < propertyList.length; index++) {
                            if (!this.state.alreadyTakenProperties.includes((""+this.state.selectedTarget.getID()+"-"+propertyList[index].id))) {
                                selectableProperties.push({
                                    name: propertyList[index].printName,
                                    property: propertyList[index]
                                })
                            }
                    }

                    this.setState({
                        showSelectListDialog: true,
                        listSelectionList: selectableProperties,
                    })
                }
                break;
            default:
        }
    }

    changeConditionType(event){
        this.setupDialog(event.target.value);
    }

    valueInputMethod(property, selectionList){
        if (property.inputType === "checkbox") { //if the input type is text, the change will be submitted after losing focus
            return (
                <input
                    type={property.inputType}
                    name={property.name}
                    checked={this.state.selectedValues[0]}
                    onChange={(e) => this.saveSelectedValue(e.target.checked)}/>
            );
        }
        if (property.inputType === "text") { //if the input type is text, the change will be submitted after losing focus
            return (
                <input
                    type={property.inputType}
                    name={property.name}
                    value={this.state.selectedValues[0]}
                    onChange={(e) => this.saveSelectedValue(e.target.value)}
                />
            );
        }
        if (property.inputType === "textarea") { //if the input type is text, the change will be submitted after losing focus
            return (
                <textarea
                    name={property.name}
                    value={this.state.selectedValues[0]}
                    onChange={(e) => this.saveSelectedValue(e.target.value)}
                />
            );
        }
        if (property.inputType === "select") { //if the input type is text, the change will be submitted after losing focus
            let selection=null;

            if(selectionList){
                for (let index=0;index<selectionList.length;index++){
                    if(property.name===selectionList[index].selectionName){
                        selection=selectionList[index].selection;
                    }
                }
            }
            return (
                <select
                    value={this.state.selectedValues[0]}
                    onChange={(e) => this.saveSelectedValue(e.target.value)}>
                    {selection}
                </select>
            );
        }
        if (property.inputType === "span") { //if the input type is text, the change will be submitted after losing focus
            return (
                <span>
                    {this.state.selectedValues[0]}
                </span>
            );
        }
        else { //the change will be submitted on change
            return (
                <input
                    type={property.inputType}
                    name={property.name}
                    value={this.state.selectedValues[0]}
                    step={property.step}
                    min={property.min}
                    max={property.max}
                    onChange={(e) => this.saveSelectedValue(e.target.value)}/>
            );
        }
    }

    render() {
        let childDialog= null;
        if (this.state.showSelectListDialog){
            childDialog=(
                <ListSelectionDialog
                    cancel={()=>this.setState({showSelectListDialog:false})}
                    show={this.state.showSelectListDialog}
                    result={this.listSelectionFunction}
                    list={this.state.listSelectionList}
                />
            )
        }
        let typeDetails=[];
        let disabledButton=true;
        switch (this.state.selectedType){
            case"interactionPerformed":
                let selectedInteractionName= "no interaction"
                if(this.state.selectedInteraction){
                    selectedInteractionName=this.state.selectedInteraction.getName();
                    disabledButton=!this.state.selectedTarget //at this point only the target has to be checked to ensure a correct condition
                }
                typeDetails.push((
                    <div key={"interactionChoose"} className="dialog-panel-content-input-element">
                        <span>
                            Interaction:
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {selectedInteractionName}
                            </span>
                            <button
                                type="button"
                                onClick={(event)=> this.openListDialog(event,"interaction")}>
                                Select Interaction
                            </button>
                        </div>
                    </div>
                ))
                break;
            case"playerArea":
                let selectedPlayerName= "no player"
                if(this.state.selectedTarget){
                    selectedPlayerName=this.state.selectedTarget.getName();
                    disabledButton=!this.state.selectedTarget //at this point only the target has to be checked to ensure a correct condition
                }
                typeDetails.push((
                    <div key={"playerChoose"} className="dialog-panel-content-input-element">
                        <span>
                            Player:
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {selectedPlayerName}
                            </span>
                            <button
                                type="button"
                                onClick={(event)=> this.openListDialog(event,"player")}>
                                Select Player
                            </button>
                        </div>
                    </div>
                ))
                break;
            case"entityArea":
                let selectedAreaEntityName= "no entity"
                if(this.state.selectedTarget){
                    selectedAreaEntityName=this.state.selectedTarget.getName();
                    disabledButton=!this.state.selectedTarget //at this point only the target has to be checked to ensure a correct condition
                }
                typeDetails.push((
                    <div key={"playerChoose"} className="dialog-panel-content-input-element">
                        <span>
                            Entity:
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {selectedAreaEntityName}
                            </span>
                            <button
                                type="button"
                                onClick={(event)=> this.openListDialog(event,"entity-grab")}>
                                Select Entity
                            </button>
                        </div>
                    </div>
                ))
                break;
            case"activityCompleted":
                let selectedActivityName= "no activity"
                if(this.state.selectedActivity){
                    selectedActivityName=this.state.selectedActivity.getName();
                    disabledButton=!this.state.selectedTarget //at this point only the target has to be checked to ensure a correct condition
                }
                typeDetails.push((
                    <div key={"activityChoose"} className="dialog-panel-content-input-element">
                        <span>
                            Activity:
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {selectedActivityName}
                            </span>
                            <button
                                type="button"
                                onClick={(event)=> this.openListDialog(event,"activity")}>
                                Select Activity
                            </button>
                        </div>
                    </div>
                ))
                break;
            case"taskCompleted":
                let selectedTaskName= "no task"
                if(this.state.selectedTask){
                    selectedTaskName=this.state.selectedTask.getName();
                    disabledButton=!this.state.selectedTarget //at this point only the target has to be checked to ensure a correct condition
                }
                typeDetails.push((
                    <div key={"taskChoose"} className="dialog-panel-content-input-element">
                        <span>
                            Task:
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {selectedTaskName}
                            </span>
                            <button
                                type="button"
                                onClick={(event)=> this.openListDialog(event,"task")}>
                                Select Task
                            </button>
                        </div>
                    </div>
                ))
                break;
            case"attributeFulfilled":
                disabledButton=!this.state.selectedTarget|!this.state.selectedProperty //at this point only the target has to be checked to ensure a correct condition
                typeDetails.push((
                    <div key={"EntityChoose"} className="dialog-panel-content-input-element">
                        <span>
                            Entity:
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {this.state.selectedTarget?this.state.selectedTarget.getName():"no entity"}
                            </span>
                            <button
                                type="button"
                                onClick={(event)=> this.openListDialog(event,"entity")}>
                                Select Entity
                            </button>
                        </div>
                    </div>
                ))
                if(this.state.selectedTarget){
                    typeDetails.push((
                        <div key={"PropertyChoose"} className="dialog-panel-content-input-element">
                            <span>
                                Property:
                            </span>
                            <div className="dialog-panel-content-input-element-double">
                                <span>
                                    {this.state.selectedProperty?this.state.selectedProperty.printName:"no property"}
                                </span>
                                <button
                                    type="button"
                                    onClick={(event)=> this.openListDialog(event,"entity-property")}>
                                    Select Property
                                </button>
                            </div>
                        </div>
                    ))
                }
                if(this.state.selectedProperty){
                    let compareOptions=[
                        (<option key="compare1" value="equal"> Equal</option>),
                        (<option key="compare2" value="notequal">Not Equal</option>)
                    ]
                    if(this.state.selectedProperty.comparable) {
                        compareOptions.push((<option key="compare3" value="greater">Greater</option>))
                        compareOptions.push((<option key="compare4" value="greaterequal">Greater Equal</option>))
                        compareOptions.push((<option key="compare5" value="smaller">Smaller</option>))
                        compareOptions.push((<option key="compare6" value="smallerequal">Smaller Equal</option>))
                    }
                    typeDetails.push((
                        <div key={"CompareChoose"} className="dialog-panel-content-input-element">
                        <span>
                            Property:
                        </span>
                            <select
                                value={this.state.selectedCompare}
                                onChange={(e)=>this.saveSelectedCompare(e.target.value)}>
                                {compareOptions}
                            </select>
                        </div>
                    ))

                    typeDetails.push((
                        <div key={"ValueChoose"} className="dialog-panel-content-input-element">
                        <span>
                            Value:
                        </span>
                            {this.valueInputMethod(this.state.selectedProperty,[])}
                        </div>
                    ))
                }
                break;
            default:
        }
        const modeHeadline= this.state.conditionMode;
        return (
            <div>
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.props.show} //this state handles the visibility
                    contentLabel={modeHeadline +" a Condition"}>
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>
                                {modeHeadline.charAt(0).toUpperCase()+modeHeadline.slice(1) + " a Condition"}
                            </h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>
                                {"Select a condition type and " + modeHeadline+ " the condition"}
                            </span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <form onSubmit={(e) => {this.result(e)}}>
                                <div className="dialog-panel-content-input-element">
                                                    <span>
                                                        Type:
                                                    </span>
                                    <select
                                        value={this.state.selectedType}
                                        onChange={(event)=> this.changeConditionType(event)}>
                                        {this.conditionTypesSelectOptions}
                                    </select>
                                </div>
                                <div>
                                    {typeDetails}
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
                                    <button type="button" onClick={() => this.props.cancel()}>Go Back</button>
                                    <button id="upload-media-submit" type="submit" disabled={disabledButton}>Select</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>
                {childDialog}
            </div>

        );
    }
}
