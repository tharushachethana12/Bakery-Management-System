import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polyline } from 'react-leaflet';
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
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [bakeryLocation, setBakeryLocation] = useState(null);

  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  const defaultCenter = [6.9271, 79.8612];

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/delivery-info');
        setBakeryLocation(response.data.bakeryLocation);
        setDeliveryInfo(response.data);
      } catch (error) {
        console.error('Error fetching delivery info:', error);
      }
    };
    fetchDeliveryInfo();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (address.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setSuggestionsLoading(true);
      try {
        const response = await axios.get(`http://localhost:3001/api/suggest?q=${encodeURIComponent(address)}`);
        setSuggestions(response.data);
        setShowSuggestions(response.data.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setSuggestionsLoading(false);
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchSuggestions();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [address]);

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

  const handleSuggestionClick = (suggestion) => {
    setAddress(suggestion.display_name);
    setShowSuggestions(false);
    handleGeocodeSuggestion(suggestion);
  };

  const handleGeocodeSuggestion = async (suggestion) => {
    setLoading(true);
    setError('');
    setManualMode(false);
    
    try {
      const response = await axios.post('http://localhost:3001/api/geocode', {
        address: suggestion.display_name,
        orderAmount: parseFloat(orderAmount) || 0
      });

      setLocation(response.data);
      setActiveLocation(response.data);
      setManualPin(null);
    } catch (error) {
      setError('Failed to set location');
    } finally {
      setLoading(false);
    }
  };

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
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.details || 
                          'Failed to find location in Sri Lanka. Please check the address and try again.';
      setError(errorMessage);
      setLocation(null);
      setActiveLocation(null);
    } finally {
      setLoading(false);
    }
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

  const handleOrderAmountChange = (e) => {
    const value = e.target.value;
    setOrderAmount(value);
    
    if (activeLocation && !activeLocation.outOfDeliveryRange) {
      setTimeout(() => {
        recalculateDeliveryFee(value);
      }, 500);
    }
  };

  const recalculateDeliveryFee = async (amount) => {
    if (!activeLocation) return;

    try {
      let response;
      if (activeLocation.type === 'manual') {
        response = await axios.post('http://localhost:3001/api/calculate-delivery', {
          lat: activeLocation.lat,
          lng: activeLocation.lng,
          orderAmount: parseFloat(amount) || 0
        });
      } else {
        response = await axios.post('http://localhost:3001/api/geocode', {
          address: activeLocation.formattedAddress,
          orderAmount: parseFloat(amount) || 0
        });
      }

      if (activeLocation.type === 'manual') {
        setManualPin(prev => ({ ...prev, ...response.data }));
        setActiveLocation(prev => ({ ...prev, ...response.data }));
      } else {
        setLocation(prev => ({ ...prev, ...response.data }));
        setActiveLocation(prev => ({ ...prev, ...response.data }));
      }
    } catch (error) {
      console.error('Error recalculating delivery fee:', error);
    }
  };

  const popularLocations = [
    "Galle Face Green, Colombo",
    "Pettah Market, Colombo",
    "Mount Lavinia Beach",
    "Kandy City Center",
    "Negombo Beach",
    "Jaffna Fort",
    "Galle Fort",
    "Sigiriya Rock",
    "Anuradhapura Sacred City",
    "Trincomalee Harbor"
  ];

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h1 style={{ color: '#333', margin: 0, fontSize: '24px' }}>Bakery Delivery</h1>
        </div>

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
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer 
          center={activeLocation ? [activeLocation.lat, activeLocation.lng] : defaultCenter} 
          zoom={activeLocation ? 12 : 8} 
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
                  <hr style={{ margin: '8px 0' }} />
                  {bakeryLocation.address}
                  <br />
                  <em>Delivery Hub</em>
                </div>
              </Popup>
            </Marker>
          )}
          
          {activeLocation && bakeryLocation && activeLocation.routeGeometry && !activeLocation.outOfDeliveryRange && (
            <Polyline
              positions={activeLocation.routeGeometry.coordinates.map(coord => [coord[1], coord[0]])}
              color={activeLocation.isFreeDelivery ? 'green' : 'blue'}
              weight={6}
              opacity={0.8}
            />
          )}

          {activeLocation && bakeryLocation && !activeLocation.routeGeometry && !activeLocation.outOfDeliveryRange && (
            <Polyline
              positions={[
                [bakeryLocation.lat, bakeryLocation.lng],
                [activeLocation.lat, activeLocation.lng]
              ]}
              color="orange"
              weight={4}
              opacity={0.6}
              dashArray="10, 10"
            />
          )}
          
          {location && (
            <Marker position={[location.lat, location.lng]} icon={customIcon}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '250px' }}>
                  <strong>Delivery Location</strong>
                  <br />
                  <hr style={{ margin: '8px 0' }} />
                  {location.formattedAddress}
                  <br />
                  <strong>Road Distance:</strong> {location.distance} km
                  <br />
                  <strong>Estimated Time:</strong> {location.duration} minutes
                  <br />
                  <strong>Delivery Fee:</strong> {location.isFreeDelivery ? 'FREE' : `LKR ${location.deliveryFee}`}
                  <br />
                  <em>{location.deliveryMessage}</em>
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
                  <hr style={{ margin: '8px 0' }} />
                  <strong>Road Distance:</strong> {manualPin.distance} km
                  <br />
                  <strong>Estimated Time:</strong> {manualPin.duration} minutes
                  <br />
                  <strong>Delivery Fee:</strong> {manualPin.isFreeDelivery ? 'FREE' : `LKR ${manualPin.deliveryFee}`}
                  <br />
                  <em>{manualPin.deliveryMessage}</em>
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