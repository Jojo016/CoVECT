import {Box3, BufferGeometry, Mesh, MeshBasicMaterial, TextureLoader, Vector3} from "three";

export default class Entity {
    constructor(name, x=0, y=0, z=0,xScale=1,yScale=1,zScale=1,xRotation=0,yRotation=0,zRotation=0,userUploaded=false,interactions=[], textures =[]) { //Javascript allows only one constructor
        this.name=name;
        this.x=x;
        this.y=y;
        this.z=z;
        this.xScale=xScale;
        this.yScale=yScale;
        this.zScale=zScale;
        this.xRotation=xRotation;
        this.yRotation=yRotation;
        this.zRotation=zRotation;
        this.userUploaded=userUploaded //defines if the User uploaded the Entitiy
        this.interactions=interactions;
        this.textures=textures;
        this.isStatic=true;
        this.isDynamic=false;
        this.physicsDisabled=false;
        this.isAutoscaled=false;
        this.receiveShadow=true;
        this.castShadow=true;
        this.visible=true;
        this.className="Entity" // this is needed because in production constructor.name isn't possible
        if ( typeof Entity.counter == 'undefined' ) { //init the static variable on the first constructor call
            Entity.counter = 1;
        }
        this.id="Entity"+Entity.counter; //set the name to class name + counter
        if ( typeof this.name == 'undefined' ) { //init the static variable on the first constructor call
            this.name = this.id;
        }
        Entity.counter++;
    }

    performLoadTexturesRecursive(textureList,loadedTextures,options, callbackTextures){
        if(textureList.length>0) { //textures have to be loaded
            let loader = new TextureLoader(); //init loader
            loader.load(textureList[0].url, //load the first texture in the list
                texture => { //this is called after succesful loading the texture
                    textureList[0].saveLoadedTexture(texture);
                    this.performLoadTexturesRecursive(textureList.slice(1),loadedTextures.concat({materialName:textureList[0].materialName,texture:texture}),options,callbackTextures);
                },
                ()=>{}, //do nothing
                event => {
                console.log("error",event);
                callbackTextures(null);
                }
            );
        }
        else{ //all textures are loaded and the callback is called
            callbackTextures(loadedTextures); //call the callback with the loaded textures
        }
    }

    loadTextures(callback,options){
        if(this.textures.length>0) { //The textures have to be loaded before the model will be loaded
            this.performLoadTexturesRecursive(this.textures, // the textures to load
                [], //init the loading function with a empty list
                options,
                callback //loads the model after loading the textures
            )
        }
        else{
            callback([])
        }
    }

    copyEntity(){//creates a new object and performs a copy
        let copiedObject=new Entity() ;
        this.copyTo(copiedObject)
        return copiedObject;
    }

    copyTo(copiedObject){ //performs a copy to a passed object
        copiedObject.x=this.x;
        copiedObject.y=this.y;
        copiedObject.z=this.z;
        copiedObject.xScale=this.xScale;
        copiedObject.yScale=this.yScale;
        copiedObject.zScale=this.zScale;
        copiedObject.xRotation=this.xRotation;
        copiedObject.yRotation=this.yRotation;
        copiedObject.zRotation=this.zRotation;
        copiedObject.receiveShadow=this.receiveShadow
        copiedObject.castShadow=this.castShadow
        copiedObject.isDynamic=this.isDynamic;
        copiedObject.isStatic=this.isStatic;
        copiedObject.physicsDisabled=this.physicsDisabled;
        copiedObject.visible=this.visible;
        copiedObject.isAutoscaled=this.isAutoscaled;
        copiedObject.userUploaded=this.userUploaded //defines if the User uploaded the Entitiy
        copiedObject.interactions=[];
        for(let index=0;index<this.interactions.length;index++){
            let copiedInteraction=this.interactions[index].copyInteraction();
            if(copiedInteraction.hasTarget(this)){ //interaction was on the entity itself, so the target has to be set to the new copied entity
                copiedInteraction.setAttribute("target",copiedObject);
            }
            copiedObject.interactions=copiedObject.interactions.concat(copiedInteraction)

        }
        copiedObject.textures=[];
        for(let index=0;index<this.textures.length;index++){
            copiedObject.textures=copiedObject.textures.concat(this.textures[index].copyTexture())
        }
    }

    getGeometryKeyNames(){ //these keys are exported for navigation mesh generation
        return ["x","y","z","xScale","yScale","zScale","xRotation","yRotation","zRotation"]
    }

    isExportedForNavmeshGeneration(){ //decides if the entity will be considered for the navigantion mesh generation
        return true;
    }

    exportForNavmeshGeneration(){ //export all important data for navmash and obj generation on server-side
        if(this.isExportedForNavmeshGeneration()){ //export only entities which have collisions
            if (this.isStatic) { //ignore dynamic meshes
                const keys = this.getGeometryKeyNames()
                let classToObject = keys.reduce((classAsObj, key) => {
                    classAsObj[key] = this[key]
                    return classAsObj
                }, {className: this.getClassName()})
                return classToObject; //the exported geometry info of the entity
            }
        }
        return null; // this entity isnt exported
    }

    exportMeshGeometry(){ //export the geometry of entity
        return new BufferGeometry();
    }
    exportMeshMaterial(){ //export the material of the entity
        return new MeshBasicMaterial();
    }

    exportAsMesh(){ //export the mesh of the entity, used for geneartion of a obj file for navmesh generation
        let geometry=this.exportMeshGeometry();
        let material=this.exportMeshMaterial();
        let mesh= new Mesh(geometry,material);
        let adjustedRotation=this.getRotation("radians")
        mesh.rotation.set(adjustedRotation[0],adjustedRotation[1],adjustedRotation[2]);
        mesh.position.set(this.x,this.y,this.z);
        mesh.scale.set(this.xScale,this.yScale,this.zScale);
        mesh.updateMatrix();
        return mesh;
    }

    exportEntityToAFrame(assets,scene){ //export the entity to Aframe
        return "<a-entity "+this.exportAttributesToAFrame(assets,scene)+"></a-entity>";
    }

    exportPositionToAFrame(){
        return {x:this.x, y:this.y,z:this.z}
    }
    exportScaleToAFrame(){
        return {x:this.xScale, y:this.yScale,z:this.zScale}
    }
    exportRotationToAFrame(){
        return {x:this.xRotation, y:this.yRotation,z:this.zRotation}
    }

    exportPhysicsToAframe(){
        if(this.physicsDisabled){
            return "";
        }
        if(this.isStatic){
            return" static-body ";
        }
        else{
            if(this.isDynamic){
                return" dynamic-body ";
            }
        }
        return ""
    }

    exportAttributesToAFrame(assets,scene){ //export all attributes of the entity to Aframe
        let position=this.exportPositionToAFrame() //this way the position can be altered for specific sub classes
        let scale=this.exportScaleToAFrame()
        let rotation=this.exportRotationToAFrame()
        let attributes= " id='"+this.id+"' "
        attributes+=this.exportPhysicsToAframe()
        for (let index=0; index<this.interactions.length;index++){
            attributes+=this.interactions[index].exportInteractionToAframe() +" "
        }
        attributes+=" visible='"+this.isVisible()+"' "
        attributes+=" position='"+position.x+" "+position.y+" "+position.z+"'"
            +" scale='"+scale.x+" "+scale.y+" "+scale.z+"'"
            +" rotation='"+rotation.x+" "+rotation.y+" "+rotation.z+"' ";
        if(this.receiveShadow||this.castShadow){
            attributes+="shadow=\"cast:"+this.castShadow+"; receive:"+this.receiveShadow+";\""
        }
        return attributes
    }

    checkIfAssetsIsNotIncluded(asset,assetsList){
        for (let index=0;index<assetsList.length;index++){
            if(asset===assetsList[index].src){
                return false;
            }
        }
        return true;
    }

    getAssetsID(asset,assetsList){
        for (let index=0;index<assetsList.length;index++){
            if(asset===assetsList[index].src){
                return assetsList[index].id;
            }
        }
        return "";
    }

    exportAssetsToAFrame(assets){
        let assetsData=""
        let textureList=this.textures;
        for(let index=0;index<textureList.length;index++){
            assetsData+=textureList[index].exportAssetsToAFrame(assets)+"\n";
        }
        return assetsData;
    }


    exportAttributes(){
        return " name='"+this.name+"'"
            +" id='"+this.id+"'"
            +" x='"+this.x+"'"
            +" y='"+this.y+"'"
            +" z='"+this.z+"'"
            +" xScale='"+this.xScale+"'"
            +" yScale='"+this.yScale+"'"
            +" zScale='"+this.zScale+"'"
            +" xRotation='"+this.xRotation+"'"
            +" yRotation='"+this.yRotation+"'"
            +" zRotation='"+this.zRotation+"' "
            +" visible='"+this.visible+"' "
            +" physicsDisabled='"+this.physicsDisabled+"' "
            +" isStatic='"+this.isStatic+"' "
            +" isDynamic='"+this.isDynamic+"' "
            +" castShadow='"+this.castShadow+"' "
            +" receiveShadow='"+this.receiveShadow+"' "
            +" isAutoscaled='"+this.isAutoscaled+"' "
            +" userUploaded='"+this.userUploaded+"' ";
    }
    exportInteractions(){
        if(this.interactions.length>0) { //entity contains interactions
            let interactionData = "<Interactions>\n";
            for (let i = 0; i < this.interactions.length; i++) {
                interactionData +="\t\t\t"+ this.interactions[i].exportInteraction() + "\n";
            }
            interactionData += "\t\t</Interactions>";
            return interactionData;
        }
        else{ //entity contains no interactions
            return "";
        }
    }

    exportTextures(){
        if(this.textures.length>0){ // entity contains textures
            let textureData="<Textures>\n";
            for (let i=0;i<this.textures.length;i++){
                textureData+="\t\t\t"+this.textures[i].exportTexture() + "\n";
            }
            textureData+="\t\t</Textures>";
            return textureData;
        }
        else{ //contains no textures
            return "";
        }
    }

    exportEntity(){
        let exportData="\t<"+this.getClassName()+" "+this.exportAttributes()+">";
        if(this.hasInteractions()){
            exportData+="\n\t\t"+this.exportInteractions()
        }
        if(this.hasTextures()){
            exportData+="\n\t\t"+this.exportTextures();
        }
        exportData+="\n\t\t"+this.exportListAttributes() //include entity specific xml tags
        exportData+="\n\t</"+this.getClassName()+">";
        return exportData;
    }


    //function to include xml tags in the entity tag
    exportListAttributes(){
        return "";
    }

    //helper function to export a list to a xml string, name is the name of the xml tag and list contains the entries
    exportListToXML(name,list,tabs){
        if(!tabs){ //undefined then set to empty string
            tabs=""
        }
        let exportData="<"+name+" list='true'>\n";
        if(list){
            for(let index=0; index<list.length;index++){
                exportData+="\t"+tabs+"<entry>"+list[index]+"</entry>\n";
            }
        }
        exportData+=tabs+"</"+name+">";
        return exportData
    }

    fillFromAttributes(attributes){
        let attributeList=Object.entries(attributes); //convert Object to List of contained variables
        for (let index=0;index<attributeList.length;index++){
            this.setAttribute(attributeList[index][0],attributeList[index][1]);
        }
    }

    loadEntity(callback,options){
        //nothing needs to be loaded
        callback(this)
    }

    hasToBeLoaded(){
        return false;
    }

    transform(mode,objectThree){
        switch(mode){
            case "translate":
                this.setAttribute("position",
                    [
                        objectThree.position.x,
                        objectThree.position.y,
                        objectThree.position.z
                    ]
                );
                break;
            case "rotate":
                this.setAttribute("rotation",
                    [
                        objectThree.rotation.x*180/Math.PI,
                        objectThree.rotation.y*180/Math.PI,
                        objectThree.rotation.z*180/Math.PI
                    ]
                    );
                break;
            case "scale":
                this.setAttribute("scale",
                    [
                        this.xScale*objectThree.scale.x,
                        this.yScale*objectThree.scale.y,
                        this.zScale*objectThree.scale.z
                    ]
                );
                break;
            default:
                console.log("transform "+mode+" not supported");
        }
    }

    printScenegraph(){ //called when the object has to be printed for the Scenegraph
        return "Entity "+ this.name;
    }

    hasInteractions(){ //called to look if the object is nested
        return this.interactions.length > 0;
    }

    hasTextures(){ //called to look if the object is nested
        return this.textures.length > 0;
    }

    getClassName(){ //this function returns name of the class object
        return this.className;
    }
    getName(){ //returns the name of the object
        return this.name;
    }
    getID(){
        return this.id;
    }
    getPosition(){
        return [this.x,this.y,this.z]
    }

    getScale(){
        return [this.xScale,this.yScale, this.zScale]
    }

    getRotation(unit){
        switch (unit) {
            case "degrees":
                return [this.xRotation,this.yRotation, this.zRotation]
            case "radians":
                return [this.xRotation*Math.PI/180,this.yRotation*Math.PI/180, this.zRotation*Math.PI/180]
            default:
                return []
        }

    }

     onRemove(){ //called when the object is deleted

     }
     containsInteraction(interaction){
        for (let i=0; i<this.interactions.length;i++) {
            if (this.interactions[i].checkInteractionAreEqual(interaction)) {
                console.log("hh")
                return true;
            }
        }
        return false;
     }

     addInteraction(interaction){
        if(!this.containsInteraction(interaction)){
            this.interactions=this.interactions.concat(interaction);
        }
     }

    removeInteraction(interaction){
        if(interaction){
            const interactionList= this.getInteractions().slice();
            for( let elementIndex = 0; elementIndex < interactionList.length; elementIndex++){ //remove the object from the list
                if ( interactionList[elementIndex].getID() === interaction.getID()){
                    interactionList.splice(elementIndex, 1);
                    this.interactions=interactionList;
                    interaction.onRemove(); // call the remove function of the object
                    break;
                }
            }
        }
    }



    removeInteractionWithTarget(target){
        const interactionList = this.getInteractions().slice(); // copy the list
        let deletedInteractions=[];
        for( let elementIndex = interactionList.length-1; elementIndex >=0 ; elementIndex--){ //go from the last element through the list so that deleted elements dont affect the index
            if ( interactionList[elementIndex].hasTarget(target)) { //checks if the interaction has that target
                deletedInteractions.push(interactionList[elementIndex])
                interactionList.splice(elementIndex, 1);
            }
        }
        this.interactions=interactionList;
        return deletedInteractions
    }

    containsTextureMaterialName(texture){
        for (let i=0; i<this.textures.length;i++) {
            if (this.textures[i].materialName===texture.materialName) {
                return i;
            }
        }
        return -1;
    }

    addTexture(texture){
        let index = this.containsTextureMaterialName(texture)
        if(index<0){
            this.textures=this.textures.concat(texture);
        }
        else{
            this.textures[index]=texture;
        }
    }

     setAttribute(name,value){
        switch (name) {
            case "name":
                this.name=value;
                break;
            case "id":
                this.id=value;
                break;
            case "x":
                this.x=parseFloat(value);
                break;
            case "y":
                this.y=parseFloat(value);
                break;
            case "z":
                this.z=parseFloat(value);
                break;
            case "position":
                if (value instanceof Vector3){
                    this.x=parseFloat(value.x.toFixed(3));
                    this.y=parseFloat(value.y.toFixed(3));
                    this.z=parseFloat(value.z.toFixed(3));
                }
                else{
                    this.x=parseFloat(parseFloat(value[0]).toFixed(3));
                    this.y=parseFloat(parseFloat(value[1]).toFixed(3));
                    this.z=parseFloat(parseFloat(value[2]).toFixed(3));
                }
                break;
            case "positionPOV":
                if (value instanceof Vector3){
                    this.x=parseFloat(value.x.toFixed(3));
                    this.y+=parseFloat(value.y.toFixed(3));
                    this.z=parseFloat(value.z.toFixed(3));
                }
                else{
                    this.x=parseFloat(parseFloat(value[0]).toFixed(3));
                    this.y+=parseFloat(parseFloat(value[1]).toFixed(3));
                    this.z=parseFloat(parseFloat(value[2]).toFixed(3));
                }
                break;
            case "xRotation":
                this.xRotation=parseFloat(value);
                break;
            case "yRotation":
                this.yRotation=parseFloat(value);
                break;
            case "zRotation":
                this.zRotation=parseFloat(value);
                break;
            case "rotation":
                this.xRotation=parseFloat(parseFloat(value[0]).toFixed(2));
                this.yRotation=parseFloat(parseFloat(value[1]).toFixed(2));
                this.zRotation=parseFloat(parseFloat(value[2]).toFixed(2));
                break;
            case "xScale":
                this.xScale=parseFloat(value);
                break;
            case "yScale":
                this.yScale=parseFloat(value);
                break;
            case "zScale":
                this.zScale=parseFloat(value);
                break;
            case "scale":
                this.xScale=parseFloat(value[0]);
                this.yScale=parseFloat(value[1]);
                this.zScale=parseFloat(value[2]);
                break;
            case "interactions":
                this.interactions=value;
                break;
            case "textures":
                this.textures=value;
                break;
            case "physicsDisabled":
                if (typeof value ==="string"){
                    this.physicsDisabled = value==="true";
                }
                else{
                    this.physicsDisabled = value;
                }
                break;
            case "isStatic":
                if (typeof value ==="string"){
                    this.isStatic = value==="true";
                }
                else{
                    this.isStatic = value;
                }
                break;
            case "isDynamic":
                if (typeof value ==="string"){
                    this.isDynamic = value==="true";
                }
                else{
                    this.isDynamic = value;
                }
                break;
            case "castShadow":
                if (typeof value ==="string"){
                    this.castShadow = value==="true";
                }
                else{
                    this.castShadow = value;
                }
                break;
            case "receiveShadow":
                if (typeof value ==="string"){
                    this.receiveShadow = value==="true";
                }
                else{
                    this.receiveShadow = value;
                }
                break;
            case "toggleStatic":
                if (typeof value ==="string"){
                    let staticValue=value==="true"
                    this.isStatic = staticValue;
                    this.isDynamic=!staticValue;
                }
                else{
                    this.isStatic = value;
                    this.isDynamic = !value
                }
                break;
            case "isAutoscaled-with-performing":
                if (typeof value ==="string"){
                    this.isAutoscaled = value==="true";
                }
                else{
                    this.isAutoscaled = value;
                    if(value){
                        this.performAutoScale()
                    }
                }
                break;
            case "isAutoscaled":
                if (typeof value ==="string"){
                    this.isAutoscaled = value==="true";
                }
                else{
                    this.isAutoscaled = value;
                }
                break;
            case "userUploaded":
                if (typeof value ==="string"){
                    this.userUploaded = value==="true";
                }
                else{
                    this.userUploaded = value;
                }
                break;
            case "visible":
                if (typeof value ==="string"){
                    this.visible = value==="true";
                }
                else{
                    this.visible = value;
                }
                break;
            default:
                console.log("Variable "+name+" is unknown");
        }
     }

     getInteraction(event,target,module,effect){
        for (let i=0; i<this.interactions.length;i++){
            if(this.interactions[i].checkInteractionContains(event,target,module,effect)){
                return this.interactions[i];
            }
        }
        return null;
     }

     getInteractions(){
        return this.interactions;
     }


    isUploaded(){
        return this.userUploaded
    }
    isVisible(){
        return this.visible;
    }

    canBeGrabbed(){
        if(this.physicsDisabled){
            return false;
        }
        return this.isDynamic
    }

    canBeDeletedFromScene(){
        return true;
    }

    canBeCopiedInScene(){
        return true;
    }

    performAutoScale(){ //the dummy class only resets the scale
        //there is no Threejs Object to autoscale
    }

    // removeAutoScale(){ //the dummy class only resets the scale
    //     //there is no Threejs Object which was autoscaled
    //     this.setAttribute("scale",[1,1,1]) //reset scale in editor
    // }

    autoScale(mesh,span){
        console.log("autoscale",[mesh,span])
        var bbox = new Box3().setFromObject(mesh);
        var cent = bbox.getCenter(new Vector3());
        var size = bbox.getSize(new Vector3());

        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        mesh.scale.multiplyScalar(span / maxAxis);

        //Reposition to center
        bbox.setFromObject(mesh)
        bbox.getCenter(cent); // returns the world position center of the model
        let worldPosition=new Vector3()
        mesh.getWorldPosition(worldPosition);//to get the relative position the world position has to be subtracted
        mesh.position.set(worldPosition.x-cent.x,worldPosition.y-cent.y,worldPosition.z-cent.z);

        this.isAutoscaled=true;
        return mesh;
    }


    getConditionPropertyList(){
        return [
            {printName: "Visibility", id:"visibility", inputType: "checkbox" ,name: "visible",  value: this.visible, typeValue:"bool", comparable:false},// visible details
            {printName: "Position X", id:"positionX", inputType: "number" ,name: "position, x",  value: this.x, typeValue:"number",  step:0.1, comparable:true}, //x details
            {printName: "Position Y", id:"positionY", inputType: "number" ,name: "position, y",  value: this.y, typeValue:"number",  step:0.1, comparable:true}, //y details
            {printName: "Position Z", id:"positionZ",inputType: "number" ,name: "position, z",  value: this.z,  typeValue:"number",  step:0.1, comparable:true},// z details
            {printName: "Rotation X", id:"rotationX", inputType: "number" ,name: "rotation, x",  value: this.xRotation, typeValue:"number",  step:1, comparable:true}, //x Rotation details
            {printName: "Rotation Y", id:"rotationY", inputType: "number" ,name: "rotation, y",  value: this.yRotation, typeValue:"number",  step:1, comparable:true}, //y Rotation details
            {printName: "Rotation Z", id:"rotationZ", inputType: "number" ,name: "rotation, z",  value: this.zRotation, typeValue:"number",  step:1, comparable:true},// z Rotation details
            {printName: "Scale X", id:"scaleX", inputType: "number", name: "scale, x", value: this.xScale, typeValue:"number", step: 0.1, comparable:true}, //x Scale details
            {printName: "Scale Y", id:"scaleY", inputType: "number", name: "scale, y", value: this.yScale, typeValue:"number", step: 0.1, comparable:true}, //y Scale details
            {printName: "Scale Z", id:"scaleZ", inputType: "number", name: "scale, z", value: this.zScale, typeValue:"number", step: 0.1, comparable:true},// z Scale details
        ]
    }

     getDetails(){
        return [

            {printName: "Name", inputType: "text" ,name: "name",  value: this.name}, //name details
            {
                categoryName:"Position",
                containedElements: [
                    {printName: "X", inputType: "number" ,name: "x",  value: this.x,   step:0.1}, //x details
                    {printName: "Y", inputType: "number" ,name: "y",  value: this.y,   step:0.1}, //y details
                    {printName: "Z", inputType: "number" ,name: "z",  value: this.z,   step:0.1},// z details
                ]
            },
            {
                categoryName:"Rotation",
                containedElements: [
                    {printName: "X", inputType: "number" ,name: "xRotation",  value: this.xRotation,   step:1}, //x Rotation details
                    {printName: "Y", inputType: "number" ,name: "yRotation",  value: this.yRotation,   step:1}, //y Rotation details
                    {printName: "Z", inputType: "number" ,name: "zRotation",  value: this.zRotation,   step:1},// z Rotation details
                ]
            },
            {
                categoryName: "Scale",
                containedElements: [
                    {printName: "X", inputType: "number", name: "xScale", value: this.xScale, step: 0.1}, //x Scale details
                    {printName: "Y", inputType: "number", name: "yScale", value: this.yScale, step: 0.1}, //y Scale details
                    {printName: "Z", inputType: "number", name: "zScale", value: this.zScale, step: 0.1},// z Scale details
                ]
            },
            {
                categoryName: "Physics",
                containedElements: [
                    {printName: "Static", inputType: "checkbox" ,name: "toggleStatic",  value: this.isStatic},// physics details
                    {printName: "Disable Physics", inputType: "checkbox" ,name: "physicsDisabled",  value: this.physicsDisabled},// physics details
                ]
            },
            {
                categoryName: "Shadow",
                containedElements: [
                    {printName: "cast", inputType: "checkbox" ,name: "castShadow",  value: this.castShadow},// z Scale details
                    {printName: "receive", inputType: "checkbox" ,name: "receiveShadow",  value: this.receiveShadow},// z Scale details
                ]
            },
            {printName: "Visibility", inputType: "checkbox" ,name: "visible",  value: this.visible},// physics details

        ];
     }

    getEvents(){
        return [ //list all Events. Printname is used to describe the event. Value is used to save the javascript event name
            {printName: "Look on ", value: "mouseenter"}, // mouseenter event
            {printName: "Look away from ", value: "mouseleave"}, //mouseleave event
            {printName: "Mouse Click on ", value: "click"}, //click event
            {printName: "Mouse pressed on", value: "mousedown"}, // mouseenter event
            {printName: "Mouse released on", value: "mouseup"}, //mouseleave event
            {printName: "Trigger pressed on", value: "triggerdown"}, // mouseenter event
            {printName: "Trigger released on", value: "triggerup"}, //mouseleave event

        ];
    }
    getEffects(){
        return [
            {
                printName:"Change Position",
                id:"change-property_position",
                module:"change-property",
                options:{
                    property:"position"
                },
                parameterList: [
                    {printName: "X", inputType: "number" ,name: "x",  value: this.x}, //x details
                    {printName: "Y", inputType: "number" ,name: "y",  value: this.y}, //y details
                    {printName: "Z", inputType: "number" ,name: "z",  value: this.z}// z details
                ]
            },
            {
                printName:"Add Position",
                id:"add-property_position",
                module:"add-property",
                options:{
                    property:"position"
                },
                parameterList: [
                    {printName: "X", inputType: "number" ,name: "x",  value: 0}, //x details
                    {printName: "Y", inputType: "number" ,name: "y",  value: 0}, //y details
                    {printName: "Z", inputType: "number" ,name: "z",  value: 0}// z details
                ]
            },
            {
                printName:"Change Rotation",
                id:"change-property_rotation",
                module:"change-property",
                options:{
                    property:"rotation"
                },
                parameterList: [
                    {printName: "X", inputType: "number" ,name: "xRotation",  value: this.xRotation}, //x Rotation details
                    {printName: "Y", inputType: "number" ,name: "yRotation",  value: this.yRotation}, //y Rotation details
                    {printName: "Z", inputType: "number" ,name: "zRotation",  value: this.zRotation}// z Rotation details
                ]
            },
            {
                printName:"Add Rotation",
                id:"add-property_rotation",
                module:"add-property",
                options:{
                    property:"rotation"
                },
                parameterList: [
                    {printName: "X", inputType: "number" ,name: "xRotation",  value: 0}, //x Rotation details
                    {printName: "Y", inputType: "number" ,name: "yRotation",  value: 0}, //y Rotation details
                    {printName: "Z", inputType: "number" ,name: "zRotation",  value: 0}// z Rotation details
                ]
            },
            {
                printName:"Change Scale",
                id:"change-property_scale",
                module:"change-property",
                options:{
                    property:"scale"
                },
                parameterList: [
                    {printName: "X", inputType: "number" ,name: "xScale",  value: this.xScale, step:0.1}, //x Scale details
                    {printName: "Y", inputType: "number" ,name: "yScale",  value: this.yScale, step:0.1}, //y Scale details
                    {printName: "Z", inputType: "number" ,name: "zScale",  value: this.zScale, step:0.1}// z Scale details
                ]
            },
            {
                printName:"Add Scale",
                id:"add-property_scale",
                module:"add-property",
                options:{
                    property:"scale"
                },
                parameterList: [
                    {printName: "X", inputType: "number" ,name: "xScale",  value: 0, step:0.1}, //x Scale details
                    {printName: "Y", inputType: "number" ,name: "yScale",  value: 0, step:0.1}, //y Scale details
                    {printName: "Z", inputType: "number" ,name: "zScale",  value: 0, step:0.1}// z Scale details
                ]
            },
            {
                printName:"Change Visibility",
                id:"change-property_visible",
                module:"change-property",
                options:{
                    property:"visible"
                },
                parameterList: [
                    {printName: "Visible", inputType: "checkbox" ,name: "visible",  value: this.visible}, //x details
                ]
            },
            {
                printName:"Toggle Visibility",
                id:"toggle-property_visible",
                module:"toggle-property",
                options:{
                    property:"visible"
                },
                parameterList: [
                ]
            },
        ];
    }
}