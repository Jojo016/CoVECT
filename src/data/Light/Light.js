import Entity from "../Entity";

export default class Light extends Entity{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded, interactions,textures, color="#ffffff",intensity=1) {
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures);
        this.color=color;
        this.intensity=intensity;
        this.castShadow=false;
        this.receiveShadow=false;
        this.className="Light" // this is needed because in production constructor.name isn't possible
        if ( typeof Light.counter == 'undefined' ) { //init the static variable on the first constructor call
            Light.counter = 1;
        }
        this.name="Light"+Light.counter; //set the name to class name + counter
        Light.counter++;
    }

    copyEntity(){
        let copiedObject=new Light();
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.color=this.color;
        copiedObject.intensity=this.intensity;
    }

    isExportedForNavmeshGeneration(){ //decides if the entity will be considered for the navigantion mesh generation
        return false;
    }

    exportEntityToAFrame(assets,scene){
        return "<a-light type='ambient' "+this.exportAttributesToAFrame(assets,scene)+"></a-light>";
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData +=" color='"+this.color+"'"
            +" intensity='"+this.intensity+"'"
            +" light=\"castShadow:true;\""
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData +=" color='"+this.color+"'"
            +" intensity='"+this.intensity+"' "
        return attributesData;
    }

    printScenegraph(){ //called when the object has to be printed for the Scenegraph
        return "Light "+ this.getName();
    }

    getColor(){
        return this.color;
    }

    setAttribute(name,value){
        switch (name) {
            case "color":
                this.color=value;
                break;
            case "intensity":
                this.intensity=parseFloat(value);
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {
                    categoryName:"Light",
                    containedElements: [
                        {printName: "Color", inputType: "color" ,name: "color",  value: this.color}, //color details
                        {printName: "Intensity", inputType: "number" ,name: "intensity",  value: this.intensity, step:0.1}, //color details
                    ]
                }
            ]
        );
    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
            {
                printName:"Change Color",
                id:"change-property_lightcolor",
                module:"change-property",
                options:{
                    property:"color"
                },
                parameterList: [
                    {printName: "Color", inputType: "color" ,name: "color",  value: this.color},
                ],
            },
            {
                printName:"Change Intensity",
                id:"change-property_intensity",
                module:"change-property",
                options:{
                    property:"intensity"
                },
                parameterList: [
                    {printName: "Intensity", inputType: "number" ,name: "intensity",  value: this.intensity, step:0.1},
                ],
            },
        ]);
    }

    getEvents(){
        let parentEvents=super.getEvents();
        return parentEvents.concat(
        );
    }
}