import {BoxBufferGeometry, Group, Mesh, MeshBasicMaterial, Scene, Vector3} from "three";
import Entity from "../Entity";

export default class ButtonElement extends Entity{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures, width=1, height=1,depth=1,color="#333",buttonColor="#ff0000",buttonSegments=16) { //Javascript allows only one constructor
        super(name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation, userUploaded, interactions, textures, color)
        this.height = height;
        this.width = width;
        this.depth = width;
        this.color = color;
        if(!y){
            this.y=height/2;
        }
        this.buttonColor = buttonColor;
        this.buttonSegments=buttonSegments
        this.className = "ButtonElement" // this is needed because in production constructor.name isn't possible
        if (typeof ButtonElement.counterChild == 'undefined') { //init the static variable on the first constructor call
            ButtonElement.counterChild = 1;
        }
        this.name = "Button" + ButtonElement.counterChild; //set the name to class name + counter
        ButtonElement.counterChild++;
    }

    copyEntity(){
        let copiedObject=new ButtonElement() ;
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.height=this.height;
        copiedObject.width=this.width;
        copiedObject.depth=this.depth;
        copiedObject.color=this.color;
        copiedObject.buttonColor=this.buttonColor;
        copiedObject.buttonSegments=this.buttonSegments

    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["height","width","depth"])
    }

    exportMeshGeometry(){
        return new BoxBufferGeometry(this.width,this.height,this.depth);
    }

    exportPositionToAFrame() {
        let distance= this.getBottomPosition();
        let geometry= new BoxBufferGeometry(this.width,this.height/2,this.depth);
        let material= new MeshBasicMaterial();
        let box= new Mesh(geometry,material);

        let geometry2= new BoxBufferGeometry(this.width,this.height,this.depth);
        let material2= new MeshBasicMaterial();
        let mesh= new Mesh(geometry2,material2);
        mesh.add(box)
        box.translateY(distance[1])
        let rotation= this.getRotation("radians")
        mesh.rotation.set(rotation[0],rotation[1],rotation[2])
        mesh.scale.set(this.xScale,this.yScale,this.zScale)
        mesh.position.set(this.x,this.y,this.z)

        mesh.updateMatrix();
        // mesh.translateX(distance[0])
        // mesh.translateY(distance[1])
        // mesh.translateZ(distance[2])
        let pos=new Vector3()
        let scene = new Scene()
        scene.add(mesh)
        mesh.updateMatrix();
        scene.updateMatrixWorld(true)
        // box.updateMatrix();
        box.getWorldPosition(pos)


        return {x:pos.x, y:pos.y, z:pos.z};
    }

    exportEntityToAFrame(assets,scene){
        let buttonPosition=this.getButtonPosition();
        let pushDown=this.height/4
        return "<a-box "+this.exportAttributesToAFrame(assets,scene) +">"
            +"<a-cylinder"
                +" id='"+this.getID()+"-button'"
                +" color='" + this.buttonColor+"'"
                +" height='"+(this.height/2)+"'"
                +" radius='"+this.getButtonRadius()+"'"
                +" segments-radial='"+this.buttonSegments+"'"
                +" position='"+buttonPosition[0]+" "+buttonPosition[1]+" "+buttonPosition[2]+"'"
                +"animation__pressed=\"property: position; loop: 0; to:"+buttonPosition[0]+" "+(buttonPosition[1]-pushDown)+" "+buttonPosition[2]+"; startEvents: buttonElementDown; dur: 500\""
                +"animation__release=\"property: position; loop: 0; to:"+buttonPosition[0]+" "+buttonPosition[1]+" "+buttonPosition[2]+"; startEvents: buttonElementUp; dur: 500\""
            + ">"
            +"</a-cylinder>"
            +"</a-box>";
    }

    exportAttributesToAFrame(assets,scene) {
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData +=" color='" + this.color+"'"
                +" height='"+(this.height/2)+"'"
                +" width='"+this.width+"'"
                +" depth='"+this.depth+"' "
        attributesData +="button-manager=\"button:#"+this.getID()+"-button;\" "
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+= " height='"+this.height+"'"
            +" width='"+this.width+"'"
            +" depth='"+this.depth+"'"
            +" color='"+this.color+"'"
            +" buttonColor='"+this.buttonColor+"'"
            +" buttonSegments='"+this.buttonSegments+"'"
        return attributesData;
    }

    printScenegraph() {
        return "Button "+this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "color":
                this.color=value;
                break;
            case "buttonColor":
                this.buttonColor=value;
                break;
            case "height":
                this.height=parseFloat(value);
                break;
            case "width":
                this.width=parseFloat(value);
                break;
            case "depth":
                this.depth = parseFloat(value);
                break;
            case "buttonSegments":
                this.buttonSegments = parseFloat(value);
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getSize(){
        return [this.width,this.height/2,this.depth];
    }

    getButtonRadius(){
        let smallestSide=(this.width>this.depth)?this.depth:this.width;
        return smallestSide/2-smallestSide/10 //radius is half of smallest side - 10% distance to the border
    }

    getButtonSize(){
        let radius=this.getButtonRadius()
        return [radius,radius,this.height/2,this.buttonSegments];
    }

    getButtonColor(){
        return this.buttonColor
    }

    getColor(){
        return this.color;
    }

    getBottomPosition(){
        return [
            0,
            -this.height/4,
            0
        ]
    }

    getButtonPosition(){
        return [
            0,
            this.height/2-this.height/10,
            0
        ]
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {
                    categoryName: "Color",
                    containedElements: [
                        {printName: "Box", inputType: "color", name: "color", value: this.color}, //color details
                        {printName: "Button", inputType: "color", name: "buttonColor", value: this.buttonColor}, //background details
                    ]
                },
                {printName: "Button Segments", inputType: "range" ,name: "buttonSegments",  value: this.buttonSegments,step: 1,min:3,max:32}, //radialSegments details
                {
                    categoryName: "Size",
                    containedElements: [
                        {printName: "Width", inputType: "number", name: "width", value: this.width, step: 0.1}, //width details
                        {printName: "Height", inputType: "number", name: "height", value: this.height, step: 0.1}, //height details
                        {printName: "Depth", inputType: "number", name: "height", value: this.depth, step: 0.1}, //height details
                    ]
                },
            ]
        );
    }

    getEvents(){
        let parentEvents=super.getEvents();
        return parentEvents.concat( [ //list all Events. Printname is used to describe the event. Value is used to save the javascript event name
            {printName: "Button pressed on ", value: "buttonElementPressed"}, // mouseenter event
            {printName: "Button Down on ", value: "buttonElementDown"}, // mouseenter event
            {printName: "Button Up on ", value: "buttonElementUp"}, // mouseenter event
        ]);

    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
        ]);
    }
}