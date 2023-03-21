// Load required modules
const http = require("http");                 // http server core module
const path = require("path");
const express = require("express");           // web framework external module
const socketIo = require("socket.io");        // web socket external module
const easyrtc = require("open-easyrtc");      // EasyRTC external module
const mysql = require('mysql');               // MySql external module
// To generate a certificate for local development with https, you can use
// https://github.com/FiloSottile/mkcert
// Then to enable https on the node server, uncomment the next lines
// and the webServer line down below.
// const https = require("https");
// const fs = require("fs");
// const privateKey = fs.readFileSync("key.pem", "utf8");
// const certificate = fs.readFileSync("cert.pem", "utf8");
// const credentials = { key: privateKey, cert: certificate };

// Set process name
process.title = "networked-aframe-server";

// Get port or default to 8080
const port = process.env.PORT || 8080;

// Setup and configure Express http server.
const app = express();

// Serve the bundle in-memory in development (needs to be before the express.static)
if (process.env.NODE_ENV === "development") {
  const webpackMiddleware = require("webpack-dev-middleware");
  const webpack = require("webpack");
  const config = require("../webpack.config");

  app.use(
    webpackMiddleware(webpack(config), {
      publicPath: "/dist/"
    })
  );
}

// Setup MySql database
/*
var con = mysql.createConnection({
  host: "localhost",
  user: "server_admin",
  password: "12345678"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("MySQL Connected!");
  con.query("CREATE DATABASE objectdb", function (err, result) {
    if (err) throw err;
    console.log("Database 'objectdb' created!");
  });
});
*/

// Temporary list for data store (later handled by MySql)
var componentCounter = 0;
var listOfComponentData = [];
var listOfSelectedComponents = [];

// Serve the files from the examples folder
app.use(express.static(path.resolve(__dirname, "src")));

// Start Express http server
const webServer = http.createServer(app);
// To enable https on the node server, comment the line above and uncomment the line below
// const webServer = https.createServer(credentials, app);

// Start Socket.io so it attaches itself to Express server
const socketServer = socketIo.listen(webServer, {"log level": 1});
const myIceServers = [
  {"urls":"stun:stun1.l.google.com:19302"},
  {"urls":"stun:stun2.l.google.com:19302"},
  // {
  //   "urls":"turn:[ADDRESS]:[PORT]",
  //   "username":"[USERNAME]",
  //   "credential":"[CREDENTIAL]"
  // },
  // {
  //   "urls":"turn:[ADDRESS]:[PORT][?transport=tcp]",
  //   "username":"[USERNAME]",
  //   "credential":"[CREDENTIAL]"
  // }
];
easyrtc.setOption("appIceServers", myIceServers);
easyrtc.setOption("logLevel", "debug");
easyrtc.setOption("demosEnable", false);

// Overriding the default easyrtcAuth listener, only so we can directly access its callback
easyrtc.events.on("easyrtcAuth", (socket, easyrtcid, msg, socketCallback, callback) => {
    easyrtc.events.defaultListeners.easyrtcAuth(socket, easyrtcid, msg, socketCallback, (err, connectionObj) => {
        if (err || !msg.msgData || !msg.msgData.credential || !connectionObj) {
            callback(err, connectionObj);
            return;
        }

        connectionObj.setField("credential", msg.msgData.credential, {"isShared":false});

        console.log("["+easyrtcid+"] Credential saved!", connectionObj.getFieldValueSync("credential"));

        callback(err, connectionObj);
    });
});

// Handling data upstream
easyrtc.events.on("easyrtcMsg", (connectionObj, msg, socketCallback, callback) => {
  var msgType = msg.msgType;

  // Id '0' indicates a wanted access to the file system
  if(msgType === "addNewObject") {
    var data = msg.msgData;
    if(true) { // validate json
      componentCounter++;
      var easyrtcid = connectionObj.getEasyrtcid();
      // Add the new object to existing ones
      // TODO: IMPLEMENT FUNCTION FOR SAVING CURRENT A-FRAME STATE TO MYSQL !!!!!!!!!!!!

      var newObj = JSON.parse(data);
      newObj['cid'] = componentCounter;
      data = JSON.stringify(newObj);
      listOfComponentData.push(data);

      // Create new message
      var message = {};

      // Set new msgType
      message.msgType = 'spawnComponent';

      // Set message data
      message.msgData = data;

      // Set targetRoom name
      var targetRoom = 'default';
      connectionObj.getRoomNames((err, roomNames) => {
        if(roomNames.length > 0) {
            targetRoom = roomNames[0];
        }
      });
      message.targetRoom = targetRoom;

      // Get roomObj
      var room = connectionObj.room;

      // Emit message
      //easyrtc.events.emit("emitEasyrtcMsg", room, message, undefined, undefined);
      easyrtc.events.emit("emitEasyrtcMsg", connectionObj, message.msgType, message, socketCallback, function(err) {
        if(err) {
          console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
        }
      });
      console.log("Server emitted creation event!");
    }

  }else if(msgType === "selectComponent"){
    // When a client selects an entity, broadcast it
    var data = msg.msgData;
    //var dat = connectionObj.getUsername();

    var dataObj = JSON.parse(data);

    var cid = dataObj.cid; 
    if(listOfSelectedComponents.includes(cid)) {
      var message = {};

      var index = listOfSelectedComponents.indexOf(cid);
      listOfSelectedComponents.splice(index, 1);
      dataObj.bool = false;

      data = JSON.stringify(dataObj);

      message.msgType = 'selectedComponent';
      message.msgData = data;

      console.log("Sending '" + message.msgType + "'' with data '" + data + "'.")
      easyrtc.events.emit("emitEasyrtcMsg", connectionObj, message.msgType, message, socketCallback, function(err) {
          if(err) {
            console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
          }
        });
    }else{

      // Send 'Deselect' for other 'cid's.
      for(i = 0; i < listOfSelectedComponents.length; i++) {

        var message1 = {};
        var idToBeDeselected = listOfSelectedComponents.pop();
        dataObj.cid = idToBeDeselected;
        dataObj.bool = false;
        var data1 = JSON.stringify(dataObj);

        message1.msgType = 'selectedComponent';
        message1.msgData = data1;

        console.log("Sending '" + message1.msgType + "'' with data '" + data1 + "'.")
        easyrtc.events.emit("emitEasyrtcMsg", connectionObj, message1.msgType, message1, socketCallback, function(err) {
            if(err) {
              console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
            }
          });
      }

      // Send 'Select' for initial 'cid'. 
      var message2 = {};

      listOfSelectedComponents.push(cid);
      dataObj.cid = cid;
      dataObj.bool = true;
      var data2 = JSON.stringify(dataObj);

      message2.msgType = 'selectedComponent';
      message2.msgData = data2;


      console.log("Sending '" + message2.msgType + "'' with data '" + data2 + "'.")
      easyrtc.events.emit("emitEasyrtcMsg", connectionObj, message2.msgType, message2, socketCallback, function(err) {
          if(err) {
            console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
          }
        });
    }

  }else if(msgType === "selectedComponent"){
    // Only for client side --> SKIP
  }else if(msgType === "spawnComponent"){
    // Only for client side --> SKIP
  }else{
    // Default listener
    easyrtc.events.defaultListeners.easyrtcMsg(connectionObj, msg, socketCallback, callback)
  }
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", (connectionObj, roomName, roomParameter, callback) => {
    console.log("["+connectionObj.getEasyrtcid()+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// Start EasyRTC server
easyrtc.listen(app, socketServer, null, (err, rtcRef) => {
    console.log("Initiated");

    rtcRef.events.on("roomCreate", (appObj, creatorConnectionObj, roomName, roomOptions, callback) => {
        console.log("roomCreate fired! Trying to create: " + roomName);

        appObj.events.defaultListeners.roomCreate(appObj, creatorConnectionObj, roomName, roomOptions, callback);
    });
});

// Listen on port
webServer.listen(port, () => {
    console.log("listening on http://localhost:" + port);
});
