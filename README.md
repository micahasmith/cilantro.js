cilantro.js
=============

In simple terms, cilantro.js is a state manager for html content. It makes animating/transitioning content easier. cilantro.js does not aim to perform the animation; rather its purpose is to help you manage state on animated content. The idea is that memory storage is faster than DOM storage. 

##Basic "Boxing/Tiling" Example

One thing that cilantro.js does very well is tiling. First you must create a `Manager`, which manages all of the content to be stored. Content in cilantro.js is stored in the `Box` object, which comes with default/built in positioning functionality.

Here is a basic example:

    <div id="wrapper"></div>
    <script type="text/javascript">
        $(function () {
            //setting what extend function i want to use, could be jquery or underscore
            ALLANDALL.Utils.extend = $.extend;

            //i'm attaching the manager at the window so you can check it out in the firebugs
            ////the manager holds all the data, its the api
            window.bm = new ALLANDALL.Cilantro.Manager({ containerID: "wrapper" }),
            box = {},
            iter = 0,
            randint = 0;

            for (; iter < 17; iter += 1) {
                //get some randomization in on the sizes
                var randint = Math.floor(Math.random() * 10) * 15;
                //create a box using the factory method
                box = bm.boxFactory({ width: (100 + randint), height: (100 + randint), html: "<p><h6>" + (iter + 1).toString() + "</h6> hi</p>" });
                //add it into the content manager
                bm.add(box);
            }

            //prepare uses the prep function to set the object's properties,
            //in this case (and by default) placing it in the first top left position
            bm.prepare();

            //this actually writes the data into the DOM
            bm.paint();
        });
    </script>`
	
The end result is tiled boxes, automatically positioned in the first available space.

##Using Transitions and Animating

Here is where cilantro.js really makes your job easy--when you want to animate from one state to another. Instead of storing data in the DOM, or doing calculations on the DOM on the fly, cilantro.js has a built in memory for the data you need.

Specifically, cilantro.js has a two stage memory:

 + It saves the current state of the data
 + It saves the next state of the data, after you call `prepare()` (which also moves the current state into the previous state register)
 
Here is a quick example of how to transition the previous "basic" example to repaint via animation on a `window.resize` event.

    <div id="wrapper"></div>
        <script type="text/javascript">
        $(function () {
            //setting what extend function i want to use, could be jquery or underscore
            ALLANDALL.Utils.extend = $.extend;

            //i'm attaching the manager at the window so you can check it out in the firebugs
            ////the manager holds all the data, its the api
            window.bm = new ALLANDALL.Cilantro.Manager({ containerID: "wrapper" }),
            box = {},
            iter = 0,
            randint = 0,
            timeout = false,
            timeoutmax = 500;

            for (; iter < 17; iter += 1) {
                //get some randomization in on the sizes
                var randint = Math.floor(Math.random() * 10) * 15;
                //create a box using the factory method
                box = bm.boxFactory({ width: (100 + randint), height: (100 + randint), html: "<p><h6>" + (iter + 1).toString() + "</h6> hi</p>" });
                //add it into the content manager
                bm.add(box);
            }

            //prepare uses the prep function to set the object's properties,
            //in this case (and by default) placing it in the first top left position
            bm.prepare();

            //this actually writes the data into the DOM
            bm.paint();

            //now is where all the magic occurrs!
            ////make the box auto paint on window resizing with some sweet easing
            $(window).resize(function () {
                //jquery ui easing options
                var easing = "easeInOutExpo",
                //i'm going to pass this function into the manager's transition function,
                ////functional programming-style
                transitionFunc = function (oldone, newone, state) {
                    $("#" + oldone.id, state.getContainer()).animate({
                        top: [newone.top, easing],
                        left: [newone.left, easing]
                    }, 500, function () { });
                };

                //using timeout for some throttling
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    //calling prepare() will reposition the data for the new container width
                    bm.prepare();
                    //and transistion will paint it using the specified transistion
                    bm.transition(transitionFunc);
                }, timeoutmax);


            });
        });
    </script>