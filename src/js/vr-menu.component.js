/* global AFRAME, NAF */
AFRAME.registerComponent('vr-menu', {
  schema: {
    targetable: {default: true}
  },

  init: function () {
    var data = this.data;
    var el = this.el; 

    // Get component id
    var className = el.getAttribute('class');   

    // Add click listener
    el.addEventListener('click', function() {
      var targetable = data.targetable;
      
      if(targetable) {
        // Get player position
        var player = document.getElementById('player');
        var pos3 = player.getAttribute('position');

        // Create data object to stringify// Create data object to stringify
        var obj = new Object();
        obj.shape = className;
        obj.posX = pos3.x;
        obj.posY = pos3.y;
        obj.posZ = pos3.z;
        var entityData = JSON.stringify(obj);

        console.log("Sending: 'Create new object with data:' " + data);
        easyrtc.sendDataWS(clientRtcId, "addNewObject", entityData);
      }else{
        console.log("Tried to select untargetable panel.");
      }
    });
  }
});