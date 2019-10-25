import * as math from 'mathjs';

onmessage = function(event){
	var state = event.data;
	for (var y = 0; y <= state.img.height; y++){
      for (var x = 0; x <= state.img.width; x++){
        var z = imgToComplex(x,y,state);
        
        var f = getFunc(state,z);
        
        for (var n = 0; n < state.iterations && modulus(z) <= state.boundary; n++){
          try {z = f(z)}
          catch(e) {
            alert("Problem in Fractal.renderFractal: "+e.toString());
            return;
          }
        }
        if (modulus(z) > state.boundary){
          setPixel(state.img, x,y, color(n,state));
        } 
      }
    }
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
	//~~~~~~~~~~~~~~~~~~~~~~~~~~Use math.vector~~~~~~~~~~~~~~~~~~~~~~~~~~~
	return [math.round(255*(1-n/state.iterations)),
	        0, 
	        math.round(255*(n/state.iterations)),
	        255];
}

function getFunc(state,z0=0){
	return (z) => math.complex(
	                math.evaluate(
	                  state.expr.replace(/z0/g,`(${z0.toString()})`)
	                                 .replace(/z/g,`(${z.toString()})`)
	                )
	              );
}
