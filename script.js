var m = {t:250,r:50,b:250,l:50},
	width = document.getElementById('plot').clientWidth - m.l - m.r,
	height = document.getElementById('plot').clientHeight - m.t - m.b;

console.log(height)
var plot = d3.select('#plot')
	.append('svg')
	.attr('width',width+m.l+m.r)
	.attr('height',height+m.t+m.b)
	.append('g').attr('class','canvas')
	.attr('transform','translate('+m.l+','+m.t+')');

//Create scrollController
//create a global scroll controller
var scrollController = new ScrollMagic.Controller({
		globalSceneOptions:{
			triggerHook:'onLeave'
		}
	});

//create scenes
var scene1 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-1').clientHeight,
		triggerElement:'#scene-1',
		reverse:true
	})
	.on('enter',function(){
		d3.select('#plot').transition();
		draw("newData");
	})
	.on('end', function() {

	})
	.addTo(scrollController);

var scene2 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-2').clientHeight,
		triggerElement:'#scene-2',
		reverse:true
	})
	// .addIndicators()
	.on('start',function(e){
		if (e.scrollDirection == "REVERSE") {
			d3.select('#plot').transition();
			updateSlide(1);
		} else {
			d3.select('#plot').transition();
			updateSlide(2);
		}
	})
	.addTo(scrollController);

var scene3 = new ScrollMagic.Scene({
		duration:document.getElementById('scene-3').clientHeight,
		triggerElement:'#scene-3',
		reverse:true
	})
	.on('start',function(e){
		if (e.scrollDirection == "REVERSE") {
			d3.select('#plot').transition();
			updateSlide(2);
		} else {
			d3.select('#plot').transition();
			updateSlide(3);
		}

	})
	.addTo(scrollController);


