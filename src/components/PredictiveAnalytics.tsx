
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Filter, RefreshCw, TrendingUp } from "lucide-react";

// Mock data for demonstration
const patientFlowData = [
  { hour: '8AM', monday: 12, tuesday: 15, wednesday: 10, thursday: 8, friday: 14, saturday: 20, sunday: 5 },
  { hour: '9AM', monday: 18, tuesday: 22, wednesday: 15, thursday: 20, friday: 25, saturday: 30, sunday: 8 },
  { hour: '10AM', monday: 25, tuesday: 28, wednesday: 32, thursday: 30, friday: 26, saturday: 35, sunday: 10 },
  { hour: '11AM', monday: 30, tuesday: 35, wednesday: 40, thursday: 38, friday: 33, saturday: 32, sunday: 15 },
  { hour: '12PM', monday: 20, tuesday: 25, wednesday: 30, thursday: 28, friday: 27, saturday: 25, sunday: 12 },
  { hour: '1PM', monday: 15, tuesday: 18, wednesday: 20, thursday: 16, friday: 17, saturday: 18, sunday: 10 },
  { hour: '2PM', monday: 22, tuesday: 24, wednesday: 28, thursday: 25, friday: 23, saturday: 20, sunday: 8 },
  { hour: '3PM', monday: 28, tuesday: 30, wednesday: 25, thursday: 22, friday: 20, saturday: 15, sunday: 5 },
  { hour: '4PM', monday: 20, tuesday: 22, wednesday: 18, thursday: 15, friday: 17, saturday: 10, sunday: 3 },
  { hour: '5PM', monday: 15, tuesday: 16, wednesday: 14, thursday: 12, friday: 13, saturday: 5, sunday: 2 },
];

const hospitalUtilizationData = [
  { name: 'Parirenyatwa Hospital', utilization: 85, capacity: 100, waitTime: 45 },
  { name: 'Harare Central Hospital', utilization: 70, capacity: 80, waitTime: 30 },
  { name: 'Avenues Clinic', utilization: 60, capacity: 75, waitTime: 20 },
  { name: 'West End Hospital', utilization: 45, capacity: 60, waitTime: 15 },
  { name: 'Chitungwiza Central Hospital', utilization: 75, capacity: 90, waitTime: 35 },
];

const monthlyTrendData = [
  { month: 'Jan', patients: 1200, emergencies: 150, ambulances: 80 },
  { month: 'Feb', patients: 1400, emergencies: 120, ambulances: 75 },
  { month: 'Mar', patients: 1350, emergencies: 180, ambulances: 90 },
  { month: 'Apr', patients: 1500, emergencies: 200, ambulances: 100 },
  { month: 'May', patients: 1600, emergencies: 170, ambulances: 85 },
  { month: 'Jun', patients: 1750, emergencies: 220, ambulances: 110 },
];

interface PredictiveAnalyticsProps {
  className?: string;
}

const PredictiveAnalytics: React.FC<PredictiveAnalyticsProps> = ({ className }) => {
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [selectedView, setSelectedView] = useState<string>('hourly');

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const hospitalColors = [
    '#22c55e', // green-500
    '#3b82f6', // blue-500
    '#a855f7', // purple-500
    '#f97316', // orange-500
    '#ec4899', // pink-500
  ];

  const getHourlyData = () => {
    return patientFlowData.map(hour => ({
      hour: hour.hour,
      patients: hour[selectedDay as keyof typeof hour] as number,
    }));
  };

  const getDailyAverageData = () => {
    return days.map(day => ({
      day: day.charAt(0).toUpperCase() + day.slice(1),
      patients: patientFlowData.reduce((sum, hour) => sum + (hour[day as keyof typeof hour] as number), 0) / patientFlowData.length,
    }));
  };

  const getWaitTimeData = () => {
    return hospitalUtilizationData.map(hospital => ({
      name: hospital.name,
      waitTime: hospital.waitTime,
      utilization: (hospital.utilization / hospital.capacity) * 100,
    }));
  };

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Predictive Analytics
            </CardTitle>
            <CardDescription>
              AI-powered predictions to optimize hospital resource allocation
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Select Date
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="patient-flow">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patient-flow">Patient Flow</TabsTrigger>
            <TabsTrigger value="hospital-utilization">Hospital Utilization</TabsTrigger>
            <TabsTrigger value="emergency-trends">Emergency Trends</TabsTrigger>
          </TabsList>
          
          <TabsContent value="patient-flow" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center py-2 gap-2">
              <h3 className="text-lg font-medium">Predicted Patient Flow</h3>
              <div className="flex items-center gap-2">
                <Select value={selectedView} onValueChange={setSelectedView}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="View" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily Average</SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedView === 'hourly' && (
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day.charAt(0).toUpperCase() + day.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {selectedView === 'hourly' ? (
                  <LineChart data={getHourlyData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="patients" 
                      stroke="#3b82f6" 
                      activeDot={{ r: 8 }} 
                      name={`${selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)} Patients`}
                    />
                  </LineChart>
                ) : (
                  <BarChart data={getDailyAverageData()} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="patients" name="Average Patients" fill="#3b82f6" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-blue-500" />
                Peak hours are typically between 10AM and 12PM on weekdays
              </p>
              <p className="mt-1">
                Patient volume is predicted to be 15% higher than usual this weekend due to local events
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="hospital-utilization">
            <div className="py-2">
              <h3 className="text-lg font-medium mb-4">Current Hospital Utilization & Wait Times</h3>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getWaitTimeData()}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                  barSize={20}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="waitTime" name="Wait Time (minutes)" fill="#f97316" />
                  <Bar dataKey="utilization" name="Utilization (%)" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="text-sm">
                <h4 className="font-medium mb-2">AI Recommendations:</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Redirect non-emergency cases from Parirenyatwa Hospital to West End Hospital to balance load</li>
                  <li>• Additional staff recommended at Harare Central during peak hours (10AM-2PM)</li>
                  <li>• Consider mobile care units near Chitungwiza to reduce hospital burden</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="emergency-trends">
            <div className="py-2">
              <h3 className="text-lg font-medium mb-4">Emergency Service Trends (6 Months)</h3>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyTrendData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="patients" stroke="#3b82f6" name="Total Patients" />
                  <Line type="monotone" dataKey="emergencies" stroke="#ef4444" name="Emergency Cases" />
                  <Line type="monotone" dataKey="ambulances" stroke="#22c55e" name="Ambulance Dispatches" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50 rounded-md">
              <h4 className="font-medium text-amber-800 dark:text-amber-400">Predictive Alert:</h4>
              <p className="text-sm text-amber-700 dark:text-amber-500 mt-1">
                AI analysis predicts a 20% increase in emergency cases over the next month due to seasonal factors. 
                Consider increasing emergency response capacity and staff availability.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PredictiveAnalytics;
