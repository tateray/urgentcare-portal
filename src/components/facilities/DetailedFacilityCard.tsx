
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Navigation, Star, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Facility } from './types';

interface DetailedFacilityCardProps {
  facility: Facility;
  onDirections: (facility: Facility) => void;
  onCall: (phone: string) => void;
}

const DetailedFacilityCard: React.FC<DetailedFacilityCardProps> = ({ 
  facility, 
  onDirections, 
  onCall 
}) => {
  // Helper function to get the facility color and icon based on the type
  const getFacilityMeta = (name: string, specialty: string = '') => {
    const lowerName = name.toLowerCase();
    const lowerSpecialty = specialty.toLowerCase();
    
    if (lowerName.includes('hospital') || lowerSpecialty.includes('multi specialty')) {
      return {
        color: "text-blue-500 bg-blue-100", 
        borderColor: "border-blue-500",
        icon: <ShieldCheck className="h-5 w-5 text-blue-500" />
      };
    }
    if (lowerName.includes('clinic') || lowerSpecialty.includes('specialty')) {
      return {
        color: "text-green-500 bg-green-100", 
        borderColor: "border-green-500",
        icon: <ShieldCheck className="h-5 w-5 text-green-500" />
      };
    }
    if (lowerName.includes('pharmacy')) {
      return {
        color: "text-purple-500 bg-purple-100", 
        borderColor: "border-purple-500",
        icon: <ShieldCheck className="h-5 w-5 text-purple-500" />
      };
    }
    if (lowerName.includes('care') || lowerSpecialty.includes('care')) {
      return {
        color: "text-teal-500 bg-teal-100", 
        borderColor: "border-teal-500",
        icon: <ShieldCheck className="h-5 w-5 text-teal-500" />
      };
    }
    if (lowerName.includes('sun') || lowerName.includes('life')) {
      return {
        color: "text-orange-500 bg-orange-100", 
        borderColor: "border-orange-500",
        icon: <ShieldCheck className="h-5 w-5 text-orange-500" />
      };
    }
    // Default
    return {
      color: "text-gray-600 bg-gray-100", 
      borderColor: "border-gray-400",
      icon: <ShieldCheck className="h-5 w-5 text-gray-600" />
    };
  };

  const facilityMeta = getFacilityMeta(facility.name, facility.specialty);
  
  return (
    <Card className="rounded-2xl hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn("rounded-full p-2 flex-shrink-0", facilityMeta.color)}>
            {facilityMeta.icon}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                {facility.specialty && (
                  <p className="text-xs text-primary uppercase tracking-wide mb-1">
                    {facility.specialty}
                  </p>
                )}
                
                <h3 className="font-bold text-lg">
                  {facility.name}
                </h3>
                
                <p className="text-muted-foreground flex items-center gap-1 text-sm mt-1">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" /> 
                  {facility.address}
                </p>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                  {facility.distance && (
                    <p className="text-sm flex items-center gap-1 text-blue-600">
                      {facility.distance}
                    </p>
                  )}
                  
                  {facility.open_until && (
                    <p className="text-sm flex items-center gap-1 text-green-600">
                      Open until {facility.open_until}
                    </p>
                  )}
                  
                  {facility.rating && (
                    <Badge variant="rating" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {facility.rating}
                    </Badge>
                  )}
                  
                  {facility.wait_time !== undefined && (
                    <p className="text-sm flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> 
                      {facility.wait_time} min wait
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {facility.emergency && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                    24h Emergency
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
              <p className="text-sm flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {facility.phone}
              </p>
              
              <div className="flex gap-2">
                <Button 
                  size="pill" 
                  variant="outline"
                  onClick={() => onCall(facility.phone)}
                >
                  <Phone className="h-3.5 w-3.5 mr-1" />
                  Call
                </Button>
                
                <Button 
                  size="pill"
                  className="bg-primary"
                  onClick={() => onDirections(facility)}
                >
                  <Navigation className="h-3.5 w-3.5 mr-1" />
                  Directions
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailedFacilityCard;
