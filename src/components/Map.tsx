
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Button } from "@/components/ui/button";
import { Download, Layers, Clock, Navigation, List } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Facility {
  id: number;
  coordinates: [number, number];
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'emergency';
  wait_time?: number; // in minutes
  distance?: number; // in km
}

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { toast } = useToast();
  const [isOfflineAvailable, setIsOfflineAvailable] = useState(false);
  const [activeTab, setActiveTab] = useState('facilities');
  const [heatmapType, setHeatmapType] = useState('density');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  // Mock data - would be replaced with real API data
  const mockFacilities: Facility[] = [
    { id: 1, coordinates: [31.04, -17.82], name: "Parirenyatwa Hospital", type: 'hospital', wait_time: 45 },
    { id: 2, coordinates: [31.05, -17.84], name: "Harare Central Hospital", type: 'hospital', wait_time: 30 },
    { id: 3, coordinates: [31.03, -17.83], name: "Avenues Clinic", type: 'clinic', wait_time: 15 },
    { id: 4, coordinates: [31.02, -17.81], name: "Westend Clinic", type: 'clinic', wait_time: 10 },
    { id: 5, coordinates: [31.06, -17.82], name: "City Pharmacy", type: 'pharmacy', wait_time: 5 },
    { id: 6, coordinates: [31.04, -17.85], name: "Emergency Center", type: 'emergency', wait_time: 0 },
    { id: 7, coordinates: [31.08, -17.83], name: "Community Health Center", type: 'clinic', wait_time: 25 },
    { id: 8, coordinates: [31.07, -17.86], name: "General Hospital", type: 'hospital', wait_time: 60 },
    { id: 9, coordinates: [31.01, -17.84], name: "Family Pharmacy", type: 'pharmacy', wait_time: 8 },
  ];

  const handleSaveOffline = () => {
    // In a real app, this would use a storage API
    toast({
      title: "Map saved offline",
      description: "This area has been saved for offline use",
    });
    setIsOfflineAvailable(true);
    localStorage.setItem('offline_map_data', 'true');
  };

  const getFacilityColor = (type: string) => {
    switch (type) {
      case 'hospital': return '#ff0000'; // Red
      case 'clinic': return '#00ff00'; // Green
      case 'pharmacy': return '#0000ff'; // Blue
      case 'emergency': return '#ff00ff'; // Magenta
      default: return '#000000'; // Black
    }
  };

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'hospital': return 'https://cdn-icons-png.flaticon.com/512/33/33777.png';
      case 'clinic': return 'https://cdn-icons-png.flaticon.com/512/2785/2785482.png';
      case 'pharmacy': return 'https://cdn-icons-png.flaticon.com/512/1228/1228086.png';
      case 'emergency': return 'https://cdn-icons-png.flaticon.com/512/1993/1993780.png';
      default: return 'https://cdn-icons-png.flaticon.com/512/33/33777.png';
    }
  };

  const calculateDistance = (point1: [number, number], point2: [number, number]): number => {
    // Simple Euclidean distance calculation - in a real app use Haversine formula
    const R = 6371; // Radius of the Earth in km
    const dLat = (point2[1] - point1[1]) * Math.PI / 180;
    const dLon = (point2[0] - point1[0]) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1[1] * Math.PI / 180) * Math.cos(point2[1] * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const calculateTime = (distance: number): number => {
    // Assuming average speed of 30 km/h in city traffic
    return Math.round(distance / 30 * 60);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLoc: [number, number] = [position.coords.longitude, position.coords.latitude];
        setUserLocation(userLoc);
        
        // Update facilities with distances
        const updatedFacilities = mockFacilities.map(facility => {
          const distance = calculateDistance(userLoc, facility.coordinates);
          return {
            ...facility,
            distance: parseFloat(distance.toFixed(1))
          };
        });
        
        setFacilities(updatedFacilities);
        
        // If map exists, add user marker and fly to location
        if (map.current) {
          // Remove existing user marker if it exists
          const existingMarker = document.getElementById('user-location-marker');
          if (existingMarker) {
            existingMarker.remove();
          }
          
          // Add user marker
          const el = document.createElement('div');
          el.id = 'user-location-marker';
          el.className = 'user-marker';
          el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/149/149060.png)';
          el.style.width = '25px';
          el.style.height = '25px';
          el.style.backgroundSize = '100%';
          
          new maplibregl.Marker(el)
            .setLngLat(userLoc)
            .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML('<h3>Your Location</h3>'))
            .addTo(map.current);
            
          map.current.flyTo({
            center: userLoc,
            zoom: 13
          });
          
          toast({
            title: "Location Found",
            description: "Map centered to your current location",
          });
        }
      }, (error) => {
        console.error("Error getting location:", error);
        toast({
          title: "Location Error",
          description: "Unable to get your current location",
          variant: "destructive",
        });
      });
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive",
      });
    }
  };

  const renderHeatmap = (type: string) => {
    if (!map.current || facilities.length === 0) return;
    
    // Remove existing heatmap layers if they exist
    if (map.current.getLayer('heatmap-layer')) {
      map.current.removeLayer('heatmap-layer');
    }
    if (map.current.getSource('heatmap-source')) {
      map.current.removeSource('heatmap-source');
    }
    
    // Create data for the heatmap
    const heatmapData = {
      type: 'FeatureCollection',
      features: facilities.map(facility => {
        let weight = 1;
        
        if (type === 'wait-time') {
          // Higher wait time = higher intensity
          weight = facility.wait_time ? facility.wait_time / 10 : 0.5;
        } else if (type === 'density') {
          // All equal weight for density view
          weight = 1;
        } else if (type === 'distance') {
          // Closer facilities get higher weight
          weight = facility.distance ? 5 / facility.distance : 1;
        }
        
        return {
          type: 'Feature',
          properties: {
            weight: weight
          },
          geometry: {
            type: 'Point',
            coordinates: facility.coordinates
          }
        };
      })
    };
    
    // Add the heatmap source and layer
    map.current.addSource('heatmap-source', {
      type: 'geojson',
      data: heatmapData as any
    });
    
    map.current.addLayer({
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'heatmap-source',
      paint: {
        'heatmap-weight': ['get', 'weight'],
        'heatmap-intensity': 0.6,
        'heatmap-radius': 40,
        'heatmap-color': [
          'interpolate',
          ['linear'],
          ['heatmap-density'],
          0, 'rgba(0, 0, 255, 0)',
          0.2, 'rgba(0, 255, 255, 0.5)',
          0.4, 'rgba(0, 255, 0, 0.5)',
          0.6, 'rgba(255, 255, 0, 0.5)',
          0.8, 'rgba(255, 0, 0, 0.5)',
          1, 'rgba(255, 0, 0, 0.8)'
        ]
      }
    }, 'osm-tiles');
  };

  const renderRoute = (destination: [number, number]) => {
    if (!map.current || !userLocation) return;
    
    // In a real app, this would use a routing API like Mapbox Directions or OSRM
    // For demo purposes, we'll just draw a direct line
    
    // Remove existing route if it exists
    if (map.current.getLayer('route-layer')) {
      map.current.removeLayer('route-layer');
    }
    if (map.current.getSource('route-source')) {
      map.current.removeSource('route-source');
    }
    
    // Create a simple route line
    const routeData = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: [userLocation, destination]
          }
        }
      ]
    };
    
    // Add the route source and layer
    map.current.addSource('route-source', {
      type: 'geojson',
      data: routeData as any
    });
    
    map.current.addLayer({
      id: 'route-layer',
      type: 'line',
      source: 'route-source',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#0080ff',
        'line-width': 4,
        'line-opacity': 0.7
      }
    });
  };

  const handleFacilityClick = (facility: Facility) => {
    setSelectedFacility(facility);
    
    if (userLocation) {
      renderRoute(facility.coordinates);
    }
    
    toast({
      title: facility.name,
      description: `Estimated wait time: ${facility.wait_time} minutes` + 
                  (facility.distance ? ` • Distance: ${facility.distance} km` : '') +
                  (facility.distance ? ` • Travel time: ~${calculateTime(facility.distance)} min` : ''),
    });
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
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(
        new maplibregl.NavigationControl(),
        'top-right'
      );

      // Set facilities and add markers when map loads
      map.current.on('load', () => {
        setFacilities(mockFacilities);
        
        // Add facility markers
        mockFacilities.forEach(facility => {
          // Create a DOM element for the marker
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.backgroundImage = `url(${getFacilityIcon(facility.type)})`;
          el.style.width = '30px';
          el.style.height = '30px';
          el.style.backgroundSize = '100%';
          el.style.cursor = 'pointer';
          
          // Add a border color based on facility type
          el.style.border = `2px solid ${getFacilityColor(facility.type)}`;
          el.style.borderRadius = '50%';
          el.style.backgroundColor = 'white';
          
          // Add marker to map
          const marker = new maplibregl.Marker(el)
            .setLngLat(facility.coordinates as [number, number])
            .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(
              `<h3>${facility.name}</h3>
              <p>Type: ${facility.type.charAt(0).toUpperCase() + facility.type.slice(1)}</p>
              <p>Estimated wait: ${facility.wait_time} minutes</p>`
            ))
            .addTo(map.current!);
            
          // Add click event to marker
          el.addEventListener('click', () => {
            handleFacilityClick(facility);
          });
        });
        
        // Get user location if allowed
        getUserLocation();
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

  // Apply heatmap when type changes or when facilities/userLocation updates
  useEffect(() => {
    if (activeTab === 'heatmap' && heatmapType) {
      renderHeatmap(heatmapType);
    }
  }, [activeTab, heatmapType, facilities, userLocation]);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 p-2 rounded-lg shadow-lg">
        <Tabs defaultValue="facilities" value={activeTab} onValueChange={setActiveTab} className="w-48">
          <TabsList className="grid grid-cols-2 mb-2">
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
          </TabsList>
          
          <TabsContent value="facilities">
            <div className="text-sm font-medium mb-2">Legend:</div>
            <div className="space-y-1">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-red-600 rounded-full mr-2"></div>
                <span className="text-sm">Hospital</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
                <span className="text-sm">Clinic</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full mr-2"></div>
                <span className="text-sm">Pharmacy</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-purple-600 rounded-full mr-2"></div>
                <span className="text-sm">Emergency</span>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="heatmap">
            <div className="space-y-2">
              <div className="text-sm font-medium">Heatmap Type:</div>
              <Select 
                defaultValue="density" 
                value={heatmapType} 
                onValueChange={(value) => setHeatmapType(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="density">Facility Density</SelectItem>
                  <SelectItem value="wait-time">Wait Times</SelectItem>
                  <SelectItem value="distance">Distance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedFacility && userLocation && (
        <div className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-800/90 p-3 rounded-lg shadow-lg max-w-xs">
          <h3 className="font-bold mb-1">{selectedFacility.name}</h3>
          <div className="text-sm space-y-1">
            <p>Type: {selectedFacility.type.charAt(0).toUpperCase() + selectedFacility.type.slice(1)}</p>
            <p>Wait time: {selectedFacility.wait_time} minutes</p>
            {selectedFacility.distance && (
              <>
                <p>Distance: {selectedFacility.distance} km</p>
                <p>Estimated travel: {calculateTime(selectedFacility.distance)} minutes</p>
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <Button 
          variant="secondary" 
          className="bg-white/90 dark:bg-gray-800/90 shadow-lg"
          onClick={() => getUserLocation()}
        >
          <Navigation className="h-4 w-4 mr-2" />
          My Location
        </Button>
        
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
            transition: transform 0.2s;
          }
          .marker:hover {
            transform: scale(1.1);
          }
          .user-marker {
            cursor: default;
            border: 2px solid #0080ff;
            border-radius: 50%;
            background-color: white;
            background-size: cover;
          }
        `}
      </style>
    </div>
  );
};

export default Map;
