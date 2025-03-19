
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { VitalSigns, defaultVitals } from '@/utils/vitalSignsUtils';

interface UsePatientVitalsProps {
  userId?: string;
}

interface UsePatientVitalsReturn {
  patientName: string;
  vitalSigns: VitalSigns[];
  aiAnalysis: string;
  isLoading: boolean;
  fetchVitalSigns: () => Promise<void>;
  getAiAnalysis: (vitals: VitalSigns) => Promise<void>;
}

export const usePatientVitals = ({ userId }: UsePatientVitalsProps): UsePatientVitalsReturn => {
  const [patientName, setPatientName] = useState('Patient');
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    fetchVitalSigns();
  }, [userId]);

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

  return {
    patientName,
    vitalSigns,
    aiAnalysis,
    isLoading,
    fetchVitalSigns,
    getAiAnalysis
  };
};
