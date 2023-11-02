// Init tasks
var tasks = [];
var tasksSelectedBy = null;

/* global AFRAME, NAF */
AFRAME.registerComponent('object-control-vr', {
  schema: {
    template: { default: '' },
    keyCode: { default: 32 }
  },

  init: function() {
  },

  getEl: function(cid) {
    var pEl = null;
    var els = document.querySelectorAll('[cid]');

    for (var i = 0; i < els.length; i++) {

      if(els[i].getAttribute('cid') == cid) {
        pEl = els[i];
        break;
      }
    }

    return pEl;
  },

  spawnEntity: function(data) {
    var cid = data.cid;
    var shape = data.shape;
    var scale = data.scaleX + " " + data.scaleY + " " + data.scaleZ;
    var rotation = data.rotX + " " + data.rotY + " " + data.rotZ;
    var height = data.height;
    var radius = data.radius;
    var pos3 = new THREE.Vector3(data.posX, data.posY, data.posZ);
    var interactable = data.interactable;
    var wireframe = data.wireframe;

    // Create container element
    var pEl = document.createElement('a-entity');
    pEl.setAttribute('cid', cid);
    pEl.setAttribute('position', pos3);
    pEl.setAttribute('scale', scale);

    // Create actual element & wireframe
    var el = document.createElement('a-entity');
    var elWireframe = document.createElement('a-entity');

    // Handle geometry/shape attribute
    if(shape == 'sphere') {
      el.setAttribute('geometry', 'primitive: sphere; segmentsWidth: 16; segmentsHeight: 16;');
      el.setAttribute('radius', radius);

      elWireframe.setAttribute('geometry', 'primitive: sphere; segmentsWidth: 16; segmentsHeight: 16;');
      elWireframe.setAttribute('radius', radius);

    }else if(shape == 'plane') {
      el.setAttribute('geometry', 'primitive: plane;');
      el.setAttribute('rotation', rotation);

      elWireframe.setAttribute('geometry', 'primitive: plane;');
      elWireframe.setAttribute('rotation', rotation);

    }else if(shape == 'cylinder'){
      el.setAttribute('geometry', 'primitive: ' + shape + '; radius: ' + radius + '; height: ' + height + '; rotation: ' + rotation + ';');

      elWireframe.setAttribute('geometry', 'primitive: ' + shape + '; radius: ' + radius + '; height: ' + height + '; rotation: ' + rotation + ';');

    }else if(shape == 'box') {
      el.setAttribute('geometry', 'primitive: ' + shape + ';');
      el.setAttribute('rotation', rotation);

      elWireframe.setAttribute('geometry', 'primitive: ' + shape + ';');
      elWireframe.setAttribute('rotation', rotation);

    }else{
      // TODO: Add method for specific models
      el.setAttribute('rotation', rotation);

      elWireframe.setAttribute('geometry', 'primitive: ' + box + ';');
      elWireframe.setAttribute('rotation', rotation);
    }

    // Handle other attributes
    el.setAttribute('material', 'color: #00FFFF');

    el.setAttribute('entityName', 'New ' + shape);
    
    el.interactable = interactable;

    // Handle wireframe attributes
    el.setAttribute('wireframed', wireframe);
    elWireframe.setAttribute('entityName', el.getAttribute('entityName') + '-wireframe');
    elWireframe.setAttribute('wireframe', '');
    elWireframe.setAttribute('priority', 'level: wireframe');
    elWireframe.setAttribute('material', 'color: #ff0000; wireframe: true');

    // Handle raycaster attribute 
    el.setAttribute('raycaster-listen', '');

    // Check for selection
    var selectedById = data.selectedBy;
    if(selectedById != -1) {
      // Make selected object transparent and untargetable
      var mat = el.getDOMAttribute('material');
      mat.opacity = 0.4;
      el.setAttribute('material', mat);

      // Set as untargetable for raycaster
      el.setAttribute('class', 'selected-collidable');

      // Set easyRtcId of source
      el.setAttribute('selectedby', selectedById);
    }else{
      // Set as targetable for raycaster & add select handler
      el.setAttribute('class', 'collidable');
      el.setAttribute('select-listener', '');
      el.setAttribute('trigger-button-listener');
      el.setAttribute('grab-listener', '');
    }

    pEl.appendChild(el);

    // Handle wireframe
    if(wireframe) {
      pEl.appendChild(elWireframe);
    }

    var scene = this.el.sceneEl;
    scene.appendChild(pEl);
  },

  createAxes: function(pEl) {
    var xSlider = document.createElement('a-entity');
    var ySlider = document.createElement('a-entity');
    var zSlider = document.createElement('a-entity');

    xSlider.setAttribute('material', 'color: #00ff00');
    ySlider.setAttribute('material', 'color: #ff0000');
    zSlider.setAttribute('material', 'color: #0000ff');

    xSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.1; height: 2; segmentsRadial: 4');
    ySlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.1; height: 2; segmentsRadial: 4');
    zSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.1; height: 2; segmentsRadial: 4');
    
    xSlider.setAttribute('rotation', '0 0 -90');
    zSlider.setAttribute('rotation', '90 0 0');
    
    xSlider.setAttribute('position', '1 0 0');
    ySlider.setAttribute('position', '0 1 0');
    zSlider.setAttribute('position', '0 0 1');

    xSlider.setAttribute('trigger-grab-axisslider-listener', '');
    ySlider.setAttribute('trigger-grab-axisslider-listener', '');
    zSlider.setAttribute('trigger-grab-axisslider-listener', '');

    xSlider.setAttribute('axis', "x");
    ySlider.setAttribute('axis', "y");
    zSlider.setAttribute('axis', "z");

    xSlider.setAttribute('class', 'axis-slider');
    ySlider.setAttribute('class', 'axis-slider');
    zSlider.setAttribute('class', 'axis-slider');

    xSlider.setAttribute('raycaster-listen', '');
    ySlider.setAttribute('raycaster-listen', '');
    zSlider.setAttribute('raycaster-listen', '');

    pEl.appendChild(xSlider);
    pEl.appendChild(ySlider);
    pEl.appendChild(zSlider);
  },
  
  updateInteractable: function(componentId, sourceRtcId, property, value) {
    console.log("updateInteractable");
    var el = null;
    var pEl = null;
    var els = this.el.sceneEl.querySelectorAll('[cid]');

    for (var i = 0; i < els.length; i++) {

      if(els[i].getAttribute('cid') == componentId) {
        pEl = els[i];
        el = pEl.children[0];
        break;
      }
    }

    el.interactable[property] = value;

    // TODO: Should not be neccessary
    // Update property rows if element is currently selected by client
    /*if(sourceRtcId == clientRtcId) {
      this.selectEntity(componentId, clientRtcId, true);
    }*/
  },

  removeAxes: function(pEl) {
    var firstChild = null;
  
    Array.from(pEl.children).forEach(child => {
      if(firstChild != null) {
        pEl.removeChild(child);
      }else{
        firstChild = child;
      }
    });
  },

  selectEntity: function(componentId, sourceRtcId, selectBool) {

    var el = null;
    var pEl = null;
    var els = document.querySelectorAll('[cid]');

    for (var i = 0; i < els.length; i++) {

      if(els[i].getAttribute('cid') == componentId) {
        pEl = els[i];
        el = pEl.children[0];
        break;
      }
    }

    var debug = document.getElementById('debugtext');
    //debug.setAttribute('value', 'pEl: ' + pEl + ' el: ' + el + ' pEl.cid: ' + componentId);

    // Decide whether to select or deselect the object
    if(sourceRtcId == clientRtcId) {
      // Client's own EasyRTCid
      if(selectBool) {
        // Select object: Add AxesHelper
        this.createAxes(pEl);

        // Add color-listener for Colorwheel
        el.setAttribute('color-listener', '');

        // Revert hover color back to base color
        var material = el.getAttribute('material');
        var currentColor = material.color;
        var baseColor = el.getAttribute('baseColor');

        if(currentColor != baseColor){
          material.color = baseColor;
          el.setAttribute('material', material);

          // Check if wireframe exists and make it visible
          if(el.getAttribute('wireframed') == "true") {
            // TODO: Change wireframe identifier to 'cid' instead of 'name'
            var name = el.getAttribute('name');
            var wfObjectName = name + "-wireframe";
            var wfObjects = document.querySelectorAll("[wireframe]");
            var wfObject = null;

            wfObjects.forEach(obj => {
              var objName = obj.getAttribute('name');
              if(objName == wfObjectName) {
                wfObject = obj;
              }
            });

            wfObject.setAttribute('visible', true);
          }
        }

      }else{
        // Deselect object: Remove AxesHelper
        this.removeAxes(pEl);

        // Remove colorlistener TODO: May be put into the 'Open/Close Color-Menu'
        el.removeAttribute('color-listener');
      }
    }else{

      // Other clients EasyRTCid
      if(selectBool) {
        // Make selected object transparent 
        var mat = el.getAttribute('material');
        mat.opacity = 0.4;
        el.setAttribute('material', mat);
        
      }else {
        // Make deselected object fully visible

        if(el == null) {
          console.log('el == null');
          console.log('pEl = ' + pEl);
          return;
        }
        var mat = el.getAttribute('material');
        mat.opacity = 1.0;
        el.setAttribute('material', mat);
      }
    }

    // VR - Further A-FRAME actions
    if(selectBool) {
      // Set easyRtcId of source
      el.setAttribute('selectedby', sourceRtcId);

      // Remove 'select-button-listener' and the listener it adds
      //el.removeAttribute('raycaster-listen');

      // VR - Make selected object untargetable
      //el.setAttribute('class', 'selected-collidable');
    }else {
      // Remove easyRtcId of source
      el.removeAttribute('selectedby');

      // Add 'select-button-listener' again
      el.setAttribute('raycaster-listen', '');

      // VR - Make selected object targetable again
      el.setAttribute('class', 'collidable');
    }
  },

  removeComponent: function(componentId) {
      // Remove entity from scene
      var pEl = null;
      var els = this.el.sceneEl.querySelectorAll('[cid]');

      for (var i = 0; i < els.length; i++) {

        if(els[i].getAttribute('cid') == componentId) {
          pEl = els[i];
          break;
        }
      }

      pEl.parentNode.removeChild(pEl);
  },

  updateComponent: function(componentId, type, data) {
    var el = null;
    var pEl = null;
    var els = this.el.sceneEl.querySelectorAll('[cid]');

    for (var i = 0; i < els.length; i++) {

      if(els[i].getAttribute('cid') == componentId) {
        pEl = els[i];
        el = pEl.children[0];
        break;
      }
    }

    if(type == 'position') {
      // Position has to be changed for parentEl
      pEl.setAttribute(type, data);
    }else{
      // All other types should be changed for el itself
      el.setAttribute(type, data);

      if(type == 'wireframe') {
        var name = el.getAttribute('entityName');

        if(data) {
          // Add wireframe
          var geometry = el.getAttribute('geometry');
          var shape;
          if(geometry == null) {
            shape = 'model';
          }
          var shape = geometry.primitive;

          var elWireframe = document.createElement('a-entity');

          // Handle geometry/shape attribute
          if(shape == 'sphere') {
            var radius = el.getAttribute('radius');
            elWireframe.setAttribute('geometry', 'primitive: sphere; segmentsWidth: 16; segmentsHeight: 16;');
            elWireframe.setAttribute('radius', radius);

          }else if(shape == 'plane') {
            var rotation = el.getAttribute('rotation');
            elWireframe.setAttribute('geometry', 'primitive: plane;');
            elWireframe.setAttribute('rotation', rotation);

          }else if(shape == 'cylinder'){
            var radius = el.getAttribute('radius');
            var height = el.getAttribute('height');
            var rotation = el.getAttribute('rotation');
            elWireframe.setAttribute('geometry', 'primitive: ' + shape + '; radius: ' + radius + '; height: ' + height + '; rotation: ' + rotation + ';');

          }else if(shape == 'box') {
            var rotation = el.getAttribute('rotation');
            elWireframe.setAttribute('geometry', 'primitive: ' + shape + ';');
            elWireframe.setAttribute('rotation', rotation);

          }else{
            // TODO: Add method for specific models
            var rotation = el.getAttribute('rotation');
            elWireframe.setAttribute('geometry', 'primitive: ' + box + ';');
            elWireframe.setAttribute('rotation', rotation);
          }

          // Handle wireframe attributes
          el.setAttribute('wireframed', data);
          elWireframe.setAttribute('entityName', name + '-wireframe');
          elWireframe.setAttribute('wireframe', '');
          elWireframe.setAttribute('priority', 'level: wireframe');
          elWireframe.setAttribute('material', 'color: #ff0000; wireframe: true');

          pEl.appendChild(elWireframe);
        }else {
          // Remove wireframe
          var wfObjectName = name + "-wireframe"
          var wfObjects = document.querySelectorAll("[wireframe]");
          var wfObject = null;

          wfObjects.forEach(obj => {
            var objName = obj.getAttribute('entityName');
            if(objName == wfObjectName) {
              wfObject = obj;
            }
          });

          wfObject.parentEl.removeChild(wfObject);
        }
      }
    }
  },

  taskChanged: function(evt) {
    var target = evt.target;
    var updateType = target.className;
    var taskId = target.parentElement.parentElement.id.substring(4);
    var value = target.value;

    var newObj = new Object();
    newObj.taskId = taskId;
    var task = tasks[taskId];

    switch(updateType) {
      case 'triggerEvent':
        task.triggerEvent = value;
        break;

      case 'eventAngle':
        task.eventAngle = value; 
        break;

      default:
        break;
    }
    newObj.task = task;
    
    // Send changes to server
    var newData = JSON.stringify(newObj);
    easyrtc.sendDataWS(clientRtcId, "updateTask", newData);
  },

  areTasksOccupied: function() {
    var occupied = !(tasksSelectedBy == null || tasksSelectedBy == clientRtcId);

    if(occupied) {
      var pPanel = window.parent.document.getElementById('properties-panel');
      this.addPropertiesRow(pPanel, 'tasksOccupied', null);

      return true;
    }

    return false;
  },

  deselectTasks: function() {
    tasksSelectedBy = null;
  },

  updateTaskboard: function() {
    var taskboard = document.getElementById('taskboard');

    // Remove prior children
    var counter = 1;
    var child = document.getElementById('task' + counter);
    while(child != null) {
      // Remove child
      taskboard.removeChild(child);

      // Increment
      counter++;
      child = document.getElementById('task' + counter);
    }

    // Add each task
    for(var k = 0; k < tasks.length; k++) {
      var task = tasks[k];
      var childrenCount = taskboard.children.length;
      var pos3 = '0 ' + (childrenCount * (-0.3)) + ' 0';
      var atext = document.createElement('a-text');

      atext.setAttribute('id', 'task' + childrenCount);
      atext.setAttribute('position', pos3);
      atext.setAttribute('wrap-count', '80');
      atext.setAttribute('scale', '2 2 2');

      var taskAngle = task.eventAngle;
      var taskTrigger = task.triggerEvent;
      var taskType;

      // Determine tasktype
      if(taskTrigger == 'none') {
        taskType = 'none';
      }else {
        // Get correct interaction/interactable
        var el;
        var pEl = null;
        var els = this.el.sceneEl.querySelectorAll('[cid]');

        for (var i = 0; i < els.length; i++) {
          if(els[i].getAttribute('cid') == taskTrigger) {
            pEl = els[i];
            el = pEl.children[0];
            break;
          }
        }

        var compType = pEl.getAttribute('class');
        if(compType == 'interaction') {
          taskType = 'eventArea';
        }else{
          taskType = el.interactable.type;
        }
      }

      switch(taskType) {
        case 'eventArea':
          var interaction = pEl.data;
          var target = interaction.target;
          var eventName = pEl.getAttribute('entityName');
          var targetName;

          for (var i = 0; i < els.length; i++) {
            if(els[i].getAttribute('cid') == target) {
              targetName = els[i].getAttribute('entityName');
              break;
            }
          }

          atext.setAttribute('value', childrenCount + '. Move "' + targetName + '" into area "' + eventName + '".');
          break;

        case 'rotatable':
          var targetName = pEl.getAttribute('entityName');
          atext.setAttribute('value', childrenCount + '. Rotate "' + targetName + '" to a ' + taskAngle + ' degree angle.');
          break;

        case 'none':
          atext.setAttribute('value', childrenCount + '. No event selected!');
          break;

        default:
          break;
      }
      taskboard.appendChild(atext);
    }
  },

  addTask: function(newTask) {
    tasks.push(newTask);

    // Update taskboard
    this.updateTaskboard();

    // Update properties panel if selected
    if(tasksSelectedBy == clientRtcId) {
      this.selectTasks('update');
    }
  },

  updateTask: function(data) {
    console.log("updateTask");
    // Update data
    var taskId = data.taskId;
    var task = data.task; 
    console.log("taskData");
    console.log(task);
    tasks[taskId] = task;
    console.log("newTask");
    console.log(tasks[taskId]);

    // Update taskboard
    this.updateTaskboard();

    // Update properties panel if selected
    if(tasksSelectedBy == clientRtcId) {
      this.selectTasks('update');
    }
  },

  selectTasks: function(data) {
    var pPanel = window.parent.document.getElementById('properties-panel');

    if(data != 'update') {
      tasksSelectedBy = data.tasksSelectedBy;

      if(tasksSelectedBy != clientRtcId) {
        return;
      }
    }
    
    // Update properties view
    while (pPanel.firstChild) {
      // Remove all children
      pPanel.removeChild(pPanel.firstChild);
    }

    // Add property rows
    this.addPropertiesRow(pPanel, 'task', null);
  },
});

