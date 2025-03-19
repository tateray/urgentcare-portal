
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PatientInformatics from './PatientInformatics';
import { 
  Activity, 
  Heart, 
  HeartPulse, 
  Thermometer,
  Info,
  Droplet,
  Weight,
  Pill,
  Settings,
  RefreshCw,
  Plus
} from 'lucide-react';

interface SelfHelpWidgetProps {
  userId?: string;
  className?: string;
}

const SelfHelpWidget: React.FC<SelfHelpWidgetProps> = ({ userId, className }) => {
  const [activeTab, setActiveTab] = useState('vitals');

  const healthCategories = [
    { id: 'vitals', name: 'Vital Signs', icon: <Activity className="h-5 w-5" /> },
    { id: 'bp', name: 'Blood Pressure', icon: <HeartPulse className="h-5 w-5" /> },
    { id: 'weight', name: 'Weight Tracking', icon: <Weight className="h-5 w-5" /> },
    { id: 'meds', name: 'Medications', icon: <Pill className="h-5 w-5" /> },
    { id: 'blood', name: 'Blood Test', icon: <Droplet className="h-5 w-5" /> },
    { id: 'temp', name: 'Temperature', icon: <Thermometer className="h-5 w-5" /> },
  ];

  return (
    <Card className={`${className} shadow-md border-0`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-primary" /> 
          Self Health Monitoring
        </CardTitle>
        <CardDescription>
          Track your health metrics and get AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {healthCategories.map((category) => (
            <Button
              key={category.id}
              variant="outline"
              onClick={() => setActiveTab(category.id)}
              className={`flex flex-col items-center justify-center h-20 ${
                activeTab === category.id ? 'bg-primary/10 border-primary' : ''
              }`}
            >
              <div className={`mb-1 ${activeTab === category.id ? 'text-primary' : ''}`}>
                {category.icon}
              </div>
              <span className="text-xs">{category.name}</span>
            </Button>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="vitals" className="mt-0">
            <PatientInformatics userId={userId} />
          </TabsContent>
          
          <TabsContent value="bp" className="mt-0">
            <PatientInformatics userId={userId} />
          </TabsContent>
          
          <TabsContent value="weight" className="mt-0">
            <div className="text-center py-8">
              <Weight className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Weight Tracking</h3>
              <p className="text-sm text-gray-500 mb-4">
                Connect your smart scale or manually log your weight
              </p>
              <Button className="mx-auto">
                <Plus className="h-4 w-4 mr-2" /> Add Weight Measurement
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="meds" className="mt-0">
            <div className="text-center py-8">
              <Pill className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Medication Tracking</h3>
              <p className="text-sm text-gray-500 mb-4">
                Log your medications and get reminders
              </p>
              <Button className="mx-auto">
                <Plus className="h-4 w-4 mr-2" /> Add Medication
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="blood" className="mt-0">
            <div className="text-center py-8">
              <Droplet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Blood Test Results</h3>
              <p className="text-sm text-gray-500 mb-4">
                Upload or manually enter your blood test results
              </p>
              <Button className="mx-auto">
                <Plus className="h-4 w-4 mr-2" /> Add Blood Test
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="temp" className="mt-0">
            <div className="text-center py-8">
              <Thermometer className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2">Temperature Log</h3>
              <p className="text-sm text-gray-500 mb-4">
                Track your body temperature over time
              </p>
              <Button className="mx-auto">
                <Plus className="h-4 w-4 mr-2" /> Add Temperature Reading
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <div className="flex items-center">
            <RefreshCw className="h-3 w-3 mr-1" /> Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div className="flex items-center">
            <Settings className="h-3 w-3 mr-1" /> Settings
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelfHelpWidget;
