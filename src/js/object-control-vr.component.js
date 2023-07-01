﻿/* global AFRAME, NAF */
AFRAME.registerComponent('object-control-vr', {
  schema: {
    template: { default: '' },
    keyCode: { default: 32 }
  },

  init: function() {
  },

  spawnEntity: function(data) {
      var shape = data.shape;
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
      el.setAttribute('material', 'color: #0000FF');
      el.setAttribute('selectable', 'targetable: true');
      
      var cid = data.cid;
      el.setAttribute('cid', cid);

      var pos3 = new THREE.Vector3(data.posX, data.posY, data.posZ);
      el.setAttribute('position', pos3);

      el.setAttribute('entityName', 'New ' + shape);

      el.setAttribute('class', 'cursor-listener');
      el.setAttribute('cursor-listener', '');

      var scene = this.el.sceneEl;
      scene.appendChild(el);

      // Add object to list 'Scene Objects'
      // TODO: Add menu for this??
      /*
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
        // TODO: Get correct easyrtcid
        var easyrtcId = 0;
        var obj = new Object();
        obj.cid = cid; 
        var newData = JSON.stringify(obj);
        easyrtc.sendDataWS(easyrtcId, "removeComponent", newData);
      }
      buttonCell.appendChild(button);
      */
  },

  onMouseMove: function(event){


      var mouse;

      document.addEventListener('click', event => {
        mouse.x = (event.clientX / this.el.scene.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / this.el.scene.innerHeight) * 2 +1;
      });
  },

  createAxes: function(object) {

    var geometry = new THREE.CylinderGeometry( 0.05, 0.05, 2, 4 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    var x = new THREE.Mesh( geometry, material );
    var y = new THREE.Mesh( geometry, material );
    var z = new THREE.Mesh( geometry, material );

    x.rotateZ(1.5708);
    z.rotateX(1.5708);

    x.name = "xAxis";
    y.name = "yAxis";
    z.name = "zAxis";

    x.translateY(1);
    y.translateY(1);
    z.translateY(1);

    object.object3D.add(x);
    object.object3D.add(y);
    object.object3D.add(z);

    var clickMouse = new THREE.Vector2();

    if(false){
      var window = null;
      window.addEventListener('click', event => {
        clickMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        clickMouse.y = ( event.clientY / window.innerHeight ) * 2 + 1;

        //raycaster.setFromCamera(clickMouse, camera);
        //const found = raycaster.intersectObjects(scene.children);
      });
    }
  },

  colorChanged: function(event) {
    var el = event.currentTarget.el;
    var mat = el.getAttribute('material');

    mat.color = event.target.value;

    el.setAttribute('material', mat);

    // Send changes to server
    var type = event.type;
    if(type == 'change') {
      // TODO: Get correct easyrtcid
      var easyrtcId = 0;
      var obj = new Object();
      var cid = el.getAttribute('cid');
      obj.cid = cid; 
      obj.updatetype = 'material';
      obj.updatedata = mat;
      var newData = JSON.stringify(obj);
      easyrtc.sendDataWS(easyrtcId, "updateComponent", newData);
    }
  },

  positionChanged: function(event) {
    var el = event.currentTarget.el;
    var pos = el.getAttribute('position');
    var value = event.target.value;

    // Get the correct  x-/y- or z-coord and update it
    var name = event.target.name;
    var coord = name.substr(0, 1);
    pos[coord] = value; 

    // Update local data 
    el.setAttribute('position', pos);

    // Send changes to server
    // TODO: Get correct easyrtcid
    var easyrtcId = 0;
    var obj = new Object();
    var cid = el.getAttribute('cid');
    obj.cid = cid; 
    obj.updatetype = 'position';
    obj.updatedata = pos;
    var newData = JSON.stringify(obj);
    easyrtc.sendDataWS(easyrtcId, "updateComponent", newData);
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
      var el = data;
      var div = document.createElement('div');

      // Object Name
      var name = el.getAttribute('entityName');
      div.className = 'properties-category-content';
      div.innerHTML = `
        <span class="properties-category-name">
          <b>Name</b>
        </span>
        <div class="properties-parameter">
          <input type="text" name="name" value="${name}"/>
        </div>
      `;

      div.el = el;
      // TODO: Add Name Change Event Listener + Function
      //div.addEventListener("change", this.nameChanged, false);

      pPanel.appendChild(div);

      // Position
      var position = el.getAttribute('position');
      div = document.createElement('div');
      div.className = 'properties-category-content';
      div.innerHTML = `
          <span class="properties-category-name">
            <b>Position</b>
          </span>
        `;
      for(const coord of ['x', 'y', 'z']) {
        div.innerHTML += `
          <div class="properties-parameter">
            <span class="properties-parameter-name">
              ${coord}:
            </span>
            <input type="number" name="${coord}Position" value="${position[coord]}"/>
          </div>
        `;
      };

      div.el = el;
      div.addEventListener("change", this.positionChanged, false);
      pPanel.appendChild(div);

      // Material
      var material = el.getAttribute('material');
      var color = material.color;
      div = document.createElement('div');
      div.className = 'properties-category-content';
      div.innerHTML = `
        <span class="properties-category-name">
          <b>Color</b>
        </span>
        <div class="properties-parameter">
          <input type="color" name="color" value="${material.color}"/>
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
      var els = this.el.sceneEl.querySelectorAll('[cid]');

      for (var i = 0; i < els.length; i++) {

        if(els[i].getAttribute('cid') == componentId) {
          el = els[i];
          break;
        }
      }

      //this.createAxes(el);



      // Direction: up
      /*
      var dir = new THREE.Vector3( 0, 1, 0 );
      dir.normalize();
      var origin = new THREE.Vector3( 0, 0, 0 );
      var length = 3;
      var hex = 0x00ff00;

      var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );

      console.log(arrowHelper);

      //this.el.sceneEl.object3D.add( arrowHelper );

      el.object3D.add( arrowHelper );

      /*
      console.log(el);
      var axesHelper = new THREE.AxesHelper(5);
      el.setObject3D("axes-Helper", axesHelper);
      //*/

      
      //*
      // Decide whether to select or deselect the object
      var pPanel = window.parent.document.getElementById('properties-panel');

      if(sourceRtcId == clientRtcId) {
        // Client's own EasyRTCid
        if(selectBool) {
          // Select object
          var axesHelper = new THREE.AxesHelper(5);
          el.setObject3D("axes-helper", axesHelper);

          // Update properties view
          while (pPanel.firstChild) {
            // Remove all children
            pPanel.removeChild(pPanel.firstChild);
          }

          this.addPropertiesRow(pPanel, 'select-aframe-entity', el);

        }else{
          // Deselect object
          while (pPanel.firstChild) {
            // Remove all children
            pPanel.removeChild(pPanel.firstChild);
          }

          // Set properties panel to 'no selection'
          this.addPropertiesRow(pPanel, 'properties-no-selection', null);

          // Remove AxesHelper
          var axesHelper = el.getObject3D('axes-helper');
          el.removeObject3D('axes-helper');
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

      // Further A-FRAME actions
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
      var els = this.el.sceneEl.querySelectorAll('[cid]');

      for (var i = 0; i < els.length; i++) {

        if(els[i].getAttribute('cid') == componentId) {
          el = els[i];
          break;
        }
      }

      el.parentNode.removeChild(el);
  },

  updateComponent: function(componentId, type, data) {
    console.log("updateComponent");
    var el = null;
    var els = this.el.sceneEl.querySelectorAll('[cid]');

    for (var i = 0; i < els.length; i++) {

      if(els[i].getAttribute('cid') == componentId) {
        el = els[i];
        break;
      }
    }

    if(type == 'material') {
      console.log("material:");
      console.log(data);
    }

    el.setAttribute(type, data);
  }
});
