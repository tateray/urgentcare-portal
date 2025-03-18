
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Clock, ArrowLeft } from "lucide-react";

const timeSlots = [
  { time: "04:30 PM", available: true },
  { time: "05:00 PM", available: true },
  { time: "05:30 PM", available: true },
  { time: "06:00 PM", available: true }
];

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  distance?: string;
  timeToReach?: string;
}

interface DoctorAppointmentProps {
  doctor: Doctor;
  onBack: () => void;
  onBookAppointment: (doctor: Doctor, time: string) => void;
  className?: string;
}

const DoctorAppointment: React.FC<DoctorAppointmentProps> = ({
  doctor,
  onBack,
  onBookAppointment,
  className
}) => {
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
  };

  const handleBookAppointment = () => {
    if (selectedTime) {
      onBookAppointment(doctor, selectedTime);
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onBack}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold">Book an appointment</h2>
      </div>

      <Card className="rounded-2xl mb-4">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={doctor.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"}
                alt={doctor.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h3 className="font-bold text-lg">{doctor.name}</h3>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
              
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="rating" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {doctor.rating}
                </Badge>
                
                {doctor.distance && (
                  <span className="text-xs text-muted-foreground">
                    {doctor.distance} • {doctor.timeToReach}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl overflow-hidden">
        <div className="bg-primary text-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Today Availability</h3>
            <span className="text-sm">4 Slots</span>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            {timeSlots.map((slot, index) => (
              <button
                key={index}
                className={`
                  appointment-slot
                  ${selectedTime === slot.time ? 'appointment-slot-active' : ''}
                  ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={() => slot.available && handleSelectTime(slot.time)}
                disabled={!slot.available}
              >
                <Clock className="h-3.5 w-3.5 mr-1" />
                {slot.time}
              </button>
            ))}
          </div>
          
          <Button 
            variant="appointment"
            className="mt-4"
            disabled={!selectedTime}
            onClick={handleBookAppointment}
          >
            Book Appointment
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorAppointment;
