import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Auth/Login'
import Signup from './components/Auth/Signup'
import Home from './components/Home/home'
import CakeModel from './components/CakeModel/CakeModel'
import Map from './components/MapSystem/map'
import BreadSec from './components/Purchasable/BreadsPage'
import PastriesSec from './components/Purchasable/PastriesPage'
import CardPayment from './components/Payments/CardPayment'
import About from './components/Landingpage/About'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/breads" element={<BreadSec />} />
        <Route path="/pastries" element={<PastriesSec />} />
        <Route path="/cakes" element={<CakeModel />} />
        <Route path="/map" element={<Map />} />
        <Route path="/payment" element={<CardPayment />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Fallback */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App;
