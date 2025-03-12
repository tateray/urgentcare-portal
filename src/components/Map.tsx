
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button } from "@/components/ui/button";
import { Download, Layers } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { toast } = useToast();
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);

  const handleSaveOffline = () => {
    // In a real app, this would use a storage API
    // For this demo, we'll just simulate saving with a toast
    toast({
      title: "Map saved offline",
      description: "This area has been saved for offline use",
    });
    setIsOfflineAvailable(true);
    localStorage.setItem('offline_map_data', 'true');
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map with OpenStreetMap
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'osm': {
              type: 'raster',
              tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
              tileSize: 256,
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          },
          layers: [
            {
              id: 'osm-tiles',
              type: 'raster',
              source: 'osm',
              minzoom: 0,
              maxzoom: 19
            }
          ]
        },
        center: [31.05, -17.83], // Zimbabwe coordinates
        zoom: 6,
      });

      // Add navigation controls
      map.current.addControl(
        new maplibregl.NavigationControl(),
        'top-right'
      );

      // Add hospitals markers (mock data for now)
      const hospitals = [
        { coordinates: [31.04, -17.82], name: "Parirenyatwa Hospital" },
        { coordinates: [31.05, -17.84], name: "Harare Central Hospital" },
        { coordinates: [31.03, -17.83], name: "Avenues Clinic" }
      ];

      // Wait for map to load before adding markers
      map.current.on('load', () => {
        hospitals.forEach(hospital => {
          // Create a DOM element for the marker
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/33/33777.png)';
          el.style.width = '25px';
          el.style.height = '25px';
          el.style.backgroundSize = '100%';
          
          // Add marker to map
          new maplibregl.Marker(el)
            .setLngLat(hospital.coordinates as [number, number])
            .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(`<h3>${hospital.name}</h3>`))
            .addTo(map.current!);
        });
      });

      // Check if we have cached data
      if (localStorage.getItem('offline_map_data')) {
        setIsOfflineAvailable(true);
      }
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

      <style>
        {`
          .marker {
            cursor: pointer;
          }
        `}
      </style>
    </div>
  );
};

export default Map;
