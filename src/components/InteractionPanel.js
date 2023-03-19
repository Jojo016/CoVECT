import React from "react";
import '../styles/InteractionPanel.css';
import addSymbol from "../assets/navigation/add-buttonBlack.png";
import Entity from "../data/Entity";

export default class InteractionPanel extends React.Component {
    constructor(props) {
        super(props);
        if(this.props.scene.length>1){
            let firstEffect=this.props.scene[0].getEffects()[0]; //selects the first effect in the list
            let effectParameters=this.fillEffectParameters(firstEffect.parameterList);
            this.state={
                chosenTarget:this.props.scene[0],
                chosenEvent:this.props.scene[0].getEvents()[0],
                chosenEventDescription:null,
                chosenModule:firstEffect.module,
                chosenModuleOptions:firstEffect.options,
                chosenEffect:firstEffect.id,
                chosenEffectDescription:firstEffect.printName,
                chosenEffectValues:effectParameters
            };
        }
    }
    initInteractionPanel(scene){
        let firstEffect=scene[0].getEffects()[0]; //selects the first effect in the list
        let effectParameters=this.fillEffectParameters(firstEffect.parameterList);
        this.setState({
            chosenTarget:scene[0],
            chosenEvent:scene[0].getEvents()[0],
            chosenEventDescription:null,
            chosenModule:firstEffect.module,
            chosenModuleOptions:firstEffect.options,
            chosenEffect:firstEffect.id,
            chosenEffectDescription:firstEffect.printName,
            chosenEffectValues:effectParameters
        });
    }

    fillEffectParameters(parameterList){
        let effectParameters=[];
        for(let i=0;i<parameterList.length;i++){
            effectParameters=effectParameters.concat(parameterList[i].value);
        }
        return effectParameters;
    }

    updateChosenEventAfterSelectionEntity(newSelection){
        let chosenEventContainedInNewSelection=false;
        let eventList=newSelection.getEvents();
        for (let i=0; i < eventList.length;i++){
            if (eventList[i].value===this.state.chosenEvent){
                chosenEventContainedInNewSelection=true;
            }
        }
        if(!chosenEventContainedInNewSelection){ //event is not contained and will be changed to the first event in the list
            this.setState({
                chosenEvent:eventList[0].value,
                chosenEventDescription:eventList[0].printName,
            })
        }

    }

    updateChosenTargetAfterDeletionInScenegraph(deletedEntity){
        if(deletedEntity===this.state.chosenTarget){ //deleted entity is selected as target
            const newTarget = this.props.scene[0];
            this.updateChosenTarget(newTarget);
        }
    }

    updateChosenTarget(newTarget){
        if (this.searchIndexOfChosenEffect(this.state.chosenEffect,newTarget,)<0){ //Effect is not possible in the new target
            const effect =newTarget.getEffects()[0];
            const paramlist=this.fillEffectParameters(effect.parameterList);
            this.setState({
                chosenTarget:newTarget,
                chosenModule:effect.module,
                chosenModuleOptions:effect.options,
                chosenEffect:effect.id,
                chosenEffectValues:paramlist,
                chosenEffectDescription:effect.printName,
            });
        }
        else{ //Effect is possible in new target
            this.setState({
                chosenTarget:newTarget,
            });
        }
    }

    handleChosenTarget(event){
        let chosenTargetName=event.target.value;
        event.preventDefault()
        //let target=this.searchElementInSceneList(e.target.value);
        const indexOfTarget=this.searchIndexOfChosenTarget(chosenTargetName);
        const newTarget=this.props.scene[indexOfTarget];
        this.updateChosenTarget(newTarget);
    }

    handleChosenEvent(event,eventList){
        event.preventDefault()
        //let target=this.searchElementInSceneList(e.target.value);
        let chosenEvent=event.target.value;
        let description=event.target.options[event.target.selectedIndex].text
        for(let index=0; index <eventList.length;index++){
            if(chosenEvent===eventList[index].value){
                description=eventList[index].printName;
            }
        }

        this.setState({
            chosenEvent:chosenEvent,
            chosenEventDescription:description,
        });
    }

    handleChosenEffect(event,indexOfTarget){
        //let target=this.searchElementInSceneList(e.target.value);
        event.preventDefault()
        let chosenEffect=event.target.value;
        let indexOfEffect=this.searchIndexOfChosenEffect(chosenEffect,indexOfTarget,);
        let effectData=this.props.scene[indexOfTarget].getEffects()[indexOfEffect];
        let paramlist=this.fillEffectParameters(effectData.parameterList);
        this.setState({
            chosenModule:effectData.module,
            chosenModuleOptions:effectData.options,
            chosenEffect:chosenEffect,
            chosenEffectDescription: event.target.options[event.target.selectedIndex].text,
            chosenEffectValues:paramlist,
        });
    }



    searchIndexOfChosenTarget(targetName){
        for(let i=0; i<this.props.scene.length;i++){
            if(targetName===this.props.scene[i].getID()){
                return i;
            }
        }
        return -1;
    }

    handleChangeInEffectValue(index,value){
        let effectValues=this.state.chosenEffectValues.slice();
        effectValues[index]=value;
        this.setState({
            chosenEffectValues:effectValues,
            }
        );
    }

    searchIndexOfChosenEffect(effectName,target){ //the target can either be an Entity object or an index
        let effectList=null;
        if(target>=this.props.scene.length || target<0){ //index is not in range of the scene
            return -1;
        }
        if(target instanceof Entity){
            effectList=target.getEffects();
        }
        else{
            effectList=this.props.scene[target].getEffects();
        }

        for(let i=0; i<effectList.length;i++){
            if(effectName===effectList[i].id){
                return i;
            }
        }
        return -1;
    }

    getTutorialHighlightClass(element){
        if(this.props.showHighlightTutorial){
            if(element===this.props.highlightTutorialInteractionElement){
                return " interaction-panel-tutorial-highlight-element";
            }
        }
        return "";
    }


    render() {
        if(this.props.selectedElement==null || !(this.props.selectedElement instanceof Entity)){
            return (
                <div className={"interaction-panel"+ (this.props.showHighlightTutorial?" interaction-panel-tutorial-highlight":"")}>
                    <div className="interaction-panel-no-selection">
                        <span> No entity is selected</span>
                    </div>
                </div>
            );
        }
        else {
            const targetIndex=this.searchIndexOfChosenTarget(this.state.chosenTarget.getID());
            const effectIndex=this.searchIndexOfChosenEffect(this.state.chosenEffect, targetIndex);
            if(targetIndex<0||effectIndex<0){
                return (
                    <div className="interaction-panel">
                        <div className="interaction-panel-no-selection">
                            <span> Error</span>
                        </div>
                    </div>
                );
            }
            const selectableTargets=this.props.scene.map((object, move) => {
                return (
                    <option key={move} value={object.getID()}>
                        {object.getName()}
                    </option>
                );
            });
            const selectableEvents = this.props.selectedElement.getEvents().map((object, move) => {
                 return (
                     <option key={move+"_"+this.props.selectedElement.getName()} value={object.value}>
                         {object.printName + " " + this.props.selectedElement.getName()}
                     </option>
                 );
            });
            const selectableEffects=this.props.scene[targetIndex].getEffects().map((object, move) => {
                return (
                    <option key={move} value={object.id}>
                        {object.printName}
                    </option>
                );
            });
            const selectedEffectsParameters=this.props.scene[targetIndex].getEffects()[effectIndex].parameterList.map((object, move) => {
                if(object.inputType==="checkbox"){
                    return (
                        <div className="interaction-panel-effect-element"
                             key={this.state.chosenTarget.getID()+object.name}>
                        <span>
                            {object.printName+":"}
                        </span>
                        <input
                            type={object.inputType}
                            name={object.name}
                            checked={this.state.chosenEffectValues[move]}
                            onChange={(e) => this.handleChangeInEffectValue(move,e.target.checked)}/>
                        </div>
                    );
                }
                return (
                    <div className="interaction-panel-effect-element"
                         key={this.state.chosenTarget.getID()+object.name}>
                        <span>
                            {object.printName+":"}
                        </span>
                        <input
                               type={object.inputType}
                               value={this.state.chosenEffectValues[move]}
                               step={object.step}
                               min={object.min}
                               max={object.max}
                               onChange={(e)=>this.handleChangeInEffectValue(move,e.target.value)}/>
                    </div>
                );
            });
            return (
                <div className={"interaction-panel" + (this.props.showHighlightTutorial?" interaction-panel-tutorial-highlight":"")}>
                    <div className={"interaction-panel-headline" + this.getTutorialHighlightClass("complex")}>
                    <span>Create an Interaction:</span>
                    <button onClick={()=>this.props.createComplexInteraction(
                        this.props.selectedElement,
                        this.state.chosenEvent,
                        this.state.chosenTarget,
                        this.state.chosenEffect,
                        this.state.chosenEffectValues,
                        this.state.chosenModule,
                        this.state.chosenModuleOptions)}
                    >
                        {/*<img alt="add" src={addSymbol}/>*/}
                        <span>Complex</span>
                    </button>
                    </div>
                    <div className={"interaction-panel-element" + this.getTutorialHighlightClass("source")}>
                        <span className="interaction-panel-element-headline">
                            Source:
                        </span>
                        <span>
                            {this.props.selectedElement.getName()}
                        </span>
                    </div>
                    <div className={"interaction-panel-element interaction-panel-divider"+ this.getTutorialHighlightClass("event")}>
                        <span className="interaction-panel-element-headline">
                            Event:
                        </span>
                        <select
                                value={this.state.chosenEvent}
                                onChange={(e)=> this.handleChosenEvent(e,this.props.selectedElement.getEvents())}>
                            {selectableEvents}
                        </select>
                    </div>
                    <div className={"interaction-panel-element"+ this.getTutorialHighlightClass("target")}>
                        <span className="interaction-panel-element-headline">
                            Target:
                        </span>
                        <select
                                value={this.state.chosenTarget.getID()}
                                onChange={(e)=> this.handleChosenTarget(e)}>
                            {selectableTargets}
                        </select>
                    </div>
                    <div className={"interaction-panel-element interaction-panel-divider"+ this.getTutorialHighlightClass("effect")}>
                        <span className="interaction-panel-element-headline">
                            Effect:
                        </span>
                        <select
                                value={this.state.chosenEffect}
                                onChange={(e)=> this.handleChosenEffect(e,targetIndex)}>
                            {selectableEffects}
                        </select>
                    </div>
                    <div className={"interaction-panel-effect interaction-panel-divider" + this.getTutorialHighlightClass("values")}>
                            {selectedEffectsParameters}
                    </div>
                    <div className={"interaction-panel-button"+ this.getTutorialHighlightClass("save")}>
                        <button onClick={()=>this.props.onAddInteraction(
                            this.state.chosenEventDescription +" "+ this.props.selectedElement.getName() +" to " + this.state.chosenEffectDescription +" of ", // name of the target is added in the getName method
                            this.props.selectedElement,
                            this.state.chosenTarget,
                            this.state.chosenEvent,
                            this.state.chosenModule,
                            this.state.chosenModuleOptions,
                            this.state.chosenEffect,
                            this.state.chosenEffectValues
                        )}>
                            <img alt="add" src={addSymbol}/>
                            <span>Add Simple Interaction</span>
                        </button>
                    </div>
                </div>
            );
        }
    }
}