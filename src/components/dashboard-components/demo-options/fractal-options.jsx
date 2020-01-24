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
	Col
} from 'reactstrap';

class FractalOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			square: true,
		};
	}

	render() {
		return (
			<div>
				<Card>
					<CardBody>
						<CardTitle className="mb-0">Fractal Options</CardTitle>
					</CardBody>
					<CardBody>
						<Container>
							<Row>
								<Col>
									<div>function</div>
								</Col>
							</Row>
						</Container>
					</CardBody>
				</Card>
			</div>
		);
	}
}

export default FractalOptions;