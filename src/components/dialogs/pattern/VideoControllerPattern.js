import React from "react";
import ReactModal from "react-modal";
import "../../../styles/DialogManager.css"
import ListSelectionDialog from "../ListSelectionDialog";
import Camera from "../../../data/Camera";
import Activity from "../../../data/Task/Activity";
import Task from "../../../data/Task/Task";
import TaskBar from "../../../data/Task/TaskBar";
import ConditionInteraction from "../../../data/Interaction/ConditionInteraction";
import Video from "../../../data/Media/Video";




export default class VideoControllerPattern extends React.Component {
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

            selectedVideo:null, //selected video

            selectedPlayMode:"split", // mode to controll the video
            selectedPlayPauseEntity:null, //selected Entity to toggle the video
            selectedPlayEntity:null,  // selected Entity to play the video
            selectedPauseEntity:null, //selected Entity to pause the video

            selectedResetEntity:null,// selected Entity to reset the video time
            selectedSkipTime:10, // amount of skipped seconds
            selectedSkipEntity:null, // entity to skip seconds
            selectedGoBackTime:10, // amount of reverted seconds
            selectedGoBackEntity:null, // entity to go back seconds

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

            selectedPlayMode:"split", // mode to controll the video
            selectedPlayPauseEntity:null, //selected Entity to toggle the video
            selectedPlayEntity:null,  // selected Entity to play the video
            selectedPauseEntity:null, //selected Entity to pause the video

            selectedResetEntity:null,// selected Entity to reset the video time
            selectedSkipTime:10, // amount of skipped seconds
            selectedSkipEntity:null, // entity to skip seconds
            selectedGoBackTime:10, // amount of reverted seconds
            selectedGoBackEntity:null, // entity to go back seconds

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

    createEntityList(currentEntity){
        let entityList=[];
        for(let index=0; index<this.props.scene.length;index++){
            let addToList=true;
            if((this.props.scene[index] instanceof Camera)){
                addToList=false;
            }
            if(this.state.selectedPlayEntity){
                if(this.props.scene[index].getID() === this.state.selectedPlayEntity.getID()){ // prevent that the user picks an already used entity
                    addToList=false;
                }
            }
            if(this.state.selectedPauseEntity){
                if(this.props.scene[index].getID() === this.state.selectedPauseEntity.getID()){ // prevent that the user picks an already used entity
                    addToList=false;
                }
            }
            if(this.state.selectedPlayPauseEntity){
                if(this.props.scene[index].getID() === this.state.selectedPlayPauseEntity.getID()){ // prevent that the user picks an already used entity
                    addToList=false;
                }
            }
            if(this.state.selectedResetEntity){
                if(this.props.scene[index].getID() === this.state.selectedResetEntity.getID()){ // prevent that the user picks an already used entity
                    addToList=false;
                }
            }
            if(this.state.selectedSkipEntity){
                if(this.props.scene[index].getID() === this.state.selectedSkipEntity.getID()){ // prevent that the user picks an already used entity
                    addToList=false;
                }
            }
            if(this.state.selectedGoBackEntity){
                if(this.props.scene[index].getID() === this.state.selectedGoBackEntity.getID()){ // prevent that the user picks an already used entity
                    addToList=false;
                }
            }
            if(currentEntity){ // add the current selected Entity
                if(this.props.scene[index].getID() === currentEntity.getID()){
                    addToList=true;
                }
            }
            if(addToList){
                entityList.push({name:this.props.scene[index].getName(),entity:this.props.scene[index]})
            }
        }
        return entityList;
    }

    openListDialog(event,mode){
        event.preventDefault();
        switch (mode){
            case "video":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.video,"video")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let videoList=[]
                for(let index=0; index<this.props.scene.length;index++){
                    if(this.props.scene[index] instanceof Video){
                        videoList.push({name:this.props.scene[index].getName(),video:this.props.scene[index]})
                    }
                }

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:videoList,
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
            case "play-entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"play-entity")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)
                let entityList=this.createEntityList(this.state.selectedPlayEntity)

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:entityList,
                })
                break;
            case "play-pause-entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"play-pause-entity")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)


                let entityPlayPauseList=this.createEntityList(this.state.selectedPlayPauseEntity)

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:entityPlayPauseList,
                })
                break;
            case "reset-entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"reset-entity")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let resetEntityListElements=this.createEntityList(this.state.selectedResetEntity)
                let resetEntityList=[{name:"No Entity",entity:null}].concat(resetEntityListElements);

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:resetEntityList,
                })
                break;

            case "skip-entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"skip-entity")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let skipEntityListElements=this.createEntityList(this.state.selectedSkipEntity)
                let skipEntityList=[{name:"No Entity",entity:null}].concat(skipEntityListElements);

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:skipEntityList,
                })
                break;
            case "go-back-entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"go-back-entity")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)

                let goBackEntityListElements=this.createEntityList(this.state.selectedGoBackEntity)
                let goBackEntityList=[{name:"No Entity",entity:null}].concat(goBackEntityListElements);

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:goBackEntityList,
                })
                break;
            case "pause-entity":
                this.listSelectionFunction=(element)=>{this.saveSelectedEntity(element.entity,"pause-entity")}
                this.listSelectionFunction=this.listSelectionFunction.bind(this)


                let pauseEntityListElements=this.createEntityList(this.state.selectedPauseEntity)
                let pauseEntityList=[{name:"No Entity",entity:null}].concat(pauseEntityListElements);

                this.setState({
                    showSelectListDialog:true,
                    listSelectionList:pauseEntityList,
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
            case"noTask":
                this.setState({
                    selectedTaskIntegration:taskMode,
                })
                break;
            case"newTask":
                this.setState({
                    selectedTaskIntegration:taskMode,
                    taskDescription:"Complete all Activities",
                    activityDescription:"Complete the Video",
                    selectedTask:null,
                })
                break;
            case"integrateTask":
                this.setState({
                    selectedTaskIntegration:taskMode,
                    taskDescription:"",
                    activityDescription:"Complete the Video",
                    selectedTask:null,
                })
                break;
            default:
        }
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

    checkPlayModeConfigured(){
        switch (this.state.selectedPlayMode){
            case"split":
                if(this.state.selectedPlayEntity){
                    return true;
                }
                break;
            case"toggle":
                if(this.state.selectedPlayPauseEntity){
                    return true;
                }
                break;
            default:
        }
        return false;
    }

    handleChangedPlayMode(mode){
        switch (mode){
            case"split":
                this.setState({
                    selectedPlayMode:mode,
                    selectedPlayEntity:this.state.selectedPlayPauseEntity,
                    selectedPauseEntity:null,
                    selectedPlayPauseEntity:null,
                })
                break;
            case"toggle":
                this.setState({
                    selectedPlayMode:mode,
                    selectedPlayPauseEntity:this.state.selectedPlayEntity,
                    selectedPlayEntity:null,
                    selectedPauseEntity:null
                })
                break;
            default:
        }
    }

    saveSelectedEntity(entity,mode){
        switch (mode){
            case "play-entity":
                this.setState({
                    selectedPlayEntity:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            case "play-pause-entity":
                this.setState({
                    selectedPlayPauseEntity:entity,

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
            case "skip-entity":
                this.setState({
                    selectedSkipEntity:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            case "go-back-entity":
                this.setState({
                    selectedGoBackEntity:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            case "pause-entity":
                this.setState({
                    selectedPauseEntity:entity,

                    showSelectListDialog:false,
                    listSelectionList:[],
                })
                break;
            case "video":
                this.setState({
                    selectedVideo:entity,

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
        if(this.state.selectedVideo) {
            let effects = this.state.selectedVideo.getEffects();
            let playEffect=null;
            let setEffect=null;
            let pauseEffect=null;
            let playPauseEffect=null;
            let skipEffect=null;
            for(let index = 0; index < effects.length; index++){
                if(effects[index].id==="video-play"){
                    playEffect=effects[index]
                }
                if(effects[index].id==="video-play-pause"){
                    playPauseEffect=effects[index]
                }
                if(effects[index].id==="video-set-to-second"){
                    setEffect=effects[index]
                }
                if(effects[index].id==="video-skip-seconds"){
                    skipEffect=effects[index]
                }
                if(effects[index].id==="video-pause"){
                    pauseEffect=effects[index]
                }
            }
            if(this.state.selectedPauseEntity){
                if(pauseEffect){
                    let interactionPauseMouse = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern pause Video by Mouse Click on", this.state.selectedVideo, "click",pauseEffect.module,pauseEffect.options,pauseEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedPauseEntity,
                        interaction: interactionPauseMouse
                    });
                    let interactionPauseController = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern pause Video by Controller Trigger on", this.state.selectedVideo, "triggerdown",pauseEffect.module,pauseEffect.options,pauseEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedPauseEntity,
                        interaction: interactionPauseController
                    });
                }
            }
            if(this.state.selectedResetEntity) {
                if (setEffect) {
                    let interactionSetTimeMouse = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern reset Video by Mouse Click on", this.state.selectedVideo, "click", setEffect.module, setEffect.options, setEffect.id, [0],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedResetEntity,
                        interaction: interactionSetTimeMouse
                    });
                    let interactionSetTimeController = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern reset Video by Controller Trigger on", this.state.selectedVideo, "triggerdown", setEffect.module, setEffect.options, setEffect.id, [0],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedResetEntity,
                        interaction: interactionSetTimeController
                    });
                }
            }

            if(this.state.selectedSkipEntity) {
                if (skipEffect) {
                    let skipTimeMouse = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern reset Video by Mouse Click on", this.state.selectedVideo, "click", skipEffect.module, skipEffect.options, skipEffect.id, [this.state.selectedSkipTime],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedSkipEntity,
                        interaction: skipTimeMouse
                    });
                    let skipTimeController = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern reset Video by Controller Trigger on", this.state.selectedVideo, "triggerdown", skipEffect.module, skipEffect.options, skipEffect.id, [this.state.selectedSkipTime],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedSkipEntity,
                        interaction: skipTimeController
                    });
                }
            }

            if(this.state.selectedGoBackEntity) {
                if (skipEffect) {
                    let goBackTimeMouse = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern reset Video by Mouse Click on", this.state.selectedVideo, "click", skipEffect.module, skipEffect.options, skipEffect.id, [(-1)*this.state.selectedGoBackTime],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedGoBackEntity,
                        interaction: goBackTimeMouse
                    });
                    let goBackTimeController = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern reset Video by Controller Trigger on", this.state.selectedVideo, "triggerdown", skipEffect.module, skipEffect.options, skipEffect.id, [(-1)*this.state.selectedGoBackTime],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedGoBackEntity,
                        interaction: goBackTimeController
                    });
                }
            }

            if(this.state.selectedPlayEntity){
                if(playEffect){
                    let interactionPlayMouse = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern play Video by Mouse Click on", this.state.selectedVideo, "click",playEffect.module,playEffect.options,playEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedPlayEntity,
                        interaction: interactionPlayMouse
                    });
                    let interactionPlayController = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern play Video by Controller Trigger on", this.state.selectedVideo, "triggerdown",playEffect.module,playEffect.options,playEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedPlayEntity,
                        interaction: interactionPlayController
                    });
                }
            }
            if(this.state.selectedPlayPauseEntity){
                if(playPauseEffect){
                    let interactionPlayPauseMouse = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern to toggle Video by Mouse Click on", this.state.selectedVideo, "click",playPauseEffect.module,playPauseEffect.options,playPauseEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedPlayPauseEntity,
                        interaction: interactionPlayPauseMouse
                    });
                    let interactionPlayPauseController = new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern to toggle Video by Controller Trigger on", this.state.selectedVideo, "triggerdown",playPauseEffect.module,playPauseEffect.options,playPauseEffect.id,[],[],true);
                    result.push({
                        type: "interaction",
                        entity: this.state.selectedPlayPauseEntity,
                        interaction: interactionPlayPauseController
                    });
                }
            }
            //create interaction to track the Video completion
            let videoHasEnded=null;
            let activity=null
            if(this.state.selectedTaskIntegration==="newTask"||this.state.selectedTaskIntegration==="integrateTask"){
                videoHasEnded= new ConditionInteraction(this.state.selectedPatternName+" Video-Controller-Pattern log Video has ended on",this.state.selectedVideo,"videoEnded","add-property",{property:"position"},"add-property_position",[0,0,0],[],true)
                result.push({
                    type: "interaction",
                    entity: this.state.selectedVideo,
                    interaction: videoHasEnded
                });
                activity=new Activity("",this.state.activityDescription,"entityInteract",{interaction:videoHasEnded.getID()})
                activity.setAttribute("name",activity.getID());
            }
            switch (this.state.selectedTaskIntegration){
                case"newTask":
                    if(videoHasEnded&&activity){
                        let task=new Task("",this.state.taskDescription,[activity])
                        task.setAttribute("name",task.getID());
                        result.push({
                            type: "task",
                            task: task,
                        });
                        let taskBar=new TaskBar();
                        taskBar.setAttribute("name", this.state.selectedPatternName+" Video-Controller-Pattern "+taskBar.getName())
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
                        if(videoHasEnded&&activity){
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
        let videoPage= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                        <span>
                            Choose the video to enable the player to control the video
                        </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                    <span>
                        Video
                    </span>
                        <div className="dialog-panel-content-input-element-double">
                        <span>
                            {this.state.selectedVideo?this.state.selectedVideo.getName():"no video"}
                        </span>
                            <button
                                onClick={(e) => this.openListDialog(e,"video")}
                                type="button"
                            >
                                Select Video
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
                    <button type="button" disabled={(!this.state.selectedVideo)} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let playSelection=[
            (<option key={"playOption1"} value="split">Two different Entities play and pause the Video</option>),
            (<option key={"playOption2"} value="toggle">One Entity plays and pauses the Video</option>),
            ]

        let controllerConfig=[]
        switch (this.state.selectedPlayMode){
            case"toggle":
                controllerConfig.push((
                    <div key={"playpauseentitiyconfig"} className="dialog-panel-content-input-group">
                        <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the entity which enables the player to play or pause the video by either using the mouse or controller
                            </span>
                        </div>
                        <div className="dialog-panel-content-input-element">
                        <span>
                            Entity
                        </span>
                            <div className="dialog-panel-content-input-element-double">
                            <span>
                                {this.state.selectedPlayPauseEntity?this.state.selectedPlayPauseEntity.getName():"no entity"}
                            </span>
                                <button
                                    onClick={(e) => this.openListDialog(e,"play-pause-entity")}
                                    type="button"
                                >
                                    Select Entity
                                </button>
                            </div>
                        </div>
                    </div>
                ));
                break;
            case"split":
                controllerConfig.push((
                    <div key={"playentityconfig"} className="dialog-panel-content-input-group">
                        <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the entity which enables the player to play the video by either using the mouse or controller
                            </span>
                        </div>
                        <div className="dialog-panel-content-input-element">
                        <span>
                            Entity
                        </span>
                            <div className="dialog-panel-content-input-element-double">
                            <span>
                                {this.state.selectedPlayEntity?this.state.selectedPlayEntity.getName():"no entity"}
                            </span>
                                <button
                                    onClick={(e) => this.openListDialog(e,"play-entity")}
                                    type="button"
                                >
                                    Select Entity
                                </button>
                            </div>
                        </div>
                    </div>
                ));
                controllerConfig.push((
                    <div key={"configpauseEntity"} className="dialog-panel-content-input-group">
                        <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the entity which enables the player to pause the video by either using the mouse or controller
                            </span>
                            <span>
                                This is optional.
                            </span>
                        </div>
                        <div className="dialog-panel-content-input-element">
                        <span>
                            Pause Entity
                        </span>
                            <div className="dialog-panel-content-input-element-double">
                            <span>
                                {this.state.selectedPauseEntity?this.state.selectedPauseEntity.getName():"no entity"}
                            </span>
                                <button
                                    onClick={(e) => this.openListDialog(e,"pause-entity")}
                                    type="button"
                                >
                                    Select Pause Entity
                                </button>
                            </div>
                        </div>
                    </div>
                ));
                break;
            default:
        }

        let PlayModePage= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-group">
                    <div className="dialog-panel-content-input-description">
                        <span>
                            Choose if the player controls the video with two entities or one entity
                        </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                        <span>
                            Mode:
                        </span>
                        <select
                            value={this.state.selectedPlayMode}
                            onChange={(event)=> this.handleChangedPlayMode(event.target.value)}>
                            {playSelection}
                        </select>
                    </div>
                </div>
                {controllerConfig}
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
                    <button type="button" disabled={!this.checkPlayModeConfigured()} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let optionalController= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the entity which enables the player to skip seconds in the video by either using the mouse or controller
                            </span>
                        <span>
                                This is optional.
                            </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                        <span>
                            Seconds
                        </span>
                        <input
                            type={"number"}
                            step={"1"}
                            value={this.state.selectedSkipTime}
                            onChange={(e) => this.setState({selectedSkipTime:e.target.value})}
                        />
                    </div>
                    <div className="dialog-panel-content-input-element">
                        <span>
                            Skip Entity
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {this.state.selectedSkipEntity?this.state.selectedSkipEntity.getName():"no entity"}
                            </span>
                            <button
                                onClick={(e) => this.openListDialog(e,"skip-entity")}
                                type="button"
                            >
                                Select Skip Entity
                            </button>
                        </div>
                    </div>
                </div>

                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the entity which enables the player to go back seconds in the video by either using the mouse or controller
                            </span>
                        <span>
                                This is optional.
                            </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                        <span>
                            Seconds
                        </span>
                        <input
                            type={"number"}
                            step={"1"}
                            value={this.state.selectedGoBackTime}
                            onChange={(e) => this.setState({selectedGoBackTime:e.target.value})}
                        />
                    </div>
                    <div className="dialog-panel-content-input-element">
                        <span>
                            Go Back Entity
                        </span>
                        <div className="dialog-panel-content-input-element-double">
                            <span>
                                {this.state.selectedGoBackEntity?this.state.selectedGoBackEntity.getName():"no entity"}
                            </span>
                            <button
                                onClick={(e) => this.openListDialog(e,"go-back-entity")}
                                type="button"
                            >
                                Select Go Back Entity
                            </button>
                        </div>
                    </div>
                </div>

                <div className="dialog-panel-content-input-group">
                    <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the entity which enables the player to reset the time of the video by either using the mouse or controller
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
            (<option key={"taskOption1"} value="noTask">Do not create a Task to complete the Video</option>),
            (<option key={"taskOption2"} value="newTask">Create a new Task to complete the Video</option>),
            (<option key={"taskOption3"} value="integrateTask">Integrate the Activity to complete the Video in a Task</option>),
        ]

        let taskConfig=[]
        switch (this.state.selectedTaskIntegration){
            case"noTask":
                taskConfig.push((
                    <div key={"description"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-description">
                        <span>
                            The player does not have to complete the video in the virtual environment
                        </span>
                    </div>
                ));
                break;
            case"newTask":
                taskConfig.push((
                    <div key={"description"+this.state.selectedTaskIntegration} className="dialog-panel-content-input-description">
                        <span>
                            Choose the description of the task and the description of the activity to complete the video which will be added to the virtual environment
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
                            Choose the contained task in the virtual environment and the description of the activity to complete the video
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
                            Choose if the player has to complete the video in the virtual environment as a task
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
            videoPage,
            PlayModePage,
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
                    contentLabel={"Create A Video Controller"}>
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>
                                {"Create a Video Controller"}
                            </h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>
                               {"Create an interactivity to control a video in the virtual environment"}
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
