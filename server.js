let express = require('express');
let app = express();
let multer = require('multer')
let cors = require('cors');
let fs = require('fs')
let bodyParser = require('body-parser')
let THREE=require("three")

let pdfjsLib = require("pdfjs-dist/es5/build/pdf.js");
let Canvas = require("canvas");
let assert = require("assert").strict;
let CMAP_URL = "./node_modules/pdfjs-dist/cmaps/"; //needed for the pdf to image converter
let CMAP_PACKED = true; //needed for the pdf to image converter

const domain="localhost"

const recast = require('./recast/build/Release/RecastCLI');
const obj2gltf = require('obj2gltf');

const path= require('path')

const https = require('https');
const key = fs.readFileSync('./keys/key.pem');
const cert = fs.readFileSync('./keys/cert.pem');
const server = https.createServer({key: key, cert: cert }, app);

const rootDirectory="build"
let latestDemoBuild=""

app.use(cors())
app.use(express.static(path.join(__dirname, rootDirectory)));
app.use(bodyParser.json());


app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, rootDirectory, 'index.html'));
});

app.get('/demovr', function(req, res) {
    res.sendFile(path.join(__dirname, rootDirectory, latestDemoBuild));
});

app.post('/demo',function(req, res) {
    console.log("demo received")
    let path="/interactive-scenes/" //image root path
        +Date.now()                       //randomness
    let demo=""; // image name
    let demoStorage = multer.diskStorage({ //define file name and directory
        destination: function (req, file, cb) {
            if(!fs.existsSync(rootDirectory+path)){ //checks if the directory already exists
                console.log("create directory",rootDirectory+path)
                fs.mkdirSync(rootDirectory+path, { recursive: true })
            }
            console.log("path:"+rootDirectory+path)
            cb(null, rootDirectory+path)
        },
        filename: function (req, file, cb) {
            if (fs.existsSync(rootDirectory + path + "/" + file.originalname)) {
                demo = Date.now()+file.originalname
            }
            else{
                demo = file.originalname // save the file name
            }
            console.log("name:"+demo)
            cb(null, demo )
        }
    });
    let uploadDemo = multer({
        storage: demoStorage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype==="application/html") {
                cb(null, true);
            } else {
                cb(new Error("wrong mime type"));
            }
        }
    }).single('demo') //defines the name of the input element
    uploadDemo(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err){
            if (err.message==="wrong mime type") {
                return res.status(415).json(err)
            } else{
                return res.status(500).json(err)
            }
        }
        latestDemoBuild=path+"/"+demo;
        res.set("demo-url",[path+"/"+demo]) //remove
        return res.status(200).send(req.file)

    })
});

app.post('/uploadImages',function(req, res) {
    console.log("image received")
    let path="/uploads/images/" //image root path
        +Date.now()                       //randomness
        +req.headers['directory'].replace(/ /g,'-') //path of the image
    let image=""; // image name
    let imageStorage = multer.diskStorage({ //define file name and directory
        destination: function (req, file, cb) {
            if(!fs.existsSync(rootDirectory+path)){ //checks if the directory already exists
                console.log("create directory",rootDirectory+path)
                fs.mkdirSync(rootDirectory+path, { recursive: true })
            }
            console.log("path:"+rootDirectory+path)
            cb(null, rootDirectory+path)
        },
        filename: function (req, file, cb) {
            if (fs.existsSync(rootDirectory + path + "/" + file.originalname)) {
                image = "aba"+file.originalname
            }
            else{
                image = file.originalname // save the file name
            }
            console.log("name:"+image)
            cb(null, image )
        }
    });
    let uploadImage = multer({
        storage: imageStorage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            } else {
                cb(new Error("wrong mime type"));
            }
        }
    }).single('image') //defines the name of the input element
    uploadImage(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err){
            if (err.message==="wrong mime type") {
                return res.status(415).json(err)
            } else{
                return res.status(500).json(err)
            }
        }
        res.set("image-url",[path+"/"+image]) //remove
        return res.status(200).send(req.file)

    })
});

app.post('/uploadTextures',function(req, res) {
    console.log("texture received")
    let path="/uploads/textures/" //image root path
        +Date.now()                       //randomness
        +req.headers['directory'].replace(/ /g,'-') //path of the image
    let texture=""; // image name
    let textureStorage = multer.diskStorage({ //define file name and directory
        destination: function (req, file, cb) {
            if(!fs.existsSync(rootDirectory+path)){ //checks if the directory already exists
                console.log("create directory",rootDirectory+path)
                fs.mkdirSync(rootDirectory+path, { recursive: true })
            }
            console.log("path:"+rootDirectory+path)
            cb(null, rootDirectory+path)
        },
        filename: function (req, file, cb) {
            if (fs.existsSync(rootDirectory + path + "/" + file.originalname)) {
                texture = Date.now()+file.originalname
            }
            else{
                texture = file.originalname // save the file name
            }
            console.log("name:"+texture)
            cb(null, texture )
        }
    });
    let uploadTexture = multer({
        storage: textureStorage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith("image/")) {
                cb(null, true);
            } else {
                cb(new Error("wrong mime type"));
            }
        }
    }).single('texture') //defines the name of the input element
    uploadTexture(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err){
            if (err.message==="wrong mime type") {
                return res.status(415).json(err)
            } else{
                return res.status(500).json(err)
            }
        }
        res.set("texture-url",[path+"/"+texture]) //remove
        return res.status(200).send(req.file)

    })
});

app.post('/uploadVideos',function(req, res) {
    console.log("video received")
    let path="/uploads/videos/" //image root path
        +Date.now()                       //randomness
        +req.headers['directory'].replace(/ /g,'-') //path of the image
    let video=""; // image name
    let videoStorage = multer.diskStorage({ //define file name and directory
        destination: function (req, file, cb) {
            if(!fs.existsSync(rootDirectory+path)){ //checks if the directory already exists
                console.log("create directory",rootDirectory+path)
                fs.mkdirSync(rootDirectory+path, { recursive: true })
            }
            console.log("path:"+rootDirectory+path)
            cb(null, rootDirectory+path)
        },
        filename: function (req, file, cb) {
            if (fs.existsSync(rootDirectory + path + "/" + file.originalname)) {
                video = Date.now()+file.originalname
            }
            else{
                video = file.originalname // save the file name
            }
            console.log("name:"+video)
            cb(null, video )
        }
    });
    let uploadVideo = multer({
        storage: videoStorage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype.startsWith("video/")) {
                cb(null, true);
            } else {
                cb(new Error("wrong mime type"));
            }
        }
    }).single('video') //defines the name of the input element
    uploadVideo(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err){
            if (err.message==="wrong mime type") {
                return res.status(415).json(err)
            } else{
                return res.status(500).json(err)
            }
        }
        res.set("video-url",[path+"/"+video]) //remove
        return res.status(200).send(req.file)
    })
});

app.post('/uploadNavigation',function(req, res) {
    console.log("image received")
    let path="/uploads/navigation/" //image root path
        +Date.now()                       //randomness
        +req.headers['directory'].replace(/ /g,'-') //path of the image
    let navigation=""; // image name
    let navigationStorage = multer.diskStorage({ //define file name and directory
        destination: function (req, file, cb) {
            if(!fs.existsSync(rootDirectory+path)){ //checks if the directory already exists
                console.log("create directory",rootDirectory+path)
                fs.mkdirSync(rootDirectory+path, { recursive: true })
            }
            console.log("path:"+rootDirectory+path)
            cb(null, rootDirectory+path)
        },
        filename: function (req, file, cb) {
            if (fs.existsSync(rootDirectory + path + "/" + file.originalname)) {
                navigation = "aba"+file.originalname
            }
            else{
                navigation = file.originalname // save the file name
            }
            console.log("name:"+navigation)
            cb(null, navigation )
        }
    });
    let uploadNavigation = multer({
        storage: navigationStorage,
    }).single('navigation') //defines the name of the input element
    uploadNavigation(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err){
            if (err.message==="wrong mime type") {
                return res.status(415).json(err)
            } else{
                return res.status(500).json(err)
            }
        }
        res.set("navigation-url",[path+"/"+navigation]) //remove
        return res.status(200).send(req.file)

    })
});

function covertRecursivePdfToPnG (currentPage,lastPage,imageUrls,path,pdf,callback){
    if(currentPage>lastPage){
        return callback(null,imageUrls)
    }
    pdf.getPage(currentPage).then( function (page) {
        // Render the page on a Node canvas with 100% scale.
        let viewport = page.getViewport({ scale: 1.0 });
        let canvasFactory = new NodeCanvasFactory();
        let canvasAndContext = canvasFactory.create(
            viewport.width,
            viewport.height
        );
        let renderContext = {
            canvasContext: canvasAndContext.context,
            viewport: viewport,
            canvasFactory: canvasFactory,
        };

        let renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
            // Convert the canvas to an image buffer.
            let image = canvasAndContext.canvas.toBuffer();
            fs.writeFileSync(rootDirectory+path+"/page_"+currentPage+".png", image);
            imageUrls=imageUrls.concat(path+"/page_"+currentPage+".png")
            return covertRecursivePdfToPnG (currentPage+1,lastPage,imageUrls,path,pdf,callback)
        }).catch( function (error){
            console.log(error)
            callback(error,null);
        });
    }).catch( function (error){
        console.log(error)
        callback(error,null);
    });
}

app.post('/uploadPdfs',function(req, res) {
    let path="/uploads/pdfs/" //models root path
        +Date.now()                       //randomness
        +req.headers['directory'].replace(/ /g,'-') //path of the image
    let pdfUrl=""; //path to the model
    let pdfStorage = multer.diskStorage({ //define file name and directory
        destination: function (req, file, cb) {
            if(!fs.existsSync(rootDirectory+path)){ //checks if the directory already exists
                console.log("create directory",rootDirectory+path)
                fs.mkdirSync(rootDirectory+path, { recursive: true })
            }
            cb(null, rootDirectory+path)
        },
        filename: function (req, file, cb) {
            let pdfName=file.originalname // save the file name
            if (fs.existsSync(rootDirectory + path + "/" + file.originalname)) {
                pdfName = Date.now() +file.originalname
            }
            pdfUrl=path+"/"+pdfName
            cb(null, pdfName )
        }
    });
    let uploadPDF = multer({
        storage: pdfStorage,
    }).array('pdf') //defines the name of the input element
    uploadPDF(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err){
            if (err.message==="wrong mime type") {
                return res.status(415).json(err)
            } else{
                return res.status(500).json(err)
            }
        }
        let data
        try{
            data= new Uint8Array(fs.readFileSync(rootDirectory+pdfUrl));
        }
        catch (error){
            console.log(error)
            return res.status(500).json(error)
        }

        // Load the PDF file.
        var loadingTask = pdfjsLib.getDocument({
            data: data,
            cMapUrl: CMAP_URL,
            cMapPacked: CMAP_PACKED,
        });
        loadingTask.promise
            .then(function (pdfDocument) {
                console.log("# PDF document loaded.");

                // Get the first page.
                let serverAnswer= function (error,urlList){
                    if(error){
                        res.status(500).json(error)
                    }
                    else{
                        res.set("pdf-url",[pdfUrl]) //remove
                        res.set("image-urls",urlList)
                        res.status(200).send()
                    }
                }
                let pageCount=pdfDocument.numPages
                covertRecursivePdfToPnG(1,pageCount,[],path,pdfDocument,serverAnswer)
            }).catch(function (reason) {
                console.log(reason);
                res.status(500).json(reason)
            });
        console.log("1")

    })
});

function moveRecursive(fileData,newPath,callback){
    if(fileData){
        if(fileData.length<1){
            return callback(null)
        }
        else{
            fs.rename("./"+fileData[0].path, "./"+newPath+fileData[0].filename, (err) => {
                if (err) return callback(err);
                moveRecursive(fileData.slice(1),newPath,callback)
            });
        }
    }
    else{
        return callback(new Error("no files to move"));
    }
}

app.post('/uploadModels',function(req, res) {
    let path="/uploads/models/" //models root path
        +Date.now()                       //randomness
        +req.headers['directory'].replace(/ /g,'-') //path of the image

    let modelUrl=""; //path to the model
    let materialUrl=""; //path to an optional material file
    let texturePaths=[];
    let modelStorage = multer.diskStorage({ //define file name and directory
        destination: function (req, file, cb) {
            if(!fs.existsSync(rootDirectory+path)){ //checks if the directory already exists
                console.log("create directory",rootDirectory+path)
                fs.mkdirSync(rootDirectory+path, { recursive: true })
            }
            cb(null, rootDirectory+path)
        },
        filename: function (req, file, cb) {
            let modelName=file.originalname // save the file name
            if (fs.existsSync(rootDirectory + path + "/" + file.originalname)) {
                modelName = Date.now() +file.originalname
            }
            if(/\.mtl+$/ig.test(modelName)){ //save path of material file
                materialUrl=path+"/"+modelName
            }
            if(/\.(gltf|glb|fbx|obj)+$/ig.test(modelName)){ //save path of material file
                modelUrl=path+"/"+modelName
            }
            if(/^image\//ig.test(file.mimetype)){
                texturePaths=texturePaths.concat({path:rootDirectory+path+"/"+modelName, filename:modelName})
            }
            console.log("model:"+modelUrl+" material:"+materialUrl)
            cb(null, modelName )
        }
    });
    let uploadModel = multer({
        storage: modelStorage,
    }).array('model') //defines the name of the input element
    uploadModel(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err){
            if (err.message==="wrong mime type") {
                return res.status(415).json(err)
            } else{
                return res.status(500).json(err)
            }
        }
        if(req.headers['texture-path']){
            let pathTextures=req.headers['texture-path'] //path of the textures
            if(!(pathTextures.charAt(0)==="/")){
                pathTextures="/"+pathTextures
                if(!(pathTextures.charAt(pathTextures.length - 1)==="/")){
                    pathTextures+="/"
                }
            }
            try{
                if(!fs.existsSync(rootDirectory+path+pathTextures)){ //checks if the directory already exists
                    console.log("create directory",rootDirectory+path+pathTextures)
                    fs.mkdirSync(rootDirectory+path+pathTextures, { recursive: true })
                }
                moveRecursive(texturePaths,rootDirectory+path+pathTextures,(error)=>{
                    if (error){
                        console.log(error)
                        return res.status(500).json(error)
                    }
                    else{
                        res.set("model-url",[modelUrl]) //remove
                        if(materialUrl!==""){ //set if a material file was uploaded
                            res.set("material-url",[materialUrl]) //remove
                        }
                        res.status(200).send(req.file)
                    }
                })
            }
            catch (error){
                console.log(error)
                return res.status(500).json(error)
            }
        }
        else{
            res.set("model-url",[modelUrl]) //remove
            if(materialUrl!==""){ //set if a material file was uploaded
                res.set("material-url",[materialUrl]) //remove
            }
            return res.status(200).send(req.file)
        }
    })
});

function generateNavmesh(entityList,path,callback){
    console.log("g1")
    let OBJExporter = require('three-obj-exporter')
    console.log("g2")
    let exporter = new OBJExporter();
    console.log("g3")
    let obstacleScene = new THREE.Scene();
    console.log("g4")
    for (let index = 0; index < entityList.length; index++) {
                obstacleScene.add(entityList[index])
    }
    console.log("g5")
    obstacleScene.updateMatrixWorld(true)
    console.log("g6")
    let objModel = exporter.parse(obstacleScene)
    fs.mkdirSync("./"+rootDirectory+path+"/", { recursive: true }, (err) => {
        if (err) throw err;
    });
    fs.writeFileSync("./"+rootDirectory+path+"/export.obj", objModel);
    console.log("g7")
    try{
        console.log("g8")
        recast.loadFile("./"+rootDirectory+path+"/export.obj");
        console.log("g9")
        recast.build(0.166, 0.1, 1.7, 0.5, 0.3, 45);
        console.log("g10")
        recast.save("./"+rootDirectory+path+"/navmesh.obj");
        console.log("g11")
        obj2gltf("./"+rootDirectory+path+"/navmesh.obj")
           .then(function(gltf) {
               const data = Buffer.from(JSON.stringify(gltf));
               fs.writeFileSync("./"+rootDirectory+path+"/navmesh.gltf", data);
               callback(null,path + "/navmesh.gltf")
           }).catch();
    }
    catch (e) {
        callback(e,"");
    }

}

app.post('/generate-navmesh',function(req, res) {
    let path = "/uploads/navmesh/"
        + Date.now()                       //randomness
    console.log("generate navmesh")
    console.log(req.body);      // your JSON
    //build database for scene
    if (req.body.length > 1) {
        let answerClient = (err, link) => {
            if (err) {
                res.status(500).json(err)
            } else {
                res.set("nav-url", [path + "/navmesh.gltf"])
                res.status(200).send(req.body)
            }
        }
        let sendObjects = req.body;
        let meshList = []
        let loadChain = [];
        for (let index = 0; index < sendObjects.length; index++) {
            let entity = sendObjects[index]
            let geometry = null;
            let meshCreated = false;
            switch (sendObjects[index].className) {
                case "Box":
                    geometry = new THREE.BoxBufferGeometry(entity.width, entity.height, entity.depth)
                    meshCreated = true;
                    break;
                case "Cylinder":
                    geometry = new THREE.CylinderBufferGeometry(entity.radiusTop, entity.radiusBottom, entity.height,);
                    meshCreated = true;
                    break;
                case "Plane":
                case "Image":
                case "Text":
                    geometry = new THREE.PlaneBufferGeometry(entity.width, entity.height);
                    meshCreated = true;
                    break;
                case "Model":
                case "ObjModel":
                    loadChain = loadChain.concat(entity)
                    break;
                case "Sphere":
                    geometry = new THREE.SphereBufferGeometry(entity.radius, entity.widthSegments, entity.heightSegments);
                    meshCreated = true;
                    break;
                case "Tetrahedron":
                    geometry = new THREE.TetrahedronBufferGeometry(entity.radius, entity.details);
                    meshCreated = true;
                    break;
                default:

            }
            if (meshCreated) {
                let mesh = new THREE.Mesh(geometry)
                mesh.rotation.set(entity.xRotation * Math.PI / 180, entity.yRotation * Math.PI / 180, entity.zRotation * Math.PI / 180);
                mesh.position.set(entity.x, entity.y, entity.z);
                mesh.scale.set(entity.xScale, entity.yScale, entity.zScale);
                mesh.updateMatrix();
                meshList = meshList.concat(mesh)
            }
        }
        if (loadChain.length > 0) { // models have to be loaded
            let loadChainWithCallback = function loadModels(modelList, meshList, callbackModels) {

                if (modelList.length > 0) { //list contains models to load
                    let model = modelList[0];
                    switch (model.modelType) { //load the 3D Model
                        case "obj":
                            let OBJLoader = require("three-obj-loader")(THREE);
                            // let loader = new OBJLoader();
                            OBJLoader.load(rootDirectory + model.url, model => loadModels(modelList.slice(1), meshList.concat(model), callbackModels));//load the model
                            break;
                        case "gltf":
                            let GLTFLoader = require("three-gltf-loader");
                            let loaderGLTF = new GLTFLoader();
                            loaderGLTF.load(rootDirectory + model.url, model => loadModels(modelList.slice(1), meshList.concat(model.scene), callbackModels));//load the model
                            break;
                        default:
                            loadModels(modelList.slice(1), meshList, callbackModels)
                    }
                } else {
                    callbackModels(meshList);
                }

            }
            loadChainWithCallback(loadChain, (meshList) => {
                console.log("all models are loaded")
                generateNavmesh(meshList, path, answerClient)
            })
        } else { //no models have to be loaded and the opening is complete
            console.log("no model has to be loaded")
            generateNavmesh(meshList, path, answerClient)
        }
    } else {
        res.status(415).json(new Error("no data send"))
    }
});

app.post('/generate-navmesh-from-obj',function(req, res) {

    let path="/uploads/navigation/" //image root path
        +Date.now()                       //randomness
        +req.headers['directory'].replace(/ /g,'-') //path of the image
    let nav=""; // image name
    let navStorage = multer.diskStorage({ //define file name and directory
        destination: function (req, file, cb) {
            if(!fs.existsSync(rootDirectory+path)){ //checks if the directory already exists
                console.log("create directory",rootDirectory+path)
                fs.mkdirSync(rootDirectory+path, { recursive: true })
            }
            console.log("path:"+rootDirectory+path)
            cb(null, rootDirectory+path)
        },
        filename: function (req, file, cb) {
            if (fs.existsSync(rootDirectory + path + "/" + file.originalname)) {
                nav = Date.now()+file.originalname
            }
            else{
                nav = file.originalname // save the file name
            }
            console.log("name:"+nav)
            cb(null, nav )
        }
    });
    let uploadnav = multer({
        storage: navStorage
    }).single('nav') //defines the name of the input element
    uploadnav(req, res, function (err) {
        console.log(err)
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err){
            if (err.message==="wrong mime type") {
                return res.status(415).json(err)
            } else{
                return res.status(500).json(err)
            }
        }
        try {
            let agentHeight=parseFloat(req.headers['agentheight'])
            let agentRadius=parseFloat(req.headers['agentradius'])
            let agentMaxClimb=parseFloat(req.headers['agentmaxclimp'])
            let agentMaxSlope=parseFloat(req.headers['agentmaxslope'])
            console.log("test:",[agentHeight,agentRadius,agentMaxClimb,agentMaxSlope])
            recast.loadFile("./" + rootDirectory + path + "/" + nav);
            recast.build(0.166, 0.1, agentHeight, agentRadius, agentMaxClimb, agentMaxSlope);
            recast.save("./" + rootDirectory + path + "/navmesh.obj");
            fs.unlinkSync("./" + rootDirectory + path + "/" + nav);
            obj2gltf("./" + rootDirectory + path + "/navmesh.obj")
                .then(function (gltf) {
                    const data = Buffer.from(JSON.stringify(gltf));
                    fs.writeFileSync("./" + rootDirectory + path + "/navmesh.gltf", data);
                    res.set("nav-url", [path + "/navmesh.gltf"])
                    res.status(200).send(req.file)
                }).catch(error=>{
                res.status(500).json(error)
            });
        }
        catch (error){
            return res.status(500).json(error)
        }
    })
});

app.listen(80,domain, function() {

    console.log('Http Listener running on port 80');

});

server.listen(443,domain, ()=>console.log('Https Listener running on port 443'))




function NodeCanvasFactory() {}
NodeCanvasFactory.prototype = {
    create: function NodeCanvasFactory_create(width, height) {
        assert(width > 0 && height > 0, "Invalid canvas size");
        var canvas = Canvas.createCanvas(width, height);
        var context = canvas.getContext("2d");
        return {
            canvas: canvas,
            context: context,
        };
    },

    reset: function NodeCanvasFactory_reset(canvasAndContext, width, height) {
        assert(canvasAndContext.canvas, "Canvas is not specified");
        assert(width > 0 && height > 0, "Invalid canvas size");
        canvasAndContext.canvas.width = width;
        canvasAndContext.canvas.height = height;
    },

    destroy: function NodeCanvasFactory_destroy(canvasAndContext) {
        assert(canvasAndContext.canvas, "Canvas is not specified");

        // Zeroing the width and height cause Firefox to release graphics
        // resources immediately, which can greatly reduce memory consumption.
        canvasAndContext.canvas.width = 0;
        canvasAndContext.canvas.height = 0;
        canvasAndContext.canvas = null;
        canvasAndContext.context = null;
    },
};

