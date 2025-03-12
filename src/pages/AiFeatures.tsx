
import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Brain, Activity, Calculator, Search, Image, Heart } from "lucide-react";
import HealthRiskAssessor from "@/components/HealthRiskAssessor";
import PredictiveAnalytics from "@/components/PredictiveAnalytics";
import IntelligentSearch from "@/components/IntelligentSearch";
import SymptomImageAnalyzer from "@/components/SymptomImageAnalyzer";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AiFeatures = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRiskAssessmentComplete = (riskLevel: string, recommendation: string) => {
    toast({
      title: `Health Risk: ${riskLevel.toUpperCase()}`,
      description: "Assessment completed successfully",
    });
    
    // In a real app, this would save the assessment to the user's profile
    console.log("Risk assessment completed:", { riskLevel, recommendation });
  };

  const handleHospitalSelect = (hospitalId: number) => {
    toast({
      title: "Hospital Selected",
      description: `Navigating to hospital details...`,
    });
    
    // In a real app, this would navigate to the hospital details page
    navigate(`/hospital-locator?id=${hospitalId}`);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">AI Powered Features</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2 text-purple-500" />
            AI Healthcare Tools
          </CardTitle>
          <CardDescription>
            Advanced artificial intelligence features to improve your healthcare experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Our AI-powered features help you make better health decisions, provide instant medical guidance,
            and connect you with the right healthcare services at the right time.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <Activity className="h-8 w-8 text-blue-500 mb-3" />
                <h3 className="text-lg font-medium mb-1">Intelligent Chat</h3>
                <p className="text-sm text-muted-foreground">
                  Chat with our AI medical assistant for instant health guidance
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => navigate("/chat")}
                >
                  Try It
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <Calculator className="h-8 w-8 text-green-500 mb-3" />
                <h3 className="text-lg font-medium mb-1">Hospital Finder</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered hospital recommendations based on your needs
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => navigate("/hospital-locator")}
                >
                  Find Hospitals
                </Button>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-6">
                <Brain className="h-8 w-8 text-purple-500 mb-3" />
                <h3 className="text-lg font-medium mb-1">Health Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Get insights and predictions about your health conditions
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4 w-full"
                  onClick={() => {
                    const riskElement = document.getElementById('health-risk-section');
                    if (riskElement) {
                      riskElement.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                >
                  Analyze Health
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="search" className="mb-6">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="search">
            <Search className="h-4 w-4 mr-2" />
            Intelligent Search
          </TabsTrigger>
          <TabsTrigger value="image">
            <Image className="h-4 w-4 mr-2" />
            Image Analysis
          </TabsTrigger>
          <TabsTrigger value="recommendations">
            <Heart className="h-4 w-4 mr-2" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <Activity className="h-4 w-4 mr-2" />
            Predictive Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search">
          <IntelligentSearch onHospitalSelect={handleHospitalSelect} />
        </TabsContent>
        
        <TabsContent value="image">
          <SymptomImageAnalyzer />
        </TabsContent>
        
        <TabsContent value="recommendations">
          <PersonalizedRecommendations onHospitalSelect={handleHospitalSelect} />
        </TabsContent>
        
        <TabsContent value="analytics">
          <PredictiveAnalytics />
        </TabsContent>
      </Tabs>
      
      <div id="health-risk-section" className="mb-6">
        <HealthRiskAssessor onComplete={handleRiskAssessmentComplete} />
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Note: These AI features are for demonstration purposes. Always consult a healthcare professional for medical advice.
        </p>
      </div>
    </div>
  );
};

export default AiFeatures;
