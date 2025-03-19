
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to analyze blood pressure readings
function analyzeBP(systolic: number, diastolic: number, age: number, hasConditions: boolean) {
  let category = "";
  let advice = "";
  let severity = "normal";
  
  // Blood pressure classification based on American Heart Association guidelines
  if (systolic < 90 || diastolic < 60) {
    category = "Low Blood Pressure (Hypotension)";
    severity = "warning";
    advice = "You may experience dizziness, fainting, or fatigue. If symptomatic, consult with a healthcare provider.";
    
    if (hasConditions) {
      advice += " Since you have existing medical conditions, monitor your symptoms closely and consider scheduling a check-up.";
    }
  } 
  else if (systolic < 120 && diastolic < 80) {
    category = "Normal Blood Pressure";
    severity = "normal";
    advice = "Your blood pressure is in a healthy range. Continue with healthy lifestyle habits including regular exercise and a balanced diet.";
  } 
  else if (systolic < 130 && diastolic < 80) {
    category = "Elevated Blood Pressure";
    severity = "info";
    advice = "Your blood pressure is slightly above normal. Consider lifestyle changes such as reducing sodium intake and increasing physical activity.";
    
    if (age > 60) {
      advice += " For your age group, monitoring this level is important as elevated blood pressure increases risk of developing hypertension.";
    }
  } 
  else if ((systolic >= 130 && systolic < 140) || (diastolic >= 80 && diastolic < 90)) {
    category = "Stage 1 Hypertension";
    severity = "warning";
    advice = "Lifestyle changes are recommended, and medication may be prescribed based on your overall cardiovascular risk. Consult with a healthcare provider.";
    
    if (hasConditions) {
      advice += " With your existing health conditions, medication might be more likely to be recommended. Please consult your doctor.";
    }
  } 
  else if ((systolic >= 140 && systolic < 180) || (diastolic >= 90 && diastolic < 120)) {
    category = "Stage 2 Hypertension";
    severity = "error";
    advice = "Lifestyle changes and medication are typically recommended. Please consult with a healthcare provider as soon as possible.";
  } 
  else {
    category = "Hypertensive Crisis";
    severity = "critical";
    advice = "Seek immediate medical attention if you're also experiencing symptoms such as chest pain, shortness of breath, back pain, numbness, or a change in vision.";
  }
  
  return {
    category,
    advice,
    severity
  };
}

// Function to provide personalized recommendations based on blood pressure and user profile
function getRecommendations(systolic: number, diastolic: number, userProfile: any) {
  const recommendations = [];
  
  // Dietary recommendations
  if (systolic > 120 || diastolic > 80) {
    recommendations.push({
      type: "diet",
      title: "DASH Diet Recommendation",
      description: "Consider following the DASH (Dietary Approaches to Stop Hypertension) diet, which is rich in fruits, vegetables, whole grains, and low-fat dairy, while limiting sodium, saturated fats, and added sugars."
    });
    
    recommendations.push({
      type: "diet",
      title: "Sodium Intake",
      description: "Limit sodium intake to less than 2,300 mg per day (about 1 teaspoon of salt). Aim for 1,500 mg if you already have high blood pressure."
    });
  }
  
  // Exercise recommendations
  if (systolic > 120 || diastolic > 80) {
    let exerciseIntensity = "moderate";
    if (systolic > 140 || diastolic > 90) {
      exerciseIntensity = "light to moderate";
    }
    
    recommendations.push({
      type: "activity",
      title: "Physical Activity",
      description: `Aim for at least 150 minutes of ${exerciseIntensity} aerobic activity per week, such as brisk walking, swimming, or cycling. Spread this out over at least 3 days.`
    });
  }
  
  // Lifestyle recommendations
  recommendations.push({
    type: "lifestyle",
    title: "Stress Management",
    description: "Practice stress-reduction techniques such as deep breathing, meditation, or yoga, as stress can temporarily elevate blood pressure."
  });
  
  if (userProfile.smoker) {
    recommendations.push({
      type: "lifestyle",
      title: "Smoking Cessation",
      description: "Quit smoking to improve your overall cardiovascular health and help lower your blood pressure."
    });
  }
  
  if (userProfile.alcohol) {
    recommendations.push({
      type: "lifestyle",
      title: "Alcohol Moderation",
      description: "Limit alcohol consumption to no more than one drink per day for women and two drinks per day for men."
    });
  }
  
  // Monitoring recommendations
  let monitoringFrequency = "weekly";
  if (systolic >= 140 || diastolic >= 90) {
    monitoringFrequency = "daily";
  }
  
  recommendations.push({
    type: "monitoring",
    title: "Regular Monitoring",
    description: `Monitor your blood pressure ${monitoringFrequency} and keep a log to share with your healthcare provider.`
  });
  
  return recommendations;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { systolic, diastolic, userId, userProfile } = await req.json();
    
    if (!systolic || !diastolic) {
      throw new Error('Missing required blood pressure values');
    }
    
    // Default user profile if not provided
    const profile = userProfile || {
      age: 40,
      hasConditions: false,
      smoker: false,
      alcohol: false
    };
    
    // Analyze blood pressure
    const analysis = analyzeBP(
      systolic, 
      diastolic, 
      profile.age, 
      profile.hasConditions
    );
    
    // Get personalized recommendations
    const recommendations = getRecommendations(
      systolic, 
      diastolic, 
      profile
    );
    
    // Prepare response
    const response = {
      timestamp: new Date().toISOString(),
      bloodPressure: {
        systolic,
        diastolic,
        reading: `${systolic}/${diastolic} mmHg`
      },
      analysis,
      recommendations,
    };

    // Store in database if userId is provided
    if (userId) {
      // This would typically connect to your database to store the reading
      console.log(`Storing blood pressure reading for user ${userId}: ${systolic}/${diastolic} mmHg`);
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error in health-metrics-analysis function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while analyzing health metrics",
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
