
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { AlertCircle, ArrowRight, Check, HeartPulse } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HealthRiskAssessorProps {
  onComplete?: (riskLevel: string, recommendation: string) => void;
}

const HealthRiskAssessor: React.FC<HealthRiskAssessorProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [age, setAge] = useState<number>(30);
  const [gender, setGender] = useState<string>('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [symptomInput, setSymptomInput] = useState<string>('');
  const [painLevel, setPainLevel] = useState<number[]>([3]);
  const [chronicConditions, setChronicConditions] = useState<string[]>([]);
  const [results, setResults] = useState<{ risk: string; message: string } | null>(null);
  const { toast } = useToast();

  const symptomsList = [
    'Fever', 'Cough', 'Shortness of breath', 'Fatigue', 'Headache',
    'Nausea', 'Vomiting', 'Diarrhea', 'Chest pain', 'Abdominal pain',
    'Dizziness', 'Rash', 'Joint pain', 'Back pain', 'Sore throat'
  ];

  const chronicConditionsList = [
    'Diabetes', 'Hypertension', 'Asthma', 'Heart disease', 'Cancer',
    'COPD', 'Kidney disease', 'Liver disease', 'Autoimmune disorder', 'None'
  ];

  const addSymptom = () => {
    if (symptomInput && !symptoms.includes(symptomInput)) {
      setSymptoms([...symptoms, symptomInput]);
      setSymptomInput('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const toggleChronicCondition = (condition: string) => {
    if (condition === 'None') {
      setChronicConditions(['None']);
      return;
    }
    
    if (chronicConditions.includes('None')) {
      setChronicConditions([condition]);
      return;
    }
    
    if (chronicConditions.includes(condition)) {
      setChronicConditions(chronicConditions.filter(c => c !== condition));
    } else {
      setChronicConditions([...chronicConditions, condition]);
    }
  };

  const assessRisk = () => {
    // This is a simplified risk assessment algorithm
    // In a real application, this would be much more sophisticated
    
    let riskScore = 0;
    
    // Age factor
    if (age > 65) riskScore += 3;
    else if (age > 50) riskScore += 2;
    else if (age > 35) riskScore += 1;
    
    // Pain level factor
    riskScore += Math.floor(painLevel[0] / 2);
    
    // Symptom factors
    const highRiskSymptoms = ['Chest pain', 'Shortness of breath', 'Dizziness'];
    const mediumRiskSymptoms = ['Fever', 'Vomiting', 'Abdominal pain'];
    
    symptoms.forEach(symptom => {
      if (highRiskSymptoms.includes(symptom)) riskScore += 3;
      else if (mediumRiskSymptoms.includes(symptom)) riskScore += 2;
      else riskScore += 1;
    });
    
    // Chronic conditions factor
    if (!chronicConditions.includes('None')) {
      riskScore += chronicConditions.length * 2;
    }
    
    // Determine risk level
    let risk: string;
    let message: string;
    
    if (riskScore >= 10) {
      risk = 'high';
      message = 'Your symptoms suggest you might need urgent medical attention. Please consider visiting an emergency room or calling 999.';
    } else if (riskScore >= 5) {
      risk = 'medium';
      message = 'Your symptoms suggest you should consult with a healthcare provider soon. Consider scheduling an appointment in the next few days.';
    } else {
      risk = 'low';
      message = 'Your symptoms suggest low risk. Monitor your condition and consult a healthcare provider if symptoms worsen.';
    }
    
    setResults({ risk, message });
    
    if (onComplete) {
      onComplete(risk, message);
    }
    
    toast({
      title: `Risk Assessment: ${risk.charAt(0).toUpperCase() + risk.slice(1)}`,
      description: message,
      variant: risk === 'high' ? 'destructive' : (risk === 'medium' ? 'default' : 'default'),
    });
  };

  const nextStep = () => {
    if (step === 1 && !age) {
      toast({
        title: "Missing Information",
        description: "Please enter your age",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 2 && !gender) {
      toast({
        title: "Missing Information",
        description: "Please select your gender",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 3 && symptoms.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please add at least one symptom",
        variant: "destructive",
      });
      return;
    }
    
    if (step === 5) {
      assessRisk();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                min={1}
                max={120}
              />
            </div>
            <p className="text-sm text-muted-foreground">Your age helps us provide more accurate health recommendations.</p>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <Label>Gender</Label>
            <RadioGroup value={gender} onValueChange={setGender}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
              </div>
            </RadioGroup>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <Label>What symptoms are you experiencing?</Label>
            <div className="flex space-x-2">
              <Input
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                placeholder="Enter symptom"
                list="symptoms-list"
              />
              <datalist id="symptoms-list">
                {symptomsList.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
              <Button type="button" onClick={addSymptom}>Add</Button>
            </div>
            {symptoms.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {symptoms.map((symptom) => (
                  <div 
                    key={symptom} 
                    className="bg-muted px-3 py-1 rounded-full flex items-center"
                  >
                    <span className="mr-1">{symptom}</span>
                    <button 
                      type="button" 
                      onClick={() => removeSymptom(symptom)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <Label>Rate your pain level (0-10)</Label>
            <Slider
              value={painLevel}
              max={10}
              step={1}
              onValueChange={setPainLevel}
              className="py-4"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>No Pain (0)</span>
              <span>Moderate (5)</span>
              <span>Severe (10)</span>
            </div>
            <div className="pt-4">
              <Label className="mb-2 block">Do you have any chronic conditions?</Label>
              <div className="grid grid-cols-2 gap-2">
                {chronicConditionsList.map((condition) => (
                  <div 
                    key={condition} 
                    className={`p-2 border rounded-md cursor-pointer ${
                      chronicConditions.includes(condition) ? 'bg-primary/10 border-primary' : ''
                    }`}
                    onClick={() => toggleChronicCondition(condition)}
                  >
                    {condition}
                    {chronicConditions.includes(condition) && (
                      <Check className="h-4 w-4 inline ml-2 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <div className="p-4 border rounded-md">
              <h3 className="font-medium text-lg">Summary</h3>
              <div className="grid grid-cols-2 gap-2 mt-2">
                <div className="text-sm">Age:</div>
                <div className="text-sm font-medium">{age}</div>
                
                <div className="text-sm">Gender:</div>
                <div className="text-sm font-medium">{gender}</div>
                
                <div className="text-sm">Symptoms:</div>
                <div className="text-sm font-medium">{symptoms.join(', ')}</div>
                
                <div className="text-sm">Pain Level:</div>
                <div className="text-sm font-medium">{painLevel[0]}/10</div>
                
                <div className="text-sm">Chronic Conditions:</div>
                <div className="text-sm font-medium">
                  {chronicConditions.length > 0 ? chronicConditions.join(', ') : 'None reported'}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Please review the information above and click "Get Assessment" to receive your health risk assessment.</p>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            {results && (
              <div className={`p-4 rounded-md ${
                results.risk === 'high' ? 'bg-destructive/15 text-destructive' :
                results.risk === 'medium' ? 'bg-amber-500/15 text-amber-600' :
                'bg-green-500/15 text-green-600'
              }`}>
                <div className="flex items-center mb-2">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <h3 className="font-medium">
                    {results.risk === 'high' ? 'High Risk' :
                    results.risk === 'medium' ? 'Medium Risk' :
                    'Low Risk'}
                  </h3>
                </div>
                <p>{results.message}</p>
              </div>
            )}
            
            <div className="border rounded-md p-4">
              <h3 className="font-medium mb-2">Recommended Actions</h3>
              <ul className="space-y-2 text-sm">
                {results?.risk === 'high' && (
                  <>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Visit your nearest emergency room or urgent care facility</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Call emergency services if symptoms worsen</span>
                    </li>
                  </>
                )}
                
                {results?.risk === 'medium' && (
                  <>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Schedule a doctor's appointment within the next few days</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Monitor your symptoms closely and seek urgent care if they worsen</span>
                    </li>
                  </>
                )}
                
                {results?.risk === 'low' && (
                  <>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Monitor your symptoms over the next few days</span>
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-4 w-4 mr-2 mt-0.5" />
                      <span>Practice self-care such as rest and hydration</span>
                    </li>
                  </>
                )}
                
                <li className="flex items-start">
                  <ArrowRight className="h-4 w-4 mr-2 mt-0.5" />
                  <span>Use the "Hospital Locator" feature to find nearby medical facilities</span>
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <HeartPulse className="h-5 w-5 mr-2 text-destructive" />
          Health Risk Assessment
        </CardTitle>
        <CardDescription>
          Answer a few questions to assess your health risk and get personalized recommendations
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {renderStepContent()}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        {step > 1 && step < 6 && (
          <Button type="button" variant="outline" onClick={prevStep}>
            Back
          </Button>
        )}
        
        {step === 6 ? (
          <Button 
            type="button" 
            onClick={() => setStep(1)}
            className="ml-auto"
          >
            Start New Assessment
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={nextStep}
            className={step > 1 ? '' : 'ml-auto'}
          >
            {step === 5 ? 'Get Assessment' : 'Next'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default HealthRiskAssessor;
