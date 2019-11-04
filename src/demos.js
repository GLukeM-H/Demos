import React from 'react';
import * as math from 'mathjs';
import fractalWorker from './workers/fractal.worker.js';

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

class SizeInput extends React.Component {
  constructor(props){
    super(props);

    if(this.props.height == this.props.width) {
      var square = true;
    }else{
      var square = false;
    }

    this.state = {
      square: square,
      height: this.props.height,
      width: this.props.width,
    };
  }

  handleSquare(event){
    this.setState({
      height: event.target.value,
      width: event.target.value,
    },
    () => this.props.onChange(this.state.height,this.state.width)
    );
  }

  handleHeight(event){
    this.setState({
      height: event.target.value,
    },
    () => this.props.onChange(this.state.height,this.state.width)
    );

  }

  handleWidth(event){
    this.setState({width: event.target.value},
      () => this.props.onChange(this.state.height,this.state.width)
    );
  }

  handleRadioInput(event){
    if(event.target.value == "true"){
      this.setState({square: true, width:this.state.height},
        () => this.props.onChange(this.state.height,this.state.width)
      );
    }else{
      this.setState({square: false},
        () => this.props.onChange(this.state.height,this.state.width)
      );
    }
  }

  render(){
    const radioInput = (
      <tr>
        <td>square image:</td>
        <td>
          <input
            type="radio"
            name="square"
            value="true"
            onChange={e => this.handleRadioInput(e)}
          /> yes
          <input
            type="radio"
            name="square"
            value="false"
            onChange={e => this.handleRadioInput(e)}
          /> no
        </td>
      </tr>
    );
    const squareInput = (
      <tr>
        <td>size:</td>
        <td>
          <input
            type="number"
            min="50"
            max="800"
            onChange= {e => this.handleSquare(e)}
            value={this.state.height}
          />
        </td>
      </tr>
    );
    const heightInput = (
      <tr>
        <td>height:</td>
        <td>
          <input
            type="number"
            min="50"
            max="800"
            onChange={e => this.handleHeight(e)}
            value={this.state.height}
          />
        </td>
      </tr>
    );
    const widthInput = (
      <tr>
        <td>width:</td>
        <td>
          <input
            type="number"
            min="50"
            max="800"
            onChange={e => this.handleWidth(e)}
            value={this.state.width}
          />
        </td>
      </tr>
    );

    if(this.state.square){
      return [radioInput,squareInput];
    }else{
      return [radioInput,heightInput,widthInput];
    }
  }
}

class Fractal extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      canvasId: this.props.canvasId,
      width: 200,
      height: 200,
      expr: 'z^2 + z0',
      zoom: '2',
      center: '0',
      iterations: 10,
      smallColor: [0,0,255,255],
      largeColor: [255,0,0,255],
      boundary: 2,
      canvas: {height:0, width:0},
      pieces: 10,
    };
    
    this.initState = this.state;
  }
  
  renderFractal(){
    var canvas = document.getElementById(this.state.canvasId);
    var ctx = canvas.getContext("2d");
    var fractalData = ctx.createImageData(this.state.width, this.state.height);
    var workers = new Array(this.state.pieces);
    var h = Math.floor(this.state.height/this.state.pieces);
    var fractalPiece = ctx.createImageData(200, 100);

    for (var i = 0; i < this.state.pieces; i++){
      if(i){h += this.state.height - (h*this.state.pieces)};

      var fractalPiece = ctx.createImageData(this.state.width,
                                            h + (i==this.state.pieces-1)*(this.state.height - (h*this.state.pieces)));

      workers[i] = new fractalWorker();
      workers[i].onmessage = function(event){

        if (typeof(event.data) == 'string'){
          alert('problem generating fractal: ' + event.data);
          return;
        }
        ctx.putImageData(event.data.img, 0, event.data.start);
      }
      
      workers[i].postMessage({state: this.state, img: fractalPiece, start:h*i});
    }
    
  }
  
  //~~~~~~~~~~~~~~~Handlers~~~~~~~~~~~~~~~~~

  handleExpr(event) {
    var n = event.target.value.search(/[^0-9zi+\-*\/^(). ]/);
    if (n == -1) this.setState({expr: event.target.value});
  }

  handleIterations(event) {
    this.setState({iterations: event.target.value});
  }

  handleSmallColor(event) {
    this.setState({smallColor: event.target.value});
  }

  handleLargeColor(event) {
    this.setState({largeColor: event.target.value});
  }

  handleWidth(event) {
    this.setState({width: event.target.value});
  }

  handleHeight(event) {
    this.setState({height: event.target.value});
  }

  handleSizeInput(height, width) {
    this.setState({
      height: height,
      width: width,
    });
  }

  handleCenter(event) {
    var n = event.target.value.search(/[^0-9i+\-*\/^(). ]/);
    if (n == -1) this.setState({center: event.target.value});
  }

  handleZoom(event) {
    var n = event.target.value.search(/[^0-9i+\-*\/^(). ]/);
    if (n == -1) this.setState({zoom: event.target.value});
  }

  handleUpdate(event) {
    try {
      this.setState(
        {
          center: math.evaluate(this.state.center).toString(),
          zoom: math.evaluate(this.state.zoom).toString(),
          canvas: {width: this.state.width, height: this.state.height},
        },
        this.renderFractal
      );
    }
    catch(e) {
      alert('Problem in Fractal.handleUpdate: '+e.toString());
    }

    event.preventDefault();
  }

  componentDidMount() {
    this.setState({canvas: {width: this.state.width, height: this.state.height}},
                  this.renderFractal);
  }

  render() {
    
    return (
      <div>
        <form>
          <table>
            <tbody>
              <tr>
                <td>function:</td>
                <td>
                  <input
                    type="text"
                    onChange={e => this.handleExpr(e)}
                    value={this.state.expr}
                  />
                </td>
              </tr>
              <tr>
                <td>iterations:</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    onChange={e => this.handleIterations(e)}
                    value={this.state.iterations}
                  />
                </td>
              </tr>
              <tr>
                <td>center (complex):</td>
                <td>
                  <input
                    type="text"
                    onChange={e => this.handleCenter(e)}
                    value={this.state.center}
                  />
                </td>
              </tr>
              <tr>
                <td>zoom (complex):</td>
                <td>
                  <input
                    type="text"
                    onChange={e => this.handleZoom(e)}
                    value={this.state.zoom}
                  />
                </td>
              </tr>
              <tr>
                <td>iteration colors:</td>
                <td>
                  <input
                    type="color"
                    onChange={e => this.handleSmallColor(e)}
                    value={this.state.smallColor}
                  />
                </td>
                <td>
                  <input
                    type="color"
                    onChange={e => this.handleLargeColor(e)}
                    value={this.state.largeColor}
                  />
                </td>
              </tr>
              <SizeInput
                height={this.state.height}
                width={this.state.width}
                onChange={(h,w) => this.handleSizeInput(h,w)}
              />
              <tr>
                <td>
                  <input
                    type="submit"
                    value="Update"
                    onClick={e => this.handleUpdate(e)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </form>
        <canvas 
          id={this.state.canvasId} 
          width={this.state.canvas.width} 
          height={this.state.canvas.height}
        />
      </div>
    );
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