
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MapPin, 
  Search, 
  ArrowLeft, 
  Plus, 
  Hospital, 
  Phone, 
  Filter, 
  List, 
  Map as MapIcon, 
  X,
  Settings,
  Sliders
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Map from "@/components/Map";
import HospitalList from "@/components/HospitalList";
import LocationSelector from "@/components/LocationSelector";
import AdvancedSettingsDialog from "@/components/AdvancedSettingsDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Updated mock hospital data with additional fields
const initialHospitals = [
  { 
    id: 1, 
    name: "Medi-City Life Hospital", 
    address: "464 Josiah Tongogara Park, Harare", 
    distance: "1.6 Km", 
    emergency: true, 
    phone: "+263 242 701 555",
    wait_time: 15,
    specialty: "Multi Specialty",
    rating: 4.5,
    open_until: "12:30 am"
  },
  { 
    id: 2, 
    name: "Sunlife Hospital", 
    address: "464 Josiah Tongogara Park, Harare", 
    distance: "1.6 Km", 
    emergency: true, 
    phone: "+263 242 621 222",
    wait_time: 25,
    specialty: "Medical Specialty",
    rating: 4.2,
    open_until: "12:30 am"
  },
  { 
    id: 3, 
    name: "Cureio Hospital", 
    address: "464 Josiah Tongogara Park, Harare", 
    distance: "1.6 Km", 
    emergency: true, 
    phone: "+263 242 251 180",
    wait_time: 10,
    specialty: "Cancer Specialty",
    rating: 4.8,
    open_until: "12:30 am"
  },
  { 
    id: 4, 
    name: "Sun Life Hospital", 
    address: "464 Josiah Tongogara Park, Harare", 
    distance: "1.6 Km", 
    emergency: false, 
    phone: "+263 242 308 006",
    wait_time: 30,
    specialty: "Women Specialty",
    rating: 4.3,
    open_until: "12:30 am"
  },
  { 
    id: 5, 
    name: "MediCity Hospital", 
    address: "464 Josiah Tongogara Park, Harare", 
    distance: "1.6 Km", 
    emergency: true, 
    phone: "+263 242 223 323",
    wait_time: 20,
    specialty: "Multi Specialty",
    rating: 4.1,
    open_until: "12:30 am"
  },
  { 
    id: 6, 
    name: "Neuro Care Hospital", 
    address: "464 Josiah Tongogara Park, Harare", 
    distance: "1.6 Km", 
    emergency: true, 
    phone: "+263 242 223 323",
    wait_time: 45,
    specialty: "Neuro Specialty",
    rating: 4.4,
    open_until: "12:30 am"
  },
];

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
  const [isLocationSelectorOpen, setIsLocationSelectorOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [isFilterShown, setIsFilterShown] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentCity, setCurrentCity] = useState({ id: 1, name: "Harare" });

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
    
    // Filter hospitals based on search query
    const filtered = hospitals.filter(hospital => 
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hospital.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (hospital.specialty && hospital.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
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

  const handleDirections = (facility: any) => {
    toast({
      title: "Getting Directions",
      description: `Directions to ${facility.name}`,
    });
    // In a real app, this would navigate to a map view with directions
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
  
  const handleCitySelect = (city: any) => {
    setCurrentCity(city);
    toast({
      title: "Location Updated",
      description: `Showing hospitals near ${city.name}`,
    });
  };
  
  const handleUseCurrentLocation = () => {
    toast({
      title: "Using Current Location",
      description: "Finding hospitals near you...",
    });
    
    // In a real app, this would use the browser's geolocation API
    navigator.geolocation.getCurrentPosition(
      (position) => {
        toast({
          title: "Location Found",
          description: "Showing hospitals near your current location",
        });
      },
      (error) => {
        toast({
          variant: "destructive",
          title: "Location Error",
          description: "Unable to get your location. Please enable location services.",
        });
      }
    );
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setHospitals(initialHospitals);
  };

  return (
    <div className="container mx-auto pb-6 px-4 max-w-md mx-auto bg-background min-h-screen">
      {/* Header */}
      <header className="sticky top-0 bg-background border-b z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Hospital Locator</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {viewMode === 'list' && (
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setViewMode('map')}>
                <MapIcon className="h-5 w-5" />
              </Button>
            )}
            {viewMode === 'map' && (
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setViewMode('list')}>
                <List className="h-5 w-5" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9" 
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Search & Location Bar */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm h-8 px-3" 
            onClick={() => setIsLocationSelectorOpen(true)}
          >
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {currentCity.name}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="text-sm h-8 px-3 ml-auto" 
            onClick={() => setIsFilterShown(!isFilterShown)}
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            Filter
          </Button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search hospitals, specialties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-1 top-1 h-7 w-7" 
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {isFilterShown && (
          <Card className="mb-4 animate-in fade-in duration-300">
            <CardContent className="p-3">
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`justify-start h-8 ${hospitals.length === initialHospitals.length ? 'bg-primary/10' : ''}`}
                  onClick={() => setHospitals(initialHospitals)}
                >
                  All Hospitals
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`justify-start h-8 ${hospitals.some(h => h.emergency) && hospitals.length !== initialHospitals.length ? 'bg-primary/10' : ''}`}
                  onClick={() => setHospitals(initialHospitals.filter(h => h.emergency))}
                >
                  24h Emergency
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setHospitals(initialHospitals.sort((a, b) => (a.wait_time || 0) - (b.wait_time || 0)))}
                >
                  Lowest Wait Time
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="justify-start h-8"
                  onClick={() => setHospitals(initialHospitals.sort((a, b) => (b.rating || 0) - (a.rating || 0)))}
                >
                  Highest Rated
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          variant="secondary"
          onClick={handleUseCurrentLocation}
          className="w-full mb-4"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Use My Current Location
        </Button>
      </div>
      
      {/* Main Content */}
      {viewMode === 'list' ? (
        <div className="px-4">
          <HospitalList 
            facilities={hospitals} 
            onDirections={handleDirections} 
            onCall={handleCall} 
          />
        </div>
      ) : (
        <div className="h-[calc(100vh-210px)] overflow-hidden rounded-lg relative">
          <Map />
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="bg-white/95 backdrop-blur-sm">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Hospitals Near You</h3>
                    <p className="text-sm text-muted-foreground">
                      {hospitals.length} facilities found
                    </p>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => setViewMode('list')}
                  >
                    View List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      
      {/* Emergency Notice */}
      <div className="mt-8 p-4 mx-4 bg-muted rounded-lg text-center">
        <p className="text-muted-foreground">
          In case of severe emergency, immediately call 999 or your local emergency number
        </p>
      </div>
      
      {/* Dialogs */}
      {user && (
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg">
              <Plus className="h-5 w-5" />
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
      
      <LocationSelector
        open={isLocationSelectorOpen}
        onClose={() => setIsLocationSelectorOpen(false)}
        onSelectLocation={handleCitySelect}
        currentLocation={currentCity}
      />
      
      <AdvancedSettingsDialog
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};

export default HospitalLocator;
