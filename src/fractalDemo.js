import React from 'react';
import * as math from 'mathjs';
import fractalWorker from './workers/fractal.worker.js';


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
      closeColor: "#fcf796",
      farColor: "#8383fc",
      boundary: 2,
      canvas: {height:0, width:0},
      pieces: 10,
      loading: "",
    };
    
    this.initState = this.state;
  }
  
  renderFractal(){
    var canvas = document.getElementById(this.state.canvasId);
    var ctx = canvas.getContext("2d");
    var workers = new Array(this.state.pieces);
    var h = Math.floor(this.state.height/this.state.pieces);

    var remaining = this.state.pieces;
    var setState = (state) => this.setState(state);
    this.setState({loading: "loading..."});
    
    for (var i = 0; i < this.state.pieces; i++){

      try {
        var fractalPiece = ctx.createImageData(this.state.width,
                                              h + (i==(this.state.pieces-1))*(this.state.height - (h*this.state.pieces)));
      }
      catch(e){
        alert("There was a problem creating image data.\n"+e);
        this.setState({loading: ""});
        return;
      }
      workers[i] = new fractalWorker();
      workers[i].onmessage = function(event){
        if (typeof(event.data) == 'string'){
          alert('problem generating fractal: ' + event.data);
          return;
        }
        ctx.putImageData(event.data.img, 0, event.data.start);
        if(--remaining == 0){setState({loading: "done"})};
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
    if (event.target.value < 0) {
      alert("Number of iterations cannot be negative");
      return;
    }
    this.setState({iterations: event.target.value});
  }

  handleCloseColor(event) {
    this.setState({closeColor: event.target.value});
  }

  handleFarColor(event) {
    this.setState({farColor: event.target.value});
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

  handlePieces(event) {
    if (0 <= event.target.value <= 20) {
      this.setState({pieces: event.target.value});
    };
  }

  handleUpdate(event) {
    var w = 1;
    if (this.state.pieces && Math.floor(this.state.height/this.state.pieces)){
      w = this.state.pieces;
    };
    try {
      this.setState(
        {
          pieces: w,
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
                <td>colors:</td>
                <td>
                  <input
                    type="color"
                    onChange={e => this.handleCloseColor(e)}
                    value={this.state.closeColor}
                  />
                </td>
                <td>
                  <input
                    type="color"
                    onChange={e => this.handleFarColor(e)}
                    value={this.state.farColor}
                  />
                </td>
              </tr>
              <SizeInput
                height={this.state.height}
                width={this.state.width}
                onChange={(h,w) => this.handleSizeInput(h,w)}
              />
              <tr>
                <td>number of workers:</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    onChange={e => this.handlePieces(e)}
                    value={this.state.pieces}
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
                <td>{this.state.loading}</td>
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
    if (event.target.value < 0){
      return;
    }
    this.setState({
      height: event.target.value,
      width: event.target.value,
    },
    () => this.props.onChange(this.state.height,this.state.width)
    );
  }

  handleHeight(event){
    if (event.target.value < 0) {
      return;
    }
    this.setState({
      height: event.target.value,
    },
    () => this.props.onChange(this.state.height,this.state.width)
    );

  }

  handleWidth(event){
    if (event.target.value < 0){
      return;
    }
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

    if(this.state.square){
      return [
        <tr>
          <td>square image:</td>
          <td>
            <input
              type="radio"
              name="square"
              value="true"
              onChange={e => this.handleRadioInput(e)}
              checked="checked"
            /> yes
            <input
              type="radio"
              name="square"
              value="false"
              onChange={e => this.handleRadioInput(e)}
            /> no
          </td>
        </tr>,
        <tr>
          <td>size:</td>
          <td>
            <input
              type="number"
              min="1"
              onChange= {e => this.handleSquare(e)}
              value={this.state.height}
            />
          </td>
        </tr>
      ];
    }else{
      return [
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
              checked="checked"
            /> no
          </td>
        </tr>,
        <tr>
          <td>height:</td>
          <td>
            <input
              type="number"
              min="1"
              onChange={e => this.handleHeight(e)}
              value={this.state.height}
            />
          </td>
        </tr>,
        <tr>
          <td>width:</td>
          <td>
            <input
              type="number"
              min="1"
              onChange={e => this.handleWidth(e)}
              value={this.state.width}
            />
          </td>
        </tr>
      ];
    }
  }
}


export default Fractal;