import React, {useRef, useEffect} from 'react'
import {Canvas, useResource} from 'react-three-fiber'
import {MapControls, TransformControls} from "drei"
import {DoubleSide, FrontSide, Vector3} from "three";

//style
import '../styles/Viewport.css';

//data classes
import Box from "../data/Geometry/Box";
import Cylinder from "../data/Geometry/Cylinder";
import Plane from "../data/Geometry/Plane";
import Sphere from "../data/Geometry/Sphere";
import Tetrahedron from "../data/Geometry/Tetrahedron";
import Model from "../data/Model/Model";
import ObjModel from "../data/Model/ObjModel";
import Image from "../data/Media/Image";
import PointLight from "../data/Light/PointLight";
import Light from "../data/Light/Light";
import DirectionalLight from "../data/Light/DirectionalLight";
import SpotLight from "../data/Light/SpotLight";
import Text from "../data/Text";
import NavMesh from "../data/Model/NavMesh";
import Camera from "../data/Camera";
import Pdf from "../data/Media/Pdf";
import Video from "../data/Media/Video";
import Activity from "../data/Task/Activity";
import TaskBar from "../data/Task/TaskBar";
import CounterElement from "../data/Interaction/CounterElement";
import ButtonElement from "../data/Interaction/ButtonElement";
import PressurePlate from "../data/Interaction/PressurePlate";
import ConditionInteraction from "../data/Interaction/ConditionInteraction";
import Condition from "../data/Interaction/Condition";



function EntityData(props) {
    let geometry=useRef();
    let entity=props.entityObject; //shorten code
    switch(entity.constructor){ //look at the class of the entity
        case Activity: //entity is a box
        case Condition:
            return(
                <>
                    <boxBufferGeometry
                        attach="geometry"
                        args={entity.getSize()} //set size (width, height, depth)
                    />
                    <meshStandardMaterial
                        attach="material"
                        opacity={0.5}
                        transparent={true}
                        color={entity.getColor()} //set color
                    />
                </>
            );
        case Box: //entity is a box
            return(
                <>
                    <boxBufferGeometry
                        attach="geometry"
                        args={entity.getSize()} //set size (width, height, depth)
                    />
                    <meshStandardMaterial
                        attach="material"
                        color={entity.getColor()} //set color
                        map={entity.getLoadedSource()}
                    />
                </>
            );
        case PressurePlate: //entity is a box
            return(
                <>
                    <boxBufferGeometry
                        attach="geometry"
                        args={entity.getSize()} //set size (width, height, depth)
                    />
                    <meshStandardMaterial
                        attach="material"
                        color={entity.getColor()} //set color
                    />
                    {/*<mesh position={entity.getAreaPosition()} scale={entity.getAreaScale()}>*/}
                    {/*    <boxBufferGeometry*/}
                    {/*        attach="geometry"*/}
                    {/*        args={entity.getAreaSize()} //set size (radius top, radius bottom, height, segments)*/}
                    {/*    />*/}
                    {/*    <meshStandardMaterial*/}
                    {/*        attach="material"*/}
                    {/*        opacity={0.5}*/}
                    {/*        transparent={true}*/}
                    {/*        color={"#d4d4d4"} //set color*/}
                    {/*    />*/}
                    {/*</mesh>*/}
                </>
            );

        case ButtonElement: //entity is a box
            return(
                <>
                    <boxBufferGeometry
                        attach="geometry"
                        args={[1,1,1]} //set size (width, height, depth)
                    />
                    <meshStandardMaterial
                        attach="material"
                        visible={false}
                    />
                    <mesh position={entity.getBottomPosition()}>
                    <boxBufferGeometry
                        attach="geometry"
                        args={entity.getSize()} //set size (width, height, depth)
                    />
                    <meshStandardMaterial
                        attach="material"
                        color={entity.getColor()} //set color
                    />
                    <mesh position={entity.getButtonPosition()}>
                        <cylinderBufferGeometry
                            attach="geometry"
                            args={entity.getButtonSize()} //set size (radius top, radius bottom, height, segments)
                        />
                        <meshStandardMaterial
                            attach="material"
                            color={entity.getButtonColor()} //set color
                        />
                    </mesh>
                    </mesh>
                </>
            );
            // return(
            //     <>
            //         <boxBufferGeometry
            //             attach="geometry"
            //             args={entity.getSize()} //set size (width, height, depth)
            //         />
            //         <meshStandardMaterial
            //             attach="material"
            //             color={entity.getColor()} //set color
            //         />
            //         <mesh position={entity.getButtonPosition()}>
            //             <cylinderBufferGeometry
            //                 attach="geometry"
            //                 args={entity.getButtonSize()} //set size (radius top, radius bottom, height, segments)
            //             />
            //             <meshStandardMaterial
            //                 attach="material"
            //                 color={entity.getButtonColor()} //set color
            //             />
            //         </mesh>
            //     </>
            // );
        case Cylinder: //entity is a cylinder
            return (
                <>
                    <cylinderBufferGeometry
                        attach="geometry"
                        args={entity.getSize()} //set size (radius top, radius bottom, height, segments)
                    />
                    <meshStandardMaterial
                        attach="material"
                        color={entity.getColor()} //set color
                        map={entity.getLoadedSource()}
                    />
                </>
            );
        case Plane: //entity is a Plane
            return(
                <>
                    <planeBufferGeometry
                        attach="geometry"
                        args={entity.getSize()} //set size (width, height)
                    />
                    <meshStandardMaterial
                        attach="material"
                        color={entity.getColor()} //set color
                        map={entity.getLoadedSource()}
                        side={entity.isDoubleSide()?DoubleSide:FrontSide} //both side rendered or only one
                    />
                </>
            );
        case Sphere: //entity is a Sphere
            return(
                <>
                    <sphereBufferGeometry
                        attach="geometry"
                        args={entity.getSize()} //set size (radius, width segments, height segments)
                    />
                    <meshStandardMaterial
                        attach="material"
                        color={entity.getColor()} // set color
                        map={entity.getLoadedSource()}
                    />
                </>
            );
        case Tetrahedron: // entity is a Tetrahedron
            return(
                <>
                    <tetrahedronBufferGeometry
                        attach="geometry"
                        args={entity.getSize()} //set size (radius, details)
                    />
                    <meshStandardMaterial
                        attach="material"
                        color={entity.getColor()} // set color
                        map={entity.getLoadedSource()}
                    />
                </>
            );
        case Text:
        case TaskBar:
        case CounterElement:
            return(
                <>
                    <textBufferGeometry ref={geometry} attach="geometry"
                        args={[
                            entity.getText(), //text to render
                            { //parameters
                                font: entity.getThreeFont(), // font geometry
                                size: entity.getSize(), //size of a letter
                                height:0, //0 is 2D
                            }]}
                    />
                    <meshStandardMaterial
                        attach="material"
                        color={entity.getColor()} //set color
                        side={FrontSide}
                    />
                </>
            );

        case Image:
        case Pdf:
        case Video:
            return(
                <>
                    <planeBufferGeometry
                        attach="geometry"
                        args={props.entityObject.getSize()}
                    />
                    <meshStandardMaterial
                        attach="material"
                        side={DoubleSide}
                        map={props.entityObject.getLoadedSource()}
                        transparent={true}
                    />
                </>
            );
        case Model:
        case ObjModel:
        case Camera:
            return(
                <primitive
                    object={props.entityObject.get3DModel()}
                    castShadow
                    receiveShadow
                />
            );
        case NavMesh:
            return(
                <primitive
                    object={props.entityObject.get3DModel()}
                    castShadow
                    receiveShadow
                />
            );
        default:
            return(
                <>
                </>
            );
    }
}

function LightEntity(props) {
    const [target,targetRef]=useResource();
    const [light,lightRef]=useResource();
    switch(props.entityObject.constructor){
        case PointLight:
            return (
                <pointLight
                    position={props.entityObject.getPosition()}
                    castShadow
                    color={props.entityObject.getColor()}
                    distance={props.entityObject.distance}
                    decay={2}
                    intensity={props.entityObject.intensity}
                    shadow-mapSize-width={512}
                    shadow-mapSize-height={512}
                    shadow-camera-far={500}
                    shadow-camera-near={0.5}
                    onDoubleClick={(event) => props.onSelection(event)} //selects element when user does a double click
                    onPointerOver={(event)=> props.onHover(event)}
                    visible={props.entityObject.isVisible()||props.showInvisibleMode}
                >
                    <mesh>
                        <sphereBufferGeometry
                            attach="geometry"
                            args={[0.2, 32, 32] }
                        />
                        <meshPhongMaterial
                            attach="material"
                            color={props.entityObject.color}
                        />
                    </mesh>
                </pointLight>
            );
        case SpotLight:
            return(
                <>
                    <mesh
                        ref={target}
                        position={[props.entityObject.targetX,props.entityObject.targetY,props.entityObject.targetZ]}
                        visible={props.entityObject.isVisible()||props.showInvisibleMode}
                    >
                        <sphereBufferGeometry
                            attach="geometry"
                            args={[0.05, 32, 32]}
                        />
                        <meshBasicMaterial
                            attach="material"
                            color="red"
                        />
                    </mesh>
                    {targetRef &&(
                        <spotLight
                            position={props.entityObject.getPosition()}
                            ref={light}
                            castShadow
                            rotation={props.entityObject.getRotation("radians")}
                            onDoubleClick={(event) => props.onSelection(event)} //selects element when user does a double click
                            onPointerOver={(event)=> props.onHover(event)}
                            color={props.entityObject.color}
                            distance={props.entityObject.distance}
                            intensity={props.entityObject.intensity}
                            angle={props.entityObject.getAngle("radians")}
                            shadow-mapSize-width={512}
                            shadow-mapSize-height={512}
                            shadow-camera-far={500}
                            shadow-camera-near={0.5} target={targetRef}
                            visible={props.entityObject.isVisible()||props.showInvisibleMode}
                        >
                        <mesh>
                            <sphereBufferGeometry //case of the light
                                attach="geometry"
                                args={[0.2, 32, 32,0,2*Math.PI,0,Math.PI/2]} //creates a hollow half sphere
                            />
                            <meshPhongMaterial
                                attach="material"
                                color="gray"
                                side={DoubleSide} //ensures that the material is shown when the user is looking into the hollow sphere
                            />
                            <mesh //bulb
                                position={[0,0.1,0]}
                            >
                                <sphereBufferGeometry
                                    attach="geometry"
                                    args={[0.05, 32, 32] }
                                />
                                <meshPhongMaterial
                                    attach="material"
                                    color={props.entityObject.color}
                                />
                            </mesh>
                        </mesh>
                    </spotLight> )}
                </>
            )
    }
}

function Entity(props) {
    let embeddedMesh=null;
    if (props.entityObject instanceof Text ||props.entityObject instanceof TaskBar||props.entityObject instanceof CounterElement){
        return (
            <mesh
                position={props.entityObject.getPosition()}
                scale={props.entityObject.getScale()}
                rotation={props.entityObject.getRotation("radians")}
                onDoubleClick={(event) => props.onSelection(event)} //selects element when user does a double click
                onPointerOver={(event)=> props.onHover(event)}
                name={props.entityObject.getID()}
                castShadow receiveShadow
                visible={props.entityObject.isVisible()||props.showInvisibleMode}
            >
                <planeBufferGeometry
                    attach="geometry"
                    args={props.entityObject.getBackgroundSize()} //set size (width, height)
                />
                <meshStandardMaterial
                    attach="material"
                    color={props.entityObject.getBackgroundColor()} //set color
                    side={DoubleSide} //both side rendered or only one
                    visible={props.entityObject.hasBackground()}
                />
                <mesh position={props.entityObject.getTextPosition()}>
                <EntityData
                    entityObject={props.entityObject}
                />
                </mesh>
                {embeddedMesh}
            </mesh>
        );

        // embeddedMesh= (
        //     <mesh
        //         position={props.entityObject.getBackgroundPosition()}
        //         name={props.entityObject.getID()+"Background"}
        //         castShadow
        //         receiveShadow
        //         visible={props.entityObject.hasBackground()}
        //     >
        //         <planeBufferGeometry
        //             attach="geometry"
        //             args={props.entityObject.getBackgroundSize()} //set size (width, height)
        //         />
        //         <meshStandardMaterial
        //             attach="material"
        //             color={props.entityObject.getBackgroundColor()} //set color
        //             side={DoubleSide} //both side rendered or only one
        //         />
        //     </mesh>
        // )
    }
    return (
            <mesh
                position={props.entityObject.getPosition()}
                scale={props.entityObject.getScale()}
                rotation={props.entityObject.getRotation("radians")}
                onDoubleClick={(event) => props.onSelection(event)} //selects element when user does a double click
                onPointerOver={(event)=> props.onHover(event)}
                name={props.entityObject.getID()}
                castShadow receiveShadow
                visible={props.entityObject.isVisible()||props.showInvisibleMode}
            >
                <EntityData
                    entityObject={props.entityObject}
                />
                {/*{embeddedMesh}*/}
            </mesh>
    );
}

function SelectedLightEntity(props) {
    const transform = useRef(); //reference for the transformation control
    const [target,targetRef]=useResource() //target ref for directed light
    const [light,lightRef]=useResource() // light ref for the light helper
    const lightHelper=useRef() // light helper ref to update it when the light is changed
    useEffect(() =>{ //this will be executed after rendering
        if(targetRef&&lightRef){
            if (lightHelper.current){
                    lightHelper.current.update(); //updates the light helper when target and light are instantiated
            }
        }
        if (transform.current) {
            const controls = transform.current;
            controls.setMode(props.mode); // sets the mode to translate, rotation or scale
            const callback = event => {
                props.orbitControl.current.enabled = !event.value; //toggles the orbitcontrol
                if(!event.value){ //this is executed when the dragging stopped
                    if(props.entityObject instanceof DirectionalLight) {
                        props.onTransform([transform.current.object, targetRef])
                        lightHelper.current.update();
                    }
                    else{
                        props.onTransform(transform.current.object)
                    }
                    if(props.mode==="scale"){
                        transform.current.object.scale.x=1
                        transform.current.object.scale.y=1
                        transform.current.object.scale.z=1
                    }
                }
            };
            controls.addEventListener("dragging-changed", callback); //adds the listener to the dragging property
            return () => controls.removeEventListener("dragging-changed", callback); //cleans up the listener when the effect ended
        }
    })
        switch(props.entityObject.constructor){
            case DirectionalLight:
                return (
                    <>
                    </>
                )
            case PointLight:
                return(
                    <>
                        <TransformControls
                            ref={transform}
                            position={props.entityObject.getPosition()}
                            rotation={props.entityObject.getRotation("radians")}
                            scale={[1, 1, 1]}
                        >
                            <pointLight
                                position={[0,0,0]}
                                castShadow
                                ref={light}
                                color={props.entityObject.getColor()}
                                distance={props.entityObject.distance}
                                decay={2}
                                intensity={props.entityObject.intensity}
                                visible={props.entityObject.isVisible()||props.showInvisibleMode}
                            >
                                <mesh onPointerOver={(event)=>props.onHover(event)}>
                                    <sphereBufferGeometry
                                        attach="geometry"
                                        args={[0.2, 32, 32] }
                                    />
                                    <meshPhongMaterial
                                        attach="material"
                                        color={props.entityObject.color}
                                    />
                                </mesh>
                            </pointLight>
                        </TransformControls>
                        {lightRef &&props.entityObject.distance>0 && (
                            <pointLightHelper
                                ref={lightHelper}
                                args={[lightRef,props.entityObject.distance]}
                            />)}
                    </>
                );
            case SpotLight:
                return(
                    <>
                        <TransformControls
                            ref={transform}
                            position={props.entityObject.getPosition()}
                            rotation={props.entityObject.getRotation("radians")}
                            scale={[1, 1, 1]}
                        >
                            <mesh
                                ref={target}
                                position={props.entityObject.getDefaultTarget()}
                                visible={props.entityObject.isVisible()||props.showInvisibleMode}
                            >
                                <sphereBufferGeometry
                                    attach="geometry"
                                    args={[0.05, 32, 32]}
                                />
                                <meshBasicMaterial
                                    attach="material"
                                    color="red"
                                />
                            </mesh>
                            {targetRef && (
                                <spotLight
                                    position={[0,0,0]}
                                    ref={light}
                                    castShadow
                                    color={props.entityObject.color}
                                    distance={props.entityObject.distance}
                                    intensity={props.entityObject.intensity}
                                    angle={props.entityObject.getAngle("radians")}
                                    shadow-mapSize-width={512}
                                    shadow-mapSize-height={512}
                                    shadow-camera-far={500}
                                    shadow-camera-near={0.5}
                                    target={targetRef}
                                    visible={props.entityObject.isVisible()||props.showInvisibleMode}
                                >
                                    <mesh onPointerOver={(event)=>props.onHover(event)}
                                        position={[0,0,0]}
                                    >
                                        <sphereBufferGeometry //bulb case
                                            attach="geometry"
                                            args={[0.2, 32, 32,0,2*Math.PI,0,Math.PI/2]}
                                        />
                                        <meshPhongMaterial
                                            attach="material"
                                            color="gray"
                                            side={DoubleSide}
                                        />
                                        <mesh
                                            position={[0,0.1,0]}
                                        >
                                            <sphereBufferGeometry
                                                attach="geometry"
                                                args={[0.05, 32, 32] }
                                            />
                                            <meshPhongMaterial
                                                attach="material"
                                                color={props.entityObject.color}
                                            />
                                        </mesh>
                                    </mesh>
                                </spotLight>
                            )}
                        </TransformControls>
                        {lightRef && targetRef && (
                            <spotLightHelper
                                ref={lightHelper}
                                args={[lightRef]}
                            />
                        )}
                    </>
                );
            default:
                return(
                    <>
                    </>
                );
        }

}

function SelectedEntity(props) {
    const transform = useRef(); //reference for the transformation control
    const [boxHelper,boxHelperRef]=useResource()
    useEffect(() =>{ //this will be executed after rendering
        if (transform.current) {
            const controls = transform.current;
            controls.setMode(props.mode); // sets the mode to translate, rotation or scale

            const callback = event => {
                props.orbitControl.current.enabled = !event.value; //toggles the orbitcontrol
                if(!event.value){ //this is executed when the dragging stopped
                    props.onTransform(transform.current.object)
                    if(props.mode==="scale"){
                        transform.current.object.scale.x=1
                        transform.current.object.scale.y=1
                        transform.current.object.scale.z=1
                    }
                }
            };
            controls.addEventListener("dragging-changed", callback); //adds the listener to the dragging property
            return () => {controls.removeEventListener("dragging-changed", callback)} //cleans up the listener when the effect ended
        }
    })
    const [mesh, meshRef] = useResource();
    let embeddedMesh=null;
    if (props.entityObject instanceof Text ||props.entityObject instanceof TaskBar||props.entityObject instanceof CounterElement){
        return (<>
            <TransformControls
                ref={transform}
                position={props.entityObject.getPosition()}
                rotation={props.entityObject.getRotation("radians")}
                scale={[1, 1, 1]}
                name="transformer"
            >
                <mesh
                    ref={mesh}
                    name={props.entityObject.getID()}
                    scale={props.entityObject.getScale()}
                    castShadow
                    receiveShadow
                    visible={props.entityObject.isVisible()||props.showInvisibleMode}
                    onPointerOver={(event)=>props.onHover(event)}
                >
                    <planeBufferGeometry
                        attach="geometry"
                        args={props.entityObject.getBackgroundSize()} //set size (width, height)
                    />
                    <meshStandardMaterial
                        attach="material"
                        color={props.entityObject.getBackgroundColor()} //set color
                        side={DoubleSide} //both side rendered or only one
                        visible={props.entityObject.hasBackground()}
                    />
                    <mesh position={props.entityObject.getTextPosition()}>
                    <EntityData
                        entityObject={props.entityObject}
                    />
                    </mesh>
                    {embeddedMesh}
                </mesh>
                {meshRef && (
                    <boxHelper
                        ref={boxHelper}
                        args={[meshRef, 0xffff00]}
                        scale={props.entityObject.getScale()}
                    />
                )}
            </TransformControls>
        </>)
    }
    return (
        <>
            <TransformControls
                ref={transform}
                position={props.entityObject.getPosition()}
                rotation={props.entityObject.getRotation("radians")}
                scale={[1, 1, 1]}
                name="transformer"
            >
                <mesh
                    ref={mesh}
                    name={props.entityObject.getID()}
                    scale={props.entityObject.getScale()}
                    castShadow
                    receiveShadow
                    onPointerOver={(event)=>props.onHover(event)}
                    visible={props.entityObject.isVisible()||props.showInvisibleMode}
                >
                    <EntityData
                        entityObject={props.entityObject}
                    />
                    {/*{embeddedMesh}*/}
                </mesh>
                {meshRef && (
                    <boxHelper
                        ref={boxHelper}
                        args={[meshRef, 0xffff00]}
                        scale={props.entityObject.getScale()}
                    />
                )}
            </TransformControls>
        </>
    );
}


export default class Viewport extends React.Component {
    constructor(props) {
        super(props);
        this.orbit=React.createRef();
        this.transform=React.createRef();
        this.state = {
            mode:"translate", //transformation mode
            gridMode:true, // shows the grid
            taskMode:true, //shows task areas
            showInvisibleMode:true, //hides invisible objects
            gridSize:200,

            tutorialArea:null,
            tutorialGoalEntity:null,
        };
    }

    setupTutorialArea(area, element){
        this.setState({
            tutorialArea:area,
            tutorialGoalEntity:element,
        })
    }
    removeTutorialArea(){
        this.setState({
            tutorialArea:null,
            tutorialGoalEntity:null,
        })
    }

    getCameraDirection(){
        this.orbit.current.update();
        let direction=new Vector3(); //saves the direction
        this.orbit.current.object.getWorldDirection(direction); //calculates the direction
        return direction;
    }
    getCameraPosition(){
        this.orbit.current.update();
        return this.orbit.current.object.position.clone();
    }

    getCameraTarget(){
        this.orbit.current.update();
        return this.orbit.current.target.clone();
    }

    resetCamera(){
        let position= new Vector3(0,0,0)
        //change Target of camera
        this.orbit.current.target=position;
        this.orbit.current.update();

        //zoom on target
        let camera= this.orbit.current.object;
        camera.position.set(0,10,10); // move in direction * zoom
    }

    focusCameraOnElement(element){
        let elementPosition=element.getPosition()
        let position= new Vector3(elementPosition[0],elementPosition[1],elementPosition[2])
        //change Target of camera
        this.orbit.current.target=position;
        this.orbit.current.update();

        //zoom on target
        let camera= this.orbit.current.object;
        let direction=new Vector3(); //saves the direction
        let zoom= camera.position.distanceTo(position); //calculate the distance in that direction
        camera.getWorldDirection(direction); //calculates the direction
        camera.position.addScaledVector(direction, zoom-10); // move in direction * zoom
    }

    checkIfEntityIsInTutorialArea(objectThree){
        if(!objectThree){
            return false;
        }
        if(!this.state.tutorialArea){
            return false;
        }
        if(!this.props.showHighlightTutorial){
            return false;
        }
        let positionEntity=objectThree.position
        let tutorialArea=this.state.tutorialArea

        if((positionEntity.x>(tutorialArea.position[0]-(tutorialArea.scale[0]/2)))&&(positionEntity.x<(tutorialArea.position[0]+(tutorialArea.scale[0]/2)))){
            if((positionEntity.y>(tutorialArea.position[1]-(tutorialArea.scale[1]/2)))&&(positionEntity.y<(tutorialArea.position[1]+(tutorialArea.scale[1]/2)))){
                if((positionEntity.z>(tutorialArea.position[2]-(tutorialArea.scale[2]/2)))&&(positionEntity.z<(tutorialArea.position[2]+(tutorialArea.scale[2]/2)))){
                    return true;
                }
            }
        }
        return false;
    }

    onTransformationOfEntity(mode,objectThree){
        if(this.props.showHighlightTutorial){
            if(this.state.tutorialArea&&this.state.tutorialGoalEntity){
                if(this.state.tutorialGoalEntity.getID()===this.props.selected.getID()){
                    if(this.checkIfEntityIsInTutorialArea(objectThree)){
                        let area= this.state.tutorialArea
                        area["color"]="green"
                        this.setState({
                            tutorialArea:area,
                            tutorialGoalEntity:null,
                        })
                        this.props.entityIsPutInTutorialArea(this.props.selected);
                    }
                }
            }
        }
        this.props.onTransformationOfEntity(mode,objectThree)
    }

    handleSelection(event, entity){
        event.stopPropagation(); //stops the event and ensures that only the first entity in the raycast handles the event
        this.props.onSelection(entity);
    }

    handleHover(event, entity){
        if(entity.isVisible()|| this.state.showInvisibleMode) { //to ignore invisible objects and to go to the next intersecting object
            event.stopPropagation(); //stops the event and ensures that only the first entity in the raycast handles the event
            this.props.onHover(entity);
        }
    }

    render() {
        console.log("redraw scene",this.props.scene);
        console.log("tasks",this.props.taskList);
        const scene = this.props.scene.map((entity, move) => {
            if(entity===this.props.selected){
                if(entity instanceof Light){
                    return(
                        <SelectedLightEntity
                            key={entity.getID()}
                            orbitControl={this.orbit}  //reference to the orbit controll to turn it off
                            mode={this.state.mode} //defines the mode of the transformation
                            entityObject={entity}  //entity data
                            onHover={(event)=>this.handleHover(event,entity)}
                            onTransform={(objectThree)=>this.onTransformationOfEntity(this.state.mode,objectThree)} //defines the function which handles the transformation
                            showInvisibleMode={this.state.showInvisibleMode}
                        />
                    );
                }
                return( //standard selected Entity
                    <SelectedEntity
                        key={entity.getID()}
                        orbitControl={this.orbit}  //reference to the orbit controll to turn it off
                        mode={this.state.mode} //defines the mode of the transformation
                        entityObject={entity}  //entity data
                        onHover={(event)=>this.handleHover(event,entity)}
                        onTransform={(objectThree)=>this.onTransformationOfEntity(this.state.mode,objectThree)} //defines the function which handles the transformation
                        showInvisibleMode={this.state.showInvisibleMode}
                    />
                );
            }
            else{
                if(entity instanceof Light){
                    return(
                        <LightEntity
                            key={entity.getID()}
                            entityObject={entity} //entity data
                            onSelection={(event)=>this.handleSelection(event,entity)} //function ensures that only one Entity is selected
                            onHover={(event)=>this.handleHover(event,entity)} //function ensures that only one Entity is selected
                            showInvisibleMode={this.state.showInvisibleMode}
                        />
                    );
                }
                return(
                    <Entity
                        key={entity.getID()}
                        entityObject={entity} //entity data
                        onSelection={(event)=>this.handleSelection(event,entity)} //function ensures that only one Entity is selected
                        onHover={(event)=>this.handleHover(event,entity)} //function ensures that only one Entity is selected
                        showInvisibleMode={this.state.showInvisibleMode}
                    />
                );
            }
        });

        const task = this.props.taskList.map((task, taskmove) => {
            let activityList = task.getActivities();
            return activityList.map((activity, activitymove) => {
                if (activity.hasArea()) {
                    if (activity === this.props.selected) {
                        return ( //standard selected Entity
                            <SelectedEntity
                                key={activity.getID()}
                                orbitControl={this.orbit}  //reference to the orbit control to turn it off
                                mode={this.state.mode} //defines the mode of the transformation
                                entityObject={activity}  //entity data
                                onHover={(event)=>this.handleHover(event,activity)}
                                onTransform={(objectThree) => this.onTransformationOfEntity(this.state.mode, objectThree)} //defines the function which handles the transformation
                            />
                        );
                    } else {
                        return (
                            <Entity
                                key={activity.getID()}
                                entityObject={activity} //entity data
                                onHover={(event)=>this.handleHover(event,activity)} //function ensures that only one Entity is selected
                                onSelection={(event) => this.handleSelection(event, activity)} //function ensures that only one Entity is selected
                            />
                        );
                    }
                }
                return null;
            });
        });


        let conditionAreas=[];
        for (let indexEntity=0;indexEntity<this.props.scene.length; indexEntity++){
            let interactionList=this.props.scene[indexEntity].getInteractions();
            for (let indexInteraction=0;indexInteraction<interactionList.length; indexInteraction++){
                if(interactionList[indexInteraction] instanceof ConditionInteraction){
                    let conditionList=interactionList[indexInteraction].getConditions();
                    for (let indexCondition=0;indexCondition<conditionList.length; indexCondition++){
                        if(conditionList[indexCondition].hasArea()){
                            let condition=conditionList[indexCondition]
                            if (condition === this.props.selected) {
                                conditionAreas.push(( //standard selected Entity
                                    <SelectedEntity
                                        key={condition.getID()}
                                        orbitControl={this.orbit}  //reference to the orbit control to turn it off
                                        mode={this.state.mode} //defines the mode of the transformation
                                        entityObject={condition}  //entity data
                                        onHover={(event)=>this.handleHover(event,condition)}
                                        onTransform={(objectThree) => this.onTransformationOfEntity(this.state.mode, objectThree)} //defines the function which handles the transformation
                                    />
                                ));
                            } else {
                                conditionAreas.push((
                                    <Entity
                                        key={condition.getID()}
                                        entityObject={condition} //entity data
                                        onHover={(event)=>this.handleHover(event,condition)} //function ensures that only one Entity is selected
                                        onSelection={(event) => this.handleSelection(event, condition)} //function ensures that only one Entity is selected
                                    />
                                ));
                            }
                        }
                    }
                }
            }
        }

        let transformMode=this.state.mode;

        let  tutorialArea=null;
        if(this.props.showHighlightTutorial && this.state.tutorialArea){
            tutorialArea=(
                <mesh
                    position={this.state.tutorialArea.position}
                    scale={this.state.tutorialArea.scale}
                    rotation={this.state.tutorialArea.rotation}
                    name={"tutorialGoalArea"}
                    visible={true}
                >
                    <boxBufferGeometry
                        attach="geometry"
                        args={[1,1,1]} //set size (width, height, depth)
                    />
                    <meshStandardMaterial
                        attach="material"
                        opacity={0.5}
                        transparent={true}
                        color={this.state.tutorialArea.color} //set color
                    />
                </mesh>

            )
        }
        return (
            <div className={"viewport" + (this.props.showHighlightTutorial?" viewport-tutorial-highlight":"")}>
                <div className={"viewport-gui-buttons" + ((this.props.showHighlightTutorial&&(this.props.highlightTutorialButton==="mode"))?" viewport-tutorial-highlight-element":"")}>
                    <button className={(transformMode==="translate"?"viewport-selected-mode":"viewport-unselected-button") +  ((this.props.showHighlightTutorial&&(this.props.highlightTutorialButton==="position"))?" viewport-tutorial-highlight-element":"")}  onClick={()=>this.setState({mode:"translate"})}>Position</button>
                    <button className={(transformMode==="rotate"?"viewport-selected-mode":"viewport-unselected-button") +  ((this.props.showHighlightTutorial&&(this.props.highlightTutorialButton==="rotation"))?" viewport-tutorial-highlight-element":"")} onClick={()=>this.setState({mode:"rotate"})}>Rotation</button>
                    <button className={(transformMode==="scale"?"viewport-selected-mode":"viewport-unselected-button") + ((this.props.showHighlightTutorial&&(this.props.highlightTutorialButton==="scale"))?" viewport-tutorial-highlight-element":"")} onClick={()=>this.setState({mode:"scale"})}>Scale</button>
                </div>
                <div className={"viewport-gui-light" + ((this.props.showHighlightTutorial&&(this.props.highlightTutorialButton==="view"))?" viewport-tutorial-highlight-element":"")}>
                    <button  className={(this.state.gridMode?"viewport-selected-mode":"viewport-unselected-button") + ((this.props.showHighlightTutorial&&(this.props.highlightTutorialButton==="grid"))?" viewport-tutorial-highlight-element":"")} onClick={()=>this.setState({gridMode:!this.state.gridMode})}>Grid</button>
                    <button  className={(this.state.taskMode?"viewport-selected-mode":"viewport-unselected-button") + ((this.props.showHighlightTutorial&&(this.props.highlightTutorialButton==="task"))?" viewport-tutorial-highlight-element":"")} onClick={()=>this.setState({taskMode:!this.state.taskMode})}>Task</button>
                    <button  className={(this.state.showInvisibleMode?"viewport-selected-mode":"viewport-unselected-button") + ((this.props.showHighlightTutorial&&(this.props.highlightTutorialButton==="invisible"))?" viewport-tutorial-highlight-element":"")} onClick={()=>this.setState({showInvisibleMode:!this.state.showInvisibleMode})}>Invisible</button>
                </div>

                <div className={"viewport-reset-cam" + ((this.props.showHighlightTutorial&&(this.props.highlightTutorialButton==="reset"))?" viewport-tutorial-highlight-element":"")}>
                    <button  className={"viewport-unselected-button"} onClick={()=>this.resetCamera()}>Reset View</button>
                </div>

                <Canvas
                    onPointerMissed={()=>this.props.onDeselection()}
                    className="viewport-scene" shadowMap camera={{position:[0,10,10], fov:45, rotation:[-47,0,0]}}>
                    {this.state.gridMode && <gridHelper args={[this.state.gridSize,this.state.gridSize]}/>}

                    <ambientLight color={"#BBB"}/>
                    <directionalLight intensity={0.6} position={[-50, 100, 100]} shadowCameraBottom={-100} shadowCameraLeft={-100} shadowCameraTop={100} shadowCameraRight={100} castShadow={true} />
                    <MapControls ref={this.orbit} />
                    {scene}
                    {this.state.taskMode && task}

                    {conditionAreas}
                    {this.props.showHighlightTutorial && tutorialArea}
                </Canvas>
            </div>
        );
    }
}