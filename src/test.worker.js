//const math = require('mathjs');



self.onmessage = function(event){
	self.postMessage(event.data)
};
/*
addEventListener('message',(event)=>{postMessage(event.data)});


dothis = function(event){
	postMessage(event.data + math.evaluate('i + 2i').toString() + '\n');
}

addEventListener('message', dothis);
*/