/* global AFRAME, NAF */
AFRAME.registerComponent('object-control-vr', {
  schema: {
    template: { default: '' },
    keyCode: { default: 32 }
  },

  init: function() {
  },

  spawnEntity: function(data) {
      var cid = data.cid;
      var shape = data.shape;
      var pos3 = new THREE.Vector3(data.posX, data.posY, data.posZ);

      // Create container element
      var pEl = document.createElement('a-entity');
      pEl.setAttribute('cid', cid);
      pEl.setAttribute('position', pos3);

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
      el.setAttribute('material', 'color: #0000FF');

      el.setAttribute('entityName', 'New ' + shape);

      // Handle raycaster attribute 
      el.setAttribute('raycaster-listen', '');

      // Check for selection
      var selectedById = data.selectedBy;
      if(selectedById != -1) {
        // Make selected object transparent and untargetable
        var mat = el.getDOMAttribute('material');
        mat.opacity = 0.4;
        el.setAttribute('material', mat);

        // Set as untargetable for raycaster
        el.setAttribute('class', 'selected-collidable');

        // Set easyRtcId of source
        el.setAttribute('selectedby', selectedById);
      }else{
        // Set as targetable for raycaster & add select handler
        el.setAttribute('class', 'collidable');
        el.setAttribute('select-listener', '');
        el.setAttribute('grab-listener', '');
      }

      var scene = this.el.sceneEl;
      pEl.appendChild(el);
      scene.appendChild(pEl);

      // TODO: Add object to list 'Scene Objects' for "Object Overview Menu"
  },

  createAxes: function(pEl) {
    
    var xSlider = document.createElement('a-entity');
    var ySlider = document.createElement('a-entity');
    var zSlider = document.createElement('a-entity');

    /*
    var geometry = new THREE.CylinderGeometry( 0.05, 0.05, 2, 4 );
    var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    var x = new THREE.Mesh( geometry, material );
    material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    var y = new THREE.Mesh( geometry, material );
    material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );
    var z = new THREE.Mesh( geometry, material );

    x.rotateZ(-1.5708);
    z.rotateX(1.5708);

    x.translateY(1);
    y.translateY(1);
    z.translateY(1);

    xSlider.object3D.add(x);
    ySlider.object3D.add(y);
    zSlider.object3D.add(z);
    */


    xSlider.setAttribute('material', 'color: #00ff00');
    ySlider.setAttribute('material', 'color: #ff0000');
    zSlider.setAttribute('material', 'color: #0000ff');

    xSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.05; height: 2; segmentsRadial: 4');
    ySlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.05; height: 2; segmentsRadial: 4');
    zSlider.setAttribute('geometry', 'primitive: cylinder; radius: 0.05; height: 2; segmentsRadial: 4');
    
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

    xSlider.setAttribute('raycaster-listen', '');
    ySlider.setAttribute('raycaster-listen', '');
    zSlider.setAttribute('raycaster-listen', '');

    pEl.appendChild(xSlider);
    pEl.appendChild(ySlider);
    pEl.appendChild(zSlider);
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
    if(sourceRtcId == clientRtcId) {
      // Client's own EasyRTCid
      if(selectBool) {
        // Select object: Add AxesHelper
        var axesHelper = new THREE.AxesHelper(2);
        el.setObject3D("axes-helper", axesHelper);

        // Add color-listener for Colorwheel
        el.setAttribute('color-listener', '');

        // Revert hover color back to base color
        var material = el.getAttribute('material');
        var currentColor = material.color;
        var baseColor = el.getAttribute('baseColor');

        if(currentColor != baseColor){
          material.color = baseColor;
          el.setAttribute('material', material);

          // Check if wireframe exists and make it visible
          if(el.getAttribute('wireframed') == "true") {
            // TODO: Change wireframe identifier to 'cid' instead of 'name'
            var name = el.getAttribute('name');
            var wfObjectName = name + "-wireframe";
            var wfObjects = document.querySelectorAll("[wireframe]");
            var wfObject = null;

            wfObjects.forEach(obj => {
              var objName = obj.getAttribute('name');
              if(objName == wfObjectName) {
                wfObject = obj;
              }
            });

            wfObject.setAttribute('visible', true);
          }
        }

      }else{
        // Deselect object: Remove AxesHelper
        var axesHelper = el.getObject3D('axes-helper');
        el.removeObject3D('axes-helper');

        // Remove colorlistener TODO: May be put into the 'Open/Close Color-Menu'
        el.removeAttribute('color-listener');
      }
    }else{

      // Other clients EasyRTCid
      if(selectBool) {
        // Make selected object transparent 
        var mat = el.getAttribute('material');
        mat.opacity = 0.4;
        el.setAttribute('material', mat);

        // VR - Make selected object untargetable
        el.setAttribute('class', 'selected-collidable');
        
      }else {
        // Make deselected object fully visible
        var mat = el.getAttribute('material');
        mat.opacity = 1.0;
        el.setAttribute('material', mat);
      
        // VR - Make selected object targetable again
        el.setAttribute('class', 'collidable');
      }
    }

    // VR - Further A-FRAME actions
    if(selectBool) {
      // Set easyRtcId of source
      el.setAttribute('selectedby', sourceRtcId);

      // Remove 'select-button-listener' and the listener it adds
      //el.removeAttribute('select-button-listener');
      //el.removeEventListener("select-object", handleSendSelect);
    }else {
      // Remove easyRtcId of source
      el.removeAttribute('selectedby');

      // Add 'select-button-listener' again
      //el.setAttribute('select-button-listener', '');
    }

    // TODO: Remove this temporary test code
    this.createAxes(pEl);
  },

  removeComponent: function(componentId) {
      // Remove entity from scene
      var pEl = null;
      var els = this.el.sceneEl.querySelectorAll('[cid]');

      for (var i = 0; i < els.length; i++) {

        if(els[i].getAttribute('cid') == componentId) {
          pEl = els[i];
          break;
        }
      }

      pEl.parentNode.removeChild(pEl);
  },

  updateComponent: function(componentId, type, data) {
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

