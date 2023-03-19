import React from "react";
import ReactModal from "react-modal";
import "../../styles/DialogManager.css"




export default class ListSelectionDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showError:false,
            errorMessage:"",

            showWarning:false,
            warningMessage:"",

            searchValue:"", // a search value to filter the entities
            selectedElement:null, //the current selected entity
        };
    }

    createElementList(filterName){
        let allElements=this.props.list;
        let elementList=[];
        for (let index=0; index<allElements.length;index++){
            let element=allElements[index];
            if(element.name.toLowerCase().includes(filterName.toLowerCase())){
                elementList.push((
                    <button key={index} onClick={()=>{this.setState({selectedElement:this.props.list[index]})}}>
                        {element.name}
                    </button>
                ))
            }
        }
        return elementList
    }

    result(event,selectedElement){
        event.preventDefault();
        this.setState({
            searchValue:"",
        })
        this.props.result(selectedElement)
    }
    cancel(){
        this.setState({
            searchValue:"",
        })
        this.props.cancel()
    }


    render() {

        let elementList=this.createElementList(this.state.searchValue);
        return (

            <ReactModal
                className="dialog-Modal" //style class
                overlayClassName="dialog-Overlay"
                isOpen={this.props.show} //this state handles the visibility
                contentLabel={"Select an Entity"}>
                <div className="dialog-Panel">
                    <div className="dialog-Panel-Headline">
                        <h2>
                            Select an Element
                        </h2>
                    </div>
                    <div className="dialog-Panel-Description">
                        <span>
                           Select an element from the list
                        </span>
                    </div>
                    <div className="dialog-Panel-Content">
                        <form onSubmit={(e) => {this.result(e,this.state.selectedElement)}}>
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
                                <button type="button" onClick={() => this.cancel()}>Cancel</button>
                                <button id="upload-media-submit" type="submit" disabled={!this.state.selectedElement}>Select</button>
                            </div>
                        </form>
                    </div>
                </div>
            </ReactModal>
        );
    }
}
