
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Heart, HeartPulse, ThermometerIcon } from 'lucide-react';
import { VitalSigns, defaultVitals, getBpStatus, getStatusColor, getHeartRateStatus, getTemperatureStatus } from '@/utils/vitalSignsUtils';

interface VitalSignsCardProps {
  vitalSigns: VitalSigns[];
}

const VitalSignsCard: React.FC<VitalSignsCardProps> = ({ vitalSigns }) => {
  const currentBp = vitalSigns.length > 0 ? vitalSigns[0] : defaultVitals;
  
  const bpStatus = getBpStatus(currentBp.systolic, currentBp.diastolic);
  const bpStatusColor = getStatusColor(bpStatus);
  
  const heartRateStatus = getHeartRateStatus(currentBp.heartRate);
  const heartRateColor = getStatusColor(heartRateStatus);
  
  const temperatureStatus = getTemperatureStatus(currentBp.temperature);
  const temperatureColor = getStatusColor(temperatureStatus);

  return (
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
            <HeartPulse className="h-4 w-4 mr-2 text-pink-500" />
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
  );
};

export default VitalSignsCard;
