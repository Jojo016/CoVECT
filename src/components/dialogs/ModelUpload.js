import React from "react";
import ReactModal from "react-modal";
import "../../styles/DialogManager.css"
import axios from "axios";
import Image from "../../data/Media/Image";
import Texture from "../../data/Texture";
import ObjModel from "../../data/Model/ObjModel";
import Model from "../../data/Model/Model";
import NavMesh from "../../data/Model/NavMesh";
import Pdf from "../../data/Media/Pdf";
import Video from "../../data/Media/Video";




export default class ModelUpload extends React.Component {
    constructor(props) {
        super(props);
        this.listSelectionFunction=()=>{};
        this.conditionDialogRef=React.createRef(); //reference to inform the conditionDialogRef about the staring values
        this.state = {
            showError:false,
            errorMessage:"",

            showWarning:false,
            warningMessage:"",

            selectedModelFiles:[], //selected model files
            selectedTextureFiles:[],  // selected texture files
            selectedAutoScale:true,// should the model autocscaled
            selectedPath:"", //the selected path from the model files

            previewFileNameModel:[], //saves a list of model file names to preview them
            previewFileNameTextures:[],//saves a list of texture file names to preview them
            modelType:"", //reset model type
            isModelValid:false,  //saves if the files are valid on clientside
            isTextureValid:true,  //saves if the files are valid on clientside, because it is optional


            selectedName:"", //name of the model


            shownPage:0, //shown page of the wizard
        };
    }

    resetWizard(){
        this.setState({
            showError:false,
            errorMessage:"",

            showWarning:false,
            warningMessage:"",

            selectedModelFiles:[], //selected model files
            selectedTextureFiles:[],  // selected texture files
            selectedAutoScale:true,// should the model autocscaled
            selectedPath:"", //the selected path from the model files

            previewFileNameModel:[], //saves a list of model file names to preview them
            previewFileNameTextures:[],//saves a list of texture file names to preview them
            modelType:"", //reset model type
            isModelValid:false,  //saves if the files are valid on clientside
            isTextureValid:true,  //saves if the files are valid on clientside, because it is optional


            selectedName:"", //name of the model


            shownPage:0, //shown page of the wizard
        })
    }

    configureBeforeOpening(scene,tasks,cameraPos){
        this.resetWizard();
        this.setState({

            }
        )
    }

    resetTextureSelection(){
        this.setState({
            isTextureValid:true,
            selectedTextureFiles: [],
            previewFileNameTextures:[],
            showError:false,
            errorMessage:""
        })
    }

    handleFileSelectionTextures(event){
        let files=event.target.files;
        let filesAreValid=true;
        let previewFileName=[]
        for (let index=0;index<files.length;index++){
            let fileName=files[index].name
            previewFileName.push(fileName)
            if(!/^image\//ig.test(files[index].type)){
                filesAreValid=false;
                break;
            }
        }
        if(filesAreValid){ //checks if the type starts with image
            this.setState({
                isTextureValid:true,
                selectedTextureFiles: files,
                previewFileNameTextures:previewFileName,
                showError:false,
                errorMessage:""
            })
        }
        else{
            this.setState({
                isTextureValid:false,
                showError:true,
                selectedTextureFiles: files,
                previewFileNameTextures:previewFileName,
                errorMessage:"textures are not images"
            })
        }
    }

    handleModelFileSelection(event){
        let files=event.target.files;
        let previewFileName=[]
        let entityName=""
        let modelType=""
        let containsValidModelFile=false
        let containsMaterialFile=false
        let containsBinFile=false
        let containsDoubleModelFile=false
        let containsDoubleMaterialFile=false
        for (let index=0;index<files.length;index++){
            let fileName=files[index].name
            previewFileName=previewFileName.concat(fileName)
            let extension = fileName.substr((fileName.lastIndexOf('.') +1));
            if (/(obj|gltf|fbx|glb)$/ig.test(extension)) {
                if(containsValidModelFile){ //this if is only entered if already a valid model is found
                    containsDoubleModelFile=true
                }
                containsValidModelFile=true;
                modelType=extension
                entityName=fileName.replace(/\.[^/.]+$/, "")
            }
            if (/(mtl)$/ig.test(extension)) { // checks if a material file is included this is needed for obj files
                if(containsMaterialFile){ // checks if it contains 2 mtl files
                    containsDoubleMaterialFile=true
                }
                containsMaterialFile=true;
            }
            if (/(bin)$/ig.test(extension)) { //checks if a bin file is included this is needed for gltf files
                containsBinFile=true;
            }
        }
        let isError=false;
        let errorMessage="";
        let isWarning=false;
        let warningMessage="";
        if(!containsValidModelFile){
            isError=true;
            errorMessage="No valid model file is selected. valid files are .obj .gltf .glb"
        }
        else {
            if(containsDoubleModelFile){
                isError=true;
                errorMessage="Two model files are selected"
            }
            else{
                if(modelType==="obj"){
                    if(!containsMaterialFile){
                        isWarning=true;
                        warningMessage="The obj model is missing a mtl file"
                    }
                    else{
                        if(containsDoubleMaterialFile){
                            isError=true;
                            errorMessage="Two mtl files are selected"
                        }
                    }
                }
                else{
                    if(modelType==="gltf"){
                        if(!containsBinFile){
                            isWarning=true;
                            warningMessage="The gltf model is probably missing a bin file"
                        }
                    }
                }
            }
        }
        modelType=modelType==="glb"?"gltf":modelType; //transform glb to gltf because they are the same model type
        this.setState({
            selectedName: entityName,
            modelType:modelType,
            selectedModelFiles:files,
            previewFileNameModel:previewFileName,
            isModelValid:!isError,
            showError:isError,
            errorMessage:errorMessage,
            showWarning:isWarning,
            warningMessage:warningMessage
        })
    }

    uploadMediaToServer() {

        let postLink="/uploadModels"
        document.getElementById("upload-model-wizard-submit").disabled = true;
        const data = new FormData()
        let fileList=this.state.selectedModelFiles
        if(fileList.length<1){ //error
            return;
        }
        for(let index=0;index<fileList.length;index++){
            data.append("model", fileList[index])
        }
        let textureList=this.state.selectedTextureFiles
        if(textureList.length>0){ //error
            for(let index=0;index<textureList.length;index++){
                data.append("model", textureList[index])
            }
        }
        let fileName=this.state.selectedName

        let config ={
            onUploadProgress: (progressEvent) => {console.log("upload:" +Math.round(100*progressEvent.loaded/progressEvent.total)+"%")},
            headers: {directory: fileName}
        }
        if(this.state.selectedPath.length>0){
            config["headers"]["texture-path"]=this.state.selectedPath
        }
        let modelType=this.state.modelType
        axios.post(postLink, data, config).then(res => { // then print response status
            if (res.statusText === "OK") {
                if (modelType === "obj") {
                    this.props.addEntityToScene(
                        new ObjModel(modelType, res.headers["model-url"], res.headers["material-url"], true), //model data
                        { //model add entry
                            elementType: "model",
                            addEntry: {
                                name: fileName,
                                modelType: modelType,
                                url: res.headers["model-url"],
                                materialUrl: res.headers["material-url"],
                                loadOptions: {autoscale: this.state.selectedAutoScale} //load options
                            }
                        },
                        true, // needs to be loaded
                        {autoscale: this.state.selectedAutoScale} //load options
                    )
                } else {
                    this.props.addEntityToScene(
                        new Model(modelType, res.headers["model-url"], true), //model data
                        { //model add entry
                            elementType: "model",
                            addEntry: {
                                name: fileName,
                                modelType: modelType,
                                url: res.headers["model-url"],
                                loadOptions: {autoscale: this.state.selectedAutoScale} //load options
                            }
                        },
                        true, //needs to be loaded
                        {autoscale: this.state.selectedAutoScale} //load options
                    )
                }
            }
        }).catch(error => {
            console.log(error)
            this.props.error("error", {message: error.message})
        });
        this.resetWizard()
        this.props.result(true)
    }

    checkModelValid(){
        if(this.state.isModelValid){
            if(this.state.selectedModelFiles.length>0){
                return true;
            }
        }
        return false;
    }

    checkTextureValid(){
        if(this.state.selectedTextureFiles.length>0){
            return this.state.isTextureValid;
        }
        return true;
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

    cancel(){
        this.resetWizard();
        this.props.cancel();
    }

    render() {
        let uploadPreview= this.state.previewFileNameModel.map((name, move)=>{
            return(<li key={"modellist"+move}>
                    {name}
                </li>
            );}
        );
        let ModelPage= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div  className="dialog-panel-content-input-description">
                        <span>
                            Select the model files of the model
                        </span>
                        <span>
                            The supported file types are .bin, .glb, .gltf, .mtl and .obj
                        </span>
                </div>
                <div className="dialog-panel-content-input-element">
                                        <span>
                                            Model Files:
                                        </span>
                    <input
                        type="file"
                        multiple
                        name="modelUpload"
                        onChange={(e) => this.handleModelFileSelection(e)}
                    />
                </div>
                <div className={(uploadPreview.length>0)?"dialog-panel-content-input-element":"dialog-hidden"}>
                    <span>
                        Selected Files:
                    </span>
                    <ul>
                        {uploadPreview}
                    </ul>
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
                    <button type="button" disabled={false} onClick={()=>this.cancel()}>Go Back</button>
                    <button type="button" onClick={() => this.cancel()}>Cancel</button>
                    <button type="button" disabled={!this.checkModelValid()} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )

        let uploadPreviewTextures= this.state.previewFileNameTextures.map((name, move)=>{
            return(<li key={"texturelist"+move}>
                    {name}
                </li>
            );}
        );

        let TexturePage= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div  className="dialog-panel-content-input-description">
                            <span>
                                Choose the texture files associated to the model.
                            </span>
                    <span>
                                If the model does not use textures, you can skip this step .
                            </span>
                </div>
                <div className="dialog-panel-content-input-element">
                                        <span>
                                            Texture:
                                        </span>
                <button type="button" onClick={() => this.resetTextureSelection()}>Reset Selection</button>
                </div>
                <div className="dialog-panel-content-input-element">
                                            <span>
                                                Files:
                                            </span>
                    <input
                        id="dialog-texture-file-selector"
                        type="file"
                        multiple
                        name="textureUpload"
                        onChange={(e) => this.handleFileSelectionTextures(e)}
                    />
                </div>
                <div className={(uploadPreviewTextures.length>0)?"dialog-panel-content-input-element":"dialog-hidden"}>
                    <span>
                        Selected Files:
                    </span>
                    <ul>
                        {uploadPreviewTextures}
                    </ul>
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
                    <button type="button" disabled={!this.checkTextureValid()} onClick={()=>this.nextPage(pageList.length)}>Next Step</button>
                </div>
            </form>
        )


        let OptionalPage= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-group">
                    <div className="dialog-panel-content-input-description">
                        <span>
                            The integrated model will be automatically scaled, if it is bigger than a certain size.
                        </span>
                        <span>
                            This will prevent giant models due to different applied units in the model file.
                        </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                                                    <span>
                                                        Autoscale:
                                                    </span>
                        <input
                            type="checkbox"
                            checked={this.state.selectedAutoScale}
                            onChange={(e) => this.setState({selectedAutoScale: e.target.checked})}
                        />
                    </div>
                </div>

                <div className={this.state.previewFileNameTextures.length>0?"dialog-panel-content-input-group":"dialog-hidden"}>
                    <div className="dialog-panel-content-input-description">
                        <span>
                            Are the selected textures contained in a folder?
                        </span>
                        <span>
                            If they are contained in a folder you have to configre the path.
                        </span>
                        <span>
                            The path starts in the folder which contains the model files.
                        </span>
                        <span>
                            Contained folders are divided with a / .
                        </span>
                        <span>
                            For example: If the textures are contained in the folder "textures" in the folder of the model, you have to type in textures
                        </span>
                    </div>
                    <div className="dialog-panel-content-input-element">
                                            <span>
                                                Path:
                                            </span>
                        <input
                            type="text"
                            value={this.state.selectedPath}
                            onChange={(e) => this.setState({selectedPath: e.target.value})}
                        />
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

        let NamePattern= (
            <form onSubmit={(e) => e.preventDefault()}>
                <div className="dialog-panel-content-input-description">
                        <span>
                            This name is used to describe the integrated model
                        </span>
                        <span>
                            An entry will be created with this name in the custom model list
                        </span>
                </div>
                <div className="dialog-panel-content-input-element">
                    <span>
                        Name:
                    </span>
                    <input
                        value={this.state.selectedName}
                        onChange={(event)=> this.setState({selectedName:event.target.value})}
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
                    <button id="upload-model-wizard-submit" type="button" disabled={this.state.selectedName.length<1} onClick={()=>this.uploadMediaToServer()}>Upload Model</button>
                </div>
            </form>
        )

        let pageList=[
            ModelPage,
            TexturePage,
            OptionalPage,
            NamePattern,
        ]

        return (
            <ReactModal
                className="dialog-Modal" //style class
                overlayClassName="dialog-Overlay"
                isOpen={this.props.show} //this state handles the visibility
                contentLabel={"upload A Model"}>
                <div className="dialog-Panel">
                    <div className="dialog-Panel-Headline">
                        <h2>
                            {"Integrate a Third Party Model"}
                        </h2>
                    </div>
                    <div className="dialog-Panel-Description">
                        <span>
                           {"This wizard enables you to integrate a personal or third party model in your virtual environment"}
                        </span>
                    </div>
                    <div className="dialog-Panel-Content">
                        {pageList[this.state.shownPage]}
                    </div>
                </div>
            </ReactModal>
        );
    }
}
