import Light from "./Light";

export default class PointLight extends Light{
    constructor(name, x, y, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded, interactions,textures, color,intensity,distance=50) {
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color,intensity);
        this.distance=distance;
        this.className="PointLight" // this is needed because in production constructor.name isn't possible
        if ( typeof PointLight.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            PointLight.counterChild = 1;
        }
        this.name="PointLight"+PointLight.counterChild; //set the name to class name + counter
        PointLight.counterChild++;
    }

    copyEntity(){
        let copiedObject=new PointLight();
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.distance=this.distance;
    }

    exportEntityToAFrame(assets,scene){
        return "<a-light type='point' "+this.exportAttributesToAFrame(assets,scene)+"></a-light>";
    }

    exportAttributesToAFrame(assets,scene){
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData +=" distance='"+this.distance+"' "
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData +=" distance='"+this.distance+"' "
        return attributesData;
    }

    printScenegraph(){ //called when the object has to be printed for the Scenegraph
        return "Point Light "+ this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "distance":
                this.distance=parseFloat(value);
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {printName: "Distance", inputType: "number" ,name: "distance",  value: this.distance, step:0.1}, //color details
            ]
        );
    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
            {
                printName:"Change Distance",
                id:"change-property_distance",
                module:"change-property",
                options:{
                    property:"distance"
                },
                parameterList: [
                    {printName: "Distance", inputType: "number" ,name: "distance",  value: this.distance, step:0.1},
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