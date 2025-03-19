
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Droplet, 
  Activity, 
  User, 
  RefreshCw, 
  Weight, 
  ChevronLeft,
  ChevronRight,
  Phone,
  Plus
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PatientInfoProps {
  userId?: string;
}

interface VitalSigns {
  bloodPressure: {
    systolic: number;
    diastolic: number;
    timestamp: string;
  };
  heartRate: number;
  bloodOxygen: number;
  bloodGroup: string;
  weight: number;
  height: string;
}

const PatientInformatics: React.FC<PatientInfoProps> = ({ userId }) => {
  const [patientData, setPatientData] = useState<VitalSigns>({
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      timestamp: new Date().toISOString()
    },
    heartRate: 79,
    bloodOxygen: 99,
    bloodGroup: "A+",
    weight: 141.1,
    height: "5'6\""
  });
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWearableConnected, setIsWearableConnected] = useState(false);
  const [patientName, setPatientName] = useState("Patient");
  const [cardNumber, setCardNumber] = useState("23678456");

  // Form for manual blood pressure entry
  const form = useForm({
    defaultValues: {
      systolic: 120,
      diastolic: 80
    }
  });

  useEffect(() => {
    // Simulate fetching user data
    if (userId) {
      fetchUserData(userId);
    } else {
      // Demo data
      setTimeout(() => {
        setPatientName("Rene Wells");
      }, 500);
    }
  }, [userId]);

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        // Set patient name from profile data
        const fullName = data.email || "Patient"; // Fallback to email or "Patient"
        setPatientName(fullName);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const simulateWearableConnection = () => {
    setIsLoading(true);
    // Simulate connecting to a wearable device
    setTimeout(() => {
      setIsWearableConnected(true);
      updateVitalSigns();
      setIsLoading(false);
      toast.success("Wearable device connected successfully");
    }, 2000);
  };

  const updateVitalSigns = () => {
    // Simulate getting new data from wearable
    const newSystolic = Math.floor(Math.random() * 40) + 100; // 100-140
    const newDiastolic = Math.floor(Math.random() * 30) + 60; // 60-90
    
    const newVitals = {
      ...patientData,
      bloodPressure: {
        systolic: newSystolic,
        diastolic: newDiastolic,
        timestamp: new Date().toISOString()
      },
      heartRate: Math.floor(Math.random() * 30) + 65 // 65-95
    };
    
    setPatientData(newVitals);
    analyzeBloodPressure(newSystolic, newDiastolic);
  };

  const onManualSubmit = (values: any) => {
    const newVitals = {
      ...patientData,
      bloodPressure: {
        systolic: values.systolic,
        diastolic: values.diastolic,
        timestamp: new Date().toISOString()
      }
    };
    
    setPatientData(newVitals);
    analyzeBloodPressure(values.systolic, values.diastolic);
    toast.success("Blood pressure updated");
  };

  const analyzeBloodPressure = (systolic: number, diastolic: number) => {
    let analysis = "";
    
    // Simple blood pressure analysis logic
    if (systolic < 90 || diastolic < 60) {
      analysis = "Your blood pressure is low (hypotension). This can sometimes cause dizziness or fainting. If you're experiencing symptoms, consider consulting a healthcare provider.";
    } else if (systolic < 120 && diastolic < 80) {
      analysis = "Your blood pressure is normal. Keep maintaining a healthy lifestyle with regular exercise and a balanced diet.";
    } else if (systolic < 130 && diastolic < 80) {
      analysis = "Your blood pressure is elevated. Consider lifestyle changes like reducing sodium intake and increasing physical activity.";
    } else if (systolic < 140 || diastolic < 90) {
      analysis = "You have Stage 1 hypertension. Lifestyle changes and possibly medication may be recommended. Please consult with a healthcare provider.";
    } else {
      analysis = "You have Stage 2 hypertension. This requires attention and possibly medication. Please consult with a healthcare provider as soon as possible.";
    }
    
    setAiAnalysis(analysis);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Patient Card */}
      <Card className="mb-4 bg-sky-100 rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <ChevronLeft className="mr-2" />
              <span className="font-medium">Patients</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
              <img 
                src="/lovable-uploads/1d632281-19b3-4245-894e-b10307295d2f.png" 
                alt="Doctor"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="bg-sky-200 m-4 p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Card Number: {cardNumber}</span>
              <button className="bg-white p-1 rounded-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <h2 className="text-2xl font-bold mb-6">Patient.{patientName}</h2>

            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-3xl font-bold">{patientData.weight}</div>
                <div className="text-sm">(lb)</div>
                <div className="text-sm text-gray-600">weight</div>
              </div>

              <div className="h-16 w-16 rounded-full bg-white overflow-hidden">
                <img 
                  src="/lovable-uploads/1d632281-19b3-4245-894e-b10307295d2f.png" 
                  alt="Patient" 
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold">{patientData.height}</div>
                <div className="text-sm">(ft,in)</div>
                <div className="text-sm text-gray-600">height</div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button className="p-2 bg-white rounded-full">
                <RefreshCw size={20} />
              </button>
              <button className="px-6 py-2 bg-black text-white rounded-full">
                Call
              </button>
              <button className="p-2 bg-white rounded-full">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vital Signs Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="bg-indigo-900 text-white rounded-xl">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <Heart className="mr-2" size={20} />
                <span>Heart Rate</span>
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold mr-2">{patientData.heartRate}</span>
              <span>bpm</span>
            </div>
            <div className="mt-2">
              <Activity className="w-full h-8" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 rounded-xl">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <span>Blood group</span>
            </div>
            <div className="flex justify-center items-center h-16">
              <span className="text-4xl font-bold">{patientData.bloodGroup}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-sky-100 rounded-xl col-span-1">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <span>Oxygen</span>
            </div>
            <div className="flex justify-center items-center h-16">
              <span className="text-4xl font-bold mr-2">{patientData.bloodOxygen}</span>
              <span className="text-xl">%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-100 rounded-xl col-span-1">
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <Droplet className="mr-2" size={20} />
                <span>Blood Pressure</span>
              </div>
            </div>
            <div className="flex justify-center items-center h-16">
              <span className="text-3xl font-bold">
                {patientData.bloodPressure.systolic}/{patientData.bloodPressure.diastolic}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Blood Pressure Monitor */}
      <Card className="mb-4 rounded-xl">
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold mb-4">Blood Pressure Monitor</h3>
          
          <Tabs defaultValue="automatic" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="automatic" className="w-1/2">Automatic</TabsTrigger>
              <TabsTrigger value="manual" className="w-1/2">Manual Entry</TabsTrigger>
            </TabsList>
            
            <TabsContent value="automatic">
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Connect your wearable device to automatically track your blood pressure.
                </p>
                
                <Button 
                  onClick={simulateWearableConnection} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? "Connecting..." : isWearableConnected ? "Refresh Data" : "Connect Device"}
                </Button>
                
                {isWearableConnected && (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="text-sm mb-1">Last reading: {new Date(patientData.bloodPressure.timestamp).toLocaleTimeString()}</p>
                    <p className="text-2xl font-bold">
                      {patientData.bloodPressure.systolic}/{patientData.bloodPressure.diastolic} mmHg
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="manual">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onManualSubmit)} className="space-y-4">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="systolic"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Systolic (mmHg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="diastolic"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Diastolic (mmHg)</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" className="w-full">Save Reading</Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* AI Analysis */}
      {aiAnalysis && (
        <Card className="mb-4 rounded-xl border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Activity className="mr-2" size={18} />
              AI Health Analysis
            </h3>
            <p className="text-sm text-gray-700">{aiAnalysis}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PatientInformatics;
