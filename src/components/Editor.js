import React from "react";
import ReactModal from "react-modal";
//Sub-Components
import Menubar from "./Menubar";
import AddPanel from "./AddPanel";
import Viewport from "./Viewport";
import DetailsPanel from "./DetailsPanel";
import Scenegraph from "./Scenegraph";
import InteractionPanel from "./InteractionPanel";
//Style
import '../styles/Editor.css';
//Data Classes
import Camera from "../data/Camera";
import Interaction from "../data/Interaction/Interaction";
import Entity from "../data/Entity";
import DialogManager from "./DialogManager";
import axios from "axios";
import {OBJExporter} from "three/examples/jsm/exporters/OBJExporter";
import {Scene} from "three";
import NavMesh from "../data/Model/NavMesh";
import Light from "../data/Light/Light";
import ObjModel from "../data/Model/ObjModel";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import Box from "../data/Geometry/Box";
import Sphere from "../data/Geometry/Sphere";
import Plane from "../data/Geometry/Plane";
import Cylinder from "../data/Geometry/Cylinder";
import Tetrahedron from "../data/Geometry/Tetrahedron";
import DirectionalLight from "../data/Light/DirectionalLight";
import PointLight from "../data/Light/PointLight";
import SpotLight from "../data/Light/SpotLight";
import Image from "../data/Media/Image";
import Pdf from "../data/Media/Pdf";
import Model from "../data/Model/Model";
import Text from "../data/Text";
import Texture from "../data/Texture";
import Video from "../data/Media/Video";
import Task from "../data/Task/Task";
import Activity from "../data/Task/Activity";
import TaskBar from "../data/Task/TaskBar";
import CounterElement from "../data/Interaction/CounterElement";
import ButtonElement from "../data/Interaction/ButtonElement";
import PressurePlate from "../data/Interaction/PressurePlate";
import ConditionInteraction from "../data/Interaction/ConditionInteraction";
import Condition from "../data/Interaction/Condition";
import TutorialPanel from "./TutorialPanel";

export default class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.interactionPanelRef=React.createRef(); //reference to inform the interactionpanel about changes
        this.scenegraphRef=React.createRef(); // reference to inform the scenegraph about changes
        this.menubarRef=React.createRef(); // reference to inform the menubar about the hovered element
        this.viewportRef=React.createRef(); // reference to set the camera to a specific position
        this.dialogManagerRef=React.createRef(); // reference to inform the dialogmanager about changes
        this.tutorialPanelRef=React.createRef(); // setup the tutorial
        ReactModal.setAppElement('#root'); //the modal has to be bind to the App to hide the content when it is shown

        this.interactionList=["complex","source","event", "target", "effect","values", "save"]
        this.scenegraphList=["all","remove","copy","goto","edit","detailed"]
        this.detailsPanelList=["Position","x","y","z","Rotation","xRotation","yRotation","zRotation","Scale","xScale","yScale","zScale"]
        this.menuList=["new", "open","save","selected","hovered", "demo" ]
        this.viewportList=["view","grid", "task", "invisible","mode","position","rotation","scale","reset"]
        this.state = {
            scene: [], //saves all entities
            taskList:[],
            selected:null, //current selected Entity or Interaction
            isSaved:false, // state if the editor contains unsaved changes
            userImages:[], //saves all uploaded Images
            userModels:[], //saves all uploaded Model
            userPdfs:[], //saves all uploaded Pdfs
            userVideos:[], //saves all uploaded Videos
            userTextures:[],//saves all uploaded Textures
            projectName:"unknown", //saves the project name

            showTutorialHighlightAddPanel:false,
            highlightAddPanelElement:null,

            showTutorialHighlightInteractionPanel: false,
            highlightInteractionPanelElement:null,

            showTutorialHighlightScenegraph:false,
            highlightScenegraphElement:null,
            highlightScenegraphElementMode:null,

            showTutorialHighlightDetailsPanel:false,
            highlightDetailsPanelElement:null,

            showTutorialHighlightMenuBar:false,
            highlightMenuBarElement:null,

            showTutorialHighlightViewport:false,
            highlightViewportButton:null,


            tutorialMode:false,
            tutorialStepIsSolved:false,
            showTutorialPanel:false,
            tutorialStep:null,
            tutorialAddedBox:null,
            tutorialAddedPdf:null,
            tutorialAddedInteraction:null,
            tutorialAddedActivity:null,
            tutorialAddedTaskBar:null,

        };
        this.setToInitState(this.state.projectName)

    }

    exitTutorial(goBack){
        this.setState({
            showTutorialHighlightAddPanel:false,
            highlightAddPanelElement:null,
            showTutorialHighlightInteractionPanel: false,
            highlightInteractionPanelElement:null,
            showTutorialHighlightScenegraph:false,
            highlightScenegraphElement:null,
            highlightScenegraphElementMode:null,
            showTutorialHighlightDetailsPanel:false,
            highlightDetailsPanelElement:null,
            showTutorialHighlightMenuBar:false,
            highlightMenuBarElement:null,
            showTutorialHighlightViewport:false,
            highlightViewportButton:null,

            tutorialMode:false,
            tutorialStepIsSolved:false,
            showTutorialPanel:false,
            tutorialStep:null,
            tutorialAddedBox:null,
            tutorialAddedPdf:null,
            tutorialAddedInteraction:null,
            tutorialAddedActivity:null,
            tutorialAddedTaskBar:null,
        })
        if(goBack){
            this.setToInitState(this.state.projectName);
            this.dialogManagerRef.current.openDialog("start");
        }
    }

    setTutorialStep(step){
        switch (step){
            case "start":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,
                    tutorialAddedBox:null,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,
                })
                break;
            case "introduceViewport":
            case "viewportControl":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,
                    tutorialAddedBox:null,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:true,
                    highlightViewportButton:null,
                })
                break;
            case "viewportCamReset":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,
                    tutorialAddedBox:null,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:true,
                    highlightViewportButton:"reset",
                })
                break;
            case "introduceAddPanel":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,
                    tutorialAddedBox:null,

                    showTutorialHighlightAddPanel:true,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,
                })
                break;
            case "addBox":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,
                    tutorialAddedBox:null,

                    showTutorialHighlightAddPanel:true,
                    highlightAddPanelElement:"Box",

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,
                })
                break;
            case "introduceScenegraph":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:true,
                    highlightScenegraphElement:this.state.tutorialAddedBox,
                    highlightScenegraphElementMode:"all",

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,
                })
                break;
            case "moveBox":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:true,
                    highlightViewportButton:"position",
                    selected:this.state.tutorialAddedBox

                })
                this.viewportRef.current.setupTutorialArea({position:[1,1.5,-6.5],rotation:[0,0,0],scale:[3,3,3],color:"yellow"},this.state.tutorialAddedBox)
                break;
            case "introduceDetails":
                this.viewportRef.current.removeTutorialArea()
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:true,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "changeTexture":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:true,
                    highlightDetailsPanelElement:"Texture",
                    selected:this.state.tutorialAddedBox,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "addPdf":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,
                    tutorialAddedPdf:null,

                    showTutorialHighlightAddPanel:true,
                    highlightAddPanelElement:"Pdf",

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "movePdf":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:true,
                    highlightViewportButton:"position",
                    selected:this.state.tutorialAddedPdf

                })
                this.viewportRef.current.setupTutorialArea({position:[0,2,-9.9],rotation:[0,0,0],scale:[2,2,0.4],color:"yellow"},this.state.tutorialAddedPdf)

                break;
            case "scalePdf":
                this.viewportRef.current.removeTutorialArea()
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:true,
                    highlightViewportButton:"scale",
                    selected:this.state.tutorialAddedPdf

                })
                break;
            case "introduceInteractionPanel":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: true,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "selectSource":
                let solvedSource=false;
                if(this.state.selected && this.state.tutorialAddedBox){
                    solvedSource=this.state.selected.getID()===this.state.tutorialAddedBox.getID();
                }
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:solvedSource,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: true,
                    highlightInteractionPanelElement:"source",

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "selectEvent":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: true,
                    highlightInteractionPanelElement:"event",

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "selectTarget":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: true,
                    highlightInteractionPanelElement:"target",

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "selectEffect":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: true,
                    highlightInteractionPanelElement:"effect",

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "saveInteraction":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,
                    tutorialAddedInteraction:null,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: true,
                    highlightInteractionPanelElement:"save",

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "complexInteraction":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: true,
                    highlightInteractionPanelElement:"complex",

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "interactionInfo":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:true,
                    highlightScenegraphElement:this.state.tutorialAddedInteraction,
                    highlightScenegraphElementMode:"all",

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "interactionPattern":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:true,
                    highlightAddPanelElement:"Interaction",

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "createTask":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:true,
                    highlightAddPanelElement:"Task",

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "taskConfig":
            case"activityAdd":
            case "selectArchetype":
            case "saveActivity":
            case"moveTaskBar":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:"null",

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case"saveTask":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,
                    tutorialAddedActivity:null,
                    tutorialAddedTask:null,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:"null",

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "taskInfo":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:true,
                    highlightScenegraphElement:this.state.tutorialAddedTask,
                    highlightScenegraphElementMode:"all",

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "moveArea":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:true,
                    highlightViewportButton:"position",
                    selected:this.state.tutorialAddedActivity

                })
                this.viewportRef.current.setupTutorialArea({position:[4,1.5,2.5],rotation:[0,0,0],scale:[3,3,3],color:"yellow"},this.state.tutorialAddedActivity)
                break;
            case "addTaskBar":
                this.viewportRef.current.removeTutorialArea()
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:true,
                    highlightAddPanelElement:"TaskBar",

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "selectTaskOnTaskBar":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:false,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:true,
                    highlightDetailsPanelElement:"all-tasks",
                    selected:this.state.tutorialAddedTaskBar,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,


                })
                break;
            case "createNavigation":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,
                    tutorialAddedPdf:null,

                    showTutorialHighlightAddPanel:true,
                    highlightAddPanelElement:"NavMesh",

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:false,
                    highlightMenuBarElement:null,

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "saveWorld":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:true,
                    highlightMenuBarElement:"save",

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            case "testWorld":
                this.setState({
                    tutorialStep:step,
                    tutorialStepIsSolved:true,
                    tutorialMode:true,

                    showTutorialHighlightAddPanel:false,
                    highlightAddPanelElement:null,

                    showTutorialHighlightInteractionPanel: false,
                    highlightInteractionPanelElement:null,

                    showTutorialHighlightScenegraph:false,
                    highlightScenegraphElement:null,
                    highlightScenegraphElementMode:null,

                    showTutorialHighlightDetailsPanel:false,
                    highlightDetailsPanelElement:null,

                    showTutorialHighlightMenuBar:true,
                    highlightMenuBarElement:"demo",

                    showTutorialHighlightViewport:false,
                    highlightViewportButton:null,

                })
                break;
            default:
        }
    }

    entityIsPutInTutorialArea(entity){
        switch (this.state.tutorialStep){
            case "moveBox":
                if(entity && this.state.tutorialAddedBox) {
                    if (entity.getID() === this.state.tutorialAddedBox.getID()) {
                        this.setState({
                            tutorialStepIsSolved: true,
                        })
                    }
                }
                break;
            case "movePdf":
                if(entity && this.state.tutorialAddedPdf) {
                    if (entity.getID() === this.state.tutorialAddedPdf.getID()) {
                        this.setState({
                            tutorialStepIsSolved: true,
                        })
                    }
                }
                break;
            case "moveArea":
                if(entity && this.state.tutorialAddedActivity) {
                    if (entity.getID() === this.state.tutorialAddedActivity.getID()) {
                        this.setState({
                            tutorialStepIsSolved: true,
                        })
                    }
                }
                break;

            default:
        }
    }

    componentDidMount() {
        this.dialogManagerRef.current.openDialog("start");
    }

    generateDefaultPlayer(){
        return new Camera("Player","/models/player/scene.gltf",1.6)
    }

    newProject(){
        this.dialogManagerRef.current.openDialog("new",{start:false})
    }

    createEmptyProject(projectName){
        if(this.state.tutorialMode){
            this.exitTutorial(false);
        }
        this.setToInitState(projectName)
    }

    handleClickOnNewInMenubar(){
        if(this.state.isSaved){ // virtual environment is saved
            this.dialogManagerRef.current.openDialog("new",{start:false})
        }
        else{ //virtual environment has unsaved changes
            this.dialogManagerRef.current.openDialog("unsaved",{type:"new"}) // open a dialog which handles unsaved projects
        }
    }

    setToInitState(name){
        const player = this.generateDefaultPlayer()
        document.title=name
        player.loadEntity((player)=>{
            this.interactionPanelRef.current.initInteractionPanel([player]);
            this.setState({ //set state to default state
                scene: [player],
                taskList:[], //saves all tasks
                selected:null,
                isSaved:false,
                projectName:name,
            })
        });
    }

    handleAddElementToScene(newElement,hasToBeLoaded,loadOptions) {
        if(newElement==null){
            return;
        }
        if(hasToBeLoaded){
            const callbackAfterLoad=(loadedElement)=>this.handleAddElementToScene(loadedElement,false); //the callback functions calls this function with an unset load flag
            this.dialogManagerRef.current.openDialog("loading") //opens a loading dialog which blocks the editor while the loading is performed
            newElement.loadEntity(callbackAfterLoad.bind(this),loadOptions); //loads the Element and calls the callback after completing
        }
        else{
            this.dialogManagerRef.current.closeDialog("loading"); //closes the loading modal (no effect when it is already closed)
            if(!newElement){
                this.dialogManagerRef.current.openDialog("error",{message:"the entity could not be added to the scene"});
                return;
            }

            const scene = this.state.scene.slice(); //copies the scene
            this.scenegraphRef.current.entityWasAddedToSceneGraph(); // informs the Scenegraph that an new Element was added
            if(newElement instanceof Entity){
                this.interactionPanelRef.current.updateChosenEventAfterSelectionEntity(newElement); //the selection updates the selectable events in the InteractionPanel and so it has to be informed about the change
            }
            if(!(newElement instanceof NavMesh)) {
                newElement.setAttribute("positionPOV", this.viewportRef.current.getCameraTarget())
            }

            let addTaskSolved=false;
            if(this.state.tutorialMode){
                if(!this.state.tutorialStepIsSolved){
                    switch (this.state.tutorialStep){
                        case"addBox":
                            if(newElement instanceof Box){
                                addTaskSolved=true;
                            }
                            break;
                        case"addPdf":
                            if(newElement instanceof Pdf){
                                addTaskSolved=true;
                            }
                            break;
                        case"addTaskBar":
                            if(newElement instanceof TaskBar){
                                addTaskSolved=true;
                            }
                            break;
                        default:
                    }
                }
            }
            if(this.state.tutorialMode){
                if (!this.state.tutorialStepIsSolved){
                    if(!this.state.tutorialStepIsSolved){
                        switch (this.state.tutorialStep){
                            case"addBox":
                                this.setState({ // changes the state of the Editor
                                    scene: scene.concat([newElement]), // adds the new element to the scene list
                                    selected: newElement,
                                    isSaved: false, //unset the saved flag
                                    tutorialStepIsSolved:addTaskSolved,
                                    tutorialAddedBox:newElement,
                                });
                                return;
                            case"addPdf":
                                this.setState({ // changes the state of the Editor
                                    scene: scene.concat([newElement]), // adds the new element to the scene list
                                    selected: newElement,
                                    isSaved: false, //unset the saved flag
                                    tutorialStepIsSolved:addTaskSolved,
                                    tutorialAddedPdf:newElement,
                                });
                                return;
                            case"addTaskBar":
                                this.setState({ // changes the state of the Editor
                                    scene: scene.concat([newElement]), // adds the new element to the scene list
                                    selected: newElement,
                                    isSaved: false, //unset the saved flag
                                    tutorialStepIsSolved:addTaskSolved,
                                    tutorialAddedTaskBar:newElement,
                                });
                                return;
                            default:
                        }
                    }
                }
            }
            this.setState({ // changes the state of the Editor
                scene: scene.concat([newElement]), // adds the new element to the scene list
                selected: newElement,
                isSaved: false, //unset the saved flag
            });
        }
    }

    addCustomElementToScene(newElement, customEntry, hasToBeLoaded, loadOptions) {
        if(hasToBeLoaded){
            const callbackAfterLoad=(loadedElement)=>this.addCustomElementToScene(loadedElement,customEntry,false,{}); //the callback functions calls this function with an unset load flag
            this.dialogManagerRef.current.openDialog("loading") //opens a loading dialog which blocks the editor while the loading is performed
            newElement.loadEntity(callbackAfterLoad.bind(this),loadOptions); //loads the Element and calls the callback after completing
            }
        else{
            this.dialogManagerRef.current.closeDialog("loading"); //closes the loading modal (no effect when it is already closed)

            if(!newElement){
                this.dialogManagerRef.current.openDialog("error", {message:"The entitiy could not be added something went wrong in the upload"});
                return;
            }
            const scene = this.state.scene.slice(); //copies the scene
            this.scenegraphRef.current.entityWasAddedToSceneGraph(); // informs the Scenegraph that an new Element was added
            if(newElement instanceof Entity){
                this.interactionPanelRef.current.updateChosenEventAfterSelectionEntity(newElement); //the selection updates the selectable events in the InteractionPanel and so it has to be informed about the change
            }
            if(!(newElement instanceof NavMesh)) {
                newElement.setAttribute("positionPOV", this.viewportRef.current.getCameraTarget())
            }

            let addTaskSolved=false;
            if(this.state.tutorialMode){
                if(!this.state.tutorialStepIsSolved){
                    switch (this.state.tutorialStep){
                        case"addPdf":
                            if(newElement instanceof Pdf){
                                addTaskSolved=true;
                            }
                            break;
                        default:
                    }
                }
            }
            if(this.state.tutorialMode){
                if (!this.state.tutorialStepIsSolved){
                    switch (this.state.tutorialStep){
                        case"addPdf":
                            this.setState({ // changes the state of the Editor
                                scene: scene.concat([newElement]), // adds the new element to the scene list
                                selected:newElement,
                                isSaved:false, //unset the saved flag
                                userPdfs:this.state.userPdfs.concat(customEntry.addEntry),
                                tutorialStepIsSolved:addTaskSolved,
                                tutorialAddedPdf:newElement,
                            });
                            return;
                        default:
                    }
                }
            }

            switch(customEntry.elementType){
                case "model":
                    this.setState({ // changes the state of the Editor
                        scene: scene.concat([newElement]), // adds the new element to the scene list
                        selected:newElement,
                        isSaved:false, //unset the saved flag
                        userModels:this.state.userModels.concat(customEntry.addEntry)
                    });
                    break;
                case "navigation":
                    this.setState({ // changes the state of the Editor
                        scene: scene.concat([newElement]), // adds the new element to the scene list
                        selected:newElement,
                        isSaved:false, //unset the saved flag
                    });
                    break;
                case "image":
                    this.setState({ // changes the state of the Editor
                        scene: scene.concat([newElement]), // adds the new element to the scene list
                        selected:newElement,
                        isSaved:false, //unset the saved flag
                        userImages:this.state.userImages.concat(customEntry.addEntry)
                    });
                    break;
                case "pdf":
                    this.setState({ // changes the state of the Editor
                        scene: scene.concat([newElement]), // adds the new element to the scene list
                        selected:newElement,
                        isSaved:false, //unset the saved flag
                        userPdfs:this.state.userPdfs.concat(customEntry.addEntry)
                    });
                    break;
                case "video":
                    this.setState({ // changes the state of the Editor
                        scene: scene.concat([newElement]), // adds the new element to the scene list
                        selected:newElement,
                        isSaved:false, //unset the saved flag
                        userVideos:this.state.userVideos.concat(customEntry.addEntry)
                    });
                    break;

                default:
                    console.log("custom type not supported")
            }

        }
    }

    addTextureToEntity(texture,entity,hasToBeLoaded,loadOptions){
        if((!texture)||(!entity)){
            return;
        }
        if(hasToBeLoaded){
            entity.addTexture(texture)
            const callbackAfterLoad=(loadedElement)=>this.addTextureToEntity(texture,loadedElement,false); //the callback functions calls this function with an unset load flag
            entity.loadEntity(callbackAfterLoad.bind(this),loadOptions); //loads the Element and calls the callback after completing
            this.dialogManagerRef.current.openDialog("loading") //opens a loading dialog which blocks the editor while the loading is performed
        }
        else{
            this.dialogManagerRef.current.closeDialog("loading"); //closes the loading modal (no effect when it is already closed)
            this.setState({ // changes the state of the Editor
                selected:null,
            });

            let addTaskSolved=false;
            if(this.state.tutorialMode){
                if(!this.state.tutorialStepIsSolved){
                    switch (this.state.tutorialStep){
                        case"changeTexture":
                            if(entity.hasTextures()){
                                addTaskSolved=true;
                            }
                            break;
                        default:
                    }
                }
            }
            if(this.state.tutorialMode){
                if (!this.state.tutorialStepIsSolved){
                    this.setState({ // changes the state of the Editor
                        selected:entity,
                        isSaved:false, //unset the saved flag
                        userTextures:this.state.userTextures.concat(texture),
                        tutorialStepIsSolved:addTaskSolved,
                    });
                    return;
                }
            }

            this.setState({ // changes the state of the Editor
                selected:entity,
                isSaved:false, //unset the saved flag
                userTextures:this.state.userTextures.concat(texture),
            });
        }
    }

    copyElementToScene(toCopyObject){
        const copiedEntity = toCopyObject.copyEntity()
        copiedEntity.setAttribute("y",copiedEntity.y); //small workaround for models
        const options = {autoscale:copiedEntity.isAutoscaled}
        this.handleAddElementToScene(copiedEntity,copiedEntity.hasToBeLoaded(),options);
    }

    copyActivity(toCopyActivty,task){
        const copiedActivty = toCopyActivty.copyActivity()
        task.addActivity(copiedActivty);
        this.setState({ // changes the state of the Editor
            isSaved: false, //unset the saved flag
        });
    }

    copyTask(toCopyTask){
        const copiedTask = toCopyTask.copyTask()
        const tasks = this.state.taskList.slice(); //copies the scene
        this.scenegraphRef.current.taskWasAddedToSceneGraph(); // informs the Scenegraph that an new Element was added
        this.setState({ // changes the state of the Editor
            taskList: tasks.concat([copiedTask]), // adds the new element to the scene list
            isSaved: false, //unset the saved flag
        });
    }

    removeEntity(removedObject) {
        if(this.state.tutorialMode){
            if(removedObject===this.state.tutorialAddedBox){
                return;
            }
            if(removedObject===this.state.tutorialAddedPdf){
                return;
            }
            if(removedObject===this.state.tutorialAddedTaskBar){
                return;
            }
        }
        const scene = this.state.scene.slice(); // copy the list
        let copiedTaskList=this.state.taskList.slice()
        let elementIndex;
        for( elementIndex = 0; elementIndex < scene.length; elementIndex++){ //remove the object from the list
            if ( scene[elementIndex] === removedObject) {
                scene.splice(elementIndex, 1);
                break;
            }
        }

        let removedInteractionsWithTarget=[]
        if(removedObject instanceof Entity){ //search for Interactions which target this entity
            for( let elementIndex = 0; elementIndex < scene.length; elementIndex++){ //remove all interactions with this entity as target
                removedInteractionsWithTarget.push({source:scene[elementIndex], interactionList:scene[elementIndex].removeInteractionWithTarget(removedObject)});
            }
        }
        for(let index=0;index<removedInteractionsWithTarget.length;index++){
            if(removedInteractionsWithTarget[index].interactionList){
                let interactionList=removedInteractionsWithTarget[index].interactionList;
                for(let indexInteraction=0;indexInteraction<interactionList.length;indexInteraction++) {
                    this.removeInteraction(interactionList[indexInteraction],removedInteractionsWithTarget[index].source,copiedTaskList)
                }
            }
        }
        let interactionList=removedObject.getInteractions().slice();
        for(let index=0;index<interactionList.length;index++){
            this.removeInteraction(interactionList[index],removedObject,copiedTaskList)
        }

        let removeConditions=this.createRemoveListOfCondititonsWithTarget(removedObject);
        for(let index=0;index<removeConditions.length; index++){ // delete all conditions
            removeConditions[index].interaction.removeCondition(removeConditions[index].condition)
        }

        let taskList=this.state.taskList;
        let removeActivities=[];
        for(let index=0; index<taskList.length;index++){
            let activityList=taskList[index].getActivities();
            for(let indexActivity=0; indexActivity<activityList.length;indexActivity++){
                let parameters=activityList[indexActivity].getParameters();
                if(parameters){
                    if(parameters.entity===removedObject.getID()){
                        removeActivities.push({task:taskList[index],activity:activityList[indexActivity]});
                    }
                }
            }
        }

        for(let index=0; index<removeActivities.length;index++){
            this.removeActivityFromTaskList(removeActivities[index].activity,removeActivities[index].task,false,copiedTaskList)
        }

        removedObject.onRemove(); // call the remove function of the object

        this.interactionPanelRef.current.updateChosenTargetAfterDeletionInScenegraph(removedObject)
        this.scenegraphRef.current.entityAtIndexIsDeleted(elementIndex)

        let included=false
        if(this.state.selected instanceof Interaction){
            if(removedObject.containsInteraction(this.state.selected)){
                included=true;
            }
        }
        if(removedObject===this.state.selected||included){ //remove the selection if selected
            this.setState({
                scene: scene,
                selected:null,
                isSaved:false,
            });
        }
        else {
            this.setState({
                scene: scene,
                isSaved:false,
            });
        }
    }

    removeTask(removedTask,taskList) {
        if(this.state.tutorialMode){
            if(removedTask===this.state.tutorialAddedTask){
                return;
            }
        }

        const tasks = taskList; // copy the list
        let elementIndex;
        for( elementIndex = 0; elementIndex < tasks.length; elementIndex++){ //remove the object from the list
            if ( tasks[elementIndex] === removedTask) {
                tasks.splice(elementIndex, 1);
                break;
            }
        }



        let removeConditions=this.createRemoveListOfCondititons("task",removedTask);
        for(let index=0;index<removeConditions.length; index++){ // delete all conditions
            removeConditions[index].interaction.removeCondition(removeConditions[index].condition)
        }

        let activityList=removedTask.getActivities().slice();
        for(let index=0; index<activityList.length;index++){
            this.removeActivityFromTaskList(activityList[index],removedTask,true,tasks);
        }

        let entityList=this.state.scene;
        for(let index=0; index<entityList.length;index++){ // remove the task from taskbars
            if(entityList[index] instanceof TaskBar){
                if(entityList[index].showsTask(removedTask)){
                    entityList[index].setAttribute("task",null);
                }
            }
        }

        removedTask.onRemove(); // call the remove function of the object
        this.scenegraphRef.current.taskAtIndexIsDeleted(elementIndex)
        let included=false
        if(this.state.selected instanceof Activity){
            if(removedTask.containsActivity(this.state.selected)){
                included=true;
            }
        }
        if(removedTask===this.state.selected||included){ //remove the selection if selected
            this.setState({
                taskList: tasks,
                selected:null,
                isSaved:false,
            });
        }
        else {
            this.setState({
                taskList: tasks,
                isSaved:false,
            });
        }
    }

    removeCondition(removedCondition, containingInteraction) {
        containingInteraction.removeCondition(removedCondition);

        if(removedCondition===this.state.selected){ //remove the selection if selected
            this.setState({
                selected:null,
                isSaved:false,
            });
        }
        else {
            this.setState({
                isSaved:false,
            });
        }
    }

    removeInteraction(removedInteraction, containingEntity,currentTasklist) {
        if(this.state.tutorialMode){
            if(removedInteraction===this.state.tutorialAddedInteraction){
                return;
            }
        }
        containingEntity.removeInteraction(removedInteraction);
        let taskList=currentTasklist;
        let removeActivities=[];
        for (let indexTask=0; indexTask< taskList.length; indexTask++){
            let activityList=taskList[indexTask].getActivities();
            for (let indexActivity=0; indexActivity< activityList.length; indexActivity++){
                let parameters=activityList[indexActivity].getParameters()
                if(parameters){
                    if(parameters.interaction===removedInteraction.getID()){
                        removeActivities.push({activity:activityList[indexActivity], task:taskList[indexTask]})
                    }
                }
            }
        }
        let removeConditions=this.createRemoveListOfCondititons("interaction",removedInteraction);
        for(let index=0;index<removeConditions.length; index++){ // delete all conditions
            removeConditions[index].interaction.removeCondition(removeConditions[index].condition)
        }
        for(let index=0;index<removeActivities.length; index++){ // delete all activities
            this.removeActivityFromTaskList(removeActivities[index].activity,removeActivities[index].task,false,currentTasklist)
        }
        if(removedInteraction===this.state.selected){ //remove the selection if selected
            this.setState({
                selected:null,
                isSaved:false,
            });
        }
        else {
            this.setState({
                isSaved:false,
            });
        }
    }

    createRemoveListOfCondititonsWithTarget(removedTarget){
        let entityList=this.state.scene;
        let removeConditions=[];
        for (let indexEntity=0; indexEntity< entityList.length; indexEntity++){
            let interactionList=entityList[indexEntity].getInteractions();
            for (let indexInteraction=0; indexInteraction< interactionList.length; indexInteraction++){
                if(interactionList[indexInteraction] instanceof ConditionInteraction){
                    let conditionList=interactionList[indexInteraction].getConditions();
                    for (let indexCondition=0; indexCondition< conditionList.length; indexCondition++){
                        let targetCondition=conditionList[indexCondition].getTarget()
                        if(targetCondition){
                            if(targetCondition.getID()===removedTarget.getID()){
                                removeConditions.push({condition:conditionList[indexCondition], interaction:conditionList=interactionList[indexInteraction]})
                            }
                        }
                    }
                }
            }
        }
        return removeConditions
    }

    createRemoveListOfCondititons(parameterName, removedElement){
        let entityList=this.state.scene;
        let removeConditions=[];
        for (let indexEntity=0; indexEntity< entityList.length; indexEntity++){
            let interactionList=entityList[indexEntity].getInteractions();
            for (let indexInteraction=0; indexInteraction< interactionList.length; indexInteraction++){
                if(interactionList[indexInteraction] instanceof ConditionInteraction){
                    let conditionList=interactionList[indexInteraction].getConditions();
                    for (let indexCondition=0; indexCondition< conditionList.length; indexCondition++){
                        let parameters=conditionList[indexCondition].getParameters()
                        if(parameters){
                            if(parameters[parameterName]===removedElement.getID()){
                                removeConditions.push({condition:conditionList[indexCondition], interaction:conditionList=interactionList[indexInteraction]})
                            }
                        }
                    }
                }
            }
        }
        return removeConditions
    }

    removeActivityFromTaskList(removedActivity, containingTask, isTaskedRemoved,taskList) {
        if(this.state.tutorialMode){
            if(removedActivity===this.state.tutorialAddedActivity){
                return;
            }
        }
        containingTask.removeActivity(removedActivity)
        removedActivity.onRemove(); // call the remove function of the object
        let removeConditions=this.createRemoveListOfCondititons("activity",removedActivity);
        for(let index=0;index<removeConditions.length; index++){ // delete all conditions
            removeConditions[index].interaction.removeCondition(removeConditions[index].condition)
        }

        if(containingTask.getActivities().length<1&&!isTaskedRemoved){// no activities and the task is not deleted
           this.removeTask(containingTask,taskList)
        }
        if(removedActivity===this.state.selected){ //remove the selection if selected
            this.setState({
                selected:null,
                isSaved:false,
            });
        }
        else {
            this.setState({
                isSaved:false,
            });
        }

    }

    handleMouseIsOnEntity(entity){
        if(!entity){
            return;
        }
        this.menubarRef.current.changeHoveredElement(entity);
    }

    handleSelectionOfEntity(selectedElement){

        if(selectedElement instanceof Entity){
            this.interactionPanelRef.current.updateChosenEventAfterSelectionEntity(selectedElement); //the selection updates the selectable events in the InteractionPanel and so it has to be informed about the change
        }

        let selectTaskSolved=false;
        if(this.state.tutorialMode){
            if(!this.state.tutorialStepIsSolved){
                if(selectedElement) {
                    switch (this.state.tutorialStep) {
                        case"selectSource":
                            if (this.state.tutorialAddedBox) {
                                if (selectedElement.getID() === this.state.tutorialAddedBox.getID()) {
                                    selectTaskSolved = true;
                                }
                            }
                            break;
                        default:
                    }
                }
            }
        }
        if(this.state.tutorialMode){
            if (!this.state.tutorialStepIsSolved){
                this.setState({ // changes the state of the Editor
                    selected: selectedElement,
                    tutorialStepIsSolved:selectTaskSolved,
                });
                return;
            }
        }

        this.setState({
            selected:selectedElement,
        },);
    }
    selectAndGotoElement(element){
        if(element instanceof Activity){
           if(element.getType()==="entityInteract"&&element.getParameters()){
               for(let indexEntity=0;indexEntity<this.state.scene.length;indexEntity++){
                   let interactionList=this.state.scene[indexEntity].getInteractions();
                   for(let indexInteraction=0;indexInteraction<interactionList.length;indexInteraction++){
                       if(interactionList[indexInteraction].getID()===element.getParameters().interaction){
                           element.setAttribute("position",this.state.scene[indexEntity].getPosition())
                       }
                   }
               }
           }
        }
        this.viewportRef.current.focusCameraOnElement(element)
        this.handleSelectionOfEntity(element);
    }
    handleChangeInDetailsPanel(element,name,value,changeType){
        switch(changeType){
            case "add-texture":
                this.dialogManagerRef.current.openDialog("uploadMedia",{type:"texture", target:value, materialName:"body"})
                break;
            case "texture-selector":
                if(value==="undefined"){
                    element.setAttribute("textures",[]);
                    this.setState({
                        selected:null,
                    });
                }
                else {
                    let textures = this.state.userTextures
                    for (let index = 0; index < textures.length; index++) {
                        if (textures[index].id === value) { //texture is found
                            element.addTexture(textures[index]);
                            break;
                        }
                    }
                }
                let addTaskSolvedTexture=false;
                if(this.state.tutorialMode){
                    if(!this.state.tutorialStepIsSolved){
                        switch (this.state.tutorialStep){
                            case"changeTexture":
                                if(element.hasTextures()){
                                    addTaskSolvedTexture=true;
                                }
                                break;
                            default:
                        }
                    }
                }
                if(this.state.tutorialMode){
                    if (!this.state.tutorialStepIsSolved){
                        this.setState({ // changes the state of the Editor
                            selected:element,
                            isSaved:false,
                            tutorialStepIsSolved:addTaskSolvedTexture,
                        });
                        return;
                    }
                }
                this.setState({
                    selected:element,
                    isSaved:false,
                });
                break;

            case "task-selector":
                if(value==="undefined"){
                    element.setAttribute("task",null);
                }
                else {
                    let taskList = this.state.taskList
                    for (let index = 0; index < taskList.length; index++) {
                        if (taskList[index].getID() === value) { //texture is found
                            element.setAttribute("task",taskList[index]);
                            break;
                        }
                    }
                }

                let addTaskSolvedTask=false;
                if(this.state.tutorialMode){
                    if(!this.state.tutorialStepIsSolved){
                        switch (this.state.tutorialStep){
                            case"selectTaskOnTaskBar":
                                if(element.showsTask(this.state.tutorialAddedTask)){
                                    addTaskSolvedTask=true;
                                }
                                break;
                            default:
                        }
                    }
                }
                if(this.state.tutorialMode){
                    if (!this.state.tutorialStepIsSolved){
                        this.setState({ // changes the state of the Editor
                            selected:element,
                            isSaved:false,
                            tutorialStepIsSolved:addTaskSolvedTask,
                        });
                        return;
                    }
                }
                this.setState({
                    selected:element,
                    isSaved:false,
                });
                break;
            case "clear-texture":
                element.setAttribute("textures",value);
                this.setState({
                    selected:null,
                });
                this.setState({
                    selected:element,
                    isSaved:false,
                });
                break;
            case "attribute":
            default:
                element.setAttribute(name,value);
                this.setState({
                    selected:element,
                    isSaved:false,
                });
        }
    }

    saveProject(){
        let exportData="<Project name='"+this.state.projectName+"'>\n";
        exportData+="\t<IDs>\n";

        exportData+="\t\t<Box>"+(Box.counterChild?Box.counterChild:0)+"</Box>\n";
        exportData+="\t\t<Cylinder>"+(Cylinder.counterChild?Cylinder.counterChild:0)+"</Cylinder>\n";
        exportData+="\t\t<Plane>"+(Plane.counterChild?Plane.counterChild:0)+"</Plane>\n";
        exportData+="\t\t<Sphere>"+(Sphere.counterChild?Sphere.counterChild:0)+"</Sphere>\n";
        exportData+="\t\t<Tetrahedron>"+(Tetrahedron.counterChild?Tetrahedron.counterChild:0)+"</Tetrahedron>\n";

        exportData+="\t\t<Light>"+(Light.counterChild?Light.counterChild:0)+"</Light>\n";
        exportData+="\t\t<DirectionalLight>"+(DirectionalLight.counterChild?DirectionalLight.counterChild:0)+"</DirectionalLight>\n";
        exportData+="\t\t<PointLight>"+(PointLight.counterChild?PointLight.counterChild:0)+"</PointLight>\n";
        exportData+="\t\t<SpotLight>"+(SpotLight.counterChild?SpotLight.counterChild:0)+"</SpotLight>\n";

        exportData+="\t\t<Image>"+(Image.counterChild?Image.counterChild:0)+"</Image>\n";
        exportData+="\t\t<Pdf>"+(Pdf.counterChild?Pdf.counterChild:0)+"</Pdf>\n";
        exportData+="\t\t<Video>"+(Video.counterChild?Video.counterChild:0)+"</Video>\n";

        exportData+="\t\t<Model>"+(Model.counterChild?Model.counterChild:0)+"</Model>\n";
        exportData+="\t\t<NavMesh>"+(NavMesh.counterChild?NavMesh.counterChild:0)+"</NavMesh>\n";

        exportData+="\t\t<Activity>"+(Activity.counterChild?Activity.counterChild:0)+"</Activity>\n";
        exportData+="\t\t<Task>"+(Task.counterChild?Task.counterChild:0)+"</Task>\n";
        exportData+="\t\t<TaskBar>"+(TaskBar.counterChild?TaskBar.counterChild:0)+"</TaskBar>\n";

        exportData+="\t\t<CounterElement>"+(CounterElement.counterChild?CounterElement.counterChild:0)+"</CounterElement>\n";
        exportData+="\t\t<ButtonElement>"+(ButtonElement.counterChild?ButtonElement.counterChild:0)+"</ButtonElement>\n";
        exportData+="\t\t<PressurePlate>"+(PressurePlate.counterChild?PressurePlate.counterChild:0)+"</PressurePlate>\n";

        exportData+="\t\t<Entity>"+(Entity.counter?Entity.counter:0)+"</Entity>\n";
        exportData+="\t\t<Interaction>"+(Interaction.counterChild?Interaction.counterChild:0)+"</Interaction>\n";
        exportData+="\t\t<ConditionInteraction>"+(ConditionInteraction.counterChild?ConditionInteraction.counterChild:0)+"</ConditionInteraction>\n";
        exportData+="\t\t<Condition>"+(Condition.counterChild?Condition.counterChild:0)+"</Condition>\n";
        exportData+="\t\t<Text>"+(Text.counterChild?Text.counterChild:0)+"</Text>\n";
        exportData+="\t\t<Texture>"+(Texture.counterChild?Texture.counterChild:0)+"</Texture>\n";

        exportData+="\t</IDs>\n"

        exportData+="\t<UserContent>\n";
        for (let i=0;i<this.state.userModels.length;i++){
            if(this.state.userModels[i].modelType==="obj"){
                exportData+="\t\t<entry type='model' name='" + this.state.userModels[i].name+"' url='"+this.state.userModels[i].url+"' modelType='" + this.state.userModels[i].modelType+"' materialUrl='" + this.state.userModels[i].materialUrl+"'>\n";
            }
            else{
                exportData+="\t\t<entry type='model' name='" + this.state.userModels[i].name+"' url='"+this.state.userModels[i].url+"' modelType='" + this.state.userModels[i].modelType+"' ='" + this.state.userModels[i].name+"'>\n";
            }
            exportData+="\t\t<load object='true'>\n"
            for(const [key, value] of Object.entries(this.state.userModels[i].loadOptions)){
                exportData+="\t\t\t<"+key+">"+value+"</"+key+">\n"
            }
            exportData+="\t\t</load>\n"
            exportData+="\t\t</entry>\n"
        }
        for (let i=0;i<this.state.userImages.length;i++){
            exportData+="\t\t<entry type='image' name='" + this.state.userImages[i].name+"' url='"+this.state.userImages[i].url+"'></entry>\n";
        }
        for (let i=0;i<this.state.userVideos.length;i++){
            exportData+="\t\t<entry type='video' name='" + this.state.userVideos[i].name+"' url='"+this.state.userVideos[i].url+"'></entry>\n";
        }
        for (let i=0;i<this.state.userTextures.length;i++){
            exportData+="\t\t<entry type='texture' " + this.state.userTextures[i].exportAttributes()+"></entry>\n";
        }
        for (let i=0;i<this.state.userPdfs.length;i++){
            exportData+="\t\t<entry type='pdf' name='" + this.state.userPdfs[i].name+"' url='"+this.state.userPdfs[i].url+"'>\n";
            exportData+="\t\t<imageurl list='true'>\n";
            for (let imageIndex=0;imageIndex<this.state.userPdfs[i].imageUrls.length;imageIndex++){
                exportData+="\t\t\t<listentry>"+this.state.userPdfs[i].imageUrls[imageIndex]+"</listentry>\n";
            }
            exportData+="\t\t</imageurl>\n";
            exportData+="\t\t</entry>\n";
        }
        exportData+="\t</UserContent>\n"

        exportData+="\t<Scene>\n";
        for (let i=0;i<this.state.scene.length;i++){
            exportData+=this.state.scene[i].exportEntity() +"\n";
        }
        exportData+="\t</Scene>\n"
        exportData+="\t<Tasks>\n";
        for (let i=0;i<this.state.taskList.length;i++){
            exportData+=this.state.taskList[i].exportTask() +"\n";
        }
        exportData+="\t</Tasks>\n"
        exportData+="</Project>"
        let FileSaver = require('file-saver');
        let blob = new Blob([exportData], {type: "application/xml"});
        FileSaver.saveAs(blob, "save.xml");
        this.setState({
            isSaved:true,
        });
    }

    showTutorial(){
        this.tutorialPanelRef.current.setupTutorial();
        this.setState({
            showTutorialPanel:!this.state.showTutorialPanel,
        })
    }

    startOpenProject(){
        if(this.state.isSaved){ //project is saved. A project can be opened without data lost
            this.dialogManagerRef.current.openDialog("open",{start:false});//opens a dialog which handles the opening
        }
        else{ //handle unsolved project
            this.dialogManagerRef.current.openDialog("unsaved",{type:"open"});
        }
    }

    finishOpenProject(projectName, scene,taskList,userModelList,userPdfList,userImageList,userTextureList,userVideoList,isTutorial){
        this.interactionPanelRef.current.initInteractionPanel(scene); //update the default values to the new scene
        document.title=projectName
        if(this.state.tutorialMode){
            if(!isTutorial){
                this.exitTutorial(false);
            }
        }
        this.setState({ //save the opened scene
            scene: scene,
            taskList:taskList,
            projectName:projectName,
            userImages:userImageList,
            userModels:userModelList,
            userPdfs:userPdfList,
            userVideos:userVideoList,
            userTextures:userTextureList,
        })
        if(isTutorial){
            this.showTutorial()
        }
    }

    saveInteractionPatternWithCompleteLoadedEntities(elementList){
        let currentTaskList=this.state.taskList.slice();
        let currentScene=this.state.scene.slice();
        if(elementList){
            for(let index=0;index<elementList.length;index++){
                switch (elementList[index].type){
                    case "task":
                        if(elementList[index].task instanceof Task){
                            currentTaskList.push(elementList[index].task)
                            this.scenegraphRef.current.taskWasAddedToSceneGraph()
                        }
                        break;
                    case "entity":
                        if(elementList[index].entity instanceof Entity){
                            currentScene.push(elementList[index].entity)
                            this.scenegraphRef.current.entityWasAddedToSceneGraph()
                        }
                    case "interaction":
                        if(elementList[index].entity instanceof Entity && elementList[index].interaction instanceof Interaction){
                            this.scenegraphRef.current.interactionWasAddedToSceneGraph(this.getIndexOfEntityInScene(elementList[index].entity));
                            elementList[index].entity.addInteraction(elementList[index].interaction);
                        }
                        break;
                    case "activity":
                        if(elementList[index].task instanceof Task && elementList[index].activity instanceof Activity){
                            this.scenegraphRef.current.activityWasAddedToSceneGraph(this.getIndexOfTaskInTaskList(elementList[index].task));
                            elementList[index].task.addActivity(elementList[index].activity);
                        }
                        break;
                    case "attribute":
                            elementList[index].element.setAttribute(elementList[index].attribute,elementList[index].value)
                        break;
                    default:
                }
            }
            this.setState({
                scene:currentScene,
                taskList:currentTaskList,
                isSaved:false,
            })
        }
    }

    saveInteractionPattern(elementList){
        let loadList=[];
        if(elementList){
            for (let index=0;index<elementList.length;index++){
                if(elementList[index].type==="entity"){
                    if(elementList[index].entity){
                        if(elementList[index].entity.hasToBeLoaded()){
                            loadList.push(elementList[index].entity)
                        }
                    }
                }
            }
            if(loadList.length>0){
                //load all entities in a recursive callback way
                this.dialogManagerRef.current.openDialog("loading") //open loading
                let loadChainWithCallback = function loadModels(modelList, callbackModels) {
                    if (modelList.length > 0) { //list contains models to load
                        const loadOptions={autoscale:modelList[0].isAutoscaled}
                        modelList[0].loadEntity(() => loadModels(modelList.slice(1), callbackModels),loadOptions) //load the model, recursive callback
                    } else {
                        callbackModels();
                    }

                }
                loadChainWithCallback.bind(this)
                loadChainWithCallback(loadList, () => {
                    console.log("loaded all Entities in the Pattern", loadList)
                    this.dialogManagerRef.current.closeDialog("loading") //open loading
                    this.saveInteractionPatternWithCompleteLoadedEntities(elementList); //save all elements

                })
            }
            else{
                this.saveInteractionPatternWithCompleteLoadedEntities(elementList)
            }
        }
    }

    saveConditionInteraction(interaction,source){
        let isEdited=false;
        let changedSource=false;
        for (let index=0;index<this.state.scene.length;index++){
            let interactionList=this.state.scene[index].getInteractions();
            for (let indexInteraction=0;indexInteraction<interactionList.length;indexInteraction++){
                if(interactionList[indexInteraction].getID()===interaction.getID()){ //interaction is edited
                    isEdited=true;
                    if(!(source.getID()===this.state.scene[index].getID())){ // source is changed
                        this.state.scene[index].removeInteraction(interaction)
                        changedSource=true;
                    }
                }
            }
        }
        if(!isEdited || changedSource){
            this.scenegraphRef.current.interactionWasAddedToSceneGraph(this.getIndexOfEntityInScene(source));
            source.addInteraction(interaction);
        }
        this.setState({
            selected:source,
            isSaved:false,
        });

    }

    handleAddInteractionInInteractionPanel(name,source,target,event,module,moduleOptions,effect,values){
        let interaction =source.getInteraction(event,target,module,effect);
        this.scenegraphRef.current.interactionWasAddedToSceneGraph(this.getIndexOfEntityInScene(source));
        if(interaction){ //source already has a similar interaction
            //update values
            interaction.updateEffectValues(effect,values);
        }
        else{
            interaction= new Interaction(name,target,event,module,moduleOptions,effect,values);
            source.addInteraction(interaction);
        }

        let addTaskSolved=false;
        if(this.state.tutorialMode){
            if(!this.state.tutorialStepIsSolved){
                if(source&&interaction){
                    switch (this.state.tutorialStep){
                        case"saveInteraction":
                            if(this.state.tutorialAddedBox&&this.state.tutorialAddedPdf){
                                if(source.getID()===this.state.tutorialAddedBox.getID()){
                                    if(interaction.getTarget().getID()===this.state.tutorialAddedPdf.getID()){
                                        if(interaction.getEvent()==="click"){
                                            if(interaction.getEffect()==="pdf-next-page"){
                                                addTaskSolved=true;
                                            }
                                        }
                                    }

                                }
                            }
                            break;
                        default:
                    }
                }
            }
        }
        if(this.state.tutorialMode){
            if (!this.state.tutorialStepIsSolved){
                switch (this.state.tutorialStep){
                    case"saveInteraction":
                        this.setState({ // changes the state of the Editor
                            selected:source,
                            isSaved:false,
                            tutorialStepIsSolved:addTaskSolved,
                            tutorialAddedInteraction:interaction
                        });
                        return;
                    default:
                }
            }
        }
        this.setState({
            selected:source,
            isSaved:false,
        });
    }

    handleTransformationInViewport(mode,objectThree){
        const entity=this.state.selected;
        entity.transform(mode,objectThree);
        this.setState({
                selected:entity,
                isSaved:false,
        })
    }
    getIndexOfTaskInTaskList(task){
        for (let i=0;i<this.state.taskList.length;i++){
            if (task.getID()===this.state.taskList[i].getID()){
                return i;
            }
        }
        return -1;
    }
    getIndexOfEntityInScene(entity){
        for (let i=0;i<this.state.scene.length;i++){
            if (entity.getID()===this.state.scene[i].getID()){
                return i;
            }
        }
        return -1;
    }

    addCustomContentToEditor(mediaType){
        if(mediaType==="model"){
            this.dialogManagerRef.current.openDialog("model-upload-wizard");
        }
        else{
            this.dialogManagerRef.current.openDialog("uploadMedia",{type:mediaType});

        }
    }
    generateAframeCode(){
        let htmlFile= "<!DOCTYPE html>\n"
            +"<html>\n"
            +"<head>\n"
            +"<title>"+this.state.projectName+"</title>\n"
            +"<script src='https://aframe.io/releases/1.0.4/aframe.min.js'></script>\n"
            +"<script src='https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.0/dist/aframe-extras.min.js'></script>\n"
            +"<script src='https://recast-api.donmccurdy.com/aframe-inspector-plugin-recast.js'></script>\n"
            +"<script src='/scripts/aframe-physics-system.js'></script>\n"
            +"<script src=\"https://unpkg.com/aframe-look-at-component@0.8.0/dist/aframe-look-at-component.min.js\"></script>"
            +"<script src='/scripts/aframeModels.js'></script>\n"
            +"<script src='/scripts/grab-less-listener.js'></script>\n"
            +"<script src='/scripts/loadscreen.js'></script>\n"
            +"<link rel='stylesheet' href='/scripts/loadscreen.css'>\n"
            +"</head>\n"
            +"<body>\n"
            +"<div id='splash'>\n"
            +"\t<div id='info-panel'>\n"
            +"\t\t<div id='model-load-info'><span id='counter-state-info'>0</span> of <span id='counter-max-info'>0</span> models loaded</div>\n"
            +"\t\t<div class='loading'> </div>\n"
            +"\t</div>\n"
            +"</div>\n"
            +"<a-scene inspector-plugin-recast physics loading-screen=\"enabled=false;\">\n"
            +"<a-assets>\n"
        let assets=[];
        for (let index=0; index<this.state.scene.length;index++){
            let asset=this.state.scene[index].exportAssetsToAFrame(assets)
            if(asset!==""){
                htmlFile+=asset+"\n"
            }

        }
        htmlFile+= "</a-assets>\n"
        htmlFile+="<a-entity light=\"type: ambient; color: #BBB\"></a-entity>" //ambient light
        htmlFile+="<a-entity light=\"type: directional; color: #FFF; intensity: 0.6; castShadow:true; shadowCameraBottom: -100; shadowCameraTop: 100; shadowCameraLeft: -100; shadowCameraRight: 100;\" position='-50 100 100' ></a-entity>"
        for (let index=0; index<this.state.scene.length;index++){
            htmlFile+=this.state.scene[index].exportEntityToAFrame(assets,this.state.scene)+"\n"
        }
        for (let index=0; index<this.state.taskList.length;index++){
            htmlFile+=this.state.taskList[index].exportTaskToAFrame(this.state.scene)+"\n"
        }
        for (let index=0; index<this.state.scene.length;index++){
            let interactionList=this.state.scene[index].getInteractions();
            for (let indexInteraction=0; indexInteraction<interactionList.length;indexInteraction++){
                if(interactionList[indexInteraction] instanceof ConditionInteraction){
                    htmlFile+=interactionList[indexInteraction].exportConditionAreasToAframe(this.state.scene)+"\n"
                    htmlFile+=interactionList[indexInteraction].exportConditionsToAframe(this.state.scene)+"\n"
                }
            }
        }
            htmlFile+="</a-scene>\n"
                +"</body>\n"
                +"</html>"
        return htmlFile
    }

    uploadCodeForDemo(generatedCode) {
        const data = new FormData()
        data.append("demo", generatedCode,"test.html")

        axios.post("/demo", data, {
            // receive two    parameter endpoint url ,form data
        }).then(res => { // then print response status
            if (res.statusText === "OK") {
                window.open(res.headers["demo-url"], '_blank');
                this.dialogManagerRef.current.closeDialog("loading")
            }
        }).catch(error => {
            console.log(error)
            this.dialogManagerRef.current.closeDialog("loading")
        });
        this.dialogManagerRef.current.openDialog("loading")

    }

    createComplexInteraction(source,event,target,effect,values,module,modulOptions){
        let cameraPos =this.viewportRef.current.getCameraTarget();
        this.dialogManagerRef.current.openDialog("interaction",
            {
                mode:"create",
                source:source,
                event: event,
                target:target,
                effect:effect,
                values:values,
                module:module,
                moduloptions:modulOptions,
                camera:cameraPos,
            })
    }
    editComplexInteraction(interaction,source){
        let cameraPos =this.viewportRef.current.getCameraTarget();
        this.dialogManagerRef.current.openDialog("interaction",
            {
                mode:"edit",
                interaction:interaction,
                source:source,
                camera:cameraPos,
            })
    }

    createNavMeshOnServer(){ //TODO: This way is not working because the server cant handle imports
        let scene=this.state.scene
        let obstacleScene=[];
        for(let index=0; index<scene.length;index++){
            if(!((scene[index] instanceof Camera)||(scene[index] instanceof Light)||(scene[index] instanceof NavMesh))){
                obstacleScene=obstacleScene.concat(scene[index].exportForNavmeshGeneration())
            }
        }

        axios.post("/generate-navmesh", obstacleScene, {
            // receive two    parameter endpoint url ,form data
        }).then(res => { // then print response status
            if (res.statusText === "OK") {
                this.dialogManagerRef.current.closeDialog("loading")
                this.handleAddElementToScene(new NavMesh("gltf",res.headers["nav-url"],true),true)
            }
        }).catch(error => {
            console.log(error)
            this.dialogManagerRef.current.closeDialog("loading")
        });
        this.dialogManagerRef.current.openDialog("loading")


    }
    createNavMesh(playerHeight,playerWidth,maxClimb,maxSlope){
        this.dialogManagerRef.current.openDialog("loading")
        let exporter=new OBJExporter();
        let obstacleScene = new Scene();
        let scene=this.state.scene;
        for(let index=0; index<scene.length;index++){
            if(scene[index].isExportedForNavmeshGeneration() && scene[index].isStatic){
                let mesh= scene[index].exportAsMesh()
                obstacleScene.add(mesh)
            }
        }
        obstacleScene.updateMatrixWorld( true )
        let objModel=exporter.parse(obstacleScene)

        let blob = new Blob([objModel], {type: "plain/text"});
        const data = new FormData()
        data.append("nav", blob,"test.obj")

        axios.post("/generate-navmesh-from-obj", data, {
            onUploadProgress: (progressEvent) => {console.log("upload:" +Math.round(100*progressEvent.loaded/progressEvent.total)+"%")},
            headers: {
                directory: this.state.projectName,
                agentheight:playerHeight,
                agentradius:playerWidth/2,
                agentmaxclimp:maxClimb,
                agentmaxslope:maxSlope,
            }
            // receive two    parameter endpoint url ,form data
        }).then(res => { // then print response status
            if (res.statusText === "OK") {
                this.dialogManagerRef.current.closeDialog("loading")
                for(let index=0; index<this.state.scene.length;index++){
                    if(this.state.scene[index] instanceof NavMesh){
                        this.removeEntity(scene[index])
                    }
                }
                this.handleAddElementToScene(new NavMesh("gltf",res.headers["nav-url"],true),true)
            }
        }).catch(error => {
            console.log(error)
            this.dialogManagerRef.current.openDialog("error",{message:"Your request failed. Did you forget a ground?"})
        });
    }

    createInteractionPattern(){
        let cameraPos =this.viewportRef.current.getCameraTarget();
        this.dialogManagerRef.current.openDialog("interaction-pattern",
            {
                camera:cameraPos
            })
    }

    createTask(){
        this.dialogManagerRef.current.openDialog("task",
            {
                mode:"create",
                scene:this.state.scene,
                task: new Task(),
            })
    }
    editTask(task){
        this.dialogManagerRef.current.openDialog("task",
            {
                mode:"edit",
                scene:this.state.scene,
                task: task,
            })
    }

    saveTask(task,deletedActivites){
        let taskList= this.state.taskList.slice()
        let taskWasEdited=false;
        for(let index=0;index<taskList.length;index++){
            if(task.getID()===taskList[index].getID()){
                taskWasEdited=true;
                break;
            }
        }
        if(taskWasEdited){
            for(let index=0;index<deletedActivites.length; index++){
                this.removeActivityFromTaskList(deletedActivites[index],task,false,taskList)
            }

            let addTaskSolved=false;
            let activityArea=null;
            if(this.state.tutorialMode){
                if(!this.state.tutorialStepIsSolved){
                    if(task){
                        switch (this.state.tutorialStep){
                            case"saveTask":
                                let activityList=task.getActivities()
                                if(activityList.length>0){
                                    for(let index=0; index<activityList.length; index++){
                                        if(activityList[index].getType()==="playerGoTo"){
                                            addTaskSolved=true;
                                            activityArea=activityList[index];
                                            break;
                                        }
                                    }
                                }
                                break;
                            default:
                        }
                    }
                }
            }
            if(this.state.tutorialMode){
                if (!this.state.tutorialStepIsSolved){
                    switch (this.state.tutorialStep){
                        case"saveTask":
                            this.setState({ // changes the state of the Editor
                                selected:task,
                                taskList: taskList,
                                isSaved:false,
                                tutorialStepIsSolved:addTaskSolved,
                                tutorialAddedActivity:activityArea,
                                tutorialAddedTask:task,
                            });
                            return;
                        default:
                    }
                }
            }


            this.setState({
                selected:task,
                taskList: taskList,
                isSaved:false,
            })
        }
        else{
            this.scenegraphRef.current.taskWasAddedToSceneGraph(); // informs the Scenegraph that an new Element was added
            let activities=task.getActivities();
            let cameraPos =this.viewportRef.current.getCameraTarget();
            for (let indexActivity=0;indexActivity<activities.length;indexActivity++){ //setup area position
                if(activities[indexActivity].hasArea()){
                    activities[indexActivity].setAttribute("positionPOV", cameraPos)
                }
            }

            let addTaskSolved=false;
            let activityArea=null;
            if(this.state.tutorialMode){
                if(!this.state.tutorialStepIsSolved){
                    if(task){
                        switch (this.state.tutorialStep){
                            case"saveTask":
                                let activityList=task.getActivities()
                                if(activityList.length>0){
                                    for(let index=0; index<activityList.length; index++){
                                        if(activityList[index].getType()==="playerGoTo"){
                                            addTaskSolved=true;
                                            activityArea=activityList[index];
                                            break;
                                        }
                                    }
                                }
                                break;
                            default:
                        }
                    }
                }
            }
            if(this.state.tutorialMode){
                if (!this.state.tutorialStepIsSolved){
                    switch (this.state.tutorialStep){
                        case"saveTask":
                            this.setState({ // changes the state of the Editor
                                selected:task,
                                taskList: taskList.concat(task),
                                isSaved:false,
                                tutorialStepIsSolved:addTaskSolved,
                                tutorialAddedActivity:activityArea,
                                tutorialAddedTask:task,
                            });
                            return;
                        default:
                    }
                }
            }

            this.setState({
                selected:task,
                taskList: taskList.concat(task),
                isSaved:false,
            })
        }
    }

    exportOBJ(){
        let exporter=new OBJExporter();
        let obstacleScene = new Scene();
        let scene=this.state.scene;
        for(let index=0; index<scene.length;index++){
            if(scene[index].isExportedForNavmeshGeneration() && scene[index].isStatic){
                let mesh= scene[index].exportAsMesh()
                obstacleScene.add(mesh)
            }
        }
        obstacleScene.updateMatrixWorld( true )
        let objModel=exporter.parse(obstacleScene)
        let model= new OBJLoader().parse(objModel)
        let model2=new ObjModel("obj","")
        model2.model=model;
        this.handleAddElementToScene(model2,false)
    }

    render() {
        return (
            <div className="editor">
                <div className="header">
                    <Menubar
                        selectedElement={this.state.selected}   //the current selected Element
                        onClickSave={()=>this.saveProject()} //the function which handles a click on the save button
                        onClickOpen={()=>this.startOpenProject()} // the funcion which handles opening of a saved project
                        onClickNew={()=>this.handleClickOnNewInMenubar()} // the function to start a new project
                        generateCode={()=>this.generateAframeCode()}
                        startDemo={(htmlFile)=>this.uploadCodeForDemo(htmlFile)}
                        exportOBJ={()=>this.exportOBJ()}
                        showTutorialHighlights={this.state.showTutorialHighlightMenuBar}
                        highlightTutorialElement={this.state.highlightMenuBarElement}
                        ref={this.menubarRef}
                    />
                </div>
                <div className="main">
                    <div className="left-panel">
                        <AddPanel
                            addElementToScene={(newElement,hasToBeLoaded,options) => this.handleAddElementToScene(newElement,hasToBeLoaded,options)} //function to add an element
                            uploadMediaToEditor={(mediaType)=>this.addCustomContentToEditor(mediaType)}
                            createNavMesh={(playerHeight,playerWidth,maxClimb,maxSlope)=>this.createNavMesh(playerHeight,playerWidth,maxClimb,maxSlope)}
                            createTask={()=>this.createTask()}
                            createInteractionPattern={()=>this.createInteractionPattern()}
                            userImages={this.state.userImages} //uploaded images
                            userModels={this.state.userModels} //uploaded models
                            userPdfs={this.state.userPdfs} //uploaded pdfs
                            userVideos={this.state.userVideos} //uploaded videos
                            showTutorialHighlights={this.state.showTutorialHighlightAddPanel}
                            highlightTutorialAddElement={this.state.highlightAddPanelElement}
                        />
                    </div>
                    <div className="middle-panel">
                        <Viewport
                            ref={this.viewportRef}
                            scene={this.state.scene} // list which all entities in the Scene
                            taskList={this.state.taskList}
                            selected={this.state.selected} // current selected Element
                            showHighlightTutorial={this.state.showTutorialHighlightViewport}
                            highlightTutorialButton={this.state.highlightViewportButton}
                            entityIsPutInTutorialArea={(entity)=>this.entityIsPutInTutorialArea(entity)}
                            onSelection={(entity)=>this.handleSelectionOfEntity(entity)} //function which handles a selection in the viewport
                            onHover={(entity)=>this.handleMouseIsOnEntity(entity)} //function which handles a selection in the viewport
                            onDeselection={()=>this.handleSelectionOfEntity(null)} // function which handles deselection in the viewport
                            onTransformationOfEntity={(mode,values)=>this.handleTransformationInViewport(mode,values)} // function which handles the transformation, caused by the transformationControl
                        />
                        <DetailsPanel
                            taskList={this.state.taskList}
                            selectedElement={this.state.selected} //current selected Element
                            customTextures={this.state.userTextures}
                            showHighlightTutorial={this.state.showTutorialHighlightDetailsPanel}
                            highlightTutorialElement={this.state.highlightDetailsPanelElement}
                            onChangeValue={(element,name,value,type)=>this.handleChangeInDetailsPanel(element,name,value,type)} // function which handles changes done by the user
                        />
                    </div>
                    <div className="right-panel">
                        <Scenegraph
                            scene={this.state.scene}
                            taskList={this.state.taskList}
                            selected={this.state.selected}
                            onClickRemoveEntity={(removedObject) => this.removeEntity(removedObject)}
                            onClickCopyEntity={(toCopyObject) => this.copyElementToScene(toCopyObject)}
                            onClickRemoveInteraction={(removedInteraction, containingEntity) => this.removeInteraction(removedInteraction,containingEntity,this.state.taskList)}
                            onClickCopyTask={(toCopyTask) => this.copyTask(toCopyTask)}
                            onClickRemoveTask={(removedTask) => this.removeTask(removedTask,this.state.taskList)}
                            onClickRemoveActivity={(removedActivity, containingTask) => this.removeActivityFromTaskList(removedActivity,containingTask,false,this.state.taskList)}
                            onClickCopyActivity={(toCopyActivity,task) => this.copyActivity(toCopyActivity,task)}
                            onClickSceneElement={(selectedElement) => this.handleSelectionOfEntity(selectedElement)}
                            onClickGoTo={(element)=>this.selectAndGotoElement(element)}
                            onEditTask={(task)=>this.editTask(task)}
                            onEditInteraction={(interaction,source)=>this.editComplexInteraction(interaction,source)}
                            showHighlightTutorial={this.state.showTutorialHighlightScenegraph}
                            highlightTutorialElement={this.state.highlightScenegraphElement}
                            highlightTutorialElementMode={this.state.highlightScenegraphElementMode}
                            ref={this.scenegraphRef}
                        />
                        <InteractionPanel
                            scene={this.state.scene}
                            selectedElement={this.state.selected}
                            onAddInteraction={(name,source,target,event,module,moduleOptions,effect,values)=>this.handleAddInteractionInInteractionPanel(name, source,target,event,module,moduleOptions,effect,values)}
                            createComplexInteraction={(source,event,target,effect,values,module,modulOptions)=>this.createComplexInteraction(source,event,target,effect,values,module,modulOptions)}
                            showHighlightTutorial={this.state.showTutorialHighlightInteractionPanel}
                            highlightTutorialInteractionElement={this.state.highlightInteractionPanelElement}
                            ref={this.interactionPanelRef}
                        />
                    </div>
                </div>
                <DialogManager
                    ref={this.dialogManagerRef}
                    uploadMedia={(file,type)=>this.uploadMedia(file,type)}
                    newProject={()=>this.newProject()}
                    saveProject={()=>this.saveProject()}
                    openProject={(name,scene,taskList,userModelList,userPdfList,userImageList,userTextureList,userVideoList,isTutorial)=>this.finishOpenProject(name,scene,taskList,userModelList,userPdfList,userImageList,userTextureList,userVideoList,isTutorial)}
                    emptyProject={(name)=>this.createEmptyProject(name)}
                    addEntityToScene={(entity,customEntry,hasToBeLoaded,options)=>this.addCustomElementToScene(entity,customEntry,hasToBeLoaded,options)}
                    addTextureToEntity={(texture,entity,hasToBeLoaded,options)=>this.addTextureToEntity(texture,entity,hasToBeLoaded,options)}
                    saveTask={(task,deletedActivites)=>this.saveTask(task,deletedActivites)}
                    saveInteraction={(interaction,source)=>this.saveConditionInteraction(interaction,source)}
                    saveInteractionPattern={(result)=>this.saveInteractionPattern(result)}
                    tasks={this.state.taskList}
                    scene={this.state.scene}
                />
                <TutorialPanel
                    stepIsSolved={this.state.tutorialStepIsSolved}
                    setTutorialStep={(step)=>this.setTutorialStep(step)}
                    exitTutorial={(goBack)=>this.exitTutorial(goBack)}
                    showTutorial={this.state.showTutorialPanel}
                    ref={this.tutorialPanelRef}
                />
            </div>
        );
    }
}