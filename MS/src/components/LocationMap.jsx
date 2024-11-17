import { useState, useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Popup,
  FeatureGroup,
} from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen';

// Fix for default marker icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom search control styles
const searchControlStyle = `
  .leaflet-control-geosearch {
    position: absolute;
    top: 10px;
    left: 10px;
    right: 10px;
    z-index: 1000;
  }
  .leaflet-control-geosearch form {
    background: white;
    padding: 0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .leaflet-control-geosearch input {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 16px;
  }
  .leaflet-control-geosearch .results {
    margin-top: 4px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  .leaflet-control-geosearch .results > * {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
`;

function LocationMap({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [drawingLayer] = useState(() => new L.FeatureGroup());

  // Add custom styles
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = searchControlStyle;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  // Map Click Handler Component
  function MapClickHandler() {
    useMapEvents({
      click: async (e) => {
        const newPosition = e.latlng;
        setPosition(newPosition);
        onLocationSelect(newPosition);

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}`
          );
          const data = await response.json();
          setAddress(data.display_name);
        } catch (error) {
          console.error('Error getting address:', error);
        }
      },
    });

    return null;
  }
  // Search Control Component
  function SearchField() {
    const map = useMap();

    useEffect(() => {
      const provider = new OpenStreetMapProvider();
      const searchControl = new GeoSearchControl({
        provider,
        style: 'bar',
        showMarker: false,
        showPopup: false,
        autoClose: true,
        retainZoomLevel: false,
        animateZoom: true,
        keepResult: false,
        searchLabel: 'Search for location',
      });

      map.addControl(searchControl);

      map.on('geosearch/showlocation', async (e) => {
        const { x, y, label } = e.location;
        const newPosition = { lat: y, lng: x };
        setPosition(newPosition);
        onLocationSelect(newPosition);
        setAddress(label);

        setSearchHistory((prev) => {
          const newHistory = [
            { label, position: newPosition },
            ...prev.slice(0, 4),
          ];
          localStorage.setItem('searchHistory', JSON.stringify(newHistory));
          return newHistory;
        });
      });

      return () => map.removeControl(searchControl);
    }, [map]);

    return null;
  }

  // Drawing Tools Component
  function DrawingTools() {
    const map = useMap();

    useEffect(() => {
      if (!map.hasLayer(drawingLayer)) {
        map.addLayer(drawingLayer);
      }
      return () => {
        if (map.hasLayer(drawingLayer)) {
          map.removeLayer(drawingLayer);
        }
      };
    }, [map]);

    return (
      <FeatureGroup>
        <EditControl
          position="topright"
          onEdited={(e) => {
            const layers = e.layers;
            layers.eachLayer((layer) => {
              if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
                const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
                layer.bindPopup(`Area: ${(area / 1000000).toFixed(2)} km²`);
              } else if (layer instanceof L.Circle) {
                const area = Math.PI * Math.pow(layer.getRadius(), 2);
                layer.bindPopup(`Area: ${(area / 1000000).toFixed(2)} km²`);
              } else if (layer instanceof L.Polyline) {
                const length = L.GeometryUtil.length(layer.getLatLngs());
                layer.bindPopup(`Length: ${(length / 1000).toFixed(2)} km`);
              }
            });
          }}
          onCreated={(e) => {
            const layer = e.layer;
            drawingLayer.addLayer(layer);
            if (layer instanceof L.Polygon || layer instanceof L.Rectangle) {
              const area = L.GeometryUtil.geodesicArea(layer.getLatLngs()[0]);
              layer.bindPopup(`Area: ${(area / 1000000).toFixed(2)} km²`);
            } else if (layer instanceof L.Circle) {
              const area = Math.PI * Math.pow(layer.getRadius(), 2);
              layer.bindPopup(`Area: ${(area / 1000000).toFixed(2)} km²`);
            } else if (layer instanceof L.Polyline) {
              const length = L.GeometryUtil.length(layer.getLatLngs());
              layer.bindPopup(`Length: ${(length / 1000).toFixed(2)} km`);
            }
          }}
          onDeleted={(e) => {
            const layers = e.layers;
            layers.eachLayer((layer) => {
              drawingLayer.removeLayer(layer);
            });
          }}
          draw={{
            rectangle: {
              shapeOptions: {
                color: '#FF9800',
                weight: 3,
              },
            },
            polygon: {
              shapeOptions: {
                color: '#4CAF50',
                weight: 3,
              },
              allowIntersection: false,
              drawError: {
                color: '#e1e100',
                message: 'Shape edges cannot cross',
              },
            },
            circle: {
              shapeOptions: {
                color: '#9C27B0',
                weight: 3,
              },
            },
            polyline: {
              shapeOptions: {
                color: '#2196F3',
                weight: 3,
              },
            },
            marker: false,
            circlemarker: false,
          }}
        />
      </FeatureGroup>
    );
  }

  // Location Button Component
  function LocationButton() {
    const map = useMap();

    const handleGetLocation = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setPosition(newPosition);
          map.flyTo(newPosition, 16);
          onLocationSelect(newPosition);

          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}`
            );
            const data = await response.json();
            setAddress(data.display_name);
          } catch (error) {
            console.error('Error getting address:', error);
          }
        });
      }
    };

    return (
      <button
        onClick={handleGetLocation}
        className="absolute bottom-3 left-5 z-[1000] bg-white p-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors"
        title="Get my location"
      >
        <svg
          className="w-5 h-5 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
    );
  }

  // Zoom Control Component
  function ZoomControl() {
    const map = useMap();

    return (
      <div className="absolute bottom-5 right-5 z-[1000] bg-white rounded-lg shadow-lg flex flex-col">
        <button
          onClick={() => map.setZoom(map.getZoom() + 1)}
          className="p-3 hover:bg-gray-100 transition-colors"
          title="Zoom in"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        <div className="h-px bg-gray-200" />
        <button
          onClick={() => map.setZoom(map.getZoom() - 1)}
          className="p-3 hover:bg-gray-100 transition-colors"
          title="Zoom out"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-[500px] rounded-xl overflow-hidden relative shadow-md">
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

          {position && (
            <Marker
              position={position}
              draggable={true}
              eventHandlers={{
                dragend: async (e) => {
                  const marker = e.target;
                  const newPosition = marker.getLatLng();
                  setPosition(newPosition);
                  onLocationSelect(newPosition);

                  try {
                    const response = await fetch(
                      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newPosition.lat}&lon=${newPosition.lng}`
                    );
                    const data = await response.json();
                    setAddress(data.display_name);
                  } catch (error) {
                    console.error('Error getting address:', error);
                  }
                },
              }}
            >
              <Popup>
                <div className="p-2">
                  <p className="text-sm">{address}</p>
                </div>
              </Popup>
            </Marker>
          )}

          <MapClickHandler />
          <DrawingTools />
          <SearchField />
          <LocationButton />
          <ZoomControl />
        </MapContainer>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="text-sm text-gray-600 mb-2">
          Click anywhere on the map to select a location or drag the marker to
          adjust
        </div>

        {position && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-700">
                Selected Location:
              </span>
              <span className="text-gray-600">
                {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
              </span>
            </div>
            {address && (
              <div className="text-sm text-gray-600 border-t pt-2 mt-2">
                <span className="font-medium">Address:</span> {address}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default LocationMap;
