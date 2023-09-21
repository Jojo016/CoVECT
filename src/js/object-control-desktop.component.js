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
    var shape = data.shape;
    var scale = data.scale;
    var pos3 = new THREE.Vector3(data.posX, data.posY, data.posZ);

    // Create container element
    var pEl = document.createElement('a-entity');
    pEl.setAttribute('cid', cid);
    pEl.setAttribute('position', pos3);
    pEl.setAttribute('scale', scale);

    // Create actual element
    var el = document.createElement('a-entity');

    // Handle geometry/shape attribute
    if(shape == 'sphere') {
      el.setAttribute('geometry', 'primitive: sphere; segmentsWidth: 16; segmentsHeight: 16');
    }else if(shape == 'plane') {
      el.setAttribute('geometry', 'primitive: plane;');
      el.setAttribute('rotation', {x: -90, y: 0, z: 0});
    }else{
      el.setAttribute('geometry', 'primitive: ' + shape + ';');
    }

    // Handle other attributes
    el.setAttribute('material', 'color: #00FFFF');

    el.setAttribute('entityName', 'New ' + shape);

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
    elementNameCell.appendChild(document.createTextNode(shape));
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

    xSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.15; height: 4; segmentsRadial: 4');
    ySlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.15; height: 4; segmentsRadial: 4');
    zSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.15; height: 4; segmentsRadial: 4');
    
    xSlider.setAttribute('rotation', '0 0 -90');
    zSlider.setAttribute('rotation', '90 0 0');
    
    var el = pEl.children[0];

    if(el.getAttribute('geometry').primitive == 'box') {
      xSlider.setAttribute('position', '1.5 -0.5 -0.5');
      ySlider.setAttribute('position', '-0.5 1.5 -0.5');
      zSlider.setAttribute('position', '-0.5 -0.5 1.5');
    }else{
      xSlider.setAttribute('position', '1 -1 -1');
      ySlider.setAttribute('position', '-1 1 -1');
      zSlider.setAttribute('position', '-1 -1 1');
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

  addPropertiesRow: function(pPanel, action, data) {

    if(action == "properties-no-selection") {
      var div = document.createElement('div');

      div.className = 'properties-no-selection';
      div.innerHTML = `
        <span>Nothing is selected</span>
      `;
      pPanel.appendChild(div);

    }else if(action == 'select-aframe-entity') {
      var pEl = data;
      var el = pEl.children[0];
      var div = document.createElement('div');

      // Object Name
      var name = el.getAttribute('entityName');
      div.className = 'property-row';
      div.innerHTML = `
        <span class="property-row-element">
          <b>Name</b>
        </span>
        <div class="property-row-element-name">
          <input class="property-row-big-input" type="text" name="name" value="${name}"/>
        </div>
      `;

      div.el = el;
      // TODO: Add Name Change Event Listener + Function
      //div.addEventListener("change", this.nameChanged, false);

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
      for(const coord of ['x', 'y', 'z']) {
        div.innerHTML += `
          <div class="property-row-element">
            <span class="properties-parameter-name">
              ${coord}:
            </span>
            <input type="number" name="${coord}Position" value="${position[coord]}"/>
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
        <div class="property-row-element">
          <input type="color" name="color" value="${color}"/>
        </div>
      `;

      div.el = el;
      div.addEventListener("input", this.colorChanged, false);
      div.addEventListener("change", this.colorChanged, false);

      pPanel.appendChild(div);
    }

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
      
      // Decide whether to select or deselect the object
      var pPanel = window.parent.document.getElementById('properties-panel');

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

          this.addPropertiesRow(pPanel, 'select-aframe-entity', pEl);

        }else{
          // Deselect object
          while (pPanel.firstChild) {
            // Remove all children
            pPanel.removeChild(pPanel.firstChild);
          }

          // Set properties panel to 'no selection'
          this.addPropertiesRow(pPanel, 'properties-no-selection', null);

          // Remove AxesHelper
          this.removeAxes(pEl);
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
          var mat = el.getAttribute('material');
          mat.opacity = 1.0;
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
    }else{
      // All other types should be changed for el itself
      el.setAttribute(type, data);
    }
  }
});

