# cVECT  
A collaborative Virtual Environment Creation Tool to simplify the development of interactive virtual reality environments.

**Reference:**  
None

## Installation 
1. Install Nodejs and npm (Tested with versions: npm8.11.0 node17.9.1 python3.11.1)
1. Open the folder recast in a console.
1. Input "npm install" to install the dependencies of the library
1. Input "npm run build" to build the library.
1. Open the root folder in the console.
1. Input "npm install" to install the dependencies of the editor
1. Input "npm run-script build" to build the client-side of the editor.
1. From there, run command *cp node_modules/aframe-colorwheel-component/dist/\* src/js/*

If you have trouble during the build, use *--unsafe-perm* on both *npm install* commands.

## Usage
1. Open the ports for HTTP (80) and HTTPS (443)
1. Open the server.js file in the root folder and change the variable domain to the wished domain. For example "localhost".
1. Run the server-side to start the server. This is done by inputting "node server.js" in the root directory.
1. Access the editor by the configured domain.

## Folder Structure
* NOT UP-TO-DATE
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

