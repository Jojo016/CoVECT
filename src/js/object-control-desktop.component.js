// Init tasks
var tasks = [];
var tasksSelectedBy = null;

/* global AFRAME, NAF */
AFRAME.registerComponent('object-control-desktop', {
  schema: {
    template: { default: '' },
    keyCode: { default: 32 }
  },

  init: function() {

  },

  spawnEntity: function(data) {
    var cid = data.cid;
    var name = data.name;
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
    pEl.setAttribute('id', 'cid' + cid);
    pEl.setAttribute('cid', cid);
    pEl.setAttribute('position', pos3);
    pEl.setAttribute('class', 'entity');
    pEl.setAttribute('scale', scale);
    pEl.setAttribute('entityName', name);

    // Create actual element
    var el = document.createElement('a-entity');
    var elWireframe = document.createElement('a-entity');

    // Handle other attributes 
    el.interactable = interactable;

    // Handle geometry/shape attribute
    if(shape == 'sphere') {
      el.setAttribute('material', 'color: #00FFFF');   
      el.setAttribute('geometry', 'primitive: sphere; segmentsWidth: 16; segmentsHeight: 16;');
      el.setAttribute('radius', radius);

    }else if(shape == 'plane') {
      el.setAttribute('material', 'color: #00FFFF');   
      el.setAttribute('geometry', 'primitive: plane;');
      el.setAttribute('rotation', rotation);

    }else if(shape == 'cylinder'){
      el.setAttribute('material', 'color: #00FFFF');   
      el.setAttribute('geometry', 'primitive: ' + shape + '; radius: ' + radius + '; height: ' + height + '; rotation: ' + rotation + ';');

    }else if(shape == 'box') {
      el.setAttribute('material', 'color: #00FFFF');   
      el.setAttribute('geometry', 'primitive: ' + shape + ';');
      el.setAttribute('rotation', rotation);
      
    }else if(shape == 'bowl') {
      el.setAttribute('obj-model', 'obj: #bowl');
      el.setAttribute('material', 'src: /img/ceramic_white.jpg; color: #80bbd1');
      
    }else if(shape == 'plate') {
      el.setAttribute('obj-model', 'obj: #plate');
      el.setAttribute('material', 'src: /img/ceramic_white.jpg; color: #80bbd1');
      
    }else if(shape == 'stool') {
      el.setAttribute('obj-model', 'obj: #woodenstool');
      el.setAttribute('material', 'src: /img/wood1.jpg');
      
    }else if(shape == 'table') {
      el.setAttribute('obj-model', 'obj: #coffeetable-obj; mtl: coffeetable-mtl');
      
    }else{
      // TODO: Add method for specific models
      el.setAttribute('rotation', rotation);
    }

    // Check for selection
    var selectedById = data.selectedBy;
    if(selectedById != -1) {
      // Make selected object transparent and untargetable
      var mat = el.getDOMAttribute('material');
      mat.opacity = 0.4;
      el.setAttribute('material', mat);

      // Set as untargetable for raycaster
      el.removeAttribute('selectable');

      // Set easyRtcId of source
      el.setAttribute('selectedby', selectedById);
    }else{
      // Set as targetable for raycaster & add select handler
      el.setAttribute('selectable', '');
    }

    pEl.appendChild(el);

    // Handle wireframe
    if(wireframe) {
      pEl.appendChild(elWireframe);
    }

    var scene = this.el.sceneEl;
    scene.appendChild(pEl);

    // Add object to list 'Scene Objects'
    var table = parent.document.getElementById('scene-objects');
    var tr = table.insertRow();
    tr.setAttribute("id", "cid" + cid);

    var cidCell = tr.insertCell();
    cidCell.appendChild(document.createTextNode(cid));
    var elementNameCell = tr.insertCell();
    elementNameCell.appendChild(document.createTextNode(name));
    var buttonCell = tr.insertCell();
    var button = document.createElement('button');
    button.innerText = "X";
    button.onclick = function()
    {
      var obj = new Object();
      obj.cid = cid; 
      var newData = JSON.stringify(obj);
      easyrtc.sendDataWS(clientRtcId, "removeComponent", newData);
    }
    buttonCell.appendChild(button);
  },

  onMouseMove: function(event){
      var mouse;

      document.addEventListener('click', event => {
        mouse.x = (event.clientX / this.el.scene.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / this.el.scene.innerHeight) * 2 +1;
      });
  },

  createAxes: function(pEl) {
    var xSlider = document.createElement('a-entity');
    var ySlider = document.createElement('a-entity');
    var zSlider = document.createElement('a-entity');

    xSlider.setAttribute('material', 'color: #00ff00');
    ySlider.setAttribute('material', 'color: #ff0000');
    zSlider.setAttribute('material', 'color: #0000ff');

    xSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.03; height: 0.8; segmentsRadial: 6');
    ySlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.03; height: 0.8; segmentsRadial: 6');
    zSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.03; height: 0.8; segmentsRadial: 6');
    
    xSlider.setAttribute('rotation', '0 0 -90');
    zSlider.setAttribute('rotation', '90 0 0');
    
    var el = pEl.children[0];

    if(el.getAttribute('geometry').primitive == 'box') {
      xSlider.setAttribute('position', '0.2 -0.2 -0.2');
      ySlider.setAttribute('position', '-0.2 0.2 -0.2');
      zSlider.setAttribute('position', '-0.2 -0.2 0.2');
    }else{
      xSlider.setAttribute('position', '0 -0.4 -0.4');
      ySlider.setAttribute('position', '-0.4 0 -0.4');
      zSlider.setAttribute('position', '-0.4 -0.4 0');
    }

    xSlider.setAttribute('grab-axisslider-listener', '');
    ySlider.setAttribute('grab-axisslider-listener', '');
    zSlider.setAttribute('grab-axisslider-listener', '');

    xSlider.setAttribute('axis', "x");
    ySlider.setAttribute('axis', "y");
    zSlider.setAttribute('axis', "z");

    xSlider.setAttribute('class', 'axis-slider');
    ySlider.setAttribute('class', 'axis-slider');
    zSlider.setAttribute('class', 'axis-slider');

    pEl.appendChild(xSlider);
    pEl.appendChild(ySlider);
    pEl.appendChild(zSlider);
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

  colorChanged: function(event) {
    var el = event.currentTarget.el;
    var pEl = el.parentEl;
    var mat = el.getAttribute('material');

    mat.color = event.target.value;

    el.setAttribute('material', mat);

    // Send changes to server
    var type = event.type;
    if(type == 'change') {
      var obj = new Object();
      var cid = pEl.getAttribute('cid');
      obj.cid = cid; 
      obj.updatetype = 'material';
      obj.updatedata = mat;
      var newData = JSON.stringify(obj);
      easyrtc.sendDataWS(clientRtcId, "updateComponent", newData);
    }
  },

  nameChanged: function(event) {
    var pEl = event.currentTarget.el;
    var name = event.target.value;

    // Update local data 
    pEl.setAttribute('entityName', name);

    // Send changes to server
    var obj = new Object();
    var cid = pEl.getAttribute('cid');
    obj.cid = cid; 
    obj.updatetype = 'name';
    obj.updatedata = name;
    var newData = JSON.stringify(obj);
    easyrtc.sendDataWS(clientRtcId, "updateComponent", newData);
  },

  positionChanged: function(event) {
    var pEl = event.currentTarget.el;
    var pos = pEl.getAttribute('position');
    var value = event.target.value;

    // Get the correct  x-/y- or z-coord and update it
    var name = event.target.name;
    var coord = name.substr(0, 1);
    pos[coord] = value; 

    // Update local data 
    pEl.setAttribute('position', pos);

    // Send changes to server
    var obj = new Object();
    var cid = pEl.getAttribute('cid');
    obj.cid = cid; 
    obj.updatetype = 'position';
    obj.updatedata = pos;
    var newData = JSON.stringify(obj);
    easyrtc.sendDataWS(clientRtcId, "updateComponent", newData);
  },

  interactionPropertyChanged: function(event) {
    var pEl = event.currentTarget.el;
    var eventTarget = event.target;
    var property = eventTarget.id;
    var value = eventTarget.value; 

    // Fill data object
    var newObj = new Object();
    newObj.cid = pEl.getAttribute('cid');
    newObj.updatetype = 'interaction';
    newObj.attribute = property;
    newObj.value = value;
    
    // Send changes to server
    var updateData = JSON.stringify(newObj);
    easyrtc.sendDataWS(clientRtcId, "updateComponent", updateData);
  },

  interactionChanged: function(event) {
    var eventTarget = event.target;
    console.log("event:");
    console.log(eventTarget);
    var pEl = eventTarget.parentElement.parentElement.el;
    var name = eventTarget.name;
    var value = eventTarget.value;

    
    // Add updated data to data object
    var newObj = new Object();
    var cid = pEl.getAttribute('cid');
    console.log(cid);
    newObj.cid = cid; 
    newObj.updatetype = 'interaction';
    newObj.attribute = name;
    newObj.value = value;

    // Send changes to server
    var updateData = JSON.stringify(newObj);
    easyrtc.sendDataWS(clientRtcId, "updateComponent", updateData);
  },

  interactableChanged: function(event) {
    var pEl = event.currentTarget.el;
    var eventTarget = event.target;
    var property = eventTarget.id;
    var value = eventTarget.value; 

    // Fill data object
    var newObj = new Object();
    var updateData = new Object();
    newObj.cid = pEl.getAttribute('cid');
    newObj.updatetype = 'interactable';
    updateData.property = property;
    updateData.value = value;
    newObj.updatedata = updateData;
    
    // Send changes to server
    var updateData = JSON.stringify(newObj);
    easyrtc.sendDataWS(clientRtcId, "updateComponent", updateData);
  },

  addPropertiesRow: function(pPanel, classType, data) {

    if(classType == "no-selection") {
      pPanel.innerHTML = '';
      var div = document.createElement('div');

      div.className = 'properties-no-selection';
      div.innerHTML = `
        <span style="color: white">Nothing is selected</span>
      `;
      pPanel.appendChild(div);

    }else if(classType == 'entity') {
      // ###### ENTITY ######
      var pEl = data;
      var el = pEl.children[0];
      var div = document.createElement('div');

      // Object Name
      var name = pEl.getAttribute('entityName');
      div.className = 'property-row';
      div.innerHTML = `
        <span class="property-row-element">
          <b>Name</b>
        </span>
        <div class="property-row-element-name">
          <input class="property-row-big-input" type="text" name="name" value="${name}"/>
        </div>
      `;

      div.el = pEl;
      div.addEventListener("change", this.nameChanged, false);

      pPanel.appendChild(div);

      // Position
      var position = pEl.getAttribute('position');
      div = document.createElement('div');
      div.className = 'property-row';
      div.innerHTML = `
          <span class="property-row-element">
            <b>Position</b>
          </span>
        `;
      for(const coord of ['X', 'Y', 'Z']) {
        div.innerHTML += `
          <div class="property-row-element">
            <span class="properties-parameter-name">
              <b>${coord}</b>
            </span>
            <input type="number" name="${coord.toLowerCase()}Position" value="${position[coord.toLowerCase()]}"/>
          </div>
        `;
      };

      div.el = pEl;
      div.addEventListener("change", this.positionChanged, false);
      pPanel.appendChild(div);

      // TODO: add switch/case for 'shape'
      var material = pEl.children[0].getAttribute('material');
      if(material != null) {
        var shape = material.shape;
        
        if(shape != null) {
          switch(shape) {

            case 'sphere':
              break;
  
            default:
              break;
          }
        }
      }

      // Rotation
      var rotation = pEl.getAttribute('rotation');
      div = document.createElement('div');
      div.className = 'property-row';
      div.innerHTML = `
          <span class="property-row-element">
            <b>Rotation</b>
          </span>
        `;
      for(const coord of ['X', 'Y', 'Z']) {
        div.innerHTML += `
          <div class="property-row-element">
            <span class="properties-parameter-name">
              <b>${coord}</b>
            </span>
            <input type="number" name="${coord.toLowerCase()}Rotation" value="${rotation[coord.toLowerCase()]}"/>
          </div>
        `;
      };

      div.el = pEl;
      div.addEventListener("change", this.positionChanged, false);
      pPanel.appendChild(div);

      // Scale
      var scale = pEl.getAttribute('scale');
      div = document.createElement('div');
      div.className = 'property-row';
      div.innerHTML = `
          <span class="property-row-element">
            <b>Scale</b>
          </span>
        `;
      for(const coord of ['X', 'Y', 'Z']) {
        div.innerHTML += `
          <div class="property-row-element">
            <span class="properties-parameter-name">
              <b>${coord}</b>
            </span>
            <input type="number" name="${coord.toLowerCase()}Scale" value="${scale[coord.toLowerCase()]}"/>
          </div>
        `;
      };

      div.el = pEl;
      div.addEventListener("change", this.positionChanged, false);
      pPanel.appendChild(div);

      // Material
      var material = el.getAttribute('material');
      var color = material.color;
      div = document.createElement('div');
      div.className = 'property-row';
      div.innerHTML = `
        <span class="property-row-element">
          <b>Color</b>
        </span>
        <div class="property-row-element-name">
          <input class="property-row-big-input" type="color" name="color" value="${color}"/>
        </div>
      `;

      div.el = pEl;
      div.addEventListener("input", this.colorChanged, false);
      div.addEventListener("change", this.colorChanged, false);

      pPanel.appendChild(div);

      // Interactable
      var interactable = el.interactable;
      var type = interactable.type;
      div = document.createElement('div');
      div.className = 'property-row';

      var typeOptions = [['none', 'Static'], ['grabbable', 'Grabbable'], ['rotatable', 'Rotatable']];
      var typeOptionsText = ``;

      for(var i=0; i<typeOptions.length; i++) {
        var typeOpt = typeOptions[i];
        if(typeOpt[0] == type) {
          typeOptionsText += `
            <option selected="selected" value="${typeOpt[0]}">${typeOpt[1]}</option>
          `;
        }else{
          typeOptionsText += `
            <option value="${typeOpt[0]}">${typeOpt[1]}</option>
          `;
        }
      }
      div.innerHTML = `
        <span class="property-row-element">
          <b>Interactable</b>
        </span>
        <div class="property-row-element">
          <span class="properties-parameter-name">
            <b>Type</b>
          </span>
          <select id="type">
            ${typeOptionsText}
          </select>
        </div>
      `;

      switch(type) {
        case 'none':
        case 'grabbable':
          div.innerHTML += `
            <div class="property-row-element-fill2">
              <span class="properties-parameter-name">
              </span>
            </div>
          `;
          break;

        case 'rotatable':
          var offset = interactable.offset;
          var axisOptions = ['X', 'Y', 'Z'];
          var axisOptionsText = ``;

          for(var i=0; i<axisOptions.length; i++) {
            var axOpt = axisOptions[i];
            if(axOpt == interactable.axis) {
              axisOptionsText += `
                <option selected="selected" value="${axOpt}">${axOpt}</option>
              `;
            }else{
              axisOptionsText += `
                <option value="${axOpt}">${axOpt}</option>
              `;
            }
          }

          div.innerHTML += `
            <div class="property-row-element">
              <span class="properties-parameter-name">
                <b>Rotation Axis</b>
              </span>
              <select id="axis">
                ${axisOptionsText}
              </select>
            </div>
            <div class="property-row-element">
              <span class="properties-parameter-name">
                <b>Offset</b>
              </span>
              <input type="number" id="offset" value="${offset}"/>
            </div>
          `;
          break;

        default:
          console.log('Skipping unknown interactable type "' + type + '"...');
          break;
      }

      
      div.el = pEl;
      div.addEventListener("change", this.interactableChanged, false);

      pPanel.appendChild(div);

    }else if(classType == 'interaction') {
      // ###### INTERACTION ######
      var pEl = data;
      var el = pEl.children[0];
      var div = document.createElement('div');

      // Object Name
      var name = pEl.getAttribute('entityName');
      div.className = 'property-row';
      div.innerHTML = `
        <span class="property-row-element">
          <b>Name</b>
        </span>
        <div class="property-row-element-name">
          <input class="property-row-big-input" type="text" name="name" value="${name}"/>
        </div>
      `;

      div.el = pEl;
      div.addEventListener("change", this.nameChanged, false);

      pPanel.appendChild(div);

      // Position
      var position = pEl.getAttribute('position');
      div = document.createElement('div');
      div.className = 'property-row';
      div.innerHTML = `
          <span class="property-row-element">
            <b>Position</b>
          </span>
        `;
      for(const coord of ['X', 'Y', 'Z']) {
        div.innerHTML += `
          <div class="property-row-element">
            <span class="properties-parameter-name">
              <b>${coord}</b>
            </span>
            <input type="number" name="${coord.toLowerCase()}Position" value="${position[coord.toLowerCase()]}"/>
          </div>
        `;
      };

      console.log("div.el:");
      console.log(pEl);
      div.el = pEl;
      div.addEventListener("change", this.positionChanged, false);
      pPanel.appendChild(div);

      // Interaction DIVs
      var data = pEl.data;

      var target = data.target;
      var action = data.action;
      var attribute = data.attribute;
      var toshape = data.toshape;
      var toheight = data.toheight;
      var toradius = data.toradius; 

      div = document.createElement('div');
      var appendDiv = document.createElement('div');

      div.className = 'property-row';

      // Append actual property rows
      var actionOptions = [['none', 'Keep current'], ['grabbable', 'Grabbable'], ['modify', 'Modify'], ['remove', 'Remove'], ['rotation', 'Rotation']];
      var actionOptionsText = ``;

      for(var i=0; i<actionOptions.length; i++) {
        var act = actionOptions[i];

        if(act[0] == action) {
          actionOptionsText += `
            <option selected="selected" value="${act[0]}">${act[1]}</option>
          `;
        }else{
          actionOptionsText += `
            <option value="${act[0]}">${act[1]}</option>
          `;
        }
      }

      div.innerHTML += `
        <span class="property-row-element">
          <b>Interaction</b>
        </span>
        <div class="property-row-element">
          <span class="properties-parameter-name">
            <b>Target</b>
          </span>
          <input type="text" name="target" list="cids" value="${target}"/>
        </div>
        <div class="property-row-element">
          <span class="properties-parameter-name">
            <b>Action</b>
          </span>
          <select name="action">
            ${actionOptionsText}
          </select>
        </div>
        `;

        div.el = pEl;

        // Different actions require different property rows
        if(action == 'modify') {
          // Check for attribute
          var attrOptions = [['none', 'Keep current'], ['geometry', 'Geometry'], ['material', 'Material'], ['position', 'Position'], ['scale', 'Scale']];
          var attrOptionsText = ``;

          for(var i=0; i<attrOptions.length; i++) {
            var attr = attrOptions[i];

            if(attr[0] == attribute) {
              attrOptionsText += `
                <option selected="selected" value="${attr[0]}">${attr[1]}</option>
              `;
            }else{
              attrOptionsText += `
                <option value="${attr[0]}">${attr[1]}</option>
              `;
            }
          }

          div.innerHTML += `
            <div class="property-row-element">
              <span class="properties-parameter-name">
                <b>Attribute</b>
              </span>
              <select name="attribute">
                ${attrOptionsText}
              </select>
            </div>
          `;

          appendDiv.className = 'property-row-append';

          switch(attribute) {
            case 'material':
              break;
    
            case 'position':
              break;
    
            case 'scale':
              break;
    
            case 'geometry':
              // Geometry
              var shapeOptions = [['none', 'Keep current'], ['box', 'Box'], ['cylinder', 'Cylinder'], ['plane', 'Plane'], ['sphere', 'Sphere']];
              var shapeOptionsText = ``;

              for(var i=0; i<shapeOptions.length; i++) {
                var sha = shapeOptions[i];

                if(sha[0] == toshape) {
                  shapeOptionsText += `
                    <option selected="selected" value="${sha[0]}">${sha[1]}</option>
                  `;
                }else{
                  shapeOptionsText += `
                    <option value="${sha[0]}">${sha[1]}</option>
                  `;
                }
              }
              appendDiv.innerHTML = `
                <span class="property-row-element">
                </span>
                <div class="property-row-element">
                  <span class="properties-parameter-name">
                    <b>To Shape</b>
                  </span>
                  <select id="toshape">
                    ${shapeOptionsText}
                  </select>
                </div>
                <div class="property-row-element">
                  <span class="properties-parameter-name">
                    <b>To Height</b>
                  </span>
                  <input type="number" id="toheight" value="${toheight}"/>
                </div>
                <div class="property-row-element">
                  <span class="properties-parameter-name">
                    <b>To Radius</b>
                  </span>
                  <input type="number" id="toradius" value="${toradius}"/>
                </div>
              `;
    
              var controller = document.querySelector('[object-control-desktop]').components['object-control-desktop'];
              appendDiv.addEventListener("change", controller.interactionPropertyChanged, false);
              appendDiv.el = pEl;
              break;
    
            default:
              break;
          }

        }else if(action == 'remove'){

        }else if(action == 'none'){
          div.innerHTML += `
            <div class="property-row-element">
            </div>
            `;
        }else{
          // No modify-action
          console.log("Action '" + action + "' not defined.");
        }

        div.el = pEl;
        div.addEventListener("change", this.interactionChanged, false);
  
        pPanel.appendChild(div);
        pPanel.appendChild(appendDiv);

    }else if(classType == 'tasksOccupied') {  
      pPanel.innerHTML = '';

      var div = document.createElement('div');
      console.log('tasksOccupied!');

      div.className = 'properties-no-selection';
      div.innerHTML = `
        <span style="color: red">Someone else is currently editing the Taskboard!</span>
      `;
      pPanel.appendChild(div);
      
    }else if(classType == 'task') {   
      if(tasks.length > 0) {
        for(var i = 0; i < tasks.length; i++) {
          var task = tasks[i];

          // Add task to properties view
          div = document.createElement('div');
          div.className = 'property-row';
          div.id = "task" + i;
          div.innerHTML = `
            <span class="property-row-element">
              <b>Task ${i+1}:</b>
            </span>
          `;
      
          var eventOptions = [['none', 'None']];

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
                  var angle = task.eventAngle;
                  var eventOption = [cid, name, type, angle];
                  eventOptions.push(eventOption);
                  break;

                case 'none':
                case 'grabbable':
                  break;
              }
            }
          }

          var eventOptionsText = ``;
          var selected = 'none';

          for(var k=0; k < eventOptions.length; k++) {
            var evtOption = eventOptions[k];

            if(evtOption[0] == task.triggerEvent) {
              selected = evtOption;
              eventOptionsText += `
                <option selected="selected" value="${evtOption[0]}">${evtOption[1]}</option>
              `;
            }else{
              eventOptionsText += `
                <option value="${evtOption[0]}">${evtOption[1]}</option>
              `;
            }
          }

          div.innerHTML += `
            <div class="property-row-element">
              <span class="properties-parameter-name">
                <b>Trigger Event</b>
              </span>
              <select class="triggerEvent">
                ${eventOptionsText}
              </select>
            </div>
          `;

          // Switch through interaction type
          switch(selected[2]) {
            case 'rotatable':
              div.innerHTML += `
                <div class="property-row-element">
                  <span class="properties-parameter-name">
                    <b>Target Angle</b>
                  </span>
                  <input type="number" class="eventAngle" name="eventAngle" value="${selected[3]}"/>
                </div>
              `;
              break;

            case 'eventArea':
            case 'none':
            default:
                break;
          }

          // TODO add correct event listener
          div.addEventListener("change", this.taskChanged, false);
          pPanel.appendChild(div);
        }
      }

      // Show button 'send addTask() to server'
      div = document.createElement('div');
      div.className = 'property-row';
      div.innerHTML += `
        <div class="property-row-element">
          <button type="button" onclick="addTaskButton()">Add Task</button>
        </div>
      `;
      pPanel.appendChild(div);
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

  selectEntity: function(componentId, sourceRtcId, selectBool) {
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
      
      var pPanel = window.parent.document.getElementById('properties-panel');
      var objectType = pEl.getAttribute('class');

      // Decide whether to select or deselect the object
      if(sourceRtcId == clientRtcId) {
        // Client's own EasyRTCid
        if(selectBool) {
          // Select object
          // Create AxesHelper
          this.createAxes(pEl);

          // Update properties view
          while (pPanel.firstChild) {
            // Remove all children
            pPanel.removeChild(pPanel.firstChild);
          }

          this.addPropertiesRow(pPanel, objectType, pEl);

        }else{
          // Deselect object
          this.removeAxes(pEl);

          // Remove object from properties panel
          while (pPanel.firstChild) {
            // Remove all children
            pPanel.removeChild(pPanel.firstChild);
          }

          // Set properties panel to 'no selection'
          this.addPropertiesRow(pPanel, 'no-selection', null);
        }
      }else{

        // Other clients EasyRTCid
        if(selectBool) {
          // Make selected object transparent 
          var mat = el.getAttribute('material');
          if(objectType == 'interaction') {
            mat.opacity = 0.1;
          }else{
            mat.opacity = 0.4;
          }
          el.setAttribute('material', mat);
        }else {
          // Make deselected object fully visible
          var mat = el.getAttribute('material');
          if(objectType == 'interaction') {
            mat.opacity = 0.4;
          }else{
            mat.opacity = 1.0;
          }
          el.setAttribute('material', mat);
        }
      }

      // DESKTOP - Further A-FRAME actions
      if(selectBool) {
        // Make selected object untargetable
        var selectable = el.getAttribute('selectable');
        selectable.targetable = false;
        el.setAttribute('selectable', selectable);

        // Set easyRtcId of source
        el.setAttribute('selectedby', sourceRtcId);
      }else {
        // Make selected object targetable again
        var selectable = el.getAttribute('selectable');
        selectable.targetable = true;
        el.setAttribute('selectable', selectable);

        // Remove easyRtcId of source
        el.removeAttribute('selectedby');
      }
  },

  removeComponent: function(componentId) {

      // Remove row from table
      var tr = parent.document.getElementById("cid" + componentId);
      tr.parentNode.removeChild(tr);

      // Remove entity from scene
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

      pEl.parentNode.removeChild(pEl);
  },

  updateComponent: function(componentId, type, data) {
    console.log("updateComponent");
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

    // Update property rows if element is currently selected by client
    if(data.sourceRtcId == clientRtcId) {
      this.selectEntity(componentId, clientRtcId, true);
    }

    // Update taskboard & properties-view
    this.updateTaskboard();

    if(tasksSelectedBy == clientRtcId) {
      this.selectTasks('update');
    }
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

    // Update property rows if element is currently selected by client
    if(sourceRtcId == clientRtcId) {
      this.selectEntity(componentId, clientRtcId, true);
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

  removeInteraction: function(componentId) {
    console.log("removeInteraction");
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

    // TODO: Remove interaction from target component, if existent
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
      pEl.setAttribute('entityName', name);

      pEl.data = data;

      // Create actual element & handle attributes
      var el = document.createElement('a-entity');
      el.setAttribute('geometry', interaction.geometry);
      el.setAttribute('material', interaction.material);
      el.setAttribute('scale', scale);

      // Check for selection
      var selectedById = interaction.selectedBy;
      if(selectedById != -1) {
        // Make selected object transparent and untargetable
        var mat = el.getDOMAttribute('material');
        mat.opacity = 0.1;
        el.setAttribute('material', mat);

        // Set as untargetable for raycaster
        el.removeAttribute('selectable');

        // Set easyRtcId of source
        el.setAttribute('selectedby', selectedById);
      }else{
        // Set as targetable for raycaster & add select handler
        el.setAttribute('selectable', '');
      }

      var scene = this.el.sceneEl;
      pEl.appendChild(el);
      scene.appendChild(pEl);

      // Add object to list 'Scene Objects'
      var table = parent.document.getElementById('scene-objects');
      var tr = table.insertRow();
      tr.setAttribute("id", "cid" + cid);

      var cidCell = tr.insertCell();
      cidCell.appendChild(document.createTextNode(cid));
      var elementNameCell = tr.insertCell();
      elementNameCell.appendChild(document.createTextNode(name));
      var buttonCell = tr.insertCell();
      var button = document.createElement('button');
      button.innerText = "X";
      button.onclick = function()
      {
        var obj = new Object();
        obj.cid = cid; 
        var newData = JSON.stringify(obj);
        easyrtc.sendDataWS(clientRtcId, "removeComponent", newData);
      }
      buttonCell.appendChild(button);
    }
  }
});

