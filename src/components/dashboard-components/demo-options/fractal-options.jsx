import React from "react";

import {
	Card,
	CardBody,
	CardTitle,
	CardSubtitle,
	Input,
	Table,
	Tooltip,
	Container,
	Row,
	Col,
	Button,
	ButtonGroup,
	ButtonGroupAddon,
	Form,
	FormGroup,
	Label,
	FormText,
	InputGroup,
	InputGroupAddon,
	InputGroupText,
	Popover,
	PopoverHeader,
	PopoverBody,
	ListGroup,
	ListGroupItem
} from 'reactstrap';

class FractalOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			...this.props.parameters,
			square: 1,
			popover: 'none'
		};
	}

	handleExpr(event) {
		var n = event.target.value.search(/[^0-9zi+\-*\/^(). ]/);
		if (n == -1) this.setState({expr: event.target.value});
	}

	handleIterations(event) {
		if (event.target.value < 0) {
			alert("Number of iterations cannot be negative");
			return;
		}
		this.setState({iterations: event.target.value});
	}

	handleCenter(event) {
		var n = event.target.value.search(/[^0-9i+\-*\/^(). ]/);
		if (n == -1) this.setState({center: event.target.value});
	}

	handleZoom(event) {
		var n = event.target.value.search(/[^0-9i+\-*\/^(). ]/);
		if (n == -1) this.setState({zoom: event.target.value});
	}

	handleCloseColor(event) {
		this.setState({closeColor: event.target.value});
	}

	handleFarColor(event) {
		this.setState({farColor: event.target.value});
	}

	handleRadio(s) {
		this.setState({
			square: s,
			width: this.state.height
		});
	}

	handleHeight(event) {
		if (this.state.square) this.setState({width: event.target.value});
		this.setState({height: event.target.value});
	}

	handleWidth(event) {
		if (this.state.square) this.setState({height: event.target.value});
		this.setState({width: event.target.value});
	}

	handlePieces(event) {
		this.setState({pieces: event.target.value});
	}

	handlePopover(popover) {
		if (this.state.popover == popover) {this.setState({popover: 'none'})}
		else {this.setState({popover: popover})}
	}

	handleTerminate() {
		this.props.terminate();
	}

	handleUpdate() {
		let {square, popover, ...parameters} = this.state;
		this.props.update(parameters);
	}

	toggleTest() {
		this.setState({popover: 'test'});
	}

	render() {
		let button;
		if (this.props.loading){
			button = (
				<Button
					color="warning"
					onClick={() => this.handleTerminate()}>Cancel</Button>
			);
		}else{
			button = (
				<Button
					color="primary"
					onClick={() => this.handleUpdate()}>Render</Button>
			);
		}

		let functionLabel = 'Function';
		let badending = /(?:\+\s*$)|(?:\-\s*$)|(?:\*\s*$)|(?:\/\s*$)/;
		let mandelbrot = /^[\+\s]*z\s*(?:\*\s*z|\^\s*2)\s*\++[\+\s]*z0\s*$|^[\+\s]*z0\s*\++[\+\s]*z\s*(?:\*\s*z|\^\s*2)\s*$/;
		let julia = /^[^z]*z\s*(?:\*\s*z|\^\s*2)[^z]*$/;
		if (!badending.test(this.state.expr)){
			if (mandelbrot.test(this.state.expr)){functionLabel = "The Mandelbrot Set!"}
			else if (julia.test(this.state.expr)){functionLabel = "A Julia Set!"}
		}

		let functionPop = (
			<Popover placement="bottom" target="functionInput" isOpen={this.state.popover == 'functionPop'} toggle={() => this.handlePopover('functionPop')}>
				<PopoverHeader>The Complex Function</PopoverHeader>
				<PopoverBody>
					<div>
						&nbsp;&nbsp;&nbsp;Every pixel in the image is converted to a 
						complex number and becomes the first in a sequence of numbers<br/>
						&nbsp;&nbsp;&nbsp;z<sub>0</sub>, z<sub>1</sub>, z<sub>2</sub>,...
						&nbsp;&nbsp;&nbsp;where z<sub>n+1</sub> = f(z<sub>n</sub>)<br/>
						If this sequence never grows large, the original z<sub>0</sub> is
						considered to be in the set and is colored black in the final image.<br/>
						&nbsp;&nbsp;&nbsp;Use the following characters to define the fractal:
					</div>
					<Row>
						<Col sm={3}>&nbsp;&nbsp;&nbsp;<code>0</code>-<code>9</code></Col>
						<Col>decimal numbers</Col>
					</Row>
					<Row>
						<Col sm={3}>&nbsp;&nbsp;&nbsp;<code>z</code></Col>
						<Col>value of the previous iteration</Col>
					</Row>
					<Row>
						<Col sm={3}>&nbsp;&nbsp;&nbsp;<code>z0</code></Col>
						<Col>starting value at iteration 0</Col>
					</Row>
					<Row>
						<Col sm={3}>&nbsp;&nbsp;&nbsp;<code>i</code></Col>
						<Col>imaginary unit</Col>
					</Row>
					<Row>
						<Col sm={3}>&nbsp;&nbsp;&nbsp;<code>+-*/^</code></Col>
						<Col>arithmetic operators</Col>
					</Row>
				</PopoverBody>
			</Popover>
		);

		let centerPop = (
			<Popover placement="bottom" target="centerInput" isOpen={this.state.popover == 'centerPop'} toggle={() => this.handlePopover('centerPop')}>
				<PopoverHeader>The Center of the Image</PopoverHeader>
				<PopoverBody>
					&nbsp;&nbsp;&nbsp;The center can be any complex number.
					Use <code>i</code> to refer to the imaginary unit.<br/>
					For example: <code>1 + i/2</code>
				</PopoverBody>
			</Popover>
		);

		let magnificationPop = (
			<Popover placement="bottom" target="magnificationInput" isOpen={this.state.popover == 'magnificationPop'} toggle={() => this.handlePopover('magnificationPop')}>
				<PopoverHeader>Magnify and Rotate Image</PopoverHeader>
				<PopoverBody>
					&nbsp;&nbsp;&nbsp;Magnify by any complex number.
					The image will be magnified by the modulus
					and rotated by the argument.<br/>
					For example, to magnify by 2 and rotate by 90&deg; use{' '}
					<code>2i</code>
				</PopoverBody>
			</Popover>
		);

		let iterationsPop = (
			<Popover placement="bottom" target="iterationsInput" isOpen={this.state.popover == 'iterationsPop'} toggle={() => this.handlePopover('iterationsPop')}>
				<PopoverHeader>Maximum Number of Iterations</PopoverHeader>
				<PopoverBody>
					&nbsp;&nbsp;&nbsp;The set is defined by points that never 
					grow large after any number of iterations. More iterations
					show a better picture of the set. 
				</PopoverBody>
			</Popover>
		);

		let colorMostPop = (
			<Popover placement="bottom" target="colorMostInput" isOpen={this.state.popover == 'colorMostPop'} toggle={() => this.handlePopover('colorMostPop')}>
				<PopoverHeader>Color of Last Iteration</PopoverHeader>
				<PopoverBody>
					&nbsp;&nbsp;&nbsp;Points that don't look to be in the 
					set on the last iteration will be this color, and will 
					be closest to the boundary of the set. Points that 
					don't look to be in the set after many iterations will 
					be colored closer to this hue.
				</PopoverBody>
			</Popover>
		);

		let colorLeastPop = (
			<Popover placement="bottom" target="colorLeastInput" isOpen={this.state.popover == 'colorLeastPop'} toggle={() => this.handlePopover('colorLeastPop')}>
				<PopoverHeader>Color before Iteration</PopoverHeader>
				<PopoverBody>
					&nbsp;&nbsp;&nbsp;Points that don't look to be in the 
					set before the first iteration will be this color, 
					and will be furthest from the boundary of the set. 
					Points that don't look to be in the set in fewer 
					iterations will be colored closer to this hue.
				</PopoverBody>
			</Popover>
		);

		let heightPop = (
			<Popover placement="bottom" target="heightInput" isOpen={this.state.popover == 'heightPop'} toggle={() => this.handlePopover('heightPop')}>
				<PopoverHeader>Height of Image</PopoverHeader>
				<PopoverBody>
					&nbsp;&nbsp;&nbsp;Height of image in pixels. Changing 
					the height will stretch the image vertically.
				</PopoverBody>
			</Popover>
		);

		let widthPop = (
			<Popover placement="bottom" target="widthInput" isOpen={this.state.popover == 'widthPop'} toggle={() => this.handlePopover('widthPop')}>
				<PopoverHeader>Width of Image</PopoverHeader>
				<PopoverBody>
					&nbsp;&nbsp;&nbsp;Width of image in pixels. Changing 
					the width will stretch the image horizontally. 
					Changing from rectangle to square will change the 
					width to match the height.
				</PopoverBody>
			</Popover>
		);

		let workersPop = (
			<Popover placement="bottom" target="workersInput" isOpen={this.state.popover == 'workersPop'} toggle={() => this.handlePopover('workersPop')}>
				<PopoverHeader>Number of Web Workers</PopoverHeader>
				<PopoverBody>
					&nbsp;&nbsp;&nbsp;Web workers will split the work 
					of generating the fractal image. Adding more workers 
					will speed up the loading of a large image but may 
					slow down your browser.
				</PopoverBody>
			</Popover>
		);

		return (
			<div>
				<Card>
					<CardBody>
						<CardTitle className="mb-0"><i className = "mdi mdi-apps mr-2"></i>Fractal Parameters</CardTitle>
					</CardBody>
					<CardBody className="border-top">
						<Container>
							<Form>
								<FormGroup>
									<Row>
										<Col className="border-left p-2">
											<Button
												id="functionPopBtn"
												block
												outline
												color="secondary"
												style={{border: 'none'}}
												size="sm"
												onClick={() => this.handlePopover('functionPop')}
											>{functionLabel}
											</Button>
											{functionPop}
											<InputGroup>
												<InputGroupAddon addonType="prepend" >
													<InputGroupText>f(z) =</InputGroupText>
												</InputGroupAddon>
												<Input
													id="functionInput"
													type="text"
													value={this.state.expr}
													onChange={e => this.handleExpr(e)}
													placeholder="function in terms of z"
												/>
											</InputGroup>
										</Col>
									</Row>
									<Row className="mt-2">
										<Col className="border-left p-2">
											<Button
												id="centerPopBtn"
												block
												outline
												color="secondary"
												style={{border: 'none'}}
												size="sm"
												onClick={() => this.handlePopover('centerPop')}
											>Center
											</Button>
											{centerPop}
											<Input
												id="centerInput"
												type="text"
												value={this.state.center}
												onChange={e => this.handleCenter(e)}
												placeholder="center on any complex number"
											/>
										</Col>
										<Col className="border-left p-2">
											<Button
												id="magnificationPopBtn"
												block
												outline
												color="secondary"
												style={{border: 'none'}}
												size="sm"
												onClick={() => this.handlePopover('magnificationPop')}
											>Magnification
											</Button>
											{magnificationPop}
											<Input
												id="magnificationInput"
												type="text"
												value={this.state.zoom}
												onChange={e => this.handleZoom(e)}
												placeholder="magnify by any complex number"
											/>
										</Col>
										<Col className="border-left p-2">
											<Button
												id="iterationsPopBtn"
												block
												outline
												color="secondary"
												style={{border: 'none'}}
												size="sm"
												onClick={() => this.handlePopover('iterationsPop')}
											>Iterations
											</Button>
											{iterationsPop}
											<Input
												id="iterationsInput"
												type="number" 
												min="0"
												value={this.state.iterations}
												onChange={e => this.handleIterations(e)} 
											/>
										</Col>
									</Row>
									<Row className="mt-2">
										<Col className="border-left p-2">
											<Button
												id="colorMostPopBtn"
												block
												outline
												color="secondary"
												style={{border: 'none'}}
												size="sm"
												onClick={() => this.handlePopover('colorMostPop')}
											>Color of Last Iteration
											</Button>
											{colorMostPop}
											<Input
												id="colorMostInput"
												type="color"
												value={this.state.closeColor}
												onChange={e => this.handleCloseColor(e)}
											/>
										</Col>
										<Col className="border-left p-2">
											<Button
												id="colorLeastPopBtn"
												block
												outline
												color="secondary"
												style={{border: 'none'}}
												size="sm"
												onClick={() => this.handlePopover('colorLeastPop')}
											>Color before Iteration
											</Button>
											{colorLeastPop}
											<Input
												id="colorLeastInput"
												type="color"
												value={this.state.farColor}
												onChange={e => this.handleFarColor(e)}
											/>
										</Col>
									</Row>
									<Row className="mt-2">
										<Col className="border-left p-2">
											<Button
												id="heightPopBtn"
												block
												outline
												color="secondary"
												style={{border: 'none'}}
												size="sm"
												onClick={() => this.handlePopover('heightPop')}
											>Height
											</Button>
											{heightPop}
											<Input
												id="heightInput"
												type="number"
												min="1"
												value={this.state.height}
												onChange={e => this.handleHeight(e)}
											/>
										</Col>
										<Col className="border-left p-2">
											<Button
												id="widthPopBtn"
												block
												outline
												color="secondary"
												style={{border: 'none'}}
												size="sm"
												onClick={() => this.handlePopover('widthPop')}
											>Width
											</Button>
											{widthPop}
											<Input
												id="widthInput"
												type="number"
												min="1"
												value={this.state.width}
												onChange={e => this.handleWidth(e)}
											/>
										</Col>
										<Col className="border-left p-2">
											<InputGroup>
												<Button outline block onClick={() => this.handleRadio(1)} active={this.state.square}>Square</Button>
												<Button outline block onClick={() => this.handleRadio(0)} active={!this.state.square}>Rectangle</Button>
											</InputGroup>
										</Col>
									</Row>
									<Row className="mt-2">
										<Col className="border-left p-2">
											<Button
												id="workersPopBtn"
												block
												outline
												color="secondary"
												style={{border: 'none'}}
												size="sm"
												onClick={() => this.handlePopover('workersPop')}
											>Workers
											</Button>
											{workersPop}
											<Input
												id="workersInput"
												type="number"
												min="1"
												max="50"
												value={this.state.pieces}
												onChange={e => this.handlePieces(e)}
											/>
										</Col>
									</Row>
									<Row className="mt-2">
										<Col className="p-2">
											<center>
												{button}
											</center>
										</Col>
									</Row>
								</FormGroup>
							</Form>
						</Container>
					</CardBody>
				</Card>
			</div>
		);
	}
}

export default FractalOptions;