'use client';

import React from 'react';
import logo from './logo.svg'; // if unused, you may remove this
import './App.css';
import Header from "./_components/Header";
import Banner from "./_components/Banner";
import Footer from "./_components/Footer";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />
      <Banner />
      <Footer />
    </div>
  ); //this comment
};

export default App;
