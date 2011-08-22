/**
 * @author micahsmith
 */
var ALLANDALL = ALLANDALL || {};
ALLANDALL.Utils={};
ALLANDALL.Utils.extend=$.extend;
ALLANDALL.Cilantro={};
ALLANDALL.Cilantro.PositionStrategies={};
ALLANDALL.Cilantro.Memento=function(){
	if(!(this instanceof ALLANDALL.Cilantro.Memento)){
		return new ALLANDALL.Cilantro.Memento();
	}
	this.containerID="container";
		this.container=document.getElementById(containerID);
		this.basis = [];
		this.oldperspective=[];
		this.newperspective=[];
        this.margin = [10,10];
        this.currentX = 0;
        this.currentY = 0;
        this.addToX = 0;
        this.addToY = 0;
		this.nextAddToY = margin;
        this.currentID = 0;
		this.containerWidth = container.clientWidth();
        this.containerHeight = container.clientHeight();
		this.onRow = 0;
		this.nextRow = 0;
        this.tempbox = {};
		this.renderFunction=ALLANDALL.Cilantro.PositionStrategies.PlaceFirstTopLeft;
}
ALLANDALL.Cilantro.Manager=function(options){
	if(!(this instanceof ALLANDALL.Cilantro.Manager)){
		return new ALLANDALL.Cilantro.Manager();
	}
	this.state=new ALLANDALL.Cilantro.Memento();
	this.state=$.extend(this);
};
ALLANDALL.Cilantro.Manager.prototype.prepare=function() {
	
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
ALLANDALL.Cilantro.Manager.prototype.init=function(options) {
	this.state=ALLANDALL.Utils.extend(this.state,options);
}
ALLANDALL.Cilantro.PositionStrategies.GetFirstTopY=function() {
	
};
ALLANDALL.Cilantro.PositionStrategies.PlaceFirstTopLeft = function(state){
	var basis=state.basis,
	datalen=basis.length,
	iter=0;
	
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
