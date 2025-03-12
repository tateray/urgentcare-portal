
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Camera, Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from "lucide-react";

// Mock function to simulate AI image analysis
const analyzeMedicalImage = (image: string): Promise<{
  predictions: Array<{ condition: string; probability: number; severity: string; recommendation: string }>;
  processingTime: number;
}> => {
  return new Promise((resolve) => {
    // Simulate processing delay
    const processingTime = Math.floor(Math.random() * 1000) + 1500;
    
    setTimeout(() => {
      // In a real app, this would call a machine learning model API
      // Return mock predictions based on simulated analysis
      const mockConditions = [
        {
          condition: "Dermatitis",
          probability: 0.82,
          severity: "Mild",
          recommendation: "Consider applying an over-the-counter hydrocortisone cream. If symptoms persist, consult a dermatologist."
        },
        {
          condition: "Eczema",
          probability: 0.65,
          severity: "Moderate",
          recommendation: "Keep the area moisturized. Avoid scratching and irritants. Consult a healthcare provider for prescription treatment."
        },
        {
          condition: "Contact Allergic Reaction",
          probability: 0.48,
          severity: "Mild",
          recommendation: "Try to identify and avoid the allergen. Consider taking an antihistamine and using a mild corticosteroid cream."
        }
      ];
      
      // Randomly select 1-3 conditions from the mock list
      const numPredictions = Math.floor(Math.random() * 3) + 1;
      const selectedPredictions = [...mockConditions]
        .sort(() => 0.5 - Math.random())
        .slice(0, numPredictions)
        .sort((a, b) => b.probability - a.probability);
      
      resolve({
        predictions: selectedPredictions,
        processingTime
      });
    }, 2000);
  });
};

const SymptomImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisResults, setAnalysisResults] = useState<any | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check file type
      if (!file.type.match('image.*')) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG)",
          variant: "destructive",
        });
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          setImage(e.target.result as string);
          setAnalysisResults(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    // In a real app, this would open the device camera
    toast({
      title: "Camera feature",
      description: "In a production app, this would access your device camera",
    });
  };

  const clearImage = () => {
    setImage(null);
    setAnalysisResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    
    setIsAnalyzing(true);
    toast({
      title: "Analyzing image",
      description: "AI is processing your medical image...",
    });
    
    try {
      const results = await analyzeMedicalImage(image);
      setAnalysisResults(results);
      
      // Show toast with primary result
      if (results.predictions.length > 0) {
        const topResult = results.predictions[0];
        toast({
          title: `Analysis Complete: ${topResult.condition}`,
          description: `${topResult.severity} severity detected. See detailed results.`,
        });
      }
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'text-destructive';
      case 'moderate':
        return 'text-amber-500';
      case 'mild':
        return 'text-emerald-500';
      default:
        return 'text-primary';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
          Medical Image Analysis
        </CardTitle>
        <CardDescription>
          Upload a photo of your visible symptoms for AI analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col items-center justify-center">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            
            {!image ? (
              <div className="w-full p-8 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-4">
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Upload an image of your skin condition, rash, or other visible symptom
                  </p>
                </div>
                <div className="flex gap-4">
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button variant="outline" onClick={handleCameraCapture}>
                    <Camera className="h-4 w-4 mr-2" />
                    Take Photo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="relative w-full">
                <div className="rounded-lg overflow-hidden max-h-[300px] flex items-center justify-center">
                  <img 
                    src={image} 
                    alt="Uploaded symptom" 
                    className="max-w-full max-h-[300px] object-contain" 
                  />
                </div>
                <Button 
                  variant="destructive" 
                  size="icon"
                  className="absolute top-2 right-2" 
                  onClick={clearImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
          
          {image && !analysisResults && (
            <Button 
              className="w-full" 
              onClick={analyzeImage}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Analyzing...
                </>
              ) : (
                <>Analyze Image</>
              )}
            </Button>
          )}
          
          {analysisResults && (
            <div className="mt-4 space-y-4">
              <div className="p-3 bg-muted rounded-md">
                <h3 className="font-medium mb-2 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Analysis Complete
                </h3>
                <p className="text-sm text-muted-foreground">
                  Processing time: {analysisResults.processingTime}ms
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">AI Detected Conditions:</h3>
                <div className="space-y-3">
                  {analysisResults.predictions.map((prediction: any, index: number) => (
                    <div key={index} className="border rounded-md p-3">
                      <div className="flex justify-between">
                        <h4 className="font-medium">{prediction.condition}</h4>
                        <span className="text-sm font-medium">
                          {Math.round(prediction.probability * 100)}% confidence
                        </span>
                      </div>
                      <p className={`text-sm ${getSeverityColor(prediction.severity)}`}>
                        {prediction.severity} severity
                      </p>
                      <p className="text-sm mt-1">
                        {prediction.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-400">Important Disclaimer</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                      This analysis is for informational purposes only and is not a medical diagnosis. 
                      Always consult with a healthcare professional for proper evaluation and treatment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-xs text-muted-foreground text-center">
          Images are processed securely and not stored permanently
        </p>
      </CardFooter>
    </Card>
  );
};

export default SymptomImageAnalyzer;
