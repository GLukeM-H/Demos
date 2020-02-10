import React from "react";
import {
	Card,
	CardBody,
	CardImg,
	CardText,
	CardTitle,
	CardSubtitle,
	Input,
	Table,
	Tooltip,
	Button,
	Row,
	Col
} from 'reactstrap';
import { Fractal, FractalOptions} from 'components/dashboard-components';

class FractalLayout extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			terminate: false,
			loading: false,
			parameters: {
				square: true,
				expr: "z^2 + z0",
				iterations: 10,
				center: "0",
				zoom: "1/2",
				closeColor: "#ff0505",
				farColor: "#ffffff",
				height: 100,
				width: 100,
				pieces: 10,
				boundary: 2,
			}
		};
	}

	terminateFractal() {
		this.setState({
			terminate: true,
			loading: false
		});
	}

	updateFractal(state) {
		this.setState({
			parameters: state,
			terminate: false,
			loading: true
		});
	}

	doneLoading() {
		this.setState({
			loading: false
		});
	}

	render() {

		return (
			<div>
				<Row>
					<Col sm={4}>
						<FractalOptions
							parameters={this.state.parameters}
							update={state => this.updateFractal(state)}
							terminate={() => this.terminateFractal()}
							loading={this.state.loading}
						/>
					</Col>
					<Col>
						<Fractal
							state={this.state.parameters}
							terminate={this.state.terminate}
							redraw={this.state.loading}
							done={() => this.doneLoading()}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

export default FractalLayout;