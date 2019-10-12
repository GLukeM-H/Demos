self.addEventListener("onmessage", respond);
var n = 0;
function respond(event){
	postMessage(event.data + n + '\n');
	n += 1;
}