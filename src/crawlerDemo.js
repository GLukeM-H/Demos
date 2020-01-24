/*
Licensing Information:  You are free to use or extend these projects for
educational purposes provided that (1) you do not distribute or publish
solutions, (2) you retain this notice, and (3) you provide clear
attribution to UC Berkeley, including a link to http://ai.berkeley.edu.

This demo is adapted from a project on reinforcement learning from 
UC Berkeley's CS 188 course on AI. http://ai.berkeley.edu

The project was developed at UC Berkeley, primarily by
John DeNero (denero@cs.berkeley.edu) and Dan Klein (klein@cs.berkeley.edu).
*/
import React from 'react';
import * as math from 'mathjs';

class CrawlerDisplay extends React.component {
	constructor(props){
		super(props);
		this.state = {
			x: 0,
			y: 0,
		};
	}

	componentDidMount(){
		var canvas = document.getElementById(this.props.canvasId);
		var ctx = canvas.getContext("2d");

	}

	render(){
		return (<canvas id={this.props.canvasId} />);
	}
}

class Crawler {
	constructor(arms) {

		var pos = math.complex(0);
		var armAnchor = new Array(arms.length);
		for (var i = 0; i < armsPos.length; i++){
			armAnchor[i] = pos;
			pos = math.add(pos, arms[i]);
		}

		this.state = {
			body: arms[0],
			arms: arms.slice(1),
			armAnchor: armAnchor.slice(1),
			bodyAnchor: armAnchor[0],
		}


	}

	getBody() {
		return this.state.body;
	}

	getArm(i) {
		return this.state.arms[i];
	}

	getBodyAnchor() {
		return this.state.bodyAnchor;
	}

	getArmAnchor(i) {
		return this.state.armAnchor[i];
	}

	rotArm(i, rot) {
		/*
		if(math.sqrt((rot.re)*(rot.re) + (rot.im)*(rot.im)) != 1){
			return;
		}
		*/
		if (i >= this.state.arms.length){
			return;
		}else{
			this.state.arms[i] = math.multiply(rot,this.arms[i]);
			//reset anchors
			this.rotArm(i+1,rot);
		}
		
	}

	moveBody(newPos) {
		this.bodyPos = newPos;
	}

	updateState(newState) {
		
	}
}

export default CrawlerDisplay;