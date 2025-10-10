import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const manualPinIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const bakeryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component for handling map clicks
function MapClickHandler({ onMapClick, manualMode }) {
  useMapEvents({
    click: (e) => {
      if (manualMode) {
        onMapClick(e);
      }
    },
  });
  return null;
}


const App = () => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [location, setLocation] = useState(null);
  const [manualPin, setManualPin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [manualMode, setManualMode] = useState(false);
  const [activeLocation, setActiveLocation] = useState(null);
  const [orderAmount, setOrderAmount] = useState(0);
  const [bakeryLocation, setBakeryLocation] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const defaultCenter = [6.9271, 79.8612];

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/delivery-info');
        setBakeryLocation(response.data.bakeryLocation);
      } catch (error) {
        console.error('Error fetching delivery info:', error);
      }
    };
    fetchDeliveryInfo();
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  // ... (keep all the useEffect and helper functions the same until handleGeocode)

  const handleGeocode = async (e) => {
    e.preventDefault();
    
    if (!address.trim()) {
      setError('Please enter a delivery address in Sri Lanka');
      return;
    }

    setLoading(true);
    setError('');
    setShowSuggestions(false);
    setManualMode(false);

    try {
      const response = await axios.post('http://localhost:3001/api/geocode', {
        address: address.trim(),
        orderAmount: parseFloat(orderAmount) || 0
      });

      setLocation(response.data);
      setActiveLocation(response.data);
      setManualPin(null);
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to find location. Please try again.';
      setError(errorMessage);
      setLocation(null);
      setActiveLocation(null);
    } finally {
      setLoading(false);
    }
  };

   const toggleManualMode = () => {
    setManualMode(!manualMode);
    if (!manualMode) {
      setError('');
      setShowSuggestions(false);
    }
  };

  const clearAllMarkers = () => {
    setLocation(null);
    setManualPin(null);
    setActiveLocation(null);
    setAddress('');
    setError('');
    setManualMode(false);
  };

    const handleMapClick = async (e) => {
    if (!manualMode) return;

    const { lat, lng } = e.latlng;
    setLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3001/api/calculate-delivery', {
        lat: lat,
        lng: lng,
        orderAmount: parseFloat(orderAmount) || 0
      });

      const manualLocation = {
        ...response.data.deliveryLocation,
        ...response.data,
        type: 'manual'
      };
      
      setManualPin(manualLocation);
      setActiveLocation(manualLocation);
      setLocation(null);
      setAddress(`Manual Pin: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      setError('');
    } catch (error) {
      setError('Failed to calculate delivery fee for this location');
    } finally {
      setLoading(false);
    }
  };

  // Remove the recalculateDeliveryFee function and replace with:
  const handleOrderAmountChange = (e) => {
    const value = e.target.value;
    setOrderAmount(value);
  };

  // Create order from current location
  const createOrder = async () => {
    if (!activeLocation) {
      setError('Please select a delivery location first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/orders', {
        deliveryLocation: activeLocation,
        orderAmount: parseFloat(orderAmount) || 0
      });

      await loadOrders();
      setShowOrders(true);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.patch(`http://localhost:3001/api/orders/${orderId}/status`, { status });
      await loadOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'preparing': return 'Preparing Order';
      case 'on_the_way': return 'Delivery on the way';
      case 'delivered': return 'Delivery done';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'preparing': return '#ffc107';
      case 'on_the_way': return '#007bff';
      case 'delivered': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getNextStatus = (currentStatus) => {
    switch (currentStatus) {
      case 'preparing': return 'on_the_way';
      case 'on_the_way': return 'delivered';
      default: return null;
    }
  };

  const popularLocations = [
    "Galle Face Green, Colombo",
    "Pettah Market, Colombo",
    "Mount Lavinia Beach",
    "Kandy City Center",
    "Negombo Beach"
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ color: '#333', margin: 0, fontSize: '24px' }}>Bakery Delivery</h1>
          <button 
            onClick={() => setShowOrders(!showOrders)}
            style={{
              padding: '8px 12px',
              backgroundColor: showOrders ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {showOrders ? 'Hide Orders' : `Show Orders (${orders.length})`}
          </button>
        </div>

        {!showOrders ? (
          <>
            {/* Map interface remains the same */}
            {manualMode && (
              <div style={{ 
                padding: '10px',
                backgroundColor: '#d1edff',
                border: '1px solid #b3d9ff',
                borderRadius: '4px',
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                <strong>Manual Pinpoint Mode Active:</strong> Click anywhere on the map to set a delivery location
              </div>
            )}

            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '14px' }}>
                Order Amount (LKR):
              </label>
              <input
                type="number"
                value={orderAmount}
                onChange={handleOrderAmountChange}
                placeholder="Enter your order total"
                style={{
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px',
                  width: '180px'
                }}
              />
              <div style={{ fontSize: '11px', color: '#666', marginTop: '3px' }}>
                Free delivery for orders above LKR 2,000!
              </div>
            </div>
            
            <form onSubmit={handleGeocode} style={{ display: 'flex', gap: '8px', position: 'relative', marginBottom: '10px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onFocus={() => address.length >= 2 && setShowSuggestions(true)}
                  placeholder="Type an address or use manual pinpoint mode..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px',
                    backgroundColor: manualMode ? '#f8f9fa' : 'white'
                  }}
                  disabled={manualMode}
                />
                
                {showSuggestions && !manualMode && (
                  <div 
                    ref={suggestionsRef}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}
                  >
                    {suggestionsLoading ? (
                      <div style={{ padding: '10px', color: '#666', textAlign: 'center' }}>
                        Loading suggestions...
                      </div>
                    ) : suggestions.length > 0 ? (
                      suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          style={{
                            padding: '10px 12px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #f0f0f0',
                            backgroundColor: 'white',
                            transition: 'background-color 0.2s'
                          }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                        >
                          <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                            {suggestion.display_name}
                          </div>
                        </div>
                      ))
                    ) : address.length >= 2 ? (
                      <div style={{ padding: '10px', color: '#666', textAlign: 'center' }}>
                        No suggestions found
                      </div>
                    ) : null}
                  </div>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={loading || manualMode}
                style={{
                  padding: '8px 16px',
                  backgroundColor: manualMode ? '#ccc' : (loading ? '#6c757d' : '#007bff'),
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: (loading || manualMode) ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  minWidth: '120px'
                }}
              >
                {loading ? 'Searching...' : 'Search Address'}
              </button>

              <button 
                type="button"
                onClick={toggleManualMode}
                style={{
                  padding: '8px 12px',
                  backgroundColor: manualMode ? '#28a745' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                {manualMode ? 'Manual Mode ON' : 'Manual Pinpoint'}
              </button>

              <button 
                type="button"
                onClick={clearAllMarkers}
                style={{
                  padding: '8px 12px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Clear
              </button>
            </form>

            {activeLocation && !activeLocation.outOfDeliveryRange && (
              <div style={{ marginBottom: '10px' }}>
                <button 
                  onClick={createOrder}
                  disabled={loading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  {loading ? 'Creating Order...' : 'Create Delivery Order'}
                </button>
              </div>
            )}

            {!manualMode && (
              <div style={{ marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
                  <strong>Popular locations:</strong>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {popularLocations.map((location, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setAddress(location)}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#e9ecef',
                        border: '1px solid #dee2e6',
                        borderRadius: '12px',
                        fontSize: '10px',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#007bff'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e9ecef'}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div style={{ 
                color: '#721c24', 
                padding: '12px',
                backgroundColor: '#f8d7da',
                border: '1px solid #f5c6cb',
                borderRadius: '4px',
                fontSize: '14px',
                marginBottom: '10px'
              }}>
                Error: {error}
              </div>
            )}
          </>
        ) : (
          // Orders View (keep this the same)
          <div>
            <h2 style={{ marginBottom: '15px' }}>Delivery Orders ({orders.length})</h2>
            {orders.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                No orders yet. Create your first delivery order!
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px', maxHeight: '400px', overflowY: 'auto' }}>
                {orders.map(order => (
                  <div key={order.id} style={{ 
                    padding: '15px', 
                    border: '1px solid #ddd', 
                    borderRadius: '8px',
                    backgroundColor: '#fff'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <strong>Order #{order.id}</strong>
                        <br />
                        <strong>Address:</strong> {order.deliveryLocation.formattedAddress}
                        <br />
                        <strong>Distance:</strong> {order.deliveryLocation.distance} km
                        <br />
                        <strong>Order Amount:</strong> LKR {order.orderAmount}
                      </div>
                      <div style={{ 
                        padding: '8px 12px', 
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {getStatusDisplay(order.status)}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {getNextStatus(order.status) && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, getNextStatus(order.status))}
                          style={{ 
                            padding: '8px 16px', 
                            backgroundColor: '#007bff', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '4px', 
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          {order.status === 'preparing' ? 'Start Delivery' : 
                           order.status === 'on_the_way' ? 'Mark Delivered' : ''}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
          center={activeLocation ? [activeLocation.lat, activeLocation.lng] : defaultCenter} 
          zoom={activeLocation ? 15 : 8} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onMapClick={handleMapClick} manualMode={manualMode} />
          
          {bakeryLocation && (
            <Marker position={[bakeryLocation.lat, bakeryLocation.lng]} icon={bakeryIcon}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '200px' }}>
                  <strong>Our Bakery</strong>
                  <br />
                  {bakeryLocation.address}
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* REMOVED ALL POLYLINE CODE - This was causing slowness */}
          
          {location && (
            <Marker position={[location.lat, location.lng]} icon={customIcon}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '250px' }}>
                  <strong>Delivery Location</strong>
                  <br />
                  {location.formattedAddress}
                  <br />
                  <strong>Distance:</strong> {location.distance} km
                  <br />
                  <strong>Delivery Fee:</strong> {location.isFreeDelivery ? 'FREE' : `LKR ${location.deliveryFee}`}
                </div>
              </Popup>
            </Marker>
          )}
          
          {manualPin && (
            <Marker position={[manualPin.lat, manualPin.lng]} icon={manualPinIcon}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '250px' }}>
                  <strong>Manual Pinpoint</strong>
                  <br />
                  <strong>Distance:</strong> {manualPin.distance} km
                  <br />
                  <strong>Delivery Fee:</strong> {manualPin.isFreeDelivery ? 'FREE' : `LKR ${manualPin.deliveryFee}`}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        
        {manualMode && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: 'rgba(40, 167, 69, 0.9)',
            color: 'white',
            padding: '10px',
            borderRadius: '4px',
            zIndex: 1000,
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            Manual Mode: Click on map to set location
          </div>
        )}
      </div>
    </div>
  );
};

export default App;