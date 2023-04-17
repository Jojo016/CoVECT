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

      el.setAttribute('class', 'cursor-listener');
      el.setAttribute('cursor-listener', '');
      console.log(el);

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


      // Direction: up
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
      //*

      /*
      // Decide whether to select or deselect the object
      if(bool) {
        // Select object
        el.setAttribute('material', 'color: red');

      }else{
        // Deselect object
        el.setAttribute('material', 'color: blue');
      }
      //*/
  },

  removeComponent: function(componentId) {

      // Remove row from table
      var tr = parent.document.getElementById("cid" + componentId);
      tr.parentNode.removeChild(tr);
w
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

