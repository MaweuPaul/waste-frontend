import { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  ZoomControl,
  Marker,
  Popup,
  useMap,
} from 'react-leaflet';
import Calendar from 'react-calendar';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import L from 'leaflet';
import 'react-calendar/dist/Calendar.css';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues in Leaflet with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const baseUrl = 'http://localhost:3000';

// Location marker component
const LocationMarker = ({ onLocationFound, triggerLocation }) => {
  const map = useMap();
  const isLocatingRef = useRef(false);

  useEffect(() => {
    if (!triggerLocation) return;

    const handleLocation = (e) => {
      if (isLocatingRef.current) return;
      isLocatingRef.current = true;

      if (!e.latlng) {
        toast.error('Location data is unavailable.');
        isLocatingRef.current = false;
        return;
      }

      const { lat, lng } = e.latlng;
      map.flyTo([lat, lng], 15);
      onLocationFound([lat, lng]);
      isLocatingRef.current = false;
    };

    const handleError = (error) => {
      console.error('Location error:', error);
      toast.error(
        'Unable to find your location. Please select your zone manually.'
      );
      isLocatingRef.current = false;
    };

    map.on('locationfound', handleLocation);
    map.on('locationerror', handleError);

    if (triggerLocation && !isLocatingRef.current) {
      map.locate({ enableHighAccuracy: true });
    }

    return () => {
      map.off('locationfound', handleLocation);
      map.off('locationerror', handleError);
    };
  }, [map, onLocationFound, triggerLocation]);

  return null;
};

function CollectionSchedule() {
  const [zones, setZones] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [triggerLocation, setTriggerLocation] = useState(false);

  useEffect(() => {
    fetchZones();
  }, []);

  const fetchZones = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/api/zones`);
      setZones(response.data);
      if (response.data.length > 0) {
        setSelectedZone(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch zones:', error);
      toast.error('Failed to load collection zones');
    } finally {
      setLoading(false);
    }
  };

  const findUserZone = async (location) => {
    try {
      // Validate location
      if (
        !location ||
        !Array.isArray(location) ||
        location.length < 2 ||
        typeof location[0] !== 'number' ||
        typeof location[1] !== 'number'
      ) {
        toast.error('Invalid location data');
        return;
      }

      // First, check if we have zones loaded
      if (zones.length === 0) {
        toast.error('No zones available');
        return;
      }

      // Ensure all zones have valid coordinates
      const validZones = zones.filter(
        (zone) =>
          Array.isArray(zone.coordinates) &&
          zone.coordinates.every(
            (coord) =>
              Array.isArray(coord) &&
              coord.length === 2 &&
              typeof coord[0] === 'number' &&
              typeof coord[1] === 'number'
          )
      );

      if (validZones.length === 0) {
        toast.error('No valid zone coordinates available');
        return;
      }

      // Option 1: If you don't have a backend endpoint yet, do the calculation client-side
      const point = L.latLng(location[0], location[1]);
      const foundZone = validZones.find((zone) => {
        const polygon = L.polygon(zone.coordinates);
        return polygon.getBounds().contains(point);
      });

      if (foundZone) {
        setSelectedZone(foundZone);
        toast.success(`Found your zone: ${foundZone.name}`);
      } else {
        toast.warning('You are not within any collection zone');
      }

      /* Option 2: If you have a backend endpoint
      const response = await axios.post(`${baseUrl}/api/zones/find`, {
        latitude: location[0],
        longitude: location[1]
      });
      
      if (response.data) {
        setSelectedZone(response.data);
        toast.success(`Found your zone: ${response.data.name}`);
      }
      */
    } catch (error) {
      console.error('Failed to find user zone:', error);
      toast.error('Unable to determine your collection zone');
      // Prevent infinite loop by not retrying
    }
  };

  const handleLocationFound = (location) => {
    setUserLocation(location);
    findUserZone(location);
    setTriggerLocation(false); // Reset after handling
  };

  const getNextCollectionDate = (collectionDays) => {
    const today = new Date();
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const currentDay = today.getDay();

    const nextDays = collectionDays.map((day) => {
      const dayIndex = daysOfWeek.indexOf(day);
      let daysUntil = dayIndex - currentDay;
      if (daysUntil <= 0) daysUntil += 7;
      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntil);
      return nextDate;
    });

    return nextDays.sort((a, b) => a - b)[0];
  };
  // Add these helper functions before the return statement
  const handleNotificationToggle = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        // Schedule notification for next collection
        if (selectedZone) {
          const nextDate = getNextCollectionDate(selectedZone.collectionDays);
          scheduleNotification(nextDate, selectedZone);
        }
        toast.success('Collection notifications enabled');
      }
    } catch (error) {
      toast.error('Failed to enable notifications');
    }
  };

  const scheduleNotification = (date, zone) => {
    const now = new Date();
    const timeUntilNotification =
      date.getTime() - now.getTime() - 24 * 60 * 60 * 1000; // 1 day before

    if (timeUntilNotification > 0) {
      setTimeout(() => {
        const notification = new Notification('Waste Collection Reminder', {
          body: `Collection scheduled for ${zone.name} tomorrow at ${zone.time}`,
          icon: '/path-to-your-icon.png', // Add your notification icon
        });
      }, timeUntilNotification);
    } else {
      console.warn('Notification time is in the past');
    }
  };

  const handleFindLocation = () => {
    setTriggerLocation(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Collection Schedule
        </h1>
        <p className="mt-2 text-gray-600">
          View waste collection schedules for your area
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search for your area..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
        {searchQuery && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-auto">
            {zones
              .filter((zone) =>
                zone.areas.some((area) =>
                  area.toLowerCase().includes(searchQuery.toLowerCase())
                )
              )
              .map((zone) => (
                <button
                  key={zone.id}
                  className="w-full px-4 py-2 text-left hover:bg-gray-50"
                  onClick={() => {
                    setSelectedZone(zone);
                    setSearchQuery('');
                  }}
                >
                  <div className="font-medium text-gray-900">{zone.name}</div>
                  <div className="text-sm text-gray-500">
                    {zone.areas.join(', ')}
                  </div>
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Find Location Button */}
      <div className="mb-8">
        <button
          onClick={handleFindLocation}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Find My Location
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Zone Selection */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Select Your Zone
              </h2>
              <button
                onClick={handleNotificationToggle}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <span className="mr-2">
                  {notificationsEnabled ? '🔔' : '🔕'}
                </span>
                {notificationsEnabled
                  ? 'Notifications On'
                  : 'Enable Notifications'}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`
                      py-2 px-4 rounded-lg text-sm font-medium transition-all
                      ${
                        selectedZone?.id === zone.id
                          ? 'bg-green-100 text-green-800 border-2 border-green-500'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                      }
                    `}
                >
                  {zone.name}
                </button>
              ))}
            </div>
          </div>
          {/* Zone Map */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Zone Map
            </h2>
            <div className="h-[400px] rounded-lg overflow-hidden">
              <MapContainer
                center={[-0.4246, 36.9452]}
                zoom={13}
                className="h-full w-full"
                scrollWheelZoom={true}
                zoomControl={false} // Disable default zoom control to use custom position
                minZoom={5} // Set a minimum zoom level to allow zooming out
                maxZoom={18} // Set a maximum zoom level if needed
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {zones.map((zone) => (
                  <Polygon
                    key={zone.id}
                    positions={zone.coordinates}
                    pathOptions={{
                      color:
                        selectedZone?.id === zone.id ? '#059669' : '#9CA3AF',
                      fillColor:
                        selectedZone?.id === zone.id ? '#D1FAE5' : '#F3F4F6',
                      fillOpacity: 0.6,
                      weight: selectedZone?.id === zone.id ? 2 : 1,
                    }}
                    eventHandlers={{
                      click: () => setSelectedZone(zone),
                    }}
                  />
                ))}
                {userLocation && (
                  <Marker position={userLocation}>
                    <Popup>You are here</Popup>
                  </Marker>
                )}
                <LocationMarker
                  onLocationFound={handleLocationFound}
                  triggerLocation={triggerLocation}
                />
                <ZoomControl position="bottomright" />
              </MapContainer>
            </div>
          </div>{' '}
          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Collection Calendar
            </h2>
            {selectedZone && (
              <Calendar
                className="w-full border-0"
                tileClassName={({ date }) => {
                  const day = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                  });
                  return selectedZone.collectionDays.includes(day)
                    ? 'bg-green-100 text-green-800 rounded-lg'
                    : '';
                }}
                tileContent={({ date }) => {
                  const day = date.toLocaleDateString('en-US', {
                    weekday: 'long',
                  });
                  return selectedZone.collectionDays.includes(day) ? (
                    <div className="text-xs mt-1">🚛</div>
                  ) : null;
                }}
              />
            )}
          </div>
        </div>

        {/* Schedule Details */}
        <div className="space-y-6">
          {selectedZone && (
            <>
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Schedule Details
                </h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Zone</h3>
                    <p className="mt-1 text-gray-900">{selectedZone.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Collection Days
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {selectedZone.collectionDays.join(' and ')}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Collection Time
                    </h3>
                    <p className="mt-1 text-gray-900">{selectedZone.time}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Areas Covered
                    </h3>
                    <ul className="mt-1 space-y-1">
                      {selectedZone.areas.map((area) => (
                        <li key={area} className="text-gray-900">
                          {area}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Next Collection Alert */}
              <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-sm font-medium text-green-800">
                  Next Collection
                </h3>
                <p className="mt-2 text-green-700">
                  Your next collection is on{' '}
                  <span className="font-medium">
                    {getNextCollectionDate(
                      selectedZone.collectionDays
                    ).toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </p>
                {userLocation && (
                  <p className="mt-2 text-sm text-green-600">
                    📍 You are in this zone
                  </p>
                )}
                <button
                  onClick={handleNotificationToggle}
                  className="mt-3 text-sm text-green-700 hover:text-green-800 font-medium inline-flex items-center"
                >
                  {notificationsEnabled
                    ? 'Notifications Enabled'
                    : 'Set Reminder'}
                  <span className="ml-1">→</span>
                </button>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Important Information
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Please ensure waste is properly sorted and bagged
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Place waste outside by{' '}
                    {selectedZone.time.split('-')[0].trim()}
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    Contact support for missed collections
                  </li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectionSchedule;
