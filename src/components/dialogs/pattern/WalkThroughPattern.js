import React from "react";
import ReactModal from "react-modal";
import "../../../styles/DialogManager.css"
import ListSelectionDialog from "../ListSelectionDialog";
import Camera from "../../../data/Camera";
import Activity from "../../../data/Task/Activity";
import Task from "../../../data/Task/Task";
import TaskBar from "../../../data/Task/TaskBar";
import ConditionInteraction from "../../../data/Interaction/ConditionInteraction";
import Condition from "../../../data/Interaction/Condition";




export default class WalkThroughPattern extends React.Component {
    constructor(props) {
        super(props);
        this.listSelectionFunction=()=>{};
        this.conditionDialogRef=React.createRef(); //reference to inform the conditionDialogRef about the staring values
        this.state = {
            showError:false,
            errorMessage:"",

            showWarning:false,
            warningMessage:"",

            showSelectListDialog:false, //show select dialog
            listSelectionList:[],

            selectedWalkthroughMode:"noOrder", //is the Walkthrough ordered or not
            walkThroughElementList: [], //created Walkthrough

            //task integration
            selectedTaskIntegration:"newTask", //the selcted mode to integrate the task
            taskDescription:"Complete the Walkthrough", // description of the created Task
            selectedTask:null, //selected Task to integrate the Activity

            selectedPatternName:"", //name of the pattern to distinguish the created elements


            shownPage:0, //shown page of the wizard
        };
    }

    resetPattern(){
        this.setState({
            showError:false,
            errorMessage:"",

            showWarning:false,
            warningMessage:"",

            showSelectListDialog:false, //show select dialog
            listSelectionList:[],

            selectedWalkthroughMode:"noOrder", //is the Walkthrough ordered or not
            walkThroughElementList: [], //created Walkthrough

            //task integration
            selectedTaskIntegration:"newTask", //the selcted mode to integrate the task
            taskDescription:"Complete the Walkthrough", // description of the created Task
            selectedTask:null, //selected Task to integrate the Activity

            selectedPatternName:"", //name of the pattern to distinguish the created elements

            shownPage:0, //shown page of the wizard
        })
    }

    configureBeforeOpening(scene,tasks,cameraPos){
        this.resetPattern();
        this.setState({

            }
        )
    }

    openListDialog(event,mode){
        event.preventDefault();
        switch (mode){
            case "entity-list":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"entity-list")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)
                let entityList=[]
                let takenIDs=[]
                for (let index=0; index<this.state.walkThroughElementList.length;index++){
                    if(this.state.walkThroughElementList[index].entity){
                        takenIDs.push(this.state.walkThroughElementList[index].entity.getID())
                    }
                }
                for(let index=0; index<this.props.scene.length;index++){
                    if(!(this.props.scene[index] instanceof Camera)){
                        if(!takenIDs.includes(this.props.scene[index].getID())) {
                            entityList.push({name: this.props.scene[index].getName(), entity: this.props.scene[index]})
                        }
                    }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:entityList,
                })
                break;
            case "task":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.task,"task")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let taskList=[]
                for(let index=0; index<this.props.tasks.length;index++){
                    taskList.push({name:this.props.tasks[index].getName(),task:this.props.tasks[index]})
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:taskList,
                })
                break;
            default:
        }
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

    handleChangedTaskedIntegration(taskMode){
        switch (taskMode){
            case"newTask":
                this.setState({
                    selectedTaskIntegration:taskMode,
                    selectedTask:null,
                })
                break;
            case"integrateTask":
                this.setState({
                    selectedTaskIntegration:taskMode,
                    selectedTask:null,
                })
                break;
            default:
        }
    }

    changeOrderOfEntryBy(entry,changeIndexBy){
        let editedList=this.state.walkThroughElementList.slice()
        let currentPosition=0;
        for(let index=0; index<editedList.length; index++){ // remove the entry
            if (entry){
                if(entry.id===editedList[index].id){
                    editedList.splice(index,1);
                    currentPosition=index;
                    break;
                }
            }
        }
        let newIndex=0;
        if((currentPosition+changeIndexBy)>editedList.length){
            newIndex=editedList.length;
        }
        else {
            if((currentPosition+changeIndexBy)>0){
                newIndex=currentPosition+changeIndexBy;
            }
        }
        editedList.splice(newIndex,0,entry);
        this.setState({
            walkThroughElementList: editedList,
        })
    }

    removeEntry(entry){
        let editedList=this.state.walkThroughElementList.slice()
        for(let index=0; index<editedList.length; index++){
            if (entry){
                if(entry.id===editedList[index].id){
                    editedList.splice(index,1);
                    break;
                }
            }
        }
        this.setState({
            walkThroughElementList: editedList,
        })
    }

    generateDescription(entry){
        if(entry){
            if(entry.description.length>0){
                return entry.description;
            }
            else{
                switch (entry.eventMode){
                    case "lookOn":
                        return "Look on "+ entry.name;
                    case "interact":
                        return "Interact with "+ entry.name;
                    default:
                }
            }
        }
        return "no description"
    }

    handleChangedDescription(description, entry){
        let editedList=this.state.walkThroughElementList.slice()
        for(let index=0; index<editedList.length; index++){
            if (entry){
                if(entry.id===editedList[index].id){
                    editedList[index].description=description
                    break;
                }
            }
        }
        this.setState({
            walkThroughElementList: editedList,
        })
    }

    handleChangedEventMode(mode, entry){
        let editedList=this.state.walkThroughElementList.slice()
        for(let index=0; index<editedList.length; index++){
            if (entry){
                if(entry.id===editedList[index].id){
                    editedList[index].eventMode=mode
                    break;
                }
            }
        }
        this.setState({
            walkThroughElementList: editedList,
        })
    }

    checkTaskSelectionIsOk(){
        switch (this.state.selectedTaskIntegration){
            case"noTask":
                return true;
                break;
            case"newTask":
                return true;
                break;
            case"integrateTask":
                if(this.state.selectedTask){
                    return true;
                }
            default:
        }
        return false;
    }

    saveSelectedEntity(entity,mode){
        switch (mode){
            case "entity-list":
                let entityList=this.state.walkThroughElementList.slice();
                entityList.push({entity:entity, name:entity.getName(), id:entity.getID(), eventMode:"lookOn", description:""})
                this.setState({
                    walkThroughElementList: entityList, //created Walkthrough:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            case "task":
                this.setState({
                    selectedTask:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            default:
                this.setState({ // dont save the entity
                    showSelectListDialog:false,
                    listSelectionList:[],
                })
        }
    }

    savePattern(){
        let result=[];
        if(this.state.walkThroughElementList.length>0) {
            //create interaction to track the Pdf completion
            let walkthrouhList=this.state.walkThroughElementList;
            let activityList=[];
            let previousInteraction=null;
            for(let indexEntry=0; indexEntry<walkthrouhList.length;indexEntry++){
                let conditions=[];
                let nameInteraction="no name found"
                switch(this.state.selectedWalkthroughMode){
                    case "ordered":
                        if(previousInteraction){
                            if(indexEntry>0){
                                conditions.push(new Condition("interactionPerformed",walkthrouhList[indexEntry-1].entity,[],{interaction:previousInteraction.getID()}))

                            }
                        }
                        nameInteraction=" log ordered"
                        break;
                    case "noOrder":
                        nameInteraction=" log unordered"
                        break;
                    default:
                }
                if(walkthrouhList[indexEntry].eventMode){
                    switch(walkthrouhList[indexEntry].eventMode){
                        case "interact":
                            nameInteraction+=" if player interact with "
                            break;
                        case "lookOn":
                            nameInteraction+=" if player has looked on "
                            break;
                        default:
                    }
                }
                let interactionPerform= new ConditionInteraction(this.state.selectedPatternName+" Walkthrough-Pattern "+nameInteraction,walkthrouhList[indexEntry].entity,"mouseenter","add-property",{property:"position"},"add-property_position",[0,0,0],conditions,true)
                result.push({
                    type: "interaction",
                    entity: walkthrouhList[indexEntry].entity,
                    interaction: interactionPerform
                });
                previousInteraction=interactionPerform;
                let activity=new Activity("",this.generateDescription(walkthrouhList[indexEntry]),"entityInteract",{interaction:interactionPerform.getID()})
                activity.setAttribute("name",activity.getID());
                activityList.push(activity)
            }
            switch (this.state.selectedTaskIntegration){
                case"newTask":
                    if(activityList.length>0){
                        let task=new Task("",this.state.taskDescription,activityList)
                        task.setAttribute("name",task.getID());
                        result.push({
                            type: "task",
                            task: task,
                        });
                        let taskBar=new TaskBar();
                        taskBar.setAttribute("name", this.state.selectedPatternName+" Walkthrough-Pattern "+taskBar.getName())
                        taskBar.setAttribute("task", task)
                        taskBar.setAttribute("positionPOV", this.props.cameraPosition)
                        result.push({
                            type: "entity",
                            entity: taskBar,
                        });
                    }
                    break;
                case"integrateTask":
                    if(this.state.selectedTask){
                        for(let index=0; index<activityList.length;index++){
                            result.push({
                                type: "activity",
                                task: this.state.selectedTask,
                                activity:activityList[index]
                            });
                        }
                    }
                    break;
                default:
            }
        }
        console.log("created Interactivity",result)
        this.resetPattern();
        this.props.result(result);
    }
    cancel(){
        this.resetPattern();
        this.props.cancel();
    }

    goBack(){
        this.resetPattern();
        this.props.goback();
    }

    render() {
        let entityList= this.state.walkThroughElementList.map((entry, move)=>{
            return(
                <div key={"entity" + move} className="dialog-panel-walkthrough-list-entry">
                    <span>
                        {entry.name}
                    </span>
                    {/*<select*/}
                    {/*    value={entry.eventMode}*/}
                    {/*    onChange={(event)=> this.handleChangedEventMode(event.target.value,entry)}*/}
                    {/*>*/}
                    {/*    <option value={"lookOn"}>Look on the Entity</option>*/}
                    {/*    <option value={"interact"}>Interact with the Entity</option>*/}
                    {/*</select>*/}
                    <button type="button" onClick={()=>this.removeEntry(entry)}
                    >
                        Remove
                    </button>
                    <button type="button" onClick={()=>this.changeOrderOfEntryBy(entry,-1)}
                    > up
                    </button>
                    <button type="button" onClick={()=>this.changeOrderOfEntryBy(entry,1)}
                    > down
                    </button>
                </div>
            )
        });

        let elementPage=(
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                        <span>
                            Create the Walkthrough
                        </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                    <span>
                        Entities:
                    </span>
                        <button
                            onClick={(e) => this.openListDialog(e,"entity-list")}
                            type="button"
                        >
                            Add Entity
                        </button>
                    </div>
                </div>
                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                        <span>
                            Does the player have to perform the walkthrough in order or not
                        </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                    <span>
                        Order:
                    </span>
                        <select
                            value={this.state.selectedWalkthroughMode}
                            onChange={(event)=> this.setState({selectedWalkthroughMode:event.target.value})}
                        >
                            <option value={"noOrder"}>The player can perform every step at each time</option>
                            <option value={"ordered"}>The player has to perform each step in order </option>
                        </select>
                    </div>
                </div>
                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                        <span>
                            The list of entities contained in the walkthrough
                        </span>
                        <span>
                            This order is the order of the created activities
                        </span>
                        <span>
                            This order can be used to created a ordered walkthrough
                        </span>
                    </div>
                    <div className={(this.state.walkThroughElementList.length>0)? "dialog-panel-activity-list":"dialog-hidden"}>
                        {entityList}
                    </div>
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
                    <button type="button" disabled={false} onClick={()=>this.goBack()}>Go Back</button>
                    <button type="button" onClick={() => this.cancel()}>Cancel</button>
                    <button type="button" disabled={this.state.walkThroughElementList.length<1} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let detailsList= this.state.walkThroughElementList.map((entry, move)=>{
            return(
                <div key={"entity" + move} className="dialog-panel-walkthrough-list-entry-double">
                    <span>
                        {entry.name}
                    </span>
                    <input
                        value={this.generateDescription(entry)}
                        onChange={(event)=> this.handleChangedDescription(event.target.value,entry)}
                    >
                    </input>
                </div>
            )
        });

        let detailsPage=(
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                        <span>
                            The activity description of all entities in the walkthrough
                        </span>
                    </div>
                    <div className={(this.state.walkThroughElementList.length>0)? "dialog-panel-activity-list":"dialog-hidden"}>
                        {detailsList}
                    </div>
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
                    <button type="button" onClick={() => this.cancel()}>Cancel</button>
                    <button type="button" disabled={this.state.walkThroughElementList.length<1} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let taskSelection=[
            (<option key={"taskOption2"} value="newTask">Create a new Task to complete the Pdf</option>),
            (<option key={"taskOption3"} value="integrateTask">Integrate the Activity to complete the Pdf in a Task</option>),
        ]

        let taskConfig=[]
        switch (this.state.selectedTaskIntegration){
            case"newTask":
                taskConfig.push((
                    <div key={"description"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-description">
                        <span>
                            Choose the description of the task that shows the walkthrough to the player
                        </span>
                    </div>
                ));
                taskConfig.push((
                    <div key={"TaskdescriptionSetup"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-element">
                        <span>
                            Task Description:
                        </span>
                        <input
                            type={"text"}
                            name={"task"}
                            value={this.state.taskDescription}
                            onChange={(e) => this.setState({taskDescription:e.target.value})}
                        />
                    </div>
                ));
                break;
            case"integrateTask":
                taskConfig.push((
                    <div key={"description"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-description">
                        <span>
                            Choose the to add the walkthrough to a contained task in the virtual environment
                        </span>
                    </div>
                ));

                taskConfig.push((
                    <div key={"taskChosse"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-element">
                    <span>
                        Task
                    </span>
                        <div className="dialog-panel-content-input-element-double">
                        <span>
                            {this.state.selectedTask?this.state.selectedTask.getName():"no task"}
                        </span>
                            <button
                                onClick={(e) => this.openListDialog(e,"task")}
                                type="button"
                            >
                                Select Task
                            </button>
                        </div>
                    </div>
                ));
                break;
            default:
        }

        let TaskIntegration= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-group">
                    <div className="dialog-panel-content-input-description">
                        <span>
                            Choose if the player has to complete the pdf in the virtual environment as a task
                        </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                        <span>
                            Task Integration:
                        </span>
                        <select
                            value={this.state.selectedTaskIntegration}
                            onChange={(event)=> this.handleChangedTaskedIntegration(event.target.value)}>
                            {taskSelection}
                        </select>
                    </div>
                </div>
                <div className="dialog-panel-content-input-group">
                    {taskConfig}
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
                    <button type="button" onClick={() => this.cancel()}>Cancel</button>
                    <button type="button" disabled={!this.checkTaskSelectionIsOk()} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let NamePattern= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-description">
                    <span>
                        This name is used in all created elements to distinguish them
                    </span>
                </div>
                <div className="dialog-panel-content-input-element">
                    <span>
                        Name:
                    </span>
                    <input
                        value={this.state.selectedPatternName}
                        onChange={(event)=> this.setState({selectedPatternName:event.target.value})}
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
                    <button type="button" onClick={() => this.cancel()}>Cancel</button>
                    <button type="button" disabled={this.state.selectedPatternName.length<1} onClick={()=>this.savePattern()}>Save Interactivity</button>
                </div>
            </form>
        )

        let pageList=[
            elementPage,
            detailsPage,
            TaskIntegration,
            NamePattern,
        ]

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

        return (
            <div>
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.props.show} //this state handles the visibility
                    contentLabel={"Create A Walkthrough"}>
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>
                                {"Create a Walkthrough"}
                            </h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>
                               {"Create a walkthrough through your virtual environment which the player has to perform"}
                            </span>
                        </div>
                        <div className="dialog-Panel-Content">
                            {pageList[this.state.shownPage]}
                        </div>
                    </div>
                </ReactModal>
                {childDialog}
            </div>
        );
    }
}
