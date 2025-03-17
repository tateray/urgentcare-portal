
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Phone, Navigation } from "lucide-react";

interface Facility {
  id: number;
  name: string;
  address: string;
  distance?: string;
  emergency: boolean;
  phone: string;
  wait_time?: number;
}

interface HospitalListProps {
  facilities: Facility[];
  onDirections: (facility: Facility) => void;
  onCall: (phone: string) => void;
}

const HospitalList: React.FC<HospitalListProps> = ({ 
  facilities, 
  onDirections, 
  onCall 
}) => {
  // Helper function to get the icon color based on the facility name
  const getFacilityColor = (name: string) => {
    if (name.toLowerCase().includes('hospital')) return "text-red-600";
    if (name.toLowerCase().includes('clinic')) return "text-green-600";
    if (name.toLowerCase().includes('pharmacy')) return "text-blue-600";
    if (name.toLowerCase().includes('emergency')) return "text-purple-600";
    return "text-gray-600";
  };

  return (
    <div className="space-y-4">
      {facilities.map((facility) => (
        <Card key={facility.id} className="hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`font-bold text-lg ${getFacilityColor(facility.name)}`}>
                  {facility.name}
                </h3>
                <p className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> {facility.address}
                </p>
                <p className="text-sm mt-1">{facility.distance}</p>
                <p className="text-sm mt-1 flex items-center gap-1">
                  <Phone className="h-3 w-3" /> {facility.phone}
                </p>
                {facility.wait_time !== undefined && (
                  <p className="text-sm mt-1 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Est. wait: {facility.wait_time} min
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {facility.emergency && (
                  <span className="bg-destructive/10 text-destructive text-xs px-2 py-1 rounded-full">
                    24h Emergency
                  </span>
                )}
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={() => onDirections(facility)}
                >
                  <Navigation className="h-3 w-3 mr-1" />
                  Directions
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onCall(facility.phone)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default HospitalList;
