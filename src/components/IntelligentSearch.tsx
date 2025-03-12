
import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, Brain, Sparkles } from "lucide-react";

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
    waitTime: "45min"
  },
  {
    id: 2,
    name: "Harare Central Hospital",
    services: ["emergency", "pediatric", "surgery", "diagnostic"],
    location: "south",
    isOpen24Hours: true,
    waitTime: "30min"
  },
  {
    id: 3,
    name: "Avenues Clinic",
    services: ["cardiology", "orthopedic", "maternity", "diagnostic", "surgery"],
    location: "north",
    isOpen24Hours: false,
    waitTime: "15min"
  },
  {
    id: 4,
    name: "West End Hospital",
    services: ["orthopedic", "diagnostic", "surgery"],
    location: "west",
    isOpen24Hours: false,
    waitTime: "20min"
  },
  {
    id: 5,
    name: "Chitungwiza Central Hospital",
    services: ["emergency", "pediatric", "maternity"],
    location: "east",
    isOpen24Hours: true,
    waitTime: "40min"
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            Intelligent Hospital Search
          </CardTitle>
          <CardDescription>
            Search using natural language to find the right medical facility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="E.g. 'I need a pediatric hospital with short wait times near me'"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={isSearching}>
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
                <Sparkles className="h-4 w-4 mr-1 text-purple-500" />
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
                <Card key={hospital.id} className="hover:shadow-md transition-all">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{hospital.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Services: {hospital.services.join(', ')}
                        </p>
                        <p className="text-sm">Wait time: {hospital.waitTime}</p>
                      </div>
                      <Button 
                        size="sm" 
                        onClick={() => onHospitalSelect && onHospitalSelect(hospital.id)}
                      >
                        Select
                      </Button>
                    </div>
                  </CardContent>
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
