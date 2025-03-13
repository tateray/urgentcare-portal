import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Activity, 
  Moon, 
  Flame, 
  Thermometer, 
  Droplets, 
  AlertCircle,
  ArrowLeft,
  Watch,
  Smartphone,
  Info
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from 'recharts';
import FloatingTopMenu from '@/components/FloatingTopMenu';

// Mocked data for connected devices
const mockConnectedDevices = [
  { type: 'Smart Watch', name: 'Fitbit Sense', status: 'Connected', lastSync: '2024-07-15T14:30:00Z' },
  { type: 'Blood Pressure Monitor', name: 'Omron Evolv', status: 'Connected', lastSync: '2024-07-15T14:00:00Z' },
];

// Mocked health data
const mockHealthData = {
  steps: 8500,
  heartRate: 72,
  sleepHours: 7.5,
  caloriesBurned: 1850,
  temperature: 36.7,
  bloodOxygen: 97,
};

// Mocked AI insights
const mockInsights = [
  { type: 'Activity Level', message: 'Your activity level is slightly below average for your age group. Consider increasing daily steps.', severity: 'warning' as const },
  { type: 'Sleep Quality', message: 'Your sleep duration is within the recommended range. Maintain a consistent sleep schedule.', severity: 'info' as const },
  { type: 'Heart Rate', message: 'Your resting heart rate is normal. Continue with regular cardiovascular exercises.', severity: 'info' as const },
];

// Type for the insight severity
type InsightSeverity = 'warning' | 'info' | 'alert';

// Type for the insights
interface Insight {
  type: string;
  message: string;
  severity: InsightSeverity;
  recommendations?: Array<{type: string, advice: string}>;
}

const WearablesIntegration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('devices');
  const [connectedDevices, setConnectedDevices] = useState<Array<{ type: string; name: string; status: string; lastSync: string }>>(mockConnectedDevices);
  const [healthData, setHealthData] = useState<any>(mockHealthData);
  const [insights, setInsights] = useState<Insight[]>(mockInsights);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const connectDevice = (deviceType: string) => {
    toast({
      title: "Connecting Device",
      description: `Attempting to connect to ${deviceType}...`,
    });
    
    // Simulate device connection
    setTimeout(() => {
      setConnectedDevices(prevDevices => [
        ...prevDevices,
        {
          type: deviceType,
          name: `${deviceType} Device`,
          status: 'Connected',
          lastSync: new Date().toISOString(),
        }
      ]);
      
      toast({
        title: "Device Connected",
        description: `${deviceType} Device successfully connected!`,
      });
    }, 1500);
  };

  const disconnectDevice = (deviceName: string) => {
    setConnectedDevices(prevDevices =>
      prevDevices.filter(device => device.name !== deviceName)
    );
    
    toast({
      title: "Device Disconnected",
      description: `${deviceName} successfully disconnected.`,
    });
  };

  const syncData = () => {
    setIsLoading(true);
    toast({
      title: "Syncing Data",
      description: "Fetching latest health data from connected devices...",
    });

    // Simulate data synchronization
    setTimeout(() => {
      const newHealthData = {
        steps: Math.floor(Math.random() * 10000),
        heartRate: Math.floor(Math.random() * 40) + 60,
        sleepHours: Math.floor(Math.random() * 4) + 5,
        caloriesBurned: Math.floor(Math.random() * 2000),
        temperature: 36.5 + Math.random() * 1.5,
        bloodOxygen: 95 + Math.random() * 3,
      };

      setHealthData(newHealthData);

      // Ensure the severity is always one of the allowed types
      const validateSeverity = (severity: string): InsightSeverity => {
        if (severity === 'warning' || severity === 'info' || severity === 'alert') {
          return severity;
        }
        // Default to 'info' for any other value
        return 'info';
      };

      // Update insights with the correct type for severity
      setInsights([
        {
          type: 'Activity Level',
          message: `You took ${newHealthData.steps} steps today. Keep up the good work!`,
          severity: validateSeverity('info'),
        },
        {
          type: 'Sleep Quality',
          message: `You slept for ${newHealthData.sleepHours.toFixed(1)} hours. Aim for 7-9 hours for optimal health.`,
          severity: validateSeverity('warning'),
        },
      ]);
      
      setIsLoading(false);
      toast({
        title: "Data Synced",
        description: "Successfully synced health data from connected devices.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-10">
      <FloatingTopMenu />
      
      <header className="bg-background border-b p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)} 
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Wearables & Health Devices</h1>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-6">
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="health-data">Health Data</TabsTrigger>
            <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="devices" className="animate-fade-in">
            <div className="space-y-4">
              {connectedDevices.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Smartphone className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Devices Connected</h3>
                    <p className="text-muted-foreground mb-4">Connect your smart devices to track your health data</p>
                    <Button onClick={() => connectDevice('Generic Device')}>Connect Device</Button>
                  </CardContent>
                </Card>
              ) : (
                connectedDevices.map((device, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle>{device.name}</CardTitle>
                      <CardDescription>{device.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Status: {device.status}</p>
                      <p>Last Sync: {new Date(device.lastSync).toLocaleString()}</p>
                    </CardContent>
                    <CardFooter className="justify-end">
                      <Button 
                        variant="destructive"
                        onClick={() => disconnectDevice(device.name)}
                      >
                        Disconnect
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
              
              <Button 
                variant="secondary"
                className="w-full"
                onClick={() => connectDevice('Generic Device')}
              >
                Connect New Device
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="health-data" className="animate-fade-in">
            <div className="space-y-6">
              {!healthData ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No Health Data Available</h3>
                    <p className="text-muted-foreground mb-4">Connect a device first to view your health metrics</p>
                    <Button onClick={() => setActiveTab('devices')}>Connect a Device</Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="h-5 w-5 text-primary" />
                          Steps
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{healthData.steps.toLocaleString()}</div>
                        <Progress value={(healthData.steps / 10000) * 100} className="mt-2" />
                        <p className="text-xs text-muted-foreground mt-1">Goal: 10,000 steps</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <Heart className="h-5 w-5 text-red-500" />
                          Heart Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{healthData.heartRate} <span className="text-base font-normal">bpm</span></div>
                        <Progress 
                          value={((healthData.heartRate - 40) / 140) * 100} 
                          className={`mt-2 ${healthData.heartRate > 100 ? 'bg-red-200' : ''}`} 
                        />
                        <p className="text-xs text-muted-foreground mt-1">Resting: 60-100 bpm</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="flex items-center gap-2">
                          <Moon className="h-5 w-5 text-indigo-400" />
                          Sleep
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{healthData.sleepHours} <span className="text-base font-normal">hours</span></div>
                        <Progress 
                          value={(healthData.sleepHours / 9) * 100} 
                          className={`mt-2 ${healthData.sleepHours < 6 ? 'bg-amber-200' : ''}`} 
                        />
                        <p className="text-xs text-muted-foreground mt-1">Recommended: 7-9 hours</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Steps History</CardTitle>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            data={[
                              { day: 'Mon', steps: Math.floor(Math.random() * 3000) + 5000 },
                              { day: 'Tue', steps: Math.floor(Math.random() * 3000) + 5000 },
                              { day: 'Wed', steps: Math.floor(Math.random() * 3000) + 5000 },
                              { day: 'Thu', steps: Math.floor(Math.random() * 3000) + 5000 },
                              { day: 'Fri', steps: Math.floor(Math.random() * 3000) + 5000 },
                              { day: 'Sat', steps: healthData.steps - 500 },
                              { day: 'Sun', steps: healthData.steps },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="steps" fill="#3b82f6" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Heart Rate Trends</CardTitle>
                      </CardHeader>
                      <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={[
                              { time: '6am', rate: Math.floor(Math.random() * 15) + 60 },
                              { time: '9am', rate: Math.floor(Math.random() * 15) + 65 },
                              { time: '12pm', rate: Math.floor(Math.random() * 15) + 70 },
                              { time: '3pm', rate: Math.floor(Math.random() * 15) + 75 },
                              { time: '6pm', rate: Math.floor(Math.random() * 15) + 75 },
                              { time: '9pm', rate: Math.floor(Math.random() * 10) + 65 },
                              { time: 'Now', rate: healthData.heartRate },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="time" />
                            <YAxis domain={[40, 180]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="rate" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="ai-insights" className="animate-fade-in">
            <div className="space-y-6">
              {!insights.length ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Info className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-xl font-semibold mb-2">No AI Insights Available</h3>
                    <p className="text-muted-foreground mb-4">Connect a device and sync health data to receive AI-powered insights</p>
                    <Button onClick={() => setActiveTab('devices')}>Connect a Device</Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>AI Health Analysis</CardTitle>
                      <CardDescription>
                        Personalized insights based on your health data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {insights.map((insight, index) => (
                          <div 
                            key={index}
                            className={`p-4 rounded-lg border ${
                              insight.severity === 'alert' ? 'bg-red-50 border-red-200' :
                              insight.severity === 'warning' ? 'bg-amber-50 border-amber-200' :
                              'bg-blue-50 border-blue-200'
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              {insight.severity === 'alert' ? (
                                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                              ) : insight.severity === 'warning' ? (
                                <Info className="h-5 w-5 text-amber-500 mt-0.5" />
                              ) : (
                                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                              )}
                              <div>
                                <h4 className={`font-medium ${
                                  insight.severity === 'alert' ? 'text-red-700' :
                                  insight.severity === 'warning' ? 'text-amber-700' :
                                  'text-blue-700'
                                }`}>
                                  {insight.type}
                                </h4>
                                <p className="mt-1 text-sm">{insight.message}</p>
                                {insight.recommendations && (
                                  <div className="mt-2">
                                    {insight.recommendations.map((rec, idx) => (
                                      <div key={idx} className="mt-2 text-sm">
                                        <strong>{rec.type}:</strong> {rec.advice}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          toast({
                            title: "AI Analysis",
                            description: "A comprehensive health report has been generated",
                          });
                        }}
                      >
                        Generate Detailed Health Report
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                          <h4 className="font-medium text-green-700">Exercise Suggestion</h4>
                          <p className="mt-1 text-sm">Based on your activity levels, a 30-minute moderate walk would help you reach your step goal for today.</p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-200">
                          <h4 className="font-medium text-indigo-700">Sleep Recommendation</h4>
                          <p className="mt-1 text-sm">Try to sleep 30 minutes earlier tonight to improve your overall sleep quality and duration.</p>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                          <h4 className="font-medium text-blue-700">Hydration Reminder</h4>
                          <p className="mt-1 text-sm">Remember to drink at least 8 glasses of water today, especially if you plan to exercise.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WearablesIntegration;
