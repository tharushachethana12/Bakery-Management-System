import React, { useState } from 'react';

const CardPayment = () => {
  const [formData, setFormData] = useState({
    nameoncard: '',
    cardnumber: '',
    expirationdate: '',
    cvv: '',
    billingaddress: '',
    city: '',
    province: '',
    postalcode: ''
  });

  const [errors, setErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardnumber') {
      const formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }
    
    // Format expiration date
    if (name === 'expirationdate') {
      const formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2');
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nameoncard.trim()) {
      newErrors.nameoncard = 'Cardholder name is required';
    }

    if (!formData.cardnumber.replace(/\s/g, '')) {
      newErrors.cardnumber = 'Card number is required';
    } else if (formData.cardnumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardnumber = 'Card number must be 16 digits';
    }

    if (!formData.expirationdate) {
      newErrors.expirationdate = 'Expiration date is required';
    } else {
      const [month, year] = formData.expirationdate.split('/');
      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expirationdate = 'Please use MM/YY format';
      }
    }

    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    if (!formData.billingaddress.trim()) {
      newErrors.billingaddress = 'Billing address is required';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    if (!formData.province.trim()) {
      newErrors.province = 'Province is required';
    }

    if (!formData.postalcode) {
      newErrors.postalcode = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      const paymentData = {
        ...formData,
        cardnumber: formData.cardnumber.replace(/\s/g, ''),
        expirationdate: formData.expirationdate
      };

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        alert('Payment processed successfully!');
        // Reset form
        setFormData({
          nameoncard: '',
          cardnumber: '',
          expirationdate: '',
          cvv: '',
          billingaddress: '',
          city: '',
          province: '',
          postalcode: ''
        });
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const provinces = [
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick',
    'Newfoundland and Labrador', 'Nova Scotia', 'Ontario',
    'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Northwest Territories',
    'Nunavut', 'Yukon'
  ];

  return (
    <div className="min-h-screen bg-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-amber-600 flex items-center justify-center mr-3">
              <span className="text-xl">💳</span>
            </div>
            <h1 className="text-3xl font-bold text-amber-800">Sweet Dreams Bakery</h1>
          </div>
          <h2 className="text-2xl font-semibold text-amber-700">Payment Information</h2>
          <p className="text-amber-600 mt-2">Complete your purchase securely</p>
        </div>

        {/* Payment Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-amber-600 px-6 py-4">
            <h3 className="text-xl font-semibold text-white">Card Details</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cardholder Name */}
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="nameoncard"
                value={formData.nameoncard}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.nameoncard ? 'border-red-500' : 'border-amber-200'
                }`}
                placeholder="John Doe"
              />
              {errors.nameoncard && (
                <p className="text-red-500 text-sm mt-1">{errors.nameoncard}</p>
              )}
            </div>

            {/* Card Number */}
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardnumber"
                value={formData.cardnumber}
                onChange={handleChange}
                maxLength={19}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.cardnumber ? 'border-red-500' : 'border-amber-200'
                }`}
                placeholder="1234 5678 9012 3456"
              />
              {errors.cardnumber && (
                <p className="text-red-500 text-sm mt-1">{errors.cardnumber}</p>
              )}
            </div>

            {/* Expiration and CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Expiration Date
                </label>
                <input
                  type="text"
                  name="expirationdate"
                  value={formData.expirationdate}
                  onChange={handleChange}
                  maxLength={5}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.expirationdate ? 'border-red-500' : 'border-amber-200'
                  }`}
                  placeholder="MM/YY"
                />
                {errors.expirationdate && (
                  <p className="text-red-500 text-sm mt-1">{errors.expirationdate}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  maxLength={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.cvv ? 'border-red-500' : 'border-amber-200'
                  }`}
                  placeholder="123"
                />
                {errors.cvv && (
                  <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
                )}
              </div>
            </div>

            {/* Billing Address */}
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Billing Address
              </label>
              <input
                type="text"
                name="billingaddress"
                value={formData.billingaddress}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                  errors.billingaddress ? 'border-red-500' : 'border-amber-200'
                }`}
                placeholder="123 Main Street"
              />
              {errors.billingaddress && (
                <p className="text-red-500 text-sm mt-1">{errors.billingaddress}</p>
              )}
            </div>

            {/* City, Province, Postal Code */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-amber-200'
                  }`}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Province
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.province ? 'border-red-500' : 'border-amber-200'
                  }`}
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p className="text-red-500 text-sm mt-1">{errors.province}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalcode"
                  value={formData.postalcode}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent ${
                    errors.postalcode ? 'border-red-500' : 'border-amber-200'
                  }`}
                  placeholder="A1A 1A1"
                />
                {errors.postalcode && (
                  <p className="text-red-500 text-sm mt-1">{errors.postalcode}</p>
                )}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-amber-100 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-amber-600 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-amber-700">
                  Your payment information is encrypted and secure.
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition duration-300 ${
                isProcessing
                  ? 'bg-amber-400 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-700 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                'Complete Payment'
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-amber-600 text-sm">
            Need help? Contact us at <span className="text-amber-700 font-semibold">support@sweetdreamsbakery.com</span>
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <div className="bg-white p-2 rounded-lg shadow">
              <span className="text-xs text-gray-600">Secure</span>
            </div>
            <div className="bg-white p-2 rounded-lg shadow">
              <span className="text-xs text-gray-600">SSL Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;