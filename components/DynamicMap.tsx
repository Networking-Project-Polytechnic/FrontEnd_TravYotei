// components/DynamicMap.tsx
'use client';

import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons in Next.js
if (typeof window !== 'undefined') {
  // This fixes the default marker icons
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

// Map Controller Component
const MapController = ({ center, zoom }: { center: [number, number], zoom?: number }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || 10);
    }
  }, [center, map, zoom]);

  return null;
};

interface DynamicMapProps {
  selectedPackage: any;
  currentPosition: [number, number] | null;
  routePoints: [number, number][];
  center: [number, number];
  simulationActive?: boolean;
}

const DynamicMap = forwardRef(({ 
  selectedPackage, 
  currentPosition, 
  routePoints, 
  center,
  simulationActive = false
}: DynamicMapProps, ref) => {
  const mapRef = useRef<L.Map>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [packagePosition, setPackagePosition] = useState<[number, number] | null>(currentPosition);

  // Update package position when prop changes
  useEffect(() => {
    if (currentPosition) {
      setPackagePosition(currentPosition);
      if (markerRef.current && mapRef.current) {
        markerRef.current.setLatLng(currentPosition);
        if (simulationActive) {
          mapRef.current.setView(currentPosition, mapRef.current.getZoom());
        }
      }
    }
  }, [currentPosition, simulationActive]);

  // Custom package icon using your package3.png
  const createPackageIcon = () => {
    if (typeof window === 'undefined') return L.icon({ iconUrl: '' });
    
    return L.icon({
      iconUrl: '/package3.jpg',
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
      className: simulationActive ? 'animate-pulse' : ''
    });
  };

  // Expose map control methods to parent
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      if (mapRef.current) {
        mapRef.current.setZoom(mapRef.current.getZoom() + 1);
      }
    },
    zoomOut: () => {
      if (mapRef.current) {
        mapRef.current.setZoom(mapRef.current.getZoom() - 1);
      }
    },
    centerOnPackage: () => {
      if (mapRef.current && packagePosition) {
        mapRef.current.setView(packagePosition, 12);
      }
    },
    updatePackagePosition: (position: [number, number]) => {
      setPackagePosition(position);
      if (markerRef.current) {
        markerRef.current.setLatLng(position);
      }
    }
  }));

  return (
    <MapContainer
      center={center}
      zoom={8}
      className="h-full w-full"
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      {/* Start Marker - Using default Leaflet marker */}
      {selectedPackage?.coordinates?.start && (
        <Marker position={selectedPackage.coordinates.start}>
          <Popup>
            <div className="font-medium">Start: {selectedPackage.startRoute}</div>
            <div className="text-sm">Package pickup location</div>
          </Popup>
        </Marker>
      )}

      {/* End Marker - Using default Leaflet marker */}
      {selectedPackage?.coordinates?.end && (
        <Marker position={selectedPackage.coordinates.end}>
          <Popup>
            <div className="font-medium">Destination: {selectedPackage.endRoute}</div>
            <div className="text-sm">Expected: {selectedPackage.estimatedArrival}</div>
          </Popup>
        </Marker>
      )}

      {/* Current Position Marker - Using your custom package3.png */}
      {packagePosition && (
        <Marker 
          position={packagePosition}
          icon={createPackageIcon()}
          ref={(marker) => {
            if (marker) {
              markerRef.current = marker;
            }
          }}
        >
          <Popup>
            <div className="font-medium">Package Location</div>
            <div className="text-sm">{selectedPackage?.currentLocation || 'En route'}</div>
            <div className="text-sm text-gray-500">Status: {selectedPackage?.status || 'IN_TRANSIT'}</div>
            <div className="text-sm text-gray-500">Updated just now</div>
          </Popup>
        </Marker>
      )}

      {/* Route Line */}
      {routePoints.length > 0 && (
        <Polyline
          positions={routePoints}
          color="#06b6d4"
          weight={3}
          opacity={0.7}
        />
      )}

      {/* Map Controller */}
      <MapController center={packagePosition || center} />
    </MapContainer>
  );
});

DynamicMap.displayName = 'DynamicMap';

export default DynamicMap;