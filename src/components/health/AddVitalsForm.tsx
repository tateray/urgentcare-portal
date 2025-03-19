
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { auth } from '@/lib/firebase';
import { VitalSigns, defaultVitals } from '@/utils/vitalSignsUtils';

interface AddVitalsFormProps {
  userId?: string;
  onVitalAdded: (vital: VitalSigns) => void;
}

const AddVitalsForm: React.FC<AddVitalsFormProps> = ({ userId, onVitalAdded }) => {
  const [newVital, setNewVital] = useState<VitalSigns>(defaultVitals);
  const [isLoading, setIsLoading] = useState(false);
  
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
      
      // Reset form
      const newVitalWithDate = {
        ...newVital,
        timestamp: new Date(),
      };
      
      onVitalAdded(newVitalWithDate);
      
      // Reset form
      setNewVital(defaultVitals);
    } catch (error) {
      console.error('Error saving vital signs:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default AddVitalsForm;
