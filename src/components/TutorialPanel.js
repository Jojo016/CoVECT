import React from "react";
import '../styles/TutorialPanel.css';

export default class TutorialPanel extends React.Component {
    constructor(props) {
        super(props);
        let tutorialDescription=[]
        tutorialDescription.push({position:"bottom", step:"start" ,description:"Welcome to the tutorial of the VR Editor. This tutorial will introduce the interface and the functions of the editor"})
        tutorialDescription.push({position:"bottom", step:"introduceViewport" ,description:"The highlighted section of the interface shows you the current state of your virtual environment. The tutorial starts with a preset virtual environment which already consists a few entities"})
        tutorialDescription.push({position:"bottom", step:"viewportControl" ,description:"You can change the view of the current state of the virtual environment by using your mouse. \nMove the view: Drag the mouse while pressing the left mouse button. \n Rotate the view: Drag the mouse while pressing the right mouse button\n Zoom: Scroll the mousewheel"})
        tutorialDescription.push({position:"bottom", step:"viewportCamReset" ,description:"You can reset the view by clicking on the highlighted button"})
        tutorialDescription.push({position:"bottom", step:"introduceAddPanel" ,description:"The highlighted section of the interface enables you to add entities into your virtual environment. Your created virtual environment consists of these added entities. "})
        tutorialDescription.push({position:"bottom", step:"addBox" ,description:"Add a box to your virtual environment. The entry to add a box is highlighted"})
        tutorialDescription.push({position:"bottom", step:"introduceScenegraph" ,description:"The highlighted section lists all elements included in your virtual environment.\n The added box is highlighted in the scene list. You can select the box either by clicking on the name of the entity or by double clicking on the object in the current state of the virtual environment.\nThe entry also supplies you with buttons to copy, delete or jump to the entity in the virtual environment"})
        tutorialDescription.push({position:"bottom", step:"moveBox" ,description:"Move the box to the highlighted area in the current state of the virtual environment.\n To move the box, the box has to be selected and the position mode has to be selected. The mode is highlighted\nYou can move the box either by dragging on an arrow in one direction, by dragging the rectangles to move the box in two directions or by dragging the white spot in the middle to move the box in all three directions"})
        tutorialDescription.push({position:"top", step:"introduceDetails" ,description:"The highlighted section shows all properties of the selected entity.\n If it does not show the properties, you have to select the box either by double clicking on it or by clicking on the name in the scene list"})
        tutorialDescription.push({position:"top", step:"changeTexture" ,description:"Apply a texture to the box.\n The area is highlighted which enables you to choose a texture.\n You can either choose the texture Wood in the selection or upload a texture with the 'upload' button. \n The texture might not be shown immediately. Select another entity in the virtual environment and you will see the applied texture on the box"})
        tutorialDescription.push({position:"bottom", step:"addPdf" ,description:"Add a pdf to the virtual environment. The highlighted section enables you to add a pdf. \n You can either choose the pdf VR Demo Tutorial or upload your own pdf by clicking on the + button"})
        tutorialDescription.push({position:"bottom", step:"movePdf" ,description:"Move the pdf to the highlighted area in the virtual environment"})
        tutorialDescription.push({position:"bottom", step:"scalePdf" ,description:"Increase the size of the pdf. This is done by using the scale mode.\nThe scale mode is highlighted.\n This mode is similar to the position mode. To scale the entire entity, you have to use the white boxes at the end of each arrow.\n Use the white box to not destroy the format of the pdf while scaling the pdf."})
        tutorialDescription.push({position:"bottom", step:"introduceInteractionPanel" ,description:"The highlighted section is used to add interactivity to your virtual environment. Till now, you have only created the visual appearance of your virtual environment. Now you will add interactivity which enables the player to interact with the virtual environment. "})
        tutorialDescription.push({position:"bottom", step:"selectSource" ,description:"The first step to create an interaction is to select the source entity. \n The source entity defines the entity on which the player or the environment performs an action.\n You want to create an interaction which shows the next page of the pdf if the player clicks on the box. Therefore, you have to select the box."})
        tutorialDescription.push({position:"bottom", step:"selectEvent" ,description:"Now, you have to select the event of the interaction.\n The event will trigger the created interaction. If this event happens in the virtual environment, the interaction will be performed. \n Since you want to create an interaction which shows the next page of the pdf on a mouse click, you have to select 'mouse click on ...'."})
        tutorialDescription.push({position:"bottom", step:"selectTarget" ,description:"Afterwards, you have to select the target of the interaction.\n The target defines the entity which will be effected by the created interaction.\n Since you want to create an interaction which shows the next page of the pdf on a mouse click, you have to select the pdf."})
        tutorialDescription.push({position:"bottom", step:"selectEffect" ,description:"Finally, you have to select the effect of the interaction.\n The effect describes the transformation of the target entity. \n Since you want to create an interaction which shows the next page of the pdf on a mouse click, you have to select 'next page'."})
        tutorialDescription.push({position:"bottom", step:"saveInteraction" ,description:"To save the configured interaction, you have to click on the highlighted button. If you have not created correctly the interaction, you can not continue. But you can go back to spot the error in your process."})
        tutorialDescription.push({position:"bottom", step:"complexInteraction" ,description:"Complex interactions enable you to create interactions which can only be performed, if a set of specific conditions is fulfilled. To create these interaction, you have to click on the highlighted button. But this will be skipped.\n"})
        tutorialDescription.push({position:"bottom", step:"interactionInfo" ,description:"Your created interaction is shown in the highlighted section. The interaction can be deleted and a complex interaction can be edited."})
        tutorialDescription.push({position:"bottom", step:"interactionPattern" ,description:"A simpler way to create interactivity in your virtual environment is to use a pattern.\n These pattern are configured by clicking on the + button in the highlighted section."})
        tutorialDescription.push({position:"bottom", step:"createTask" ,description:"The purpose of your virtual environment can be defined by tasks the player has to fulfill. \n These tasks are created by the + button in the highlighted area."})
        tutorialDescription.push({position:"bottom", step:"taskConfig" ,description:"First of all, you have to configure the task name and task description.\n The task name and description will be shown to the player in the virtual environment.\n In the tutorial, you will create a simple task which asks the player to go to a specific area."})
        tutorialDescription.push({position:"bottom", step:"activityAdd" ,description:"A Task consists of a set of activities which the player has to fulfill to complete the task. Therefore, you have to add an activity to create a task.\n This is performed by clicking on the 'add an activity' button."})
        tutorialDescription.push({position:"bottom", step:"selectArchetype" ,description:"An activity consists of a name, a description and a type.\n The name and the description will be shown to the player of the virtual environment. \n The type defines the activity which the player has to perform in the environment. Since the player has to go to a specific area, you have to choose the 'Player Go to Area' type."})
        tutorialDescription.push({position:"top", step:"saveActivity" ,description:"Now, you have described completely your activity and you have to save the activity."})
        tutorialDescription.push({position:"top", step:"saveTask" ,description:"The created activity is shown in the activity list and you can edit or remove your created activity.\n Now, you have to save the task.\n If you have made a mistake, you can not continue. You can edit your created task or you can redo the task creation."})
        tutorialDescription.push({position:"bottom", step:"taskInfo" ,description:"The created task is shown in the highlighted section. All contained activities are listed inside the task and the task can be edited by clicking on the edit button"})
        tutorialDescription.push({position:"bottom", step:"moveArea" ,description:"Immeditally after the task creation, all areas of contained activities are spawned in the virtual environment.\n To complete the configuration of the activity, you have to move the area of your created activity to the highlighted area."})
        tutorialDescription.push({position:"bottom", step:"addTaskBar" ,description:"To show the task to the player in the virtual environment, you have to add a task bar.\n The task bar is added by clicking on the highlighted button."})
        tutorialDescription.push({position:"top", step:"selectTaskOnTaskBar" ,description:"Afterwards, you have to select the task in the highlighted section"})
        tutorialDescription.push({position:"bottom", step:"moveTaskBar" ,description:"Move the task bar to a visual spot in the virtual environment"})
        tutorialDescription.push({position:"bottom", step:"createNavigation" ,description:"To limit the navigation capabilities of the player in the virtual environment, a navigation mesh has to be defined.\n This mesh prevents the player from going through objects.\n The navigation mesh will be generated by clicking on the 'generate' button in the highlighted section.\n If your virtual environment contains models, the generation might not work, since the workload is too big. "})
        tutorialDescription.push({position:"bottom", step:"saveWorld" ,description:"You can save the created virtual environment by downloading the file which will pop up, if you click on the highlighted button"})
        tutorialDescription.push({position:"bottom", step:"testWorld" ,description:"You can test your virtual environment by clicking on the highlighted button.\n A tab will pop up which contains your created virtual environment.\n Other player can access your created virtual environment by accessing the link in the tab.\n The created virtual environments can be experienced on PC in 2D and in 3D on a Oculus Quest"})
        tutorialDescription.push({position:"bottom", step:"completeTutorial" ,description:"You have successfully completed the tutorial of the VR Editor"})

        this.state = {
            tutorialData:tutorialDescription,
            shownStep:0,
            tutorialStep:null,
        };
    }

    setupTutorial(){
        let step;
        let position;
        if(this.state.tutorialData){
            if(this.state.tutorialData[0]){
                step=this.state.tutorialData[0].step
                position=this.state.tutorialData[0].position
            }
        }
        this.setState({
            tutorialStep:step,
            shownStep:0,
            panelPosition:position,
        })
        this.props.setTutorialStep(step)
    }

    endTutorial(backToStart){
        let step;
        let position;
        if(this.state.tutorialData){
            if(this.state.tutorialData[0]){
                step=this.state.tutorialData[0].step
                position=this.state.tutorialData[0].position
            }
        }
        this.setState({
            tutorialStep:step,
            shownStep:0,
            panelPosition:position,
        })
        this.props.exitTutorial(backToStart)
    }


    previousTutorialStep(){
        if(this.state.shownStep-1<0){
            return;
        }
        let step =null;
        let position="bottom";
        if(this.state.tutorialData){
            if(this.state.tutorialData[this.state.shownStep-1]){
                step=this.state.tutorialData[this.state.shownStep-1].step
                position=this.state.tutorialData[this.state.shownStep-1].position
            }
        }
        this.setState({
            shownStep:this.state.shownStep-1,
            tutorialStep:step,
            panelPosition:position,
        })
        this.props.setTutorialStep(step)
    }

    nextTutorialStep(){
        if(this.state.shownStep+1>=this.state.tutorialData.length){
            return;
        }
        let step =null;
        let position="bottom";
        if(this.state.tutorialData){
            if(this.state.tutorialData[this.state.shownStep+1]){
                step=this.state.tutorialData[this.state.shownStep+1].step
                position=this.state.tutorialData[this.state.shownStep+1].position
            }
        }
        this.setState({
            shownStep:this.state.shownStep+1,
            tutorialStep:step,
            panelPosition:position,
        })
        this.props.setTutorialStep(step)
    }

    createTextWithNewLine(text){
        return text.split('\n').map((str,move) => {
            return (<span key={"text" + move}>{str}</span>)
        });
    }

    render() {
        if(this.props.showTutorial){
            let positionClass=""
            switch (this.state.panelPosition){
                case "bottom":
                    positionClass=" tutorial-panel-bottom";
                    break;
                case "top":
                    positionClass=" tutorial-panel-top";
                    break;
                default:
            }
            let continueButton=null;
            if((this.state.tutorialData)) {
                if (this.state.shownStep < (this.state.tutorialData.length - 1)) {
                    continueButton = (<button disabled={!this.props.stepIsSolved} type="button"
                                              onClick={() => this.nextTutorialStep()}>Next Step</button>)
                } else {
                    continueButton = (<button  type="button"
                                              onClick={() => this.endTutorial(false)}>Exit Tutorial</button>)
                }
            }
            let prevButton=null;
            if((this.state.tutorialData)) {
                if (this.state.shownStep > 0) {
                    prevButton = (<button type="button" disabled={this.state.shownStep<1} onClick={()=>this.previousTutorialStep()}>Previous Step</button>)
                } else {
                    prevButton = (<button type="button"
                                              onClick={() => this.endTutorial(true)}>Exit Tutorial</button>)
                }
            }
            return (
                <div className={"tutorial-panel" + positionClass}>
                    <div className={"tutorial-panel-content"}>
                        <div className="tutorial-panel-content-button">
                            {prevButton}
                        </div>
                        <div className="tutorial-panel-content-description">
                            {this.createTextWithNewLine(this.state.tutorialData[this.state.shownStep].description)}
                        </div>
                        <div className="tutorial-panel-content-button">
                            {continueButton}
                        </div>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }

    }
}