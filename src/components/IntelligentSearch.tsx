
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Brain, Sparkles, Star, MapPin, Clock, ChevronRight } from "lucide-react";

// Simple NLP processing for search - in a real app, this would use more advanced NLP models
const processNaturalLanguageQuery = (query: string) => {
  // Convert query to lowercase for easier matching
  const lowercaseQuery = query.toLowerCase();
  
  // Define common medical terms and their synonyms/related terms
  const medicalTerms = {
    emergency: ['urgent', 'emergency', 'critical', 'immediate', 'life-threatening'],
    pediatric: ['children', 'kids', 'child', 'baby', 'infant', 'pediatric'],
    cardiology: ['heart', 'cardiac', 'chest pain', 'cardiovascular', 'cardiology'],
    orthopedic: ['bone', 'joint', 'fracture', 'orthopedic', 'spine', 'knee', 'hip'],
    neurology: ['brain', 'nerve', 'neurological', 'seizure', 'headache', 'migraine'],
    diagnostic: ['scan', 'mri', 'x-ray', 'ultrasound', 'imaging', 'test', 'diagnosis'],
    surgery: ['operation', 'surgery', 'surgical', 'procedure'],
    maternity: ['pregnancy', 'pregnant', 'birth', 'prenatal', 'maternity', 'obstetrics']
  };
  
  // Sample structured query templates for common medical searches
  const queryTemplates = [
    { regex: /near(by|est)/, field: 'location', action: 'find_nearest' },
    { regex: /(open now|24\/7|hours)/, field: 'hours', action: 'check_hours' },
    { regex: /wait time/, field: 'wait_time', action: 'check_wait' },
    { regex: /(appointment|book|schedule)/, field: 'booking', action: 'schedule' },
    { regex: /(insurance|covered|accept)/, field: 'insurance', action: 'check_insurance' }
  ];
  
  // Extract medical specialties
  const detectedSpecialties = Object.entries(medicalTerms)
    .filter(([_, terms]) => terms.some(term => lowercaseQuery.includes(term)))
    .map(([specialty]) => specialty);
  
  // Extract query intentions
  const detectedIntentions = queryTemplates
    .filter(template => template.regex.test(lowercaseQuery))
    .map(template => template.action);
  
  // Convert conversational query into structured query
  const structuredQuery = {
    original: query,
    specialties: detectedSpecialties,
    intentions: detectedIntentions,
    isEmergency: medicalTerms.emergency.some(term => lowercaseQuery.includes(term)),
    requiresLocation: /near(by|est)|close to|in the area/.test(lowercaseQuery)
  };
  
  return structuredQuery;
};

// Mock hospital data with services
const hospitalData = [
  {
    id: 1,
    name: "Parirenyatwa Group of Hospitals",
    services: ["emergency", "cardiology", "neurology", "surgery", "diagnostic", "orthopedic"],
    location: "central",
    isOpen24Hours: true,
    waitTime: "45min",
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1587351021759-3772687ccc74?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Harare Central Hospital",
    services: ["emergency", "pediatric", "surgery", "diagnostic"],
    location: "south",
    isOpen24Hours: true,
    waitTime: "30min",
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1516549655669-d2190a7ea12d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Avenues Clinic",
    services: ["cardiology", "orthopedic", "maternity", "diagnostic", "surgery"],
    location: "north",
    isOpen24Hours: false,
    waitTime: "15min",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "West End Hospital",
    services: ["orthopedic", "diagnostic", "surgery"],
    location: "west",
    isOpen24Hours: false,
    waitTime: "20min",
    rating: 3.9,
    image: "https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Chitungwiza Central Hospital",
    services: ["emergency", "pediatric", "maternity"],
    location: "east",
    isOpen24Hours: true,
    waitTime: "40min",
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200&auto=format&fit=crop"
  }
];

interface IntelligentSearchProps {
  onHospitalSelect?: (hospitalId: number) => void;
  className?: string;
}

const IntelligentSearch: React.FC<IntelligentSearchProps> = ({ onHospitalSelect, className }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [structuredQuery, setStructuredQuery] = useState<any>(null);
  const { toast } = useToast();

  const handleSearch = () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Process the natural language query
    const processedQuery = processNaturalLanguageQuery(query);
    setStructuredQuery(processedQuery);
    
    // In a real app, this would be an API call to a backend NLP service
    setTimeout(() => {
      // Filter hospitals based on the structured query
      let results = [...hospitalData];
      
      // Filter by specialties if any were detected
      if (processedQuery.specialties.length > 0) {
        results = results.filter(hospital => 
          processedQuery.specialties.some((specialty: string) => 
            hospital.services.includes(specialty)
          )
        );
      }
      
      // Filter by emergency services if query indicates emergency
      if (processedQuery.isEmergency) {
        results = results.filter(hospital => 
          hospital.services.includes('emergency') && hospital.isOpen24Hours
        );
      }
      
      // Sort by wait time if checking wait time
      if (processedQuery.intentions.includes('check_wait')) {
        results.sort((a, b) => {
          const aTime = parseInt(a.waitTime);
          const bTime = parseInt(b.waitTime);
          return aTime - bTime;
        });
      }
      
      setSearchResults(results);
      setIsSearching(false);
      
      // Show toast with search understanding
      const specialtiesText = processedQuery.specialties.length 
        ? `for ${processedQuery.specialties.join(', ')} services` 
        : '';
      
      const intentText = processedQuery.intentions.length 
        ? ` with focus on ${processedQuery.intentions.join(', ')}` 
        : '';
      
      toast({
        title: "AI Search Results",
        description: `Found ${results.length} hospitals ${specialtiesText}${intentText}`,
      });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={className}>
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Intelligent Hospital Search
          </CardTitle>
          <CardDescription>
            Search using natural language to find the right medical facility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="E.g. 'I need a pediatric hospital with short wait times near me'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="pl-9 modern-input"
              />
            </div>
            <Button 
              size="pill" 
              disabled={isSearching}
              onClick={handleSearch}
            >
              {isSearching ? (
                <div className="flex items-center">
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Thinking...
                </div>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
          
          {structuredQuery && (
            <div className="p-3 bg-muted rounded-md mb-4 text-sm">
              <div className="font-medium flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-primary" />
                AI understood your query as:
              </div>
              <ul className="mt-1 space-y-1 text-muted-foreground">
                {structuredQuery.specialties.length > 0 && (
                  <li>• Looking for: {structuredQuery.specialties.join(', ')} services</li>
                )}
                {structuredQuery.intentions.length > 0 && (
                  <li>• Interested in: {structuredQuery.intentions.join(', ')}</li>
                )}
                {structuredQuery.isEmergency && (
                  <li>• Emergency situation detected</li>
                )}
                {structuredQuery.requiresLocation && (
                  <li>• Location-based search</li>
                )}
              </ul>
            </div>
          )}
          
          {searchResults.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-medium">Search Results</h3>
              {searchResults.map(hospital => (
                <Card key={hospital.id} className="rounded-xl overflow-hidden hover:shadow-md transition-all">
                  <div className="flex">
                    <div className="w-1/4">
                      <img 
                        src={hospital.image} 
                        alt={hospital.name} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4 w-3/4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{hospital.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="rating" className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              {hospital.rating}
                            </Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="h-3.5 w-3.5 mr-1" /> 
                              {hospital.waitTime} wait
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            {hospital.location}
                          </p>
                        </div>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="rounded-full"
                          onClick={() => onHospitalSelect && onHospitalSelect(hospital.id)}
                        >
                          Details
                          <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          {query && searchResults.length === 0 && !isSearching && (
            <div className="text-center py-4 text-muted-foreground">
              No hospitals match your search criteria. Try different terms.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentSearch;
