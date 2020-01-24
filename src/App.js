import React from 'react';
import logo from './logo.svg';
import './App.css';
import Demo from './demos.js';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Demos</h1>
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Work in progress.
        </p>
      </header>
      <Demo demo="fractal"/>
    </div>
  );
}


export default App;
