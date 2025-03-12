
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple AI-driven responses for common medical questions
const medicalResponses = [
  {
    keywords: ["headache", "head", "pain", "migraine"],
    response: "Your headache could be due to stress, dehydration, or eye strain. If it's severe or persistent, please consult a healthcare professional. Would you like me to help you find a nearby hospital?",
    followUp: "Have you taken any medication for your headache?"
  },
  {
    keywords: ["fever", "temperature", "hot", "chills"],
    response: "A fever is often a sign that your body is fighting an infection. It's important to stay hydrated and rest. If your temperature exceeds 39°C (102°F) or persists for more than two days, please seek medical attention.",
    followUp: "Are you experiencing any other symptoms alongside the fever?"
  },
  {
    keywords: ["cough", "chest", "breathing", "breath"],
    response: "Coughing can be caused by various conditions ranging from a common cold to more serious respiratory infections. If you're experiencing difficulty breathing, chest pain, or coughing up blood, please seek immediate medical attention.",
    followUp: "Is your cough dry or is it producing phlegm?"
  },
  {
    keywords: ["appointment", "book", "schedule", "doctor"],
    response: "I can help you schedule an appointment with a healthcare provider. Would you like me to show you available appointment slots?",
    followUp: "Do you have a specific doctor or specialty in mind?"
  },
  {
    keywords: ["emergency", "urgent", "severe", "help"],
    response: "If you're experiencing a medical emergency, please call 999 immediately or go to your nearest emergency room. Don't wait for an online response in critical situations.",
    followUp: "Is someone with you who can help or transport you to an emergency facility?"
  }
];

// Default fallback responses
const fallbackResponses = [
  "I understand your concern. While I can provide general information, it's important to consult with a healthcare professional for personalized advice.",
  "Based on what you've shared, this could be several things. It would be best to have this evaluated by a doctor, especially if the symptoms persist.",
  "Make sure to stay hydrated and get plenty of rest. These general recommendations can help with many common illnesses.",
  "If you're experiencing severe symptoms like difficulty breathing, chest pain, or severe headache, please seek emergency medical attention immediately.",
  "It's important to take all medications as prescribed by your doctor, even if you start feeling better before finishing the course."
];

// Function to analyze user input and generate intelligent response
const analyzeInput = (input: string) => {
  // Convert input to lowercase for easier matching
  const lowercaseInput = input.toLowerCase();
  
  // Check if input matches any of our trained responses
  for (const item of medicalResponses) {
    if (item.keywords.some(keyword => lowercaseInput.includes(keyword))) {
      return {
        mainResponse: item.response,
        followUp: item.followUp
      };
    }
  }
  
  // If no match, return a random fallback response
  const randomIndex = Math.floor(Math.random() * fallbackResponses.length);
  return {
    mainResponse: fallbackResponses[randomIndex],
    followUp: "Is there anything specific about your symptoms that you'd like to share?"
  };
};

// Health risk assessment based on keywords
const assessHealthRisk = (conversation: string) => {
  const lowercaseConvo = conversation.toLowerCase();
  
  // Check for emergency keywords
  const emergencyKeywords = ['cannot breathe', 'chest pain', 'unconscious', 'severe bleeding', 'stroke', 'heart attack'];
  const hasEmergency = emergencyKeywords.some(keyword => lowercaseConvo.includes(keyword));
  
  if (hasEmergency) {
    return {
      level: 'high',
      message: 'Your symptoms suggest a possible medical emergency. Please call emergency services (999) immediately.'
    };
  }
  
  // Check for urgent care keywords
  const urgentKeywords = ['high fever', 'continuous vomiting', 'severe pain', 'dehydration'];
  const needsUrgentCare = urgentKeywords.some(keyword => lowercaseConvo.includes(keyword));
  
  if (needsUrgentCare) {
    return {
      level: 'medium',
      message: 'Your symptoms may require urgent medical attention. Consider visiting an urgent care facility soon.'
    };
  }
  
  return {
    level: 'low',
    message: 'Based on the information provided, your symptoms suggest routine care. Monitor your condition and consult a healthcare provider if symptoms worsen.'
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversation } = await req.json();
    
    // Get AI response based on user message
    const aiResponse = analyzeInput(message);
    
    // Assess health risk based on full conversation
    const risk = assessHealthRisk(conversation);
    
    // Save conversation to database could be done here
    // Track engagement and common queries
    
    return new Response(
      JSON.stringify({
        mainResponse: aiResponse.mainResponse,
        followUp: aiResponse.followUp,
        risk: risk
      }),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error processing medical chatbot request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your request.",
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
