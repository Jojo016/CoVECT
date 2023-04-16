/* global AFRAME, NAF */
AFRAME.registerComponent('object-control-desktop', {
  schema: {
    template: { default: '' },
    keyCode: { default: 32 }
  },

  init: function() {
    // EasyRTC listener for object spawner
    var that = this;
    
    easyrtc.setServerListener( function(msgType, msgData, targeting) {

      console.log("Received server msg: " + msgType);

      if(msgType === 'spawnComponent') {
        var newData = JSON.parse(msgData);
        that.spawnEntity(newData);

      }else if(msgType === 'selectedComponent') {
        var data = JSON.parse(msgData);
        var cid = data.cid;
        var bool = data.bool;
        // @ToDo: add true/false
        that.selectEntity(cid, bool);
      }else if(msgType === 'removedComponent') {
        var data = JSON.parse(msgData);
        var cid = data.cid;
        that.removeComponent(cid);
      }
    });
    

    /*
    easyrtc.addEventListener("roomOccupant", (eventName, eventData) => {
    */
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
      el.setAttribute('material', 'color: blue');
      el.setAttribute('selectable', true)
      
      var cid = data.cid;
      el.setAttribute('cid', cid);

      var pos3 = new THREE.Vector3(data.posX, data.posY, data.posZ);

      el.setAttribute('position', pos3);
      var scene = this.el.sceneEl;
      scene.appendChild(el);

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
        // TODO: Get correct easyrtcid
        var easyrtcId = 0;
        var obj = new Object();
        obj.cid = cid; 
        var newData = JSON.stringify(obj);
        easyrtc.sendDataWS(easyrtcId, "removeComponent", newData);
      }
      buttonCell.appendChild(button);
  },

  selectEntity: function(componentId, bool) {

      var el = null;
      var els = this.el.sceneEl.querySelectorAll('[cid]');

      for (var i = 0; i < els.length; i++) {

        if(els[i].getAttribute('cid') == componentId) {
          el = els[i];
          break;
        }
      }

      // Decide whether to select or deselect the object
      if(bool) {
        // Select object
        el.setAttribute('material', 'color: red');

      }else{
        // Deselect object
        el.setAttribute('material', 'color: blue');
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
  }
});

