
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FireExtinguisher, MapPin, ArrowLeft, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Mock fire stations - would be replaced with API data in production
const mockFireStations = [
  { id: 1, name: "Central Fire Station", address: "14 Simon Mazorodze Rd, Harare", phone: "995", distance: "1.8 km" },
  { id: 2, name: "Highlands Fire Station", address: "Enterprise Rd, Harare", phone: "993", distance: "3.2 km" },
  { id: 3, name: "Waterfalls Fire Station", address: "25 Seke Rd, Harare", phone: "994", distance: "5.5 km" },
  { id: 4, name: "Chitungwiza Fire Station", address: "Seke Rd, Chitungwiza", phone: "997", distance: "18.7 km" },
];

const FireStationCard = ({ station }: { station: typeof mockFireStations[0] }) => {
  const { toast } = useToast();
  
  const handleCall = () => {
    toast({
      title: `Calling ${station.name}`,
      description: `Dialing ${station.phone}...`,
    });
    
    // In a real app, this would trigger the phone call
    setTimeout(() => {
      window.location.href = `tel:${station.phone}`;
    }, 1000);
  };
  
  return (
    <Card className="mb-4 hover:shadow-md transition-all hover-scale">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg">{station.name}</h3>
            <p className="text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {station.address}
            </p>
            <p className="text-sm mt-1">{station.distance} away</p>
          </div>
          <div className="flex flex-col gap-2">
            <Button 
              size="sm" 
              onClick={handleCall}
              className="bg-red-600 hover:bg-red-700"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="mt-2"
            >
              Directions
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const FireEmergency = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [fireStations, setFireStations] = useState(mockFireStations);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFireStations(mockFireStations);
      return;
    }
    
    // In a real app, this would be an API call
    const filtered = mockFireStations.filter(station => 
      station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFireStations(filtered);
    toast({
      title: filtered.length ? `Found ${filtered.length} fire stations` : "No fire stations found",
      description: filtered.length ? "Showing nearest locations first" : "Try a different search term",
    });
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Fire Emergency Services</h1>
      </div>
      
      <Card className="mb-6 border-red-100 dark:border-red-900/20">
        <CardHeader className="bg-red-50 dark:bg-red-900/10 border-b border-red-100 dark:border-red-900/20">
          <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <FireExtinguisher className="h-5 w-5" />
            Fire Emergency Help
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-lg mb-4 border border-red-100 dark:border-red-900/30">
            <h3 className="font-bold text-red-600 dark:text-red-400 mb-2">In Case of Fire:</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Stay low to the ground to avoid smoke</li>
              <li>Feel doors with the back of your hand before opening</li>
              <li>Use stairs, never elevators</li>
              <li>Call emergency services immediately at 995</li>
              <li>Once out, stay out - never re-enter a burning building</li>
            </ul>
          </div>
          
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Search for fire stations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              Search
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              className="bg-red-600 hover:bg-red-700 h-auto py-3"
              onClick={() => {
                toast({
                  title: "Emergency Call",
                  description: "Calling Fire Emergency Services at 995",
                });
                window.location.href = "tel:995";
              }}
            >
              <Phone className="h-5 w-5 mr-2" />
              Call Fire Emergency (995)
            </Button>
            
            <Button 
              variant="outline" 
              className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/30 dark:text-red-400 dark:hover:bg-red-900/10 h-auto py-3"
              onClick={() => {
                toast({
                  title: "Using Current Location",
                  description: "Finding nearest fire stations...",
                });
              }}
            >
              <MapPin className="h-5 w-5 mr-2" />
              Use My Current Location
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Nearby Fire Stations</h2>
        {fireStations.map(station => (
          <FireStationCard key={station.id} station={station} />
        ))}
      </div>
    </div>
  );
};

export default FireEmergency;
