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
  const [activeLocation, setActiveLocation] = useState(null); // Track which location is active
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  // Default center set to Colombo, Sri Lanka
  const defaultCenter = [6.9271, 79.8612]; // Colombo, Sri Lanka

  // Fetch suggestions when user types
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

  // Close suggestions when clicking outside
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
      const locationData = {
        lat: suggestion.lat,
        lng: suggestion.lng,
        formattedAddress: suggestion.display_name,
        type: 'searched'
      };
      setLocation(locationData);
      setActiveLocation(locationData);
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
      setError('Please enter a delivery address');
      return;
    }

    setLoading(true);
    setError('');
    setShowSuggestions(false);
    setManualMode(false);

    try {
      const response = await axios.post('http://localhost:3001/api/geocode', {
        address: address.trim()
      });

      const locationData = {
        ...response.data,
        type: 'searched'
      };
      setLocation(locationData);
      setActiveLocation(locationData);
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

  const handleMapClick = (e) => {
    if (!manualMode) return;

    const { lat, lng } = e.latlng;
    const manualLocation = {
      lat: lat,
      lng: lng,
      formattedAddress: `Manual Pinpoint: ${lat.toFixed(6)}, ${lng.toFixed(6)}`,
      type: 'manual'
    };
    
    setManualPin(manualLocation);
    setActiveLocation(manualLocation);
    setLocation(null);
    setAddress(`Manual Pin: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    setError('');
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

  // Popular Sri Lankan locations for quick selection
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
      {/* Header */}
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <h1 style={{ color: '#333', margin: 0 }}> Courier Map </h1>
          
          {/* Control Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={toggleManualMode}
              style={{
                padding: '10px 16px',
                backgroundColor: manualMode ? '#28a745' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {manualMode ? '📍 Manual Mode ON' : '📍 Manual Pinpoint'}
            </button>
            
            <button 
              onClick={clearAllMarkers}
              style={{
                padding: '10px 16px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {/* Manual Mode Instructions */}
        {manualMode && (
          <div style={{ 
            padding: '10px',
            backgroundColor: '#d1edff',
            border: '1px solid #b3d9ff',
            borderRadius: '4px',
            marginBottom: '15px',
            fontSize: '14px'
          }}>
            🎯 <strong>Manual Pinpoint Mode Active:</strong> Click anywhere on the map to set a delivery location
          </div>
        )}
        
        {/* Search Form */}
        <form onSubmit={handleGeocode} style={{ display: 'flex', gap: '10px', position: 'relative', marginBottom: '15px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onFocus={() => address.length >= 2 && setShowSuggestions(true)}
              placeholder="Type a Sri Lankan address or use manual pinpoint mode..."
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
            
            {/* Suggestions Dropdown */}
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
                        📍 {suggestion.display_name}
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
              padding: '12px 24px',
              backgroundColor: manualMode ? '#ccc' : (loading ? '#6c757d' : '#007bff'),
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: (loading || manualMode) ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              minWidth: '140px'
            }}
          >
            {loading ? '🔍 Searching...' : '📖 Search Address'}
          </button>
        </form>

        {/* Popular Locations Quick Select */}
        {!manualMode && (
          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              <strong>Popular locations:</strong>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularLocations.map((location, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setAddress(location)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#e9ecef',
                    border: '1px solid #dee2e6',
                    borderRadius: '20px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
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

        {/* Error Message */}
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
            ❌ {error}
          </div>
        )}

        {/* Location Info */}
        {activeLocation && (
          <div style={{ 
            padding: '12px',
            backgroundColor: activeLocation.type === 'manual' ? '#d4edda' : '#d1edff',
            border: activeLocation.type === 'manual' ? '1px solid #c3e6cb' : '1px solid #b3d9ff',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {activeLocation.type === 'manual' ? '✅' : '📖'} <strong>
              {activeLocation.type === 'manual' ? 'Manual Pinpoint Set!' : 'Location Found!'}
            </strong>
            <br />
            📍 <strong>Address:</strong> {activeLocation.formattedAddress}
            <br />
            🌐 <strong>Coordinates:</strong> {activeLocation.lat.toFixed(6)}, {activeLocation.lng.toFixed(6)}
          </div>
        )}
      </div>

      {/* Map */}
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
          
          {/* Map click handler for manual pinpointing */}
          <MapClickHandler onMapClick={handleMapClick} manualMode={manualMode} />
          
          {/* Marker for searched location */}
          {location && (
            <Marker position={[location.lat, location.lng]} icon={customIcon}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '200px' }}>
                  <strong>📖 Searched Location</strong>
                  <br />
                  <hr style={{ margin: '8px 0' }} />
                  {location.formattedAddress}
                  <br />
                  <em>Lat: {location.lat.toFixed(6)}</em>
                  <br />
                  <em>Lng: {location.lng.toFixed(6)}</em>
                </div>
              </Popup>
            </Marker>
          )}
          
          {/* Marker for manual pinpoint */}
          {manualPin && (
            <Marker position={[manualPin.lat, manualPin.lng]} icon={manualPinIcon}>
              <Popup>
                <div style={{ textAlign: 'center', minWidth: '200px' }}>
                  <strong>📍 Manual Pinpoint</strong>
                  <br />
                  <hr style={{ margin: '8px 0' }} />
                  <em>Lat: {manualPin.lat.toFixed(6)}</em>
                  <br />
                  <em>Lng: {manualPin.lng.toFixed(6)}</em>
                  <br />
                  <br />
                  <button 
                    onClick={() => {
                      // Reverse geocode to get address (optional enhancement)
                      alert('Manual pinpoint confirmed!');
                    }}
                    style={{
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Confirm Location
                  </button>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
        
        {/* Manual Mode Overlay */}
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
            🎯 Manual Mode: Click on map to set location
          </div>
        )}
      </div>
    </div>
  );
};

export default App;