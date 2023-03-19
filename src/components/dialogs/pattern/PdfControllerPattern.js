import React from "react";
import ReactModal from "react-modal";
import "../../../styles/DialogManager.css"
import Pdf from "../../../data/Media/Pdf";
import ListSelectionDialog from "../ListSelectionDialog";
import Camera from "../../../data/Camera";
import Activity from "../../../data/Task/Activity";
import Task from "../../../data/Task/Task";
import TaskBar from "../../../data/Task/TaskBar";
import ConditionInteraction from "../../../data/Interaction/ConditionInteraction";




export default class PdfControllerPattern extends React.Component {
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

            selectedPdf:null, //selected Pdf
            selectedNextEntity:null,  // selected Entity to show the next page
            selectedResetEntity:null,// selected Entity to reset the pdf
            selectedPrevEntity:null, //selected Entity to show the previous pdf

            //task integration
            selectedTaskIntegration:"noTask", //the selcted mode to integrate the task
            taskDescription:"", // description of the created Task
            activityDescription:"", // description of the created Activity
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

            selectedPdf:null, //selected Pdf
            selectedNextEntity:null,  // selected Entity to show the next page
            selectedResetEntity:null,// selected Entity to reset the pdf
            selectedPrevEntity:null, //selected Entity to show the previous pdf

            //task integration
            selectedTaskIntegration:"noTask", //the selcted mode to integrate the task
            taskDescription:"", // description of the created Task
            activityDescription:"", // description of the created Activity
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
            case "pdf":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.pdf,"pdf")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let pdfList=[]
                for(let index=0; index<this.props.scene.length;index++){
                    if(this.props.scene[index] instanceof Pdf){
                       pdfList.push({name:this.props.scene[index].getName(),pdf:this.props.scene[index]})
                    }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:pdfList,
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
            case "next-entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"next-entity")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let entityList=[];
                for(let index=0; index<this.props.scene.length;index++){
                    if(!(this.props.scene[index] instanceof Camera)){
                        entityList.push({name:this.props.scene[index].getName(),entity:this.props.scene[index]})
                    }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:entityList,
                })
                break;
            case "reset-entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"reset-entity")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let resetEntityList=[{name:"No Entity",entity:null}];
                for(let index=0; index<this.props.scene.length;index++){
                    if(!(this.props.scene[index] instanceof Camera)){
                        if(!(this.props.scene[index].getID()===this.state.selectedNextEntity.getID())){ // prevent that the user picks the same entity to show next page and to reset the pdf
                            if(this.state.selectedPrevEntity){
                                if(!(this.props.scene[index].getID() === this.state.selectedPrevEntity.getID())){ // prevent that the user picks the same entity to show prev page and to reset the pdf
                                    resetEntityList.push({name:this.props.scene[index].getName(),entity:this.props.scene[index]})
                                }
                            }
                            else{
                                resetEntityList.push({name:this.props.scene[index].getName(),entity:this.props.scene[index]})
                            }
                        }
                    }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:resetEntityList,
                })
                break;

            case "prev-entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"prev-entity")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let prevEntityList=[{name:"No Entity",entity:null}];
                for(let index=0; index<this.props.scene.length;index++){
                    if(!(this.props.scene[index] instanceof Camera)){
                        if(!(this.props.scene[index].getID()===this.state.selectedNextEntity.getID())){ // prevent that the user picks the same entity to show next page and to reset the pdf
                            if(this.state.selectedResetEntity){
                                if(!(this.props.scene[index].getID() === this.state.selectedResetEntity.getID())){ // prevent that the user picks the same entity to show prev page and to reset the pdf
                                    prevEntityList.push({name:this.props.scene[index].getName(),entity:this.props.scene[index]})
                                }
                            }
                            else{
                                prevEntityList.push({name:this.props.scene[index].getName(),entity:this.props.scene[index]})
                            }
                        }
                    }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:prevEntityList,
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

    handleChangedTaskedIntegration(taskMode){
        switch (taskMode){
            case"noTask":
                this.setState({
                    selectedTaskIntegration:taskMode,
                })
                break;
            case"newTask":
                this.setState({
                    selectedTaskIntegration:taskMode,
                    taskDescription:"Complete all Activities",
                    activityDescription:"Complete the Pdf",
                    selectedTask:null,
                })
                break;
            case"integrateTask":
                this.setState({
                    selectedTaskIntegration:taskMode,
                    taskDescription:"",
                    activityDescription:"Complete the Pdf",
                    selectedTask:null,
                })
                break;
            default:
        }
    }

    saveSelectedEntity(entity,mode){
        switch (mode){
            case "next-entity":
                this.setState({
                    selectedNextEntity:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            case "reset-entity":
                this.setState({
                    selectedResetEntity:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            case "prev-entity":
                this.setState({
                    selectedPrevEntity:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            case "pdf":
                this.setState({
                    selectedPdf:entity,

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
        if(this.state.selectedPdf) {
            let effects = this.state.selectedPdf.getEffects();
            let nextEffect=null;
            let resetEffect=null;
            let prevEffect=null;
            for(let index = 0; index < effects.length; index++){
                if(effects[index].id==="pdf-next-page"){
                    nextEffect=effects[index]
                }
                if(effects[index].id==="pdf-set-page"){
                    resetEffect=effects[index]
                }
                if(effects[index].id==="pdf-prev-page"){
                    prevEffect=effects[index]
                }
            }
            if(this.state.selectedPrevEntity){
                if(prevEffect){
                    let interactionPrevPageMouse = new ConditionInteraction(this.state.selectedPatternName+" Pdf-Controller-Pattern show previous Page by Mouse Click on", this.state.selectedPdf, "click",prevEffect.module,prevEffect.options,prevEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedPrevEntity,
                        interaction: interactionPrevPageMouse
                    });
                    let interactionPrevPageController = new ConditionInteraction(this.state.selectedPatternName+" Pdf-Controller-Pattern show previous Page by Controller Trigger on", this.state.selectedPdf, "triggerdown",prevEffect.module,prevEffect.options,prevEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedPrevEntity,
                        interaction: interactionPrevPageController
                    });
                }
            }
            if(this.state.selectedResetEntity) {
                if (resetEffect) {
                    let interactionResetPageMouse = new ConditionInteraction(this.state.selectedPatternName+" Pdf-Controller-Pattern show first Page by Mouse Click on", this.state.selectedPdf, "click", resetEffect.module, resetEffect.options, resetEffect.id, [1],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedResetEntity,
                        interaction: interactionResetPageMouse
                    });
                    let interactionResetPageController = new ConditionInteraction(this.state.selectedPatternName+" Pdf-Controller-Pattern show first Page by Controller Trigger on", this.state.selectedPdf, "triggerdown", resetEffect.module, resetEffect.options, resetEffect.id, [1],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedResetEntity,
                        interaction: interactionResetPageController
                    });
                }
            }
            if(this.state.selectedNextEntity){
                if(nextEffect){
                    let interactionNextPageMouse = new ConditionInteraction(this.state.selectedPatternName+" Pdf-Controller-Pattern show next Page by Mouse Click on", this.state.selectedPdf, "click",nextEffect.module,nextEffect.options,nextEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedNextEntity,
                        interaction: interactionNextPageMouse
                    });
                    let interactionNextPageController = new ConditionInteraction(this.state.selectedPatternName+" Pdf-Controller-Pattern show next Page by Controller Trigger on", this.state.selectedPdf, "triggerdown",nextEffect.module,nextEffect.options,nextEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedNextEntity,
                        interaction: interactionNextPageController
                    });
                }
            }
            //create interaction to track the Pdf completion
            let pdfHasEnded=null;
            let activity=null
            if(this.state.selectedTaskIntegration==="newTask"||this.state.selectedTaskIntegration==="integrateTask"){
                pdfHasEnded= new ConditionInteraction(this.state.selectedPatternName+" Pdf-Controller-Pattern log Pdf has ended on",this.state.selectedPdf,"pdfEnded","add-property",{property:"position"},"add-property_position",[0,0,0],[],true)
                result.push({
                    type: "interaction",
                    entity: this.state.selectedPdf,
                    interaction: pdfHasEnded
                });
                activity=new Activity("",this.state.activityDescription,"entityInteract",{interaction:pdfHasEnded.getID()})
                activity.setAttribute("name",activity.getID());
            }
            switch (this.state.selectedTaskIntegration){
                case"newTask":
                    if(pdfHasEnded&&activity){
                        let task=new Task("",this.state.taskDescription,[activity])
                        task.setAttribute("name",task.getID());
                        result.push({
                            type: "task",
                            task: task,
                        });
                        let taskBar=new TaskBar();
                        taskBar.setAttribute("name", this.state.selectedPatternName+" Pdf-Controller-Pattern "+taskBar.getName())
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
                        if(pdfHasEnded&&activity){
                            result.push({
                                type: "activity",
                                task: this.state.selectedTask,
                                activity:activity
                            });
                        }
                    }
                    break;
                case"noTask":
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
        let controllerPage= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-group">
                <div  className="dialog-panel-content-input-description">
                        <span>
                            Choose the pdf to enable the player to control the shown pages
                        </span>
                </div>
                <div className="dialog-panel-content-input-element">
                    <span>
                        Pdf
                    </span>
                    <div className="dialog-panel-content-input-element-double">
                        <span>
                            {this.state.selectedPdf?this.state.selectedPdf.getName():"no pdf"}
                        </span>
                        <button
                            onClick={(e) => this.openListDialog(e,"pdf")}
                            type="button"
                        >
                            Select Pdf
                        </button>
                    </div>
                </div>
                </div>
                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the entity which enables the player to open the next page of the pdf by either using the mouse or controller
                            </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                        <span>
                            Entity
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {this.state.selectedNextEntity?this.state.selectedNextEntity.getName():"no entity"}
                            </span>
                            <button
                                onClick={(e) => this.openListDialog(e,"next-entity")}
                                type="button"
                            >
                                Select Entity
                            </button>
                        </div>
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
                    <button type="button" disabled={(!this.state.selectedPdf)||(!this.state.selectedNextEntity)} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let optionalController= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the entity which enables the player to jump to the first page of the pdf by either using the mouse or controller
                            </span>
                            <span>
                                This is optional.
                            </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                        <span>
                            Reset Entity
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {this.state.selectedResetEntity?this.state.selectedResetEntity.getName():"no entity"}
                            </span>
                            <button
                                onClick={(e) => this.openListDialog(e,"reset-entity")}
                                type="button"
                            >
                                Select Reset Entity
                            </button>
                        </div>
                    </div>
                </div>
                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the entity which enables the player to open the previous page of the pdf by either using the mouse or controller
                            </span>
                            <span>
                                This is optional.
                            </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                        <span>
                            Previous Entity
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {this.state.selectedPrevEntity?this.state.selectedPrevEntity.getName():"no entity"}
                            </span>
                            <button
                                onClick={(e) => this.openListDialog(e,"prev-entity")}
                                type="button"
                            >
                                Select Previous Entity
                            </button>
                        </div>
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
                    <button type="button" disabled={false} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let taskSelection=[
            (<option key={"taskOption1"} value="noTask">Do not create a Task to complete the Pdf</option>),
            (<option key={"taskOption2"} value="newTask">Create a new Task to complete the Pdf</option>),
            (<option key={"taskOption3"} value="integrateTask">Integrate the Activity to complete the Pdf in a Task</option>),
        ]

        let taskConfig=[]
        switch (this.state.selectedTaskIntegration){
            case"noTask":
                taskConfig.push((
                    <div key={"description"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-description">
                        <span>
                            The player does not have to complete the pdf in the virtual environment
                        </span>
                    </div>
                ));
                break;
            case"newTask":
                taskConfig.push((
                    <div key={"description"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-description">
                        <span>
                            Choose the description of the task and the description of the activity to complete the pdf which will be added to the virtual environment
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
                taskConfig.push((
                    <div key={"ActivitydescriptionSetup"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-element">
                        <span>
                            Activity Description:
                        </span>
                        <input
                            type={"text"}
                            name={"activity"}
                            value={this.state.activityDescription}
                            onChange={(e) => this.setState({activityDescription:e.target.value})}
                        />
                    </div>
                ));
                break;
            case"integrateTask":
                taskConfig.push((
                    <div key={"description"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-description">
                        <span>
                            Choose the contained task in the virtual environment and the description of the activity to complete the pdf
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

                if(this.state.selectedTask){
                    taskConfig.push((
                        <div key={"ActivitydescriptionSetup"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-element">
                        <span>
                            Activity Description:
                        </span>
                            <input
                                type={"text"}
                                name={"activity"}
                                value={this.state.activityDescription}
                                onChange={(e) => this.setState({activityDescription:e.target.value})}
                            />
                        </div>
                    ));
                }
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
            controllerPage,
            optionalController,
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
                    contentLabel={"Create A Pdf Controller"}>
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>
                                {"Create a Pdf Controller"}
                            </h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>
                               {"Create an interactivity to control a pdf in the virtual environment"}
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
