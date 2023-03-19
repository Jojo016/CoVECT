import Media2D from "./Media2D";
import {TextureLoader} from "three";

export default class Pdf extends Media2D {
    constructor(url,imageUrls,startPage=1,repeat=true,userUploaded, width , height , name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation, interactions,textures) { //Javascript allows only one constructor
        super(url,userUploaded, width , height , name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation, interactions,textures);
        this.imageUrls = imageUrls;
        this.startPage = startPage;
        this.repeat=repeat;
        this.loadedPageImages=[];
        this.className="Pdf" // this is needed because in production constructor.name isn't possible
        if (typeof Pdf.counterChild == 'undefined') { //init the static variable on the first constructor call
            Pdf.counterChild = 1;
        }
        this.name = "Pdf" + Pdf.counterChild; //set the name to class name + counter
        Pdf.counterChild++;
    }

    loadPageRecursive(loadList, loadedPages,loader,callback){
        if (loadList.length<1){ // all pages are load
            this.loadedPageImages=loadedPages;
            callback(this);
        }
        else{
            loader.load(loadList[0],
                pageImage =>{
                    let format=this.calculateFormat(pageImage.image.height,pageImage.image.width)
                    this.height=format[0];
                    this.width=format[1];
                    if(this.yNotSet){
                        this.y=this.height/2
                    }
                    this.loadPageRecursive(loadList.slice(1),loadedPages.concat(pageImage),loader,callback)
                },
                () => {}, //do nothing
                event => {
                    console.log("error", event)
                    callback(this)
                }
            );
        }
    }

    loadEntity(callback,loadOptions) {
        this.loadPageRecursive(this.imageUrls,[],new TextureLoader(),callback)
    }

    copyEntity(){
        let copiedObject=new Pdf();
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.imageUrls = this.imageUrls;
        copiedObject.startPage = this.startPage;
        copiedObject.repeat = this.repeat;
    }

    exportAssetsToAFrame(assets) {
        let assetList=""
        if(this.imageUrls){
            for(let index=0;index<this.imageUrls.length;index++){
                if(this.checkIfAssetsIsNotIncluded(this.imageUrls[index],assets)){
                    assets.push({src:this.imageUrls[index],id:this.getID()+"-"+index+"-img"})
                    assetList+="<img alt='assets' id=\""+this.getID()+"-"+index+"-img\" src=\""+this.imageUrls[index]+"\">\n"
                }
            }
        }
        return assetList
    }

    exportEntityToAFrame(assets,scene){
        //PDF uses image because all pages are images
        return "<a-image "+this.exportAttributesToAFrame(assets,scene)+"></a-image>";
    }

    exportAttributesToAFrame(assets,scene) {
        //the src of the start page is set by pdf-manager
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        let pages=""
        if(this.imageUrls) {
            for(let index=0;index<this.imageUrls.length;index++){
                let assetID= this.getAssetsID(this.imageUrls[index],assets)
                if(assetID===""){
                    assetID= this.getID()+"-"+index+"-img";
                }
                if(index===this.imageUrls.length-1){
                    pages+="#"+assetID
                }
                else {
                    pages+="#"+assetID+", "
                }
            }
        }
        attributesData += " pdf-manager=\"start:"+this.startPage+"; repeat:"+this.repeat+"; pages:"+pages+"\""
        return attributesData;
    }

    exportAttributes() {
        let attributesData = super.exportAttributes();
        attributesData +=" startPage='" + this.startPage + "'"
            +" repeat='"+this.repeat+"' ";
        return attributesData;
    }

    exportListAttributes(){
        return this.exportListToXML("imageUrls",this.imageUrls,"\t\t");
    }

    printScenegraph() {
        return "Pdf " + this.getName();
    }

    setAttribute(name, value) {
        switch (name) {
            case "startPage":
                this.startPage = parseFloat(value);
                break;
            case "imageUrls":
                if(Array.isArray(value)){
                    this.imageUrls = value;
                }
                else{
                    this.imageUrls = [value];
                }
                break;
            case "repeat":
                if (typeof value ==="string"){
                    this.repeat = value==="true";
                }
                else{
                    this.repeat = value;
                }
                break;
            default:
                super.setAttribute(name, value);
        }
    }

    getLoadedSource(){
        if(this.loadedPageImages.length<1){
            return null;
        }
        return this.loadedPageImages[this.startPage-1]
    }

    getDetails() {
        let parentDetails = super.getDetails();
        let lastPage=0;
        if(this.imageUrls){
            lastPage=this.imageUrls.length
        }
        return parentDetails.concat(
            [
                {
                    categoryName: "Pdf Settings",
                    containedElements: [
                        {printName: "Start", inputType: "range" ,name: "startPage",  value: this.startPage,   step:1,  min:1,  max:lastPage}, //start details
                        {printName: "Repeat", inputType: "checkbox", name: "repeat", value: this.repeat},// repeat details
                    ]
                },

            ]
        );
    }

    getEvents(){
        let parentEvents=super.getEvents();
        return parentEvents.concat( [ //list all Events. Printname is used to describe the event. Value is used to save the javascript event name
            {printName: "Next Page Shown on ", value: "nextPagePdf"}, // mouseenter event
            {printName: "Previous Page Shown on ", value: "prevPagePdf"}, // mouseenter event
            {printName: "Pdf ended on ", value: "pdfEnded"}, //mouseleave event
            {printName: "Pdf reset on", value: "pdfReset"}, //mouseleave event
        ]);

    }

    getEffects() {
        let parentEffects = super.getEffects();
        let lastPage=0;
        if(this.imageUrls){
            lastPage=this.imageUrls.length
        }
        return parentEffects.concat([
            {
                printName:"Next Page",
                id:"pdf-next-page",
                module:"pdf-next-page",
                options:{},
                parameterList: [
                ]
            },
            {
                printName:"Previous Page",
                id:"pdf-prev-page",
                module:"pdf-prev-page",
                options:{},
                parameterList: [
                ]
            },
            {
                printName:"Set to Page",
                id:"pdf-set-page",
                module:"pdf-set-page",
                options:{},
                parameterList: [
                    {printName: "Start", inputType: "range" ,name: "startPage",  value: this.startPage,   step:1,  min:1,  max:lastPage}, //start details
                ]
            },
        ]);
    }
}
