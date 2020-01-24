import * as math from 'mathjs';

onmessage = function(event){


	var state = event.data.state;
	var img = event.data.img;
	var start = event.data.start;
	
	//data formatting
	state.zoom = math.complex(state.zoom);
	state.center = math.complex(state.center);
	state.closeColor = [
		parseInt(state.closeColor.slice(1,3),16),
		parseInt(state.closeColor.slice(3,5),16),
		parseInt(state.closeColor.slice(5,),16),
		255
	];
	state.farColor = [
		parseInt(state.farColor.slice(1,3),16),
		parseInt(state.farColor.slice(3,5),16),
		parseInt(state.farColor.slice(5,),16),
		255
	];

	for (var y = start; y <= start+img.height; y++){
		
		for (var x = 0; x <= img.width; x++){
			var z = imgToComplex(x,y,state);

			var f = getFunc(state,z);

			for (var n = 0; n < state.iterations && modulus(z) <= state.boundary; n++){
				try {z = f(z)}
				catch(e) {
					postMessage(e.toString());
					return;
				}
			}
			if (modulus(z) > state.boundary){
				setPixel(img, x, y-start, color(n,state));
			}else{
				setPixel(img, x, y-start, [0,0,0,255])
			}
		}
	}
	postMessage({img: img, start: start});
	terminate();
}


function modulus(z){
	return math.sqrt((z.re)*(z.re) + (z.im)*(z.im));
}

function imgToComplex(x,y,state){
	var z = math.complex(2*x/state.width - 1,
	                     -2*y/state.height + 1);
	return math.chain(z)
	           .multiply(state.zoom)
	           .add(state.center)
	           .done();
}

function setPixel(imageData, x, y, color){
	var index = (x + y * imageData.width) * 4;
	for (var i = 0; i < 4; i++){
	  imageData.data[index + i] = color[i];
	}
}

function color(n,state){

	//f(t) = t*n + (1-n)*f
	//~~~~~~~~~~~~~~~~~~~~~~~~~~Use math.vector~~~~~~~~~~~~~~~~~~~~~~~~~~~

	return math.add(
		math.multiply(
			n/state.iterations,
			state.closeColor
		),
		math.multiply(
			(1 - (n/state.iterations)),
			state.farColor
		)
	).map((x) => math.round(x));
	/*
	return [math.round(255*(1-n/state.iterations)),
	        0, 
	        math.round(255*(n/state.iterations)),
	        255];
	*/
}

function getFunc(state,z0=0){
	return (z) => math.complex(
	                math.evaluate(
	                  state.expr.replace(/z0/g,`(${z0.toString()})`)
	                                 .replace(/z/g,`(${z.toString()})`)
	                )
	              );
}
