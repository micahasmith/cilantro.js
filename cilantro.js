/**
 * @author micahsmith
 */
$.fn.cilantro=function(options){
	var me=$(this);
	defaults=$.extend({container:me},options),
	bm=new $.fn.cilantroboxManager(defaults);
	me.data("cilantro",bm);
	return this;
};
$.fn.cilantrobox = function(){
	if(!(this instanceof $.fn.cilantrobox)) {
	       return new $.fn.cilantrobox();
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
		       //if (idPrefix === undefined) {
		       //    idPrefix = "";
		       //}
			   //this.id=idPrefix+this.id;
		       return '<div class="box" id="' + this.id + '" style="position:absolute; top:' + this.top + 'px; left:' + this.left + 'px; width:' + this.width + 'px; height:' + this.height + 'px;">' + this.html + '</div>';
		   };
		   this.toString=function() {
			return "id="+this.id+" left="+this.left+" top="+this.top+" right="+this.right+" bottom="+this.bottom;
		   };
	    this.reset = function () {
			////console.log("reseting");
	        this.left = 0, this.top = 0, this.bottom=0,this.right=0, this.onrow = 0;
	    };
};
$.fn.cilantroboxManager=function (options) {
    //an array that contains at index 0 the base data
    //at other indexes, rendered versions of the base data
    var basis = [],
		oldperspective=[],
		newperspective=[],
        margin = 10,
        currentX = 0,
        currentY = 0,
        addToX = 0,
        addToY = 0,
		nextAddToY = margin,
        currentID = 0,
        container = $("#container"),
		containerWidth = container.width(),
        containerHeight = container.height(),
		onRow = 0,
		nextRow = 0,
        tempbox = {},
        l = function (text) { console.log(text); },
		getID = function () {
		    return (currentID++).toString();
		},
		
        //if test is above thisbox
        isAbove=function(thisBox,test) {
            if (thisBox.left >= test.left && thisBox.left + margin <= test.left + test.width) {
		                    return true;
		            }
		            if (thisBox.right + margin >= test.left && thisBox.right + margin <= test.right) {
		                    return true;
		            }
        },
        isLeft = function(thisBox,test) {
            if (thisBox.bottom >= test.bottom && thisBox.bottom + margin <= test.bottom + test.height) {
		                    return true;
		            }
		            if (thisBox.top + margin >= test.bottom && thisBox.top + margin <= test.top) {
		                    return true;
		            }
        },
    process = function (newindexboxes, item) {
        var i = 0,
			boxlen = newindexboxes.length
        tbox = {},
			maxy = margin;
        for (; i < boxlen; i += 1) {
            tbox = newindexboxes[i];
            if ((tbox.bottom + margin) > maxy && ((tbox.right > item.left - margin && tbox.right < item.right + margin) || (tbox.left > item.left - margin && tbox.left < item.right + margin) || (tbox.left < item.left && tbox.right > item.left))) {
                //////console.log("using maxy from "+tbox.toString()+ " for " +item.toString());
                maxy = tbox.bottom + margin;
                //winnerbox=boxes[i];
            }
        }
        ////console.log("using maxy from "+winnerbox.toString()+ " for " +item.toString());
        return maxy + margin;
    },
        resetPaint = function () {
            //l("resetpaint");
            addToX = 0, addToY = 0, onRow = 0, nextRow = 0,
            containerWidth = container.width();

        },
    calculateBounds = function (newindexboxes, newbox) {
        //l("calculateBounds");
        if (addToX === 0 && addToX !== margin) {
            addToX = margin;
        }
        if ((addToX + newbox.width + margin * 2) > containerWidth) {
            addToX = margin;
            onRow += 1;
        }
        if (onRow === nextRow) {
            if (newbox.height + addToY > nextAddToY) {
                nextAddToY = newbox.height + addToY;
            }
        }
        if (onRow !== nextRow) {
            nextRow += 1;
            addToY = nextAddToY + margin * 2;
        }
        newbox.onrow = onRow;
        newbox.setLeft(addToX);
        newbox.setTop(process(newindexboxes, newbox));
        addToX = newbox.left + newbox.width + margin * 2;
        return newbox;
    },
        addBox = function (newbox) {
            basis.push(newbox);
        },
    boxFactory = function (defaults) {
        tempbox = new $.fn.cilantrobox();
        if (defaults !== 'undefined') {
            tempbox = $.extend(tempbox, defaults);
        }
        tempbox.id = currentID;
        currentID += 1;
        return tempbox;
    },
    //render gets the last perspective and paints it
    render = function () {
        var boxlength = 0,
		iter=0,
        $container = $(container);
        boxlength = newperspective.length;
        $container.html("");
        for (; iter < boxlength; iter += 1) {
            $container.append(newperspective[iter].getHtml(""));
        }
        $container.find("div").hide().show("slow");
    },
    prep = function () {
        //l("paint");
        var i = 0,
        boxlength = basis.length,
        newindexboxes = [],
        newbox = {};
        resetPaint();
        for (; i < boxlength; i += 1) {
            //make the new perspective of the base data, 
            //push it into the new perspective array
            newbox = new $.fn.cilantrobox();
            newbox = $.extend(newbox, basis[i]);
            newindexboxes.push(calculateBounds(newindexboxes, newbox));
        }
        //add the perspective to all of them
        oldperspective=newperspective;
		newperspective=newindexboxes;
    },
    transition = function (itemfunction) {
        var i = 0,
        boxlen = basis.length;
        for (; i < boxlen; i += 1) {
            itemfunction(oldperspective[i], newperspective[i], container);
        }
    },
    
    alterBasis = function (alterationFunc) {
        alterationFunc(basis)

    },
	init=function(options){
		var instance=$.extend(this,options);
		this.container=$(instance.container);
		this.width=instance.width;
		this.height=instance.height;
		this.margin=instance.margin;
		this.container.css({"height":this.height,"width":this.width});
		
	};
	init(options);
    //return functions we select as the public api, not the private data
    return {
        addBox: addBox,
        boxFactory: boxFactory,
        prep: prep,
        render: render,
        transition: transition,
        alterBasis: alterBasis
    };

};



