import React from 'react';
import './App.css';
import Home from './components/Home/home'
require('dotenv').config()

function App() {
  return (
    <div className="App">
      <Home/>
    </div>
  );
}

export default App;
