import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasMinLength: false,
    noSpaces: true
  });
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const validateInput = (value, fieldName) => {
    if (!value) return "";
    
    if (fieldName === "email") {
      const emailStartRegex = /^[!@#$%^&*(),?":{}|<>\/\\]/;
      const allowedEmailStart = /^[@.]/;
      if (emailStartRegex.test(value) && !allowedEmailStart.test(value)) {
        return "Email cannot start with special symbols (except @ or .)";
      }
      return "";
    }
    
    const specialSymbolsRegex = /^[!@#$%^&*(),.?":{}|<>\/\\]/;
    if (specialSymbolsRegex.test(value)) {
      return `${fieldName} cannot start with special symbols`;
    }
    return "";
  };

  const validatePassword = (password) => {
    const validations = {
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasMinLength: password.length >= 8,
      noSpaces: !/^\s|\s$/.test(password)
    };
    setPasswordValidation(validations);
    return validations;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === "password") {
      validatePassword(value);
    }
    
    if (name !== "password" && name !== "confirmPassword" && name !== "phone") {
      if (value) {
        const validationError = validateInput(value, name);
        if (validationError) {
          setErrors(prev => ({ ...prev, [name]: validationError }));
          return;
        } else {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
          });
        }
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.name) newErrors.name = "Full name is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    // Password validation
    const passwordValid = validatePassword(formData.password);
    if (!passwordValid.hasLowercase) {
      newErrors.password = "Password must contain a lowercase letter";
    } else if (!passwordValid.hasUppercase) {
      newErrors.password = "Password must contain an uppercase letter";
    } else if (!passwordValid.hasNumber) {
      newErrors.password = "Password must contain a number";
    } else if (!passwordValid.hasMinLength) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (!passwordValid.noSpaces) {
      newErrors.password = "Password cannot have leading or trailing spaces";
    }
    
    // Input validation for name and email
    const fieldsToValidate = ["name", "email"];
    fieldsToValidate.forEach(field => {
      if (formData[field]) {
        const error = validateInput(formData[field], field);
        if (error) newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    
    setIsLoading(true);
    
    try {
      // Check if email already exists
      const emailExists = await axios.get(`http://localhost:5000/Users/email/${formData.email}`);
      if (emailExists.data.user && emailExists.data.user.length > 0) {
        setErrors({ email: 'Email already registered' });
        setIsLoading(false);
        return;
      }
      
      // Register the user for bakery system
      await axios.post("http://localhost:5000/Users", {
        name: String(formData.name),
        email: String(formData.email),
        phone: String(formData.phone),
        password: String(formData.password),
        role: 'customer', // Default role for bakery system
        isActive: true,
        agreeToTerms: formData.agreeToTerms
      });
      
      setIsSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false
      });
      
      setTimeout(() => {
        setIsSuccess(false);
        navigate('/Login'); 
      }, 3000);
    } catch (error) {
      console.error("Signup error:", error);
      if (error.response && error.response.data) {
        setErrors({ server: error.response.data.message || "Registration failed" });
      } else {
        setErrors({ server: "Network error. Please try again." });
      }
    } finally {
      setIsLoading(false);
    }
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

            {errors.server && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-center">
                {errors.server}
              </div>
            )}
            
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
                  className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-amber-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150`}
                  required
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
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
                  className={`w-full px-4 py-2 border ${errors.email ? 'border-red-500' : 'border-amber-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150`}
                  required
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
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
                  className={`w-full px-4 py-2 border ${errors.phone ? 'border-red-500' : 'border-amber-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150`}
                  required
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              </div>

              {/* Password */}
              <div className="relative">
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
                    onFocus={() => setShowPasswordRequirements(true)}
                    onBlur={() => {
                      if (!formData.password) {
                        setShowPasswordRequirements(false);
                      }
                    }}
                    className={`w-full px-4 py-2 border ${errors.password ? 'border-red-500' : 'border-amber-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150`}
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
                {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                
                {(showPasswordRequirements || formData.password) && (
                  <div className="absolute z-10 mt-1 w-full p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="grid grid-cols-2 gap-1 text-xs text-gray-600">
                      <p className={`flex items-center ${passwordValidation.hasLowercase ? "text-green-500" : ""}`}>
                        <span className="mr-1">{passwordValidation.hasLowercase ? "✓" : "•"}</span>
                        Lowercase
                      </p>
                      <p className={`flex items-center ${passwordValidation.hasUppercase ? "text-green-500" : ""}`}>
                        <span className="mr-1">{passwordValidation.hasUppercase ? "✓" : "•"}</span>
                        Uppercase
                      </p>
                      <p className={`flex items-center ${passwordValidation.hasNumber ? "text-green-500" : ""}`}>
                        <span className="mr-1">{passwordValidation.hasNumber ? "✓" : "•"}</span>
                        Number
                      </p>
                      <p className={`flex items-center ${passwordValidation.hasMinLength ? "text-green-500" : ""}`}>
                        <span className="mr-1">{passwordValidation.hasMinLength ? "✓" : "•"}</span>
                        8+ chars
                      </p>
                      <p className={`flex items-center ${passwordValidation.noSpaces ? "text-green-500" : ""}`}>
                        <span className="mr-1">{passwordValidation.noSpaces ? "✓" : "•"}</span>
                        No spaces
                      </p>
                    </div>
                  </div>
                )}
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
                    className={`w-full px-4 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-amber-300'} rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition duration-150`}
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
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleChange}
                  className={`h-4 w-4 ${errors.agreeToTerms ? 'text-red-500 border-red-500' : 'text-amber-600 border-amber-300'} focus:ring-amber-500 rounded mt-1`}
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
              {errors.agreeToTerms && <p className="text-sm text-red-600">{errors.agreeToTerms}</p>}
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 text-white py-3 px-4 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition duration-150 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>

              {isSuccess && (
                <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-xl text-center">
                  Account created successfully! Redirecting to login...
                </div>
              )}
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