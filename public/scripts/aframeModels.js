AFRAME.registerComponent('change-property', {
    multiple: true,
    schema: {
        property:{default: 'color'},
        value: {default: 'red'},
        target:{type:'selector'},
        event: {default: 'click'},
        interaction:{default:' '},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        console.log("change-property",this.data)
        var el = this.el;  // <a-box>
        el.addEventListener(data.event, function (e) {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            if(data.target==null){
                el.setAttribute(data.property, data.value);
                if(data.property==="color"){
                    el.emit("colorChange", {},false)
                }
            }
            else{
                data.target.setAttribute(data.property, data.value);
                if(data.property==="color"){
                    data.target.emit("colorChange", {},false)
                }
            }
            el.emit("performedInteraction", {interaction:data.interaction},false)

        });
    }
});


AFRAME.registerComponent('teleport-to_position', {
    multiple: true,
    schema: {
        player:{type:'selector'},
        value: {default: '0 0 0'},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },
    init: function () {
        console.log("teleport-to_position",this.data)
        this.teleport=this.teleport.bind(this);
    },
    play: function () {
        const el = this.el;
        el.addEventListener(this.data.event, this.teleport);
    },

    pause: function () {
        const el = this.el;
        el.removeEventListener(this.data.event, this.teleport);
    },
    teleport: function (){
        const data=this.data
        if(data.condition){
            if(!data.conditionHandler){
                console.log("failed to find the condition handler")
                return;
            }
            if(data.conditionHandler.components["condition-checker"]) {
                if (!data.conditionHandler.components["condition-checker"].check()) {
                    return;
                }
            }
            else{
                console.log("failed to find the condition-checker")
                return;
            }
        }
        if(data.player){
            data.player.setAttribute("position", data.value);
            this.el.emit("performedInteraction", {interaction:data.interaction},false)
        }
    }
});


AFRAME.registerComponent('add-property', {
    multiple: true,
    schema: {
        property:{default: 'scale'},
        value: {default: "0.1"},
        target:{type:'selector'},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        console.log("add-property",this.data)
        this.addProperty=this.addProperty.bind(this);
        if(typeof this.data.value === 'string'){
            this.values=this.data.value.split(' ');
            this.values=this.values.map((x)=>{return parseFloat(x)})
        }
    },
    play: function () {
        const el = this.el;
        el.addEventListener(this.data.event, this.addProperty);
    },

    pause: function () {
        const el = this.el;
        el.removeEventListener(this.data.event, this.addProperty);
    },
    addProperty: function (){
        const data=this.data
        const el= this.el
        if(data.condition){
            if(!data.conditionHandler){
                console.log("failed to find the condition handler")
                return;
            }
            if(data.conditionHandler.components["condition-checker"]) {
                if (!data.conditionHandler.components["condition-checker"].check()) {
                    return;
                }
            }
            else{
                console.log("failed to find the condition-checker")
                return;
            }
        }
        if(data.target==null){
            let oldValue=el.getAttribute(data.property)
            oldValue.x=oldValue.x+this.values[0]
            oldValue.y=oldValue.y+this.values[1]
            oldValue.z=oldValue.z+this.values[2]
            el.setAttribute(data.property, ""+oldValue.x+" "+oldValue.y+" "+oldValue.z);
        }
        else{
            let oldValue=data.target.getAttribute(data.property)
            oldValue.x=oldValue.x+this.values[0]
            oldValue.y=oldValue.y+this.values[1]
            oldValue.z=oldValue.z+this.values[2]
            data.target.setAttribute(data.property, ""+oldValue.x+" "+oldValue.y+" "+oldValue.z);
        }
        el.emit("performedInteraction", {interaction:data.interaction},false)
    }
});

AFRAME.registerComponent('toggle-property', {
    multiple: true,
    schema: {
        property:{default: 'visible'},
        target:{type:'selector'},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        console.log("toggle-property",this.data)
        this.toggleProperty=this.toggleProperty.bind(this);
    },
    play: function () {
        const el = this.el;
        el.addEventListener(this.data.event, this.toggleProperty);
    },

    pause: function () {
        const el = this.el;
        el.removeEventListener(this.data.event, this.toggleProperty);
    },
    toggleProperty: function (){
        const data=this.data
        const el= this.el
        if(data.condition){
            if(!data.conditionHandler){
                console.log("failed to find the condition handler")
                return;
            }
            if(data.conditionHandler.components["condition-checker"]) {
                if (!data.conditionHandler.components["condition-checker"].check()) {
                    return;
                }
            }
            else{
                console.log("failed to find the condition-checker")
                return;
            }
        }
        if(data.target==null){
            el.setAttribute(data.property,  !el.getAttribute(data.property));
        }
        else{
            data.target.setAttribute(data.property, !data.target.getAttribute(data.property));
        }
        el.emit("performedInteraction", {interaction:data.interaction},false)
    }
});



AFRAME.registerComponent('pdf-manager', {
    schema: {
        start:{default: 1},
        repeat: {default: true},
        pages:{default:[]}
    },
    init: function () {
        var data = this.data;
        var el = this.el;  // <a-box>
        console.log("pdf-manager",this.data)
        if(data.pages.length<1){
            return;
        }
        if(data.start<=data.pages.length){
            this.shownPage=data.start;
        }
        else{
            this.shownPage=1
        }
        el.setAttribute("src", data.pages[this.shownPage-1]); //set the starting page

        el.addEventListener("set-page", function (event) { //define a listener which handles changing page requests
            let pageRequest=event.detail.page
            if(pageRequest<=data.pages.length){
                if(pageRequest===1){
                    el.emit("pdfReset",{},false)
                }
                if(pageRequest===data.pages.length){
                    el.emit("pdfEnded",{},false)
                }
                this.shownPage=pageRequest;
                el.setAttribute("src", data.pages[pageRequest-1]);
            }
            else{
                if(data.repeat){
                    let pageOverflow=pageRequest%data.pages.length
                    if(pageOverflow===0){
                        pageOverflow=data.pages.length
                        el.emit("pdfEnded",{},false)
                    }
                    this.shownPage=pageOverflow;
                    el.setAttribute("src", data.pages[pageOverflow-1]);
                }
            }
        }.bind(this));
        el.addEventListener("next-page", function () { //define a listener which handles changing page requests
            let nextPage=this.shownPage+1;
            if(nextPage===data.pages.length) {
                el.emit("pdfEnded", {}, false)
            }
            if(nextPage>data.pages.length){
                if(data.repeat){
                    this.shownPage=1;
                    el.emit("pdfReset",{},false)
                    el.emit("nextPagePdf",{},false)
                    el.setAttribute("src", data.pages[0]);
                }
            }
            else{
                el.emit("nextPagePdf",{},false)
                this.shownPage=nextPage;
                el.setAttribute("src", data.pages[this.shownPage-1]);
            }
        }.bind(this));
        el.addEventListener("prev-page", function () { //define a listener which handles changing page requests
            let prevPage=this.shownPage-1;
            if(prevPage<1){
                if(data.repeat){
                    this.shownPage=data.pages.length;
                    el.emit("pdfEnded", {}, false)
                    el.emit("prevPagePdf",{},false)
                    el.setAttribute("src", data.pages[data.pages.length-1]);
                }
            }
            else{
                el.emit("prevPagePdf",{},false)
                this.shownPage=prevPage;
                el.setAttribute("src", data.pages[this.shownPage-1]);
            }
        }.bind(this));
    }
});

AFRAME.registerComponent('pdf-next-page', {
    multiple: true,
    schema: {
        target:{type: 'selector'},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        console.log("pdf-next-page",this.data)
        var el = this.el;  // <a-box>
        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            if(data.target==null){
                el.emit("next-page", {},false);
            }
            else{
                data.target.emit("next-page", {},false);
            }
            el.emit("performedInteraction", {interaction:data.interaction},false)
        });
    }
});

AFRAME.registerComponent('pdf-prev-page', {
    multiple: true,
    schema: {
        target:{type: 'selector'},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        console.log("pdf-prev-page",this.data)
        var el = this.el;  // <a-box>
        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            if(data.target==null){
                el.emit("prev-page", {},false);
            }
            else{
                data.target.emit("prev-page", {},false);
            }
            el.emit("performedInteraction", {interaction:data.interaction},false)
        });
    }
});

AFRAME.registerComponent('pdf-set-page', {
    multiple: true,
    schema: {
        page:{default:1},
        target:{type:"selector"},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        console.log("pdf-set-page",this.data)
        var el = this.el;  // <a-box>
        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            if(data.target==null){
                el.emit("set-page", {page:data.page},false);
            }
            else{
                data.target.emit("set-page", {page:data.page},false);
            }
            el.emit("performedInteraction", {interaction:data.interaction},false)
        });
    }
});


AFRAME.registerComponent('video-manager', {
    multiple: true,
    schema: {
    },

    init: function () {
        var el = this.el;  // <a-box>
        console.log("video-manager",this.data)
        let videoID=el.getAttribute('src')
        this.video= document.querySelector(videoID);

        if(this.video){
            this.video.addEventListener("pause", function () {
                el.emit("videoPaused", {},false)
            }.bind(this));
            this.video.addEventListener("play", function () {
                el.emit("videoPlayed", {},false)
            }.bind(this));
            this.video.addEventListener("ended", function () {
                el.emit("videoEnded", {},false)
            }.bind(this));
        }
    }
});

AFRAME.registerComponent('video-play-pause', {
    multiple: true,
    schema: {
        target:{type:"selector"},
        event:{default:"click"},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        var el = this.el;  // <a-box>
        console.log("video-play-pause",this.data)
        let videoID
        if(data.target==null){
            videoID=el.getAttribute('src')
        }
        else{
            videoID=data.target.getAttribute('src')
        }
        this.video= document.querySelector(videoID);


        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            if(this.video.paused){
                this.video.play();
            }
            else{
                this.video.pause();
            }
            el.emit("performedInteraction", {interaction:data.interaction},false)
        }.bind(this));
    }
});

AFRAME.registerComponent('video-pause', {
    multiple: true,
    schema: {
        target:{type:"selector"},
        event:{default:"click"},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        var el = this.el;  // <a-box>
        console.log("video-pause",this.data)
        let videoID
        if(data.target==null){
            videoID=el.getAttribute('src')
        }
        else{
            videoID=data.target.getAttribute('src')
        }
        this.video= document.querySelector(videoID);
        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            this.video.pause();
            el.emit("performedInteraction", {interaction:data.interaction},false)
        }.bind(this));
    }
});

AFRAME.registerComponent('video-play', {
    multiple: true,
    schema: {
        target:{type:"selector"},
        event:{default:"click"},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        var el = this.el;  // <a-box>
        console.log("video-play",this.data)
        let videoID
        if(data.target==null){
            videoID=el.getAttribute('src')
        }
        else{
            videoID=data.target.getAttribute('src')
        }
        this.video= document.querySelector(videoID);


        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            this.video.play();
            el.emit("performedInteraction", {interaction:data.interaction},false)
        }.bind(this));
    }
});

AFRAME.registerComponent('video-start-time', {
    schema: {
        second:{default:0}
    },


    init: function () {
        let data = this.data;
        let el = this.el;  // <a-box>
        console.log("video-start-time",this.data)
        let videoID= el.getAttribute('src');
        let video= document.querySelector(videoID);
        video.currentTime=data.second;
    }

});

AFRAME.registerComponent('video-set-to-second', {
    multiple: true,
    schema: {
        target:{type:"selector"},
        event:{default:"click"},
        second:{default:0},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        var el = this.el;  // <a-box>
        console.log("video-set-to-second",this.data)
        let videoID
        if(data.target==null){
            videoID=el.getAttribute('src')
        }
        else{
            videoID=data.target.getAttribute('src')
        }
        this.video= document.querySelector(videoID);


        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            this.video.currentTime=data.second;
            el.emit("performedInteraction", {interaction:data.interaction},false)
        }.bind(this));
    }
});

AFRAME.registerComponent('video-skip-seconds', {
    multiple: true,
    schema: {
        target:{type:"selector"},
        event:{default:"click"},
        second:{default:0},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        var el = this.el;  // <a-box>
        console.log("video-skip-second",this.data)
        let videoID
        if(data.target==null){
            videoID=el.getAttribute('src')
        }
        else{
            videoID=data.target.getAttribute('src')
        }
        this.video= document.querySelector(videoID);


        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            if((this.video.currentTime+data.second)>this.video.duration){
                this.video.currentTime=this.video.duration;
            }else{
                if((this.video.currentTime+data.second)<0){
                    this.video.currentTime=0;
                }
                else{
                    this.video.currentTime+=data.second;
                }
            }
            el.emit("performedInteraction", {interaction:data.interaction},false)
        }.bind(this));
    }
});

AFRAME.registerComponent('controller-collision-pass-event', {
    init: function () {
        this.system = this.el.sceneEl.systems.physics;
        this.pressed = false;
        this.PRESSED_STATE = 'pressed';
        this.hitEl =      /** @type {AFRAME.Element}    */ null;
        this.physics =    /** @type {AFRAME.System}     */ this.el.sceneEl.systems.physics;
        this.constraint = /** @type {CANNON.Constraint} */ null;

        // Bind event handlers
        this.onHit = this.onHit.bind(this);
        this.forwardEventPress = this.forwardEventPress.bind(this);
        this.forwardEvent = this.forwardEvent.bind(this);
    },

    play: function () {
        const el = this.el;
        el.addEventListener('hit', this.onHit);
        el.addEventListener('triggerdown', this.forwardEventPress);
        el.addEventListener('triggerup', this.forwardEvent);
        // el.addEventListener('trackpaddown', this.onGripClose);
        // el.addEventListener('trackpadup', this.onGripOpen);
        // el.addEventListener('triggerdown', this.onGripClose);
        // el.addEventListener('triggerup', this.onGripOpen);
    },

    pause: function () {
        const el = this.el;
        el.removeEventListener('hit', this.onHit);
        el.removeEventListener('triggerdown', this.forwardEventPress);
        el.removeEventListener('triggerup', this.forwardEvent);
        // el.removeEventListener('trackpaddown', this.onGripClose);
        // el.removeEventListener('trackpadup', this.onGripOpen);
        // el.removeEventListener('triggerdown', this.onGripClose);
        // el.removeEventListener('triggerup', this.onGripOpen);
    },

    forwardEventPress: function () {
        this.pressed=true
    },
    forwardEvent: function () {
        const hitEl = this.hitEl;
        this.pressed = false;
        if (!hitEl) { return; }
        hitEl.removeState(this.PRESSED_STATE);
        hitEl.emit("triggerup", {}, false)
        this.hitEl = undefined;
    },

    onHit: function (evt) {
        const hitEl = evt.detail.el;
        // If the element is already grabbed (it could be grabbed by another controller).
        // If the hand is not grabbing the element does not stick.
        // If we're already grabbing something you can't grab again.
        if (!hitEl ||hitEl.is(this.PRESSED_STATE) ||this.hitEl||!this.pressed) { return; }
        hitEl.addState(this.PRESSED_STATE);
        this.hitEl = hitEl;
        hitEl.emit("triggerdown", {}, false)
    }
});

AFRAME.registerComponent('activity-area-listener-entity', {
    schema: {
        target: {default: ''},
        state: {default: 'inArea'},
        activity:{default: ""}
    },

    init: function () {
        this.els = [];
        this.collisions = [];
        this.elMax = new THREE.Vector3();
        this.elMin = new THREE.Vector3();
        this.boundingBox= new THREE.Box3();
        this.activity = this.data.activity;
        this.complete=false;
        this.allCleared=false;
        this.checkActivityDone=this.checkActivityDone.bind(this);
        console.log("activity-area-listener-entity",this.data)
    },

    /**
     * Update list of entities to test for collision.
     */
    update: function () {
        var data = this.data;
        var objectEls;

        // Push entities into list of els to intersect.
        if (data.target) {
            objectEls = this.el.sceneEl.querySelectorAll(data.target);
        } else {
            // If objects not defined, intersect with everything.
            objectEls = this.el.sceneEl.children;
        }
        // Convert from NodeList to Array
        this.els = Array.prototype.slice.call(objectEls);
    },

    play: function () {
        const el = this.el;
        el.addEventListener("activityDone", this.checkActivityDone);
    },

    pause: function () {
        const el = this.el;
        el.removeEventListener("activityDone", this.checkActivityDone);
    },
    checkActivityDone: function(event){
        let activity=event.detail.activity
        if(activity===("#"+this.activity)){
            this.complete=true;
            this.el.setAttribute("visible",false);
        }
    },

    tick: (function () {
        var boundingBox = new THREE.Box3();
        return function () {
            if(this.allCleared){return;}
            var collisions = [];
            var el = this.el;
            var mesh = el.getObject3D('mesh');
            var self = this;
            // No mesh, no collisions
            if (!mesh) { return; }
            // Update the bounding box to account for rotations and
            // position changes.
            updateBoundingBox();
            // Update collisions.
            this.els.forEach(intersect);
            // Emit events.
            collisions.forEach(handleHit);
            // No collisions.
            if (collisions.length === 0) { self.el.emit('areaEntered', {el: null}); }
            // Updated the state of the elements that are not intersected anymore.
            if(this.complete){
                collisions=[];
                this.allCleared=true;
            }
            this.collisions.filter(function (el) {
                return collisions.indexOf(el) === -1;
            }).forEach(function removeState (el) {
                el.removeState(self.data.state);
            });
            // Store new collisions
            this.collisions = collisions;

            // AABB collision detection
            function intersect (el) {
                var intersected;
                if(el.is("grabbed")){return;}
                var mesh = el.getObject3D('mesh');
                var elMin;
                var elMax;
                if (!mesh) { return; }
                boundingBox.setFromObject(mesh);
                elMin = boundingBox.min;
                elMax = boundingBox.max;
                // Bounding boxes are always aligned with the world coordinate system.
                // The collision test checks for the conditions where cubes intersect.
                // It's an extension to 3 dimensions of this approach (with the condition negated)
                // https://www.youtube.com/watch?v=ghqD3e37R7E
                // intersected = (self.elMin.x <= elMax.x && self.elMax.x >= elMin.x) &&
                //     (self.elMin.y <= elMax.y && self.elMax.y >= elMin.y) &&
                //     (self.elMin.z <= elMax.z && self.elMax.z >= elMin.z);

                intersected=self.boundingBox.containsBox(boundingBox)
                if (!intersected) { return; }
                collisions.push(el);
            }

            function handleHit (hitEl) {
                hitEl.emit('areaEntered', {activity:this.activity});
                hitEl.addState(self.data.state);
                self.el.emit('areaEntered', {el: hitEl});
            }

            function updateBoundingBox () {
                boundingBox.setFromObject(mesh);
                self.boundingBox=boundingBox.clone();
                self.elMin.copy(boundingBox.min);
                self.elMax.copy(boundingBox.max);
            }
        };
    })()
});

AFRAME.registerComponent('activity-area-listener-player', {
    schema: {
        player: {default: ''},
        state: {default: 'inArea'},
        activity:{default: ""}
    },

    init: function () {
        this.els = [];
        this.collisions = [];
        this.elMax = new THREE.Vector3();
        this.elMin = new THREE.Vector3();
        this.boundingBox= new THREE.Box3();
        this.activity = this.data.activity;
        this.complete=false;
        this.allCleared=false;
        this.checkActivityDone=this.checkActivityDone.bind(this);
        console.log("activity-area-listener-player",this.data)
    },

    /**
     * Update list of entities to test for collision.
     */
    update: function () {
        var data = this.data;
        var objectEls;

        // Push entities into list of els to intersect.
        if (data.player) {
            objectEls = this.el.sceneEl.querySelectorAll(data.player);
        } else {
            // If objects not defined, intersect with everything.
            objectEls = this.el.sceneEl.children;
        }
        // Convert from NodeList to Array
        this.els = Array.prototype.slice.call(objectEls);
    },

    play: function () {
        const el = this.el;
        el.addEventListener("activityDone", this.checkActivityDone);
    },

    pause: function () {
        const el = this.el;
        el.removeEventListener("activityDone", this.checkActivityDone);
    },

    checkActivityDone: function(event){
        let activity=event.detail.activity
        if(activity===("#"+this.activity)){
            this.complete=true;
            this.el.setAttribute("visible",false);
        }
    },


    tick: (function () {
        var boundingBox = new THREE.Box3();
        return function () {
            if(this.allCleared){return;}
            var collisions = [];
            var el = this.el;
            var mesh = el.getObject3D('mesh');
            var self = this;
            // No mesh, no collisions
            if (!mesh) { return; }
            // Update the bounding box to account for rotations and
            // position changes.
            updateBoundingBox();
            // Update collisions.
            this.els.forEach(intersect);
            // Emit events.
            collisions.forEach(handleHit);
            // No collisions.
            if (collisions.length === 0) { self.el.emit('areaEntered', {el: null}); }
            // Updated the state of the elements that are not intersected anymore.
            if(this.complete){
                collisions=[];
                this.allCleared=true;
            }
            this.collisions.filter(function (el) {
                return collisions.indexOf(el) === -1;
            }).forEach(function removeState (el) {
                el.removeState(self.data.state);
            });
            // Store new collisions
            this.collisions = collisions;

            // AABB collision detection
            function intersect (el) {
                var intersected;
                var position= new THREE.Vector3()
                el.object3D.getWorldPosition(position);
                intersected=self.boundingBox.containsPoint(position)
                if (!intersected) { return; }
                collisions.push(el);
            }

            function handleHit (hitEl) {
                hitEl.emit('areaEntered', {activity:this.activity});
                hitEl.addState(self.data.state);
                self.el.emit('areaEntered', {el: hitEl});
            }

            function updateBoundingBox () {
                boundingBox.setFromObject(mesh);
                self.boundingBox=boundingBox.clone();
                self.elMin.copy(boundingBox.min);
                self.elMax.copy(boundingBox.max);
            }
        };
    })()
});

AFRAME.registerComponent('activity-check-interaction-performed', {
    schema: {
        interaction: {default: ''},
        activity: {default: ""},
        event:{default:"performedInteraction"},
        entity:{type:'selector'},
        task:{type:'selector'}
    },
    init: function () {
        this.activity = this.data.activity;
        console.log("activity-interaction-listener", this.data)
        this.listenInteractionDone=this.listenInteractionDone.bind(this)
        if(this.data.entity){
            this.target=this.data.entity

        }
        else{
            this.target=this.el
        }
        this.done=false;
    },

    play: function () {
        const el = this.target;
        el.addEventListener(this.data.event, this.listenInteractionDone);
    },

    pause: function () {
        const el = this.target;
        el.removeEventListener(this.data.event, this.listenInteractionDone);
    },

    listenInteractionDone: function(event){
        const data=this.data;
        const interaction = event.detail.interaction
        if(interaction===this.data.interaction && (!this.done)){
            this.done=true;
            if(data.task){
                data.task.emit("activityDone",{activity:data.activity},false)
            }
        }
    },
});

AFRAME.registerComponent('activity-checker', {
    multiple: true,
    schema: {
        property:{default: 'scale'},
        value: {default: "0.1"},
        goal:{type:'selector'},
        event: {default: 'areaEntered'},
        activity:{default:""},
        task:{type:'selector'}
    },

    init: function () {
        console.log("activity-checker",this.data)
        this.done=false;
        this.checkActivity=this.checkActivity.bind(this);
    },
    play: function () {
        const el = this.el;
        el.addEventListener(this.data.event, this.checkActivity);
    },

    pause: function () {
        const el = this.el;
        el.removeEventListener(this.data.event, this.checkActivity);
    },
    checkActivity: function (event){
        const data=this.data
        const el= this.el
        const hitEl =event.detail.el
        if(!hitEl|| this.done){ return;}
        if(data.goal===event.detail.el){
            this.done=true;
            if(data.task){
                data.task.emit("activityDone",{activity:data.activity},false)
            }
            el.emit("activityDone",{activity:data.activity},false)
        }
    }
});

AFRAME.registerComponent('task-checker', {
    schema: {
        activities:{default:""},
        event: {default: 'activityDone'},
        task:{default:""}
    },

    init: function () {

        let activites=this.data.activities.split(" ");
        this.checkActivityDone=this.checkActivityDone.bind(this);
        this.checkTaskDone=this.checkTaskDone.bind(this);
        let activityList=[]
        for (let index=0; index<activites.length;index++){
            activityList=activityList.concat({activity:activites[index], complete:false});
        }
        this.once=true;
        this.activityList=activityList;
        console.log("task-checker",{data:this.data, activityList:this.activityList})
    },
    play: function () {
        const el = this.el;
        el.addEventListener(this.data.event, this.checkActivityDone);
    },

    pause: function () {
        const el = this.el;
        el.removeEventListener(this.data.event, this.checkActivityDone);
    },
    checkActivityDone: function (event){
        const data=this.data
        const el= this.el
        for (let index=0;index<this.activityList.length;index++){
            if(this.activityList[index].activity===event.detail.activity){
                this.activityList[index].complete=true;
                if(this.checkTaskDone()){
                    if(this.once){
                        this.once=false;
                        el.emit("taskDone",{task:data.task},false)
                    }
                }
                break;
            }
        }
    },
    checkTaskDone: function (){
        let taskDone=true
        for (let index=0;index<this.activityList.length;index++){
            if(!this.activityList[index].complete){
                taskDone=false;
                break;
            }
        }
        return taskDone
    }
});

AFRAME.registerComponent('taskbar-manager', {
    schema: {
        textActivities:{default: ""},
        activities:{default:""},
        taskName:{default:""},
        taskDescription:{default:""},
        task:{type:"selector"},
        event: {default: 'activityDone'},
    },
    init: function () {
        var data = this.data;
        console.log("taskbar-manager",this.data)
        this.activityList=[];
        this.textActivities=data.textActivities.split(" ");
        this.activities=data.activities.split(" ")
        this.once=true;
        if(this.textActivities.length<1||this.activities.length<1||!(this.textActivities.length===this.activities.length)){
            return;
        }
        this.description=data.taskDescription.replace(/&space_/g,' ') // replace all line breaks
            .replace(/&newLine_/g,'\n') // replace all line breaks
            .replace(/&apos_/g, "'") //replace all '
            .replace(/&quot_/g, '"') //replace all "
            .replace(/&gt_/g, '>') //replace all >
            .replace(/&lt_/g, '<') //replace all <
            .replace(/&amp_amp_/g, '&'); //replace all &
        let activityList=[];
        for(let index=0; index<this.textActivities.length;index++){
            let text=this.textActivities[index].replace(/&space_/g,' ') // replace all line breaks
                .replace(/&newLine_/g,'\n') // replace all line breaks
                .replace(/&apos_/g, "'") //replace all '
                .replace(/&quot_/g, '"') //replace all "
                .replace(/&gt_/g, '>') //replace all >
                .replace(/&lt_/g, '<') //replace all <
                .replace(/&amp_amp_/g, '&'); //replace all &
            activityList.push({activity:this.activities[index], text:text, complete:false })
        }
        this.activityList=activityList
        this.checkActivityIsDone=this.checkActivityIsDone.bind(this);
        this.updateTaskBarText=this.updateTaskBarText.bind(this);
        this.updateTaskBarText();
    },

    play: function () {
        const el = (this.data.task)?this.data.task:this.el;
        el.addEventListener(this.data.event, this.checkActivityIsDone);
    },

    pause: function () {
        const el = (this.data.task)?this.data.task:this.el;
        el.removeEventListener(this.data.event, this.checkActivityIsDone);
    },

    checkActivityIsDone: function (event){
        for (let index=0;index<this.activityList.length;index++){
            if(this.activityList[index].activity===event.detail.activity){
                if(!this.activityList[index].complete) { //only first the first time
                    this.el.emit("activityDone",{activity:this.activityList[index].activity},false)
                    this.el.emit("activityDone_"+index,{activity:this.activityList[index].activity},false)
                }
                this.activityList[index].complete=true;
                this.updateTaskBarText();
                let taskDone=true;
                for (let index2=0;index2<this.activityList.length;index2++){
                    if(!this.activityList[index2].complete){
                        taskDone=false;
                        break;
                    }
                }
                if(taskDone){
                    if(this.once){
                        this.once=false;
                        this.el.emit("taskDone",{task:this.data.task},false)
                    }
                }
                break;
            }
        }
    },

    updateTaskBarText: function (){
        const data=this.data;
        let text= data.taskName+":\n"+this.description+"\n";
        for (let index=0; index<this.activityList.length;index++){
            text+= ((this.activityList[index].complete)?"(*)":"( )")+ " " + this.activityList[index].text+"\n";
        }
        this.el.setAttribute("value",text);
        return;
    }
});

AFRAME.registerComponent('reset-counter', {
    multiple: true,
    schema: {
        target:{type:"selector"},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        console.log("reset-counter",this.data)
        var el = this.el;  // <a-box>
        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            if(data.target==null){
                el.emit("resetCounter", {},false);
            }
            else{
                data.target.emit("resetCounter", {},false);
            }
            el.emit("performedInteraction", {interaction:data.interaction},false)
        });
    }
});

AFRAME.registerComponent('increase-counter', {
    multiple: true,
    schema: {
        value:{default:1},
        target:{type:"selector"},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        console.log("increase-counter",this.data)
        var el = this.el;  // <a-box>
        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            if(data.target==null){
                el.emit("increaseCounter", {increase:data.value},false);
            }
            else{
                data.target.emit("increaseCounter", {increase:data.value},false);
            }
            el.emit("performedInteraction", {interaction:data.interaction},false)
        });
    }
});

AFRAME.registerComponent('decrease-counter', {
    multiple: true,
    schema: {
        value:{default:1},
        target:{type:"selector"},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        console.log("decrease-counter",this.data)
        var el = this.el;  // <a-box>
        el.addEventListener(data.event, function () {
            if(data.condition){
                if(!data.conditionHandler){
                    console.log("failed to find the condition handler")
                    return;
                }
                if(data.conditionHandler.components["condition-checker"]) {
                    if (!data.conditionHandler.components["condition-checker"].check()) {
                        return;
                    }
                }
                else{
                    console.log("failed to find the condition-checker")
                    return;
                }
            }
            if(data.target==null){
                el.emit("decreaseCounter", {decrease:data.value},false);
            }
            else{
                data.target.emit("decreaseCounter", {decrease:data.value},false);
            }
            el.emit("performedInteraction", {interaction:data.interaction},false)
        });
    }
});

AFRAME.registerComponent('increase-counter-once', {
    multiple: true,
    schema: {
        value:{default:1},
        target:{type:"selector"},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        console.log("increase-counter-once",this.data)
        this.done=false;
        var el = this.el;  // <a-box>
        this.increase=this.increase.bind(this);
        el.addEventListener(data.event, this.increase);
    },
    increase: function () {
        if(this.done){return;}
        var el = this.el;  // <a-box>
        var data = this.data;

        if(data.condition){
            if(!data.conditionHandler){
                console.log("failed to find the condition handler")
                return;
            }
            if(data.conditionHandler.components["condition-checker"]) {
                if (!data.conditionHandler.components["condition-checker"].check()) {
                    return;
                }
            }
            else{
                console.log("failed to find the condition-checker")
                return;
            }
        }

        if(data.target==null){
            el.emit("increaseCounter", {increase:data.value},false);
        }
        else{
            data.target.emit("increaseCounter", {increase:data.value},false);
        }
        el.emit("performedInteraction", {interaction:data.interaction},false)
        this.done=true;
    },
});

AFRAME.registerComponent('decrease-counter-once', {
    multiple: true,
    schema: {
        value:{default:1},
        target:{type:"selector"},
        event: {default: 'click'},
        interaction:{default:""},
        condition:{default:false},
        conditionHandler:{type:'selector'}
    },

    init: function () {
        var data = this.data;
        console.log("decrease-counter",this.data)
        var el = this.el;  // <a-box>
        this.done=false;
        this.decrease=this.decrease.bind(this)
        el.addEventListener(data.event,this.decrease );
    },
    decrease: function () {
        if(this.done){return;}
        var el = this.el;  // <a-box>
        var data = this.data;

        if(data.condition){
            if(!data.conditionHandler){
                console.log("failed to find the condition handler")
                return;
            }
            if(data.conditionHandler.components["condition-checker"]) {
                if (!data.conditionHandler.components["condition-checker"].check()) {
                    return;
                }
            }
            else{
                console.log("failed to find the condition-checker")
                return;
            }
        }

        if(data.target==null){
            el.emit("decreaseCounter", {decrease:data.value},false);
        }
        else{
            data.target.emit("decreaseCounter", {decrease:data.value},false);
        }
        this.done=true;
        el.emit("performedInteraction", {interaction:data.interaction},false)
    },
});

AFRAME.registerComponent('counter-manager', {
    schema: {
        start:{default: 0},
        end:{default:10},
        repeat:{default:true},
        interval:{default:10},
    },
    init: function () {
        console.log("counter-manager",this.data)
        this.counterValue=this.data.start;
        this.interval=this.data.interval;
        this.end=this.data.end;
        this.start=this.data.start
        this.endReached=false;
        this.repeat=this.data.repeat
        this.increaseCounter=this.increaseCounter.bind(this);
        this.decreaseCounter=this.decreaseCounter.bind(this);
        this.updateCounter=this.updateCounter.bind(this);
        this.resetCounter=this.resetCounter.bind(this);
        this.updateCounter();
    },

    play: function () {
        const el =this.el;
        el.addEventListener("increaseCounter", this.increaseCounter);
        el.addEventListener("decreaseCounter", this.decreaseCounter);
        el.addEventListener("resetCounter", this.resetCounter);
    },

    pause: function () {
        const el =this.el;
        el.removeEventListener("increaseCounter", this.increaseCounter);
        el.removeEventListener("decreaseCounter", this.decreaseCounter);
        el.removeEventListener("resetCounter", this.resetCounter);
    },

    increaseCounter: function (event){
        const el = this.el;
        let increase=event.detail.increase;
        let savedValue=this.counterValue
        if((!this.endReached)||this.repeat){
            el.emit("counterIncreased",{},false);
            if(savedValue+increase===this.end){
                el.emit("counterEnd",{},false);
                this.endReached=true;
            }
            if(savedValue+increase>this.end){
                el.emit("counterEnd",{},false);
                this.counterValue=this.end
                this.endReached=true;
                if(this.repeat){
                    el.emit("counterReset",{},false);
                    this.counterValue=((savedValue+increase)%(this.end+1))+this.start;
                    this.endReached=false;
                }
            }
            else{
                this.counterValue+=increase
            }
            let remainder= (savedValue-this.start)%this.interval;
            let intervalsPassed=0;
            if(savedValue+increase>this.end){
                let tillEnd=this.end-savedValue
                intervalsPassed= Math.floor(tillEnd/this.interval)
                if(this.repeat){
                    let fromStart=((savedValue+increase)%(this.end+1))
                    intervalsPassed+=Math.floor(fromStart/this.interval)
                }
            }
            else{
                intervalsPassed= Math.floor((increase+remainder)/this.interval)
            }
            for (let index=0; index<intervalsPassed;index++){
                el.emit("IntervalPassed",{},false);
            }
            this.updateCounter()
        }
    },

    decreaseCounter: function (event){
        const el = this.el;
        let decrease=event.detail.decrease;
        let savedValue=this.counterValue
        if(savedValue-decrease<this.start) {
            this.counterValue=this.start
        }
        else {
            this.counterValue-=decrease;
            if(this.counterValue<this.end){
                this.endReached=false;
            }
        }
        el.emit("counterDecreased",{},false)
        this.updateCounter()
    },

    resetCounter: function (event){
        const el = this.el;
        this.counterValue=this.start;
        this.endReached=false;
        el.emit("counterReset",{},false)
        this.updateCounter()
    },


    updateCounter: function (){
        this.el.setAttribute("value",""+this.counterValue);
        return;
    }
});

AFRAME.registerComponent('button-manager', {
    schema: {
        button:{type: "selector"},
    },
    init: function () {
        console.log("button-manager",this.data)
        this.button=this.data.button;
        this.PRESSED_STATE="buttonpressed"
        this.buttonDown=this.buttonDown.bind(this);
        this.buttonUp=this.buttonUp.bind(this);
    },

    play: function () {
        const el =this.el;
        el.addEventListener("mousedown", this.buttonDown);
        el.addEventListener("triggerdown", this.buttonDown);
        el.addEventListener("mouseup", this.buttonUp);
        el.addEventListener("triggerup", this.buttonUp);
    },

    pause: function () {
        const el =this.el;
        el.removeEventListener("mousedown", this.buttonDown);
        el.removeEventListener("triggerdown", this.buttonDown);
        el.removeEventListener("mouseup", this.buttonUp);
        el.removeEventListener("triggerup", this.buttonUp);
    },

    buttonDown: function (){
        this.el.addState(this.PRESSED_STATE);
        this.el.emit("buttonElementDown",{},false);
        if(this.button) {
            this.button.emit("buttonElementDown", {}, false);
        }
    },

    buttonUp: function (){
        if(!(this.el.is(this.PRESSED_STATE))){return;}
        this.el.removeState(this.PRESSED_STATE);
        this.el.emit("buttonElementUp",{},false);
        this.el.emit("buttonElementPressed",{},false);
        if(this.button) {
            this.button.emit("buttonElementUp", {}, false);
            this.button.emit("buttonElementPressed", {}, false);
        }
    },
});




AFRAME.registerComponent('pressure-plate-manager', {
    schema: {
        player:{type: "selector"},
        scanHeight:{default:2.5},
        height:{default:0.1},
        state:{default:"pressureAreaEntered"}
    },
    init: function () {
        console.log("pressure-plate-manager",this.data)
        this.scanHeight=this.data.scanHeight;
        this.height=this.data.height;
        this.PRESSED_STATE="platepressed"

        this.els = [];
        this.collisions = [];
        this.elMax = new THREE.Vector3();
        this.elMin = new THREE.Vector3();
        this.boundingBox= new THREE.Box3();
        this.once=true;
    },

    /**
     * Update list of entities to test for collision.
     */
    update: function () {
        var data = this.data;
        var objectEls;

        // Push entities into list of els to intersect.
        if (data.player) {
            this.els = [data.player];
        } else {
            // If objects not defined, intersect with everything.
            objectEls = this.el.sceneEl.children;
            this.els = Array.prototype.slice.call(objectEls);
        }
        // Convert from NodeList to Array

    },

    tick: (function () {
        var boundingBox = new THREE.Box3();
        return function () {
            var collisions = [];
            var el = this.el;
            var mesh = el.getObject3D('mesh');
            var self = this;
            // No mesh, no collisions
            if (!mesh) { return; }
            // Update the bounding box to account for rotations and
            // position changes.
            // mesh2= mesh.clone();
            // mesh2.position.set()
            // mesh2.rotation.set()
            // mesh2.scale.set()
            // let delta= (this.scanHeight/this.height) +1 - mesh.scale.y
            // if(this.once){
            //     console.log("delta",delta)
            //     this.once=false
            // }
            // mesh.scale.y += delta;
            // mesh.translateY( (delta*this.height) / 2 );

            updateBoundingBox();
            if(self.once){
                self.once=false;
            }
            // if(this.once){
            //     console.log("box",{box:self.boundingBox, min:self.elMin,max:self.elMax})
            //     this.once=false
            // }
            // Update collisions.
            this.els.forEach(intersect);
            // Emit events.
            collisions.forEach(handleHit);
            // Updated the state of the elements that are not intersected anymore.
            this.collisions.filter(function (el) {
                return collisions.indexOf(el) === -1;
            }).forEach(function removeState (el) {
                self.el.removeState(this.PRESSED_STATE)
                self.el.emit('pressurePlateUp', {},false);
                el.removeState(self.data.state);
            });
            // Store new collisions
            this.collisions = collisions;

            // AABB collision detection
            function intersect (el) {
                var intersected;
                var position= new THREE.Vector3()
                el.object3D.getWorldPosition(position);


                intersected=((position.x>self.elMin.x) &&(position.x<self.elMax.x))
                    &&((position.y>self.elMin.y)&&(position.y<(self.elMax.y+self.scanHeight)))
                    &&((position.z>self.elMin.z)&&(position.z<self.elMax.z))
                if (!intersected) { return; }
                collisions.push(el);
            }

            function handleHit (hitEl) {
                hitEl.addState(self.data.state);
                if(self.el.is(this.PRESSED_STATE)){return;}
                self.el.emit('pressurePlateDown', {},false);
                self.el.addState(this.PRESSED_STATE)
            }

            function updateBoundingBox () {
                boundingBox.setFromObject(mesh);
                self.boundingBox=boundingBox;
                self.elMin.copy(boundingBox.min);
                self.elMax.copy(boundingBox.max);
            }
        };
    })()
});
AFRAME.registerComponent('test', {

    init: function () {
        var el = this.el;  // <a-box>
        el.addEventListener("click", function () {
            el.setAttribute("color", '#665599');
        });
    }
});

AFRAME.registerComponent('condition-property', {
    multiple: true,
    schema: {
        property:{default: []},
        value: {default: "red"},
        target:{type:'selector'},
        type:{default:"number"},
        compare:{default:"equal"},
    },

    init: function () {
        console.log("condition-property",this.data)
        this.check=this.check.bind(this);
    },

    check: function (){
        const data=this.data
        if(!data.target){
            return false;
        }
        let currentValue=data.target.getAttribute(data.property[0]);
        for(let goDeeper=1;goDeeper<data.property.length; goDeeper++){
            currentValue=currentValue[data.property[goDeeper]];
        }
        let checkedValue;
        switch (data.type){
            case"number":
                checkedValue=parseFloat(data.value)
                break;
            case"bool":
                checkedValue=data.value==="true";
                break;
            default:
                checkedValue=data.value
        }

        switch (data.compare){
            case"greater":
                console.log("check:"+currentValue+" > "+checkedValue)
                return currentValue > checkedValue ;
            case"greaterequal":
                console.log("check:"+currentValue+" >= "+checkedValue)
                return currentValue >= checkedValue ;
            case"smaller":
                console.log("check:"+currentValue+" < "+checkedValue)
                return currentValue < checkedValue ;
            case"smallerequal":
                console.log("check:"+currentValue+" <= "+checkedValue)
                return currentValue <= checkedValue ;
            case"notequal":
                console.log("check:"+currentValue+" != "+checkedValue)
                return !(currentValue === checkedValue) ;
            default:
                console.log("check:"+currentValue+" = "+checkedValue)
                return currentValue === checkedValue ;
        }

    }
});

AFRAME.registerComponent('condition-interaction', {
    multiple: true,
    schema: {
        interaction: {default: ""},
        target:{type:'selector'},
    },

    init: function () {
        console.log("condition-interaction",this.data)
        this.check=this.check.bind(this);
        this.listenInteraction=this.listenInteraction.bind(this);
        this.interactionSeen=false;
        this.data.target.addEventListener("performedInteraction",this.listenInteraction)
    },



    listenInteraction: function(event){
        if(!event.detail.interaction){
            return;
        }
        if(event.detail.interaction===this.data.interaction){
            this.interactionSeen=true;
            this.data.target.removeEventListener("performedInteraction",this.listenInteraction)
        }

    },

    check: function (){
        return this.interactionSeen;
    }
});

AFRAME.registerComponent('condition-task', {
    multiple: true,
    schema: {
        task: {default: ""},
        target:{type:'selector'},
    },

    init: function () {
        console.log("condition-task",this.data)
        this.check=this.check.bind(this);
        this.listenTask=this.listenTask.bind(this);
        this.taskSeen=false;
        this.data.target.addEventListener("taskDone",this.listenTask)
    },



    listenTask: function(event){
        if(!event.detail.task){
            return;
        }
        if(event.detail.task===this.data.task){
            this.taskSeen=true;
            this.data.target.removeEventListener("taskDone",this.listenTask)
        }

    },

    check: function (){
        return this.taskSeen;
    }
});


AFRAME.registerComponent('condition-activity', {
    multiple: true,
    schema: {
        activity: {default: ""},
        target:{type:'selector'},
    },

    init: function () {
        console.log("condition-activity",this.data)
        this.check=this.check.bind(this);
        this.listenActivity=this.listenActivity.bind(this);
        this.activitySeen=false;
        this.data.target.addEventListener("activityDone",this.listenActivity)
    },



    listenActivity: function(event){
        if(!event.detail.activity){
            return;
        }
        if(event.detail.activity===this.data.activity){
            this.activitySeen=true;
            this.data.target.removeEventListener("activityDone",this.listenActivity)
        }

    },

    check: function (){
        return this.activitySeen;
    }
});

AFRAME.registerComponent('condition-checker-entity-area', {
    schema: {
        target:{type:'selector'},
    },

    init: function () {
        console.log("condition-checker-entity-area",this.data)
        this.boundingBox=null;
        this.mesh= this.el.getObject3D('mesh')
        this.boundingBox=new THREE.Box3();
        if(mesh){
            this.boundingBox.setFromObject(mesh);
        }

        this.check=this.check.bind(this);
    },

    check: function (){
        let data=this.data;
        if(!data.target || ! this.boundingBox|| !this.mesh){
            return false;
        }
        this.boundingBox.setFromObject(this.mesh);
        let target=new THREE.Box3();
        let meshTraget=data.target.getObject3D('mesh');
        if(!meshTraget){
            return false;
        }
        target.setFromObject(meshTraget);
        return this.boundingBox.containsBox(target);
    }
});

AFRAME.registerComponent('condition-checker-player-area', {
    schema: {
        target:{type:'selector'},
    },

    init: function () {
        console.log("condition-checker-player-area",this.data)
        this.boundingBox=null;
        this.mesh= this.el.getObject3D('mesh')
        this.boundingBox=new THREE.Box3();
        if(this.mesh){
            this.boundingBox.setFromObject(this.mesh);
        }

        this.check=this.check.bind(this);
    },

    check: function (){
        let data=this.data;
        if(!data.target || ! this.boundingBox||!this.mesh){
            return false;
        }
        this.boundingBox.setFromObject(this.mesh);
        let position= new THREE.Vector3()
        data.target.object3D.getWorldPosition(position);
        return this.boundingBox.containsPoint(position);
    }
});


AFRAME.registerComponent('condition-checker', {
    schema: {
        conditions:{default:[]},
    },

    init: function () {
        let data = this.data;
        console.log("condition-checker",this.data)
        let el = this.el;  // <a-box>
        this.conditionList=[]
        for (let index=0; index<data.conditions.length;index++){
            for (const [key, value] of Object.entries(this.el.components)) {
                if(data.conditions[index]===value.id){
                    this.conditionList.push(value);
                    break;
                }
            }
        }
        this.noCondition=this.conditionList.length<1;
        this.check=this.check.bind(this);
    },
    check: function (){
        if(this.noCondition){
            return true;
        }
        for(let index=0; index<this.conditionList.length; index++){
            if(!this.conditionList[index].check()){
                return false;
            }
        }
        return true;
    }
});

AFRAME.registerComponent('condition-check-forwarder', {
    multiple: true,
    schema: {
        condition: {default: ""},
        target:{type:'selector'},
        multicomponent:{default:true}
    },

    init: function () {
        let data = this.data;
        console.log("condition-check-forwarder",this.data)
        let el = this.el;  // <a-box>
        this.forwardTo=null;
        if(data.target&&data.condition){
            if(data.multicomponent){
                for (const [key, value] of Object.entries(data.target.components)) {
                    if (data.condition === value.id) {
                        this.forwardTo = value;
                        break;
                    }
                }

            }
            else{
                for (const [key, value] of Object.entries(data.target.components)) {
                    if (data.condition === value.attrName) {
                        this.forwardTo = value;
                        break;
                    }
                }
            }

        }
        this.check=this.check.bind(this);
    },
    check: function (){
        if(!this.forwardTo){
            return false;
        }
        return this.forwardTo.check();
    }
});