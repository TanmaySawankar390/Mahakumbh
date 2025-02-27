import { useState } from 'react';
import './App.css';
import Home from './components/Home.jsx'; // renamed file
import Navbar from './components/Navbar.jsx'; // corrected import

function App() {
  return (
    <>
      <Navbar />
      <Home />
    </>
  );
}

export default App;
