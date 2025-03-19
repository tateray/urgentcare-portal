
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import VitalSignsCard from './health/VitalSignsCard';
import VitalsChart from './health/VitalsChart';
import AddVitalsForm from './health/AddVitalsForm';
import AiAnalysisTab from './health/AiAnalysisTab';
import { usePatientVitals } from '@/hooks/usePatientVitals';

interface PatientInformaticsProps {
  userId?: string;
}

const PatientInformatics: React.FC<PatientInformaticsProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState('history');
  
  const {
    patientName,
    vitalSigns,
    aiAnalysis,
    isLoading,
    fetchVitalSigns,
    getAiAnalysis
  } = usePatientVitals({ userId });

  const handleVitalAdded = async (newVital) => {
    // Update the UI with the new vital sign
    await fetchVitalSigns();
    
    // Get AI analysis for the new vital sign
    await getAiAnalysis(newVital);
    
    // Switch to history tab
    setActiveTab('history');
  };

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
          <VitalSignsCard vitalSigns={vitalSigns} />
          <VitalsChart 
            vitalSigns={vitalSigns} 
            onAddReading={() => setActiveTab('add')} 
          />
        </TabsContent>

        <TabsContent value="add" className="space-y-4">
          <AddVitalsForm 
            userId={userId} 
            onVitalAdded={handleVitalAdded} 
          />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <AiAnalysisTab 
            aiAnalysis={aiAnalysis} 
            onAddData={() => setActiveTab('add')} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientInformatics;
