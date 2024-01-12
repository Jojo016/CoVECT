# CoVECT  
A CoVECT is a "Collaborative Virtual Environment Creation Tool" that enables multiple users to simultaneously develop interactive virtual reality environments. The server provides access to the editor through two different interfaces. A web interface for desktop computers and a virtual reality interface for head mounted displays. The editor can be accessed with any browser that supports WebXR, it was tested with Google Chrome.  

**Reference:**  
Development and Evaluation of a Collaborative Authoring Tool for the Creation of Interactive Virtual Environments - Bachelor's Thesis by Johannes Weigelt, 2024

## Installation 
1. Install Nodejs, npm and python (Tested with versions: npm8.11.0 node17.9.1 python3.11.1)
1. Open the root folder in a console.
1. Input "npm install" to install the dependencies of the editor.
1. Go to "node_modules/@tweenjs/" with *cd node_modules/@tweenjs/*
1. Open the "package.json" and edit the line with *"type": "module",* to *"type": "commonjs",*

If you have trouble during the build, use *--unsafe-perm* on the *npm install* command.

## Usage
1. Open the ports for HTTP (80) and HTTPS (443)
1. (Optional) Open the server.js file in the root folder and change the variable domain to the wished domain. For example "localhost".
1. Run "node server.js" in the root directory to start the server.
1. Access the editor by the configured domain (Standard: "localhost"). 
2. Example VR-Interface: "https://localhost/user-vr.html"
2. Example Web-Interface: "https://localhost/user-desktop.html"

## Folder Structure
* **certs** contains the keys needed for HTTPS.
* **src** contains the source code of the client-side.
* **src/assets** contains models used for the client-side.
* **src/dist** contains external libaries used for AFrame on the client-side.
* **src/img** contains textures for the models of the client-side.
* **src/js** contains the JavaScript files of the client-side.
* **src/styles** contains the css files of the client-side.

The "server.js" file is the implementation of the server-side.

## Credits
* Assets downloaded from <a href="https://www.turbosquid.com/de/">Turbosquid</a>
* <a href="https://www.freepik.com/free-vector/seamless-realistic-cheese-pattern_10603243.htm#query=cheese%20texture&position=4&from_view=search&track=ais&uuid=0bd8c0d8-f3f7-4143-9b61-96f5ba2ec69c">Image by macrovector</a> on Freepik
* <a href="https://www.freepik.com/free-photo/collage-green-leaves-arugula-basil-sliced-red-spicy-bell-pepper-onion-tomatoes-black-pepper-peas-are-isolated-white-background-cooking-concept-close-up-copy-space_26593837.htm#query=tomato&position=8&from_view=search&track=sph&uuid=a2e41571-ecd2-4176-87e6-bfa585987445">Image by YuliiaKa</a> on Freepik