
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Button } from "@/components/ui/button";
import { Download, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Fix for default icon image paths
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// An internal component that animates the map to a specific location
const MapFlyTo = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, map.getZoom());
  }, [center, map]);
  return null;
};

const Map = () => {
  const { toast } = useToast();
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);
  
  // Zimbabwe center coordinates
  const center: [number, number] = [-17.83, 31.05];
  
  // Fix Leaflet default icon
  useEffect(() => {
    // Fix default icon
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon,
      iconRetinaUrl: markerIcon2x,
      shadowUrl: markerShadow,
    });
  }, []);
  
  const handleSaveOffline = () => {
    toast({
      title: "Map saved offline",
      description: "This area has been saved for offline use",
    });
    setIsOfflineAvailable(true);
    // In a real app, we would save map tiles to IndexedDB or similar
    localStorage.setItem('offline_map_data', 'true');
  };
  
  useEffect(() => {
    // Check if we have cached data
    if (localStorage.getItem('offline_map_data')) {
      setIsOfflineAvailable(true);
    }
  }, []);

  // Create a custom red icon for hospitals
  const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Sample hospital data
  const hospitals = [
    { position: [-17.82, 31.04] as [number, number], name: "Parirenyatwa Hospital" },
    { position: [-17.84, 31.05] as [number, number], name: "Harare Central Hospital" },
    { position: [-17.83, 31.03] as [number, number], name: "Avenues Clinic" }
  ];

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <MapContainer 
        center={center}
        zoom={12} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {hospitals.map((hospital, index) => (
          <Marker 
            key={index} 
            position={hospital.position}
            icon={redIcon}
          >
            <Popup>
              <div>
                <h3 className="font-bold">{hospital.name}</h3>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Control to animate the map */}
        <MapFlyTo center={center} />
      </MapContainer>
      
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-[1000]">
        <Button 
          variant="secondary" 
          className="bg-white/90 dark:bg-gray-800/90 shadow-lg"
          onClick={handleSaveOffline}
        >
          <Download className="h-4 w-4 mr-2" />
          Save Offline
        </Button>
        
        {isOfflineAvailable && (
          <Button 
            variant="secondary" 
            className="bg-white/90 dark:bg-gray-800/90 shadow-lg"
          >
            <Layers className="h-4 w-4 mr-2" />
            Use Offline Map
          </Button>
        )}
      </div>
    </div>
  );
};

export default Map;
