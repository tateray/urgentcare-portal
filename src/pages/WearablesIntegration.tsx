
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Heart, Footprints, Thermometer, Watch, Zap, Moon, BarChart3, Smartphone, ShieldAlert, Check } from "lucide-react";

interface HealthData {
  steps: number;
  heartRate: number;
  sleepHours: number;
  caloriesBurned: number;
  temperature: number;
  bloodOxygen: number;
}

interface DeviceInfo {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  lastSync: string;
}

interface AIInsight {
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  icon: React.ReactNode;
}

const WearablesIntegration = () => {
  const { toast } = useToast();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingDevice, setConnectingDevice] = useState(false);

  useEffect(() => {
    // Simulate loading devices
    setTimeout(() => {
      setDevices([
        {
          id: 'dev-001',
          name: 'Fitbit Sense',
          type: 'Smartwatch',
          connected: false,
          lastSync: '-'
        },
        {
          id: 'dev-002',
          name: 'Apple Watch',
          type: 'Smartwatch',
          connected: false,
          lastSync: '-'
        },
        {
          id: 'dev-003',
          name: 'Samsung Galaxy Watch',
          type: 'Smartwatch',
          connected: false,
          lastSync: '-'
        },
        {
          id: 'dev-004',
          name: 'Google Pixel Watch',
          type: 'Smartwatch',
          connected: false,
          lastSync: '-'
        },
        {
          id: 'dev-005',
          name: 'iPhone Health',
          type: 'Smartphone',
          connected: false,
          lastSync: '-'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Connect to a device
  const connectDevice = (deviceId: string) => {
    setConnectingDevice(true);
    
    // Simulate connection delay
    setTimeout(() => {
      setDevices(prevDevices => 
        prevDevices.map(device => 
          device.id === deviceId 
            ? { ...device, connected: true, lastSync: new Date().toLocaleString() } 
            : device
        )
      );
      
      toast({
        title: "Device Connected",
        description: "Your device has been successfully connected.",
      });
      
      // Generate sample health data
      setHealthData({
        steps: Math.floor(Math.random() * 5000) + 3000,
        heartRate: Math.floor(Math.random() * 30) + 65,
        sleepHours: Math.floor(Math.random() * 3) + 6,
        caloriesBurned: Math.floor(Math.random() * 300) + 1200,
        temperature: Math.floor(Math.random() * 1) + 36,
        bloodOxygen: Math.floor(Math.random() * 3) + 95
      });
      
      setConnectingDevice(false);
      generateAIInsights();
    }, 2000);
  };

  // Disconnect from a device
  const disconnectDevice = (deviceId: string) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.id === deviceId 
          ? { ...device, connected: false, lastSync: '-' } 
          : device
      )
    );
    
    toast({
      title: "Device Disconnected",
      description: "Your device has been disconnected.",
    });
    
    // If no devices are connected, clear health data
    if (!devices.some(device => device.connected && device.id !== deviceId)) {
      setHealthData(null);
      setInsights([]);
    }
  };

  // Generate AI insights based on health data
  const generateAIInsights = async () => {
    // In a real app, this would call the AI model through an Edge Function
    setTimeout(() => {
      const newInsights: AIInsight[] = [];
      
      // Heart rate insights
      const heartRate = Math.floor(Math.random() * 30) + 65;
      if (heartRate > 85) {
        newInsights.push({
          type: 'Heart Rate',
          message: `Your heart rate (${heartRate} bpm) is slightly elevated. Consider taking a short break to relax.`,
          severity: 'warning',
          icon: <Heart className="h-5 w-5 text-amber-500" />
        });
      } else {
        newInsights.push({
          type: 'Heart Rate',
          message: `Your heart rate (${heartRate} bpm) is within a healthy range. Great job!`,
          severity: 'info',
          icon: <Heart className="h-5 w-5 text-green-500" />
        });
      }
      
      // Steps insights
      const steps = Math.floor(Math.random() * 5000) + 3000;
      if (steps < 5000) {
        newInsights.push({
          type: 'Steps',
          message: `You've taken ${steps} steps today. Try to reach 10,000 steps for optimal health benefits.`,
          severity: 'info',
          icon: <Footprints className="h-5 w-5 text-blue-500" />
        });
      } else {
        newInsights.push({
          type: 'Steps',
          message: `Great job! You've already taken ${steps} steps today. Keep up the good work!`,
          severity: 'info',
          icon: <Footprints className="h-5 w-5 text-green-500" />
        });
      }
      
      // Sleep insights
      const sleepHours = Math.floor(Math.random() * 3) + 6;
      if (sleepHours < 7) {
        newInsights.push({
          type: 'Sleep',
          message: `You slept ${sleepHours} hours last night. Most adults need 7-9 hours for optimal health.`,
          severity: 'warning',
          icon: <Moon className="h-5 w-5 text-amber-500" />
        });
      } else {
        newInsights.push({
          type: 'Sleep',
          message: `You slept ${sleepHours} hours last night, which is within the recommended range. Good job!`,
          severity: 'info',
          icon: <Moon className="h-5 w-5 text-green-500" />
        });
      }
      
      // Add a critical insight occasionally for demonstration
      if (Math.random() > 0.7) {
        newInsights.push({
          type: 'Blood Oxygen',
          message: `Your blood oxygen level is 92%. This is lower than the normal range (95-100%). Please consult a healthcare professional if this persists.`,
          severity: 'critical',
          icon: <ShieldAlert className="h-5 w-5 text-red-500" />
        });
      }
      
      setInsights(newInsights);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Smart Devices & Wearables</h1>
      <p className="text-muted-foreground mb-6">Connect your wearable devices to get AI-powered health insights</p>
      
      <Tabs defaultValue="devices">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devices">
            <Watch className="h-4 w-4 mr-2" />
            Devices
          </TabsTrigger>
          <TabsTrigger value="data" disabled={!healthData}>
            <BarChart3 className="h-4 w-4 mr-2" />
            Health Data
          </TabsTrigger>
          <TabsTrigger value="insights" disabled={insights.length === 0}>
            <Zap className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="devices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Connect Your Devices</CardTitle>
              <CardDescription>
                Link your wearables and smart devices to get personalized health insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p>Loading available devices...</p>
              ) : (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <Card key={device.id} className="border-muted">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          {device.type === 'Smartwatch' ? (
                            <Watch className="h-8 w-8 mr-3 text-primary" />
                          ) : (
                            <Smartphone className="h-8 w-8 mr-3 text-primary" />
                          )}
                          <div>
                            <h3 className="font-medium">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">{device.type}</p>
                            {device.connected && (
                              <p className="text-xs text-green-600 flex items-center mt-1">
                                <Check className="h-3 w-3 mr-1" /> Connected • Last sync: {device.lastSync}
                              </p>
                            )}
                          </div>
                        </div>
                        {device.connected ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => disconnectDevice(device.id)}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => connectDevice(device.id)}
                            disabled={connectingDevice}
                          >
                            Connect
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button variant="outline" onClick={() => toast({ title: "Scanning...", description: "Looking for new devices nearby." })}>
                Scan for New Devices
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="data" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Health Data</CardTitle>
              <CardDescription>
                Data synced from your connected devices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {healthData ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Card className="border-muted">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Footprints className="h-8 w-8 mb-2 text-blue-500" />
                      <p className="text-2xl font-bold">{healthData.steps}</p>
                      <p className="text-sm text-muted-foreground">Steps</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-muted">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Heart className="h-8 w-8 mb-2 text-red-500" />
                      <p className="text-2xl font-bold">{healthData.heartRate}</p>
                      <p className="text-sm text-muted-foreground">Heart Rate (bpm)</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-muted">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Moon className="h-8 w-8 mb-2 text-purple-500" />
                      <p className="text-2xl font-bold">{healthData.sleepHours}</p>
                      <p className="text-sm text-muted-foreground">Sleep (hours)</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-muted">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Activity className="h-8 w-8 mb-2 text-orange-500" />
                      <p className="text-2xl font-bold">{healthData.caloriesBurned}</p>
                      <p className="text-sm text-muted-foreground">Calories Burned</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-muted">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Thermometer className="h-8 w-8 mb-2 text-amber-500" />
                      <p className="text-2xl font-bold">{healthData.temperature}°C</p>
                      <p className="text-sm text-muted-foreground">Temperature</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-muted">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <Zap className="h-8 w-8 mb-2 text-sky-500" />
                      <p className="text-2xl font-bold">{healthData.bloodOxygen}%</p>
                      <p className="text-sm text-muted-foreground">Blood Oxygen</p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <p>No health data available. Please connect a device first.</p>
              )}
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <Button 
                variant="outline" 
                onClick={generateAIInsights}
                disabled={!healthData}
              >
                Analyze My Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>AI Health Insights</CardTitle>
              <CardDescription>
                Personalized insights and recommendations based on your health data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {insights.map((insight, index) => (
                  <Alert key={index} variant={insight.severity === 'critical' ? 'destructive' : 'default'}>
                    <div className="flex items-start">
                      {insight.icon}
                      <div className="ml-3">
                        <AlertTitle>{insight.type}</AlertTitle>
                        <AlertDescription>
                          {insight.message}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4 border-t pt-4">
              <div className="text-center w-full">
                <p className="text-sm text-muted-foreground mb-2">Need more detailed analysis?</p>
                <Button>Schedule a Telehealth Consultation</Button>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground text-center w-full mt-2">
                These insights are generated by AI and should not replace professional medical advice.
                Always consult a healthcare provider for medical concerns.
              </p>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WearablesIntegration;
