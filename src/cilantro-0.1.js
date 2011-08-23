/**
 * @author micahsmith
 */
var ALLANDALL = ALLANDALL || {};
ALLANDALL.Utils={};
ALLANDALL.Utils.extend=$.extend;
ALLANDALL.Cilantro={};
ALLANDALL.Cilantro.PositionStrategies = {};
ALLANDALL.Cilantro.PaintStrategies = {};
ALLANDALL.Cilantro.Memento = function () {
    if (!(this instanceof ALLANDALL.Cilantro.Memento)) {
        return new ALLANDALL.Cilantro.Memento();
    }
    this.containerID = "";
    this.container = null;
    this.getContainer = function () {
        if (this.container === null) {
            this.container = document.getElementById(this.containerID);
        }
        return this.container;
    };
    this.getContainer();
    this.containerWidth = this.getContainer() === null ? 0 : this.container.clientWidth;
    this.containerHeight = this.getContainer() === null ? 0 : this.container.clientHeight;

    this.basis = [];
    this.oldperspective = [];
    this.newperspective = [];

    this.margin = [10, 10];

    this.boxPrototype = undefined;
    this.currentID = 0;
    this.renderFunction = ALLANDALL.Cilantro.PositionStrategies.placeFirstTopLeft;
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
    if (this.state.container !== null) {
        this.state.container.appendChild(this.getContainerPrototype());
    }
};
ALLANDALL.Cilantro.Manager.prototype.getContainerPrototype = function () {
    if (this.state.container !== null) {
        this.state.container.appendChild(this.getContainerPrototype());
    }
};
ALLANDALL.Cilantro.Manager.prototype.boxFactory = function (options) {
    var tempbox = new ALLANDALL.Cilantro.Box(),
    defaults = this.state.boxPrototype,
    containerID = this.state.containerID;

    if (defaults !== 'undefined') {
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
ALLANDALL.Cilantro.Manager.prototype.prepare = function () {
    this.state.oldperspective = this.state.newperspective;
    this.state.newperspective = [];
    this.state.renderFunction(this.state);
};
ALLANDALL.Cilantro.Manager.prototype.paint = function () {
    var iter = 0,
    boxes = this.state.newperspective,
    boxlen = boxes.length,
    paintfunc = this.state.paintFunction,
    html = document.createDocumentFragment();

    for (; iter < boxlen; iter += 1) {
        html.appendChild(paintfunc(boxes[iter]));
    }
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
    containerWidth = state.containerWidth,
    containerHeight = state.containerHeight,
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
        if ((tbox.bottom + yMargin) > maxy && ((tbox.right > item.left - xMargin && tbox.right < item.right + xMargin) || (tbox.left > item.left - margin && tbox.left < item.right + margin) || (tbox.left < item.left && tbox.right > item.left))) {
            //////console.log("using maxy from "+tbox.toString()+ " for " +item.toString());
            maxy = tbox.bottom + yMargin;
            //winnerbox=boxes[i];
        }
    }
    ////console.log("using maxy from "+winnerbox.toString()+ " for " +item.toString());
    return maxy + yMargin;
};

ALLANDALL.Cilantro.PaintStrategies.simple = function (box) {
    
}