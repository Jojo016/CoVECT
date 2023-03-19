import React from "react";
import ReactModal from "react-modal";
import XMLParser from "react-xml-parser";
import Camera from "../data/Camera";
import Entity from "../data/Entity";
import Interaction from "../data/Interaction/Interaction";
import Texture from "../data/Texture";
import Box from "../data/Geometry/Box";
import Cylinder from "../data/Geometry/Cylinder";
import Image from "../data/Media/Image";
import Model from "../data/Model/Model";
import ObjModel from "../data/Model/ObjModel";
import Plane from "../data/Geometry/Plane";
import PointLight from "../data/Light/PointLight";
import Sphere from "../data/Geometry/Sphere";
import SpotLight from "../data/Light/SpotLight";
import Tetrahedron from "../data/Geometry/Tetrahedron";
import axios from "axios";
import "../styles/DialogManager.css"
import Text from "../data/Text";
import NavMesh from "../data/Model/NavMesh";
import Pdf from "../data/Media/Pdf";
import Video from "../data/Media/Video";
import Light from "../data/Light/Light";
import DirectionalLight from "../data/Light/DirectionalLight";
import Task from "../data/Task/Task";
import Activity from "../data/Task/Activity";
import TaskBar from "../data/Task/TaskBar";
import CounterElement from "../data/Interaction/CounterElement";
import ButtonElement from "../data/Interaction/ButtonElement";
import PressurePlate from "../data/Interaction/PressurePlate";
import InteractionWizard from "./dialogs/InteractionWizard";
import ConditionInteraction from "../data/Interaction/ConditionInteraction";
import Condition from "../data/Interaction/Condition";
import InteractionPatternDialog from "./dialogs/InteractionPatternDialog";
import ModelUpload from "./dialogs/ModelUpload";


export default class DialogManager extends React.Component {
    constructor(props) {
        super(props);
        this.interactionWizardRef=React.createRef(); // reference to configure the wizard
        this.activtyTypes=Activity.getActivityTypes();
        this.activityTypesSelectOptions=this.activtyTypes.map((type,move)=>{
            return (
                <option key={"typeSelection"+move} value={type.id}>
                    {type.printName}
                </option>
            )
        })
        let scenarios=[
            {name:"Empty Project", id:"empty", image:"scenario/empty/empty.png",description:"An empty world", xml:""},
            {name:"Lounge", id:"lounge", image:"/scenario/lounge/lounge.png", description:"A lounge with a presentation corner, a stage and a small kitchen", xml:"/scenario/lounge/lounge.xml"},
        ]
        this.scenarioOptions=scenarios.map((scenario,move)=>{
            return (
                <option key={"scenario"+move} value={scenario.id}>
                    {scenario.name}
                </option>
            )
        })

        this.openDialog=this.openDialog.bind(this)
        this.closeDialog=this.closeDialog.bind(this)
        this.state = {
            showUnsavedModal: false, //modal shown when the project contains unsaved elements
            unsavedModalOpenedBy: null, //defines what opened the unsaved modal, to define the next step after the unsaved modal
            showLoadingModal: false, // modal shown when the editor loads something
            showOpenModal: false, // modal shown to open a saved project
            showUploadMediaModal: false, //modal shown to upload media
            showActivityModal: false, //modal shown to create activity for a task
            showTaskModal: false, //modal shown to create tasks
            showNewModal: false, //modal shown to create a project
            showStartModal: false, //modal shown at the first login
            showErrorModal: false, //modal shown to show errors
            showInteractionModal: false, //modal to create complex interactions
            showInteractionPatternModal:false, //modal to create interactivity on a higher abstraction
            showModelUploadWizard: false, // wizard to upload models

            openModalAtStart:true, //defines the cancel button in the open dialog
            typeOfUploadedMedia: "media", //defines the type of Uploaded media to adjust the upload modal
            filesToUpload: [], //saves a list of texture files which will be uploaded
            entityName:"", //saves the filename of the model file
            targetOfMedia:null, //defines the target for a uploaded texture
            textureApplyToGeometry:"", //defines the materialname of the texture
            customElementName: "", //saves a print name for the uploaded element
            isFileValid:false,  //saves if the files are valid on clientside
            xmlToLoad: null, //saves a xml file which will be loaded

            showError:false, //defines if an error is shown
            errorMessage:"", //shows an error directly in the dialog
            showErrorActivity:false, //defines if an error is shown. Especially for activity, because it is a sub modal of task
            errorMessageActivity:"", //shows an error directly in the dialog. Especially for activity, because it is a sub modal of task
            showWarning:false, //defines if an warning is shown
            warningMessage:"", //shows an warning directly in the dialog
            showWarningActivity:false, //defines if an warning is shown. Especially for activity, because it is a sub modal of task
            warningMessageActivity:"", //shows an warning directly in the dialog. Especially for activity, because it is a sub modal of task

            taskDescription:"",
            taskName:"",
            taskModalMode:"create", //defines the mode of the modal create or edit
            activityList:[], //all activites of the Task
            activitySelectionsData:[],//saves all
            selectedActivity:null, //saves the selected Activity in the activity list
            saveToTask:null, // apply all changes to this Task
            temporaryActivityList:[], //saves the changed Data of all activites
            deletedActivities:[], //save the IDs of the deleted activites

            activityDetails:{},
            selectedActivityType:null,
            activityIsValid:false,
            activityDescription:"",
            activityName:"",
            activityModalMode:"create", //defines the mode of the modal create or edit

            errorModalMessage:"no error", //this message is shown in the error dialog

            projectName:"", // name of the project
            selectedScenario:"", // saves the selected scenario
            scenarioImage:"", // saves the link to the preview
            scenarioDescription:"", // saves the description
            newModalAtStart:true, // defines the cancel button in new
            scenarios:scenarios, // all scenarios to choose
            xmlFromScenario:"",

            cameraPosition:{} // used in the patternDialog
        };
    }

    closeAllDialogs() {
        this.setState({
            showUnsavedModal: false, //modal shown when the project contains unsaved elements
            unsavedModalOpenedBy: null, //defines what opened the unsaved modal, to define the next step after the unsaved modal
            showLoadingModal: false, // modal shown when the editor loads something
            showOpenModal: false, // modal shown to open a saved project
            showUploadMediaModal: false, //modal shown to upload media
            showActivityModal: false, //modal shown to create activity for a task
            showTaskModal: false, //modal shown to create tasks
            showNewModal: false, //modal shown to create a project
            showStartModal: false, //modal shown at the first login
            showErrorModal: false, //modal shown to show errors
            showInteractionModal: false, //modal to create complex interactions
            showInteractionPatternModal:false, //modal to create interactivity on a higher abstraction
        })
    }

    openDialog(dialogName, parameters) {
        if(parameters){
            if(!(parameters.subModal)){
                this.closeAllDialogs();
            }
        }
        else{
            this.closeAllDialogs();
        }
        switch (dialogName) {
            case "new":
                let firstEntry= this.state.scenarios[0]
                let atStart= (parameters.start)?parameters.start:false;
                this.setState({
                    showNewModal: true,
                    projectName:"VR-World",
                    selectedScenario:firstEntry.id,
                    scenarioImage:firstEntry.image,
                    scenarioDescription:firstEntry.description,
                    newModalAtStart:atStart,
                });
                break;
            case "error":
                this.setState({
                    showErrorModal: true,
                    errorModalMessage: parameters.message,
                });
                break;
            case "start":
                this.setState({
                    showStartModal: true,
                });
                break;
            case "loading":
                this.setState({
                    showLoadingModal: true,
                });
                break;
            case "interaction-pattern":
                this.setState({
                    showInteractionPatternModal:true, //modal to create interactivity on a higher abstraction
                    cameraPosition:parameters.camera,
                });
                break;
            case"interaction":
                if(parameters.mode==="edit"){
                    this.interactionWizardRef.current.configureBeforeOpeningWithInteraction(parameters.mode,parameters.interaction,parameters.source,parameters.camera)
                }
                else{
                    this.interactionWizardRef.current.configureBeforeOpening(parameters.mode,parameters.source,parameters.event,parameters.target,parameters.effect,parameters.values,parameters.module, parameters.moduloptions,parameters.camera)
                }
                this.setState({
                    showInteractionModal: true,
                    showError:false, //reset error
                    errorMessage:"", //reset error message
                    showWarning:false, //reset warning
                    warningMessage:"", //reset warning message
                });
                break;
            case "task":
                let activitySelections=[]
                if(parameters.scene){
                    activitySelections=this.setupSceneSelections(parameters.scene);
                }
                let activityList=parameters.task.getActivities().slice()
                let temporaryActivityList=[]
                if(parameters.mode==="edit"){ //
                    for(let index=0;index<activityList.length;index++) {
                        let saveObject = {}
                        for (const [key, value] of Object.entries(activityList[index])) {
                            if (key === "parameters") {
                                let parameters = {}
                                for (const [keyParamter, valueParameter] of Object.entries(value)) {
                                    parameters[keyParamter] = valueParameter
                                }
                                saveObject[key] = parameters
                            } else {
                                saveObject[key] = value
                            }
                        }
                        temporaryActivityList = temporaryActivityList.concat(saveObject);
                    }
                }
                this.setState({
                    showTaskModal: true,
                    taskModalMode:parameters.mode,
                    selectedActivity:null,
                    activityList:activityList,
                    temporaryActivityList:temporaryActivityList,
                    deletedActivities:[],
                    selectedActivityType:null,
                    activitySelectionsData:activitySelections,
                    saveToTask:parameters.task,
                    taskName:parameters.task.getName(),
                    taskDescription:parameters.task.getDescription(),
                    showError:false, //reset error
                    errorMessage:"", //reset error message
                    showWarning:false, //reset warning
                    warningMessage:"", //reset warning message
                });
                break;
            case "activity":
                let activityDetails={}
                let errorText=this.setupActivityDetails(parameters.activityData,parameters.saveObject.type,activityDetails,parameters.saveObject.parameters); //saves the temporary activity details before saving in selectedActivity
                if(errorText){ //activity details have an error
                    this.setState({
                        activityModalMode:parameters.mode,
                        showActivityModal: true,
                        selectedActivity:parameters.activityData, //the activity which will be edited
                        activityDescription:parameters.saveObject.description,
                        activityName:parameters.saveObject.name,
                        selectedActivityType:parameters.saveObject.type, //the selected Type
                        activityDetails:activityDetails,
                        saveToTemporayActivity:parameters.saveObject,
                        showErrorActivity:true,
                        errorMessageActivity:errorText,
                        activityIsValid:false,
                        showWarningActivity:false, //reset warning
                        warningMessageActivity:"", //reset warning message
                    });
                }
                else{
                    this.setState({
                        activityModalMode:parameters.mode,
                        showActivityModal: true,
                        selectedActivity:parameters.activityData, //the activity which will be edited
                        activityDescription:parameters.saveObject.description,
                        activityName:parameters.saveObject.name,
                        selectedActivityType:parameters.saveObject.type, //the selected Type
                        activityDetails:activityDetails,
                        saveToTemporayActivity:parameters.saveObject,
                        activityIsValid:true,
                        showErrorActivity:false, //reset error
                        errorMessageActivity:"", //reset error message
                        showWarningActivity:false, //reset warning
                        warningMessageActivity:"", //reset warning message
                    });
                }
                break;
            case "open":
                let atStartOpen= (parameters.start)?parameters.start:false;
                this.setState({
                    xmlToLoad: null, //reset previous opened xml file
                    showOpenModal: true,
                    isFileValid:false,//reset validation
                    showError:false, //reset error
                    errorMessage:"", //reset error message
                    showWarning:false, //reset warning
                    warningMessage:"", //reset warning message
                    openModalAtStart:atStartOpen,
                });
                break;
            case "unsaved":
                this.setState({
                    showUnsavedModal: true, //opens a modal which handles the unsaved project
                    unsavedModalOpenedBy: parameters.type, //defines the origin which opened the unsaved modal
                });
                break;
            case "uploadMedia":
                this.setState({
                    filesToUpload: [], //reset previous uploaded media
                    showUploadMediaModal: true, //shows the modal to perform the upload
                    typeOfUploadedMedia: parameters.type, //sets the kind of media
                    targetOfMedia:parameters.target, //defines the target for a uploaded texture
                    textureApplyToGeometry:parameters.materialName, //defines the materialname of the texture
                    previewFileName:[], //reset preview list
                    entityName:"", //reset entity name
                    isFileValid:false,  //reset validation
                    customElementName: "", //reset custom name
                    showError:false, //reset error
                    errorMessage:"", //reset error message
                    showWarning:false, //reset warning
                    warningMessage:"", //reset warning message
                })
                break;
            case "model-upload-wizard":
                this.setState({
                    showModelUploadWizard: true,
                });
                break;
            default:
                console.log("could not find dialog")
        }
    }

    handleSaveInUnsavedModal(mode) {
        this.props.saveProject(); //save the project
        this.handleClosingUnsavedModal(mode); //close the unsaved modal
    }

    handleClosingUnsavedModal(mode) {
        switch (mode) {
            case "open":
                this.closeDialog("unsaved")
                this.openDialog("open",{start:false})
                break;
            case "new":
                this.props.newProject()
                this.closeDialog("unsaved")
                break;
            default:
        }
    }

    extractChildrenAttributesFromXMLEntity(childrenList,ignoreTagList) {
        let attributes = {}
        for (let indexAttributes = 0; indexAttributes < childrenList.length; indexAttributes++) { // search for attributes which are children
            if(!ignoreTagList.includes(childrenList[indexAttributes].name)){ // ignore specific tags
                if(childrenList[indexAttributes].attributes.list==="true"){ // is a list
                    let valueList=[]
                    for (let indexListValues=0;indexListValues<childrenList[indexAttributes].children.length;indexListValues++){ //save all entires in a list
                        valueList=valueList.concat(childrenList[indexAttributes].children[indexListValues].value)
                    }
                    attributes[childrenList[indexAttributes].name]=valueList;
                }
                else{
                    if(childrenList[indexAttributes].attributes.object==="true"){ // is a list
                        let valueObject={} //empty object
                        for (let indexListValues=0;indexListValues<childrenList[indexAttributes].children.length;indexListValues++){ //save all entires in a list
                            valueObject[childrenList[indexAttributes].children[indexListValues].name]=childrenList[indexAttributes].children[indexListValues].value //add key and value to object
                        }
                        attributes[childrenList[indexAttributes].name]= valueObject;
                    }
                    else{//simple value
                        attributes[childrenList[indexAttributes].name]= childrenList[indexAttributes].value;
                    }
                }
            }
        }
        return attributes;
    }

    addToLinkTargetList(toLink, list){
        let hasEntry = false;
        for (let indexLinkTargetList = 0; indexLinkTargetList < list.length; indexLinkTargetList++) { //search entry for the target name
            if (list[indexLinkTargetList].targetName === toLink.target) { //Entry is found
                //add Interaction in the to-Link list
                list[indexLinkTargetList].interactionsToLink.push(toLink);
                hasEntry = true;
                break;
            }
        }
        if (!hasEntry) { //The target has no entry in the link list
            //adds an entry in the LinkTargetList
            list.push({
                targetName: toLink.target,
                interactionsToLink: [toLink]
            })
        }
        return list;
    }

    OpenProject(xmlText,givenProjectName,isTutorial){
        let xmlData = new XMLParser().parseFromString(xmlText); //parse read xml file to a xml object
        let projectName;
        if(givenProjectName) {
            projectName=givenProjectName
        }
        else{//extract project name
            projectName=xmlData.attributes.name;
        }
        let scene = [];
        let loadChain = [];
        let linkTargetToInteraction = []; //the interactions have to be linked because in the save file only saves the name of the target not the object itself
        let linkTaskToEntity = []; //the tasks have to be linked because in the save file only saves the name of the task not the object itself
        let linkActivityToCondition = []; //the activities have to be linked because in the save file only saves the name of the task not the object itself
        let linkTaskToCondition = []; //the tasks have to be linked because in the save file only saves the name of the task not the object itself

        let hasTextures=false;

        let userList=xmlData.children[1]
        let userModelList=[]
        let userPdfList=[]
        let userImageList=[]
        let userTextureList=[]
        let userVideoList=[]
        for (let index = 0; index < userList.children.length; index++) {
            switch(userList.children[index].attributes.type){
                case "model":
                    let complexAttributesModel=this.extractChildrenAttributesFromXMLEntity(userList.children[index].children,[]);
                    let customEntry={
                        name:userList.children[index].attributes.name,
                        url:userList.children[index].attributes.url,
                        modelType:userList.children[index].attributes.modelType,
                        materialUrl:userList.children[index].attributes.materialUrl,
                        loadOptions:complexAttributesModel.load,
                    }
                    userModelList=userModelList.concat(customEntry);
                    break;
                case "pdf":
                    let complexAttributesPdf=this.extractChildrenAttributesFromXMLEntity(userList.children[index].children,[]);
                    let customEntryPdf={
                        name:userList.children[index].attributes.name,
                        url:userList.children[index].attributes.url,
                        imageUrls:complexAttributesPdf.imageurl,
                    }
                    userPdfList=userPdfList.concat(customEntryPdf);
                    break;
                case "image":
                    let customEntryImg={
                        name:userList.children[index].attributes.name,
                        url:userList.children[index].attributes.url,
                    }
                    userImageList=userImageList.concat(customEntryImg);
                    break;
                case "texture":
                    let customEntryTex=new Texture(userList.children[index].attributes.name,userList.children[index].attributes.url,userList.children[index].attributes.materialName,userList.children[index].userUploaded==="true")
                    userTextureList=userTextureList.concat(customEntryTex);
                    loadChain=loadChain.concat(customEntryTex)
                    break;
                case "video":
                    let customEntryVideo={
                        name:userList.children[index].attributes.name,
                        url:userList.children[index].attributes.url,
                    }
                    userVideoList=userVideoList.concat(customEntryVideo);
                    break;
                default:
            }
        }
        let sceneList=xmlData.children[2];
        for (let index = 0; index < sceneList.children.length; index++) { //go through the childs from the Scene
            let loadedFromXMLInteractions = [];
            let loadedFromXMLTextures = [];
            let entity = new Entity();
            let childrenList = sceneList.children[index].children //defined to shorten Code
            if (childrenList.length > 0) {//Element contains textures or interactions
                //search for textures and interactions
                let indexOfTexturesChild = -1; //default value for failed search
                let indexOfInteractionsChild = -1; // default value for failed search
                for (let indexChildren = 0; indexChildren < childrenList.length; indexChildren++) {
                    if (childrenList[indexChildren].name === "Textures") { //Textures found
                        indexOfTexturesChild = indexChildren; //save index
                    }
                    if (childrenList[indexChildren].name === "Interactions") { // Interactions found
                        indexOfInteractionsChild = indexChildren; //save index
                    }
                }
                if (indexOfInteractionsChild > -1) { //Entity contains Interactions
                    let interactionList = childrenList[indexOfInteractionsChild].children //defined to shorten Code
                    for (let indexInteractionList = 0; indexInteractionList < interactionList.length; indexInteractionList++) {
                        let interaction;
                        switch (interactionList[indexInteractionList].name) { //decide which interaction is loaded
                            //this switch is for future added Interaction kinds
                            case"ConditionInteraction":
                                interaction= new ConditionInteraction();
                                break;
                            default:
                                interaction = new Interaction();
                                break;
                        }
                        if (interaction) {
                            interaction.fillFromAttributes(interactionList[indexInteractionList].attributes) // fills the interaction
                            let complexAttributes=this.extractChildrenAttributesFromXMLEntity(interactionList[indexInteractionList].children,["conditions"])
                            interaction.fillFromAttributes(complexAttributes) // fills the interaction

                            if(interaction instanceof ConditionInteraction){
                                let conditionListData=[];
                                //search saved conditions
                                for (let  indexChildren = 0;indexChildren < interactionList[indexInteractionList].children.length; indexChildren++){
                                    if(interactionList[indexInteractionList].children[indexChildren].name==="conditions"){

                                        conditionListData=interactionList[indexInteractionList].children[indexChildren].children;
                                        break;
                                    }
                                }
                                //create conditions
                                let conditions=[]
                                for(let indexCondition=0; indexCondition<conditionListData.length;indexCondition++){
                                    let condition=new Condition();
                                    condition.fillFromAttributes(conditionListData[indexCondition].attributes) // fills the interaction
                                    let complexAttributes=this.extractChildrenAttributesFromXMLEntity(conditionListData[indexCondition].children,[])
                                    condition.fillFromAttributes(complexAttributes) // fills the interaction
                                    switch (condition.getType()){
                                        case "activityCompleted":
                                            linkActivityToCondition.push({
                                                activity:condition.target,
                                                linkTo: condition
                                            })
                                            break;
                                        case "taskCompleted":
                                            linkTaskToCondition.push({
                                                task:condition.target,
                                                linkTo: condition
                                            })
                                            break;
                                        default:
                                        this.addToLinkTargetList(condition,linkTargetToInteraction)
                                    }


                                    conditions.push(condition);
                                }
                                interaction.setAttribute("conditions",conditions);

                            }
                            this.addToLinkTargetList(interaction,linkTargetToInteraction)
                            loadedFromXMLInteractions = loadedFromXMLInteractions.concat(interaction) // adds the interaction to the interaction list
                        }

                    }
                }
                if (indexOfTexturesChild > -1) { //Entity contains Textures
                    let textureList = childrenList[indexOfTexturesChild].children //defined to shorten Code
                    for (let indexTextureList = 0; indexTextureList < textureList.length; indexTextureList++) {
                        let texture;
                        hasTextures=true;
                        switch (textureList[indexTextureList].name) { //decide which texture is loaded
                            //this switch is for future added texture kinds
                            default:
                                texture = new Texture();
                                break;
                        }
                        if (texture) {
                            texture.fillFromAttributes(textureList[indexTextureList].attributes) // fills the interaction
                            loadedFromXMLTextures = loadedFromXMLTextures.concat(texture) // adds the interaction to the interaction list
                        }

                    }
                }
            }
            switch (sceneList.children[index].name) {
                case "Box":
                    entity = new Box();
                    if (hasTextures){
                        loadChain = loadChain.concat(entity)
                    }
                    break;
                case "Camera":
                    entity = new Camera();
                    loadChain = loadChain.concat(entity)
                    break;
                case "CounterElement":
                    entity = new CounterElement();
                    loadChain = loadChain.concat(entity)
                    break;
                case "ButtonElement":
                    entity = new ButtonElement();
                    break;
                case "Cylinder":
                    entity = new Cylinder();
                    if (hasTextures){
                        loadChain = loadChain.concat(entity)
                    }
                    break;
                case "Image":
                    entity = new Image();
                    loadChain = loadChain.concat(entity)
                    break;
                case "Model":
                    entity = new Model();
                    loadChain = loadChain.concat(entity)
                    break;
                case "NavMesh":
                    entity = new NavMesh();
                    loadChain = loadChain.concat(entity)
                    break;
                case "ObjModel":
                    entity = new ObjModel();
                    loadChain = loadChain.concat(entity)
                    break;
                case "Pdf":
                    entity = new Pdf();
                    loadChain = loadChain.concat(entity)
                    break;
                case "Plane":
                    entity = new Plane();
                    if (hasTextures){
                        loadChain = loadChain.concat(entity)
                    }
                    break;
                case "PressurePlate":
                    entity = new PressurePlate();
                    if (hasTextures){
                        loadChain = loadChain.concat(entity)
                    }
                    break;
                case "PointLight":
                    entity = new PointLight();
                    break;
                case "Sphere":
                    entity = new Sphere();
                    if (hasTextures){
                        loadChain = loadChain.concat(entity)
                    }
                    break;
                case "SpotLight":
                    entity = new SpotLight();
                    break;
                case "Tetrahedron":
                    entity = new Tetrahedron();
                    if (hasTextures){
                        loadChain = loadChain.concat(entity)
                    }
                    break;
                case "TaskBar":
                    entity = new TaskBar();
                    loadChain = loadChain.concat(entity)
                    break;
                case "Text":
                    entity = new Text();
                    loadChain = loadChain.concat(entity)
                    break;
                case "Video":
                    entity = new Video();
                    loadChain = loadChain.concat(entity)
                    break;
                default:
                    entity= new Entity()
            }
            entity.fillFromAttributes(sceneList.children[index].attributes);
            if(sceneList.children[index].attributes.task){
                linkTaskToEntity = linkTaskToEntity.concat({
                    task:sceneList.children[index].attributes.task,
                    linkTo: entity
                })
                entity.setAttribute("task",null); // removes the ID String from the fillAttribute call
            }
            let complexAttributesEntity=this.extractChildrenAttributesFromXMLEntity(childrenList,["Textures","Interactions"])
            entity.fillFromAttributes(complexAttributesEntity) // fills the interaction
            // for (let indexChildList = 0; indexChildList < childrenList.length; indexChildList++) { // search for attributes which are children
            //     if (childrenList[indexChildList].name !== "Interactions" && childrenList[indexChildList].name !== "Textures") { //ignore the textures and interactions entry
            //         if(childrenList[indexChildList].attributes.list==="true"){
            //             let valueList=[]
            //             for (let indexListAttribute=0;indexListAttribute<childrenList[indexChildList].children.length;indexListAttribute++){
            //                 valueList=valueList.concat(childrenList[indexChildList].children[indexListAttribute].value)
            //             }
            //             entity.setAttribute(childrenList[indexChildList].name, valueList);
            //         }
            //         else{
            //             entity.setAttribute(childrenList[indexChildList].name, childrenList[indexChildList].value);
            //         }
            //     }
            // }
            entity.setAttribute("interactions", loadedFromXMLInteractions);
            entity.setAttribute("textures", loadedFromXMLTextures);
            scene = scene.concat(entity);
        }

        let taskListXml=xmlData.children[3];
        let taskList=[]
        for (let index = 0; index < taskListXml.children.length; index++) { //go through the childs from the Scene
            let taskChildrenList = taskListXml.children[index].children //defined to shorten Code
            let task=null
            let activityList=[]
            if (taskChildrenList.length > 0) {//Element contains textures or interactions
                //search for textures and interactions
                let indexOfActivityChild = -1; // default value for failed search
                for (let indexChildren = 0; indexChildren < taskChildrenList.length; indexChildren++) {
                    if (taskChildrenList[indexChildren].name === "Activities") { //Textures found
                        indexOfActivityChild = indexChildren; //save index
                    }
                }
                if(indexOfActivityChild>=0){ //activities found
                    let activityListXml=taskChildrenList[indexOfActivityChild].children
                    for(let activityIndex=0; activityIndex<activityListXml.length;activityIndex++){
                        let activity=null;
                        switch (activityListXml[activityIndex].name) {
                            case "Activity":
                            default:
                                activity = new Activity();
                                break;
                        }
                        activity.fillFromAttributes(activityListXml[activityIndex].attributes);
                        let complexAttributesActivity=this.extractChildrenAttributesFromXMLEntity(activityListXml[activityIndex].children,["Activities"])
                        activity.fillFromAttributes(complexAttributesActivity) // fills the interaction
                        activityList=activityList.concat(activity)
                    }

                }
            }
            switch (taskListXml.children[index].name) {
                case "Task":
                default:
                    task = new Task();
                    break;
            }
            task.fillFromAttributes(taskListXml.children[index].attributes);
            let complexAttributesTask=this.extractChildrenAttributesFromXMLEntity(taskChildrenList,["Activities"])
            task.fillFromAttributes(complexAttributesTask) // fills the interaction
            task.setAttribute("activities", activityList);
            taskList = taskList.concat(task);
        }

        let counterList=xmlData.children[0]
        for (let index = 0; index < counterList.children.length; index++) {
            switch(counterList.children[index].name){
                case "Activity":
                    Activity.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Box":
                    Box.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "ButtonElement":
                    ButtonElement.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Condition":
                    Condition.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "ConditionInteraction":
                    ConditionInteraction.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "CounterElement":
                    CounterElement.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Cylinder":
                    Cylinder.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "DirectionalLight":
                    DirectionalLight.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Entity":
                    Entity.counter=parseFloat(counterList.children[index].value);
                    break;
                case "Image":
                    Image.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Interaction":
                    Interaction.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Light":
                    Light.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Model":
                    Model.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "NavMesh":
                    NavMesh.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Pdf":
                    Pdf.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Plane":
                    Plane.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "PointLight":
                    PointLight.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "PressurePlate":
                    PressurePlate.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Sphere":
                    Sphere.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "SpotLight":
                    SpotLight.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Tetrahedron":
                    Tetrahedron.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Task":
                    Task.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "TaskBar":
                    TaskBar.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Text":
                    Text.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Texture":
                    Texture.counterChild=parseFloat(counterList.children[index].value);
                    break;
                case "Video":
                    Video.counterChild=parseFloat(counterList.children[index].value);
                    break;
                default:
            }
        }


        //The Scene list is completed
        // link the targets in all Interactions

        //link taskbars
        for (let indexTaskList = 0; indexTaskList < taskList.length; indexTaskList++) { // go through all entities
            for (let indexLinkList = 0; indexLinkList < linkTaskToEntity.length; indexLinkList++) { //check if this entity has to be linked
                if (taskList[indexTaskList].getID() === linkTaskToEntity[indexLinkList].task) { // found target to link
                    linkTaskToEntity[indexLinkList].linkTo.setAttribute("task",taskList[indexTaskList]);
                }
            }
        }

        //link conditions
        for (let indexTaskList = 0; indexTaskList < taskList.length; indexTaskList++) { // go through all tasks
            //link tasks
            for (let indexLinkList = 0; indexLinkList < linkTaskToCondition.length; indexLinkList++) { //check if this task has to be linked to a condition
                if (taskList[indexTaskList].getID() === linkTaskToCondition[indexLinkList].task) { // found target to link
                    linkTaskToCondition[indexLinkList].linkTo.setAttribute("target", taskList[indexTaskList]);
                }
            }
            //link activities
            let activityList=taskList[indexTaskList].getActivities();
            for (let indexActivityList = 0; indexActivityList < activityList.length; indexActivityList++) { // go through all activities
                for (let indexLinkList = 0; indexLinkList < linkActivityToCondition.length; indexLinkList++) { //check if this activity has to be linked
                    if (activityList[indexActivityList].getID() === linkActivityToCondition[indexLinkList].activity) { // found target to link
                        linkActivityToCondition[indexLinkList].linkTo.setAttribute("target", activityList[indexActivityList]);
                    }
                }
            }
        }

        //link interactions and conditions of entities
        for (let indexSceneList = 0; indexSceneList < scene.length; indexSceneList++) { // go through all entities
            for (let indexLinkList = 0; indexLinkList < linkTargetToInteraction.length; indexLinkList++) { //check if this entity has to be linked
                if (scene[indexSceneList].getID() === linkTargetToInteraction[indexLinkList].targetName) { // found target to link
                    let interactionList = linkTargetToInteraction[indexLinkList].interactionsToLink; //shorten code
                    for (let indexInteraction = 0; indexInteraction < interactionList.length; indexInteraction++) { //link all interaction to the target
                        interactionList[indexInteraction].setAttribute("target", scene[indexSceneList])
                    }
                    linkTargetToInteraction.splice(indexLinkList, 1); //remove it from the list because it was already linked
                    break;
                }
            }
            if(linkTargetToInteraction.length<1){
                break;
            }
        }
        //load all models
        if (loadChain.length > 0) { // models have to be loaded
            let loadChainWithCallback = function loadModels(modelList, callbackModels) {
                if (modelList.length > 0) { //list contains models to load
                    const loadOptions={autoscale:modelList[0].isAutoscaled}
                    modelList[0].loadEntity(() => loadModels(modelList.slice(1), callbackModels),loadOptions) //load the model, recursive callback
                } else {
                    callbackModels();
                }

            }
            loadChainWithCallback(loadChain, () => {
                console.log("loaded Scene", scene)
                this.closeDialog("loading")
                this.props.openProject(projectName,scene,taskList,userModelList,userPdfList,userImageList,userTextureList,userVideoList,isTutorial);

            })
        } else { //no models have to be loaded and the opening is complete
            console.log("loaded Scene", scene)
            this.closeDialog("loading")
            this.props.openProject(projectName,scene,taskList,userModelList,userPdfList,userImageList,userTextureList,userVideoList,isTutorial);
        }
    }

    startTutorial(){
        let toFetch= "/tutorial/tutorialWorld.xml"
        fetch(toFetch) //get xml file from the server
            .then((response) => {
                return response.text()
            })
            .catch(function(e) {
                    console.log("error",e);
                }
            ).then((responseText) =>
            {
                if(responseText){
                    this.OpenProject(responseText,"Tutorial-World",true)
                }
            }
        );
        //close open modal and open the loading modal till the project is loaded
        this.setState({
            showStartModal: false,
            showLoadingModal: true,
        })
    }

    handleOpenProject(event) {
        event.preventDefault(); //stops the handling of the submit event
        const xmlFile = this.state.xmlToLoad;
        if(!xmlFile){
            console.log("no xml to open")
            return;
        }
        const reader = new FileReader(); //init file reader

        reader.readAsText(xmlFile);
        let self=this
        reader.onloadend = event => { // do this after reading the xml File
            const readerData = event.target.result;
            self.OpenProject(readerData);
        };
        //close open modal and open the loading modal till the project is loaded
        this.setState({
            showOpenModal: false,
            showLoadingModal: true,
        })

    }

    handleFileSelection(event, fileType){
        let files=event.target.files;
        switch (fileType){
            case"texture":
            case "image":
                if(/^image\//ig.test(files[0].type)){ //checks if the type starts with image
                    this.setState({
                        isFileValid:true,
                        filesToUpload: [files[0]],
                        entityName:files[0].name.replace(/\.[^/.]+$/, ""), //save the file name without extension
                        showError:false,
                        errorMessage:""
                    })
                }
                else{
                    this.setState({
                        isFileValid:false,
                        showError:true,
                        errorMessage:"file is not an image"
                    })
                }
                break;
            case "navigation":
                if(/\.gltf$/ig.test(files[0].name)){ //checks if the type starts with image
                    this.setState({
                        isFileValid:true,
                        filesToUpload: [files[0]],
                        entityName:files[0].name.replace(/\.[^/.]+$/, ""), //save the file name without extension
                        showError:false,
                        errorMessage:""
                    })
                }
                else{
                    this.setState({
                        isFileValid:false,
                        showError:true,
                        errorMessage:"navigation has to be a gltf file"
                    })
                }
                break;
            case "pdf":
                if(/\.pdf$/ig.test(files[0].name)){ //checks if the type starts with image
                    this.setState({
                        isFileValid:true,
                        filesToUpload: [files[0]],
                        entityName:files[0].name.replace(/\.[^/.]+$/, ""), //save the file name without extension
                        showError:false,
                        errorMessage:""
                    })
                }
                else{
                    this.setState({
                        isFileValid:false,
                        showError:true,
                        errorMessage:"file is not a pdf"
                    })
                }
                break;
            case "video":
                if(/^video\//ig.test(files[0].type)){ //checks if the type starts with image
                    this.setState({
                        isFileValid:true,
                        filesToUpload: [files[0]],
                        entityName:files[0].name.replace(/\.[^/.]+$/, ""), //save the file name without extension
                        showError:false,
                        errorMessage:""
                    })
                }
                else{
                    this.setState({
                        isFileValid:false,
                        showError:true,
                        errorMessage:"file is not an video"
                    })
                }
                break;
            case "xml":
                if(/\.xml$/ig.test(files[0].name)){
                    this.setState({
                        isFileValid:true,
                        xmlToLoad: files[0],
                        showError:false,
                        errorMessage:""
                    })
                }
                else{
                    this.setState({
                        isFileValid:false,
                        showError:true,
                        errorMessage:"file is not a xml file"
                    })
                }
                break;
            default:
                console.log("file type not supported")
        }
    }

    uploadMediaToServer(event, mediaType) {
        event.preventDefault(); //stops the handling of the submit event

        let postLink="";

        switch (mediaType){
            case "texture":
                postLink="/uploadTextures";
                document.getElementById("upload-media-submit").disabled = true;
                break;
            case "image":
                postLink="/uploadImages";
                document.getElementById("upload-media-submit").disabled = true;
                break;
            case "model":
                postLink="/uploadModels"
                document.getElementById("upload-model-submit").disabled = true;
                break;
            case "navigation":
                postLink="/uploadNavigation"
                break;
            case "pdf":
                postLink="/uploadPdfs";
                document.getElementById("upload-media-submit").disabled = true;
                break;
            case "video":
                postLink="/uploadVideos";
                document.getElementById("upload-media-submit").disabled = true;
                break;
            default: //error
                console.log("error",mediaType)
                return;
        }
        const data = new FormData()
        let fileList=this.state.filesToUpload

        if(fileList.length<1){ //error
           return;
        }

        let fileName
        if(this.state.customElementName===""){//user did not put in a name
            fileName = this.state.entityName;
        }
        else{
            fileName=this.state.customElementName
        }
        for(let index=0;index<fileList.length;index++){
            data.append(mediaType, fileList[index])
        }

        let config ={
            onUploadProgress: (progressEvent) => {console.log("upload:" +Math.round(100*progressEvent.loaded/progressEvent.total)+"%")},
            headers: {directory: fileName}
        }

        let afterSetState= ()=> {
            axios.post(postLink, data, config).then(res => { // then print response status
                if (res.statusText === "OK") {
                    switch (mediaType) {
                        case "image":
                            this.props.addEntityToScene(
                                new Image(res.headers["image-url"]), //image data
                                { //image add entry
                                    elementType: "image",
                                    addEntry: {
                                        name: fileName,
                                        url: res.headers["image-url"]
                                    }
                                },
                                true, //needs to be loaded
                                {} //load options
                            )
                            break;
                        case "texture":
                            this.props.addTextureToEntity(
                                new Texture(fileName, res.headers["texture-url"], this.state.textureApplyToGeometry), //image data
                                this.state.targetOfMedia,
                                true, //has to be loaded
                                {} // no load options
                            )
                            break;
                        case "navigation":
                            this.props.addEntityToScene(
                                new NavMesh("gltf", res.headers["navigation-url"], true), //navigation data
                                { //create no entry
                                    elementType: "navigation",
                                    addEntry: {}
                                },
                                true, // needs to be loaded
                                {} // no autoscale
                            )
                            break;
                        case "pdf":
                            let imageUrls = res.headers["image-urls"].split(", ");
                            this.props.addEntityToScene(
                                new Pdf(res.headers["pdf-url"], imageUrls), //image data
                                { //image add entry
                                    elementType: "pdf",
                                    addEntry: {
                                        name: fileName,
                                        url: res.headers["pdf-url"],
                                        imageUrls: imageUrls
                                    }
                                },
                                true, //needs to be loaded
                                {} //load options
                            )
                            break;
                        case "video":
                            this.props.addEntityToScene(
                                new Video(res.headers["video-url"]), //image data
                                { //image add entry
                                    elementType: "video",
                                    addEntry: {
                                        name: fileName,
                                        url: res.headers["video-url"]
                                    }
                                },
                                true, //needs to be loaded
                                {} //load options
                            )
                            break;
                        default:
                    }

                }
            }).catch(error => {
                console.log(error)
                this.openDialog("error", {message: error.message})
            });
        }



        this.setState({
            showUploadMediaModal: false,
            showLoadingModal: true,
        },afterSetState.bind(this))

    }

    closeDialog(dialogName) {
        switch (dialogName) {
            case "loading":
                this.setState({
                    showLoadingModal: false,
                });
                break;
            case "new":
                this.setState({
                    showNewModal: false,
                });
                break;
            case "start":
                this.setState({
                    showStartModal: false,
                });
                break;
            case "error":
                this.setState({
                    showErrorModal: false,
                });
                break;
            case "open":
                this.setState({
                    showOpenModal: false,
                });
                break;
            case "interaction":
                this.setState({
                    showInteractionModal: false,
                });
                break;
            case "interaction-pattern":
                this.setState({
                    showInteractionPatternModal: false,
                });
                break;
            case "activity":
                this.setState({
                    showActivityModal: false,
                });
                break;
            case "task":
                this.setState({
                    showTaskModal: false,
                });
                break;
            case "unsaved":
                this.setState({
                    unsavedModalOpenedBy: null,
                    showUnsavedModal: false,
                });
                break;
            case "uploadMedia":
                this.setState({
                    showUploadMediaModal: false,
                });
                break;
            case "model-upload-wizard":
                this.setState({
                    showModelUploadWizard: false,
                });
                break;
            default:
                console.log("could not find modal")
        }
    }

    saveInteraction(interaction,source){
        this.closeDialog("interaction")
        this.props.saveInteraction(interaction,source);
    }

    saveInteractionPatternResult(result){
        this.closeDialog("interaction-pattern")
        this.props.saveInteractionPattern(result);
    }

    saveTask(event){
        event.preventDefault();
        let deletedActivities=[]
        let task=this.state.saveToTask;
        task.setAttribute("name",this.state.taskName)
        task.setAttribute("description",this.state.taskDescription)
        let dataList=this.state.temporaryActivityList
        let activtyList=this.state.activityList;
        for (let index=0;index<dataList.length;index++) { //copy the temporary changes to the activites
            let activity=null;
            for(let activityIndex=0;activityIndex<activtyList.length;activityIndex++){ //search the fitting activity
                if(dataList[index].id===activtyList[activityIndex].getID()){
                    activity=activtyList[activityIndex]
                    break;
                }
            }
            if(!activity){
                activity=new Activity();
                activtyList=activtyList.concat(activity)
            }
            for (const [key, value] of Object.entries(dataList[index])) {
                if(!(key==="id")){
                    activity.setAttribute(key,value);
                }
            }
        }
        let deleteList=this.state.deletedActivities;
        for (let index=0;index<deleteList.length;index++) { //copy the temporary changes to the activites
            for(let activityIndex=0;activityIndex<activtyList.length;activityIndex++){ //search the fitting activity
                if(deleteList[index]===activtyList[activityIndex].getID()){
                    deletedActivities.push(activtyList[activityIndex]);
                    break;
                }
            }
        }
        task.setAttribute("activities",activtyList)
        this.closeDialog("task")
        this.props.saveTask(task,deletedActivities)
    }

    saveActivity(event){
        event.preventDefault();
        let activity=this.state.saveToTemporayActivity;
        activity["name"]=this.state.activityName
        activity["description"]=this.state.activityDescription
        activity["type"]=this.state.selectedActivityType
        activity["parameters"]=this.state.activityDetails
        switch(this.state.activityModalMode){
            case "create":
                //add the created Activity to the ActivityList
                this.setState({
                    temporaryActivityList:this.state.temporaryActivityList.concat(activity)
                })
                 this.setState({activityList:this.state.activityList.concat(this.state.selectedActivity)})
                break;
            case "edit":
                break;
            default:
        }
        this.closeDialog("activity")
    }

    onChangeActivityValue(name, value){
        let details=this.state.activityDetails;
        details[name]=value;
        this.setState({
            activityDetails:details
        });
    }

    createActivity(){
        let activity=new Activity()
        let saveObject={
            id:activity.getID(),
            name:activity.getName(),
            type:this.activtyTypes[0].id,
        }
        // this.setState({
        //     temporaryActivityList:this.state.temporaryActivityList.concat(saveObject)
        // })
        this.openDialog("activity",
            {
                subModal:true,
                mode:"create",
                activityData:activity,
                saveObject:saveObject,
        })
    }

    removeActivity(saveObject){
        let saveObjectList=this.state.temporaryActivityList.slice()
        let deleteID=null
        let deleteList=this.state.deletedActivities;
        for(let index=0; index<saveObjectList.length;index++){
            if(saveObject.id===saveObjectList[index].id){
                deleteID=saveObject.id
                deleteList=deleteList.concat(deleteID)
                saveObjectList.splice(index, 1);
                break;
            }
        }
        this.setState({
            temporaryActivityList:saveObjectList,
            deletedActivities:deleteList,
        })
    }

    selectActivityType(type){
        let activityDetails={}

        let errorText=this.setupActivityDetails(this.state.selectedActivity,type,activityDetails,null)
        if(errorText){ //error
            this.setState({
                selectedActivityType:type,
                activityDetails:activityDetails,
                showErrorActivity:true,
                errorMessageActivity:errorText,
                activityIsValid:false,
            })
        }
        else{
            this.setState({
                selectedActivityType:type,
                activityDetails:activityDetails,
                activityIsValid:true,
                showErrorActivity:false,
                errorMessageActivity:"",
            })
        }
    }

    //set up the Selection for Type in the Activity Dialog
    setupActivityDetails(activity,type, objectToSave,values){
        if(!objectToSave){
            return "No object given to save the start values"
        }
        const detailList = activity.getInputByType(type)
        for(let index=0; index<detailList.length;index++){
            if(values){
                objectToSave[detailList[index].name]=values[detailList[index].name]
            }
            else{
                objectToSave[detailList[index].name]=detailList[index].value
            }

        }
        switch(type) {//undefined handling
            case "playerGoTo":
                if(!objectToSave.entity){
                    let selectionData=this.getActivitySelectionData("all-camera-entities")
                    objectToSave.player=selectionData.firstElement
                    if(!objectToSave.player) {//no first value
                        return "There are no player in the scene";
                    }
                }
                break;
            case "entityGoTo":
                if(!objectToSave.entity){
                    let selectionData=this.getActivitySelectionData("all-dynamic-entities")
                    objectToSave.entity=selectionData.firstElement
                    if(!objectToSave.entity) {//no first value
                        return "There are no dynamic entities in the scene";
                    }
                }
                break;
            case "entityInteract":
                if(!objectToSave.interaction){
                    let selectionData=this.getActivitySelectionData("all-interactions")
                    objectToSave.interaction=selectionData.firstElement
                    if(!objectToSave.interaction) {//no first value
                        return "There are no interactions in the scene"
                    }
                }
                break;
            default:
        }
        return null;
    }

    // this function setups the custom Selections in the Activity Dialog
    setupSceneSelections(scene){
        let selectionAllEntities=[] // contains all entities
        let firstValueAllEntities;
        let selectionAllDynamicEntities=[] // contains only dynamic entities
        let firstValueAllDynamicEntities;
        let selectionAllEntitiesWithInteractions=[] // contains only entities with interactions
        let firstValueEntitiesWithInteractions;
        let selectionAllInteractions=[] // contains all interactions
        let firstValueAllInteractions;
        let selectionAllCams=[] // contains all cameras
        let firstValueAllCams;
        for(let index=0;index<scene.length;index++){
            //set ups the entry for the all entity
            if(!firstValueAllEntities){
                firstValueAllEntities=scene[index].getID();
            }
            selectionAllEntities=selectionAllEntities.concat((
                <option key={"selectionAllEntities"+index} value={scene[index].getID()}>
                    {scene[index].getName()}
                </option>
            ))

            //only set up the entry for the entity when it has interactions
            if (scene[index].hasInteractions()){
                if(!firstValueEntitiesWithInteractions){
                    firstValueEntitiesWithInteractions=scene[index].getID();
                }
                selectionAllEntitiesWithInteractions=selectionAllEntitiesWithInteractions.concat((
                    <option key={"selectionAllEntitiesWithInteractions"+index} value={scene[index].getID()}>
                        {scene[index].getName()}
                    </option>
                ))
            }

            //only set up the entry for the entity when it is dynamic/can be grabbed
            if (scene[index].canBeGrabbed()){
                if(!firstValueAllDynamicEntities){
                    firstValueAllDynamicEntities=scene[index].getID();
                }
                selectionAllDynamicEntities=selectionAllDynamicEntities.concat((
                    <option key={"selectionAllDynamicEntities"+index} value={scene[index].getID()}>
                        {scene[index].getName()}
                    </option>
                ))
            }

            //only set up the entry for the entity when it is a camera
            if (scene[index] instanceof Camera){
                if(!firstValueAllCams){
                    firstValueAllCams=scene[index].getID();
                }
                selectionAllCams=selectionAllCams.concat((
                    <option key={"selectionAllCameras"+index} value={scene[index].getID()}>
                        {scene[index].getName()}
                    </option>
                ))
            }

            //add all included interactions
            if (scene[index].hasInteractions()){

                let interactionList=scene[index].getInteractions()
                if(!firstValueAllInteractions){
                    firstValueAllInteractions=interactionList[0].getID();
                }
                for(let interactionIndex=0;interactionIndex<interactionList.length;interactionIndex++){
                    selectionAllInteractions=selectionAllInteractions.concat((
                        <option key={"selectionAllInteractions"+index+"_"+interactionIndex} value={interactionList[interactionIndex].getID()}>
                            {interactionList[interactionIndex].getName()}
                        </option>
                    ))
                }

            }

        }
        return [
            {
                name: "all-entities",
                selection:selectionAllEntities,
                firstElement:firstValueAllEntities,
            },
            {
                name: "all-entities-with-interactions",
                selection:selectionAllEntitiesWithInteractions,
                firstElement:firstValueEntitiesWithInteractions,
            },
            {
                name: "all-dynamic-entities",
                selection:selectionAllDynamicEntities,
                firstElement:firstValueAllDynamicEntities
            },
            {
                name: "all-interactions",
                selection:selectionAllInteractions,
                firstElement:firstValueAllInteractions
            },
            {
                name: "all-camera-entities",
                selection:selectionAllCams,
                firstElement:firstValueAllCams
            }
        ]
    }

    getActivitySelectionData(name){
        let selectionList = this.state.activitySelectionsData;
        if(selectionList){
            if(Array.isArray(selectionList)){
                for (let index=0; index<selectionList.length;index++){
                    if(selectionList[index].name===name){
                        return selectionList[index]
                    }
                }
            }
        }
        return null;
    }

    changeScenario(scenario){
        let scenarioData=null;
        for (let index=0; index<this.state.scenarios.length; index++){
            if(this.state.scenarios[index].id===scenario){
                scenarioData=this.state.scenarios[index]
                break;
            }
        }
        if(!scenarioData){return;}
        this.setState({
            selectedScenario:scenarioData.id,
            scenarioImage:scenarioData.image,
            scenarioDescription:scenarioData.description,
            xmlFromScenario:scenarioData.xml,
        })
    }

    createProject(event){
        if(this.state.selectedScenario==="empty"){
            event.preventDefault(); //stops the handling of the submit event
            this.props.emptyProject(this.state.projectName)
            this.closeDialog("new")
        }
        else{
            let toFetch= ""+this.state.xmlFromScenario
            fetch(toFetch) //get xml file from the server
                .then((response) => {
                    return response.text()
                })
                .catch(function(e) {
                    console.log("error",e);
                    }
                    ).then((responseText) =>
                        {
                            if(responseText){
                                this.OpenProject(responseText,this.state.projectName,false)
                            }
                        }
                    );
            this.openDialog("loading");
        }
    }


    completeModelUploadWizard(hasToLoad){
        this.setState({
            showModelUploadWizard:false,
            showLoadingModal:hasToLoad
        })
    }

    renderActivityDetail(detail,move){
        let selectionSource=[]
        if (detail.selection){
            let selectionData=this.getActivitySelectionData(detail.selection)
            if(selectionData){
                selectionSource=selectionData.selection
                if(!detail.value){
                    detail.value=selectionData.firstElement
                }
            }
        }
        let parameterInputMethod= (detailParameter) => {
            if (detailParameter.inputType === "checkbox") { //if the input type is text, the change will be submitted after losing focus
                return (
                    <input
                        type={detailParameter.inputType}
                        name={detailParameter.name}
                        checked={detailParameter.value}
                        onChange={(e) => this.onChangeActivityValue(detailParameter, e.target.checked)}/>
                );
            }
            if (detailParameter.inputType === "text") { //if the input type is text, the change will be submitted after losing focus
                return (
                    <input
                        type={detailParameter.inputType}
                        name={detailParameter.name}
                        defaultValue={detailParameter.value}
                        onChange={(e) => this.onChangeActivityValue(detailParameter.name, e.target.value)}/>
                );
            }
            if (detailParameter.inputType === "textarea") { //if the input type is text, the change will be submitted after losing focus
                return (
                    <textarea
                        name={detailParameter.name}
                        defaultValue={this.state.activityDetails[detailParameter.name]}
                        onChange={(e) => this.onChangeActivityValue(detailParameter.name, e.target.value)}
                    />
                );
            }
            if (detailParameter.inputType === "select") { //if the input type is text, the change will be submitted after losing focus
                return (
                    <select
                        key={"k-"+detailParameter.value+"-"+move}
                        value={this.state.activityDetails[detailParameter.name]}
                        onChange={(e) => this.onChangeActivityValue(detailParameter.name, e.target.value)}>
                        {selectionSource}
                    </select>
                );
            }
            if (detailParameter.inputType === "span") { //if the input type is text, the change will be submitted after losing focus
                return (
                    <span>
                        {detailParameter.value}
                    </span>
                );
            }
            else { //the change will be submitted on change
                return (
                    <input
                        type={detailParameter.inputType}
                        name={detailParameter.name}
                        value={detailParameter.value}
                        step={detailParameter.step}
                        min={detailParameter.min}
                        max={detailParameter.max}
                        onChange={(e) => this.onChangeActivityValue(detailParameter.name, e.target.value)}/>
                );
            }
        }
        return (
            //the key needs to be unique for each element in the scenegraph otherwise the defaultValue won't be rerendered
            <div className="dialog-panel-content-input-element" key={this.state.activityName + detail.name + move}>
                <span>
                    {detail.printName}:
                </span>
                {parameterInputMethod(detail)}
            </div>

        );
    }

    render() {

        let activityOptions=[];
        if(this.state.selectedActivityType){
            activityOptions=this.state.selectedActivity.getInputByType(this.state.selectedActivityType).map((detail, move) => {
                return this.renderActivityDetail(detail,move)
            });
        }
        const activityList=this.state.temporaryActivityList.map((saveObject, move) => {
            let dataList=this.state.activityList
            let activityData=null;
            for(let index=0;index<dataList.length;index++){
                if(dataList[index].getID()===saveObject.id){
                    activityData=dataList[index]
                }
            }
            return (
                <div key={"activity" + move} className="dialog-panel-activity-list-entry">
                    <span >
                        {saveObject.name}
                    </span>
                    <button type="button" onClick={()=>this.openDialog("activity",
                        {
                            subModal:true,
                            mode:"edit",
                            activityData:activityData,
                            saveObject:saveObject,
                        })}
                    >
                        Edit
                    </button>
                    <button type="button" onClick={()=>this.removeActivity(saveObject)}>Remove</button>
                </div>


            );
        });

        return (
            <div>
                {/*Dialog for unsaved changes*/}
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.state.showUnsavedModal} //this state handles the visibility
                    contentLabel="Unsaved Changes">
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>Save Changes?</h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>All your changes will be lost</span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <div className="dialog-Panel-Buttons">

                                <button type="button" onClick={() => this.handleClosingUnsavedModal(this.state.unsavedModalOpenedBy)}>Do
                                    not Save
                                </button>
                                <button type="button" onClick={() => this.closeDialog("unsaved")}>Cancel</button>
                                <button type="button"
                                        onClick={() => this.handleSaveInUnsavedModal(this.state.unsavedModalOpenedBy)}>Save
                                </button>
                            </div>
                        </div>
                    </div>
                </ReactModal>

                {/*Dialog for opening a project*/}
                <ReactModal
                    className="dialog-Modal"
                    overlayClassName="dialog-Overlay"
                    isOpen={this.state.showOpenModal} //this state handles the visibility
                    contentLabel="Open a Project">
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>Open a Project</h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>Upload a xml file to open a project</span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <form onSubmit={(e) => this.handleOpenProject(e)}>
                                <div className="dialog-panel-content-input-element">
                                    <span>File:</span>
                                    <input
                                        type="file"
                                        onChange={(e) => this.handleFileSelection(e,"xml") }
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

                                    <button type="button" onClick={() =>{
                                            if(this.state.openModalAtStart){
                                                this.openDialog("start")
                                                return;
                                            }
                                            this.closeDialog("open")
                                        }
                                    }>
                                        {(this.state.openModalAtStart)?"Go Back":"Cancel"}
                                    </button>
                                    <button type="submit" disabled={!this.state.isFileValid}>Open</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>
                {/*Dialog for loading Elements*/}
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.state.showLoadingModal} //this state handles the visibility
                    contentLabel="Loading"
                >
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>Loading</h2>
                        </div>
                    </div>
                </ReactModal>

                {/*Dialog to upload media*/}
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.state.showUploadMediaModal} //this state handles the visibility
                    contentLabel={"Upload " + this.state.typeOfUploadedMedia}>
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>Upload {(/^[aeiou]$/i).test(this.state.typeOfUploadedMedia.charAt(0)) ? "an" : "a"} {this.state.typeOfUploadedMedia.charAt(0).toUpperCase() + this.state.typeOfUploadedMedia.slice(1)}</h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>Upload {(/^[aeiou]$/i).test(this.state.typeOfUploadedMedia.charAt(0)) ? "an" : "a"} {this.state.typeOfUploadedMedia} to use it in the editor</span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <form onSubmit={(e) => this.uploadMediaToServer(e, this.state.typeOfUploadedMedia)}>
                                <div className="dialog-panel-content-input-element">
                                            <span>
                                                Name:
                                            </span>
                                    <input
                                        type="text"
                                        onChange={(e) => this.setState({customElementName: e.target.value})}
                                    />
                                </div>
                                <div className="dialog-panel-content-input-element">
                                            <span>
                                                {this.state.typeOfUploadedMedia.charAt(0).toUpperCase() + this.state.typeOfUploadedMedia.slice(1)}:
                                            </span>
                                    <input
                                        type="file"
                                        onChange={(e) => this.handleFileSelection(e,this.state.typeOfUploadedMedia)}
                                        name="imageUpload"
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
                                    <button type="button" onClick={() => this.closeDialog("uploadMedia")}>Cancel</button>
                                    <button id="upload-media-submit" type="submit" disabled={!this.state.isFileValid}>Upload</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>

                {/*Modal to create Tasks*/}
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.state.showTaskModal} //this state handles the visibility
                    contentLabel={this.state.taskModalMode+" a Task"}>
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>{this.state.taskModalMode.charAt(0).toUpperCase() + this.state.taskModalMode.slice(1)} a Task</h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>{this.state.taskModalMode.charAt(0).toUpperCase() + this.state.taskModalMode.slice(1)} a task which an user has to complete in the VR Scene</span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <form onSubmit={(e) => this.saveTask(e)}>
                                <div className="dialog-panel-content-input-group">
                                    <div className="dialog-panel-content-input-element">
                                                <span>
                                                    Name:
                                                </span>
                                        <input
                                            value={this.state.taskName}
                                            type="text"
                                            onChange={(e) => this.setState({taskName: e.target.value})}
                                        />
                                    </div>
                                    <div className="dialog-panel-content-input-element">
                                        <span>
                                            Description:
                                        </span>
                                        <input
                                            type="text"
                                            value={this.state.taskDescription}
                                            onChange={(e) => this.setState({taskDescription: e.target.value})}>
                                        </input>
                                    </div>
                                </div>
                                <div className="dialog-panel-content-input-group">
                                    <div className="dialog-panel-content-input-element">
                                        <span>
                                            Activity:
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => this.createActivity()}
                                        >
                                            Add an Activity
                                        </button>
                                    </div>
                                    <div className={this.state.temporaryActivityList.length>0?"dialog-panel-activity-list":"dialog-hidden"}>
                                        {activityList}
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
                                    <button type="button" onClick={() => this.closeDialog("task")}>Cancel</button>
                                    <button type="submit" disabled={this.state.temporaryActivityList.length<1}>Save Task</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>
                {/*modal to create a activity*/}
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.state.showActivityModal} //this state handles the visibility
                    contentLabel={"Create an Activity"}>
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>{this.state.activityModalMode.charAt(0).toUpperCase() + this.state.activityModalMode.slice(1)} an Activity</h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>{this.state.activityModalMode.charAt(0).toUpperCase() + this.state.activityModalMode.slice(1)} an activity which an user has to complete for the task</span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <form onSubmit={(e) => this.saveActivity(e)}>
                                <div className="dialog-panel-content-input-group">
                                    <div className="dialog-panel-content-input-element">
                                                <span>
                                                    Name:
                                                </span>
                                        <input
                                            value={this.state.activityName}
                                            type="text"
                                            onChange={(e) => this.setState({activityName: e.target.value})}
                                        />
                                    </div>
                                    <div className="dialog-panel-content-input-element">
                                        <span>
                                            Description:
                                        </span>
                                        <input
                                            type="text"
                                            value={this.state.activityDescription}
                                            onChange={(e) => this.setState({activityDescription: e.target.value})}>
                                        </input>
                                    </div>
                                </div>
                                <div className="dialog-panel-content-input-group">
                                    <div className="dialog-panel-content-input-element">
                                        <span>
                                            Type:
                                        </span>
                                        <select
                                            value={this.state.selectedActivityType}
                                            onChange={(e) => this.selectActivityType(e.target.value)}
                                        >
                                            {this.activityTypesSelectOptions}
                                        </select>
                                    </div>
                                    {activityOptions}
                                </div>
                                <div className={this.state.showErrorActivity?"dialog-panel-error":"dialog-hidden"}>
                                    <span>Error</span>
                                    <span >{this.state.errorMessageActivity}</span>
                                </div>
                                <div className={this.state.showWarningActivity?"dialog-panel-warning":"dialog-hidden"}>
                                    <span>Warning</span>
                                    <span >{this.state.warningMessageActivity}</span>
                                </div>
                                <div className="dialog-Panel-Buttons">
                                    <button type="button" onClick={() => this.closeDialog("activity")}>Cancel</button>
                                    <button type="submit" disabled={this.state.showErrorActivity||!(this.state.activityIsValid)}>Save Activity</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>

                {/*modal to create a project*/}
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.state.showNewModal} //this state handles the visibility
                    contentLabel="new project"
                >
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>Create a New Project</h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>Setup your project and start the construction</span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <form onSubmit={(e) => this.createProject(e)}>
                                <div className="dialog-panel-content-input-element">
                                                <span>
                                                    Name:
                                                </span>
                                    <input
                                        value={this.state.projectName}
                                        type="text"
                                        onChange={(e) => this.setState({projectName: e.target.value})}
                                    />
                                </div>
                                <div className="dialog-panel-content-input-element">
                                        <span>
                                            Scenario:
                                        </span>
                                    <select
                                        key="scenarioSelect"
                                        value={this.state.selectedScenario}
                                        onChange={(e) => this.changeScenario(e.target.value)}>
                                        {this.scenarioOptions}
                                    </select>
                                </div>
                                <div className="dialog-panel-content-input-element">
                                    <span>
                                        Description:
                                    </span>
                                    <span>
                                        {this.state.scenarioDescription}
                                    </span>
                                </div>
                                <div className="dialog-panel-content-input-element">
                                    <span>
                                        Preview:
                                    </span>
                                    <img alt="preview" src={this.state.scenarioImage}/>
                                </div>
                                <div className={this.state.showErrorActivity?"dialog-panel-error":"dialog-hidden"}>
                                    <span>Error</span>
                                    <span >{this.state.errorMessageActivity}</span>
                                </div>
                                <div className={this.state.showWarningActivity?"dialog-panel-warning":"dialog-hidden"}>
                                    <span>Warning</span>
                                    <span >{this.state.warningMessageActivity}</span>
                                </div>
                                <div className="dialog-Panel-Buttons">

                                    <button type="button" onClick={() => {
                                        if(this.state.newModalAtStart){
                                            this.openDialog("start")
                                            return;
                                        }
                                        this.closeDialog("new")
                                    }}>
                                        {this.state.newModalAtStart?"Go Back":"Cancel"}
                                    </button>
                                    <button type="submit" >Create Project</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>

                {/*A modal to show a Error in the Editor*/}
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.state.showErrorModal} //this state handles the visibility
                    contentLabel="error"
                >
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>Error</h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>{this.state.errorModalMessage}</span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <form>
                                <div className="dialog-Panel-Buttons">
                                    <button type="button" onClick={()=>this.closeDialog("error")}>Ok</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>

                {/*Modal shown at the start of the Website*/}
                <ReactModal
                    className="dialog-Modal" //style class
                    overlayClassName="dialog-Overlay"
                    isOpen={this.state.showStartModal} //this state handles the visibility
                    contentLabel="startmodal"
                >
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>Welcome to the VR Editor</h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>You can either start the tutorial, start a new project or load a saved Project</span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <form>
                                <div className="dialog-Panel-Buttons">
                                    <button type="button" onClick={()=>this.startTutorial()}>Start the Tutorial</button>
                                </div>
                                <div className="dialog-Panel-Buttons">
                                    <button type="button" onClick={()=>this.openDialog("new",{start:true})}>Start a New Project</button>
                                </div>
                                <div className="dialog-Panel-Buttons">
                                    <button type="button" onClick={()=>this.openDialog("open",{start:true})}>Load a Saved Project</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>

                {/*modal to create complex interactions*/}
                <InteractionWizard
                        show={this.state.showInteractionModal}
                        cancel={()=>this.closeDialog("interaction")}
                        save={(interaction,source)=>{this.saveInteraction(interaction,source)}}
                        scene={this.props.scene}
                        tasks={this.props.tasks}
                        ref={this.interactionWizardRef}
                />
                <InteractionPatternDialog
                    show={this.state.showInteractionPatternModal}
                    cancel={()=>this.closeDialog("interaction-pattern")}
                    save={(result)=>{this.saveInteractionPatternResult(result)}}
                    scene={this.props.scene}
                    tasks={this.props.tasks}
                    cameraPosition={this.state.cameraPosition}
                />

                <ModelUpload
                    show={this.state.showModelUploadWizard}
                    cancel={()=>this.closeDialog("model-upload-wizard")}
                    result={(hasTpLoad)=>{this.completeModelUploadWizard(hasTpLoad)}}
                    scene={this.props.scene}
                    tasks={this.props.tasks}
                    cameraPosition={this.state.cameraPosition}
                    error={(name,parameters)=>this.openDialog(name,parameters)}
                    addEntityToScene={(entity,customEntry,hasToBeLoaded,options)=>this.props.addEntityToScene(entity,customEntry,hasToBeLoaded,options)}
                />

            </div>
        );
    }
}
