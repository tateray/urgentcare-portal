
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Heart, Star, Clock, MapPin, Stethoscope, ArrowUpRight } from "lucide-react";

// Mock user profile data - in a real app, this would come from a database
const mockUserProfile = {
  medicalHistory: ['asthma', 'seasonal allergies'],
  recentSearches: ['cardiology', 'covid testing'],
  age: 35,
  location: { latitude: -17.82, longitude: 31.05 }, // Harare coordinates
  preferredHospitals: [2, 5], // IDs from hospital data
  previousAppointments: [
    { serviceType: 'general checkup', hospitalId: 3, rating: 4 },
    { serviceType: 'allergy test', hospitalId: 2, rating: 5 }
  ]
};

// Mock hospital data
const hospitals = [
  {
    id: 1,
    name: "Parirenyatwa Group of Hospitals",
    specialty: ["Cardiology", "Neurology", "Emergency"],
    distance: 3.2,
    rating: 4.1,
    waitTime: 45,
    image: "https://images.unsplash.com/photo-1587351021759-3772687ccc74?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 2,
    name: "Harare Central Hospital",
    specialty: ["Pediatrics", "Allergies", "Pulmonology"],
    distance: 4.8,
    rating: 4.3,
    waitTime: 30,
    image: "https://images.unsplash.com/photo-1516549655669-d2190a7ea12d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 3,
    name: "Avenues Clinic",
    specialty: ["Cardiology", "Orthopedics", "General Medicine"],
    distance: 2.5,
    rating: 4.7,
    waitTime: 20,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 4,
    name: "West End Hospital",
    specialty: ["Orthopedics", "Physical Therapy", "Sports Medicine"],
    distance: 6.1,
    rating: 3.9,
    waitTime: 15,
    image: "https://images.unsplash.com/photo-1519494140681-8b17d830a3e9?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: 5,
    name: "Chitungwiza Central Hospital",
    specialty: ["Allergy & Immunology", "Respiratory", "Emergency"],
    distance: 18.3,
    rating: 4.0,
    waitTime: 35,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=200&auto=format&fit=crop"
  }
];

// Mock function to generate personalized recommendations based on user profile
const generateRecommendations = (userProfile: typeof mockUserProfile) => {
  // In a real app, this would use ML algorithms to analyze user data
  const recommendations = [];
  
  // Recommend based on medical history (asthma, allergies)
  const respiratorySpecialists = hospitals.filter(h => 
    h.specialty.some(s => 
      ['Pulmonology', 'Allergy & Immunology', 'Respiratory'].includes(s)
    )
  );
  
  if (respiratorySpecialists.length > 0) {
    recommendations.push({
      type: 'medical_history',
      title: 'Based on your asthma history',
      hospitals: respiratorySpecialists.slice(0, 2),
      reason: 'Specialists in respiratory conditions'
    });
  }
  
  // Recommend based on recent searches
  const searchBasedHospitals = hospitals.filter(h => 
    h.specialty.some(s => 
      s.toLowerCase().includes('cardiology')
    )
  );
  
  if (searchBasedHospitals.length > 0) {
    recommendations.push({
      type: 'recent_searches',
      title: 'Based on your recent searches',
      hospitals: searchBasedHospitals.slice(0, 2),
      reason: 'Top-rated cardiology services'
    });
  }
  
  // Recommend based on location (closest hospitals)
  const nearbyHospitals = [...hospitals]
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 2);
  
  recommendations.push({
    type: 'location',
    title: 'Closest to your location',
    hospitals: nearbyHospitals,
    reason: 'Shortest travel distance'
  });
  
  // Recommend based on previous appointments and ratings
  if (userProfile.previousAppointments.length > 0) {
    const highlyRated = hospitals.filter(h => 
      userProfile.previousAppointments.some(
        appt => appt.hospitalId === h.id && appt.rating >= 4
      )
    );
    
    if (highlyRated.length > 0) {
      recommendations.push({
        type: 'previous_experience',
        title: 'Places you rated highly',
        hospitals: highlyRated.slice(0, 2),
        reason: 'Based on your positive experiences'
      });
    }
  }
  
  // Recommend shortest wait times
  const shortWaitHospitals = [...hospitals]
    .sort((a, b) => a.waitTime - b.waitTime)
    .slice(0, 2);
  
  recommendations.push({
    type: 'wait_time',
    title: 'Shortest wait times',
    hospitals: shortWaitHospitals,
    reason: 'Get treated faster'
  });
  
  return recommendations;
};

interface PersonalizedRecommendationsProps {
  onHospitalSelect?: (hospitalId: number) => void;
  className?: string;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({ 
  onHospitalSelect,
  className 
}) => {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate an API call to get personalized recommendations
    const fetchRecommendations = async () => {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      try {
        // In a real app, this would be an API call to a machine learning service
        const generatedRecommendations = generateRecommendations(mockUserProfile);
        setRecommendations(generatedRecommendations);
      } catch (error) {
        toast({
          title: "Failed to load recommendations",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [toast]);

  const handleSelectHospital = (hospitalId: number) => {
    if (onHospitalSelect) {
      onHospitalSelect(hospitalId);
    } else {
      toast({
        title: "Hospital Selected",
        description: `You've selected hospital ID: ${hospitalId}`,
      });
    }
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="h-5 w-5 mr-2 text-primary" />
            Personalized Recommendations
          </CardTitle>
          <CardDescription>
            Finding the best healthcare options for your needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mb-3"></div>
              <p className="text-muted-foreground">Analyzing your health profile...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Heart className="h-5 w-5 mr-2 text-primary" />
          Personalized Recommendations
        </CardTitle>
        <CardDescription>
          AI-powered hospital suggestions based on your profile and needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {recommendations.map((recommendationGroup, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-lg font-medium mb-3">{recommendationGroup.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendationGroup.hospitals.map((hospital: any) => (
                  <Card key={hospital.id} className="overflow-hidden rounded-2xl hover:shadow-md transition-all">
                    <div className="aspect-video w-full overflow-hidden bg-muted">
                      <img
                        src={hospital.image}
                        alt={hospital.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold">{hospital.name}</h4>
                      
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Badge variant="rating" className="flex items-center gap-1 mr-2">
                          <Star className="h-3 w-3" />
                          {hospital.rating}
                        </Badge>
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        <span>{hospital.distance} km</span>
                        <span className="mx-2">•</span>
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        <span>{hospital.waitTime} min</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {hospital.specialty.map((spec: string, i: number) => (
                          <span 
                            key={i}
                            className="specialty-badge"
                          >
                            <Stethoscope className="h-3 w-3 mr-1" />
                            {spec}
                          </span>
                        ))}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-3">
                        {recommendationGroup.reason}
                      </p>
                      
                      <Button 
                        size="sm"
                        className="w-full mt-3 rounded-xl"
                        onClick={() => handleSelectHospital(hospital.id)}
                      >
                        View Hospital
                        <ArrowUpRight className="h-3.5 w-3.5 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalizedRecommendations;
