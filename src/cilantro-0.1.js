/**
 * @author micahsmith
 */
var ALLANDALL = ALLANDALL || {};
ALLANDALL.Utils={};
ALLANDALL.Utils.extend = function () { };
ALLANDALL.Cilantro={};
ALLANDALL.Cilantro.PositionStrategies = {};
ALLANDALL.Cilantro.PaintStrategies = {};
ALLANDALL.Cilantro.Memento = function () {
    var container = null;
    if (!(this instanceof ALLANDALL.Cilantro.Memento)) {
        return new ALLANDALL.Cilantro.Memento();
    }
    this.containerID = "";
    
    this.getContainer = function () {
        if (container === null) {
            container = document.getElementById(this.containerID);
        }
        return container;
    };
    this.getContainer();
    this.getContainerWidth = function() { return this.getContainer().clientWidth;};
    this.getContainerHeight = function(){ return this.getContainer().clientHeight;};

    this.basis = [];
    this.oldperspective = [];
    this.newperspective = [];

    this.margin = [10, 10];

    this.boxPrototype = undefined;
    this.currentID = 0;
    this.prepFunction = ALLANDALL.Cilantro.PositionStrategies.placeFirstTopLeft;
    this.paintFunction = ALLANDALL.Cilantro.PaintStrategies.simple;
}
ALLANDALL.Cilantro.Manager = function (options) {
    if (!(this instanceof ALLANDALL.Cilantro.Manager)) {
        return new ALLANDALL.Cilantro.Manager(options);
    }
    this.state = new ALLANDALL.Cilantro.Memento();
    this.state = $.extend(this.state, options);
    //initialization work
    this.init();
};
ALLANDALL.Cilantro.Manager.prototype.init = function () {
    if (this.state.getContainer() !== null) {
        this.state.getContainer().appendChild(this.getContainerPrototype());
    }
};
ALLANDALL.Cilantro.Manager.prototype.getContainerPrototype = function () {
    var c = document.createElement("div");
    c.style.position = "relative";
    return c;
};
ALLANDALL.Cilantro.Manager.prototype.boxFactory = function (options) {
    var tempbox = new ALLANDALL.Cilantro.Box(),
    defaults = this.state.boxPrototype,
    containerID = this.state.containerID;

    if (defaults !== undefined) {
        tempbox = ALLANDALL.Utils.extend(tempbox, defaults);
    }
    tempbox = ALLANDALL.Utils.extend(tempbox, options);
    tempbox.id = containerID + this.state.currentID.toString();
    this.state.currentID += 1;
    return tempbox;
};
ALLANDALL.Cilantro.Manager.prototype.add = function (box) {
    this.state.basis.push(box);
};
ALLANDALL.Cilantro.Manager.prototype.prepare = function (prepFunc) {
    var rFunc = this.state.prepFunction;
    if (prepFunc !== undefined) {
        rFunc = prepFunc;
    }
    this.state.oldperspective = this.state.newperspective;
    this.state.newperspective = [];
    rFunc(this.state);
};
ALLANDALL.Cilantro.Manager.prototype.paint = function () {
    var iter = 0,
    boxes = this.state.newperspective,
    boxlen = boxes.length,
    paintfunc = this.state.paintFunction,
    c = this.state.getContainer().lastChild,
    html = document.createDocumentFragment();

    for (; iter < boxlen; iter += 1) {
        html.appendChild(paintfunc(boxes[iter]));
    }
    c.innerHtml = "";
    c.appendChild(html);
};
ALLANDALL.Cilantro.Box=function() {
    if(!(this instanceof ALLANDALL.Cilantro.Box)) {
       return new ALLANDALL.Cilantro.Box();
       }
   this.width = 0;
    this.height=0;
    this.left = 0;
    this.right=0;
    this.bottom=0;
    this.top=0;
    this.setLeft=function(val){ this.left=val;this.right=this.left+this.width;};
    this.setTop=function(val){ this.top=val; this.bottom=this.top+this.height;};
       this.class='';
	   this.onrow=0;
	   this.html = '';
	   this.getHtml = function () {
	       return '<div class="box" id="' + this.id + '" style="position:absolute; top:' + this.top + 'px; left:' + this.left + 'px; width:' + this.width + 'px; height:' + this.height + 'px;">' + this.html + '</div>';
	   };
	   this.toString=function() {
		return "id="+this.id+" left="+this.left+" top="+this.top+" right="+this.right+" bottom="+this.bottom;
	   };
    this.reset = function () {
        this.left = 0, this.top = 0, this.bottom=0,this.right=0, this.onrow = 0;
    };
};


ALLANDALL.Cilantro.PositionStrategies.placeFirstTopLeft = function (state) {
    var basis = state.basis,
        basislen = basis.length,
	iter = 0,
    addToX = 0,
    addToY = 0,
    nextAddToY=0,
    yMargin = state.margin[0],
    xMargin = state.margin[1],
    onRow = 0,
    nextRow=0,
    containerWidth = state.getContainerWidth(),
    containerHeight = state.getContainerHeight(),
    newbox = {},
    newperspective = state.newperspective;

    for (; iter < basislen; iter += 1) {
        newbox = new ALLANDALL.Cilantro.Box();
        newbox = ALLANDALL.Utils.extend(newbox, basis[iter]);
        if (addToX === 0 && addToX !== xMargin) {
            addToX = xMargin;
        }
        if ((addToX + newbox.width + xMargin * 2) > containerWidth) {
            addToX = xMargin;
            onRow += 1;
        }
        if (onRow === nextRow) {
            if (newbox.height + addToY > nextAddToY) {
                nextAddToY = newbox.height + addToY;
            }
        }
        if (onRow !== nextRow) {
            nextRow += 1;
            addToY = nextAddToY + yMargin * 2;
        }
        newbox.onrow = onRow;
        newbox.setLeft(addToX);
        newbox.setTop(ALLANDALL.Cilantro.PositionStrategies.getFirstTopY(state, newbox));
        addToX = newbox.left + newbox.width + xMargin * 2;
        newperspective.push(newbox);
    }
};
ALLANDALL.Cilantro.PositionStrategies.getFirstTopY = function (state, box) {
    var i = 0,
    newindexboxes = state.newperspective,
    boxlen = newindexboxes.length,
    tbox = {},
    xMargin = state.margin[0],
    yMargin = state.margin[1],
	maxy = yMargin;
    for (; i < boxlen; i += 1) {
        tbox = newindexboxes[i];
        if ((tbox.bottom + yMargin) > maxy && ((tbox.right > box.left - xMargin && tbox.right < box.right + xMargin) || (tbox.left > box.left - xMargin && tbox.left < box.right + xMargin) || (tbox.left < box.left && tbox.right > box.left))) {
            //////console.log("using maxy from "+tbox.toString()+ " for " +item.toString());
            maxy = tbox.bottom + yMargin;
            //winnerbox=boxes[i];
        }
    }
    ////console.log("using maxy from "+winnerbox.toString()+ " for " +item.toString());
    return maxy + yMargin;
};

ALLANDALL.Cilantro.PaintStrategies.simple = function (box) {
    //return '<div class="box" id="' + this.id + '" style="position:absolute; top:' + this.top + 'px; left:' + this.left + 'px; width:' + this.width + 'px; height:' + this.height + 'px;">' + this.html + '</div>';

    var e = document.createElement("div");
    e.id = box.id;
    e.style.top = box.top + "px";
    e.style.left = box.left + "px";
    e.style.width = box.width + "px";
    e.style.height = box.height + "px";
    e.style.position = "absolute";
    e.className += "box";
    return e;
}