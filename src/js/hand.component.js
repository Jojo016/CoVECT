/* global AFRAME, THREE */
/*const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
function onPointerMove( event ) {

  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components

  pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function render() {
  console.log('render');
  // update the picking ray with the camera and pointer position

  var camera = document.querySelector('a-entity[camera]').components.perspectivecamera;
  raycaster.setFromCamera( pointer, camera );

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects( scene.children );

  for ( let i = 0; i < intersects.length; i ++ ) {

    intersects[ i ].object.material.color.set( 0xff0000 );

  }

  renderer.render( scene, camera );

}

window.addEventListener( 'pointermove', onPointerMove );

window.requestAnimationFrame(render);*/

AFRAME.registerComponent('hand', {
  schema: {
    blockTemplate: {default: '#block-template'},
    triggerKeyCode: {default: 32} // spacebar
  },

  init: function() {
    var that = this;
    document.body.onkeyup = function(e){
      if(e.keyCode == that.data.triggerKeyCode){
        that.placeBlock();
      }
    }
  },

  placeBlock: function() {
    this.createBlock();
  },

  createBlock: function() {
    var el = document.createElement('a-entity');
    el.setAttribute('networked', 'template:' + this.data.blockTemplate);
    el.setAttribute('networked', 'networkId:' + 200);
    //el.setAttribute('remove-in-seconds', 3);

    var tip = document.querySelector('#player');
    el.setAttribute('position', this.getInitialBlockPosition(tip));
    el.setAttribute('rotation', this.getInitialBlockRotation(tip));

    this.el.sceneEl.appendChild(el);
  },

  getInitialBlockPosition: function(spawnerEl) {
    var worldPos = new THREE.Vector3();
    let raycaster = new THREE.Raycaster();
    worldPos.setFromMatrixPosition(spawnerEl.object3D.matrixWorld);
    worldPos.setY(0.5);
    return worldPos;
  },

  getInitialBlockRotation: function(spawnerEl) {
    var worldDirection = new THREE.Vector3();

    spawnerEl.object3D.getWorldDirection(worldDirection);

    return worldDirection;
  }
});
