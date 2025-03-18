
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Phone, Navigation, Star } from "lucide-react";
import { Facility } from './types';

interface CompactFacilityCardProps {
  facility: Facility;
  onDirections: (facility: Facility) => void;
  onCall: (phone: string) => void;
}

const CompactFacilityCard: React.FC<CompactFacilityCardProps> = ({ 
  facility, 
  onDirections, 
  onCall 
}) => {
  return (
    <Card className="rounded-2xl hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
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
                  {facility.wait_time !== undefined && (
                    <p className="text-sm flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> 
                      {facility.wait_time} min wait
                    </p>
                  )}
                  
                  {facility.rating && (
                    <Badge variant="rating" className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {facility.rating}
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                {facility.emergency && (
                  <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
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

export default CompactFacilityCard;
