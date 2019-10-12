import React from 'react';
import logo from './logo.svg';
import './App.css';

class TestWorker extends React.Component {
  constructor(props){
    super(props);
  }

  startWorker(){
    var worker;
    if (typeof(worker) == "undefined"){
      worker = new Worker("worker.js");
    }
    worker.onmessage = function(event){
      document.getElementById("result").innerHTML = event.data;
    }
    worker.postMessage("you hear me?\n");
  }

  render(){
    return (
      <div id="testWorker">
        <button onClick={this.startWorker()} >Start Worker</button>
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
