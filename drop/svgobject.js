var Drop = Drop || {};

Drop.Event = {
    CLICK: 0
};

Drop.SvgObject = function (playpen, svg, callback) {
    Drop.GameObject.call(this);

    if(!(playpen instanceof Drop.Playpen)) {
        throw "Invalid playpen!"
    }

    this.node = playpen.create(svg, callback);

    Object.defineProperty(this, "playpen", {
        writable : false,
        value : playpen
    });

    Object.defineProperty(this, "x", {
        configurable : true,
        get : function () {
            return Number(this.node.getAttribute("x"));
        },
        set : function (value) {
            if(isNaN(Number(value))) {
                throw "Invalid x!";
            }
            this.node.setAttribute("x", String(value));
        }
    });

    Object.defineProperty(this, "y", {
        configurable : true,
        get : function () {
            return Number(this.node.getAttribute("y"));
        },
        set : function (value) {
            if(isNaN(Number(value))) {
                throw "Invalid y!";
            }
            this.node.setAttribute("y", String(value));
        }
    });

    Object.defineProperty(this, "class", {
        get : function() {
            return this.node.getAttribute("class");
        },
        set : function (value) {
            this.node.setAttribute("class", value);
        }
    })
};

Drop.SvgObject.prototype = Object.create(Drop.GameObject.prototype);
Drop.SvgObject.prototype.constructor = Drop.GameObject;

Drop.SvgObject.prototype.finalize = function () {
    this.playpen.remove(this.node);
};

Drop.SvgObject.prototype.registerEvent = function (type, func) {
    switch (type) {
        case Drop.Event.CLICK: this.node.addEventListener("mousedown", func); break;
        default : return false;
    }

    return true;
};

Drop.SvgObject.prototype.removeEvent = function (type) {
    switch (type) {
        case Drop.Event.CLICK: this.node.removeEventListener("mousedown"); break;
        default : return false;
    }

    return true;
};