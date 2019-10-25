//const math = require('mathjs');
//importScripts('mathjs');
import * as math from 'mathjs';

onmessage = function(event){
	postMessage(event.data + math.evaluate('i + 2i').toString() + '\n');
};
/*
addEventListener('message',(event)=>{postMessage(event.data)});


dothis = function(event){
	postMessage(event.data + math.evaluate('i + 2i').toString() + '\n');
}

addEventListener('message', dothis);
*/