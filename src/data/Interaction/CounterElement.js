import {FontLoader, PlaneBufferGeometry} from "three";
import Entity from "../Entity";

export default class CounterElement extends Entity{
    constructor(name, x, y=0.5, z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures, width=2, height=1,color="#FFFFFF",background=true, backgroundColor="#000000",startValue=0,endValue=10,interval=10,repeatCounter=false) { //Javascript allows only one constructor
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures,color)
        this.height=height;
        this.width=width;
        this.color=color;
        this.backgroundColor=backgroundColor;
        this.background=background;
        this.font="/assets/fonts/Roboto_Regular.json"; // fixed Font
        this.fontThree=null;
        this.startValue=startValue
        this.interval=interval
        this.endValue=endValue
        this.repeatCounter=repeatCounter
        this.className="CounterElement" // this is needed because in production constructor.name isn't possible
        if ( typeof CounterElement.counterChild == 'undefined' ) { //init the static variable on the first constructor call
            CounterElement.counterChild = 1;
        }
        this.name="Counter"+CounterElement.counterChild; //set the name to class name + counter
        CounterElement.counterChild++;
    }

    loadEntity(callback,options) {
        let loader = new FontLoader();
        loader.load( this.font ,  ( fontLoaded ) => {
            this.fontThree=fontLoaded //save font
            callback(this)
        });
    }

    hasToBeLoaded(){
        return true;
    }

    copyEntity(){
        let copiedObject=new CounterElement() ;
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.height=this.height;
        copiedObject.width=this.width;
        copiedObject.color=this.color;
        copiedObject.backgroundColor=this.backgroundColor;
        copiedObject.background=this.background;
        copiedObject.startValue=this.startValue
        copiedObject.interval=this.interval
        copiedObject.endValue=this.endValue
        copiedObject.repeatCounter=this.repeatCounter
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["height","width"])
    }

    exportMeshGeometry(){
        return new PlaneBufferGeometry(this.width,this.height);
    }

    exportEntityToAFrame(assets,scene){
        return "<a-text "+this.exportAttributesToAFrame(assets,scene)+"></a-text>";
    }

    exportAttributesToAFrame(assets,scene) {
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData +=" wrap-count='"+4+"'"
            +" color='" + this.color+"'"
            +" value='"+this.startValue+"'"
            +" height='"+(this.height-this.height/5)+"'"
            +" width='"+(this.width-this.height/5)+"'"
            +" anchor='center'"
            +" material='visible:"+this.background+";"
            +" side:double;"
            +" color:"+this.backgroundColor+";'"
            +" geometry='primitive:plane;"
            +" height:"+this.height+";"
            +" width:"+this.width+";' "
        attributesData +="counter-manager=\"start:"+this.startValue+"; end: "+this.endValue+"; repeat: "+this.repeatCounter+"; interval: "+this.interval+";\" "
        return attributesData;
    }

    exportAttributes(){
        let attributesData = super.exportAttributes();
        attributesData+= " height='"+this.height+"'"
            +" width='"+this.width+"'"
            +" color='"+this.color+"'"
            +" background='"+this.background+"'"
            +" backgroundColor='"+this.backgroundColor+"'"
            +" startValue='"+this.startValue+"'"
            +" interval='"+this.interval+"'"
            +" endValue='"+this.endValue+"'"
            +" repeatCounter='"+this.repeatCounter+"'"
        return attributesData;
    }

    printScenegraph() {
        return "Counter "+this.getName();
    }

    setAttribute(name,value){
        switch (name) {
            case "color":
                this.color=value;
                break;
            case "backgroundColor":
                this.backgroundColor=value;
                break;
            case "background":
                if (typeof value ==="string"){
                    this.background = value==="true";
                }
                else{
                    this.background = value;
                }
                break;
            case "height":
                this.height=parseFloat(value);
                break;
            case "width":
                this.width=parseFloat(value);
                break;
            case "startValue":
                this.startValue = parseFloat(value);
                break;
            case "interval":
                this.interval = parseFloat(value);
                break;
            case "endValue":
                this.endValue = parseFloat(value);
                break;
            case "repeatCounter":
                if (typeof value ==="string"){
                    this.repeatCounter = value==="true";
                }
                else{
                    this.repeatCounter = value;
                }
                break;
            default:
                super.setAttribute(name,value);
        }
    }

    getSize(){
        return this.height/4;
    }

    getBackgroundSize(){
        return [this.width,this.height];
    }

    getBackgroundColor(){
        return this.backgroundColor
    }

    hasBackground(){
        return this.background;
    }
    getColor(){
        return this.color;
    }
    getThreeFont(){
        return this.fontThree;
    }

    getText(){
        if(this.startValue){
            return ""+this.startValue;
        }
        return "0"
    }

    getTextPosition(){
        return [
            -this.width/2+(this.width/10),
            -this.height/8,
            0.0001
        ]
    }

    getDetails(){
        let parentDetails=super.getDetails();
        return parentDetails.concat(
            [
                {
                    categoryName: "Boundaries",
                    containedElements: [
                        {printName: "Start", inputType: "number", name: "startValue", value: this.startValue,step: 1,min:0, max:9999}, //color details
                        {printName: "End", inputType: "number", name: "endValue", value: this.endValue,step: 1,min:0, max:9999}, //background details
                    ]
                },
                {
                    categoryName: "Control",
                    containedElements: [
                        {printName: "Interval", inputType: "number", name: "interval", value: this.interval,step: 1}, //color details
                        {printName: "Repeat", inputType: "checkbox", name: "repeatCounter", value: this.repeatCounter}, //background details
                    ]
                },
                {
                    categoryName: "Color",
                    containedElements: [
                        {printName: "Text", inputType: "color", name: "color", value: this.color}, //color details
                        {printName: "Background", inputType: "color", name: "backgroundColor", value: this.backgroundColor}, //background details
                    ]
                },
                {
                    categoryName: "Size",
                    containedElements: [
                        {printName: "Width", inputType: "number", name: "width", value: this.width, step: 0.1}, //width details
                        {printName: "Height", inputType: "number", name: "height", value: this.height, step: 0.1}, //height details
                    ]
                },
            ]
        );
    }

    getEvents(){
        let parentEvents=super.getEvents();
        return parentEvents.concat( [ //list all Events. Printname is used to describe the event. Value is used to save the javascript event name
            {printName: "Counter increased from ", value: "counterIncreased"}, // mouseenter event
            {printName: "Counter decreased from ", value: "counterDecreased"}, //mouseleave event
            {printName: "End reached on ", value: "counterEnd"}, //mouseleave event
            {printName: "Interval passed on ", value: "IntervalPassed"}, //mouseleave event
            {printName: "Reset on ", value: "counterReset"}, //mouseleave event
        ]);

    }

    getEffects(){
        let parentEffects=super.getEffects();
        return parentEffects.concat([
            {
                printName:"Increase Counter By",
                id:"increase-counter",
                module:"increase-counter",
                options:{},
                parameterList: [
                    {printName: "Value", inputType: "number" ,name: "value",  value: 1,   step:1,  min:1,  max:this.endValue-this.startValue}, //start details
                ]
            },
            {
                printName:"Increase Once Counter By",
                id:"increase-counter-once",
                module:"increase-counter-once",
                options:{},
                parameterList: [
                    {printName: "Value", inputType: "number" ,name: "value",  value: 1,   step:1,  min:1,  max:this.endValue-this.startValue}, //start details
                ]
            },
            {
                printName:"Decrease Counter By",
                id:"decrease-counter",
                module:"decrease-counter",
                options:{},
                parameterList: [
                    {printName: "Value", inputType: "number" ,name: "value",  value: 1,   step:1}, //start details
                ]
            },
            {
                printName:"Decrease Once Counter By",
                id:"decrease-counter-once",
                module:"decrease-counter-once",
                options:{},
                parameterList: [
                    {printName: "Value", inputType: "number" ,name: "value",  value: 1,   step:1,  min:1,  max:this.endValue-this.startValue}, //start details
                ]
            },
            {
                printName:"Reset Counter",
                id:"reset-counter",
                module:"reset-counter",
                options:{},
                parameterList: [

                ]
            },
        ]);
    }
}