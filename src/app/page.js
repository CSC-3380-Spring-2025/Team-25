'use client';

import logo from './logo.svg';
import './App.css';
import Header from "./_components/Header";
import Banner from "./_components/Banner";
import Footer from "./_components/Footer";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
      <Header/>
      <Banner/>
      <Footer/>
      </Router>
    </div>
  ); //this comment
}

export default App;
