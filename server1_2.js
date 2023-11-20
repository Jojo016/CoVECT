// Load required modules
//const http = require("http");                 // http server core module
const path = require("path");
const express = require("express");           // web framework external module
//const { Server } = require("socket.io");      // web socket external module
//const socketIo = require("socket.io");        // web socket external module
const socketIo = require("socket.io");        // web socket external module
const easyrtc = require("open-easyrtc");      // EasyRTC external module
const mysql = require('mysql');               // MySql external module
// To generate a certificate for local development with https, you can use
// https://github.com/FiloSottile/mkcert
// Then to enable https on the node server, uncomment the next lines
// and the webServer line down below.
const https = require("https");
const fs = require("fs");
const { update } = require("@tweenjs/tween.js");

// Next two lines are a SSL certificate for local testing
//const privateKey = fs.readFileSync(__dirname + "\\certs\\localhost.key", "utf8");
//const certificate = fs.readFileSync(__dirname + "\\certs\\localhost.crt", "utf8");
const privateKey = fs.readFileSync("/certbot/privkey.pem", "utf8");
const certificate = fs.readFileSync("/certbot/fullchain.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

// Set process name
process.title = "networked-aframe-server";


// Temporary list for data store (later handled by MySql)
var componentCounter = 0;
var listOfComponentData = [];
var tasks = [];
var tasksSelectedBy = null;
var dictOfSelectedComponents = new Object();
setupScenario(1);

// Get port or default to 8080
const port = process.env.PORT || 9091;

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

function setupScenario(scenarioNumber) {
  switch(scenarioNumber) {
    case 1:
      var plate1 = new Object();
      var plate2 = new Object();
      var grillerTop = new Object();

      plate1.cid = 1;
      plate1.shape = 'plate';
      plate1.name = 'Plate Green';
      plate1.position = new Object();
      plate1.position.x = '0.8';
      plate1.position.y = '0.79';
      plate1.position.z = '1.4';
      plate1.material = new Object();
      plate1.material.color = '#66ff66';
      plate1.material.opacity = 1;
      plate1.selectedBy = -1;
      plate1.rotation = new Object();
      plate1.rotation.x = '0';
      plate1.rotation.y = '0';
      plate1.rotation.z = '0';
      plate1.scale = new Object();
      plate1.scale.x = '0.4';
      plate1.scale.y = '0.4';
      plate1.scale.z = '0.4';
      plate1.wireframed = 'false';
      var interactable = new Object();
      interactable.type = 'none';
      interactable.axis = 'X';
      interactable.offset = 0;
      plate1.interactable = interactable;

      plate2.cid = 2;
      plate2.shape = 'plate';
      plate2.name = 'Plate Blue';
      plate2.position = new Object();
      plate2.position.x = '1.4';
      plate2.position.y = '0.79';
      plate2.position.z = '0.8';
      plate2.material = new Object();
      plate2.material.color = '#6666ff';
      plate2.material.opacity = 1;
      plate2.selectedBy = -1;
      plate2.rotation = new Object();
      plate2.rotation.x = '0';
      plate2.rotation.y = '0';
      plate2.rotation.z = '0';
      plate2.scale = new Object();
      plate2.scale.x = '0.4';
      plate2.scale.y = '0.4';
      plate2.scale.z = '0.4';
      plate2.wireframed = 'false';
      var interactable = new Object();
      interactable.type = 'none';
      interactable.axis = 'X';
      interactable.offset = 0;
      plate2.interactable = interactable;

      grillerTop.cid = 3;
      grillerTop.shape = 'griller-top';
      grillerTop.name = 'Wafflemaker Top';
      grillerTop.position = new Object();
      grillerTop.position.x = '1.215';
      grillerTop.position.y = '0.99';
      grillerTop.position.z = '-2.53';
      grillerTop.material = new Object();
      grillerTop.material.color = '#ff00ff';
      grillerTop.material.opacity = 1;
      grillerTop.selectedBy = -1;
      grillerTop.rotation = new Object();
      grillerTop.rotation.x = '-36';
      grillerTop.rotation.y = '-24';
      grillerTop.rotation.z = '0';
      grillerTop.scale = new Object();
      grillerTop.scale.x = '1.5';
      grillerTop.scale.y = '1.5';
      grillerTop.scale.z = '1.5';
      grillerTop.wireframed = 'false';
      var interactable = new Object();
      interactable.type = 'rotatable';
      interactable.axis = 'X';
      interactable.offset = -1;
      grillerTop.interactable = interactable;

      listOfComponentData.push(plate1);
      listOfComponentData.push(plate2);
      listOfComponentData.push(grillerTop);

      componentCounter = 3;
      break;

    case 2:
      componentCounter = 0;
      break;
    
    default:
      break;
  }
}

function exportComponents() {
  try{
    var exportString = JSON.stringify(listOfComponentData);
    var date = Date.now();
    var fileString = '../data/export/export_' + date + '.txt';
    console.log(fileString);
    var fs = require('fs');
    fs.writeFile(fileString, exportString, (err) => {
      if(err) throw err;
    });
  }catch(e) {
    console.log('Error while exporting component data!');
  }
}

// Serve the files from the examples folder
app.use(express.static(path.resolve(__dirname, "src")));

// Start Express http server
// const webServer = http.createServer(app);
// To enable https on the node server, comment the line above and uncomment the line below
const webServer = https.createServer(credentials, app);

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
  var easyrtcid = connectionObj.getEasyrtcid();

  console.log('Received message of type: ' + msgType);

  // Id '0' indicates a wanted access to the file system
  if(msgType === "addNewObject") {
    var data = msg.msgData;
    if(true) { // TODO: validate json
      componentCounter++;
      // Add the new object to existing ones
      var newObj = JSON.parse(data);
      var shape = newObj.shape;
      newObj['cid'] = componentCounter;
      newObj.name = 'New ' + shape;
      newObj.material = 'color: #00ffff; opacity: 1;';
      newObj.selectedBy = -1;
      newObj.rotation = new Object();
      newObj.scale = new Object();
      newObj.scale.x = '1';
      newObj.scale.y = '1';
      newObj.scale.z = '1';
      newObj.wireframed = 'false';
      var interactable = new Object();
      interactable.type = 'none';
      interactable.axis = 'X';
      interactable.offset = 0;
      newObj.interactable = interactable;

      switch(shape) {
        case 'wafflemaker':
        case 'box':
          newObj.rotation.x = '0';
          newObj.rotation.y = '0';
          newObj.rotation.z = '0';
          break;

        case 'plane':
          newObj.rotation.x = '-90';
          newObj.rotation.y = '0';
          newObj.rotation.z = '0';
          break;

        case 'cylinder':
          newObj.height = '1';
          newObj.radius = '1';
          newObj.rotation.x = '0';
          newObj.rotation.y = '0';
          newObj.rotation.z = '0';
          break;

        case 'sphere':
          newObj.radius = '1';
          break;

        case 'bowl':
          newObj.radius = '1';
          newObj.material = 'color: #1b688c; opacity: 1;'
          break;

        case 'plate':
          newObj.scale.x = '0.4';
          newObj.scale.y = '0.4';
          newObj.scale.z = '0.4';
          newObj.material = "color: #ededed; opacity: 1;"
          break;

        case 'stool':
          newObj.scale.x = '0.3';
          newObj.scale.y = '0.3';
          newObj.scale.z = '0.3';
          break;

        case 'toast':
          newObj.rotation.x = '0';
          newObj.rotation.y = '0';
          newObj.rotation.z = '90';
          newObj.scale.x = '0.05';
          newObj.scale.y = '0.05';
          newObj.scale.z = '0.05';
          break;

        case 'cheese':
          newObj.rotation.x = '-90';
          newObj.rotation.y = '0';
          newObj.rotation.z = '0';
          break;

        case 'tomatoes':
          newObj.rotation.x = '-90';
          newObj.rotation.y = '0';
          newObj.rotation.z = '0';
          break;

        default:
          break;
      }

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
    console.log('selectComponent:');
    console.log(msg.msgData);
    // When a client selects an entity, broadcast it
    var data = msg.msgData;

    var dataObj = JSON.parse(data);
    dataObj.sourceRtcId = easyrtcid;

    var cid = dataObj.cid;
    var bool = dataObj.bool;

    if(bool) {
      // Check for possible components/tasks to deselect, afterwards select the given object
      if(dictOfSelectedComponents.hasOwnProperty(cid)) {
        // Edit the data object so send
        data = JSON.stringify(dataObj);

        // Create the message to send
        var message = {};
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

        // Delete the KeyValuePair 'ComponentId/EasyRtcId' from dict
        delete dictOfSelectedComponents[cid];

      }else{
        // Get room's ClientList
        var roomObj; 
        connectionObj.generateRoomClientList("update", null, function(err, callback){
          roomObj = callback;
        });

        var clientList = roomObj['dev'].clientList;

        // Deselect all other components that are flagged with the current selector's easyrtcid 
        var cidToDeselect = -1;

        for(const key in dictOfSelectedComponents) {
          if(dictOfSelectedComponents[key] == easyrtcid) {
            cidToDeselect = key;
          }
        }

        if(cidToDeselect != -1) {
          // Edit list of component data
          var specificObject = listOfComponentData.find(obj => {
            return obj.cid == cidToDeselect;
          })
          specificObject.selectedBy = -1;

          // Send 'Deselect' of 'old cid' 
          var message1 = {};
          dataObj.cid = cidToDeselect;
          dataObj.bool = false;
          dataObj.sourceRtcId = easyrtcid;
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

          // Delete the KeyValuePair 'ComponentId/EasyRtcId' from dict
          delete dictOfSelectedComponents[cidToDeselect];
        }

        // Send 'deselectTasks'
        if(tasksSelectedBy == easyrtcid) {
          tasksSelectedBy = null;

          // Set message data
          var message = {};
          message.msgType = 'deselectTasks';
          message.msgData = null;

          // Send each message to every client in the room
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

        // Edit list of component data
        var specificObject = listOfComponentData.find(obj => {
          return obj.cid == cid;
        })

        if(specificObject == null) {
          console.log('Unsuccessfully tried to find object with cid: ' + cid);
          return;
        }

        specificObject.selectedBy = easyrtcid;

        // Send 'Select' for initial 'cid'. 
        var message2 = {};

        dictOfSelectedComponents[cid] = easyrtcid;
        dataObj.cid = cid;
        dataObj.bool = true;
        dataObj.sourceRtcId = easyrtcid;
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
    }else{
      // Deselect the given component
      var cidToDeselect = cid;

      // Edit list of component data
      var specificObject = listOfComponentData.find(obj => {
        return obj.cid == cidToDeselect;
      })
      specificObject.selectedBy = -1;

      // Send 'Deselect' of 'old cid' 
      var message = {};
      dataObj.sourceRtcId = easyrtcid;
      var data = JSON.stringify(dataObj);

      message.msgType = 'selectedComponent';
      message.msgData = data;
      
      // Get room's ClientList
      var roomObj; 
      connectionObj.generateRoomClientList("update", null, function(err, callback){
        roomObj = callback;
      });
      var clientList = roomObj['dev'].clientList;

      // Send each message to every client in the room
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

      // Delete the KeyValuePair 'ComponentId/EasyRtcId' from dict
      delete dictOfSelectedComponents[cidToDeselect];
    }

  }else if(msgType === "removeComponent") {
    // Remove the given component
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

      // Remove component from 'selectedComponents' dictionary
      if(dictOfSelectedComponents.hasOwnProperty(cid)) {
        delete dictOfSelectedComponents[cid];
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
    }
  }else if(msgType === "updateComponent") {
    // Update the given component
    var data = msg.msgData;
    var dataObj = JSON.parse(data);
    var cid = dataObj.cid;

    console.log("UPDATE dataObj");
    console.log(dataObj);

    // Find object in 'component' list
    var dataIndex = -1;

    for(let i = 0; i < listOfComponentData.length; i++){
      if(listOfComponentData[i].cid == cid) {

        dataIndex = i;
        break;
      }
    }

    if (dataIndex != -1) {
      // Get component from 'componentData' list
      var component = listOfComponentData[dataIndex];

      // TODO: update the data 
      var updateType = dataObj.updatetype;
      var message = {};

      // Get room object + Clientlist
      var roomObj; 
      connectionObj.generateRoomClientList("update", null, function(err, callback){
        roomObj = callback;
      });

      var clientList = roomObj['dev'].clientList;

      // Check for update type
      if(updateType == 'interaction') {
        // Get data
        var attribute = dataObj.attribute;
        var value = dataObj.value;
        var interactionData = component.data;

        // Update the data on server
        switch(attribute) {
          case 'action':
          case 'target':
          case 'reactionLayer':
          case 'reactionShape':
            interactionData[attribute] = value;
            break;
          
          default:
            component[attribute] = value;
            break;
        }

        // Set message data
        dataObj.sourceRtcId = easyrtcid;
        data = JSON.stringify(dataObj);
        message.msgData = data;
        message.msgType = 'updatedInteraction';

        console.log("Broadcasting 'updatedInteraction'...");

        // Send updated interaction message
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
        var updateData = dataObj.updatedata;

        // Update data of 'normal' entities 

        if(updateType == 'wireframed') {
          var shape = component[geometry].shape;
          switch(shape) {
            case 'grillerTop':
            case 'toast':
            case 'tomatoes':
            case 'cheese':
            case 'stool':
            case 'bowl':
            case 'plate':
              return;

            default:
              break;
          }

          // Update server data
          component[updateType] = updateData;

          // Set message type
          message.msgType = 'updatedComponent';

        }else if(updateType == 'interactable') {
          // Update server data
          component.interactable[updateData.attribute] = updateData.value;

          // Set message type
          message.msgType = 'updatedInteractable';

        }else{
          // Update server data
          component[updateType] = updateData;

          // Set message type
          message.msgType = 'updatedComponent';
        }

        // Add sourceRtcId to data
        dataObj.sourceRtcId = easyrtcid;
        data = JSON.stringify(dataObj);

        // Set message data
        message.msgData = data;

        console.log("data");
        console.log(data);

        // Send the update message
        console.log("Broadcasting '" + message.msgType + "'...");
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
    }
  }else if(msgType === "broadcastUserName") {

    // Get data & create message
    var data = msg.msgData;
    var easyrtcid = connectionObj.getEasyrtcid();
    var message = {};
    message.msgType = 'userJoined';
    message.msgData = data;

    // Broadcast to room
    var roomObj; 
    connectionObj.generateRoomClientList("update", null, function(err, callback){
      roomObj = callback;
    });
    var clientList = roomObj['dev'].clientList;
    for (var currentEasyrtcid in clientList) {
      (function(innerCurrentEasyrtcid, innerMsg){
        connectionObj.getApp().connection(innerCurrentEasyrtcid, function(err, emitToConnectionObj) {
          if(currentEasyrtcid != easyrtcid) {
            easyrtc.events.emit("emitEasyrtcMsg", emitToConnectionObj, message.msgType, message, null, function(err) {
              if(err) {
                console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
              }
            });
          }
        });
      })(currentEasyrtcid, "TODO: Remove this (unnecessary?) invocation");
    }
  }else if(msgType === "getAllComponents"){
    // Sending all existing components to a new user
    console.log("Sending all existing components to new user ["+easyrtcid+"].");

    var targetRoom = 'dev';
    connectionObj.getRoomNames((err, roomNames) => {
      if(roomNames.length > 0) {
          targetRoom = roomNames[0];
      }
    });

    // Create base message
    var message = {};
    message.targetRoom = targetRoom;;

    // Send all existing components to the newly joined user
    listOfComponentData.forEach(comp => {
      // Set specific message data
      var data = JSON.stringify(comp);
      if(comp.type == 'eventarea') {
        message.msgType = 'spawnInteraction';
      }else{
        message.msgType = 'spawnComponent';
      }
      message.msgData = data;

      connectionObj.getApp().connection(easyrtcid, function(err, emitToConnectionObj) {
        easyrtc.events.emit("emitEasyrtcMsg", emitToConnectionObj, message.msgType, message, null, function(err) {
          if(err) {
            console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
          }
        });
      });
    });

    // Send all existing tasks to the newly joined user
    tasks.forEach(task => {
      // Set specific message data
      var data = JSON.stringify(task);
      message.msgType = 'addedTask'
      message.msgData = data;

      connectionObj.getApp().connection(easyrtcid, function(err, emitToConnectionObj) {
        easyrtc.events.emit("emitEasyrtcMsg", emitToConnectionObj, message.msgType, message, null, function(err) {
          if(err) {
            console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
          }
        });
      });
    });

  }else if(msgType === "addInteraction") {
    var data = msg.msgData;
    var newObj = JSON.parse(data);
    componentCounter++;

    switch(newObj.type) {
      case 'eventarea': 
        // Add the new object to existing ones
        newObj['cid'] = componentCounter;
        newObj.selectedBy = -1;
        newObj.name = 'New EventArea';
        listOfComponentData.push(newObj);

        // Create new message & set msgType
        var message = {};
        message.msgType = 'spawnInteraction';

        // Add default interaction data
        var interactionData = new Object();
        interactionData.target = 'none'; // Should be a cid
        interactionData.action = 'none'; // Possible actions: none, addLayer, changeTo 
        interactionData.reactionLayer = 'none';
        interactionData.reactionShape = 'none';
        newObj.data = interactionData;

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
        console.log("Server emitting 'interaction' creation event!");
        
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
        break;
      
      case 'rotation':

        break;

      default:
        return;
    }

  }else if(msgType === "selectTasks") {
    // Deselect all other components that are flagged with the current selector's easyrtcid 
    var cidToDeselect = -1;

    for(const key in dictOfSelectedComponents) {
      if(dictOfSelectedComponents[key] == easyrtcid) {
        cidToDeselect = key;
      }
    }

    if(cidToDeselect != -1) {
      // Edit list of component data
      var specificObject = listOfComponentData.find(obj => {
        return obj.cid == cidToDeselect;
      })
      
      // Update data
      specificObject.selectedBy = -1;

      // Send 'Deselect' of 'old cid'
      var dataObj = new Object(); 
      var message = {};
      dataObj.cid = cidToDeselect;
      dataObj.bool = false;
      dataObj.sourceRtcId = easyrtcid;
      var data = JSON.stringify(dataObj);

      message.msgType = 'selectedComponent';
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
      console.log("Server emitting 'selectedComponent' event!");
      
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

      // Delete the KeyValuePair 'ComponentId/EasyRtcId' from dict
      delete dictOfSelectedComponents[cidToDeselect];
    }
    
    // Update data
    tasksSelectedBy = easyrtcid;

    // Set message data
    var newObj = new Object();
    newObj.tasksSelectedBy = easyrtcid;

    var message = {};
    message.msgType = 'selectedTasks';
    data = JSON.stringify(newObj);

    // Send select tasks
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
    console.log("Server emitting 'selectedTasks' event!");
    
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

  }else if(msgType === "addTask") {
    // Add new task
    var task = new Object();
    task.triggerEvent = 'none';
    task.eventAngle = 0;

    tasks.push(task);

    // Set message data
    var data = JSON.stringify(task);
    var message = {};
    message.msgType = 'addedTask';
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
    console.log("Server emitting 'addedTask' event!");
    
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

  }else if(msgType === "updateTask") {
    // Update server data
    var data = msg.msgData;
    var updateData = JSON.parse(data);
    var taskId = updateData.taskId;
    var task = updateData.task;

    tasks[taskId] = task;

    // Broadcast update
    var message = {};
    message.msgType = 'updatedTask';
    updateData.sourceRtcId = easyrtcid;
    data = JSON.stringify(updateData);
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
    console.log("Server emitting 'updatedTask' event!");
    
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
    
  }else if(msgType === "removeTask") {
    // Update server data
    tasks.pop();

    // Set message data
    var message = {};
    message.msgType = 'removedTask';
    message.msgData = null;

    // Set targetRoom name
    var targetRoom = 'dev';
    connectionObj.getRoomNames((err, roomNames) => {
      if(roomNames.length > 0) {
          targetRoom = roomNames[0];
      }
    });
    message.targetRoom = targetRoom;

    // Emit message to all room members
    console.log("Server emitting 'removedTask' event!");
    
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

  }else if(msgType === "exportFiles") {
    exportComponents();
    
  }else if(msgType === "addedTask") {
    // Only for client side --> SKIP
  }else if(msgType === "updatedTask") {
    // Only for client side --> SKIP
  }else if(msgType === "removedTask") {
    // Only for client side --> SKIP
  }else if(msgType === "userJoined") {
    // Only for client side --> SKIP
  }else if(msgType === "userLeft") {
    // Only for client side --> SKIP
  }else if(msgType === "removedComponent"){
    // Only for client side --> SKIP
  }else if(msgType === "updatedComponent"){
    // Only for client side --> SKIP
  }else if(msgType === "selectedComponent"){
    // Only for client side --> SKIP
  }else if(msgType === "spawnComponent"){
    // Only for client side --> SKIP
  }else if(msgType === "spawnInteraction"){
    // Only for client side --> SKIP
  }else if(msgType === "selectedTasks"){
    // Only for client side --> SKIP
  }else{
      // Default listener
      easyrtc.events.defaultListeners.easyrtcMsg(connectionObj, msg, socketCallback, callback)
  }
});

// To test, lets print the credential to the console for every room join!
easyrtc.events.on("roomJoin", (connectionObj, roomName, roomParameter, callback) => {
    var currentEasyRtcId = connectionObj.getEasyrtcid();
    console.log("["+currentEasyRtcId+"] Credential retrieved!", connectionObj.getFieldValueSync("credential"));
    easyrtc.events.defaultListeners.roomJoin(connectionObj, roomName, roomParameter, callback);
});

// RoomLeave event
easyrtc.events.on("roomLeave", (connectionObj, roomName, roomParameter, callback) => {
  // Deselect all components the leaving clients has selected
  var cidToDeselect = -1;
  var sourceRtcId = connectionObj.getEasyrtcid();

  for(const key in dictOfSelectedComponents) {
    if(dictOfSelectedComponents[key] == sourceRtcId) {
      cidToDeselect = key;
    }
  }

  // Send 'Deselect' of 'old cid' 
  var message = {};
  var dataObj = new Object();
  dataObj.sourceRtcId = sourceRtcId;

  if(cidToDeselect != -1) {
    dataObj.cid = cidToDeselect;

    var specificObject = listOfComponentData.find(obj => {
      return obj.cid == cidToDeselect;
    })
    specificObject.selectedBy = -1;

    // Delete the KeyValuePair 'ComponentId/EasyRtcId' from dict
    delete dictOfSelectedComponents[cidToDeselect];
  }else{
    dataObj.cid = -1;
  }

  if(tasksSelectedBy == sourceRtcId) {
    dataObj.tasksSelectedBy = 'remove';
  }

  var data = JSON.stringify(dataObj);

  message.msgType = 'userLeft';
  message.msgData = data;

  // Send each message to every client in the room
  var roomObj; 
  connectionObj.generateRoomClientList("update", null, function(err, callback){
    roomObj = callback;
  });
  var clientList = roomObj['dev'].clientList;
  for (var currentEasyrtcid in clientList) {
    (function(innerCurrentEasyrtcid, innerMsg){
      if(currentEasyrtcid != sourceRtcId) {
        connectionObj.getApp().connection(innerCurrentEasyrtcid, function(err, emitToConnectionObj) {
          easyrtc.events.emit("emitEasyrtcMsg", emitToConnectionObj, message.msgType, message, null, function(err) {
            if(err) {
              console.log("[ERROR] Unhandled 'easyrtcMsg listener' error.", err);
            }
          });  
        });
      }
    })(currentEasyrtcid, "TODO: Remove this (unnecessary?) invocation");
  }

  easyrtc.events.defaultListeners.roomLeave(connectionObj, roomName, roomParameter, callback);
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
