// Init tasks
var tasks = [];
var tasksSelectedBy = null;

var eventOptions = [['none', 'None']];

function updateEventOptions() {
  eventOptions = [['none', 'None']];

  // Get all existing interactions and add them to the eventOptions
  var interactions = document.getElementsByClassName('interaction');
  for(var j = 0; j < interactions.length; j++) {
    var pEl = interactions[j];
    var el = pEl.children[0];
    var cid = pEl.getAttribute('cid');
    var type = pEl.getAttribute('type');
    var name = pEl.getAttribute('entityName');
    var eventOption = [cid, name, type];
    eventOptions.push(eventOption);
  }

  // Get all existing interactables and add them to the eventOptions
  var interactables = document.getElementsByClassName('entity');
  for(var n = 0; n < interactables.length; n++) {
    var pEl = interactables[n];
    var el = pEl.children[0];
    var interactable = el.interactable;

    // Sort out task areas
    if(interactable != null) {
      var type = interactable.type;
      var cid = pEl.getAttribute('cid');
      var name = pEl.getAttribute('entityName');
      
      switch(type) {
        case 'rotatable':
          //var angle = task.eventAngle;
          var eventOption = [cid, name, type/*, angle*/];
          eventOptions.push(eventOption);
          break;

        case 'none':
        case 'grabbable':
          break;
      }
    }
  }
}

function addNumberedTask(task, index) {
  var yOffset = 3 - 0.3 * index;

  // Container
  var container = document.createElement('a-entity');
  container.setAttribute('position', '0.35 ' + yOffset + ' 0');
  container.setAttribute('id', 'taskedit' + index);

  // Taskname
  var name = document.createElement('a-entity');
  name.setAttribute('scale', '0.3 0.3 0.3');
  name.setAttribute('visible', 'true');
  name.setAttribute('text', 'value: ' + index + '.; transparent: true');
  
  var taskNameDisplay = document.createElement('a-text');
  taskNameDisplay.setAttribute('position', '-0.15 0 0');
  taskNameDisplay.setAttribute('scale', '0.7 0.7 0.7');
  taskNameDisplay.setAttribute('color', 'black');
  taskNameDisplay.setAttribute('value', 'Task ' + (index+1) + ':');
  container.appendChild(taskNameDisplay);

  // Interaction selection
  var triggerEvent = task.triggerEvent;

  var eventOption = null;
  for(var i = 0; i < eventOptions.length; i++) {
    var evtOption = eventOptions[i];
    if(evtOption[0] == triggerEvent) {
      eventOption = evtOption;
      break;
    }
  }

  if(eventOption == null) {
    eventOption = eventOptions[0];
  }

  var selection = createInteractionSelection(index, triggerEvent, eventOption);
  container.appendChild(selection);

  var submenu = document.getElementById('container-vr-submenu-task');
  submenu.appendChild(container);
}

function changeEventOption(input, next) {
  var debug = document.getElementById('debugtext');
  debug.setAttribute('value', debug.getAttribute('value') + '\nInside ChangeEventOpt!');

  var newOption = null;
  var nextOptionIndex;
  debug.setAttribute('value', debug.getAttribute('value') + '\nInput = ' + input);
  var currentOptionIndex = input.getAttribute('index');

  debug.setAttribute('value', debug.getAttribute('value') + '\ncurrentOptionIndex: ' + currentOptionIndex);

  if(next) {
    nextOptionIndex = currentOptionIndex + 1;
    if(nextOptionIndex > eventOptions.length-1) {
      newOption = eventOptions[0];
    }else{
      newOption = eventOptions[nextOptionIndex+1];
    }
    
  }else{
    nextOptionIndex = currentOptionIndex -1 ;
    if(nextOptionIndex < 0) {
      newOption = eventOptions[eventOptions.length-1];
    }else{
      newOption = eventOptions[nextOptionIndex-1];
    }
  }

  var eventOptionName = newOption[1];
  input.setAttribute('text', 'value: ' + eventOptionName);
  input.setAttribute('index', nextOptionIndex);
}

function createSwitchInteractionButton(taskId, next) {
  var buttonContainer = document.createElement('a-entity');
  buttonContainer.setAttribute('priority', 'level: hud');
  buttonContainer.setAttribute('visible', 'true');
  buttonContainer.setAttribute('scale', '0.25 0.25 0.01');

  var button = document.createElement('a-entity');
  button.setAttribute('class', 'vr-menu-task');
  button.setAttribute('geometry', 'primitive: box');
  button.setAttribute('material', 'color: #0377fc');
  button.setAttribute('visible', 'true');
  button.setAttribute('priority', 'level: hud');
  button.setAttribute('raycaster-listen', '');
  buttonContainer.appendChild(button);
  button.addEventListener('select-object', function handleSelect(event) {
    var input = document.getElementById('eventdisplay' + taskId);
    changeEventOption(input, next);
  });

  var buttonImg = document.createElement('a-entity');
  buttonImg.setAttribute('geometry', 'primitive: plane');
  buttonImg.setAttribute('visible', 'true');
  buttonImg.setAttribute('priority', 'level: hud');
  if(next) {
    buttonImg.setAttribute('material', 'src: #next; transparent: true');
  }else{
    buttonImg.setAttribute('material', 'src: #previous; transparent: true');
  }
  
  buttonContainer.appendChild(buttonImg);

  return buttonContainer;
}

function createInteractionSelection(taskId, triggerEvent, eventOption) {
  var container = document.createElement('a-entity');
  container.setAttribute('position', '0.05 0 0');

  var eventOptionName = eventOption[1];
  var eventTriggerDisplay = createDisplayEvent(taskId, eventOptionName, 1.5, 0.7, 0, 0);
  container.appendChild(eventTriggerDisplay);

  var nextButton = createSwitchInteractionButton(taskId, true);
  nextButton.setAttribute('position', '2.4 0 0');
  container.appendChild(nextButton);

  var previousButton = createSwitchInteractionButton(taskId, false);
  previousButton.setAttribute('position', '0.5 0 0');
  container.appendChild(previousButton);

  var triggerType = 'none';
  if(eventOption[0] != 'none') {
    triggerType = eventOption[2];
  }
  console.log("triggerType");
  console.log(triggerType);

  switch(triggerEvent) {
    case 'none':
      break;

    case 'eventarea':
      // Add target
      
      // Add switch for actions 
      break;

    case 'rotatable':
      // Add target angle inputtable
      var targetAngleInput = createInputtableTask(taskId, 'TargetAngle', task.eventAngle, 0.6, 3, 0, 0)
      container.append(targetAngleInput);
      break;
  }

  return container;
}

function createDisplayEvent(id, value, width, posX, posY, posZ) {
  var offsetX = -0.7 + width/2;

  var container = document.createElement('a-entity');
  container.setAttribute('id', 'eventdisplay' + id);
  container.setAttribute('position', posX + ' ' + posY + ' ' + (posZ + 0.05) );
  container.setAttribute('color', 'black');

  var name = document.createElement('a-text');
  name.setAttribute('scale', '0.7 0.7 0.7');
  name.setAttribute('color', 'black');
  name.setAttribute('value', value);
  container.appendChild(name);

  var background = document.createElement('a-plane');
  background.setAttribute('position', 0.7 + offsetX + ' 0 0');
  background.setAttribute('material', 'color: white');
  background.setAttribute('height', 0.2);
  background.setAttribute('width', width);
  container.appendChild(background);

  return container;
}

function createInputtableTask(id, name, value, width, posX, posY, posZ) {
  var offsetX = -0.7 + width/2;

  var container = document.createElement('a-entity');
  container.setAttribute('id', name+id);
  container.setAttribute('position', posX + ' ' + posY + ' ' + (posZ + 0.05) );
  container.setAttribute('color', 'black');
  container.setAttribute('priority', 'level: hud');

  var name = document.createElement('a-text');
  name.setAttribute('scale', '3 3 3');
  name.setAttribute('color', 'black');
  name.setAttribute('value', name + ':');
  name.setAttribute('priority', 'level: hud');
  container.appendChild(name);

  var text = document.createElement('a-text');
  text.setAttribute('scale', '3 3 3');
  text.setAttribute('color', 'black');
  text.setAttribute('value', value);
  text.setAttribute('priority', 'level: hud');
  container.appendChild(text);

  var background = document.createElement('a-plane');
  background.setAttribute('class', 'vr-submenu-task');
  background.setAttribute('name', 'vr-submenu-task');
  background.setAttribute('position', 1.7 + offsetX + ' 0 0');
  background.setAttribute('material', 'color: white');
  background.setAttribute('height', 0.2);
  background.setAttribute('width', width);
  background.setAttribute('priority', 'level: hud');
  background.setAttribute('inputtable', '')
  container.appendChild(background);

  return container;
}

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

  createGrillerTop: function(el) {
    var body = document.createElement('a-box');
    body.setAttribute('scale', '0.8 0.2 0.8');
    body.setAttribute('position', '0 0.1 0');
    body.setAttribute('material', 'color: #4d4d4d');
    el.appendChild(body);

    var handle = document.createElement('a-box');
    handle.setAttribute('scale', '0.2 0.1 0.1');
    handle.setAttribute('position', '0 0.1 0.45');
    handle.setAttribute('material', 'color: #4d4d4d');
    el.appendChild(handle);

    var surface = document.createElement('a-plane');
    surface.setAttribute('scale', '0.8 0.8 0.8');
    surface.setAttribute('position', '0 -0.01 0');
    surface.setAttribute('rotation', '90 0 0');
    surface.setAttribute('material', 'src: #griller-texture; transparent: true');
    el.appendChild(surface);
  },

  spawnEntity: function(data) {
    var cid = data.cid;
    var name = data.name;
    var shape = data.shape;
    var material = data.material;
    var scale = data.scaleX + " " + data.scaleY + " " + data.scaleZ;
    var rotation = data.rotX + " " + data.rotY + " " + data.rotZ;
    var height = data.height;
    var radius = data.radius;
    var pos3 = new THREE.Vector3(data.posX, data.posY, data.posZ);
    var interactable = data.interactable;
    var wireframed = data.wireframed;

    // Create container element
    var pEl = document.createElement('a-entity');
    pEl.setAttribute('id', 'cid' + cid);
    pEl.setAttribute('cid', cid);
    pEl.setAttribute('position', pos3);
    pEl.setAttribute('scale', '0.2 0.2 0.2');
    pEl.setAttribute('class', 'entity');
    pEl.setAttribute('entityName', name);

    // Create actual element & wireframe
    var el = document.createElement('a-entity');
    el.setAttribute('scale', scale);
    el.setAttribute('wireframed', String(wireframed));
    pEl.appendChild(el);

    // Handle wireframe attributes
    var elWireframe = document.createElement('a-entity');
    if(wireframed == 'true') {
      elWireframe.setAttribute('id', 'cid' + cid + '-wireframe');
      elWireframe.setAttribute('position', '0 0 0');
      elWireframe.setAttribute('material', 'color: #ff0000; wireframe: true;');
      elWireframe.setAttribute('geometry', 'primitive: box;');
      elWireframe.setAttribute('wireframe', '');
      elWireframe.setAttribute('priority', 'level: wireframe;');
      pEl.appendChild(elWireframe);
    }

    // Append to scene
    var scene = this.el.sceneEl;
    scene.appendChild(pEl);

    // Handle other attributes
    el.interactable = interactable;

    // Handle geometry/shape attribute
    if(shape == 'sphere') {
      el.setAttribute('geometry', 'primitive: sphere; segmentsWidth: 16; segmentsHeight: 16;');
      el.setAttribute('radius', radius);
      el.setAttribute('material', material);

      var scaler = radius*2;
      elWireframe.setAttribute('scale', scaler + ' ' + scaler + ' ' + scaler);

    }else if(shape == 'plane') {
      el.setAttribute('geometry', 'primitive: plane;');
      el.setAttribute('rotation', rotation);
      el.setAttribute('material', material);

      elWireframe.setAttribute('geometry', 'primitive: plane;');
      elWireframe.setAttribute('rotation', rotation);

    }else if(shape == 'cylinder') {
      el.setAttribute('geometry', 'primitive: ' + shape + '; radius: ' + radius + '; height: ' + height + '; rotation: ' + rotation + ';');
      el.setAttribute('material', material);

      var scaler = Number(radius)*2;
      var heightNum = Number(height);

      var tempScale = scaler + ' ' + heightNum + ' ' + scaler;

      elWireframe.setAttribute('scale', tempScale);
      elWireframe.setAttribute('rotation', rotation);

    }else if(shape == 'box') {
      el.setAttribute('geometry', 'primitive: ' + shape + ';');
      el.setAttribute('rotation', rotation);
      el.setAttribute('material', material);

      elWireframe.setAttribute('geometry', 'primitive: box');
      elWireframe.setAttribute('scale', scale);
      elWireframe.setAttribute('rotation', rotation);

    }else if(shape == 'bowl') {
      var color = material.color;
      var opacity = material.opacity;
      el.setAttribute('position', '0 0 0');
      el.setAttribute('obj-model', 'obj: #bowl');
      el.setAttribute('material', 'src: /img/ceramic_white.jpg; color: ' + color + '; opacity: ' + String(opacity) +';');
      el.setAttribute('rotation', rotation);
      
      elWireframe.setAttribute('scale', '1 1 1');
      elWireframe.setAttribute('rotation', rotation);

    }else if(shape == 'plate') {
      var color = material.color;
      var opacity = material.opacity;
      el.setAttribute('position', '0 0 0');
      el.setAttribute('obj-model', 'obj: #plate');
      el.setAttribute('material', 'src: /img/ceramic_white.jpg; color: ' + color + '; opacity: ' + String(opacity) +';');
      el.setAttribute('rotation', rotation);

      elWireframe.setAttribute('scale', '1 0.2 1');
      elWireframe.setAttribute('rotation', rotation);
      
    }else if(shape == 'stool') {
      el.setAttribute('obj-model', 'obj: #woodenstool');
      el.setAttribute('material', 'src: /img/wood1.jpg');
      
    }else if(shape == 'table') {
      el.setAttribute('obj-model', 'obj: #coffeetable-obj; mtl: coffeetable-mtl');
      
    }else if(shape == 'griller-top') {
      this.createGrillerTop(el);
      el.setAttribute('position', '0 0 0');
      el.setAttribute('rotation', rotation);

      elWireframe.setAttribute('geometry', 'primitive: box');
      elWireframe.setAttribute('rotation', rotation);
    }else{
      // TODO: Add method for specific models
      el.setAttribute('rotation', rotation);

      elWireframe.setAttribute('geometry', 'primitive: box');
      elWireframe.setAttribute('rotation', rotation);
    }

    // Handle raycaster attribute AFTER adding el to scene
    el.setAttribute('raycaster-listen', '');

    // Check for selection
    var selectedById = data.selectedBy;
    if(selectedById != -1) {
      // Make selected object transparent and untargetable
      if(shape == 'box' || shape == 'plane' || shape == 'sphere' || shape == 'cylinder') {
        var mat = el.getAttribute('material');
        if(mat == null) {
          mat = new Object();
        }
        mat.opacity = 0.4;
        el.setAttribute('material', mat);
      }

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

    updateEventOptions();
  },

  createAxes: function(pEl) {
    var xSlider = document.createElement('a-entity');
    var ySlider = document.createElement('a-entity');
    var zSlider = document.createElement('a-entity');

    xSlider.setAttribute('material', 'color: #00ff00');
    ySlider.setAttribute('material', 'color: #ff0000');
    zSlider.setAttribute('material', 'color: #0000ff');

    xSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.1; height: 2; segmentsRadial: 6');
    ySlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.1; height: 2; segmentsRadial: 6');
    zSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.1; height: 2; segmentsRadial: 6');
    
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

    updateEventOptions();
  },

  removeAxes: function(pEl) {
    Array.from(pEl.children).forEach(child => {
      if(child.getAttribute('class') == 'axis-slider') {
        pEl.removeChild(child);
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

    // Decide whether to select or deselect the object
    if(sourceRtcId == clientRtcId) {
      // Client's own EasyRTCid
      if(selectBool) {
        // Select object: Add AxesHelper
        this.createAxes(pEl);

        // Listen for thumbstick-rotation
        el.setAttribute('currentlySelected', '');

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
            var name = pEl.getAttribute('entityName');
            var wfObjectName = name + "-wireframe";
            var wfObjects = document.querySelectorAll("[wireframe]");
            var wfObject = null;

            wfObjects.forEach(obj => {
              var objName = obj.getAttribute('entityName');
              if(objName == wfObjectName) {
                wfObject = obj;
              }
            });

            wfObject.setAttribute('visible', true);
          }
        }

      }else{
        // Remove thumbstick-rotation
        el.removeAttribute('currentlySelected');

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
      // el.setAttribute('class', 'selected-collidable');
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

  updateComponent: function(componentId, type, data, sourcertcid) {
    var pEl = document.getElementById('cid' + componentId); // = null;
    var el = pEl.children[0];
    
    /*var els = this.el.sceneEl.querySelectorAll('[cid]');

    for (var i = 0; i < els.length; i++) {

      if(els[i].getAttribute('cid') == componentId) {
        pEl = els[i];
        el = pEl.children[0];
        break;
      }
    }*/

    if(type == 'wireframed') {
      var cid = pEl.getAttribute('id');

      if(data == 'true') {
        // Add wireframe
        var geometry = el.getAttribute('geometry');
        var shape;
        if(geometry == null) {
          shape = 'model';
        }else{
          shape = geometry.primitive;
        }

        // Handle wireframe
        el.setAttribute('wireframed', 'true');
        var elWireframe = document.createElement('a-entity');
        elWireframe.setAttribute('id', cid + '-wireframe');
        elWireframe.setAttribute('position', '0 0 0');
        elWireframe.setAttribute('material', 'color: #ff0000; wireframe: true');
        elWireframe.setAttribute('geometry', 'primitive: box;');
        elWireframe.setAttribute('wireframe', '');
        elWireframe.setAttribute('priority', 'level: wireframe');
        pEl.appendChild(elWireframe);

        // Handle geometry/shape attribute
        if(shape == 'sphere') {
          var radius = el.getAttribute('radius');

          var scaler = radius*2;
          elWireframe.setAttribute('scale', scaler + ' ' + scaler + ' ' + scaler);

        }else if(shape == 'plane') {
          var rotation = el.getAttribute('rotation');

          elWireframe.setAttribute('geometry', 'primitive: plane;');
          elWireframe.setAttribute('rotation', rotation);

        }else if(shape == 'cylinder'){
          var geometry = el.getAttribute('geometry');
          var height = geometry.height;
          var radius = geometry.radius;
          var rotation = el.getAttribute('rotation');

          var scaler = radius*2;
          elWireframe.setAttribute('scale', scaler + ' ' + height + ' ' + scaler);
          elWireframe.setAttribute('rotation', rotation);

        }else if(shape == 'box') {
          var rotation = el.getAttribute('rotation');
          var scale = el.getAttribute('scale');
          
          elWireframe.setAttribute('geometry', 'primitive: box');
          elWireframe.setAttribute('scale', scale);
          elWireframe.setAttribute('rotation', rotation);

        }else{
          // TODO: Add method for specific models
          elWireframe.setAttribute('geometry', 'primitive: box');
        };
      }else {
        // Remove wireframe if necessary
        var wireframed = el.getAttribute('wireframed'); 
        if(wireframed == 'false') {
          return;
        }

        var wfObjectId = cid + "-wireframe"
        var wfObject = document.getElementById(wfObjectId);

        el.setAttribute('wireframed', 'false');
        if(wfObject != null) {
          wfObject.parentEl.removeChild(wfObject);
        }
      }
      // Update entity data
      el.setAttribute(type, data);

    }else{
      if(type == 'position') {
        // Position has to be changed for parentEl
        pEl.setAttribute(type, data);
  
      }else if(type == 'name'){
        // Name has to be changed for parentEl
        pEl.setAttribute('entityName', data);
  
        // Update scene objects view
        var tr = parent.document.getElementById("cid" + componentId);
        var elementNameCell = tr.cells[1];
        elementNameCell.innerHTML = data;
  
      }else{
        // All other types should be changed for el itself
        el.setAttribute(type, data);
      }

      // Check for wireframe
      var wireframed = el.getAttribute('wireframed');
      if(wireframed == 'true') {
        var wfObject = document.getElementById(pEl.getAttribute('cid') + '-wireframe');
        if(wfObject != null) {
          switch(type) {
            case 'scale':
            case 'rotation':
            case 'height':
            case 'radius':
              wfObject.setAttribute(type, data);
              break;

            default:
              break;
          }
        }
      }
    }

    // Update property rows if element is currently selected by client
    if(sourcertcid == clientRtcId) {
      this.selectEntity(componentId, clientRtcId, true);
    }

    // Update taskboard & event options
    this.updateTaskboard();
    updateEventOptions();

    // TODO: ADD TASK-BLOCKER
    /*
    if(tasksSelectedBy == clientRtcId) {
      this.selectTasks('update');
    }
    */
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

  removeTask: function() {
    // Delete last task
    tasks.pop();
    var index = tasks.length;

    // Update TaskBoard
    this.updateTaskboard();

    // Update GUI
    var taskContainer = document.getElementById('taskedit' + index);
    var pEl = taskContainer.parentEl; 
    pEl.removeChild(taskContainer);
  },

  spawnInteraction: function(interaction) {
    var type = interaction.type;

    if(type == 'eventarea') {
      var cid = interaction.cid;
      var data = interaction.data;
      var name = interaction.name;
      var scale = interaction.scale;
      var pos3 = new THREE.Vector3(interaction.posX, interaction.posY, interaction.posZ);

      // Create container element
      var pEl = document.createElement('a-entity');
      pEl.setAttribute('class', 'interaction');
      pEl.setAttribute('type', type);
      pEl.setAttribute('cid', cid);
      pEl.setAttribute('position', pos3);
      pEl.setAttribute('scale', '0.2 0.2 0.2');
      pEl.setAttribute('entityName', name);

      pEl.data = data;

      // Create actual element & handle attributes
      var el = document.createElement('a-entity');
      el.setAttribute('scale', scale);
      el.setAttribute('geometry', interaction.geometry);
      el.setAttribute('material', interaction.material);

      // Handle raycaster attribute 
      el.setAttribute('raycaster-listen', '');

      // Check for selection
      var selectedById = interaction.selectedBy;
      if(selectedById != -1) {
        // Make selected object transparent and untargetable
        var mat = el.getDOMAttribute('material');
        mat.opacity = 0.1;
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
      var scene = this.el.sceneEl;
      scene.appendChild(pEl);

      updateEventOptions();
    }
  },

  updateInteraction: function(data) {
    var componentId = data.cid;
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

    // TODO: Update interaction and remove from old target if necessary
    var attribute = data.attribute;
    var value = data.value;

    pEl.data[attribute] = value;

    // Update property rows if element is currently selected by client
    if(data.sourceRtcId == clientRtcId) {
      this.selectEntity(componentId, clientRtcId, true);
    }
  },

  areTasksOccupied: function() {
    var occupied = !(tasksSelectedBy == null || tasksSelectedBy == clientRtcId);

    if(occupied) {
      return true;
    }

    return false;
  },

  selectTasks: function(sourceRtcId) {
    tasksSelectedBy = sourceRtcId;
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

        console.log("compType");
        console.log(compType);
        console.log("cid");
        console.log(pEl.getAttribute('cid'));
        console.log("cid");
        console.log(pEl.getAttribute('cid'));
        
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
          console.log("interaction");
          console.log(interaction);
          console.log("target");
          console.log(target);
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
    var index = tasks.length;
    tasks.push(newTask);

    // Update taskboard
    this.updateTaskboard();

    // Update TaskGui
    addNumberedTask(newTask, index);
  },

  updateTask: function(data) {
    console.log("updateTask");
    // Update data
    console.log("data");
    console.log(data);
    var taskId = data.taskId;
    var task = data.task; 
    tasks[taskId] = task;

    // Update taskboard
    this.updateTaskboard();

    // Update properties view
    var oldContainer = document.getElementById('taskedit' + taskId);
    oldContainer.parentEl.removeChild(oldContainer);

    addNumberedTask(task, taskId);
  }
});

