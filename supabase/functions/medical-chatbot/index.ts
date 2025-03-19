
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    
    // Call the Poe.com/EMSvcbot through a proxy
    // Since direct API access might be restricted, we'll redirect to the bot URL
    // In a real implementation, you would use the official Poe API if available
    const poeUrl = "https://poe.com/EMSvcbot";
    
    console.log("Attempting to connect to Poe EMSvcbot with message:", message);
    
    // Since we cannot directly call the Poe API from here (it requires authentication),
    // we'll provide a response that guides users to the Poe bot
    
    // For now, we'll generate a response locally with a reference to Poe
    const aiResponse = {
      mainResponse: `I'm analyzing your message: "${message}". For a complete response, you can also chat directly with our medical bot at ${poeUrl}`,
      followUp: "Is there anything specific about your symptoms that you'd like me to explain further?"
    };
    
    // Assess health risk based on full conversation
    const risk = assessHealthRisk(conversation);
    
    return new Response(
      JSON.stringify({
        mainResponse: aiResponse.mainResponse,
        followUp: aiResponse.followUp,
        risk: risk,
        poeUrl: poeUrl // Include the Poe URL in the response
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
