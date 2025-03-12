
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calendar, Clock, MapPin, User, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Hospital {
  id: number;
  name: string;
  address: string;
}

interface AppointmentSlot {
  time: string;
  available: boolean;
}

const AppointmentScheduling = () => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [description, setDescription] = useState("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  
  // Sample data for departments
  const departments = [
    { id: "cardiology", name: "Cardiology" },
    { id: "dermatology", name: "Dermatology" },
    { id: "neurology", name: "Neurology" },
    { id: "orthopedics", name: "Orthopedics" },
    { id: "pediatrics", name: "Pediatrics" },
    { id: "general", name: "General Practice" }
  ];
  
  // Sample data for doctors by department
  const doctorsByDepartment: Record<string, {id: string, name: string}[]> = {
    "cardiology": [
      { id: "c1", name: "Dr. Sarah Moyo (Cardiology)" },
      { id: "c2", name: "Dr. Felix Chimedza (Cardiology)" }
    ],
    "dermatology": [
      { id: "d1", name: "Dr. Lisa Ndlovu (Dermatology)" },
      { id: "d2", name: "Dr. Robert Mutare (Dermatology)" }
    ],
    "neurology": [
      { id: "n1", name: "Dr. James Gumbo (Neurology)" },
      { id: "n2", name: "Dr. Tsitsi Hwata (Neurology)" }
    ],
    "orthopedics": [
      { id: "o1", name: "Dr. Michael Rusike (Orthopedics)" },
      { id: "o2", name: "Dr. Grace Mubaiwa (Orthopedics)" }
    ],
    "pediatrics": [
      { id: "p1", name: "Dr. Elizabeth Mataka (Pediatrics)" },
      { id: "p2", name: "Dr. Samuel Gwati (Pediatrics)" }
    ],
    "general": [
      { id: "g1", name: "Dr. John Mutasa (General Practice)" },
      { id: "g2", name: "Dr. Ruth Zinyama (General Practice)" }
    ]
  };
  
  // Sample appointment slots - would be dynamically generated in a real system
  const getAvailableSlots = () => {
    return [
      { time: "08:00 AM", available: true },
      { time: "09:00 AM", available: true },
      { time: "10:00 AM", available: false },
      { time: "11:00 AM", available: true },
      { time: "12:00 PM", available: false },
      { time: "01:00 PM", available: false },
      { time: "02:00 PM", available: true },
      { time: "03:00 PM", available: true },
      { time: "04:00 PM", available: true }
    ];
  };
  
  // Fetch hospitals from database
  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('hospitals')
          .select('id, name, address');
          
        if (error) throw error;
        setHospitals(data || []);
      } catch (error) {
        console.error("Error fetching hospitals:", error);
        toast({
          title: "Error",
          description: "Failed to load hospitals",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchHospitals();
  }, [toast]);
  
  // Convert selectedHospital string to number for database
  const getSelectedHospitalId = () => {
    return selectedHospital ? parseInt(selectedHospital) : null;
  };
  
  // Get doctor name from ID
  const getSelectedDoctorName = () => {
    if (!selectedDepartment || !selectedDoctor) return "";
    
    const doctor = doctorsByDepartment[selectedDepartment]?.find(
      doc => doc.id === selectedDoctor
    );
    
    return doctor?.name || "";
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError) throw userError;
      
      if (!userData.user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to book an appointment",
          variant: "destructive",
        });
        return;
      }
      
      // Format appointment date and time
      const appointmentDateTime = new Date(`${selectedDate}T${selectedTime.split(' ')[0]}:00${selectedTime.includes('PM') ? '+12:00' : '+00:00'}`);
      
      // Create appointment record
      const { data, error } = await supabase.from('appointments').insert({
        user_id: userData.user.id,
        hospital_id: getSelectedHospitalId(),
        doctor_name: getSelectedDoctorName(),
        specialty: departments.find(dept => dept.id === selectedDepartment)?.name || "",
        appointment_date: appointmentDateTime.toISOString(),
        status: 'scheduled'
      }).select();
      
      if (error) throw error;
      
      // Send appointment notification
      await supabase.functions.invoke('appointment-notifications', {
        body: {
          action: 'create_appointment',
          appointmentId: data[0].id,
          userId: userData.user.id,
          message: "Your appointment has been scheduled."
        }
      });
      
      // Generate confirmation code
      setConfirmationCode(`APT-${Math.floor(100000 + Math.random() * 900000)}`);
      
      // Show success message
      toast({
        title: "Appointment Scheduled",
        description: "Your appointment has been successfully scheduled.",
      });
      
      // Move to confirmation step
      setStep(4);
      
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling your appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
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
        <h1 className="text-2xl font-bold">Schedule an Appointment</h1>
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-muted -translate-y-1/2 z-0"></div>
        
        {[1, 2, 3, 4].map((stepNumber) => (
          <div key={stepNumber} className="flex flex-col items-center relative z-10">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2
                ${step >= stepNumber ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
              {stepNumber}
            </div>
            <span className={`text-sm ${step >= stepNumber ? 'text-primary' : 'text-muted-foreground'}`}>
              {stepNumber === 1 && "Select Location"}
              {stepNumber === 2 && "Choose Doctor"}
              {stepNumber === 3 && "Pick Time"}
              {stepNumber === 4 && "Confirm"}
            </span>
          </div>
        ))}
      </div>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          {/* Step 1: Select Hospital and Department */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Select Hospital</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Hospital</label>
                    <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a hospital" />
                      </SelectTrigger>
                      <SelectContent>
                        {hospitals.map(hospital => (
                          <SelectItem key={hospital.id} value={hospital.id.toString()}>
                            {hospital.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Department</label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map(department => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  onClick={() => setStep(2)} 
                  disabled={!selectedHospital || !selectedDepartment}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 2: Select Doctor */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Select Doctor</h2>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {doctorsByDepartment[selectedDepartment]?.map(doctor => (
                      <div 
                        key={doctor.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors
                          ${selectedDoctor === doctor.id ? 'border-primary bg-primary/5' : 'hover:border-muted-foreground'}`}
                        onClick={() => setSelectedDoctor(doctor.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-medium">{doctor.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {departments.find(dept => dept.id === selectedDepartment)?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Reason for Visit</label>
                    <Input
                      placeholder="Briefly describe your reason for visiting"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!selectedDoctor}
                >
                  Continue
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 3: Select Date and Time */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <Input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium mb-2">Available Time Slots</label>
                      <div className="grid grid-cols-3 gap-3">
                        {getAvailableSlots().map((slot, index) => (
                          <Button
                            key={index}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            className={slot.available ? "" : "opacity-50 cursor-not-allowed"}
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(4)} 
                  disabled={!selectedDate || !selectedTime}
                >
                  Review Appointment
                </Button>
              </div>
            </div>
          )}
          
          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              {confirmationCode ? (
                <div className="text-center py-6">
                  <div className="mb-4 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-semibold mb-2">Appointment Confirmed!</h2>
                  <p className="text-muted-foreground mb-4">Your appointment has been successfully scheduled.</p>
                  
                  <div className="bg-muted p-4 rounded-lg inline-block mb-6">
                    <p className="font-mono text-xl">{confirmationCode}</p>
                    <p className="text-xs text-muted-foreground">Confirmation Code</p>
                  </div>
                  
                  <div className="space-y-2 text-center max-w-md mx-auto">
                    <div className="flex justify-center items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <p>{selectedDate} at {selectedTime}</p>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <p>{getSelectedDoctorName()}</p>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <p>{hospitals.find(h => h.id.toString() === selectedHospital)?.name}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Link to="/user-dashboard">
                      <Button>Go to Dashboard</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Review Appointment Details</h2>
                    
                    <div className="bg-muted p-4 rounded-lg space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Hospital:</span>
                        <span className="font-medium">{hospitals.find(h => h.id.toString() === selectedHospital)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Department:</span>
                        <span className="font-medium">{departments.find(dept => dept.id === selectedDepartment)?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Doctor:</span>
                        <span className="font-medium">{getSelectedDoctorName()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium">{selectedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium">{selectedTime}</span>
                      </div>
                      {description && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Reason:</span>
                          <span className="font-medium">{description}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(3)}>
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={submitting}
                    >
                      {submitting ? "Processing..." : "Confirm Appointment"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentScheduling;
