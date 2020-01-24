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