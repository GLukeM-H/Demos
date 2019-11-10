import React from 'react';
import Fractal from './fractalDemo';

class Demo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      demo: this.props.demo,
    };
  }
  render(){
    switch (this.state.demo){
      case 'fractal':
        return (
          <Fractal canvasId="demo"/>
        );
      default:
        return;
    }
  }
}



export default Demo;

/*
ReactDOM.render(
  <Demo demo="fractal" />,
  document.getElementById('root')
);

ReactDOM.render(
  <canvas id="myCanvas" width={300} height={150} />,
  document.getElementById('root')
);
*/