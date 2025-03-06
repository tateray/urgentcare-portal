
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Search, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Mock hospital data - would be replaced with real API data in production
const mockHospitals = [
  { id: 1, name: "Parirenyatwa Group of Hospitals", address: "Mazowe Street, Harare", distance: "2.3 km", emergency: true },
  { id: 2, name: "Harare Central Hospital", address: "Lobengula Road, Harare", distance: "3.5 km", emergency: true },
  { id: 3, name: "Avenues Clinic", address: "Cnr Baines Ave & Mazoe St, Harare", distance: "4.1 km", emergency: true },
  { id: 4, name: "Westend Hospital", address: "Mutare Road, Harare", distance: "5.8 km", emergency: false },
  { id: 5, name: "Chitungwiza Central Hospital", address: "Chitungwiza", distance: "20.4 km", emergency: true },
];

const HospitalCard = ({ hospital }: { hospital: typeof mockHospitals[0] }) => (
  <Card className="mb-4 hover:shadow-md transition-all hover-scale">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">{hospital.name}</h3>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {hospital.address}
          </p>
          <p className="text-sm mt-1">{hospital.distance} away</p>
        </div>
        <div className="flex flex-col gap-2">
          {hospital.emergency && (
            <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
              24h Emergency
            </span>
          )}
          <Button size="sm" className="mt-2">
            Directions
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const HospitalLocator = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState(mockHospitals);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setHospitals(mockHospitals);
      return;
    }
    
    // In a real app, this would be an API call
    const filtered = mockHospitals.filter(hospital => 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setHospitals(filtered);
    toast({
      title: filtered.length ? `Found ${filtered.length} hospitals` : "No hospitals found",
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
        <h1 className="text-2xl font-bold">Hospital Locator</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Find Nearby Hospitals</CardTitle>
          <CardDescription>
            Search for hospitals and medical facilities near your location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Search by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "Using Current Location",
                  description: "Finding hospitals near you...",
                });
              }}
              className="w-full"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Use My Current Location
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Nearby Hospitals</h2>
        {hospitals.map(hospital => (
          <HospitalCard key={hospital.id} hospital={hospital} />
        ))}
      </div>
      
      <div className="mt-8 p-4 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          In case of severe emergency, immediately call 999 or your local emergency number
        </p>
      </div>
    </div>
  );
};

export default HospitalLocator;
