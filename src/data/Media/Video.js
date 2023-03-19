import {LinearFilter, VideoTexture} from "three";
import Media2D from "./Media2D";

export default class Video extends Media2D {
    constructor(url,starttime=0,autoplay=false,loop=false,userUploaded, width, height, name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation, interactions,textures) { //Javascript allows only one constructor
        super(url,userUploaded, width, height, name, x, y, z, xScale, yScale, zScale, xRotation, yRotation, zRotation, interactions,textures);
        this.autoplay=autoplay;
        this.loop=loop;
        this.starttime=starttime;
        this.className="Video" // this is needed because in production constructor.name isn't possible
        if (typeof Video.counterChild == 'undefined') { //init the static variable on the first constructor call
            Video.counterChild = 1;
        }
        this.name = "Video" + Video.counterChild; //set the name to class name + counter
        Video.counterChild++;
    }

    copyEntity(){
        let copiedObject=new Video();
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject) {
        super.copyTo(copiedObject)
        copiedObject.autoplay=this.autoplay;
        copiedObject.loop=this.loop;
    }

    loadEntity(callback,loadOptions) {
        this.videoSrc = document.createElement( 'video' );
        this.videoSrc.src = this.url;
        this.videoSrc.load(); // must call after setting/changing source
        this.videoSrc.addEventListener('loadeddata', function() {
            // Video is loaded and can be played
            this.videoThree = new VideoTexture(this.videoSrc );
            this.videoThree.minFilter = LinearFilter;
            this.videoThree.magFilter = LinearFilter;
            let format=this.calculateFormat(this.videoSrc.videoHeight,this.videoSrc.videoWidth)
            this.height=format[0];
            this.width=format[1];
            if(this.yNotSet){
                this.y=this.height/2
            }
            this.duration=this.videoSrc.duration
            callback(this);
        }.bind(this), { once: true });
    }

    exportAssetsToAFrame(assets) { //every video needs its own source or the will play in sync
        return "<video id=\""+this.getID()+"-vid\" src=\""+this.url+"\"></video>"
    }

    exportEntityToAFrame(assets,scene){
        return "<a-video "+this.exportAttributesToAFrame(assets,scene)+"></a-video>";
    }

    exportAttributesToAFrame(assets,scene) {
        let attributesData = super.exportAttributesToAFrame(assets,scene);
        attributesData += " src='#"+this.getID()+"-vid'" //sets the id of the added asset with the source
            +" loop=\""+this.loop+"\""
            +" video-start-time=\"second:"+this.starttime+"\""
            +" video-manager "
        if(this.autoplay){
            attributesData+=" autoplay "
        }
        return attributesData;
    }

    exportAttributes() {
        let attributesData = super.exportAttributes();
        attributesData+=" autoplay='"+this.autoplay+"'"
            +" loop='"+this.loop+"'"
            +" starttime='"+this.starttime+"' ";
        return attributesData;
    }

    printScenegraph() {
        return "Video " + this.getName();
    }

    setAttribute(name, value) {
        switch (name) {
            case "loop":
                if (typeof value ==="string"){
                    this.loop = value==="true";
                }
                else{
                    this.loop = value;
                }
                break;
            case "autoplay":
                if (typeof value ==="string"){
                    this.autoplay = value==="true";
                }
                else{
                    this.autoplay = value;
                }
                break;
            case "starttime":
                let start=parseFloat(value)
                this.starttime=parseFloat(start);
                if(this.videoSrc){
                    this.videoSrc.currentTime=start
                }
                break;
            default:
                super.setAttribute(name, value);
        }
    }

    getLoadedSource(){
        return this.videoThree
    }

    getDetails() {
        let parentDetails = super.getDetails();
        return parentDetails.concat(
            [
                {printName: "Start", inputType: "range" ,name: "starttime",  value: this.starttime,   step:1,  min:0,  max:this.duration}, //start details
                {
                    categoryName: "Video Settings",
                    containedElements: [
                        {printName: "Autoplay", inputType: "checkbox" ,name: "autoplay",  value: this.autoplay}, //autoplay details
                        {printName: "Loop", inputType: "checkbox", name: "loop", value: this.loop},// loop details
                    ]
                },
            ]
        );
    }

    getEvents(){
        let parentEvents=super.getEvents();
        return parentEvents.concat( [ //list all Events. Printname is used to describe the event. Value is used to save the javascript event name
            {printName: "Video played on ", value: "videoPlayed"}, // mouseenter event
            {printName: "Video paused on ", value: "videoPaused"}, //mouseleave event
            {printName: "Video ended on", value: "videoEnded"}, //mouseleave event
        ]);

    }

    getEffects() {
        let parentEffects = super.getEffects();
        return parentEffects.concat(
            [
                {
                    printName:"Play the Video",
                    id:"video-play",
                    module:"video-play",
                    options:{},
                    parameterList: [
                       ]
                },
                {
                    printName:"Pause the Video",
                    id:"video-pause",
                    module:"video-pause",
                    options:{},
                    parameterList: [
                        ]
                },
                {
                    printName:"Play/Pause the Video",
                    id:"video-play-pause",
                    module:"video-play-pause",
                    options:{},
                    parameterList: [
                        ]
                },
                {
                    printName:"Set Video to Second",
                    id:"video-set-to-second",
                    module:"video-set-to-second",
                    options:{},
                    parameterList: [
                        {printName: "Second", inputType: "range" ,name: "starttime",  value: this.starttime,   step:1,  min:1,  max:this.duration}, //start details
                    ]
                },
                {
                    printName:"Skip Video by Seconds",
                    id:"video-skip-seconds",
                    module:"video-skip-seconds",
                    options:{},
                    parameterList: [
                        {printName: "Second", inputType: "number" ,name: "skiptime",  value: 10,   step:1,}, //start details
                    ]
                },
            ]
        );
    }
}
