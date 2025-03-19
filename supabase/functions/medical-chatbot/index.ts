
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Medical services available in the system
const availableServices = [
  {
    id: 'image-analysis',
    name: 'Symptom Image Analysis',
    description: 'Upload images of symptoms for AI-powered analysis and recommendations',
    path: '/ai-features?feature=image'
  },
  {
    id: 'medical-assistant',
    name: 'AI Medical Assistant',
    description: 'Get detailed medical information, explanations, and guidance on health topics',
    path: '/ai-features?feature=search'
  },
  {
    id: 'personalized-care',
    name: 'Personalized Care Recommendations',
    description: 'Receive tailored health recommendations based on your medical profile',
    path: '/ai-features?feature=recommendations'
  },
  {
    id: 'risk-assessment',
    name: 'Health Risk Assessment',
    description: 'Evaluate your health risks with our comprehensive assessment tool',
    path: '/ai-features?feature=risk' 
  },
  {
    id: 'fitness-planner',
    name: 'Fitness Planner',
    description: 'Get customized workout plans and fitness advice aligned with your health goals',
    path: '/ai-features?feature=analytics'
  }
];

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

// Recommend relevant services based on keywords in the conversation
const recommendServices = (message: string) => {
  const lowercaseMsg = message.toLowerCase();
  const recommendations: string[] = [];

  // Keywords to service id mapping
  const keywordMap: Record<string, string[]> = {
    'image': ['image-analysis'],
    'photo': ['image-analysis'],
    'picture': ['image-analysis'],
    'upload': ['image-analysis'],
    'scan': ['image-analysis'],
    'symptom': ['image-analysis', 'medical-assistant'],
    'diagnose': ['medical-assistant', 'risk-assessment'],
    'explain': ['medical-assistant'],
    'information': ['medical-assistant'],
    'recommendations': ['personalized-care'],
    'suggest': ['personalized-care'],
    'personal': ['personalized-care'],
    'tailor': ['personalized-care'],
    'risk': ['risk-assessment'],
    'assessment': ['risk-assessment'],
    'evaluate': ['risk-assessment'],
    'fitness': ['fitness-planner'],
    'exercise': ['fitness-planner'],
    'workout': ['fitness-planner'],
    'training': ['fitness-planner'],
    'hospital': ['personalized-care'],
    'doctor': ['personalized-care', 'medical-assistant']
  };

  // Check for keywords and add corresponding service IDs
  Object.entries(keywordMap).forEach(([keyword, serviceIds]) => {
    if (lowercaseMsg.includes(keyword)) {
      serviceIds.forEach(id => {
        if (!recommendations.includes(id)) {
          recommendations.push(id);
        }
      });
    }
  });

  // If no specific services were identified, recommend general services
  if (recommendations.length === 0) {
    recommendations.push('medical-assistant');
    
    // Add a random second recommendation for variety
    const otherServices = ['personalized-care', 'risk-assessment', 'fitness-planner'];
    const randomService = otherServices[Math.floor(Math.random() * otherServices.length)];
    recommendations.push(randomService);
  }

  // Limit to maximum 3 recommendations
  return recommendations.slice(0, 3).map(id => 
    availableServices.find(service => service.id === id)
  ).filter(Boolean);
};

// Generate medical responses based on query and context
const generateMedicalResponse = (message: string, context: string) => {
  // Simple pattern matching for common medical queries
  const lowercaseMsg = message.toLowerCase();
  
  // Get a relevant introduction based on the query type
  let response = "";
  
  if (lowercaseMsg.includes('headache') || lowercaseMsg.includes('pain')) {
    response = "Based on your description of pain, I recommend monitoring your symptoms and staying hydrated. If the pain persists or worsens, please consult a healthcare provider.";
  } else if (lowercaseMsg.includes('fever') || lowercaseMsg.includes('temperature')) {
    response = "Fever can be a sign your body is fighting an infection. Rest, stay hydrated, and consider over-the-counter fever reducers if appropriate. If the fever is high or persists, seek medical attention.";
  } else if (lowercaseMsg.includes('cough') || lowercaseMsg.includes('cold') || lowercaseMsg.includes('flu')) {
    response = "For respiratory symptoms, rest and fluids are important. Over-the-counter medications may help manage symptoms. Monitor for worsening signs like difficulty breathing or high fever.";
  } else if (lowercaseMsg.includes('diet') || lowercaseMsg.includes('nutrition') || lowercaseMsg.includes('eating')) {
    response = "A balanced diet rich in fruits, vegetables, whole grains, and lean proteins supports good health. Consider consulting with a nutritionist for personalized dietary advice.";
  } else if (lowercaseMsg.includes('exercise') || lowercaseMsg.includes('workout') || lowercaseMsg.includes('fitness')) {
    response = "Regular physical activity is beneficial for both physical and mental health. Start with modest goals and gradually increase intensity. Aim for at least 150 minutes of moderate exercise weekly.";
  } else if (lowercaseMsg.includes('sleep') || lowercaseMsg.includes('insomnia') || lowercaseMsg.includes('tired')) {
    response = "Quality sleep is essential for health. Aim for 7-9 hours nightly, maintain a regular sleep schedule, and create a relaxing bedtime routine. If sleep problems persist, consult a healthcare provider.";
  } else if (lowercaseMsg.includes('stress') || lowercaseMsg.includes('anxiety') || lowercaseMsg.includes('depression')) {
    response = "Mental health is as important as physical health. Consider stress management techniques like meditation, deep breathing, or physical activity. If feelings of anxiety or depression are significant, please speak with a healthcare professional.";
  } else if (lowercaseMsg.includes('pregnancy') || lowercaseMsg.includes('pregnant')) {
    response = "Prenatal care is essential during pregnancy. Regular checkups, a balanced diet, prenatal vitamins, and avoiding harmful substances are important. Consult your healthcare provider for personalized guidance.";
  } else if (lowercaseMsg.includes('vaccine') || lowercaseMsg.includes('vaccination') || lowercaseMsg.includes('immunization')) {
    response = "Vaccines are crucial for preventing many serious diseases. Follow recommended vaccination schedules and consult with your healthcare provider about which vaccines are appropriate for you.";
  } else if (lowercaseMsg.includes('medicine') || lowercaseMsg.includes('medication') || lowercaseMsg.includes('drug')) {
    response = "Always take medications as prescribed by your healthcare provider. Be aware of potential side effects and interactions with other medications. If you have concerns, consult your healthcare provider or pharmacist.";
  } else {
    response = "I understand you're asking about your health. While I can provide general information, it's always best to consult with a healthcare professional for personalized medical advice.";
  }
  
  return {
    mainResponse: response,
    followUp: "Would you like more information about this topic, or do you have another health question I can help with?"
  };
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversation } = await req.json();
    
    console.log("Processing medical request with message:", message);
    
    // Generate response locally
    const aiResponse = generateMedicalResponse(message, conversation);
    
    // Assess health risk based on full conversation
    const risk = assessHealthRisk(conversation);
    
    // Get service recommendations based on the message
    const recommendedServices = recommendServices(message);
    
    return new Response(
      JSON.stringify({
        mainResponse: aiResponse.mainResponse,
        followUp: aiResponse.followUp,
        risk: risk,
        recommendedServices: recommendedServices
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
