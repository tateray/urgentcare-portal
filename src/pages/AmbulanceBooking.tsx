
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Ambulance, MapPin, Clock, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AmbulanceBooking = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [patientName, setPatientName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [isEmergency, setIsEmergency] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location || !contactNumber) {
      toast({
        title: "Missing Information",
        description: "Please provide location and contact number",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: isEmergency ? "Emergency Ambulance Dispatched" : "Ambulance Booking Confirmed",
      description: isEmergency 
        ? "An ambulance has been dispatched to your location" 
        : "Your ambulance has been booked successfully",
      variant: isEmergency ? "destructive" : "default",
    });
    
    // Reset form in non-emergency cases
    if (!isEmergency) {
      setLocation("");
      setDetails("");
      setPatientName("");
      setContactNumber("");
    }
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Ambulance Services</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className={`border-destructive ${isEmergency ? 'bg-destructive/5' : ''}`}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Emergency
            </CardTitle>
            <CardDescription>
              For life-threatening situations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Dispatch an ambulance immediately for critical medical emergencies
            </p>
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={() => {
                setIsEmergency(true);
                toast({
                  title: "Emergency Mode Activated",
                  description: "Please provide location details",
                  variant: "destructive",
                });
              }}
            >
              <Ambulance className="h-4 w-4 mr-2" />
              Request Emergency Ambulance
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Scheduled
            </CardTitle>
            <CardDescription>
              For planned medical transportation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Book an ambulance for a specific date and time
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                setIsEmergency(false);
                toast({
                  title: "Schedule Ambulance",
                  description: "Please fill in the booking form",
                });
              }}
            >
              Schedule Ambulance
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Track
            </CardTitle>
            <CardDescription>
              Track your ambulance in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              View the location and ETA of your dispatched ambulance
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "No Active Bookings",
                  description: "You don't have any ambulances currently dispatched",
                });
              }}
            >
              Track Ambulance
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className={isEmergency ? 'border-destructive' : ''}>
        <CardHeader>
          <CardTitle>
            {isEmergency ? 'Emergency Ambulance Request' : 'Ambulance Booking Form'}
          </CardTitle>
          <CardDescription>
            {isEmergency 
              ? 'Please provide your location for immediate dispatch' 
              : 'Fill in the details to book an ambulance'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">
                Location <span className="text-destructive">*</span>
              </label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  placeholder="Enter your current location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Using Current Location",
                      description: "Detecting your GPS location...",
                    });
                    // Simulate getting location
                    setTimeout(() => {
                      setLocation("123 Example Street, Harare");
                      toast({
                        title: "Location Detected",
                        description: "123 Example Street, Harare",
                      });
                    }, 1500);
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Current Location
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium">
                Situation Details
              </label>
              <Textarea
                id="details"
                placeholder="Describe the medical situation or special requirements"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="patientName" className="text-sm font-medium">
                  Patient Name
                </label>
                <Input
                  id="patientName"
                  placeholder="Full name of the patient"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contactNumber" className="text-sm font-medium">
                  Contact Number <span className="text-destructive">*</span>
                </label>
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="Phone number for communication"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            
            {!isEmergency && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="date" className="text-sm font-medium">
                    Date <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="date"
                    type="date"
                    required={!isEmergency}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="time" className="text-sm font-medium">
                    Time <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="time"
                    type="time"
                    required={!isEmergency}
                  />
                </div>
              </div>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full"
            variant={isEmergency ? "destructive" : "default"}
            onClick={handleSubmit}
          >
            <Ambulance className="h-4 w-4 mr-2" />
            {isEmergency ? 'Dispatch Emergency Ambulance Now' : 'Book Ambulance'}
          </Button>
        </CardFooter>
      </Card>
      
      {isEmergency && (
        <div className="mt-6 p-4 bg-destructive/10 rounded-lg text-center">
          <p className="text-destructive font-medium">
            For immediate life-threatening emergencies, please also call 999 directly
          </p>
        </div>
      )}
    </div>
  );
};

export default AmbulanceBooking;
