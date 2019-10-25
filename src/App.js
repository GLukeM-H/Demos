import React from 'react';
import logo from './logo.svg';
import './App.css';
import * as math from 'mathjs';
import Worker from './test.worker.js';

class TestWorker extends React.Component {
  constructor(props){
    super(props);
  }

  startWorker(){

    console.log('started...');
    
    var worker = new Worker();
    worker.onmessage = function(event){
      document.getElementById("result").innerHTML = event.data;
    }
    worker.postMessage("you hear me?\n");
    
  }

  render(){
    return (
      <div id="testWorker">
        <button onClick={() => this.startWorker()} >Start Worker!</button>
      </div>
    );
  }

}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <TestWorker />
      <div id="result">
      </div>
    </div>
  );
}

export default App;
