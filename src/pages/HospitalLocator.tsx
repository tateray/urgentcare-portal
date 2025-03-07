
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Search, ArrowLeft, Plus, Hospital, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Map from "@/components/Map";

// Mock hospital data - would be replaced with real API data in production
const initialHospitals = [
  { id: 1, name: "Parirenyatwa Group of Hospitals", address: "Mazowe Street, Harare", distance: "2.3 km", emergency: true, phone: "+263 242 701 555" },
  { id: 2, name: "Harare Central Hospital", address: "Lobengula Road, Harare", distance: "3.5 km", emergency: true, phone: "+263 242 621 222" },
  { id: 3, name: "Avenues Clinic", address: "Cnr Baines Ave & Mazoe St, Harare", distance: "4.1 km", emergency: true, phone: "+263 242 251 180" },
  { id: 4, name: "Westend Hospital", address: "Mutare Road, Harare", distance: "5.8 km", emergency: false, phone: "+263 242 308 006" },
  { id: 5, name: "Chitungwiza Central Hospital", address: "Chitungwiza", distance: "20.4 km", emergency: true, phone: "+263 242 223 323" },
];

const HospitalCard = ({ hospital, onCall }: { hospital: any; onCall: (phone: string) => void }) => (
  <Card className="mb-4 hover:shadow-md transition-all hover-scale">
    <CardContent className="p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">{hospital.name}</h3>
          <p className="text-muted-foreground flex items-center gap-1">
            <MapPin className="h-4 w-4" /> {hospital.address}
          </p>
          <p className="text-sm mt-1">{hospital.distance} away</p>
          <p className="text-sm mt-1 flex items-center gap-1">
            <Phone className="h-3 w-3" /> {hospital.phone}
          </p>
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
          <Button size="sm" variant="outline" onClick={() => onCall(hospital.phone)}>
            Call
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const AddHospitalForm = ({ onAddHospital, onClose }: { onAddHospital: (hospital: any) => void; onClose: () => void }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [hasEmergency, setHasEmergency] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !address || !phone) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive"
      });
      return;
    }
    
    const newHospital = {
      id: Date.now(),
      name,
      address,
      distance: "Unknown", // In a real app, this would be calculated
      emergency: hasEmergency,
      phone
    };
    
    onAddHospital(newHospital);
    toast({
      title: "Hospital Added",
      description: `${name} has been added to the directory`
    });
    
    // Reset form
    setName("");
    setAddress("");
    setPhone("");
    setHasEmergency(false);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">Hospital Name</label>
        <Input 
          id="name" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter hospital name" 
          required
        />
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
        <Input 
          id="address" 
          value={address} 
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter hospital address" 
          required
        />
      </div>
      
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
        <Input 
          id="phone" 
          value={phone} 
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter contact number" 
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="emergency"
          checked={hasEmergency}
          onChange={(e) => setHasEmergency(e.target.checked)}
          className="rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="emergency" className="text-sm font-medium">Has 24-hour emergency services</label>
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">Add Hospital</Button>
      </DialogFooter>
    </form>
  );
};

const HospitalLocator = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [hospitals, setHospitals] = useState(initialHospitals);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showMap, setShowMap] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setHospitals(initialHospitals);
      return;
    }
    
    // In a real app, this would be an API call
    const filtered = hospitals.filter(hospital => 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setHospitals(filtered);
    toast({
      title: filtered.length ? `Found ${filtered.length} hospitals` : "No hospitals found",
      description: filtered.length ? "Showing nearest locations first" : "Try a different search term",
    });
  };

  const handleAddHospital = (newHospital: any) => {
    setHospitals([...hospitals, newHospital]);
  };

  const handleCall = (phone: string) => {
    toast({
      title: "Calling Hospital",
      description: `Dialing ${phone}...`,
    });
    
    // In a real app, this would trigger the phone call
    setTimeout(() => {
      window.location.href = `tel:${phone}`;
    }, 1000);
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Find Nearby Hospitals</CardTitle>
              <CardDescription>
                Search for hospitals and medical facilities near your location
              </CardDescription>
            </div>
            {user && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hospital
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Hospital</DialogTitle>
                    <DialogDescription>
                      Add a new hospital to the directory
                    </DialogDescription>
                  </DialogHeader>
                  <AddHospitalForm 
                    onAddHospital={handleAddHospital} 
                    onClose={() => setIsAddDialogOpen(false)} 
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
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
        <CardFooter className="flex justify-end">
          <Button variant="ghost" onClick={() => setShowMap(!showMap)}>
            {showMap ? "Hide Map" : "Show Map"}
          </Button>
        </CardFooter>
      </Card>
      
      {showMap && (
        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="h-[400px]">
              <Map />
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-4">Nearby Hospitals</h2>
        {hospitals.map(hospital => (
          <HospitalCard key={hospital.id} hospital={hospital} onCall={handleCall} />
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
