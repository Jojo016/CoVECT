// Init tasks
var tasks = [];
var tasksSelectedBy = null;

var eventOptions = [['none', 'None', 'none']];

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
    var material = data.material;
    var scale = data.scale;
    var rotation = data.rotation;
    var height = data.height;
    var radius = data.radius;
    var pos3 = data.position;
    var interactable = data.interactable;
    var wireframed = data.wireframed;

    // Create container element
    var pEl = document.createElement('a-entity');
    pEl.setAttribute('id', 'cid' + cid);
    pEl.setAttribute('cid', cid);
    pEl.setAttribute('position', pos3);
    pEl.setAttribute('class', 'entity');
    pEl.setAttribute('scale', '0.2 0.2 0.2');
    pEl.setAttribute('entityName', name);

    // Create actual element
    var el = document.createElement('a-entity');
    var selectable = new Object();
    selectable.targetable = true;
    el.setAttribute('selectable', selectable);
    el.setAttribute('class', 'clickable');
    el.setAttribute('scale', scale);
    el.setAttribute('wireframed', String(wireframed));
    pEl.appendChild(el);

    // Handle wireframe
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
      console.log("rotation");
      console.log(rotation);
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
      el.setAttribute('rotation', rotation);
      
    }else if(shape == 'table') {
      el.setAttribute('obj-model', 'obj: #coffeetable-obj; mtl: coffeetable-mtl');
      el.setAttribute('rotation', rotation);
      
    }else if(shape == 'griller-top') {
      this.createGrillerTop(el);
      el.setAttribute('position', '0 0 0');
      el.setAttribute('rotation', '-36 -24 0');
      el.setAttribute('scale', '1.5 1.5 1.5');

      elWireframe.setAttribute('geometry', 'primitive: box');
      elWireframe.setAttribute('rotation', rotation);

    }else if(shape == 'cheese') {
      el.setAttribute('geometry', 'primitive: plane;');
      el.setAttribute('rotation', rotation);
      el.setAttribute('material', 'src: #cheese; transparent: true;');

    }else if(shape == 'tomatoes') {
      el.setAttribute('geometry', 'primitive: plane;');
      el.setAttribute('rotation', rotation);
      el.setAttribute('material', 'src: #tomato; transparent: true;');

    }else if(shape == 'toast') {
      el.setAttribute('obj-model', 'obj: #bread-obj; mtl: #bread-mtl');
      el.setAttribute('rotation', rotation);
      el.setAttribute('material', 'src: #bread-slice;');

    }else{
      // TODO: Add method for specific models
      el.setAttribute('rotation', rotation);
      elWireframe.setAttribute('geometry', 'primitive: box');
      elWireframe.setAttribute('rotation', rotation);
    }

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

      // Set easyRtcId of source
      el.setAttribute('selectedby', selectedById);
    }else{
      // Set as targetable for raycaster & add select handler
      el.removeAttribute('selectedby');
    }

    // Add object to list 'Scene Objects'
    var table = parent.document.getElementById('scene-objects');
    var tr = table.insertRow();
    tr.setAttribute("id", "cid" + cid);

    var cidCell = tr.insertCell();
    cidCell.appendChild(document.createTextNode(cid));
    cidCell.style.color = "white";
    var elementNameCell = tr.insertCell();
    elementNameCell.appendChild(document.createTextNode(name));
    elementNameCell.style.color = "white";
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

  createGrillerTop: function(el) {
    var hitbox = document.createElement('a-box');
    hitbox.setAttribute('scale', '0.83 0.23 0.92');
    hitbox.setAttribute('position', '0 0.1 0.05');
    hitbox.setAttribute('material', 'opacity: 0');
    hitbox.setAttribute('class', 'sub-clickable');
    el.appendChild(hitbox);

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
    surface.setAttribute('position', '0 -0.02 0');
    surface.setAttribute('rotation', '90 0 0');
    surface.setAttribute('material', 'src: #griller-texture; transparent: true');
    el.appendChild(surface);
  },

  markObject(evt) {
    var pEl = evt.currentTarget.el;
    var checked = evt.target.checked;

    // Send changes to server
    var obj = new Object();
    var cid = pEl.getAttribute('cid');
    obj.cid = cid; 
    obj.updatetype = 'wireframed';
    obj.updatedata = String(checked);
    var newData = JSON.stringify(obj);

    easyrtc.sendDataWS(clientRtcId, "updateComponent", newData);
  },

  onMouseMove: function(event){
      var mouse;

      document.addEventListener('click', event => {
        mouse.x = (event.clientX / this.el.scene.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / this.el.scene.innerHeight) * 2 +1;
      });
  },

  removeRotatable: function() {
    var axis = document.getElementById('rotatableAxis');

    if(axis != null) {
      var pEl = axis.parentEl;

      if(pEl != null) {
        pEl.removeChild(axis);
      }
    }
  },

  createRotatable: function(pEl) {
    if(pEl.getAttribute('class') != 'entity') {
      return;
    }

    var el = pEl.children[0];
    var interactable = el.interactable;
    this.removeRotatable();

    if(interactable.type != 'rotatable') {
      return;
    } 

    var axisContainer = document.createElement('a-entity');
    axisContainer.setAttribute('id', 'rotatableAxis');
    axisContainer.setAttribute('rotation', el.getAttribute('rotation'));

    var rotAxis = interactable.axis;
    var offset = interactable.offset;
    var axis = document.createElement('a-entity');
    axis.setAttribute('material', 'color: #fcba03');
    axis.setAttribute('geometry', 'primitive: cylinder; radius: 0.1; height: 3; segmentsRadial: 6');

    switch(rotAxis) {
      case 'X':
        axis.setAttribute('rotation', '0 0 -90');
        axis.setAttribute('position', '0 0 ' + offset);
        break;

      case 'Y':
        axis.setAttribute('rotation', '0 0 0');
        axis.setAttribute('position', offset + ' 0 0 ');
        break;

      case 'Z':
        axis.setAttribute('rotation', '90 0 0');
        axis.setAttribute('position', '0 ' + offset + ' 0');
        break;
    }

    axisContainer.appendChild(axis);
    pEl.appendChild(axisContainer);
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
    Array.from(pEl.children).forEach(child => {
      if(child.getAttribute('class') == 'axis-slider') {
        pEl.removeChild(child);
      }
    });
  },

  colorChanged: function(event) {
    var pEl = event.currentTarget.el;
    var el = pEl.children[0];
    var mat = el.getDOMAttribute('material');

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

    // Send changes to server
    var obj = new Object();
    var cid = pEl.getAttribute('cid');
    obj.cid = cid; 
    obj.updatetype = 'position';
    obj.updatedata = pos;
    var newData = JSON.stringify(obj);
    easyrtc.sendDataWS(clientRtcId, "updateComponent", newData);
  },

  rotationChanged: function(event) {
    var pEl = event.currentTarget.el;
    var el = pEl.children[0];
    var rot = el.getAttribute('rotation');
    var value = event.target.value;

    // Get the correct  x-/y- or z-coord and update it
    var name = event.target.name;
    var coord = name.substr(0, 1);
    rot[coord] = value; 

    // Send changes to server
    var obj = new Object();
    var cid = pEl.getAttribute('cid');
    obj.cid = cid; 
    obj.updatetype = 'rotation';
    obj.updatedata = rot;
    var newData = JSON.stringify(obj);
    easyrtc.sendDataWS(clientRtcId, "updateComponent", newData);
  },

  scaleChanged: function(event) {
    var pEl = event.currentTarget.el;
    var el = pEl.children[0];
    var scale = el.getAttribute('scale');
    var value = event.target.value;

    // Get the correct  x-/y- or z-coord and update it
    var name = event.target.name;
    var coord = name.substr(0, 1);
    scale[coord] = value; 

    // Send changes to server
    var obj = new Object();
    var cid = pEl.getAttribute('cid');
    obj.cid = cid; 
    obj.updatetype = 'scale';
    obj.updatedata = scale;
    var newData = JSON.stringify(obj);
    easyrtc.sendDataWS(clientRtcId, "updateComponent", newData);
  },

  updateEventOptions: function() {
    eventOptions = [['none', 'None', 'none']]

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
          case 'none':
            break;

          case 'rotatable':
          case 'grabbable':
            var eventOption = [cid, name, type];
            eventOptions.push(eventOption);
            break;
        }
      }
    }
  },

  interactionPropertyChanged: function(event) {
    var pEl = event.currentTarget.el;
    var eventTarget = event.target;
    var attribute = eventTarget.id;
    var value = eventTarget.value; 

    // Fill data object
    var newObj = new Object();
    newObj.cid = pEl.getAttribute('cid');
    newObj.updatetype = 'interaction';
    newObj.attribute = attribute;
    newObj.value = value;
    
    // Send changes to server
    var updateData = JSON.stringify(newObj);
    easyrtc.sendDataWS(clientRtcId, "updateComponent", updateData);
  },

  interactionChanged: function(event) {
    var eventTarget = event.target;
    var pEl = eventTarget.parentElement.parentElement.el;
    var name = eventTarget.name;
    var value = eventTarget.value;

    // Add updated data to data object
    var newObj = new Object();
    var cid = pEl.getAttribute('cid');
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
    updateData.attribute = property;
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

      // Rotation
      var rotation = el.getAttribute('rotation');
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
      div.addEventListener("change", this.rotationChanged, false);
      pPanel.appendChild(div);

      // Scale
      var scale = el.getAttribute('scale');
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
      div.addEventListener("change", this.scaleChanged, false);
      pPanel.appendChild(div);

      // Material
      var material = el.getAttribute('material');

      if(material == null) {
        material = new Object();
        material.color = '#00ffff';
      }

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

      // Wireframe
      var geometry = pEl.children[0].getAttribute('geometry');
      var shape;

      if(geometry != null) {
        shape = geometry.primitive;
      }

      switch(shape) {
        case 'box':
        case 'cylinder':
        case 'plane':
        case 'sphere':
          div = document.createElement('div');
          div.className = 'property-row';

          var wireframed = el.getAttribute('wireframed');
          var checked = '';
          if(wireframed == 'true') {
            checked = 'checked';
          }
          
          div.className = 'property-row';
          div.innerHTML = `
            <span class="property-row-element">
              <b>Collaboration</b>
            </span>
            <div class="property-row-element">
              <input class="property-row-checkbox" type="checkbox" id="wireframe-property" ${checked} value="wireframe"/>
              <label for="wireframe-property">Highlight Element</label><br>
            </div>
            <div class="property-row-element">
            </div>
            <div class="property-row-element">
            </div>
          `;

          div.el = pEl;
          div.addEventListener("change", this.markObject, false);

          pPanel.appendChild(div);
          break;
      }
      
    }else if(classType == 'interaction') {
      // INTERACTION
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

      // Interaction DIVs
      var interaction = pEl.interaction;
      var interactionData = interaction.data;

      var target = interactionData.target;
      var action = interactionData.action;
      var reactionShape = interactionData.reactionShape;
      var reactionLayer = interactionData.reactionLayer;

      div = document.createElement('div');
      div.className = 'property-row';

      // Get target options
      var targetOptions = [['none', 'None']];
      var pEls = document.getElementsByClassName('entity');
      for(var i = 0; i < pEls.length; i++) {
        var ent = pEls[i];
        if(ent.getAttribute('class') != 'entity') {
          continue;
        }

        var el = ent.children[0];
        if(el.interactable.type != 'grabbable') {
          continue;
        }
        
        var compId = ent.getAttribute('id');
        var entName = ent.getAttribute('entityName');
        targetOptions.push([compId, entName]);
      }

      // Append target property rows
      var targetOptionsText = ``;
      for(var i=0; i < targetOptions.length; i++) {
        var tar = targetOptions[i];
        if(tar[0] == target) {
          targetOptionsText += `
            <option selected="selected" value="${tar[0]}">${tar[1]}</option>
          `;
        }else{
          targetOptionsText += `
            <option value="${tar[0]}">${tar[1]}</option>
          `;
        }
      }

      // Append action property rows
      var actionOptions = [['none', 'None'], ['addLayer', 'Add Layer'], ['changeTo', 'Change To']];
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
          <b>Event Area</b>
        </span>
        <div class="property-row-element">
          <span class="properties-parameter-name">
            <b>Target</b>
          </span>
          <select name="target">
            ${targetOptionsText}
          </select>
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
        if(action == 'changeTo') {
          // Check for reaction
          var attrOptions = [['none', 'None'], ['box', 'Box'], ['cylinder', 'Cylinder'], ['plane', 'Plane'], ['sphere', 'Sphere']];
          var attrOptionsText = ``;

          for(var i=0; i<attrOptions.length; i++) {
            var attr = attrOptions[i];

            if(attr[0] == reactionShape) {
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
                <b>Shape</b>
              </span>
              <select name="reactionShape">
                ${attrOptionsText}
              </select>
            </div>
          `;

        }else if(action == 'addLayer'){
          // Check for reaction
          var attrOptions = [['none', 'None'], ['cheese', 'Cheese'], ['tomato', 'Tomatoes']];
          var attrOptionsText = ``;

          for(var i=0; i<attrOptions.length; i++) {
            var attr = attrOptions[i];

            if(attr[0] == reactionLayer) {
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
                <b>Layer</b>
              </span>
              <select name="reactionLayer">
                ${attrOptionsText}
              </select>
            </div>
          `;

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
          var eventAngle = task.eventAngle;

          // Add task to properties view
          div = document.createElement('div');
          div.className = 'property-row';
          div.id = "task" + i;
          div.innerHTML = `
            <span class="property-row-element">
              <b>Task ${i+1}:</b>
            </span>
          `;
      
          this.updateEventOptions();

          var eventOptionsText = ``;
          var selected = 'none';

          for(var k=0; k < eventOptions.length; k++) {
            var evtOption = eventOptions[k];

            if(evtOption[2] != 'grabbable') {
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
                  <input type="number" class="eventAngle" name="eventAngle" value="${eventAngle}"/>
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
        <div class="property-row-element">
          <button type="button" onclick="addTaskButton()">Remove Task</button>
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

        if(pEl == null) {
          // Entity possibly deleted, skip
          atext.setAttribute('value', childrenCount + '. No event selected!');
          taskboard.appendChild(atext);
          continue;
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
          var interaction = pEl.interaction;
          var interactionData = interaction.data;
          var target = interactionData.target;
          var eventName = pEl.getAttribute('entityName');
          var targetName;
          
          for (var i = 0; i < eventOptions.length; i++) {
            var evtOption = eventOptions[i]
            var cidId = evtOption[0];

            if(evtOption[0] != 'none') {
              cidId = 'cid' + cidId;
            }

            if(cidId == target) {
              targetName = evtOption[1];
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
    this.updateEventOptions();

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
    tasks[taskId] = task;

    // UpdateEventOptions
    this.updateEventOptions();

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
    var pEl = document.getElementById('cid' + componentId);
    var el = pEl.children[0];
      
    var pPanel = window.parent.document.getElementById('properties-panel');
    var objectType = pEl.getAttribute('class');

    // Decide whether to select or deselect the object
    if(sourceRtcId == clientRtcId) {
      // Client's own EasyRTCid
      if(selectBool) {
        // Select object
        this.removeAxes(pEl);
        this.createAxes(pEl);
        this.createRotatable(pEl);

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
      // Set easyRtcId of source
      el.setAttribute('selectedby', sourceRtcId);
    }else {
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

  updateComponent: function(componentId, type, data, sourcertcid) {
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

    // Update event option
    this.updateEventOptions();

    // Update taskboard & properties-view
    this.updateTaskboard();

    if(tasksSelectedBy == clientRtcId) {
      this.selectTasks('update');
    }
  },

  updateInteractable: function(componentId, sourceRtcId, property, value) {
    console.log("updateInteractable");
    var pEl = document.getElementById('cid' + componentId);
    var el = pEl.children[0];

    el.interactable[property] = value;
    this.createRotatable(pEl);

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
    var interaction = pEl.interaction;

    switch(attribute) {
      case 'action':
      case 'target':
      case 'reactionLayer':
      case 'reactionShape':
        interaction.data[attribute] = value;
        break;
      
      default:
        interaction[attribute] = value;
        break;
    }

    // Update property rows if element is currently selected by client
    if(data.sourceRtcId == clientRtcId) {
      this.selectEntity(componentId, clientRtcId, true);
    }

    this.updateEventOptions();

    this.updateTaskboard();
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
      var name = interaction.name;
      var scale = interaction.scale;
      var pos3 = interaction.position;

      // Create container element
      var pEl = document.createElement('a-entity');
      pEl.setAttribute('class', 'interaction');
      pEl.setAttribute('id', 'cid' + cid);
      pEl.setAttribute('cid', cid);
      pEl.setAttribute('type', type);
      pEl.setAttribute('scale', '0.2 0.2 0.2');
      pEl.setAttribute('position', pos3);
      pEl.setAttribute('entityName', name);
      pEl.interaction = interaction;

      // Create actual element & handle attributes
      var el = document.createElement('a-entity');
      var selectable = new Object();
      selectable.targetable = true;
      el.setAttribute('selectable', selectable);
      el.setAttribute('class', 'clickable');
      el.setAttribute('scale', scale);
      el.setAttribute('geometry', interaction.geometry);
      el.setAttribute('material', interaction.material);

      // Check for selection
      var selectedById = interaction.selectedBy;
      if(selectedById != -1) {
        // Make selected object transparent and untargetable
        var mat = el.getAttribute('material');
        if(mat == null) {
          mat = new Object();
        }
        mat.opacity = 0.4;;
        el.setAttribute('material', mat);

        // Set easyRtcId of source
        el.setAttribute('selectedby', selectedById);
      }else{
        // Set as targetable for raycaster & add select handler
        el.removeAttribute('selectedby');
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
      cidCell.style.color = '#ffffff';
      var elementNameCell = tr.insertCell();
      elementNameCell.appendChild(document.createTextNode(name));
      elementNameCell.style.color = '#ffffff';
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

