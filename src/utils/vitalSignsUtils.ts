
// Helper functions for vital signs data processing and status determination

export const formatDateForChart = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const getBpStatus = (systolic: number, diastolic: number) => {
  if (systolic >= 180 || diastolic >= 120) return 'hypertensive-crisis';
  if (systolic >= 140 || diastolic >= 90) return 'high';
  if (systolic >= 130 || diastolic >= 80) return 'elevated';
  if (systolic >= 90 && systolic <= 129 && diastolic >= 60 && diastolic <= 79) return 'normal';
  return 'low';
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'hypertensive-crisis': return 'text-red-600';
    case 'high': return 'text-orange-500';
    case 'elevated': return 'text-yellow-500';
    case 'normal': return 'text-green-500';
    case 'low': return 'text-blue-500';
    default: return 'text-gray-500';
  }
};

export const getHeartRateStatus = (rate: number) => {
  if (rate > 100) return 'high';
  if (rate >= 60 && rate <= 100) return 'normal';
  return 'low';
};

export const getTemperatureStatus = (temp: number) => {
  if (temp > 99.5) return 'high';
  if (temp >= 97.7 && temp <= 99.5) return 'normal';
  return 'low';
};

export type VitalSigns = {
  timestamp: Date;
  systolic: number;
  diastolic: number;
  heartRate: number;
  temperature: number;
  notes?: string;
};

export const defaultVitals: VitalSigns = {
  timestamp: new Date(),
  systolic: 120,
  diastolic: 80,
  heartRate: 72,
  temperature: 98.6,
  notes: '',
};
