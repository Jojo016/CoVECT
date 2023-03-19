import React from "react";
import '../styles/DetailsPanel.css';

export default class DetailsPanel extends React.Component {

    checkIfEnterPressedBeforeChangeValue(event,selectedElement,variableName){
        if(event.key==="Enter"){
            this.props.onChangeValue(selectedElement, variableName, event.target.value)
        }

    }

    parameterInputMethod(detailParameter, selectionList){
        if (detailParameter.inputType === "checkbox") { //if the input type is text, the change will be submitted after losing focus
            return (
                <input
                    type={detailParameter.inputType}
                    name={detailParameter.name}
                    checked={detailParameter.value}
                    onChange={(e) => this.props.onChangeValue(this.props.selectedElement, detailParameter.name, e.target.checked)}/>
            );
        }
        if (detailParameter.inputType === "text") { //if the input type is text, the change will be submitted after losing focus
            return (
                <input
                    type={detailParameter.inputType}
                    name={detailParameter.name}
                    defaultValue={detailParameter.value}
                    onBlur={(e) => this.props.onChangeValue(this.props.selectedElement, detailParameter.name, e.target.value)}
                    onKeyUp={(e)=>this.checkIfEnterPressedBeforeChangeValue(e,this.props.selectedElement, detailParameter.name)}/>
            );
        }
        if (detailParameter.inputType === "textarea") { //if the input type is text, the change will be submitted after losing focus
            return (
                <textarea
                    name={detailParameter.name}
                    defaultValue={detailParameter.value}
                    onBlur={(e) => this.props.onChangeValue(this.props.selectedElement, detailParameter.name, e.target.value)}
                />
            );
        }
        if (detailParameter.inputType === "button") { //if the input type is text, the change will be submitted after losing focus
            return (
                <button
                    onClick={() => this.props.onChangeValue(this.props.selectedElement ,detailParameter.name,detailParameter.value, detailParameter.type)}
                >{detailParameter.name}</button>
            );
        }
        if (detailParameter.inputType === "select") { //if the input type is text, the change will be submitted after losing focus
            let selection=null;

            if(selectionList){
                for (let index=0;index<selectionList.length;index++){
                    if(detailParameter.name===selectionList[index].selectionName){
                        selection=selectionList[index].selection;
                    }
                }
            }
            return (
                <select
                    value={detailParameter.value}
                    onChange={(e) => this.props.onChangeValue(this.props.selectedElement, detailParameter.name, e.target.value,detailParameter.type)}>
                    {selection}
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
                    onChange={(e) => this.props.onChangeValue(this.props.selectedElement, detailParameter.name, e.target.value)}/>
            );
        }
    }

    renderDetail(detail,move,selectionList){
        let highlightValue=""
        if(this.props.showHighlightTutorial){
            if(this.props.highlightTutorialElement===detail.name){
                highlightValue=" details-panel-tutorial-highlight-element"
            }
        }
        return (
            //the key needs to be unique for each element in the scenegraph otherwise the defaultValue won't be rerendered
            <div className={"details-parameter" + highlightValue} key={this.props.selectedElement.getID() + detail.name + move}>
                            <span
                                className="details-parameter-headline"
                            >
                                {detail.printName}:
                            </span>
                {this.parameterInputMethod(detail,selectionList)}
            </div>

        );
    }



    render() {
        let tutorialClass="";
        if(this.props.showHighlightTutorial){
            tutorialClass=" details-panel-tutorial-highlight"
        }
        if(this.props.selectedElement==null){ //no element is selected and no detail can be shown
            return (
                <div className={"details-panel" +tutorialClass}>
                    <div className="details-no-selection">
                        <span> Nothing is selected</span>
                    </div>
                </div>
            );
        }
        else {
            let selectionList=[];
            let customTexturesSelection=this.props.customTextures.map((texture,move)=>{ // create texture selection
                    return (
                        <option key={move} value={texture.id}>
                            {texture.name}
                        </option>
                    );
                });
            customTexturesSelection=customTexturesSelection.concat(( // add no selection
                <option key="noTexture" value="undefined">
                    no texture
                </option>
            ))
            selectionList.push({selectionName:"custom-texture", selection:customTexturesSelection}) // put selection in the list

            let taskSelection=this.props.taskList.map((task,move)=>{ // create task selection
                return (
                    <option key={move} value={task.getID()}>
                        {task.getName()}
                    </option>
                );
            });

            taskSelection=taskSelection.concat(( // add no task to the selection
                <option key="noTask" value="undefined">
                    no task
                </option>
            ))
            selectionList.push({selectionName:"all-tasks", selection:taskSelection}) // put selection in the list

            const showDetails = this.props.selectedElement.getDetails().map((detail, move) => {
                if(detail.printName){//detail is a simple detail
                    let highlightSingle=""
                    if(this.props.showHighlightTutorial){
                        if(this.props.highlightTutorialElement===detail.name){
                            highlightSingle=" details-panel-tutorial-highlight-element"
                        }
                    }
                    return(
                        <div
                            className={"details-category " + (move%2===0?"":"details-list-second") + highlightSingle}
                            key={this.props.selectedElement.getID() +detail.printName}
                        >
                            <div
                                className={"details-category-content-one-parameter"}
                            >
                                <span
                                    className="details-category-headline"
                                >
                                    <b>{detail.printName}</b>
                                </span>
                                <div className="details-parameter details-no-grid" key={this.props.selectedElement.getID() + detail.name + move}>
                                    {this.parameterInputMethod(detail,selectionList)}
                                </div>
                            </div>
                        </div>
                    )
                }
                if(detail.categoryName){//detail is a combined detail
                    let highlightCategory=""
                    if(this.props.showHighlightTutorial){
                            if(this.props.highlightTutorialElement===detail.categoryName){
                                highlightCategory=" details-panel-tutorial-highlight-element"
                            }
                    }
                    return(
                        <div
                            className={"details-category " + (move%2===0?"":"details-list-second") +highlightCategory}
                            key={this.props.selectedElement.getID() +detail.categoryName+move}
                        >
                            <div
                                className={detail.containedElements.length===2?"details-category-content-two-parameters":"details-category-content"}
                            >
                                <span className={"details-category-headline"}>
                                    <b>{detail.categoryName}</b>
                                </span>
                                {detail.containedElements.map((detailParameter, move2) => {return this.renderDetail(detailParameter,move2,selectionList)})}
                            </div>
                        </div>

                    )
                }
                return null;
            });
            return (
                <div className={"details-panel" +tutorialClass}>

                    {showDetails}

                </div>
            );
        }
    }
}
