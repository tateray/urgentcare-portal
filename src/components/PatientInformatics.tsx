
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Heart, Activity, ArrowRight, Pulse, Plus, ThermometerIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp } from 'firebase/firestore';
import { auth } from '@/lib/firebase';

interface PatientInformaticsProps {
  userId?: string;
}

type VitalSigns = {
  timestamp: Date;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  notes?: string;
};

const defaultVitals: VitalSigns = {
  timestamp: new Date(),
  systolic: 120,
  diastolic: 80,
  heartRate: 72,
  temperature: 98.6,
  notes: '',
};

const PatientInformatics: React.FC<PatientInformaticsProps> = ({ userId }) => {
  const [patientName, setPatientName] = useState('Patient');
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [newVital, setNewVital] = useState<VitalSigns>(defaultVitals);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('history');

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        
        const userIdToUse = userId || currentUser.uid;
        const userDoc = doc(db, 'users', userIdToUse);
        const userSnapshot = await getDoc(userDoc);
        const data = userSnapshot.data();
        
        if (data) {
          // Set patient name from profile data
          const fullName = data.email || "Patient"; // Fallback to email or "Patient"
          setPatientName(fullName);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, [userId]);

  // Fetch vital signs
  useEffect(() => {
    const fetchVitalSigns = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        
        const userIdToUse = userId || currentUser.uid;
        
        // Query vital signs collection
        const vitalsQuery = query(
          collection(db, 'users', userIdToUse, 'vitalSigns'),
          orderBy('timestamp', 'desc'),
          limit(20)
        );
        
        const querySnapshot = await getDocs(vitalsQuery);
        const vitals: VitalSigns[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          vitals.push({
            timestamp: data.timestamp.toDate(),
            systolic: data.systolic || 0,
            diastolic: data.diastolic || 0,
            heartRate: data.heartRate || 0,
            temperature: data.temperature || 0,
            notes: data.notes || '',
          });
        });
        
        setVitalSigns(vitals.length > 0 ? vitals : []);
        
        // If we have vitals, get AI analysis
        if (vitals.length > 0) {
          getAiAnalysis(vitals[0]);
        }
      } catch (error) {
        console.error('Error fetching vital signs:', error);
      }
    };

    fetchVitalSigns();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;
    
    // Parse numeric inputs
    if (name !== 'notes') {
      parsedValue = parseFloat(value) || 0;
    }
    
    setNewVital({
      ...newVital,
      [name]: parsedValue,
    });
  };

  const saveVitalSigns = async () => {
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) return;
      
      const userIdToUse = userId || currentUser.uid;
      const vitalWithTimestamp = {
        ...newVital,
        timestamp: Timestamp.fromDate(new Date()),
      };
      
      // Add new document to vitalSigns subcollection
      await addDoc(
        collection(db, 'users', userIdToUse, 'vitalSigns'),
        vitalWithTimestamp
      );
      
      // Update state with new vital
      setVitalSigns([
        {
          ...newVital,
          timestamp: new Date(),
        },
        ...vitalSigns,
      ]);
      
      // Reset form
      setNewVital(defaultVitals);
      
      // Get AI analysis
      getAiAnalysis(newVital);
      
      // Switch to history tab
      setActiveTab('history');
    } catch (error) {
      console.error('Error saving vital signs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAiAnalysis = async (vitals: VitalSigns) => {
    try {
      // Call to Supabase Edge Function for AI analysis
      const response = await fetch(
        'https://your-supabase-project.functions.supabase.co/health-metrics-analysis',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            systolic: vitals.systolic,
            diastolic: vitals.diastolic,
            heartRate: vitals.heartRate,
            temperature: vitals.temperature,
          }),
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error getting AI analysis:', error);
      setAiAnalysis('Unable to analyze vital signs at this moment.');
    }
  };

  const formatDateForChart = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const chartData = vitalSigns.map((vital) => ({
    date: formatDateForChart(vital.timestamp),
    systolic: vital.systolic,
    diastolic: vital.diastolic,
    heartRate: vital.heartRate,
  })).reverse();

  const getBpStatus = (systolic: number, diastolic: number) => {
    if (systolic >= 180 || diastolic >= 120) return 'hypertensive-crisis';
    if (systolic >= 140 || diastolic >= 90) return 'high';
    if (systolic >= 130 || diastolic >= 80) return 'elevated';
    if (systolic >= 90 && systolic <= 129 && diastolic >= 60 && diastolic <= 79) return 'normal';
    return 'low';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hypertensive-crisis': return 'text-red-600';
      case 'high': return 'text-orange-500';
      case 'elevated': return 'text-yellow-500';
      case 'normal': return 'text-green-500';
      case 'low': return 'text-blue-500';
      default: return 'text-gray-500';
    }
  };

  const getHeartRateStatus = (rate: number) => {
    if (rate > 100) return 'high';
    if (rate >= 60 && rate <= 100) return 'normal';
    return 'low';
  };

  const getTemperatureStatus = (temp: number) => {
    if (temp > 99.5) return 'high';
    if (temp >= 97.7 && temp <= 99.5) return 'normal';
    return 'low';
  };

  const currentBp = vitalSigns.length > 0 ? vitalSigns[0] : defaultVitals;
  const bpStatus = getBpStatus(currentBp.systolic, currentBp.diastolic);
  const bpStatusColor = getStatusColor(bpStatus);

  const heartRateStatus = getHeartRateStatus(currentBp.heartRate);
  const heartRateColor = getStatusColor(heartRateStatus);

  const temperatureStatus = getTemperatureStatus(currentBp.temperature);
  const temperatureColor = getStatusColor(temperatureStatus);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-2">Health Metrics for {patientName}</h3>
        <p className="text-sm text-muted-foreground">
          Monitor your vital signs and get AI-powered insights about your health
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="history" className="flex-1">History & Trends</TabsTrigger>
          <TabsTrigger value="add" className="flex-1">Add New Readings</TabsTrigger>
          <TabsTrigger value="analysis" className="flex-1">AI Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Heart className="h-4 w-4 mr-2 text-red-500" />
                  Blood Pressure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-baseline">
                  {currentBp.systolic}/{currentBp.diastolic} 
                  <span className={`ml-2 text-xs ${bpStatusColor}`}>
                    {bpStatus.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {vitalSigns.length > 0 ? currentBp.timestamp.toLocaleString() : 'No data'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Pulse className="h-4 w-4 mr-2 text-pink-500" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-baseline">
                  {currentBp.heartRate} <span className="text-sm ml-1">bpm</span>
                  <span className={`ml-2 text-xs ${heartRateColor}`}>
                    {heartRateStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {vitalSigns.length > 0 ? currentBp.timestamp.toLocaleString() : 'No data'}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <ThermometerIcon className="h-4 w-4 mr-2 text-orange-500" />
                  Temperature
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-baseline">
                  {currentBp.temperature}°F
                  <span className={`ml-2 text-xs ${temperatureColor}`}>
                    {temperatureStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {vitalSigns.length > 0 ? currentBp.timestamp.toLocaleString() : 'No data'}
                </p>
              </CardContent>
            </Card>
          </div>

          {vitalSigns.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Blood Pressure & Heart Rate Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" />
                      <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" />
                      <Line type="monotone" dataKey="heartRate" stroke="#ec4899" name="Heart Rate" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <Activity className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium mb-1">No Health Data</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  You haven't recorded any vital sign readings yet.
                </p>
                <Button onClick={() => setActiveTab('add')}>
                  <Plus className="h-4 w-4 mr-2" /> Add First Reading
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Add New Vital Signs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="systolic">Systolic (mmHg)</Label>
                  <Input 
                    id="systolic"
                    name="systolic"
                    type="number"
                    value={newVital.systolic}
                    onChange={handleInputChange}
                    placeholder="120"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diastolic">Diastolic (mmHg)</Label>
                  <Input 
                    id="diastolic"
                    name="diastolic"
                    type="number"
                    value={newVital.diastolic}
                    onChange={handleInputChange}
                    placeholder="80"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input 
                    id="heartRate"
                    name="heartRate"
                    type="number"
                    value={newVital.heartRate}
                    onChange={handleInputChange}
                    placeholder="72"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°F)</Label>
                  <Input 
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    value={newVital.temperature}
                    onChange={handleInputChange}
                    placeholder="98.6"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input 
                    id="notes"
                    name="notes"
                    value={newVital.notes || ''}
                    onChange={handleInputChange}
                    placeholder="Any additional information about your readings"
                  />
                </div>
              </div>
              <Button 
                className="w-full mt-4"
                onClick={saveVitalSigns}
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Vital Signs'}
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Connect Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Connect your health monitoring devices to automatically import readings.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  Connect Blood Pressure Monitor
                </Button>
                <Button variant="outline" className="w-full">
                  Connect Heart Rate Monitor
                </Button>
                <Button variant="outline" className="w-full">
                  Connect Smart Scale
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">AI Health Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {aiAnalysis ? (
                <div className="prose prose-sm max-w-none">
                  <p>{aiAnalysis}</p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium mb-2">No Analysis Available</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Add vital sign readings to get personalized AI health insights.
                  </p>
                  <Button onClick={() => setActiveTab('add')}>
                    <Plus className="h-4 w-4 mr-2" /> Add Health Data
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientInformatics;
