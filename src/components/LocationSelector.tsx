
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface City {
  id: number;
  name: string;
  state?: string;
  country?: string;
  icon?: string;
}

interface LocationSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectLocation: (city: City) => void;
  currentLocation?: City;
}

// Default city list - in a real app, this would come from an API
const defaultCities: City[] = [
  { id: 1, name: "Harare", state: "Harare Province", country: "Zimbabwe", icon: "harare" },
  { id: 2, name: "Bulawayo", state: "Bulawayo Province", country: "Zimbabwe", icon: "bulawayo" },
  { id: 3, name: "Chitungwiza", state: "Harare Province", country: "Zimbabwe", icon: "chitungwiza" },
  { id: 4, name: "Mutare", state: "Manicaland", country: "Zimbabwe", icon: "mutare" },
  { id: 5, name: "Gweru", state: "Midlands", country: "Zimbabwe", icon: "gweru" },
  { id: 6, name: "Epworth", state: "Harare Province", country: "Zimbabwe", icon: "epworth" },
  { id: 7, name: "Kwekwe", state: "Midlands", country: "Zimbabwe", icon: "kwekwe" },
  { id: 8, name: "Kadoma", state: "Mashonaland West", country: "Zimbabwe", icon: "kadoma" },
  { id: 9, name: "Masvingo", state: "Masvingo Province", country: "Zimbabwe", icon: "masvingo" },
];

const LocationSelector: React.FC<LocationSelectorProps> = ({
  open,
  onClose,
  onSelectLocation,
  currentLocation
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<City[]>(defaultCities);
  const { toast } = useToast();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setCities(defaultCities);
      return;
    }
    
    const filtered = defaultCities.filter(city => 
      city.name.toLowerCase().includes(query.toLowerCase()) ||
      (city.state && city.state.toLowerCase().includes(query.toLowerCase()))
    );
    
    setCities(filtered);
  };

  const handleSelectCity = (city: City) => {
    onSelectLocation(city);
    toast({
      title: "Location Updated",
      description: `Your location is now set to ${city.name}`,
    });
    onClose();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setCities(defaultCities);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Select City</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-center text-sm text-muted-foreground mb-6">
            In order to serve you better, please select your location
          </p>
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-9"
            />
            {searchQuery && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-1 h-7 w-7" 
                onClick={clearSearch}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {searchQuery ? (
            <ScrollArea className="max-h-72">
              {cities.length > 0 ? (
                <div className="space-y-2">
                  {cities.map((city) => (
                    <Button
                      key={city.id}
                      variant="ghost"
                      className="w-full justify-start text-left h-auto py-3"
                      onClick={() => handleSelectCity(city)}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{city.name}</div>
                          {city.state && (
                            <div className="text-xs text-muted-foreground">{city.state}</div>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  No cities found matching "{searchQuery}"
                </div>
              )}
            </ScrollArea>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {defaultCities.slice(0, 6).map((city) => (
                <Button
                  key={city.id}
                  variant="outline"
                  className="flex flex-col items-center justify-center h-24 px-2"
                  onClick={() => handleSelectCity(city)}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                    <img 
                      src={`/city-icons/${city.icon || 'default'}.svg`}
                      alt={city.name}
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium">{city.name}</span>
                </Button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;
