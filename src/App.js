import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <script>
        var worker;
        function startWorker() {
          if(typeof(worker) == "undefined"){
            worker = new Worker("woker.js");
          }
          worker.onmessage = function(event){
            document.getElementById("result").innerHTML = event.data;
          }
          worker.postMessage("you hear me?");
        }
      </script>
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
      <button onclick="startWorker()">Start Worker</button>
      <div id="result">
      </div>
    </div>
  );
}

export default App;
