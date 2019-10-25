const math = require('mathjs');

self.addEventListener('message', onmessage);

onmessage = event => {
	self.postMessage(event.data + math.evaluate('i + 2i').toString() + '\n');
};
/*
onmessage = function(event){
	self.postMessage(event.data + math.evaluate('i + 2i').toString() + '\n');
}