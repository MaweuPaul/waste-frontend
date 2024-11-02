import { useState } from 'react';
import { MapContainer, TileLayer, Polygon, ZoomControl } from 'react-leaflet';
import Calendar from 'react-calendar';
import { toast } from 'react-hot-toast';
import 'react-calendar/dist/Calendar.css';
import 'leaflet/dist/leaflet.css';

function CollectionSchedule() {
  const [selectedZone, setSelectedZone] = useState('Zone A');
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Zone coordinates - Replace with actual zone boundaries
  const zonePolygons = {
    'Zone A': [
      [-0.4146, 36.9452],
      [-0.4246, 36.9552],
      [-0.4346, 36.9452],
      [-0.4146, 36.9452],
    ],
    'Zone B': [
      /* coordinates */
    ],
    'Zone C': [
      /* coordinates */
    ],
    'Zone D': [
      /* coordinates */
    ],
  };

  const scheduleData = {
    'Zone A': {
      areas: ['Nyeri Town', "King'ong'o", 'Gatitu'],
      collectionDays: ['Monday', 'Thursday'],
      time: '6:00 AM - 10:00 AM',
      nextCollection: 'Monday, November 6',
    },
    // Add other zones...
  };

  const handleNotificationToggle = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success('Collection notifications enabled');
      }
    } catch (error) {
      toast.error('Failed to enable notifications');
    }
  };

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
            {Object.entries(scheduleData).map(([zone, data]) =>
              data.areas
                .filter((area) =>
                  area.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((area, index) => (
                  <button
                    key={`${zone}-${index}`}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    onClick={() => {
                      setSelectedZone(zone);
                      setSearchQuery('');
                    }}
                  >
                    <div className="font-medium text-gray-900">{area}</div>
                    <div className="text-sm text-gray-500">{zone}</div>
                  </button>
                ))
            )}
          </div>
        )}
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
            <div className="grid grid-cols-4 gap-3">
              {Object.keys(scheduleData).map((zone) => (
                <button
                  key={zone}
                  onClick={() => setSelectedZone(zone)}
                  className={`
                    py-2 px-4 rounded-lg text-sm font-medium transition-all
                    ${
                      selectedZone === zone
                        ? 'bg-green-100 text-green-800 border-2 border-green-500'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-2 border-transparent'
                    }
                  `}
                >
                  {zone}
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
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                />
                {Object.entries(zonePolygons).map(([zone, coordinates]) => (
                  <Polygon
                    key={zone}
                    positions={coordinates}
                    pathOptions={{
                      color: zone === selectedZone ? '#059669' : '#9CA3AF',
                      fillColor: zone === selectedZone ? '#D1FAE5' : '#F3F4F6',
                      fillOpacity: 0.6,
                      weight: zone === selectedZone ? 2 : 1,
                    }}
                  />
                ))}
                <ZoomControl position="bottomright" />
              </MapContainer>
            </div>
          </div>

          {/* Calendar */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Collection Calendar
            </h2>
            <Calendar
              className="w-full border-0"
              tileClassName={({ date }) => {
                const day = date.toLocaleDateString('en-US', {
                  weekday: 'long',
                });
                return scheduleData[selectedZone].collectionDays.includes(day)
                  ? 'bg-green-100 text-green-800 rounded-lg'
                  : '';
              }}
            />
          </div>
        </div>

        {/* Schedule Details */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Schedule Details
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Collection Days
                </h3>
                <p className="mt-1 text-gray-900">
                  {scheduleData[selectedZone].collectionDays.join(' and ')}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Collection Time
                </h3>
                <p className="mt-1 text-gray-900">
                  {scheduleData[selectedZone].time}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Areas Covered
                </h3>
                <ul className="mt-1 space-y-1">
                  {scheduleData[selectedZone].areas.map((area) => (
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
                {scheduleData[selectedZone].nextCollection}
              </span>
            </p>
            <button
              onClick={handleNotificationToggle}
              className="mt-3 text-sm text-green-700 hover:text-green-800 font-medium inline-flex items-center"
            >
              Set Reminder
              <span className="ml-1">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionSchedule;
