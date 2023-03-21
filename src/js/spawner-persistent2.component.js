/* global AFRAME, NAF */
AFRAME.registerComponent('spawner-persistent2', {
  schema: {
    template: { default: '' },
    keyCode: { default: 32 }
  },

  init: function() {
    // Key listener
    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener("keyup", this.onKeyUp);

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
      }
    });
    

    /*
    easyrtc.addEventListener("roomOccupant", (eventName, eventData) => {
    */
  },

  onKeyUp: function(e) {
    if (this.data.keyCode === e.keyCode) {
      // Easyrtcid '0' = for server???
      var easyrtcId = 0;  

      // Get id
      var id = this.data.template;

      // Get position
      var pos3 = this.el.getAttribute('position');

      // Get color
      // var color = ;

      // Create data object to stringify
      var obj = new Object();
      obj.id = id;
      obj.posX = pos3.x;
      obj.posY = pos3.y;
      obj.posZ = pos3.z;
      //obj.color = color; 

      var data = JSON.stringify(obj);

      console.log("Sending: 'Create new object with data:' " + data);
      easyrtc.sendDataWS(easyrtcId, "addNewObject", data);
    }
  },

  spawnEntity: function(data) {
      var el = document.createElement('a-entity');
      //el.setAttribute('networked', 'template:' + newData.id);

      el.setAttribute('geometry', 'primitive: sphere; segmentsWidth: 16; segmentsHeight: 16');
      el.setAttribute('material', 'color: blue');
      el.setAttribute('selectable', true)
      
      el.setAttribute('cid', data.cid);

      var pos3 = new THREE.Vector3(data.posX, data.posY, data.posZ);

      el.setAttribute('position', pos3);
      var scene = this.el.sceneEl;
      scene.appendChild(el);
  },

  selectEntity: function(componentId, bool) {

      var el = null;
      var els = this.el.sceneEl.querySelectorAll('[cid]');

      for (var i = 0; i < els.length; i++) {

        if(els[i].getAttribute('cid') === componentId) {
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
  }
});

