
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { healthData, userId } = await req.json();
    
    if (!healthData) {
      throw new Error('No health data provided');
    }
    
    // In a real app, you would use more sophisticated AI analysis
    // For now, we'll use rules-based analysis
    const insights = [];
    
    // Analyze steps
    if (healthData.steps < 5000) {
      insights.push({
        type: 'Steps',
        message: `You've taken ${healthData.steps} steps today. Try to reach 10,000 steps for optimal health benefits. Consider taking a short walk during lunch or after dinner.`,
        severity: 'info'
      });
    } else if (healthData.steps >= 10000) {
      insights.push({
        type: 'Steps',
        message: `Excellent! You've taken ${healthData.steps} steps today, exceeding the recommended 10,000 steps. Keep up the good work!`,
        severity: 'info'
      });
    } else {
      insights.push({
        type: 'Steps',
        message: `You're on your way with ${healthData.steps} steps today. Try to reach 10,000 steps for optimal health benefits.`,
        severity: 'info'
      });
    }
    
    // Analyze heart rate
    if (healthData.heartRate > 100) {
      insights.push({
        type: 'Heart Rate',
        message: `Your heart rate (${healthData.heartRate} bpm) is elevated. This could be due to exercise, stress, or caffeine. If persistently high at rest, consider consulting a healthcare provider.`,
        severity: 'warning'
      });
    } else if (healthData.heartRate < 50) {
      insights.push({
        type: 'Heart Rate',
        message: `Your heart rate (${healthData.heartRate} bpm) is lower than average. For athletes, this may be normal. If you're experiencing dizziness or fatigue, consult a healthcare provider.`,
        severity: 'warning'
      });
    } else {
      insights.push({
        type: 'Heart Rate',
        message: `Your heart rate (${healthData.heartRate} bpm) is within a healthy range. Great job maintaining cardiovascular health!`,
        severity: 'info'
      });
    }
    
    // Analyze sleep
    if (healthData.sleepHours < 7) {
      insights.push({
        type: 'Sleep',
        message: `You slept ${healthData.sleepHours} hours last night. Most adults need 7-9 hours for optimal health. Consider setting a consistent sleep schedule and limiting screen time before bed.`,
        severity: 'warning'
      });
    } else {
      insights.push({
        type: 'Sleep',
        message: `You slept ${healthData.sleepHours} hours last night, which is within the recommended range. Good quality sleep is essential for overall health and immune function.`,
        severity: 'info'
      });
    }
    
    // Analyze blood oxygen
    if (healthData.bloodOxygen < 95) {
      insights.push({
        type: 'Blood Oxygen',
        message: `Your blood oxygen level is ${healthData.bloodOxygen}%. This is lower than the normal range (95-100%). If you're experiencing shortness of breath or fatigue, please consult a healthcare professional.`,
        severity: 'critical'
      });
    } else {
      insights.push({
        type: 'Blood Oxygen',
        message: `Your blood oxygen level is ${healthData.bloodOxygen}%, which is within the normal range. This indicates good respiratory function.`,
        severity: 'info'
      });
    }
    
    // Personalized weekly recommendation
    let recommendation = "Based on your overall health data, we recommend focusing on ";
    
    if (healthData.steps < 5000) {
      recommendation += "increasing your daily physical activity. ";
    } else if (healthData.sleepHours < 7) {
      recommendation += "improving your sleep quality and duration. ";
    } else if (healthData.heartRate > 90) {
      recommendation += "stress management and relaxation techniques. ";
    } else {
      recommendation += "maintaining your excellent health habits. ";
    }
    
    recommendation += "Small, consistent changes can lead to significant health improvements over time.";
    
    insights.push({
      type: 'Weekly Recommendation',
      message: recommendation,
      severity: 'info'
    });

    return new Response(
      JSON.stringify({
        insights,
        timestamp: new Date().toISOString()
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
