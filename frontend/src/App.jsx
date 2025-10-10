import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from './components/Login/Login'
import CakeModel from './components/CakeModel/CakeModel'
import Map from './components/MapSystem/map'
import BreadSec from './components/Purchasable/BreadsPage'
import Home from './components/Home/home'

function App() {



  return (
     
      <div>
      <Router>
      <div className="flex">
        <div className="flex-grow">
          <Routes>

          <Route path="/" element={<BreadSec/>} />
          
            
          </Routes>
        </div>
        {/* <Navbar /> */}
      </div>
    </Router>
    </div>

  )
}

export default App
