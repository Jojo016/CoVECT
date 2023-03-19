import React from "react";
import "../styles/Scenegraph.css";

//assets
import bin from "../assets/navigation/bin.png"
import copy from "../assets/navigation/copy.png"
import openedTab from "../assets/navigation/tab-opened.png"
import closedTab from "../assets/navigation/tab-closed.png"
import goto from "../assets/navigation/goto.png"
import edit from "../assets/navigation/edit.png"
import binSmall from "../assets/navigation/binSmall.png"
import copySmall from "../assets/navigation/copySmall.png"
import gotoSmall from "../assets/navigation/gotoSmall.png"
import editSmall from "../assets/navigation/editSmall.png"
import Tetrahedron from "../data/Geometry/Tetrahedron";
import Geometry from "../data/Geometry/Geometry";
import ButtonElement from "../data/Interaction/ButtonElement";
import CounterElement from "../data/Interaction/CounterElement";
import PressurePlate from "../data/Interaction/PressurePlate";
import PointLight from "../data/Light/PointLight";
import SpotLight from "../data/Light/SpotLight";
import Image from "../data/Media/Image";
import Video from "../data/Media/Video";
import Pdf from "../data/Media/Pdf";
import Model from "../data/Model/Model";
import ObjModel from "../data/Model/ObjModel";
import TaskBar from "../data/Task/TaskBar";
import Text from "../data/Text";
import Sphere from "../data/Geometry/Sphere";
import Box from "../data/Geometry/Box";
import Plane from "../data/Geometry/Plane";
import Cylinder from "../data/Geometry/Cylinder";
import ConditionInteraction from "../data/Interaction/ConditionInteraction";
import Interaction from "../data/Interaction/Interaction";
import Activity from "../data/Task/Activity";
import Condition from "../data/Interaction/Condition";
import Entity from "../data/Entity";
import Task from "../data/Task/Task";

export default class Scenegraph extends React.Component {
    constructor(props) {
        super(props);
        this.renderInteractionEntry=this.renderInteractionEntry.bind(this);

        this.state = {
            sceneListOpened:true,
            geometryListOpened:true,
            boxListOpened:true,
            sphereListOpened:true,
            planeListOpened:true,
            tetrahedronListOpened:true,
            cylinderListOpened:true,
            modelListOpened:true,
            textListOpened:true,
            mediaListOpened:true,
            imageListOpened:true,
            videoListOpened:true,
            pdfListOpened:true,
            lightListOpened:true,
            spotlightListOpened:true,
            pointlightListOpened:true,
            interactionElementListOpened:true,
            buttonListOpened:true,
            counterListOpened:true,
            pressureplateListOpened:true,
            tasksEntityListOpened:true,
            taskListOpened:true,
            openedTabsSceneList:[false],
            openedTabsTaskList:[],

            isSimple:true,
        };
    }

    entityWasAddedToSceneGraph(){
        let openedTabsList=this.state.openedTabsSceneList.slice();
        this.setState({
            openedTabsSceneList:openedTabsList.concat([true]),
        })
    }

    taskWasAddedToSceneGraph(){
        let openedTabsList=this.state.openedTabsTaskList.slice();
        this.setState({
            openedTabsTaskList:openedTabsList.concat([true]),
        })
    }

    interactionWasAddedToSceneGraph(indexOfEntity){
        let openedTabsList=this.state.openedTabsSceneList.slice();
        openedTabsList[indexOfEntity]=true;
        this.setState({
            openedTabsSceneList:openedTabsList,
        })
    }

    activityWasAddedToSceneGraph(indexOfTask){
        let openedTabsList=this.state.openedTabsTaskList.slice();
        openedTabsList[indexOfTask]=true;
        this.setState({
            openedTabsTaskList:openedTabsList,
        })
    }

    entityAtIndexIsDeleted(index){
        let openedTabsList=this.state.openedTabsSceneList.slice();
        openedTabsList.splice(index, 1);
        this.setState({
            openedTabsSceneList:openedTabsList,
        })
    }

    taskAtIndexIsDeleted(index){
        let openedTabsList=this.state.openedTabsTaskList.slice();
        openedTabsList.splice(index, 1);
        this.setState({
            openedTabsTaskList:openedTabsList,
        })
    }

    ToggleSceneTabButton(index){
        let openedTabsList=this.state.openedTabsSceneList.slice();
        openedTabsList[index]=!openedTabsList[index];
        this.setState({
            openedTabsSceneList:openedTabsList,
        })
    }

    ToggleTaskTabButton(index){
        let openedTabsList=this.state.openedTabsTaskList.slice();
        openedTabsList[index]=!openedTabsList[index];
        this.setState({
            openedTabsTaskList:openedTabsList,
        })
    }

    renderScenegraphCategory(entryList,opened,category,printName,elementList){
        return (
            <div className={(entryList.length>0?"scene-element-nested":"scenegraph-hidden") + this.highlightIfContainedTopCategory(elementList)}>
                <div className="scene-element-headline">
                    <button type="button"
                            className="scenegraph-headline-button"
                            onClick={() => this.toggleOpened(category)}>
                        <img src={opened? openedTab:closedTab} alt=""/>
                        {printName}
                    </button>
                </div>
                <div className={opened? "scenegraph-category-list":"scenegraph-hidden"}>
                    {entryList}
                </div>
            </div>
        );
    }

    toggleOpened(category){
        switch (category){
            case "button":
                this.setState({buttonListOpened:!this.state.buttonListOpened});
                break;
            case "counter":
                this.setState({counterListOpened:!this.state.counterListOpened});
                break;
            case "pressureplate":
                this.setState({pressureplateListOpened:!this.state.pressureplateListOpened});
                break;
            case "box":
                this.setState({boxListOpened:!this.state.boxListOpened});
                break;
            case "cylinder":
                this.setState({cylinderListOpened:!this.state.cylinderListOpened});
                break;
            case "plane":
                this.setState({planeListOpened:!this.state.planeListOpened});
                break;
            case "sphere":
                this.setState({sphereListOpened:!this.state.sphereListOpened});
                break;
            case "tetrahedron":
                this.setState({tetrahedronListOpened:!this.state.tetrahedronListOpened});
                break;
            case "image":
                this.setState({imageListOpened:!this.state.imageListOpened});
                break;
            case "pdf":
                this.setState({pdfListOpened:!this.state.pdfListOpened});
                break;
            case "video":
                this.setState({videoListOpened:!this.state.videoListOpened});
                break;
            case "pointlight":
                this.setState({pointlightListOpened:!this.state.pointlightListOpened});
                break;
            case "spotlight":
                this.setState({spotlightListOpened:!this.state.spotlightListOpened});
                break;
        }
    }

    renderInteractionEntry(interaction,move,entity){
        const interactionIsSelected= interaction===this.props.selected
        const editKeyclass= interaction instanceof ConditionInteraction?"scenegraph-symbolkey":"scenegraph-invisible";
        let areaList=[];
        if(interaction instanceof ConditionInteraction){
            let conditionList=interaction.getConditions();
            for (let indexCondition=0; indexCondition<conditionList.length;indexCondition++){
                if(conditionList[indexCondition].hasArea()){
                    areaList.push(conditionList[indexCondition]);
                }
            }
        }

        let highlightInteraction=false
        let highlightInteractionRemove=false
        let highlightInteractionEdit=false
        if(this.props.highlightTutorialElement) {
            if (interaction.getID() === this.props.highlightTutorialElement.getID()) {
                switch (this.props.highlightTutorialElementMode) {
                    case "all":
                        highlightInteraction = true;
                        break;
                    case "remove":
                        highlightInteractionRemove = true;
                        break;
                    case "edit":
                        highlightInteractionEdit = true;
                        break;
                    default:
                }
            }
        }

        if(areaList.length>0){ // contains conditions with areas
            const ConditionWithAreaList= areaList.map((condition, moveCond)=>{
                const conditionIsSelected= condition===this.props.selected
                let highlightCondition=false
                let highlightConditionGoto=false
                if(this.props.highlightTutorialElement) {
                    if (condition.getID() === this.props.highlightTutorialElement.getID()) {
                        switch (this.props.highlightTutorialElementMode) {
                            case "all":
                                highlightCondition = true;
                                break;
                            case "goto":
                                highlightConditionGoto = true;
                                break;
                            default:
                        }
                    }
                }
                return (
                    <div key={"Area"+moveCond} className={"scene-element-nested-element" + (conditionIsSelected?" scene-element-selected":"") + (highlightCondition?" scenegraph-tutorial-highlight-element":"")}>
                        <button type="button"
                                className={"scenegraph-symbolkey" + (highlightConditionGoto?" scenegraph-tutorial-highlight-element":"")}
                                onClick={() => this.props.onClickGoTo(condition)}>
                            <img src={gotoSmall} alt=""/>
                        </button>
                        <button type="button" className="scenegraph-elementinfo"
                                onClick={() => this.props.onClickSceneElement(condition)}>
                            {condition.getName()}
                        </button>
                    </div>
                );
            })

            if(this.props.highlightTutorialElement){
                if(!highlightInteraction){ //mark if contains condtition
                    if((this.props.highlightTutorialElement instanceof Condition)){
                        let conditions = interaction.getConditions()
                        for(let index=0; index<conditions.length;index++){
                            if(conditions[index].getID()===this.props.highlightTutorialElement.getID()){
                                highlightInteraction=true
                                break;
                            }
                        }
                    }
                }
            }

            return (
                <div key={move} className={"scene-element-nested" + (highlightInteraction?" scenegraph-tutorial-highlight-element":"")}>
                    <div  className={"scene-element-nested-element" + (interactionIsSelected?" scene-element-selected":"")}>
                        <button type="button" className={"scenegraph-symbolkey"+ (highlightInteractionRemove?" scenegraph-tutorial-highlight-element":"")}
                                onClick={() => this.props.onClickRemoveInteraction(interaction,entity)}>
                            <img src={binSmall} alt=""/>
                        </button>
                        <button type="button" className={editKeyclass + (highlightInteractionEdit?" scenegraph-tutorial-highlight-element":"")}
                                onClick={() => this.props.onEditInteraction(interaction,entity)}>
                            <img src={editSmall} alt=""/>
                        </button>
                        <button type="button" className="scenegraph-elementinfo"
                                onClick={() => this.props.onClickSceneElement(interaction)}>
                            {interaction.getName()}
                        </button>
                    </div>
                    <div className={"scenegraph-entity-association-list"}>
                        {ConditionWithAreaList}
                    </div>
                </div>
            );
        }
        else {
            return (
                <div key={move} className={"scene-element-nested-element" + (interactionIsSelected?" scene-element-selected":"") + (highlightInteraction?" scenegraph-tutorial-highlight-element":"")}>
                    <button type="button" className={"scenegraph-symbolkey" + (highlightInteractionRemove?" scenegraph-tutorial-highlight-element":"")}
                            onClick={() => this.props.onClickRemoveInteraction(interaction,entity)}>
                        <img src={binSmall} alt=""/>
                    </button>
                    <button type="button" className={editKeyclass + (highlightInteractionEdit?" scenegraph-tutorial-highlight-element":"")}
                            onClick={() => this.props.onEditInteraction(interaction,entity)}>
                        <img src={editSmall} alt=""/>
                    </button>
                    <button type="button" className="scenegraph-elementinfo"
                            onClick={() => this.props.onClickSceneElement(interaction)}>
                        {interaction.getName()}
                    </button>
                </div>
            );
        }
    }

    highlightIfContained(list){
        if(this.props.highlightTutorialElement){
            if(list){
                for (let index=0; index<list.length;index++){
                    if(list[index].getID()===this.props.highlightTutorialElement.getID()){
                        return " scenegraph-tutorial-highlight-element"
                    }
                }
            }
        }
        return "";
    }

    highlightIfContainedTopCategory(list){
        if(this.props.showHighlightTutorial) {
            if (this.props.highlightTutorialElement) {
                if (list) {
                    if (this.props.highlightTutorialElement instanceof Interaction) {
                        for (let indexEntity = 0; indexEntity < list.length; indexEntity++) {
                            if(!(list[indexEntity] instanceof Entity)){
                                return "";
                            }
                            let interactionList = list[indexEntity].getInteractions();
                            for (let index = 0; index < interactionList.length; index++) {
                                if (interactionList[index].getID() === this.props.highlightTutorialElement.getID()) {
                                    return " scenegraph-tutorial-highlight-element"
                                }
                            }
                        }
                    } else {
                        if (this.props.highlightTutorialElement instanceof Activity) {
                            for (let indexTask = 0; indexTask < list.length; indexTask++) {
                                if(!(list[indexTask] instanceof Task)){
                                    return "";
                                }
                                let activityList = list[indexTask].getActivities();
                                for (let index = 0; index < activityList.length; index++) {
                                    if (activityList[index].getID() === this.props.highlightTutorialElement.getID()) {
                                        return " scenegraph-tutorial-highlight-element"
                                    }
                                }
                            }
                        } else {
                            if (this.props.highlightTutorialElement instanceof Condition) {
                                for (let indexEntity = 0; indexEntity < list.length; indexEntity++) {
                                    if(!(list[indexEntity] instanceof Entity)){
                                        return "";
                                    }
                                    let interactionList = list[indexEntity].getInteractions();
                                    for (let indexInteraction = 0; indexInteraction < interactionList.length; indexInteraction++) {
                                        if(interactionList[indexInteraction] instanceof ConditionInteraction){
                                            let conditions = interactionList[indexInteraction].getConditions()
                                            for (let index = 0; index < conditions.length; index++) {
                                                if (conditions[index].getID() === this.props.highlightTutorialElement.getID()) {
                                                    return " scenegraph-tutorial-highlight-element"
                                                }
                                            }
                                        }
                                    }
                                }
                            } else {
                                for (let index = 0; index < list.length; index++) {
                                    if (list[index].getID() === this.props.highlightTutorialElement.getID()) {
                                        return " scenegraph-tutorial-highlight-element"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return "";
    }

    render() {
        const taskList=this.props.taskList.map((task, move) => {
            const taskIsSelected= task===this.props.selected;
            const removeKeyclass= task.canBeDeletedFromScene()?"scenegraph-symbolkey":"scenegraph-invisible";
            const copyKeyclass= task.canBeCopiedInScene()?"scenegraph-symbolkey":"scenegraph-invisible";
            const tabButton= this.state.openedTabsTaskList[move]? openedTab:closedTab;
            const activityListLenght=this.props.taskList[move].getActivities().length
            const activityList= this.props.taskList[move].getActivities().map((activity, move)=>{
                const activityIsSelected= activity===this.props.selected
                const removeKeyActivityclass= activity.canBeDeletedFromScene()&&activityListLenght>1?"scenegraph-symbolkey":"scenegraph-invisible";
                const copyKeyActivityclass= activity.canBeCopiedInScene()?"scenegraph-symbolkey":"scenegraph-invisible";
                let highlightActivity=false;
                let highlightActivityRemove=false;
                let highlightActivityCopy=false;
                let highlightActivityGoto=false;
                if(this.props.showHighlightTutorial) {
                    if (this.props.highlightTutorialElement) {
                        if (activity.getID() === this.props.highlightTutorialElement.getID()) {
                            switch (this.props.highlightTutorialElementMode) {
                                case "all":
                                    highlightActivity = true;
                                    break;
                                case "remove":
                                    highlightActivityRemove = true;
                                    break;
                                case "copy":
                                    highlightActivityCopy = true;
                                    break;
                                case "goto":
                                    highlightActivityGoto = true;
                                    break;
                                default:
                            }
                        }
                    }
                }

                return (
                    <div key={move} className={"scene-element-nested-element" + (activityIsSelected?" scene-element-selected":"") + (highlightActivity?" scenegraph-tutorial-highlight-element":"")}>
                        <button type="button" className={removeKeyActivityclass + (highlightActivityRemove?" scenegraph-tutorial-highlight-element":"")}
                           onClick={() => this.props.onClickRemoveActivity(activity,task)}>
                            <img src={binSmall} alt=""/>
                        </button>
                        <button type="button"
                           className={copyKeyActivityclass + (highlightActivityCopy?" scenegraph-tutorial-highlight-element":"")}
                           onClick={() => this.props.onClickCopyActivity(activity,task)}>
                            <img src={copySmall} alt=""/>
                        </button>
                        <button type="button"
                           className={"scenegraph-symbolkey" + (highlightActivityGoto?" scenegraph-tutorial-highlight-element":"")}
                           onClick={() => this.props.onClickGoTo(activity)}>
                            <img src={gotoSmall} alt=""/>
                        </button>
                        <button type="button" className="scenegraph-elementinfo"
                           onClick={() => this.props.onClickSceneElement(activity)}>
                            {activity.getName()}
                        </button>
                    </div>
                );
            });


            let highlightTask=false;
            let highlightTaskRemove=false;
            let highlightTaskCopy=false;
            let highlightTaskEdit=false;
            if(this.props.showHighlightTutorial) {
                if (this.props.highlightTutorialElement) {
                    if (task.getID() === this.props.highlightTutorialElement.getID()) {
                        switch (this.props.highlightTutorialElementMode) {
                            case "all":
                                highlightTask = true;
                                break;
                            case "remove":
                                highlightTaskRemove = true;
                                break;
                            case "copy":
                                highlightTaskCopy = true;
                                break;
                            case "edit":
                                highlightTaskEdit = true;
                                break;
                            default:
                        }
                    } else {
                        if ((this.props.highlightTutorialElement instanceof Activity)) {
                            let activities = task.getActivities()
                            for (let index = 0; index < activities.length; index++) {
                                if (activities[index].getID() === this.props.highlightTutorialElement.getID()) {
                                    highlightTask = true
                                    break;
                                }
                            }
                        }
                    }
                }
            }

            return (
                <div className={"scene-element-nested" + (highlightTask?" scenegraph-tutorial-highlight-element":"")} key={move}>
                    <div className={"scene-element-nested-element"+ (taskIsSelected?" scene-element-selected":"")}>
                        <button type="button"
                           className={"scenegraph-tabkey"}
                           onClick={() => this.ToggleTaskTabButton(move)}>
                            <img src={tabButton} alt=""/>
                        </button>
                        <button type="button"
                           className={removeKeyclass + (highlightTaskRemove?" scenegraph-tutorial-highlight-element":"")}
                           onClick={() => this.props.onClickRemoveTask(task)}>
                            <img src={binSmall} alt=""/>
                        </button>
                        <button type="button"
                           className={copyKeyclass + (highlightTaskCopy?" scenegraph-tutorial-highlight-element":"")}
                           onClick={() => this.props.onClickCopyTask(task)}>
                            <img src={copySmall} alt=""/>
                        </button>
                        <button type="button"
                           className={"scenegraph-symbolkey" + (highlightTaskEdit?" scenegraph-tutorial-highlight-element":"")}
                           onClick={() => this.props.onEditTask(task)}>
                            <img src={editSmall} alt=""/>
                        </button>
                        <button type="button" className={"scenegraph-elementinfo"+ (taskIsSelected?" scene-element-selected":"")}
                           onClick={() => this.props.onClickSceneElement(task)}>
                            {task.getName()}
                        </button>
                    </div>
                    <div className={this.state.openedTabsTaskList[move]? "scenegraph-entity-association-list":"scenegraph-hidden"}>
                        {activityList}
                    </div>
                </div>
            );
        });

        let scenelist ={geometries:[],media:[],lights:[],interactionELement:[],boxes:[],planes:[],spheres:[],cylinders:[],tetrahedrons:[],images:[],videos:[],pdfs:[],models:[],texts:[],spotlights:[],pointlights:[],buttons:[],pressureplates:[], counters:[], tasksEntity:[],global:[]};
        let scenelistElement ={geometries:[],media:[],lights:[],interactionELement:[],boxes:[],planes:[],spheres:[],cylinders:[],tetrahedrons:[],images:[],videos:[],pdfs:[],models:[],texts:[],spotlights:[],pointlights:[],buttons:[],pressureplates:[], counters:[], tasksEntity:[],global:[]};
        for( let index=0; index<this.props.scene.length;index++){
            const entity =this.props.scene[index];
            const entityIsSelected= entity===this.props.selected;
            const removeKeyclass= entity.canBeDeletedFromScene()?"scenegraph-symbolkey":"scenegraph-invisible";
            const copyKeyclass= entity.canBeCopiedInScene()?"scenegraph-symbolkey":"scenegraph-invisible";
            const tabButton= this.state.openedTabsSceneList[index]? openedTab:closedTab;
            const tabButtonClass=entity.hasInteractions()? "scenegraph-tabkey" :"scenegraph-tabkey scenegraph-invisible"
            const sceneElementClass=entity.hasInteractions()? "scene-element-nested" :"scene-element"

            const interactionList= this.props.scene[index].getInteractions().map((interaction, move)=>this.renderInteractionEntry(interaction,move,entity));
            let category= scenelist.global;
            if (this.state.isSimple) {
                switch (entity.constructor) { //simple
                    case Box:
                    case Sphere:
                    case Plane:
                    case Tetrahedron:
                    case Cylinder:
                        scenelistElement.geometries.push(entity);
                        category = scenelist.geometries;
                        break;
                    case ButtonElement:
                    case CounterElement:
                    case PressurePlate:
                        scenelistElement.interactionELement.push(entity);
                        category = scenelist.interactionELement;
                        break;
                    case PointLight:
                    case SpotLight:
                        scenelistElement.lights.push(entity);
                        category = scenelist.lights;
                        break;
                    case Image:
                    case Video:
                    case Pdf:
                        scenelistElement.media.push(entity);
                        category = scenelist.media;
                        break;
                    case Text:
                        scenelistElement.texts.push(entity);
                        category = scenelist.texts;
                        break;
                    case Model:
                    case ObjModel:
                        scenelistElement.models.push(entity);
                        category = scenelist.models;
                        break;
                    case TaskBar:
                        scenelistElement.tasksEntity.push(entity);
                        category = scenelist.tasksEntity;
                        break;
                    default:
                        scenelistElement.global.push(entity);
                        category = scenelist.global;
                }
            }
            else {
                switch (entity.constructor) { //complex
                    case Box:
                        scenelistElement.boxes.push(entity);
                        scenelistElement.geometries.push(entity);
                        category = scenelist.boxes;
                        break;
                    case Sphere:
                        scenelistElement.spheres.push(entity);
                        scenelistElement.geometries.push(entity);
                        category = scenelist.spheres;
                        break;
                    case Plane:
                        scenelistElement.planes.push(entity);
                        scenelistElement.geometries.push(entity);
                        category = scenelist.planes;

                        break;
                    case Tetrahedron:
                        scenelistElement.tetrahedrons.push(entity);
                        scenelistElement.geometries.push(entity);
                        category = scenelist.tetrahedrons;

                        break;
                    case Cylinder:
                        scenelistElement.cylinders.push(entity);
                        scenelistElement.geometries.push(entity);
                        category = scenelist.cylinders;
                        break;
                    case ButtonElement:
                        scenelistElement.buttons.push(entity);
                        scenelistElement.interactionELement.push(entity);
                        category = scenelist.buttons;
                        break;
                    case CounterElement:
                        scenelistElement.counters.push(entity);
                        scenelistElement.interactionELement.push(entity);
                        category = scenelist.counters;
                        break;
                    case PressurePlate:
                        scenelistElement.pressureplates.push(entity);
                        scenelistElement.interactionELement.push(entity);
                        category = scenelist.pressureplates;
                        break;
                    case PointLight:
                        scenelistElement.pointlights.push(entity);
                        scenelistElement.lights.push(entity);
                        category = scenelist.pointlights;
                        break;
                    case SpotLight:
                        scenelistElement.spotlights.push(entity);
                        scenelistElement.lights.push(entity);
                        category = scenelist.spotlights;
                        break;
                    case Image:
                        scenelistElement.images.push(entity);
                        scenelistElement.media.push(entity);
                        category = scenelist.images;
                        break;
                    case Video:
                        scenelistElement.videos.push(entity);
                        scenelistElement.media.push(entity);
                        category = scenelist.videos;
                        break;
                    case Pdf:
                        scenelistElement.pdfs.push(entity);
                        scenelistElement.media.push(entity);
                        category = scenelist.pdfs;
                        break;
                    case Text:
                        scenelistElement.texts.push(entity);
                        category = scenelist.texts;
                        break;
                    case Model:
                    case ObjModel:
                        scenelistElement.models.push(entity);
                        category = scenelist.models;
                        break;
                    case TaskBar:
                        scenelistElement.tasksEntity.push(entity);
                        category = scenelist.tasksEntity;
                        break;
                    default:
                        scenelistElement.global.push(entity);
                        category = scenelist.global;
                }
            }
            let highlightEntity=false;
            let highlightRemove=false;
            let highlightCopy=false;
            let highlightGoto=false;
            if(this.props.showHighlightTutorial) {
                if (this.props.highlightTutorialElement) {
                    if (entity.getID() === this.props.highlightTutorialElement.getID()) {
                        switch (this.props.highlightTutorialElementMode) {
                            case "all":
                                highlightEntity = true;
                                break;
                            case "remove":
                                highlightRemove = true;
                                break;
                            case "copy":
                                highlightCopy = true;
                                break;
                            case "goto":
                                highlightGoto = true;
                                break;
                            default:
                        }
                    } else {
                        if ((this.props.highlightTutorialElement instanceof Interaction) || (this.props.highlightTutorialElement instanceof Condition)) {
                            let interactions = entity.getInteractions()
                            let breakAll = false;
                            for (let index = 0; index < interactions.length; index++) {
                                if (interactions[index].getID() === this.props.highlightTutorialElement.getID()) {
                                    highlightEntity = true
                                    break;
                                }
                                if ((interactions[index] instanceof ConditionInteraction) && (this.props.highlightTutorialElement instanceof Condition)) {
                                    let conditions = interactions[index].getConditions()
                                    for (let indexCond = 0; indexCond < conditions.length; indexCond++) {
                                        if (conditions[indexCond].getID() === this.props.highlightTutorialElement.getID()) {
                                            highlightEntity = true
                                            breakAll = true;
                                            break;
                                        }
                                    }
                                }
                                if (breakAll) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            category.push((
                <div className={sceneElementClass + (highlightEntity?" scenegraph-tutorial-highlight-element":"")} key={index}>
                    <div className={"scene-element-nested-element" + (entityIsSelected?" scene-element-selected":"")}>
                        <button type="button"
                                className={tabButtonClass}
                                onClick={() => this.ToggleSceneTabButton(index)}>
                            <img src={tabButton} alt=""/>
                        </button>
                        <button type="button"
                                className={removeKeyclass + (highlightRemove?" scenegraph-tutorial-highlight-element":"")}
                                onClick={() => this.props.onClickRemoveEntity(entity)}>
                            <img src={binSmall} alt=""/>
                        </button>
                        <button type="button"
                                className={copyKeyclass + (highlightCopy?" scenegraph-tutorial-highlight-element":"")}
                                onClick={() => this.props.onClickCopyEntity(entity)}>
                            <img src={copySmall} alt=""/>
                        </button>
                        <button type="button"
                                className={"scenegraph-symbolkey" + (highlightGoto?" scenegraph-tutorial-highlight-element":"")}
                                onClick={() => this.props.onClickGoTo(entity)}>
                            <img src={gotoSmall} alt=""/>
                        </button>
                        <button type="button" className={"scenegraph-elementinfo"+ (entityIsSelected?" scene-element-selected":"")}
                                onClick={() => this.props.onClickSceneElement(entity)}>
                            {entity.getName()}
                        </button>
                    </div>
                    <div className={(this.state.openedTabsSceneList[index] & (entity.getInteractions().length>0))? "scenegraph-entity-association-list":"scenegraph-hidden"}>
                        {interactionList}
                    </div>
                </div>
            ));
        }


        const tabButtonTask= this.state.taskListOpened? openedTab:closedTab;
        const taskListContentClass= this.state.taskListOpened? "scenegraph-category-list":"scenegraph-hidden";
        const detailedHighlighted= (this.props.highlightTutorialElementMode==="detailed"&&this.props.showHighlightTutorial)? " scenegraph-tutorial-highlight-element" :"";
        return (
            <div className={"scenegraph"+ (this.props.showHighlightTutorial?" scenegraph-tutorial-highlight":"")}>
                <div className={"scenegraph-gui-button" + detailedHighlighted}>
                    <button className={this.state.isSimple?"scenegraph-mode-selected":""} onClick={()=>this.setState({isSimple:true})}>Normal</button>
                    <button className={this.state.isSimple?"":"scenegraph-mode-selected"} onClick={()=>this.setState({isSimple:false})}>Detailed</button>
                </div>
                <div className={"scenegraph-list"}>
                    <div className={"scene-element-nested"+this.highlightIfContainedTopCategory(this.props.scene)}>
                        <div className="scene-element-headline">
                            <button type="button"
                               className="scenegraph-headline-button"
                               onClick={() => this.setState({sceneListOpened:!this.state.sceneListOpened})}>
                                <img src={this.state.sceneListOpened? openedTab:closedTab} alt=""/>
                                Scene
                            </button>
                        </div>
                        <div className={this.state.sceneListOpened? "scenegraph-category-list":"scenegraph-hidden"}>
                            <div className={"scenegraph-category-list"}>
                                {scenelist.global}
                            </div>
                            <div className={((scenelist.boxes.length+scenelist.cylinders.length+scenelist.planes.length+scenelist.spheres.length+scenelist.tetrahedrons.length)>0||scenelist.geometries.length>0?"scene-element-nested":"scenegraph-hidden") + this.highlightIfContainedTopCategory(scenelistElement.geometries)}>
                                <div className="scene-element-headline">
                                    <button type="button"
                                            className="scenegraph-headline-button"
                                            onClick={() => this.setState({geometryListOpened:!this.state.geometryListOpened})}>
                                        <img src={this.state.geometryListOpened? openedTab:closedTab} alt=""/>
                                        Geometries
                                    </button>
                                </div>
                                <div className={this.state.geometryListOpened? "scenegraph-category-list":"scenegraph-hidden"}>
                                    {this.state.isSimple?scenelist.geometries: [
                                        this.renderScenegraphCategory(scenelist.boxes,this.state.boxListOpened,"box","Boxes",scenelistElement.boxes),
                                        this.renderScenegraphCategory(scenelist.cylinders,this.state.cylinderListOpened,"cylinder","Cylinders",scenelistElement.cylinders),
                                        this.renderScenegraphCategory(scenelist.planes,this.state.planeListOpened,"plane","Planes",scenelistElement.planes),
                                        this.renderScenegraphCategory(scenelist.spheres,this.state.sphereListOpened,"sphere","Spheres",scenelistElement.spheres),
                                        this.renderScenegraphCategory(scenelist.tetrahedrons,this.state.tetrahedronListOpened,"tetrahedron","Tetrahedron",scenelistElement.tetrahedrons),
                                    ]}
                                </div>
                            </div>

                            <div className={((scenelist.buttons.length+scenelist.counters.length+scenelist.pressureplates.length)>0||scenelist.interactionELement.length>0?"scene-element-nested":"scenegraph-hidden")+ this.highlightIfContainedTopCategory(scenelistElement.interactionELement)}>
                                <div className="scene-element-headline">
                                    <button type="button"
                                            className="scenegraph-headline-button"
                                            onClick={() => this.setState({interactionElementListOpened:!this.state.interactionElementListOpened})}>
                                        <img src={this.state.interactionElementListOpened? openedTab:closedTab} alt=""/>
                                        Interaction Element
                                    </button>
                                </div>
                                <div className={this.state.interactionElementListOpened? "scenegraph-category-list":"scenegraph-hidden"}>
                                    {this.state.isSimple?scenelist.interactionELement:[
                                        this.renderScenegraphCategory(scenelist.buttons,this.state.buttonListOpened,"button","Buttons",scenelistElement.buttons),
                                        this.renderScenegraphCategory(scenelist.counters,this.state.counterListOpened,"counter","Counters",scenelistElement.counters),
                                        this.renderScenegraphCategory(scenelist.pressureplates,this.state.pressureplateListOpened,"pressureplate","Pressure Plates",scenelistElement.pressureplates)
                                    ]}
                                </div>
                            </div>

                            <div className={((scenelist.pointlights.length+scenelist.spotlights.length)>0||scenelist.lights.length>0?"scene-element-nested":"scenegraph-hidden")+ this.highlightIfContainedTopCategory(scenelistElement.lights)}>
                                <div className="scene-element-headline">
                                    <button type="button"
                                            className="scenegraph-headline-button"
                                            onClick={() => this.setState({lightListOpened:!this.state.lightListOpened})}>
                                        <img src={this.state.lightListOpened? openedTab:closedTab} alt=""/>
                                        Lights
                                    </button>
                                </div>
                                <div className={this.state.lightListOpened? "scenegraph-category-list":"scenegraph-hidden"}>
                                    {this.state.isSimple?scenelist.lights:[
                                        this.renderScenegraphCategory(scenelist.pointlights,this.state.pointlightListOpened,"pointlight","Point Lights",scenelistElement.pointlights),
                                        this.renderScenegraphCategory(scenelist.spotlights,this.state.spotlightListOpened,"spotlight","Spotlights",scenelistElement.spotlights),
                                    ]}
                                </div>
                            </div>

                            <div className={((scenelist.images.length+scenelist.pdfs.length+scenelist.videos.length)>0||scenelist.media.length>0?"scene-element-nested":"scenegraph-hidden")+ this.highlightIfContainedTopCategory(scenelistElement.media)}>
                                <div className="scene-element-headline">
                                    <button type="button"
                                            className="scenegraph-headline-button"
                                            onClick={() => this.setState({mediaListOpened:!this.state.mediaListOpened})}>
                                        <img src={this.state.mediaListOpened? openedTab:closedTab} alt=""/>
                                        Media
                                    </button>
                                </div>
                                <div className={this.state.mediaListOpened? "scenegraph-category-list":"scenegraph-hidden"}>
                                    {this.state.isSimple? scenelist.media:[
                                        this.renderScenegraphCategory(scenelist.images,this.state.imageListOpened,"image","Images",scenelistElement.images),
                                        this.renderScenegraphCategory(scenelist.pdfs,this.state.pdfListOpened,"pdf","Pdfs",scenelistElement.pdfs),
                                        this.renderScenegraphCategory(scenelist.videos,this.state.videoListOpened,"video","Videos",scenelistElement.videos),
                                    ]}
                                </div>
                            </div>

                            <div className={(scenelist.models.length>0?"scene-element-nested":"scenegraph-hidden") + this.highlightIfContainedTopCategory(scenelistElement.models)}>
                                <div className="scene-element-headline">
                                    <button type="button"
                                            className="scenegraph-headline-button"
                                            onClick={() => this.setState({modelListOpened:!this.state.modelListOpened})}>
                                        <img src={this.state.modelListOpened? openedTab:closedTab} alt=""/>
                                        {/*</button>*/}
                                        {/*<button type="button" className="scenegraph-elementinfo"*/}
                                        {/*   onClick={() => {}}>*/}
                                        Models
                                    </button>
                                </div>
                                <div className={this.state.modelListOpened? "scenegraph-category-list":"scenegraph-hidden"}>
                                    {scenelist.models}
                                </div>
                            </div>

                            <div className={(scenelist.tasksEntity.length>0?"scene-element-nested":"scenegraph-hidden")+ this.highlightIfContainedTopCategory(scenelistElement.tasksEntity)}>
                                <div className="scene-element-headline">
                                    <button type="button"
                                            className="scenegraph-headline-button"
                                            onClick={() => this.setState({tasksEntityListOpened:!this.state.tasksEntityListOpened})}>
                                        <img src={this.state.tasksEntityListOpened? openedTab:closedTab} alt=""/>
                                        Taskbars
                                    </button>
                                </div>
                                <div className={this.state.tasksEntityListOpened? "scenegraph-category-list":"scenegraph-hidden"}>
                                    {scenelist.tasksEntity}
                                </div>
                            </div>
                            <div className={(scenelist.texts.length>0?"scene-element-nested":"scenegraph-hidden") + this.highlightIfContainedTopCategory(scenelistElement.texts)}>
                                <div className="scene-element-headline">
                                    <button type="button"
                                            className="scenegraph-headline-button"
                                            onClick={() => this.setState({textListOpened:!this.state.textListOpened})}>
                                        <img src={this.state.textListOpened? openedTab:closedTab} alt=""/>
                                        {/*</button>*/}
                                        {/*<button type="button" className="scenegraph-elementinfo"*/}
                                        {/*   onClick={() => {}}>*/}
                                        Texts
                                    </button>
                                </div>
                                <div className={this.state.textListOpened? "scenegraph-category-list":"scenegraph-hidden"}>
                                    {scenelist.texts}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={"scene-element-nested"+this.highlightIfContainedTopCategory(this.props.taskList)}>
                        <div className="scene-element-headline">
                            <button type="button"
                               className="scenegraph-headline-button"
                               onClick={() => this.setState({taskListOpened:!this.state.taskListOpened})}>
                                <img src={tabButtonTask} alt=""/>
                                Tasks
                            </button>
                        </div>
                        <div className={taskListContentClass}>
                            {taskList}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}