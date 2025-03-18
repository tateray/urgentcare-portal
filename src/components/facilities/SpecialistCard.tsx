
import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star } from "lucide-react";
import { Facility } from './types';

interface SpecialistCardProps {
  facility: Facility;
  onClick: () => void;
}

const SpecialistCard: React.FC<SpecialistCardProps> = ({ 
  facility, 
  onClick 
}) => {
  return (
    <Card 
      className="specialist-card cursor-pointer"
      onClick={onClick}
    >
      <div className="flex overflow-hidden">
        <div className="w-1/3">
          <img 
            src={facility.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop"}
            alt={facility.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="w-2/3 p-4">
          <div className="flex flex-col h-full justify-between">
            <div>
              {facility.specialty && (
                <p className="text-xs text-primary uppercase tracking-wide mb-1">
                  {facility.specialty}
                </p>
              )}
              
              <h3 className="font-bold text-lg">
                Dr. {facility.name}
              </h3>
              
              <div className="flex items-center gap-1 mt-1">
                <Badge variant="rating" className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Rating {facility.rating || "5.0"}
                </Badge>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" /> 
                {facility.address}
              </p>
              
              {facility.wait_time !== undefined && (
                <p className="text-sm flex items-center gap-1 mt-1">
                  <Clock className="h-3.5 w-3.5" /> 
                  {facility.wait_time} min wait
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SpecialistCard;
