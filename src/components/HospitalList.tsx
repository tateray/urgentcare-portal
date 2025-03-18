
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Navigation, Star, Info, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Facility {
  id: number;
  name: string;
  address: string;
  distance?: string;
  emergency: boolean;
  phone: string;
  wait_time?: number;
  specialty?: string;
  rating?: number;
  open_until?: string;
}

interface HospitalListProps {
  facilities: Facility[];
  onDirections: (facility: Facility) => void;
  onCall: (phone: string) => void;
  view?: 'compact' | 'detailed';
}

const HospitalList: React.FC<HospitalListProps> = ({ 
  facilities, 
  onDirections, 
  onCall,
  view = 'detailed'
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
      icon: <Info className="h-5 w-5 text-gray-600" />
    };
  };

  return (
    <div className="space-y-4">
      {facilities.map((facility) => {
        const facilityMeta = getFacilityMeta(facility.name, facility.specialty);
        
        return (
          <Card 
            key={facility.id} 
            className={cn(
              "hover:shadow-md transition-all border-l-4", 
              facilityMeta.borderColor
            )}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {view === 'detailed' && (
                  <div className={cn("rounded-full p-2 flex-shrink-0", facilityMeta.color)}>
                    {facilityMeta.icon}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      {facility.specialty && (
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
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
                          <p className="text-sm flex items-center gap-1">
                            <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                            <span className="font-medium">{facility.rating}</span>
                          </p>
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
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                          24h Emergency
                        </span>
                      )}
                      
                      {facility.distance && (
                        <span className="text-sm font-medium text-blue-600">
                          {facility.distance}
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
                        size="sm" 
                        variant="outline"
                        className="h-8 px-3 rounded-full" 
                        onClick={() => onCall(facility.phone)}
                      >
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        Call
                      </Button>
                      
                      <Button 
                        size="sm"
                        className="h-8 px-3 rounded-full bg-blue-600 hover:bg-blue-700"
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
      })}
    </div>
  );
};

export default HospitalList;
