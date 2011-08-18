/**
 * @author micahsmith
 */
var ALLANDALL = ALLANDALL || {};
ALLANDALL.Cilantro={};
ALLANDALL.Cilantro.PositionStrategies={};

ALLANDALL.Cilantro.Manager=new function(){
	if(!(this instanceof ALLANDALL.Cilantro.Manager)){
		return new ALLANDALL.Cilantro.Manager();
	}
	var defaults={
		containerID="container",
		container=document.getElementById(containerID),
		basis = [],
		oldperspective=[],
		newperspective=[],
        margin = [10,10],
        currentX = 0,
        currentY = 0,
        addToX = 0,
        addToY = 0,
		nextAddToY = margin,
        currentID = 0,
		containerWidth = container.clientWidth(),
        containerHeight = container.clientHeight(),
		onRow = 0,
		nextRow = 0,
        tempbox = {},
	};
};
ALLANDALL.Cilantro.Box=function box() {
    if(!(this instanceof box)) {
       return new box();
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
ALLANDAll.Cilantro.prototype.init(options) {
	this.defaults=$(this.defaults,options);
}
ALLANDALL.Cilantro.PositionStrategies.GetFirstTopY=function() {
	
};
ALLANDALL.Cilantro.PositionStrategies.PlaceFirstTopLeft = function(managerState, newindexboxes, newbox){
	
	
	for (; iter < datalen; iter += 1) {
		if (this.addToX === 0 && this.addToX !== this.margin) {
			this.addToX = this.margin;
		}
		if ((this.addToX + this.newbox.width + margin * 2) > this.containerWidth) {
			this.addToX = this.margin;
			this.onRow += 1;
		}
		if (this.onRow === this.nextRow) {
			if (this.newbox.height + this.addToY > this.nextAddToY) {
				this.nextAddToY = this.newbox.height + this.addToY;
			}
		}
		if (this.onRow !== this.nextRow) {
			this.nextRow += 1;
			this.addToY = this.nextAddToY + this.margin * 2;
		}
		newbox.onrow = this.onRow;
		newbox.setLeft(addToX);
		newbox.setTop(process(newindexboxes, newbox));
		this.addToX = this.newbox.left + this.newbox.width + this.margin * 2;
		return newbox;
	}
}
}
