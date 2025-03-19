
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VitalSigns, formatDateForChart } from '@/utils/vitalSignsUtils';

interface VitalsChartProps {
  vitalSigns: VitalSigns[];
  onAddReading: () => void;
}

const VitalsChart: React.FC<VitalsChartProps> = ({ vitalSigns, onAddReading }) => {
  const chartData = vitalSigns.map((vital) => ({
    date: formatDateForChart(vital.timestamp),
    systolic: vital.systolic,
    diastolic: vital.diastolic,
    heartRate: vital.heartRate,
  })).reverse();

  if (vitalSigns.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <Activity className="h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium mb-1">No Health Data</h3>
          <p className="text-sm text-muted-foreground mb-4 text-center">
            You haven't recorded any vital sign readings yet.
          </p>
          <Button onClick={onAddReading}>
            <Plus className="h-4 w-4 mr-2" /> Add First Reading
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
};

export default VitalsChart;
