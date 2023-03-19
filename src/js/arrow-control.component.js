/* global AFRAME, THREE */
AFRAME.registerComponent('arrow-control', {
  schema: {
    distance: {default: 1.0},
  },

  init: function() {
    this.onKeyDown = this.onKeyDown.bind(this);
    document.addEventListener("keydown", this.onKeyDown);
    
    var worldPos = new THREE.Vector3();

    this.el.object3D.getWorldPosition(worldPos);
    worldPos.multiplyScalar(-1);

    this.worldPos = worldPos;
  },

  onKeyDown: function(e) {
    var bool = true;  
    if(bool) {
      var el = this.el;

      var currentPosition = el.getAttribute('position');
      var newPosition = currentPosition.clone();

      if (e.keyCode === 37) {
        /* Arrow left */
        newPosition.add(new THREE.Vector3( 1, 0, 0 ));

      }else if (e.keyCode === 38) {
        /* Arrow up */
        newPosition.add(new THREE.Vector3( 0, 0, 1 ));

      }else if (e.keyCode === 39) {
        /* Arrow right */
        newPosition.add(new THREE.Vector3( -1, 0, 0 ));

      }else if (e.keyCode === 40) {
        /* Arrow down */
        newPosition.add(new THREE.Vector3( 0, 0, -1 ));
      }
      
      el.setAttribute('position', newPosition);
    }
  }
});