import React from "react";
import ReactModal from "react-modal";
import "../../styles/DialogManager.css"
import PdfControllerPattern from "./pattern/PdfControllerPattern";
import VideoControllerPattern from "./pattern/VideoControllerPattern";
import WalkThroughPattern from "./pattern/WalkThroughPattern";




export default class InteractionPatternDialog extends React.Component {
    constructor(props) {
        super(props);
        this.patternList=[{name:"Controller for a Pdf", id:"pdf-controller", description:"Create the interactivity to control a pdf in the virtual environment"},{name:"Controller for a Video", id:"video-controller", description:"Create the interactivity to control a video in the virtual environment"},{name:"Create a Walkthrough", id:"walkthrough", description:"Create a walkthrough for your virtual environment"}]
        this.state = {
            showError:false,
            errorMessage:"",

            showWarning:false,
            warningMessage:"",

            searchValue:"", // a search value to filter the entities
            selectedPattern:null, //the current selected entity

            showPdfControllerPattern:false, //opens the wizard to create the pdf controller pattern
            showVideoControllerPattern: false, // opens the wizard to create the video controller pattern
            showWalkthroughPattern:false, // opens wizard to create a walkthrough
        };
    }

    resetDialog(){
        this.setState({
            showError:false,
                errorMessage:"",

            showWarning:false,
            warningMessage:"",

            searchValue:"", // a search value to filter the entities
            selectedPattern:null, //the current selected entity
            showPdfControllerPattern:false,
            showVideoControllerPattern: false, // opens the wizard to create the video controller pattern
            showWalkthroughPattern:false, // opens wizard to create a walkthrough
        })
    }

    createElementList(filterName){
        let allElements=this.patternList;
        let elementList=[];
        for (let index=0; index<allElements.length;index++){
            let element=allElements[index];
            if((element.name.toLowerCase().includes(filterName.toLowerCase()))||element.id===this.state.selectedPattern){ //selected pattern is always in the list
                if(element.id===this.state.selectedPattern){ //higlight selected pattern
                    elementList.push((
                        <div key={index} className={"dialog-list-selector-combined-highlight"}>
                            <button  className={"dialog-highlight"} type="button" onClick={()=>{this.setState({selectedPattern:element.id})}}>
                                {element.name}
                            </button>
                            <div className={"dialog-highlight-button-extension"}>
                                <span >{element.description}</span>
                            </div>
                        </div>
                    ))
                }
                else {
                    elementList.push((
                            <button key={index} type="button" onClick={()=>{this.setState({selectedPattern:element.id})}}>
                                {element.name}
                            </button>
                    ))
                }
            }
        }
        return elementList
    }

    result(resultData){
        this.resetDialog()
        this.props.save(resultData)
    }


    cancel(){
        this.resetDialog();
        this.setState({
            searchValue:"",
        })
        this.props.cancel()
    }

    openPatternDialog(){
        console.log("open pattern:", this.state.selectedPattern)
        switch (this.state.selectedPattern){
            case "pdf-controller":
                this.setState({
                    showPdfControllerPattern:true,
                })
                break;
            case "video-controller":
                this.setState({
                    showVideoControllerPattern:true,
                })
                break;
            case "walkthrough":
                this.setState({
                    showWalkthroughPattern: true,
                })
                break;
            default:
        }

    }

    closePatternDialog(pattern){
        switch (pattern) {
            case "pdf-controller":
                this.setState({
                    showPdfControllerPattern: false,
                })
                break;
            case "video-controller":
                this.setState({
                    showVideoControllerPattern: false,
                })
                break;
            case "walkthrough":
                this.setState({
                    showWalkthroughPattern: false,
                })
                break;
            default:
        }
    }

    isDialogOpened(pattern){
        return this.state.selectedPattern===pattern
    }

    render() {

        let elementList=this.createElementList(this.state.searchValue);
        return (
            <div>
                <ReactModal
                className="dialog-Modal" //style class
                overlayClassName="dialog-Overlay"
                isOpen={this.props.show} //this state handles the visibility
                contentLabel={"Select an Entity"}>
                    <div className="dialog-Panel">
                        <div className="dialog-Panel-Headline">
                            <h2>
                                Create an Interactivity
                            </h2>
                        </div>
                        <div className="dialog-Panel-Description">
                            <span>
                               Choose a pattern and follow the wizard to create the interactivity
                            </span>
                        </div>
                        <div className="dialog-Panel-Content">
                            <form onSubmit={(event) => {event.preventDefault()}}>
                                <div className="dialog-panel-content-input-element">
                                                    <span>
                                                        Search:
                                                    </span>
                                    <input
                                        value={this.state.searchValue}
                                        type="text"
                                        onChange={(e) => this.setState({searchValue: e.target.value})}
                                    />
                                </div>
                                <div>
                                    {elementList}
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
                                    {/*<button type="button" className="dialog-invisible-button" >Go Back</button>*/}
                                    <button type="button" onClick={() => this.cancel()}>Cancel</button>
                                    <button id="upload-media-submit" type="button" onClick={() => {this.openPatternDialog()}} disabled={!this.state.selectedPattern}>Create Interactivity</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </ReactModal>

                <PdfControllerPattern
                    scene={this.props.scene}
                    tasks={this.props.tasks}
                    cameraPosition={this.props.cameraPosition}
                    result={(resultData)=>this.result(resultData)}
                    cancel={()=>this.cancel()}
                    show={this.state.showPdfControllerPattern}
                    goback={()=>this.closePatternDialog("pdf-controller")}
                />
                <WalkThroughPattern
                    scene={this.props.scene}
                    tasks={this.props.tasks}
                    cameraPosition={this.props.cameraPosition}
                    result={(resultData)=>this.result(resultData)}
                    cancel={()=>this.cancel()}
                    show={this.state.showWalkthroughPattern}
                    goback={()=>this.closePatternDialog("walkthrough")}
                />
                <VideoControllerPattern
                    scene={this.props.scene}
                    tasks={this.props.tasks}
                    cameraPosition={this.props.cameraPosition}
                    result={(resultData)=>this.result(resultData)}
                    cancel={()=>this.cancel()}
                    show={this.state.showVideoControllerPattern}
                    goback={()=>this.closePatternDialog("video-controller")}
                />

            </div>
        );
    }
}
