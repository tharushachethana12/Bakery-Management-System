import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
const bakeryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const deliveryIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Tab components
const TABS = {
  ADD_LOCATIONS: 'add_locations',
  DELIVERY_LIST: 'delivery_list',
  ORDERS: 'orders'
};

const App = () => {
  const [address, setAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [deliveryLocations, setDeliveryLocations] = useState([]);
  const [bakeryLocation, setBakeryLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderAmount, setOrderAmount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState(TABS.ADD_LOCATIONS);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);
  const debounceRef = useRef(null);

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
    loadDeliveryLocations();
    loadOrders();
  }, []);

  // Click outside handler to close suggestions
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadDeliveryLocations = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/delivery-locations');
      setDeliveryLocations(response.data);
    } catch (error) {
      console.error('Error loading delivery locations:', error);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const fetchSuggestions = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setSuggestionsLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/suggest', {
        params: { q: query }
      });
      setSuggestions(response.data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.display_name);
    setShowSuggestions(false);
  };

  const addDeliveryLocation = async (e) => {
    if (e) e.preventDefault();
    
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }

    setLoading(true);
    setError('');
    setShowSuggestions(false);
    
    try {
      const response = await axios.post('http://localhost:3001/api/add-location', {
        address: address.trim(),
        orderAmount: parseFloat(orderAmount) || 0
      });

      await loadDeliveryLocations();
      setAddress('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to add location');
    } finally {
      setLoading(false);
    }
  };

  const removeDeliveryLocation = async (locationId) => {
    try {
      await axios.delete(`http://localhost:3001/api/delivery-locations/${locationId}`);
      await loadDeliveryLocations();
    } catch (error) {
      console.error('Error removing location:', error);
    }
  };

  const clearAllLocations = async () => {
    try {
      await axios.delete('http://localhost:3001/api/delivery-locations');
      await loadDeliveryLocations();
      setError('');
    } catch (error) {
      console.error('Error clearing locations:', error);
    }
  };

  const createOrder = async () => {
    if (deliveryLocations.length === 0) {
      setError('Please add at least one delivery location');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/orders', {
        deliveryLocations: deliveryLocations,
        orderAmount: parseFloat(orderAmount) || 0
      });

      await loadOrders();
      setActiveTab(TABS.ORDERS);
      setError('');
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

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

  // Tab navigation
  const TabButton = ({ tab, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      style={{
        padding: '10px 16px',
        backgroundColor: activeTab === tab ? '#007bff' : 'transparent',
        color: activeTab === tab ? 'white' : '#333',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: 'bold',
        marginRight: '5px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {label}
      {count > 0 && (
        <span style={{
          backgroundColor: activeTab === tab ? 'rgba(255,255,255,0.3)' : '#007bff',
          color: activeTab === tab ? 'white' : 'white',
          borderRadius: '12px',
          padding: '2px 8px',
          fontSize: '12px',
          minWidth: '20px'
        }}>
          {count}
        </span>
      )}
    </button>
  );

  // Render different tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.ADD_LOCATIONS:
        return (
          <>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '14px' }}>
                Order Amount (LKR):
              </label>
              <input
                type="number"
                value={orderAmount}
                onChange={(e) => setOrderAmount(e.target.value)}
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

            <form onSubmit={addDeliveryLocation} style={{ display: 'flex', gap: '8px', position: 'relative', marginBottom: '10px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  ref={inputRef}
                  type="text"
                  value={address}
                  onChange={(e) => {
                    setAddress(e.target.value);
                    
                    // Clear previous timeout
                    if (debounceRef.current) {
                      clearTimeout(debounceRef.current);
                    }
                    
                    // Set new timeout for debouncing
                    debounceRef.current = setTimeout(() => {
                      if (e.target.value.length >= 2) {
                        fetchSuggestions(e.target.value);
                        setShowSuggestions(true);
                      } else {
                        setShowSuggestions(false);
                      }
                    }, 300);
                  }}
                  onFocus={() => {
                    if (address.length >= 2) {
                      setShowSuggestions(true);
                    }
                  }}
                  placeholder="Enter delivery address in Sri Lanka..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '16px'
                  }}
                />
                
                {showSuggestions && (
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
                disabled={loading}
                style={{
                  padding: '8px 16px',
                  backgroundColor: loading ? '#6c757d' : '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  minWidth: '120px'
                }}
              >
                {loading ? 'Adding...' : 'Add Location'}
              </button>

              <button 
                type="button"
                onClick={clearAllLocations}
                disabled={deliveryLocations.length === 0}
                style={{
                  padding: '8px 12px',
                  backgroundColor: deliveryLocations.length === 0 ? '#ccc' : '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: deliveryLocations.length === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '12px'
                }}
              >
                Clear All
              </button>
            </form>

            

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
        );

      case TABS.DELIVERY_LIST:
        return (
<div>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
  <h3 style={{ margin: 0 }}>Delivery Locations ({deliveryLocations.length})</h3>
  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
    {deliveryLocations.length > 0 && (
      <>
        <button 
          onClick={createOrder}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: loading ? '#6c757d' : '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {loading ? 'Creating...' : `Create Order (${deliveryLocations.length})`}
        </button>
        <button 
          onClick={clearAllLocations}
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
          Clear All
        </button>
      </>
    )}
  </div>
</div>

            {deliveryLocations.length === 0 ? (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                color: '#666',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📍</div>
                <h4 style={{ margin: '0 0 10px 0' }}>No Delivery Locations Added</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Switch to "Add Locations" tab to add delivery addresses
                </p>
              </div>
            ) : (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {deliveryLocations.map(location => (
                  <div key={location.id} style={{ 
                    padding: '15px', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    backgroundColor: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          marginBottom: '8px'
                        }}>
                          <div style={{ 
                            width: '24px', 
                            height: '24px', 
                            backgroundColor: '#007bff',
                            color: 'white',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                            {location.id}
                          </div>
                          <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{location.name}</div>
                        </div>
                        
                        <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                          {location.address}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '15px', fontSize: '13px' }}>
                          <div>
                            <strong>Distance:</strong> {location.distance} km
                          </div>
                          <div>
                            <strong>Fee:</strong> 
                            <span style={{ 
                              color: location.isFreeDelivery ? '#28a745' : '#333',
                              fontWeight: location.isFreeDelivery ? 'bold' : 'normal'
                            }}>
                              {location.isFreeDelivery ? ' FREE' : ` LKR ${location.deliveryFee}`}
                            </span>
                          </div>
                          <div>
                            <strong>Est. Time:</strong> {location.duration} min
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeDeliveryLocation(location.id)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case TABS.ORDERS:
        return (
          <div>
            <h3 style={{ marginBottom: '15px' }}>Delivery Orders ({orders.length})</h3>
            {orders.length === 0 ? (
              <div style={{ 
                padding: '40px 20px', 
                textAlign: 'center', 
                color: '#666',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                border: '2px dashed #ddd'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📦</div>
                <h4 style={{ margin: '0 0 10px 0' }}>No Orders Yet</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Add delivery locations and create your first order!
                </p>
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
                        <strong>Locations:</strong> {order.deliveryLocations.length}
                        <br />
                        <strong>Order Amount:</strong> LKR {order.orderAmount}
                        <div style={{ marginTop: '5px', fontSize: '12px' }}>
                          {order.deliveryLocations.map((loc, index) => (
                            <div key={index}>
                              • {loc.name} - {loc.distance}km - {loc.isFreeDelivery ? 'FREE' : `LKR ${loc.deliveryFee}`}
                            </div>
                          ))}
                        </div>
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
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h1 style={{ color: '#333', margin: 0, fontSize: '24px' }}>Bakery Delivery</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ 
              padding: '4px 8px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              {deliveryLocations.length} Locations
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          borderBottom: '2px solid #dee2e6',
          marginBottom: '15px'
        }}>
          <TabButton 
            tab={TABS.ADD_LOCATIONS} 
            label="Add Locations" 
          />
          <TabButton 
            tab={TABS.DELIVERY_LIST} 
            label="Delivery List" 
            count={deliveryLocations.length} 
          />
          <TabButton 
            tab={TABS.ORDERS} 
            label="Orders" 
            count={orders.length} 
          />
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
          center={deliveryLocations.length > 0 ? [deliveryLocations[0].lat, deliveryLocations[0].lng] : defaultCenter} 
          zoom={deliveryLocations.length > 0 ? 12 : 8} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
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
          
          {deliveryLocations.map(location => (
            <Marker 
              key={location.id} 
              position={[location.lat, location.lng]} 
              icon={deliveryIcon}
            >
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '250px' }}>
                  <strong>{location.name}</strong>
                  <br />
                  {location.address}
                  <br />
                  <strong>Distance:</strong> {location.distance} km
                  <br />
                  <strong>Delivery Fee:</strong> {location.isFreeDelivery ? 'FREE' : `LKR ${location.deliveryFee}`}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default App;