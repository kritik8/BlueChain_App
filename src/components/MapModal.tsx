import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, MapPin, Check, Navigation } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapModalProps {
  onClose: () => void;
  onSelectLocation: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number } | null;
}

// You can replace this with your own Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNseDl6Z3J3NjBhMXoycXNjNHQ3OGdqMWoifQ.fake-token-for-demo';

const MapModal: React.FC<MapModalProps> = ({ onClose, onSelectLocation, initialLocation }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLocation || null
  );
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      const initialCenter: [number, lng: number] = initialLocation 
        ? [initialLocation.lng, initialLocation.lat]
        : [78.9629, 20.5937]; // India center

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: initialCenter,
        zoom: initialLocation ? 12 : 4,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add marker if initial location exists
      if (initialLocation) {
        marker.current = new mapboxgl.Marker({ color: '#ef4444', draggable: true })
          .setLngLat([initialLocation.lng, initialLocation.lat])
          .addTo(map.current);

        marker.current.on('dragend', () => {
          const lngLat = marker.current!.getLngLat();
          setSelectedLocation({ lat: lngLat.lat, lng: lngLat.lng });
        });
      }

      // Click to place/move marker
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        setSelectedLocation({ lat, lng });

        if (marker.current) {
          marker.current.setLngLat([lng, lat]);
        } else {
          marker.current = new mapboxgl.Marker({ color: '#ef4444', draggable: true })
            .setLngLat([lng, lat])
            .addTo(map.current!);

          marker.current.on('dragend', () => {
            const lngLat = marker.current!.getLngLat();
            setSelectedLocation({ lat: lngLat.lat, lng: lngLat.lng });
          });
        }
      });

      map.current.on('load', () => {
        setIsMapLoaded(true);
      });

      map.current.on('error', () => {
        setMapError(true);
      });
    } catch (error) {
      setMapError(true);
    }

    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, [initialLocation]);

  const handleConfirm = () => {
    if (selectedLocation) {
      onSelectLocation(selectedLocation.lat, selectedLocation.lng);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setSelectedLocation({ lat: latitude, lng: longitude });
          
          if (map.current) {
            map.current.flyTo({ center: [longitude, latitude], zoom: 14 });
            
            if (marker.current) {
              marker.current.setLngLat([longitude, latitude]);
            } else {
              marker.current = new mapboxgl.Marker({ color: '#ef4444', draggable: true })
                .setLngLat([longitude, latitude])
                .addTo(map.current);

              marker.current.on('dragend', () => {
                const lngLat = marker.current!.getLngLat();
                setSelectedLocation({ lat: lngLat.lat, lng: lngLat.lng });
              });
            }
          }
        },
        () => {
          // Use fallback interactive map
        }
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-background z-50 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pt-14 border-b border-border">
        <button onClick={onClose} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <X className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="font-semibold text-foreground">Select Location</h2>
        <div className="w-10" />
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        {mapError ? (
          // Fallback interactive location picker
          <div className="h-full flex flex-col items-center justify-center p-6 bg-muted">
            <MapPin className="w-16 h-16 text-primary mb-4" />
            <p className="text-foreground font-medium text-center mb-4">
              Interactive map preview
            </p>
            <p className="text-muted-foreground text-sm text-center mb-6">
              Tap below to use your current location or enter coordinates manually
            </p>
            
            <button
              onClick={handleGetCurrentLocation}
              className="btn-secondary flex items-center gap-2 mb-4"
            >
              <Navigation className="w-4 h-4" />
              <span>Use My Current Location</span>
            </button>

            {selectedLocation && (
              <div className="bg-success-light text-success px-4 py-2 rounded-xl text-sm font-medium">
                📍 {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
              </div>
            )}
          </div>
        ) : (
          <>
            <div ref={mapContainer} className="h-full w-full" />
            
            {/* Map Instructions */}
            {!selectedLocation && isMapLoaded && (
              <div className="absolute top-4 left-4 right-4 bg-card/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <p className="text-sm text-foreground text-center">
                  <MapPin className="w-4 h-4 inline-block mr-1 text-destructive" />
                  Tap on the map to select your project location
                </p>
              </div>
            )}

            {/* Current Location Button */}
            <button
              onClick={handleGetCurrentLocation}
              className="absolute bottom-24 right-4 w-12 h-12 bg-card rounded-full shadow-lg flex items-center justify-center"
            >
              <Navigation className="w-5 h-5 text-primary" />
            </button>
          </>
        )}
      </div>

      {/* Selected Location Info */}
      {selectedLocation && (
        <div className="p-4 bg-success-light border-t border-success/20">
          <div className="flex items-center gap-2 text-success">
            <Check className="w-4 h-4" />
            <span className="text-sm font-medium">
              Location: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <div className="p-4 pb-8 bg-card border-t border-border">
        <button
          onClick={handleConfirm}
          disabled={!selectedLocation}
          className={`btn-primary ${!selectedLocation ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Check className="w-5 h-5 inline-block mr-2" />
          Confirm Location
        </button>
      </div>
    </motion.div>
  );
};

export default MapModal;
