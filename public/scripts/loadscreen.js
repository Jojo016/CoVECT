document.addEventListener('DOMContentLoaded', function() {
    let scene = document.querySelector('a-scene');
    let splash = document.querySelector('#splash');
    let countMax = scene.querySelectorAll('.loadmodel').length;
    console.log("models to load",countMax)
    if(countMax>0){ // models have to be loaded
        let modelsLoaded=0;
        document.getElementById("counter-max-info").innerHTML = countMax;
        let counterstate=document.getElementById("counter-state-info")
        scene.addEventListener('model-loaded', function (e) {
            modelsLoaded++;
            counterstate.innerHTML = modelsLoaded;
            if(modelsLoaded===countMax){ // remove loadscreen if all models are loaded
                splash.style.display = 'none';
            }
        });
    }
    else{ // no models to load but there are still assets
        document.querySelector('#model-load-info').style.display = 'none'; // hide model load info
        console.log("assets",)
        let assetSystem=document.querySelector('a-assets')
        if(assetSystem){
            if(assetSystem.children.length>0){// children have to be loaded
                scene.addEventListener('loaded', function (e) {// remove loadscreen if all assets are loaded
                    splash.style.display = 'none';
                });
            }else{
                splash.style.display = 'none';
            }
        }else{
            splash.style.display = 'none';
        }
    }
});