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
import { Fractal, FractalOptions } from 'components/dashboard-components';

class FractalLayout extends React.Component {

	render() {

		return (
			<div>
				<Row>
					<Col sm={6} lg={8}>
						<FractalOptions />
					</Col>
				</Row>
				<Row>
					<Col sm={6} lg={4}>
						<Fractal />
					</Col>
				</Row>
			</div>
		);
	}
}

export default FractalLayout;