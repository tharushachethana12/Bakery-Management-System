import React, { useState } from 'react';
import { Link, useNavigate} from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up attempt with:', formData);
    // Here you would typically handle the sign up logic
  };

  return (
    <div className="min-h-screen flex bg-amber-50">
      
      {/* Left side - Bakery Theme */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-amber-400 to-orange-500 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        
        {/* Bakery Content */}
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold text-amber-600 mb-4">Sweet Dreams Bakery</h1>
          <p className="text-xl text-amber-400 mb-8">Join our family of bakers and pastry lovers</p>
          
          <div className="relative h-64 w-full">
            
            {/* Floating Bread */}
            <div className="absolute top-0 left-1/4 animate-float">
              <span className="text-5xl">🍞</span>
            </div>
            
            {/* Floating Croissant */}
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

            {/* Floating Donut */}
            <div className="absolute top-1/3 right-10 animate-float delay-2500">
              <span className="text-4xl">🍩</span>
            </div>
          </div>
          
          <div className="mt-12 flex justify-center space-x-6 text-3xl">
            <span>🍰</span>
            <span>🥨</span>
            <span>🥧</span>
            <span>🎂</span>
            <span>🍮</span>
          </div>

          <div className="mt-8 bg-white/20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-amber-700 text-sm">
              "Join hundreds of bakers and pastry enthusiasts in our growing community"
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile header */}
          <div className="md:hidden text-center mb-8">
            <h1 className="text-3xl font-bold text-amber-800 mb-2">Sweet Dreams Bakery</h1>
            <p className="text-amber-600">Join our family of bakers and pastry lovers</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-amber-800">Create Account</h2>
              <p className="text-amber-600">Join our bakery management system</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-amber-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-amber-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                  required
                />
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-amber-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                  required
                />
              </div>

            
              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-amber-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 transition duration-150"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <span className="text-sm font-medium">Hide</span>
                    ) : (
                      <span className="text-sm font-medium">Show</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 hover:text-amber-800 transition duration-150"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <span className="text-sm font-medium">Hide</span>
                    ) : (
                      <span className="text-sm font-medium">Show</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-amber-300 rounded mt-1"
                  required
                />
                <label htmlFor="agreeToTerms" className="text-sm text-amber-700">
                  I agree to the{' '}
                  <a href="#" className="text-amber-600 hover:text-amber-800 font-medium">
                    Terms and Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-amber-600 hover:text-amber-800 font-medium">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150 font-medium"
              >
                Create Account
              </button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-amber-700">
                Already have an account?{" "}
                <Link to="/Login" className="font-medium text-amber-600 hover:text-amber-800 transition duration-150">
                  Sign in
                </Link>
              </p>
            </div>

            {/* Social Sign Up (Optional) */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-amber-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-amber-600">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-amber-300 rounded-lg shadow-sm bg-white text-sm font-medium text-amber-700 hover:bg-amber-50 transition duration-150"
                >
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-amber-300 rounded-lg shadow-sm bg-white text-sm font-medium text-amber-700 hover:bg-amber-50 transition duration-150"
                >
                  <span>Facebook</span>
                </button>
              </div>
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

export default SignUp;