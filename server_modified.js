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
      listOfComponentData.push(newObj);      

      // Create new message
      var message = {};

      // Set new msgType
      message.msgType = 'spawnComponent';

      // Set message data
      data = JSON.stringify(newObj);
      message.msgData = data;

      // Set targetRoom name
      var targetRoom = 'dev';
      connectionObj.getRoomNames((err, roomNames) => {
        if(roomNames.length > 0) {
            targetRoom = roomNames[0];
        }
      });
      message.targetRoom = targetRoom;

      // Emit message to all room members
      console.log("Server emitting creation event!");
      
      var roomObj; 
      connectionObj.generateRoomClientList("update", null, function(err, callback){
        roomObj = callback;
      });

      var clientList = roomObj['dev'].clientList;

      for (var currentEasyrtcid in clientList) {
        (function(innerCurrentEasyrtcid, innerMsg){
          connectionObj.getApp().connection(innerCurrentEasyrtcid, function(err, emitToConnectionObj) {
            easyrtc.events.emit("emitEasyrtcMsg", emitToConnectionObj, message.msgType, message, null, function(err) {
              if(err) {
                console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
              }
            });
          });
        })(currentEasyrtcid, msg);
      }
    }

  }else if(msgType === "selectComponent"){
    // When a client selects an entity, broadcast it
    var data = msg.msgData;

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

      var roomObj; 
      connectionObj.generateRoomClientList("update", null, function(err, callback){
        roomObj = callback;
      });

      var clientList = roomObj['dev'].clientList;

      for (var currentEasyrtcid in clientList) {
        (function(innerCurrentEasyrtcid, innerMsg){
          connectionObj.getApp().connection(innerCurrentEasyrtcid, function(err, emitToConnectionObj) {
            easyrtc.events.emit("emitEasyrtcMsg", emitToConnectionObj, message.msgType, message, null, function(err) {
              if(err) {
                console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
              }
            });
          });
        })(currentEasyrtcid, msg);
      }
    }else{

      // Get room's ClientList
      var roomObj; 
      connectionObj.generateRoomClientList("update", null, function(err, callback){
        roomObj = callback;
      });

      var clientList = roomObj['dev'].clientList;

      // Send 'Deselect' for other 'cid's.
      for(i = 0; i < listOfSelectedComponents.length; i++) {

        var message1 = {};
        var idToBeDeselected = listOfSelectedComponents.pop();
        dataObj.cid = idToBeDeselected;
        dataObj.bool = false;
        var data1 = JSON.stringify(dataObj);

        message1.msgType = 'selectedComponent';
        message1.msgData = data1;

        // Send each message to every client in the room
        for (var currentEasyrtcid in clientList) {
          (function(innerCurrentEasyrtcid, innerMsg){
            connectionObj.getApp().connection(innerCurrentEasyrtcid, function(err, emitToConnectionObj) {
              easyrtc.events.emit("emitEasyrtcMsg", emitToConnectionObj, message1.msgType, message1, null, function(err) {
                if(err) {
                  console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
                }
              });
            });
          })(currentEasyrtcid, msg);
        }
      }

      // Send 'Select' for initial 'cid'. 
      var message2 = {};

      listOfSelectedComponents.push(cid);
      dataObj.cid = cid;
      dataObj.bool = true;
      var data2 = JSON.stringify(dataObj);

      message2.msgType = 'selectedComponent';
      message2.msgData = data2;

      //console.log("Sending '" + message2.msgType + "'' with data '" + data2 + "'.")
      // Send the message to every client in the room
      for (var currentEasyrtcid in clientList) {
        (function(innerCurrentEasyrtcid, innerMsg){
          connectionObj.getApp().connection(innerCurrentEasyrtcid, function(err, emitToConnectionObj) {
            easyrtc.events.emit("emitEasyrtcMsg", emitToConnectionObj, message2.msgType, message2, null, function(err) {
              if(err) {
                console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
              }
            });
          });
        })(currentEasyrtcid, msg);
      }
    }
  }else if(msgType === "removeComponent") {
  // When a client selects an entity, broadcast it
  var data = msg.msgData;
  var dataObj = JSON.parse(data);
  var cid = dataObj.cid; 

  // Remove object from 'component' list
  var dataIndex = -1;

  for(let i = 0; i < listOfComponentData.length; i++){
    if(listOfComponentData[i].cid == cid) {

      dataIndex = i;
      break;
    }
  }

  if (dataIndex != -1) {
    // Remove component from 'componentData' list
    listOfComponentData.splice(dataIndex, 1);

    // Remove component from 'selectedComponents' list
    var cidIndex = listOfSelectedComponents.indexOf(''+cid);
    if (cidIndex != -1) {
      listOfSelectedComponents.splice(cidIndex, 1);
    }

    var message = {};
    message.msgType = 'removedComponent';
    message.msgData = data;

    var roomObj; 
    connectionObj.generateRoomClientList("update", null, function(err, callback){
      roomObj = callback;
    });

    var clientList = roomObj['dev'].clientList;

    for (var currentEasyrtcid in clientList) {
      (function(innerCurrentEasyrtcid, innerMsg){
        connectionObj.getApp().connection(innerCurrentEasyrtcid, function(err, emitToConnectionObj) {
          easyrtc.events.emit("emitEasyrtcMsg", emitToConnectionObj, message.msgType, message, null, function(err) {
            if(err) {
              console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
            }
          });
        });
      })(currentEasyrtcid, msg);
    }
  }else if(msgType === "removedComponent"){
    // Only for client side --> SKIP
  }else if(msgType === "selectedComponent"){
    // Only for client side --> SKIP
  }else if(msgType === "spawnComponent"){
    // Only for client side --> SKIP
  }else{
      // Default listener
      easyrtc.events.defaultListeners.easyrtcMsg(connectionObj, msg, socketCallback, callback)
    }
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
