
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { Activity, Heart, Footprints, Thermometer, Watch, Zap, Moon, BarChart3, Smartphone, ShieldAlert, Check, AlertCircle, Plus, RefreshCw, Loader2 } from "lucide-react";

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
  provider: string;
  connected: boolean;
  lastSync: string;
}

interface AIInsight {
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  icon?: React.ReactNode;
  recommendations?: Array<{type: string, advice: string}>;
}

const WearablesIntegration = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectingDevice, setConnectingDevice] = useState(false);
  const [syncingData, setSyncingData] = useState(false);
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("devices");

  // Check for authentication code in URL (for OAuth flow)
  useEffect(() => {
    const code = searchParams.get('code');
    const provider = searchParams.get('provider');
    
    if (code && provider) {
      toast({
        title: "Authentication Successful",
        description: `Connected to ${provider}. Fetching your health data...`,
      });
      
      // In a real app, you would exchange this code for an access token
      // and then use that token to fetch health data
      setAccessToken(code);
      
      // Simulate successful connection
      handleDeviceConnect(provider);
      
      // Remove the query parameters from the URL
      navigate('/wearables', { replace: true });
    }
  }, [searchParams, navigate, toast]);

  useEffect(() => {
    // Simulate loading devices
    setTimeout(() => {
      setDevices([
        {
          id: 'dev-001',
          name: 'Fitbit',
          type: 'Smartwatch',
          provider: 'fitbit',
          connected: false,
          lastSync: '-'
        },
        {
          id: 'dev-002',
          name: 'Apple Health',
          type: 'Smartphone App',
          provider: 'apple_health',
          connected: false,
          lastSync: '-'
        },
        {
          id: 'dev-003',
          name: 'Google Fit',
          type: 'Fitness App',
          provider: 'google_fit',
          connected: false,
          lastSync: '-'
        },
        {
          id: 'dev-004',
          name: 'Samsung Health',
          type: 'Health App',
          provider: 'samsung_health',
          connected: false,
          lastSync: '-'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Connect to a device via API
  const connectDevice = async (deviceId: string) => {
    setConnectingDevice(true);
    const device = devices.find(d => d.id === deviceId);
    
    if (!device) {
      toast({
        title: "Error",
        description: "Device not found",
        variant: "destructive",
      });
      setConnectingDevice(false);
      return;
    }
    
    try {
      // Call our edge function to initiate the auth flow
      const { data, error } = await supabase.functions.invoke('wearables-connect', {
        body: {
          provider: device.provider,
          action: 'auth'
        }
      });
      
      if (error) throw error;
      
      if (data.authUrl) {
        // For OAuth-based services, redirect to the auth URL
        window.location.href = data.authUrl;
      } else {
        // For services that don't require OAuth (or use different auth mechanism)
        handleDeviceConnect(device.provider);
        setConnectingDevice(false);
      }
    } catch (error) {
      console.error("Error connecting to device:", error);
      toast({
        title: "Connection Failed",
        description: "There was an error connecting to your device",
        variant: "destructive",
      });
      setConnectingDevice(false);
    }
  };

  // Simulate device connection (in a real app, this would happen after OAuth)
  const handleDeviceConnect = (provider: string) => {
    setDevices(prevDevices => 
      prevDevices.map(device => 
        device.provider === provider 
          ? { ...device, connected: true, lastSync: new Date().toLocaleString() } 
          : device
      )
    );
    
    fetchHealthData(provider);
    
    // Move to data tab after connecting
    setTimeout(() => {
      setActiveTab("data");
    }, 1000);
  };

  // Fetch health data from the connected device
  const fetchHealthData = async (provider: string) => {
    setSyncingData(true);
    
    try {
      // In a real app, we'd use the actual access token
      const token = accessToken || "demo-token-" + Math.random().toString(36).substring(7);
      
      // Call our edge function to fetch data
      const { data, error } = await supabase.functions.invoke('wearables-connect', {
        body: {
          provider,
          action: 'fetch_data',
          accessToken: token,
          userId: (await supabase.auth.getUser()).data.user?.id
        }
      });
      
      if (error) throw error;
      
      setHealthData(data);
      generateAIInsights(data);
    } catch (error) {
      console.error("Error fetching health data:", error);
      toast({
        title: "Data Sync Failed",
        description: "There was an error fetching your health data",
        variant: "destructive",
      });
    } finally {
      setSyncingData(false);
    }
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
      description: "Your device has been disconnected",
    });
    
    // If no devices are connected, clear health data
    if (!devices.some(device => device.connected && device.id !== deviceId)) {
      setHealthData(null);
      setInsights([]);
    }
  };

  // Refresh data for a specific device
  const refreshDeviceData = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    
    if (!device || !device.connected) {
      toast({
        title: "Error",
        description: "Device not connected",
        variant: "destructive",
      });
      return;
    }
    
    setRefreshing(deviceId);
    
    try {
      await fetchHealthData(device.provider);
      
      // Update last sync time
      setDevices(prevDevices => 
        prevDevices.map(d => 
          d.id === deviceId 
            ? { ...d, lastSync: new Date().toLocaleString() } 
            : d
        )
      );
      
      toast({
        title: "Data Refreshed",
        description: "Your health data has been updated",
      });
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast({
        title: "Refresh Failed",
        description: "There was an error refreshing your health data",
        variant: "destructive",
      });
    } finally {
      setRefreshing(null);
    }
  };

  // Generate AI insights based on health data
  const generateAIInsights = async (data: HealthData) => {
    try {
      const { data: insightsData, error } = await supabase.functions.invoke('wearables-insights', {
        body: {
          healthData: data,
          userId: (await supabase.auth.getUser()).data.user?.id,
          userProfile: {
            // In a real app, you'd fetch this from the user's profile
            age: 35,
            gender: 'unknown',
            conditions: []
          }
        }
      });
      
      if (error) throw error;
      
      // Add icons to the insights
      const insightsWithIcons = insightsData.insights.map(insight => ({
        ...insight,
        icon: getInsightIcon(insight.type, insight.severity)
      }));
      
      setInsights(insightsWithIcons);
      
      // Move to insights tab after analysis
      setTimeout(() => {
        setActiveTab("insights");
      }, 500);
    } catch (error) {
      console.error("Error generating insights:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your health data",
        variant: "destructive",
      });
    }
  };

  // Get icon for insight type
  const getInsightIcon = (type: string, severity: string) => {
    const color = severity === 'critical' ? "text-red-500" : 
                 severity === 'warning' ? "text-amber-500" : 
                 "text-green-500";
                 
    switch (type.toLowerCase()) {
      case 'steps':
        return <Footprints className={`h-5 w-5 ${color}`} />;
      case 'heart rate':
        return <Heart className={`h-5 w-5 ${color}`} />;
      case 'sleep':
        return <Moon className={`h-5 w-5 ${color}`} />;
      case 'blood oxygen':
        return <Activity className={`h-5 w-5 ${color}`} />;
      case 'temperature':
        return <Thermometer className={`h-5 w-5 ${color}`} />;
      case 'ai health coach':
        return <Zap className={`h-5 w-5 text-purple-500`} />;
      case 'urgent health alert':
        return <ShieldAlert className={`h-5 w-5 text-red-500`} />;
      default:
        return <AlertCircle className={`h-5 w-5 ${color}`} />;
    }
  };

  // Get progress color based on value and thresholds
  const getProgressColor = (value: number, min: number, target: number, max: number) => {
    if (value < min) return "bg-red-500";
    if (value > max) return "bg-amber-500";
    if (value >= target) return "bg-green-500";
    return "bg-blue-500";
  };

  // Calculate progress percentage
  const calculateProgress = (value: number, min: number, target: number) => {
    // Ensure we don't exceed 100%
    return Math.min(Math.round((value / target) * 100), 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Smart Devices & Wearables</h1>
      <p className="text-muted-foreground mb-6">Connect your wearable devices to get AI-powered health insights</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              <CardTitle className="flex items-center justify-between">
                <span>Connect Your Devices</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setAddDeviceOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Device
                </Button>
              </CardTitle>
              <CardDescription>
                Link your wearables and smart devices to get personalized health insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="space-y-4">
                  {devices.map((device) => (
                    <Card key={device.id} className="border-muted">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div className="flex items-center">
                          {device.type.includes('watch') ? (
                            <Watch className="h-8 w-8 mr-3 text-primary" />
                          ) : (
                            <Smartphone className="h-8 w-8 mr-3 text-primary" />
                          )}
                          <div>
                            <h3 className="font-medium">{device.name}</h3>
                            <p className="text-sm text-muted-foreground">{device.type}</p>
                            {device.connected && (
                              <div className="flex items-center mt-1">
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200 flex items-center">
                                  <Check className="h-3 w-3 mr-1" /> Connected
                                </Badge>
                                <span className="text-xs text-muted-foreground ml-2">
                                  Last sync: {device.lastSync}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {device.connected && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => refreshDeviceData(device.id)}
                              disabled={!!refreshing}
                            >
                              {refreshing === device.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <RefreshCw className="h-4 w-4" />
                              )}
                            </Button>
                          )}
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
                              {connectingDevice ? "Connecting..." : "Connect"}
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {devices.length === 0 && (
                    <div className="text-center p-8">
                      <p className="text-muted-foreground">No devices available</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => setAddDeviceOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add a Device
                      </Button>
                    </div>
                  )}
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
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Card className="border-muted">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center justify-center">
                          <Footprints className="h-8 w-8 mb-2 text-blue-500" />
                          <p className="text-2xl font-bold">{healthData.steps}</p>
                          <p className="text-sm text-muted-foreground">Steps</p>
                          
                          <div className="w-full mt-4">
                            <Progress 
                              value={calculateProgress(healthData.steps, 0, 10000)} 
                              className={getProgressColor(healthData.steps, 3000, 10000, 20000)}
                            />
                            <p className="text-xs text-right mt-1 text-muted-foreground">Goal: 10,000</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-muted">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center justify-center">
                          <Heart className="h-8 w-8 mb-2 text-red-500" />
                          <p className="text-2xl font-bold">{healthData.heartRate}</p>
                          <p className="text-sm text-muted-foreground">Heart Rate (bpm)</p>
                          
                          <div className="w-full mt-4">
                            <Progress 
                              value={calculateProgress(healthData.heartRate, 0, 80)} 
                              className={getProgressColor(healthData.heartRate, 50, 70, 100)}
                            />
                            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                              <span>Low</span>
                              <span>Normal</span>
                              <span>High</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-muted">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center justify-center">
                          <Moon className="h-8 w-8 mb-2 text-purple-500" />
                          <p className="text-2xl font-bold">{healthData.sleepHours}</p>
                          <p className="text-sm text-muted-foreground">Sleep (hours)</p>
                          
                          <div className="w-full mt-4">
                            <Progress 
                              value={calculateProgress(healthData.sleepHours, 0, 8)} 
                              className={getProgressColor(healthData.sleepHours, 5, 8, 10)}
                            />
                            <p className="text-xs text-right mt-1 text-muted-foreground">Goal: 8 hours</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-muted">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center justify-center">
                          <Activity className="h-8 w-8 mb-2 text-orange-500" />
                          <p className="text-2xl font-bold">{healthData.caloriesBurned}</p>
                          <p className="text-sm text-muted-foreground">Calories Burned</p>
                          
                          <div className="w-full mt-4">
                            <Progress 
                              value={calculateProgress(healthData.caloriesBurned, 0, 2000)} 
                              className={getProgressColor(healthData.caloriesBurned, 800, 2000, 3500)}
                            />
                            <p className="text-xs text-right mt-1 text-muted-foreground">Est. Goal: 2,000</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-muted">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center justify-center">
                          <Thermometer className="h-8 w-8 mb-2 text-amber-500" />
                          <p className="text-2xl font-bold">{healthData.temperature}°C</p>
                          <p className="text-sm text-muted-foreground">Temperature</p>
                          
                          <div className="w-full mt-4">
                            <Progress 
                              value={50} 
                              className={getProgressColor(healthData.temperature, 35, 36.5, 38)}
                            />
                            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                              <span>35°C</span>
                              <span>37°C</span>
                              <span>39°C</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-muted">
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center justify-center">
                          <Zap className="h-8 w-8 mb-2 text-sky-500" />
                          <p className="text-2xl font-bold">{healthData.bloodOxygen}%</p>
                          <p className="text-sm text-muted-foreground">Blood Oxygen</p>
                          
                          <div className="w-full mt-4">
                            <Progress 
                              value={calculateProgress(healthData.bloodOxygen, 0, 95)} 
                              className={getProgressColor(healthData.bloodOxygen, 94, 98, 101)}
                            />
                            <div className="flex justify-between text-xs mt-1 text-muted-foreground">
                              <span>90%</span>
                              <span>95%</span>
                              <span>100%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-center">
                    <Button 
                      onClick={() => generateAIInsights(healthData)}
                      disabled={syncingData}
                    >
                      {syncingData ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Zap className="h-4 w-4 mr-2" />
                          Analyze My Data
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground">No health data available. Please connect a device first.</p>
                </div>
              )}
            </CardContent>
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
                  <Alert 
                    key={index} 
                    variant={insight.severity === 'critical' ? 'destructive' : 'default'}
                    className={insight.severity === 'warning' ? 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100' : ''}
                  >
                    <div className="flex items-start">
                      {insight.icon}
                      <div className="ml-3">
                        <AlertTitle>{insight.type}</AlertTitle>
                        <AlertDescription>
                          {insight.message}
                          
                          {insight.recommendations && (
                            <ul className="mt-2 space-y-2">
                              {insight.recommendations.map((rec, idx) => (
                                <li key={idx} className="pl-2 border-l-2 border-muted-foreground/30">
                                  {rec.advice}
                                </li>
                              ))}
                            </ul>
                          )}
                        </AlertDescription>
                      </div>
                    </div>
                  </Alert>
                ))}
                
                {insights.length === 0 && (
                  <div className="text-center p-8">
                    <p className="text-muted-foreground">No insights available. Please analyze your health data first.</p>
                  </div>
                )}
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
      
      {/* Dialog for adding new devices */}
      <Dialog open={addDeviceOpen} onOpenChange={setAddDeviceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a New Device</DialogTitle>
            <DialogDescription>
              Connect a new wearable device or health app to track your metrics
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              Select your device type to begin the connection process:
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-24 flex flex-col justify-center items-center"
                onClick={() => {
                  setAddDeviceOpen(false);
                  toast({
                    title: "Feature in Development",
                    description: "Support for additional devices is coming soon.",
                  });
                }}
              >
                <Watch className="h-8 w-8 mb-2 text-primary" />
                <span>Smartwatch</span>
              </Button>
              
              <Button 
                variant="outline"
                className="h-24 flex flex-col justify-center items-center"
                onClick={() => {
                  setAddDeviceOpen(false);
                  toast({
                    title: "Feature in Development",
                    description: "Support for additional devices is coming soon.",
                  });
                }}
              >
                <Smartphone className="h-8 w-8 mb-2 text-primary" />
                <span>Smartphone</span>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              For best results, make sure your device has the latest firmware and is properly charged.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setAddDeviceOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WearablesIntegration;
