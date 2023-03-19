import Entity from "./Entity";
import {FontLoader, PlaneBufferGeometry, TextBufferGeometry} from "three";

export default class Text extends Entity {
    constructor(text,font="/fonts/Roboto_Regular.json",color="#ffffff", textSize = 1,hasBackground=false,padding=0.01,backgroundColor="#000000",backgroundHeight=0,backgroundWidth=0, name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation,userUploaded, interactions,textures) { //Javascript allows only one constructor
        super(name,x,y,z,xScale,yScale,zScale,xRotation,yRotation,zRotation,userUploaded,interactions,textures);
        this.textSize = textSize;
        this.text = text;
        this.color=color;
        this.font=font;
        this.background=hasBackground;
        this.backgroundColor=backgroundColor
        this.padding=padding;
        this.height=backgroundHeight
        this.width=backgroundWidth
        this.className="Text" // this is needed because in production constructor.name isn't possible
        if (typeof Text.counterChild == 'undefined') { //init the static variable on the first constructor call
            Text.counterChild = 1;
        }
        this.name = "Text" + Text.counterChild; //set the name to class name + counter
        Text.counterChild++;
    }

    copyEntity(){
        let copiedObject=new Text();
        this.copyTo(copiedObject)
        return copiedObject;
    }
    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.textSize = this.textSize;
        copiedObject.text = this.text;
        copiedObject.color = this.color;
        copiedObject.font = this.font;
        copiedObject.background = this.background;
        copiedObject.backgroundColor = this.backgroundColor
        copiedObject.padding = this.padding;
        copiedObject.height = this.height
        copiedObject.width = this.width
    }

    exportForNavmeshGeneration(){
        if(this.isExportedForNavmeshGeneration()){
            const keys = this.getGeometryKeyNames()
            let classToObject= keys.reduce((classAsObj, key) => {
                classAsObj[key] = this[key]
                return classAsObj
            }, {className:this.constructor.name})
            let adjustedPos=this.exportPosition()
            classToObject.x=adjustedPos.x
            classToObject.y=adjustedPos.y
            classToObject.z=adjustedPos.z
            return classToObject; //the exported geometry info of the entity
        }
        return null; // this entity isn't exported
    }

    loadEntity(callback,options) {
        let loader = new FontLoader();
        loader.load( this.font ,  ( fontLoaded ) => {
            this.fontThree=fontLoaded //save font
            this.updateBackgroundSize();
            callback(this)
        });
    }
    hasToBeLoaded(){
        return true;
    }

    // exportPositionToAFrame(){
    //     return {
    //         x:this.x-this.getAdjustedPadding() +this.width/2,
    //         y:this.y+this.getSize()+this.getAdjustedPadding()-this.height/2,
    //         z:this.z
    //     }
    // }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        let parentKeyNames=super.getGeometryKeyNames()
        return parentKeyNames.concat(["width","height"])
    }

    exportMeshGeometry(){
        return new PlaneBufferGeometry(this.width,this.height); //the text is not needed for the navmesh generation
    }

    exportEntityToAFrame(assets,scene){
        return "<a-text "+this.exportAttributesToAFrame(assets,scene)+"></a-text>";
    }

    exportAttributesToAFrame(assets,scene) {
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        //TODO: does not export the font, currently only Roboto is supported
        let lines = this.text.split(/\r?\n/)
        let mostSymbols=0
        for(let index=0; index<lines.length;index++){ //calculate the longest string to configure the symbol wrapper
            if(lines[index].length>mostSymbols){
                mostSymbols=lines[index].length
            }
        }
        attributesData +=" wrap-count='"+mostSymbols+"'"
            +" color='" + this.color+"'"
            +" value=\""+this.text.replace(/\r?\n/g,"\\n").replace(/"/g,"&quot;") +"\""
            +" height='"+(this.height-2*this.getAdjustedPadding())+"'"
            +" width='"+(this.width-2*this.getAdjustedPadding())+"'"
            +" anchor='center'"
            +" material='visible:"+this.background+";"
            +" side:double; "
            +" color:"+this.backgroundColor+";'"
            +" geometry=' primitive:plane;"
            +" height:"+this.height+";"
            +" width:"+this.width+";'"


        return attributesData;
    }


    exportAttributes() {
        let attributesData = super.exportAttributes();
        attributesData +=" font='" + this.font + "'"
            +" background='" + this.background + "'"
            +" backgroundColor='" + this.backgroundColor + "'"
            +" padding='" + this.padding + "'"
            +" height='" + this.height + "'"
            +" width='" + this.width + "'"
            +" color='" + this.color + "'"
            +" textSize='" + this.textSize + "'"
        return attributesData;
    }

    exportEntity(){
        let exportData="<Text "+this.exportAttributes()+">";
        let xmlConfirmText=this.text.replace(/&/g, '&amp;amp;') //replace all &
            .replace(/</g, '&lt;') //replace all <
            .replace(/>/g, '&gt;') //replace all >
            .replace(/"/g, '&quot;') //replace all "
            .replace(/'/g, '&apos;') //replace all '
            .replace(/\n/g,'&newLine;'); // replace all line breaks
        exportData+="\n<text>\n"+xmlConfirmText+"\n</text>";
        if(this.hasInteractions()){
            exportData+="\n"+this.exportInteractions()
        }
        if(this.hasTextures()){
            exportData+="\n"+this.exportTextures();
        }
        exportData+="\n</Text>";
        return exportData;
    }

    printScenegraph() {
        return "Text " + this.getName();
    }

    setAttribute(name, value) {
        switch (name) {
            case "background":
                if (typeof value ==="string"){
                    this.background = value==="true";
                }
                else{
                    this.background = value;
                }
                break;
            case "height":
                this.height = parseFloat(value);
                break;
            case "width":
                this.width = parseFloat(value);
                break;
            case "backgroundColor":
                this.backgroundColor = value;
                break;
            case "color":
                this.color = value;
                break;
            case "font":
                this.font = value;
                break;
            case "padding":
                this.padding = parseFloat(value);
                this.updateBackgroundSize();
                break;
            case "textSize":
                this.textSize = parseFloat(value);
                this.updateBackgroundSize();
                break;
            case "text":
                let unescapedText=value.replace(/&newLine;/g,'\n') // replace all line breaks
                    .replace(/&apos/g, "'") //replace all '
                    .replace(/&quot;/g, '"') //replace all "
                    .replace(/&gt;/g, '>') //replace all >
                    .replace(/&lt;/g, '<') //replace all <
                    .replace(/&amp;amp;/g, '&') //replace all &
                this.text = unescapedText;
                this.updateBackgroundSize();
                break;
            default:
                super.setAttribute(name, value);
        }
    }

    updateBackgroundSize(){
        if (this.getSize()>0 && this.text && this.fontThree){ // check if text is set, font is loaded and size is above 0
            let geometry = new TextBufferGeometry( this.text, {
                font: this.getThreeFont(),
                size: this.getSize(),
                height: 0, //2D
            } );
            geometry.computeBoundingBox()
            let coords =geometry.boundingBox
            this.height=coords.max.y-coords.min.y+ 2*this.getAdjustedPadding()
            this.width=coords.max.x-coords.min.x + 2*this.getAdjustedPadding()
            this.backgroundPosition=
                [
                    coords.min.x-this.getAdjustedPadding()+(this.width/2), //start from the ThreeText minus the padding and plus half of the width because the plane is centered around the position
                    coords.min.y-this.getAdjustedPadding()+(this.height/2),//start from the ThreeText minus the padding and plus half of the height because the plane is centered around the position
                    -0.0001 //so it does not intersect with the text
                ]
        }
    }

    getText() {
        return this.text;
    }

    getColor() {
        return this.color;
    }

    getSize() {
        return this.textSize/1000;
    }
    getAdjustedPadding(){
        return this.padding/1000;
    }

    getThreeFont(){
        return this.fontThree
    }
    hasBackground(){
        return this.background;
    }
    getBackgroundColor(){
        return this.backgroundColor;
    }
    getBackgroundSize(){
        return [this.width,this.height];
    }
    getBackgroundPosition(){
        return this.backgroundPosition;
    }
    getTextPosition(){
        return[-this.width/2+this.getAdjustedPadding(),
            this.height/2-this.getSize()-this.getAdjustedPadding(),
            0.0001
        ];
    }

    getDetails() {
        let parentDetails = super.getDetails();
        parentDetails = parentDetails.concat(
            [
                {printName: "Text", inputType: "textarea", name: "text", value: this.text}, //text details
                {
                    categoryName: "Text Decoration",
                    containedElements: [
                        {printName: "Color", inputType: "color", name: "color", value: this.color}, //text color details
                        {printName: "Size", inputType: "number", name: "textSize", value: this.textSize, step: 1}, //width details
                    ]
                },
                {printName: "Background", inputType: "checkbox", name: "background", value: this.background}, //background details
            ]
        );
        if(this.background){
            parentDetails = parentDetails.concat(
                [
                    {
                        categoryName:"Background Decoration",
                        containedElements: [
                            {printName: "Color", inputType: "color", name: "backgroundColor", value: this.backgroundColor}, //text color details
                            {printName: "Padding", inputType: "number", name: "padding", value: this.padding}, //text color details
                        ]
                    },
                ]
            );
        }
        return parentDetails
    }

    getEffects() {
        let parentEffects = super.getEffects();
        return parentEffects.concat([
            {
                printName: "Change Text",
                id:"change-property_text",
                module:"change-property",
                options:{
                    property:"value"
                },
                parameterList: [
                    {printName: "Text", inputType: "textarea", name: "text", value: this.text},
                ],
            },
            {
                printName: "Change Text Color",
                id:"change-property_textcolor",
                module:"change-property",
                options:{
                    property:"color"
                },
                parameterList: [
                    {printName: "Text Color", inputType: "color", name: "color", value: this.color},
                ],
            },
        ]);
    }
}
