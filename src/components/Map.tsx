
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from "@/components/ui/button";
import { Download, Map as MapIcon, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from '@/contexts/LanguageContext';

// Fix leaflet icon issues
useEffect(() => {
  // This is needed for the Leaflet icons to work properly
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}, []);

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const { toast } = useToast();
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(
    localStorage.getItem('offline_map_data') !== null
  );
  const { translations } = useLanguage();

  const handleSaveOffline = () => {
    // In a real app, this would use more sophisticated offline storage
    // For this demo, we'll just save the current view
    if (map.current) {
      const center = map.current.getCenter();
      const zoom = map.current.getZoom();
      
      const offlineData = {
        center: { lat: center.lat, lng: center.lng },
        zoom: zoom,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem('offline_map_data', JSON.stringify(offlineData));
      
      toast({
        title: "Map saved offline",
        description: "This area has been saved for offline use",
      });
      
      setIsOfflineAvailable(true);
    }
  };

  const handleUseOfflineMap = () => {
    const offlineData = localStorage.getItem('offline_map_data');
    
    if (offlineData && map.current) {
      try {
        const { center, zoom } = JSON.parse(offlineData);
        map.current.setView([center.lat, center.lng], zoom);
        
        toast({
          title: "Using offline map",
          description: "Loaded your saved map area",
        });
      } catch (e) {
        toast({
          title: "Error loading offline map",
          description: "Could not load offline map data",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // Initialize map with OpenStreetMap
      map.current = L.map(mapContainer.current).setView([-17.83, 31.05], 6); // Zimbabwe coordinates
      
      // Add OSM tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);
      
      // Add hospitals markers (mock data)
      const hospitals = [
        { position: [-17.82, 31.04], name: "Parirenyatwa Hospital" },
        { position: [-17.84, 31.05], name: "Harare Central Hospital" },
        { position: [-17.83, 31.03], name: "Avenues Clinic" }
      ];
      
      hospitals.forEach(hospital => {
        L.marker(hospital.position as [number, number])
          .addTo(map.current!)
          .bindPopup(`<h3>${hospital.name}</h3>`)
          .setIcon(
            new L.Icon({
              iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
              iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
              shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41]
            })
          );
      });
      
      // Add zoom control
      L.control.zoom({ position: 'topright' }).addTo(map.current);
      
      // Add scale control
      L.control.scale().addTo(map.current);
      
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "There was an error loading the map.",
        variant: "destructive",
      });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [toast]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          className="bg-white/90 dark:bg-gray-800/90 shadow-lg"
          onClick={handleSaveOffline}
        >
          <Download className="h-4 w-4 mr-2" />
          {translations.saveOffline}
        </Button>
        
        {isOfflineAvailable && (
          <Button 
            variant="secondary" 
            className="bg-white/90 dark:bg-gray-800/90 shadow-lg"
            onClick={handleUseOfflineMap}
          >
            <Layers className="h-4 w-4 mr-2" />
            {translations.useOfflineMap}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Map;
