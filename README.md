# VREUD  
An end-user development tool to simplify the creation of interactive virtual reality scenes. VREUD supports the user in the development of the VR scene, interactions, and tasks. The interactions supply the VR user with capabilities to modify entities in the VR scene and tasks guide the VR user through the VR scene. VREUD is a web application written in JavaScript. The generated interactive VR scenes are translated to A-Frame. Consequently, the interactive VR scenes are also web-based. Since VREUD is web-based, it contains a client-side (**src** folder) and a server-side (*server.js*). The generated interactive VR scenes are stored on the server and can be accessed by the client. VREUD uses Component-based and Wizard-based development to simplify the development of interactive VR scenes.

**Reference:**  
VREUD - An End-User Development Tool to Simplify the Creation of Interactive VR Scenes, Research Paper submitted to the **IEEE Symposium on Visual Languages and Human-Centric Computing (VL/HCC 2021)**

## Installation 
1. Install Nodejs and npm 
1. Open the folder recast in a console.
1. Input "npm install" to install the dependencies of the library
1. Input "npm run build" to build the library.
1. Open the root folder in the console.
1. Input "npm install" to install the dependencies of the editor
1. Input "npm run-script build" to build the client-side of the editor.

If you have trouble building the RecastCLI and VREUD, use *--unsafe-perm* on both *npm install* commands.
The folder **build** will contain the built editor

## Usage
1. Open the ports for HTTP (80) and HTTPS (443)
1. Open the server.js file in the root folder and change the variable domain to the wished domain. For example "localhost".
1. Run the server-side to start the server. This is done by inputting "node server.js" in the root directory.
1. Access the editor by the configured domain.

## Folder Structure
* **keys** contains the keys needed for HTTPS.
* **public** contains the publicly accessible data on the servers-side. All data contained in this folder will be copied in the **build** folder when it is built.
* **public/interactive-scenes** is used to store the generated interactive VR scenes.
* **public/models** contains the default models of the VREUD
* **public/scripts** contains the A-Frame components needed for the execution of the interactive VR scenes
* **public/uploads** is used to store the uploaded data from the users.
* **recast** contains the library RecastCLI to build the navigation mesh on the server-side.
* **src** contains the source code of the client-side.
* **src/components** contains the React components that implement the interface of the client-side.
* **src/data** contains the classes that describe the interactive VR scene on the client-side.
* **src/style** contains the css files of the client-side.

server.js is the implementation of the server-side.

## Default Models in VREUD
The default models which are listed in the interface of VREUD can be configured by the XML file *serverModels.xml* in the folder **public**.  
The list can be structured by categories. *Models* has to be the top-level tag.  
The tag *Category* contains the attribute **name** which defines the name of the category. Categories can contain other categories.  
The tag *Model* contains the attributes **name** which defines the name of the entry, **type** which defines the model type (gltf or obj), **url** which defines the 
location of the model file, an optional **material** for obj models, and **autoscale** to automatically scale the model to prevent giant models.

**Example:**
```xml
<Models>
    <Category name="Furniture">
        <Model name="couch" type="gltf" url="link to model"></Model>
        <Category name="Kitchen">
        <Model name="refrigerator" type="gltf" url="link to model" autoscale="true"></Model>
        </Category>
    </Category>
    <Category name="Plants">
        <Model name="flowerpot" type="gltf" url="link to obj" material="link to mtl" autoscale="true"></Model>
    </Category>
</Models>
```



