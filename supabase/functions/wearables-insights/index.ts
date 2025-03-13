
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple function to classify health data severity using rule-based model
function classifyHealthMetric(metric, value, thresholds) {
  if (value < thresholds.low) {
    return {
      status: 'low',
      severity: thresholds.lowSeverity,
      message: thresholds.lowMessage.replace('{value}', value)
    };
  } else if (value > thresholds.high) {
    return {
      status: 'high',
      severity: thresholds.highSeverity,
      message: thresholds.highMessage.replace('{value}', value)
    };
  } else {
    return {
      status: 'normal',
      severity: 'info',
      message: thresholds.normalMessage.replace('{value}', value)
    };
  }
}

// Get personalized advice based on health metrics
function getPersonalizedAdvice(healthData, userProfile = {}) {
  // Consider user demographics if available (age, gender, conditions, etc.)
  const age = userProfile.age || 35; // Default to average adult
  
  let adviceList = [];
  
  // Heart rate analysis
  if (healthData.heartRate > 100) {
    adviceList.push({
      type: 'heart',
      advice: "Your heart rate is elevated. Try relaxation techniques like deep breathing for 5 minutes, several times a day. If this persists, consider consulting a healthcare professional."
    });
  }
  
  // Steps analysis - personalize based on age
  let targetSteps = 10000;
  if (age > 65) targetSteps = 7500;
  
  if (healthData.steps < targetSteps * 0.5) {
    adviceList.push({
      type: 'activity',
      advice: `You're currently at ${healthData.steps} steps, well below your target of ${targetSteps}. Try adding a 15-minute walk to your daily routine and using the stairs instead of elevators when possible.`
    });
  } else if (healthData.steps < targetSteps * 0.8) {
    adviceList.push({
      type: 'activity',
      advice: `Good progress with ${healthData.steps} steps, but aim for ${targetSteps} daily. Try parking farther from entrances or taking short walking breaks during the day.`
    });
  }
  
  // Sleep analysis
  if (healthData.sleepHours < 7) {
    adviceList.push({
      type: 'sleep',
      advice: `You're getting ${healthData.sleepHours} hours of sleep, which is below the recommended 7-9 hours. Try setting a consistent sleep schedule, limiting screen time before bed, and creating a relaxing bedtime routine.`
    });
  }
  
  // Calorie analysis based on activity level
  const isActive = healthData.steps > 8000;
  if (isActive && healthData.caloriesBurned < 1500) {
    adviceList.push({
      type: 'nutrition',
      advice: "Your calorie burn is lower than expected given your activity level. Consider consulting a nutritionist to ensure your metabolism is functioning properly."
    });
  }
  
  // Blood oxygen analysis - critical health indicator
  if (healthData.bloodOxygen < 95) {
    adviceList.push({
      type: 'oxygen',
      advice: `Your blood oxygen level of ${healthData.bloodOxygen}% is below normal range. This could indicate respiratory issues. If this reading persists, please consult a healthcare provider as soon as possible.`
    });
  }
  
  return adviceList;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { healthData, userId, userProfile } = await req.json();
    
    if (!healthData) {
      throw new Error('No health data provided');
    }
    
    // Constants for health metrics thresholds
    const thresholds = {
      steps: {
        low: 5000,
        high: 15000,
        lowSeverity: 'warning',
        highSeverity: 'info',
        lowMessage: 'You\'ve taken only {value} steps today, which is below the recommended amount. Consider taking a walk or increasing your physical activity.',
        highMessage: 'Excellent! You\'ve taken {value} steps today, exceeding the recommended amount. Keep up the good work!',
        normalMessage: 'You\'ve taken {value} steps today. You\'re on track to reach the recommended 10,000 steps.'
      },
      heartRate: {
        low: 60,
        high: 90,
        lowSeverity: 'info',
        highSeverity: 'warning',
        lowMessage: 'Your heart rate of {value} bpm is on the lower side. This could be normal, especially if you\'re physically fit or taking certain medications.',
        highMessage: 'Your heart rate of {value} bpm is elevated. This could be due to stress, caffeine, or physical activity. Monitor this if it persists.',
        normalMessage: 'Your heart rate of {value} bpm is within the normal range. This indicates good cardiovascular health.'
      },
      sleepHours: {
        low: 7,
        high: 9,
        lowSeverity: 'warning',
        highSeverity: 'info',
        lowMessage: 'You slept only {value} hours, which is less than the recommended amount. Lack of sleep can affect your cognitive function and immune system.',
        highMessage: 'You slept {value} hours, which is on the higher end. While sleep is important, excessive sleep may indicate other health issues.',
        normalMessage: 'You slept {value} hours, which is within the recommended range. Good quality sleep is essential for overall health.'
      },
      bloodOxygen: {
        low: 95,
        high: 100,
        lowSeverity: 'critical',
        highSeverity: 'info',
        lowMessage: 'Your blood oxygen level is {value}%, which is below the normal range. This could indicate respiratory issues and should be monitored.',
        highMessage: 'Your blood oxygen level is {value}%, which is excellent. This indicates optimal oxygen saturation in your blood.',
        normalMessage: 'Your blood oxygen level is {value}%, which is within the normal range. This indicates good respiratory function.'
      }
    };
    
    // Generate insights based on thresholds
    const insights = [];
    
    // Analyze steps
    const stepsInsight = classifyHealthMetric('steps', healthData.steps, thresholds.steps);
    insights.push({
      type: 'Steps',
      message: stepsInsight.message,
      severity: stepsInsight.severity
    });
    
    // Analyze heart rate
    const heartRateInsight = classifyHealthMetric('heartRate', healthData.heartRate, thresholds.heartRate);
    insights.push({
      type: 'Heart Rate',
      message: heartRateInsight.message,
      severity: heartRateInsight.severity
    });
    
    // Analyze sleep
    const sleepInsight = classifyHealthMetric('sleepHours', healthData.sleepHours, thresholds.sleepHours);
    insights.push({
      type: 'Sleep',
      message: sleepInsight.message,
      severity: sleepInsight.severity
    });
    
    // Analyze blood oxygen
    const oxygenInsight = classifyHealthMetric('bloodOxygen', healthData.bloodOxygen, thresholds.bloodOxygen);
    insights.push({
      type: 'Blood Oxygen',
      message: oxygenInsight.message,
      severity: oxygenInsight.severity
    });
    
    // Get personalized advice using our AI model simulation
    const personalizedAdvice = getPersonalizedAdvice(healthData, userProfile);
    
    // Add personalized recommendation
    insights.push({
      type: 'AI Health Coach',
      message: 'Based on your health data analysis, here are some personalized recommendations to improve your wellbeing:',
      severity: 'info',
      recommendations: personalizedAdvice
    });

    // If we detect any critical metrics, add an urgent advice
    const hasCritical = insights.some(insight => insight.severity === 'critical');
    if (hasCritical) {
      insights.push({
        type: 'Urgent Health Alert',
        message: 'We\'ve detected some concerning health metrics that require immediate attention. Please consider consulting a healthcare professional as soon as possible.',
        severity: 'critical'
      });
    }

    return new Response(
      JSON.stringify({
        insights,
        timestamp: new Date().toISOString(),
        aiVersion: 'Health Analytics v1.2'
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error generating health insights:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while analyzing health data.",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
