const math = require('mathjs');

self.addEventListener('message', onmessage);


function onmessage(event){
	self.postMessage(event.data + math.evaluate('i + 2i').toString() + '\n');
}