
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Bell, 
  Settings, 
  Search, 
  Filter,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import WelcomeCard from "@/components/WelcomeCard";
import SpecialtyMenu from "@/components/SpecialtyMenu";
import HospitalList from "@/components/HospitalList";
import DoctorAppointment from "@/components/DoctorAppointment";
import { useToast } from "@/hooks/use-toast";

// Mock user data
const userData = {
  name: "Isabella",
  image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
};

// Mock insurance data
const insuranceData = {
  title: "Health Individual Insurances",
  coverage: "100%",
  available: "8,500",
  spent: "6,500",
};

// Mock facility/doctor data
const doctors = [
  {
    id: "1234567",
    name: "Dr. Olivia Davis",
    specialty: "Allergist",
    rating: 5.0,
    distance: "2.3 km",
    timeToReach: "11 min",
    emergency: false,
    phone: "123-456-7890",
    address: "123 Medical Center Dr",
    wait_time: 15,
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "2345678",
    name: "Dr. James Arthur",
    specialty: "Cardiologist",
    rating: 4.8,
    distance: "3.5 km",
    timeToReach: "15 min",
    emergency: false,
    phone: "234-567-8901",
    address: "456 Heart Health Blvd",
    wait_time: 30,
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "3456789",
    name: "Dr. Benjamin Carter",
    specialty: "Surgeon",
    rating: 5.0,
    distance: "4.1 km",
    timeToReach: "18 min",
    emergency: true,
    phone: "345-678-9012",
    address: "789 Surgical Center Ave",
    wait_time: 20,
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    id: "4567890",
    name: "Dr. James Antonio",
    specialty: "Neurologist",
    rating: 4.9,
    distance: "5.0 km",
    timeToReach: "20 min",
    emergency: false,
    phone: "456-789-0123",
    address: "101 Brain Health St",
    wait_time: 45,
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1887&auto=format&fit=crop"
  }
];

const HomeRedesigned = () => {
  const [view, setView] = useState<'home' | 'specialists' | 'appointment'>('home');
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const { toast } = useToast();

  const handleDirections = (facility: any) => {
    toast({
      title: "Directions",
      description: `Opening directions to ${facility.name}`,
    });
  };

  const handleCall = (phone: string) => {
    toast({
      title: "Calling",
      description: `Dialing ${phone}...`,
    });
    window.location.href = `tel:${phone}`;
  };

  const handleSelectSpecialty = (specialty: string) => {
    toast({
      title: "Specialty Selected",
      description: `You selected ${specialty}`,
    });
    setView('specialists');
  };

  const handleSelectDoctor = (doctor: any) => {
    setSelectedDoctor(doctor);
    setView('appointment');
  };

  const handleBookAppointment = (doctor: any, time: string) => {
    toast({
      title: "Appointment Booked",
      description: `You booked an appointment with ${doctor.name} at ${time}`,
    });
    setView('home');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <MapPin className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">Harare, Zimbabwe</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20">
        {view === 'home' && (
          <>
            <WelcomeCard 
              user={userData} 
              insurance={insuranceData} 
              className="mb-8"
            />
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Medical Services</h2>
                <Button variant="link" className="text-primary">
                  See All
                </Button>
              </div>
              <SpecialtyMenu onSelect={handleSelectSpecialty} />
            </div>
            
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Top Specialists</h2>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <HospitalList 
                facilities={doctors} 
                onDirections={handleDirections}
                onCall={handleCall}
                onSelect={handleSelectDoctor}
                view="specialist"
              />
            </div>
          </>
        )}

        {view === 'specialists' && (
          <>
            <div className="flex items-center mb-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setView('home')}
                className="mr-2"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-2xl font-bold">Choose Your Specialist</h2>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Search specialist..."
                  className="pl-9 pr-4 py-2 w-full rounded-full border border-input"
                />
              </div>
              <Button variant="filter" size="pill" className="ml-2">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
            
            <HospitalList 
              facilities={doctors} 
              onDirections={handleDirections}
              onCall={handleCall}
              onSelect={handleSelectDoctor}
              view="specialist"
            />
          </>
        )}

        {view === 'appointment' && selectedDoctor && (
          <DoctorAppointment 
            doctor={selectedDoctor}
            onBack={() => setView('specialists')}
            onBookAppointment={handleBookAppointment}
          />
        )}
      </main>
    </div>
  );
};

export default HomeRedesigned;
