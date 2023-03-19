import React from "react";
import XMLParser from "react-xml-parser";
import '../styles/AddPanel.css';

//data classes
import Box from "../data/Geometry/Box";
import Sphere from "../data/Geometry/Sphere";
import Plane from "../data/Geometry/Plane";
import Tetrahedron from "../data/Geometry/Tetrahedron";
import Cylinder from "../data/Geometry/Cylinder";
import Model from "../data/Model/Model";
import Texture from "../data/Texture";
import ObjModel from "../data/Model/ObjModel";
import Image from "../data/Media/Image";
import PointLight from "../data/Light/PointLight";
import SpotLight from "../data/Light/SpotLight";
import Text from "../data/Text";

//assets
import tabOpened from "../assets/navigation/tab-opened.png";
import tabClosed from "../assets/navigation/tab-closed.png";
import addSymbol from "../assets/navigation/add-button.png";
import Pdf from "../data/Media/Pdf";
import Video from "../data/Media/Video";
import TaskBar from "../data/Task/TaskBar";
import CounterElement from "../data/Interaction/CounterElement";
import ButtonElement from "../data/Interaction/ButtonElement";
import PressurePlate from "../data/Interaction/PressurePlate";


export default class AddPanel extends React.Component {
    constructor(props) {
        super(props);
        fetch("/serverModels.xml") //get xml file from the server
            .then((response) => response.text())
            .then((responseText) =>
                {
                    let models = new XMLParser().parseFromString(responseText); //parse read xml file to a xml object
                    let countedCategories=0;
                    //starts at first children because the first Entry in the Xml is Models
                    models.children.map(function countCategory (entry){ //the amount of categories in the xml needs to be counted to set up the visibility array
                        if(entry.name==="Category"){
                            countedCategories++;
                        }
                        entry.children.map(countCategory) //recursive
                        return null;
                    })
                    let modelCategoryVisibility=new Array(countedCategories+1).fill(false) // creates a boolean array with a specific size
                    this.setState({
                        loadedModelsXml:models,
                        modelCategoryVisibility:modelCategoryVisibility,
                    });
                }
            );
        this.state = {
            geometryTabOpened: false,
            imageTabOpened:false,
            lightTabOpened:false,
            textTabOpened:false,
            navigationTabOpened:false,
            genNavigationTabOpened:false,
            taskTabOpened:false,
            interactionElementTabOpened:false,
            pdfTabOpened:false,
            playerHeight:1.6,
            playerWidth:0.5,
            playerMaxClimb:0.3,
            playerMaxAngle:45,
            textValue:"Text here",
            textColor:'#000000',
            textSize:100,
            textBackground:false,
            textBackgroundColor:'#ffffff',
            textPadding:0,
            videoTabOpened:false,
            loadedModelsXml:null,
            modelCategoryVisibility:[false,false], // first entry is the model category second is the custom category
            showTutorialHighlight:false,
        };
    }

    convertXMLToModelPanel(xmlElement){
        if(xmlElement===undefined||xmlElement===null/*||xmlElement.children===undefined||xmlElement.children.length<1*/){
            return;
        }
        let categoryIndex=1; //this index is used to give each category the index for their visibility state
        let addPanel=this; //this reference is needed because this cant be used in convert
        return xmlElement.children.map(
            function convert (entry, move) { //this function is named because it is recursive
                if (entry.name === "Model") { //entry is a model
                    let textures =[]
                    entry.children.map( //look for textures
                        (texture) => {
                            textures=textures.concat(new Texture(texture.attributes.name, texture.attributes.url,texture.attributes.materialName,))
                            return null;
                        }
                    )
                    let keyModel=entry.attributes.name+"model"+move+"cat"+categoryIndex;
                    if (entry.attributes.type === "obj") { //an obj model has a geometry url and material url and is treated different
                        return (
                            <button type="button" key={keyModel} onClick={() => addPanel.props.addElementToScene(new ObjModel(entry.attributes.type, entry.attributes.url, entry.attributes.material,false,textures),true,{autoscale:(entry.attributes.autoscale==="true")})}>{entry.attributes.name}</button>
                        );
                    }
                    return ( // all other supported models only have one url
                        <button type="button" key={keyModel} onClick={() => addPanel.props.addElementToScene(new Model(entry.attributes.type, entry.attributes.url,false,textures),true,{autoscale:(entry.attributes.autoscale==="true")})}>{entry.attributes.name}</button>
                    );
                }
                //otherwise it is a category
                categoryIndex++; //the index has to be increased
                let index=categoryIndex; //the index needs to be a locale variable because otherwise the final
                let keyDiv="Divcat"+index+"move"+move;
                return (
                    <div key={keyDiv} className="add-panel-category">
                        <button type="button"  className="add-panel-category-headline" onClick={() => addPanel.tabToggle("model",index)}>
                            <img alt="open/close tab" src={addPanel.state.modelCategoryVisibility[index]?tabOpened:tabClosed}/>
                            {entry.attributes.name}
                        </button>
                        <div className={addPanel.state.modelCategoryVisibility[index]?"add-panel-shown":"add-panel-hidden"}>
                            {entry.children.length>0?entry.children.map(convert):null}
                        </div>
                    </div>
                );
            });
    }

    tabToggle(value, index) {
        switch (value) {
            case "genNavigation":
                this.setState(
                    {
                        genNavigationTabOpened:!this.state.genNavigationTabOpened,
                    }
                )
                break;
            case "geometry":
                this.setState(
                    {
                        geometryTabOpened:!this.state.geometryTabOpened,
                    }
                )
                break;
            case "image":
                this.setState(
                    {
                        imageTabOpened:!this.state.imageTabOpened,
                    }
                )
                break;
            case "interactionElement":
                this.setState(
                    {
                        interactionElementTabOpened:!this.state.interactionElementTabOpened,
                    }
                )
                break;
            case "light":
                this.setState(
                    {
                        lightTabOpened:!this.state.lightTabOpened,
                    }
                )
                break;
            case "model":
                    const categories = this.state.modelCategoryVisibility.slice()
                    categories[index]=!categories[index];
                    this.setState(
                        {
                            modelCategoryVisibility: categories,
                        }
                    )
                break;
            case "navigation":
                this.setState(
                    {
                        navigationTabOpened:!this.state.navigationTabOpened,
                    }
                )
                break;
            case "pdf":
                this.setState(
                    {
                        pdfTabOpened:!this.state.pdfTabOpened,
                    }
                )
                break;
            case "task":
                this.setState(
                    {
                        taskTabOpened:!this.state.taskTabOpened,
                    }
                )
                break;
            case "text":
                this.setState(
                    {
                        textTabOpened:!this.state.textTabOpened,
                    }
                )
                break;
            case "video":
                this.setState(
                    {
                        videoTabOpened:!this.state.videoTabOpened,
                    }
                )
                break;
            default:
                break;
        }
    }

    getTutorialHighLightClassForCategory(category){
        if(this.props.showTutorialHighlights) {
            switch (category) {
                case "geometry":
                    if (this.props.highlightTutorialAddElement === "Box" || this.props.highlightTutorialAddElement === "Cylinder" || this.props.highlightTutorialAddElement === "Plane" || this.props.highlightTutorialAddElement === "Sphere" || this.props.highlightTutorialAddElement === "Tetrahedron") {
                        return " tutorial-highlight-element"
                    }
                    break;
                case "image":
                    if (this.props.highlightTutorialAddElement === "Image") {
                        return " tutorial-highlight-element"
                    }
                    break;
                case "interactionElement":
                    if (this.props.highlightTutorialAddElement === "Interaction"||this.props.highlightTutorialAddElement === "ButtonElement" || this.props.highlightTutorialAddElement === "CounterElement" || this.props.highlightTutorialAddElement === "PressurePlate") {
                        return " tutorial-highlight-element"
                    }
                    break;
                case "light":
                    if (this.props.highlightTutorialAddElement === "PointLight" || this.props.highlightTutorialAddElement === "SpotLight") {
                        return " tutorial-highlight-element"
                    }

                    break;
                case "model":
                    if (this.props.highlightTutorialAddElement === "Model" || this.props.highlightTutorialAddElement === "ObjModel") {
                        return " tutorial-highlight-element"
                    }
                    break;
                case "navigation":
                    if (this.props.highlightTutorialAddElement === "NavMesh") {
                        return " tutorial-highlight-element"
                    }
                    break;
                case "pdf":
                    if (this.props.highlightTutorialAddElement === "Pdf") {
                        return " tutorial-highlight-element"
                    }
                    break;
                case "task":
                    if (this.props.highlightTutorialAddElement === "Task"||this.props.highlightTutorialAddElement === "TaskBar") {
                        return " tutorial-highlight-element"
                    }
                    break;
                case "text":
                    if (this.props.highlightTutorialAddElement === "Text") {
                        return " tutorial-highlight-element"
                    }
                    break;
                case "video":
                    if (this.props.highlightTutorialAddElement === "Video") {
                        return " tutorial-highlight-element"
                    }
                    break;
                default:
                    break;
            }
        }
        return ""
    }
    getTutorialHighLightClassForElement(element){
        if(this.props.showTutorialHighlights){
            if(this.props.highlightTutorialAddElement===element) {
                return " tutorial-highlight-element"
            }
        }
        return ""
    }

    render() {
        const modelsPanel=this.convertXMLToModelPanel(this.state.loadedModelsXml);
        const addedImages =this.props.userImages.map((object, move) => {
            const key="img"+move;
            return (
                <button type="button" key={key} onClick={() => this.props.addElementToScene(new Image(object.url,true),true)}>
                    {object.name}
                </button>
            );
        });
        const addedPdfs =this.props.userPdfs.map((object, move) => {
            const key="img"+move;
            return (
                <button type="button" key={key} onClick={() => this.props.addElementToScene(new Pdf(object.url,object.imageUrls,1,true),true)}>
                    {object.name}
                </button>
            );
        });
        const addedVideos =this.props.userVideos.map((object, move) => {
            const key="video"+move;
            return (
                <button type="button" key={key} onClick={() => this.props.addElementToScene(new Video(object.url,true),true)}>
                    {object.name}
                </button>
            );
        });
        const addedModels =this.props.userModels.map((object, move) => {
            const key="model"+move;
            if(object.modelType==="obj"){
                return (
                    <button type="button" key={key} onClick={() => this.props.addElementToScene(new ObjModel(object.modelType,object.url,object.materialUrl,true),true,object.loadOptions)}>
                        {object.name}
                    </button>
                );
            }
            return (
                <button type="button" key={key} onClick={() => this.props.addElementToScene(new Model(object.modelType,object.url,true),true,object.loadOptions)}>
                    {object.name}
                </button>
            );
        });

        return (
            <div className={"add-panel" + (this.props.showTutorialHighlights?" tutorial-highlight":"")}>
                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("geometry")}>
                    <button type="button" className="add-panel-category-headline" onClick={()=>this.tabToggle("geometry")}>
                        <img alt="open/close tab" src={this.state.geometryTabOpened? tabOpened: tabClosed}/>
                        Geometry
                    </button>
                    <div className={this.state.geometryTabOpened? "add-panel-shown" : "add-panel-hidden"}>
                        <button type="button" className={this.getTutorialHighLightClassForElement("Box")} onClick={() => this.props.addElementToScene(new Box (),false)}>Box</button>
                        <button type="button" className={this.getTutorialHighLightClassForElement("Cylinder")} onClick={() => this.props.addElementToScene(new Cylinder(),false)}>Cylinder</button>
                        <button type="button" className={this.getTutorialHighLightClassForElement("Plane")} onClick={() => this.props.addElementToScene(new Plane(),false)}>Plane</button>
                        <button type="button" className={this.getTutorialHighLightClassForElement("Sphere")} onClick={() => this.props.addElementToScene(new Sphere(),false)}>Sphere</button>
                        <button type="button" className={this.getTutorialHighLightClassForElement("Tetrahedron")} onClick={() => this.props.addElementToScene(new Tetrahedron(),false)}>Tetrahedron</button>
                    </div>
                </div>

                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("image")}>
                    <div className="add-panel-category-headline">
                        <div className="add-panel-combined-element">
                            <button type="button" className="add-panel-category-headline"  onClick={()=>this.tabToggle("image")}>
                                <img className={this.props.userImages.length>0?"":"dropdown-invisible"} alt="open/close tab" src={this.state.imageTabOpened? tabOpened: tabClosed}/>
                                Image

                            </button>
                            <button type="button" className="add-panel-add-button" onClick={()=> this.props.uploadMediaToEditor("image")}>
                                <img alt="upload an image" src={addSymbol} />
                            </button>
                        </div>
                    </div>
                    <div className={this.state.imageTabOpened? "add-panel-shown" : "add-panel-hidden"}>
                        {addedImages}
                    </div>
                </div>

                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("interactionElement")}>
                    <div className="add-panel-combined-element">
                        <button type="button" className="add-panel-category-headline" onClick={()=>this.tabToggle("interactionElement")}>
                            <img alt="open/close tab" src={this.state.interactionElementTabOpened? tabOpened: tabClosed}/>
                            Interaction
                        </button>
                        <button type="button" className="add-panel-add-button add-panel-category-headline" onClick={() => this.props.createInteractionPattern()}>
                            {/*<img alt="upload a pdf" src={addSymbol} />*/}
                            Pattern
                        </button>
                    </div>
                    <div className={this.state.interactionElementTabOpened? "add-panel-shown" : "add-panel-hidden"}>
                        <button type="button" className={this.getTutorialHighLightClassForElement("ButtonElement")} onClick={() => this.props.addElementToScene(new ButtonElement(),false)}>Button</button>
                        <button type="button" className={this.getTutorialHighLightClassForElement("CounterElement")} onClick={() => this.props.addElementToScene(new CounterElement(),true)}>Counter</button>
                        <button type="button" className={this.getTutorialHighLightClassForElement("PressurePlate")} onClick={() => this.props.addElementToScene(new PressurePlate(),false)}>Pressure Plate</button>
                    </div>
                </div>

                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("light")}>
                    <button type="button" className="add-panel-category-headline" onClick={()=>this.tabToggle("light")}>
                        <img alt="open/close tab" src={this.state.lightTabOpened? tabOpened: tabClosed}/>
                        Light
                    </button>
                    <div className={this.state.lightTabOpened? "add-panel-shown" : "add-panel-hidden"}>
                        <button className={this.getTutorialHighLightClassForElement("PointLight")} type="button" onClick={() => this.props.addElementToScene(new PointLight(),false)}>Point Light</button>
                        <button className={this.getTutorialHighLightClassForElement("SpotLight")} type="button" onClick={() => this.props.addElementToScene(new SpotLight(),false)}>Spot Light</button>
                    </div>
                </div>

                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("model")}>
                    <div className="add-panel-category-headline">
                        <div className="add-panel-combined-element">
                            <button type="button" className="add-panel-category-headline" onClick={()=>this.tabToggle("model",0)}>
                                <img alt="open/close tab" src={this.state.modelCategoryVisibility[0]? tabOpened: tabClosed}/>
                                Model

                            </button>
                            <button type="button" className="add-panel-add-button" onClick={()=> this.props.uploadMediaToEditor("model")}>
                                <img alt="upload a model" src={addSymbol} />
                            </button>
                        </div>
                    </div>
                    <div className={this.state.modelCategoryVisibility[0]? "add-panel-shown" : "add-panel-hidden"}>
                        <div className={this.props.userModels.length>0?"add-panel-category":"add-panel-hidden"} >
                            <button type="button"  className="add-panel-category-headline" onClick={() => this.tabToggle("model",1)}>
                                <img alt="open/close tab"  src={this.state.modelCategoryVisibility[1]?tabOpened:tabClosed}/>
                                Custom Models
                            </button>
                            <div className={this.state.modelCategoryVisibility[1]?"add-panel-shown":"add-panel-hidden"}>
                                {addedModels}
                            </div>
                        </div>
                        {modelsPanel}
                    </div>
                </div>

                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("navigation")}>
                    <div className="add-panel-combined-element">
                        <button type="button" className="add-panel-category-headline" onClick={()=>this.tabToggle("navigation")}>
                            <img alt="open/close tab" src={this.state.navigationTabOpened? tabOpened: tabClosed}/>
                            Navigation
                        </button>
                        <button type="button" className="add-panel-add-button" onClick={() => this.props.uploadMediaToEditor("navigation")}>
                            <img alt="upload a pdf" src={addSymbol} />
                        </button>
                    </div>
                    <div className={this.state.navigationTabOpened? "add-panel-shown" : "add-panel-hidden"}>
                        <div className={"add-panel-text-panel"}>
                            <div className="add-panel-text-panel-element">
                                <span className="add-panel-text-panel-element-left">Player Height:</span>
                                <input className="add-panel-text-panel-element-right" type="number" step="0.1" value={this.state.playerHeight} onChange={(event)=>this.setState({playerHeight:event.target.value})}/>
                            </div>
                            <div className="add-panel-text-panel-element">
                                <span className="add-panel-text-panel-element-left">Player Width:</span>
                                <input className="add-panel-text-panel-element-right" type="number" step="0.1" value={this.state.playerWidth} onChange={(event)=>this.setState({playerWidth:event.target.value})}/>
                            </div>
                            <div className="add-panel-text-panel-element">
                                <span className="add-panel-text-panel-element-left">Step Climb:</span>
                                <input className="add-panel-text-panel-element-right" type="number" step="0.1" value={this.state.playerMaxClimb} onChange={(event)=>this.setState({playerMaxClimb:event.target.value})}/>
                            </div>
                            <div className="add-panel-text-panel-element">
                                <span className="add-panel-text-panel-element-left">Slope Angle:</span>
                                <input className="add-panel-text-panel-element-right" type="number" step="1" value={this.state.playerMaxAngle} onChange={(event)=>this.setState({playerMaxAngle:event.target.value})}/>
                            </div>
                            <div className="add-panel-text-panel-element">
                                <button className="add-panel-text-panel-element-both" onClick={() => this.props.createNavMesh(this.state.playerHeight,this.state.playerWidth,this.state.playerMaxClimb,this.state.playerMaxAngle)}>Generate</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("pdf")}>
                    <div className="add-panel-category-headline">
                        <div className="add-panel-combined-element">
                            <button type="button" className="add-panel-category-headline" onClick={()=>this.tabToggle("pdf")}>
                                <img className={this.props.userPdfs.length>0?"":"dropdown-invisible"} alt="open/close tab" src={this.state.pdfTabOpened? tabOpened: tabClosed}/>
                                PDF

                            </button>
                            <button type="button" className="add-panel-add-button" onClick={()=> this.props.uploadMediaToEditor("pdf")}>
                                <img alt="upload a pdf" src={addSymbol} />
                            </button>
                        </div>
                    </div>
                    <div className={this.state.pdfTabOpened? "add-panel-shown" : "add-panel-hidden"}>
                        {addedPdfs}
                    </div>
                </div>

                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("task")}>
                    <div className="add-panel-category-headline">
                        <div className="add-panel-combined-element">
                            <button type="button" className="add-panel-category-headline" onClick={()=>this.tabToggle("task")}>
                                <img alt="open/close tab"  src={this.state.taskTabOpened? tabOpened: tabClosed}/>
                                Task

                            </button>
                            <button type="button" className="add-panel-add-button add-panel-category-headline" onClick={()=> this.props.createTask()}>
                                {/*<img alt="create a task" src={addSymbol} />*/}
                                New
                            </button>
                        </div>
                    </div>
                    <div className={this.state.taskTabOpened? "add-panel-shown" : "add-panel-hidden"}>
                        <button type="button" className={this.getTutorialHighLightClassForElement("TaskBar")} onClick={() => this.props.addElementToScene(new TaskBar(),true)}>Task Bar</button>
                    </div>
                </div>

                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("text")}>
                    <button className="add-panel-category-headline" onClick={()=>this.tabToggle("text")}>
                        <img alt="open/close tab" src={this.state.textTabOpened? tabOpened: tabClosed}/>
                        Text
                    </button>
                    <div className={this.state.textTabOpened? "add-panel-shown" : "add-panel-hidden"}>
                        <div className={"add-panel-text-panel"}>
                            <div className={"add-panel-text-panel-element"+ this.getTutorialHighLightClassForElement("Text")} >
                                <textarea className="add-panel-text-panel-element-both" value={this.state.textValue} onChange={(event)=>this.setState({textValue:event.target.value})}/>
                            </div>
                            <div className="add-panel-text-panel-element">
                                <span className="add-panel-text-panel-element-left">Color:</span>
                                <input className="add-panel-text-panel-element-right" type="color" value={this.state.textColor} onChange={(event)=>this.setState({textColor:event.target.value})}/>
                            </div>
                            <div className="add-panel-text-panel-element">
                                <span className="add-panel-text-panel-element-left">Size:</span>
                                <input className="add-panel-text-panel-element-right" type="number" step="1" value={this.state.textSize} onChange={(event)=>this.setState({textSize:event.target.value})}/>
                            </div>
                            <div className="add-panel-text-panel-element">
                                <input className="add-panel-text-panel-element-left" type="checkbox" checked={this.state.textBackground} onChange={(event)=>this.setState({textBackground:event.target.checked})}/>
                                <span className="add-panel-text-panel-element-right">Background</span>
                            </div>
                            <div className={this.state.textBackground?"add-panel-text-panel-element":"add-panel-hidden"}>
                                <span className="add-panel-text-panel-element-left">Color:</span>
                                <input className="add-panel-text-panel-element-right" type="color" step="1" value={this.state.textBackgroundColor} onChange={(event)=>this.setState({textBackgroundColor:event.target.value})}/>
                            </div>
                            <div className={this.state.textBackground?"add-panel-text-panel-element":"add-panel-hidden"}>
                                <span className="add-panel-text-panel-element-left">Padding:</span>
                                <input className="add-panel-text-panel-element-right" type="number" step="1" value={this.state.textPadding} onChange={(event)=>this.setState({textPadding:event.target.value})}/>
                            </div>
                            <div className={"add-panel-text-panel-element"+ this.getTutorialHighLightClassForElement("Text")}>
                                <button className={"add-panel-text-panel-element-both"} onClick={()=>{this.props.addElementToScene(new Text(this.state.textValue,"/fonts/Roboto_Regular.json",this.state.textColor,this.state.textSize,this.state.textBackground,this.state.textPadding,this.state.textBackgroundColor),true)}}>Add Text</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={"add-panel-category"+this.getTutorialHighLightClassForCategory("video")}>
                    <div className="add-panel-category-headline">
                        <div className="add-panel-combined-element">
                            <button type="button" className="add-panel-category-headline" onClick={()=>this.tabToggle("video")}>
                                <img className={this.props.userVideos.length>0?"":"dropdown-invisible"} alt="open/close tab" src={this.state.videoTabOpened? tabOpened: tabClosed}/>
                                Video

                            </button>
                            <button type="button" className="add-panel-add-button" onClick={()=> this.props.uploadMediaToEditor("video")}>
                                <img alt="upload a video" src={addSymbol} />
                            </button>
                        </div>
                    </div>
                    <div className={this.state.videoTabOpened? "add-panel-shown" : "add-panel-hidden"}>
                        {addedVideos}
                    </div>
                </div>
            </div>
        );
    }
}