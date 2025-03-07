
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "@/components/ui/button";
import { Download, Map as MapIcon, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Temporary token input component
const MapboxTokenInput = ({ onTokenSubmit }: { onTokenSubmit: (token: string) => void }) => {
  const [token, setToken] = useState('');
  
  return (
    <div className="p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
      <h3 className="text-lg font-medium mb-4">Mapbox API Token Required</h3>
      <p className="mb-4 text-sm text-muted-foreground">
        To display the map, please enter your Mapbox public token. You can find this in your Mapbox account dashboard.
      </p>
      <div className="flex gap-2">
        <input 
          type="text" 
          value={token} 
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter your Mapbox public token"
          className="flex-1 px-3 py-2 border rounded-md"
        />
        <Button onClick={() => onTokenSubmit(token)}>
          Submit
        </Button>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Your token will be stored in your browser's local storage.
      </p>
    </div>
  );
};

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(
    localStorage.getItem('mapbox_token')
  );
  const { toast } = useToast();
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);

  const handleTokenSubmit = (token: string) => {
    localStorage.setItem('mapbox_token', token);
    setMapboxToken(token);
    toast({
      title: "Token saved",
      description: "Your Mapbox token has been saved",
    });
  };

  const handleSaveOffline = () => {
    // In a real app, this would use the Mapbox Offline API
    // For this demo, we'll just simulate saving with a toast
    toast({
      title: "Map saved offline",
      description: "This area has been saved for offline use",
    });
    setIsOfflineAvailable(true);
  };

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [31.05, -17.83], // Zimbabwe coordinates
        zoom: 6,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add hospitals markers (mock data for now)
      // Fix: Explicitly type the lngLat as [number, number] tuples instead of number[]
      const hospitals = [
        { lngLat: [31.04, -17.82] as [number, number], name: "Parirenyatwa Hospital" },
        { lngLat: [31.05, -17.84] as [number, number], name: "Harare Central Hospital" },
        { lngLat: [31.03, -17.83] as [number, number], name: "Avenues Clinic" }
      ];

      hospitals.forEach(hospital => {
        const marker = new mapboxgl.Marker({ color: "#FF0000" })
          .setLngLat(hospital.lngLat)
          .setPopup(new mapboxgl.Popup().setHTML(`<h3>${hospital.name}</h3>`))
          .addTo(map.current!);
      });

      // Check if we have cached data
      if (localStorage.getItem('offline_map_data')) {
        setIsOfflineAvailable(true);
      }
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Map Error",
        description: "There was an error loading the map. Please check your token.",
        variant: "destructive",
      });
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, toast]);

  if (!mapboxToken) {
    return <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />;
  }

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
