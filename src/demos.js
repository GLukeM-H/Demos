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

class Fractal extends React.Component {
  constructor(props){
    super(props);
    var size = 200;
    this.state = {
      canvasId: this.props.canvasId,
      width: size,
      height: size,
      expr: 'z^2 + z0',
      zoom: '2',
      center: '0',
      iterations: 1,
      smallColor: [0,0,255,255],
      largeColor: [255,0,0,255],
      boundary: 2,
      img: null,
    };
    
    this.initState = this.state;
  }

  //~~~~~~~~~~~~~~~~~~~Generator methods~~~~~~~~~~~~~~~~
  
  modulus(z){
    return math.sqrt((z.re)*(z.re) + (z.im)*(z.im));
  }
  
  imgToComplex(x,y){
    var z = math.complex(2*x/this.state.width - 1,
                         -2*y/this.state.height + 1);
    return math.chain(z)
               .multiply(this.state.zoom)
               .add(this.state.center)
               .done();
  }
  
  setPixel(imageData, x, y, color){
    var index = (x + y * imageData.width) * 4;
		for (var i = 0; i < 4; i++){
      imageData.data[index + i] = color[i];
    }
  }

  color(n){
    //~~~~~~~~~~~~~~~~~~~~~~~~~~Use math.vector~~~~~~~~~~~~~~~~~~~~~~~~~~~
    return [math.round(255*(1-n/this.state.iterations)),
            0, 
            math.round(255*(n/this.state.iterations)),
            255];
  }

  getFunc(z0=0){
    return (z) => math.complex(
                    math.evaluate(
                      this.state.expr.replace(/z0/g,`(${z0.toString()})`)
                                     .replace(/z/g,`(${z.toString()})`)
                    )
                  );
  }

  renderWithWorker(){
    var setState = (state) => this.setState(state);
    var canvas = document.getElementById(this.state.canvasId);
    var ctx = canvas.getContext("2d");
    var fractalData = ctx.createImageData(this.state.width, this.state.height);
    var worker = new fractalWorker();
    worker.onmessage = function(event){
      if (typeof(event.data) == 'string'){
        alert('problem generating fractal: '+event.data);
        return;
      }
      fractalData = event.data;
      setState(fractalData);
      ctx.putImageData(fractalData,0,0);
    }
    
    this.setState({img:fractalData}, () => {worker.postMessage(this.state)});

  }
  
  renderFractal(){
    var canvas = document.getElementById(this.state.canvasId);
    var ctx = canvas.getContext("2d");
    var fractalData = ctx.createImageData(this.state.width, this.state.height);
    for (var y = 0; y <= fractalData.height; y++){
      for (var x = 0; x <= fractalData.width; x++){
        var z = this.imgToComplex(x,y);
        
        var f = this.getFunc(z);
        
        for (var n = 0; n < this.state.iterations && this.modulus(z) <= this.state.boundary; n++){
          try {z = f(z)}
          catch(e) {
            alert("Problem in Fractal.renderFractal: "+e.toString());
            return;
          }
        }
        if (this.modulus(z) > this.state.boundary){
          this.setPixel(fractalData, x,y, this.color(n));
        } 
      }
    }

    ctx.putImageData(fractalData,0,0);
    
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

  handleSize(event) {
    this.setState({
      width: event.target.value,
      height: event.target.value
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
        },
        this.renderWithWorker
      );
    }
    catch(e) {
      alert('Problem in Fractal.handleUpdate: '+e.toString());
    }

    event.preventDefault();
  }

  componentDidMount() {
    this.renderWithWorker();
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
              <tr>
                <td>size:</td>
                <td>
                  <input
                    type="number"
                    min="50"
                    max="800"
                    onChange={e => this.handleSize(e)}
                    value={this.state.height}
                  />
                </td>
              </tr>
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
          width={this.state.width} 
          height={this.state.height}
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