import React from "react";
import fractalWorker from 'workers/fractal.worker.js';
import * as math from "mathjs";

import {
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	Input,
	Table,
	Tooltip,
	Button,
	Row,
} from 'reactstrap';

class Fractal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {justFinished: false};
		this.working = new Set();
		this.workers = [];
		this.alert = '';
	}


	renderFractal(){
		const canvas = this.refs.canvas;
		const ctx = canvas.getContext("2d");
		var h = Math.floor(this.props.state.height/this.props.state.pieces);
		var start;
		var fractalPiece;

		for (var i = 0; i < this.workers.length; i++){

			fractalPiece = ctx.createImageData(
				this.props.state.width,
				h + (i==(this.props.state.pieces-1))*(this.props.state.height - (h*this.props.state.pieces))
			);

			this.workers[i].onmessage = (function(event){
				if (event.data.alert != ''){
					this.alert = 'A problem occurred generating the fractal:\n' + event.data.alert;
				}else{
					ctx.putImageData(event.data.img, 0, event.data.start);
				}
				//******************not able to delete on error**********************
				if (this.working.delete(event.data.start) && this.working.size == 0){
					this.setState({justFinished: true});
				}
			}).bind(this);

			start = h*i;
		  	this.working.add(start);
			this.workers[i].postMessage({state: this.props.state, img: fractalPiece, start: start});
		}

	}

	terminateWorkers() {
		this.workers.forEach(e => e.terminate());
		this.workers = [];
	}

	addWorkers() {
		for (var i = this.workers.length; i < this.props.state.pieces; i++){
			this.workers.push(new fractalWorker());
		}
	}

	componentDidUpdate() {
		if (this.state.justFinished){
			this.setState({justFinished: false});
			if (this.alert != '') {alert(this.alert); this.alert = ''}
			this.props.done();
		}else if(this.props.terminate){
			this.terminateWorkers();
		}else if(this.props.redraw){
			this.addWorkers();
			this.renderFractal();
		}
	}


	render() {

		return (
			<div>
				<Card>
					<CardBody>
						<CardTitle className="mb-0"><i className="mdi mdi-image-filter-vintage"> </i>Fractal</CardTitle>
					</CardBody>
					<CardBody className="border-top">
						<center>
							<canvas ref="canvas" width={this.props.state.width} height={this.props.state.height} />
						</center>
					</CardBody>
				</Card>
			</div>
		);
	}
}


export default Fractal;