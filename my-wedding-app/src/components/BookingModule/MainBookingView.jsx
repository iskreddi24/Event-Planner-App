import { useState, useEffect } from 'react';
import axios from 'axios';
import EventTile from './EventTile.jsx';
import SlotAndHallPicker from './SlotAndHallPicker.jsx';
import "../../styles/bookingStyles.css";

import birthdayImage from '../../birthdayimg/birthday.jpg';
import weddingImage from '../../weddingimg/wedding.jpg';
import anniversaryImage from '../../anniversaryimages/anniversary.jpg';
import halfSareeImage from '../../halfsareeimg/halfsaree.jpg';

const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const events = [
  { name: 'Birthday Party', img: birthdayImage },
  { name: 'Wedding', img: weddingImage },
  { name: 'Anniversary', img: anniversaryImage },
  { name: 'Half Saree', img: halfSareeImage }
];

export default function MainBookingView() {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [loadingLocations, setLoadingLocations] = useState(true); 
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      setLoadingLocations(true);
      setLocationError(null);
      try {
        const res = await axios.get(`${API_URL}/booking/locations`);
        setLocations(res.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
        setLocationError("Failed to load available locations. Please check server connection.");
        setLocations([]);
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  const currentAreas = locations.find(loc => loc.location === selectedLocation)?.areas || [];

  return (
    <div className="booking-view">
      <h2 className="booking-title">Book Your Special Event 🎉</h2>

      {}
      <section className="booking-section">
        <h3 className="section-title">1. Choose Event Type</h3>
        <div className="event-grid">
          {events.map((event, idx) => (
            <EventTile
              key={idx}
              event={event}
              isSelected={selectedEvent === event.name}
              onSelect={() => setSelectedEvent(event.name)}
            />
          ))}
        </div>
      </section>

      {}
      {selectedEvent && (
        <section className="booking-section location-selector">
          <h3 className="section-title">2. Select Location and Area</h3>
          {loadingLocations && <p>Loading available states and areas...</p>}
          {locationError && <p className="error-message">{locationError}</p>}

          <div className="location-selector-controls">
            <select
              className="location-select"
              value={selectedLocation}
              onChange={(e) => {
                setSelectedLocation(e.target.value);
                setSelectedArea('');
              }}
              disabled={loadingLocations || locations.length === 0}
            >
              <option value="">Select State/City</option>
              {locations.map(loc => (
                <option key={loc.location} value={loc.location}>{loc.location}</option>
              ))}
            </select>

            <select
              className="location-select"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              disabled={!selectedLocation || loadingLocations}
            >
              <option value="">Select Area/Sub-District</option>
              {currentAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </section>
      )}

      {}
      {selectedArea && selectedEvent && (
        <section className="booking-section">
          <h3 className="section-title">3. Choose Hall, Date, and Slot</h3>
          <SlotAndHallPicker
            location={selectedLocation}
            area={selectedArea}
            eventType={selectedEvent}
          />
        </section>
      )}
    </div>
  );
}
