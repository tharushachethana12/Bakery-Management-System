import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNavbar = ({ currentPage }) => {
  return (
    <header className="bg-amber-800 text-amber-50 py-4 px-6 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center mr-3">
            <span className="text-xl">🥐</span>
          </div>
          <h1 className="text-xl font-bold">Sweet Dreams Bakery - {currentPage}</h1>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => `hover:text-amber-200 transition-colors ${isActive ? 'border-b-2 border-amber-200' : ''}`}
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/cakes" 
            className={({ isActive }) => `hover:text-amber-200 transition-colors ${isActive ? 'border-b-2 border-amber-200' : ''}`}
          >
            Cakes
          </NavLink>
          <NavLink 
            to="/breads" 
            className={({ isActive }) => `hover:text-amber-200 transition-colors ${isActive ? 'border-b-2 border-amber-200' : ''}`}
          >
            Breads
          </NavLink>
          <NavLink 
            to="/pastries" 
            className={({ isActive }) => `hover:text-amber-200 transition-colors ${isActive ? 'border-b-2 border-amber-200' : ''}`}
          >
            Pastries
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => `hover:text-amber-200 transition-colors ${isActive ? 'border-b-2 border-amber-200' : ''}`}
          >
            About
          </NavLink>
          
          {/* Cart Icon */}
          <NavLink 
            to="/cart" 
            className="hover:text-amber-200 transition-colors relative"
          >
            <span className="text-xl">🛒</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              0
            </span>
          </NavLink>
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-amber-50">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (hidden by default) */}
      <div className="md:hidden bg-amber-700 px-6 py-2">
        <div className="flex flex-col space-y-2">
          <NavLink to="/" className="hover:text-amber-200 transition-colors">Home</NavLink>
          <NavLink to="/cakes" className="hover:text-amber-200 transition-colors">Cakes</NavLink>
          <NavLink to="/breads" className="hover:text-amber-200 transition-colors">Breads</NavLink>
          <NavLink to="/pastries" className="hover:text-amber-200 transition-colors">Pastries</NavLink>
          <NavLink to="/about" className="hover:text-amber-200 transition-colors">About</NavLink>
          <NavLink to="/cart" className="hover:text-amber-200 transition-colors">Cart (0)</NavLink>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;