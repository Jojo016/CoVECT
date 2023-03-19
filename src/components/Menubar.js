import React from "react";
import '../styles/Menubar.css';
import XMLParser from "react-xml-parser";

export default class Menubar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

            hoveredElement:"", // shows the entity which is currently hovered in the viewport
        };
    }


    createExport(){
        this.props.exportOBJ()
    }

    createDemo(){
        let html= this.props.generateCode()
        let htmlFile = new Blob([html], {type: "application/html"});
        this.props.startDemo(htmlFile);
    }

    changeHoveredElement(entity){
        this.setState({
            hoveredElement:entity.getName(),
        })
    }

    removeHoveredElement(){
        this.setState({
            hoveredElement:"",
        })
    }

    render() {
        let highlightNew=""
        let highlightOpen=""
        let highlightSave=""
        let highlightSelected=""
        let highlightHovered=""
        let highlightDemo=""
        if(this.props.showTutorialHighlights){
            if(this.props.highlightTutorialElement) {
                switch (this.props.highlightTutorialElement) {
                    case "new":
                        highlightNew = " menu-tutorial-highlight-element"
                        break;
                    case "open":
                        highlightOpen = " menu-tutorial-highlight-element"
                        break;
                    case "save":
                        highlightSave = " menu-tutorial-highlight-element"
                        break;
                    case "selected":
                        highlightSelected = " menu-tutorial-highlight-element"
                        break;
                    case "hovered":
                        highlightHovered = " menu-tutorial-highlight-element"
                        break;
                    case "demo":
                        highlightDemo = " menu-tutorial-highlight-element"
                        break;
                    default:
                }
            }
        }
        const selection= this.props.selectedElement==null? "Nothing": this.props.selectedElement.getName();
         return (
            <div className="menubar">
                <div className="menu-control-buttons">
                    <button className={highlightNew} type="button" onClick={()=>this.props.onClickNew()}>New</button>
                    <button className={highlightOpen} type="button" onClick={()=>this.props.onClickOpen()}>Open</button>
                    <button className={highlightSave} type="button" onClick={()=>this.props.onClickSave()}>Save</button>
                    <button type="button" className={"menu-invisible"} onClick={()=>this.createExport()}>Export</button>
                </div>
                <div className="menu-selected-element-panel">
                    <div className={"menu-selected-element-panel-element" + highlightSelected}>
                        <span><b>Selected:</b></span>
                        <span className="menu-second">{selection}</span>
                    </div>
                    <div className={"menu-selected-element-panel-element" + highlightHovered}>
                    <span><b>Hovered:</b></span>
                    <span className="menu-second">{this.state.hoveredElement}</span>
                    </div>
                </div>
                <div className="menu-demo-panel">
                    <button className={highlightDemo} type="button" onClick={() => this.createDemo() }>Generate</button>
                </div>
            </div>
        );
    }
}