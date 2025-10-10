import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', { email, password, rememberMe });
    // Here you would typically handle the login logic
  };

  return (
    <div className="min-h-screen flex bg-amber-50">
      
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br  items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-amber-600 mb-4">Sweet Dreams Bakery</h1>
          <p className="text-xl text-amber-400 mb-8">Where every bite tells a story of tradition and taste</p>
          
          <div className="relative h-64 w-full">
            
            <div className="absolute top-0 left-1/4 animate-float">
              <span className="text-5xl">🍞</span>
            </div>
            
            
            <div className="absolute top-10 right-1/4 animate-float delay-1000">
              <span className="text-4xl">🥐</span>
            </div>
            
            {/* Floating Cupcake */}
            <div className="absolute bottom-10 left-1/3 animate-float delay-2000">
              <span className="text-4xl">🧁</span>
            </div>
            
            {/* Floating Cookie */}
            <div className="absolute bottom-0 right-1/3 animate-float delay-3000">
              <span className="text-4xl">🍪</span>
            </div>
            
            {/* Floating Baguette */}
            <div className="absolute top-1/2 left-10 animate-float delay-1500">
              <span className="text-5xl">🥖</span>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center space-x-6 text-3xl">
            <span>🍰</span>
            <span>🥨</span>
            <span>🥧</span>
            <span>🎂</span>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">Sweet Dreams Bakery</h1>
            <p className="text-amber-600">Where every bite tells a story of tradition and taste</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-amber-800">Welcome Back</h2>
              <p className="text-amber-600">Sign in to your bakery account</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-amber-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span className="text-sm">Hide</span>
                    ) : (
                      <span className="text-sm">Show</span>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                  />
                  <span className="ml-2 text-sm text-amber-700">Remember me</span>
                </label>
                
                <a href="#" className="text-sm text-amber-600 hover:text-amber-800">
                  Forgot password?
                </a>
              </div>
              
              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150"
              >
                Sign In
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-amber-700">
                Don't have an account?{" "}
                <Link to="/Signup"  className="font-medium text-amber-600 hover:text-amber-800">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-amber-600">
            <p>© 2024 Sweet Dreams Bakery. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;