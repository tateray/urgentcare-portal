
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Phone, User, Bot, Paperclip, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Enhanced AI responses with health context
const aiResponses = [
  {
    keywords: ["headache", "head", "pain", "migraine"],
    response: "I understand you're experiencing headaches. This could be due to several factors including stress, dehydration, or eye strain. If it's severe or persistent, please consult a healthcare professional. Would you like me to help you find a nearby hospital?",
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
    keywords: ["medication", "medicine", "pill", "drug"],
    response: "It's important to take medications as prescribed by your healthcare provider. If you're experiencing side effects or have concerns about your medication, consult with your doctor before making any changes to your regimen.",
    followUp: "Are you currently taking any other medications that might interact with this one?"
  },
  {
    keywords: ["hospital", "clinic", "doctor", "appointment"],
    response: "I can help you find nearby healthcare facilities or schedule an appointment. Would you like me to show you hospitals near your location?",
    followUp: "Is there a specific type of medical specialist you need to see?"
  },
  {
    keywords: ["emergency", "urgent", "severe", "critical"],
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
  for (const item of aiResponses) {
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
const assessHealthRisk = (conversation: string[]) => {
  const lowercaseConvo = conversation.join(' ').toLowerCase();
  
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

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatWithDoctor = () => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Dr. AI, your medical assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<{level: string, message: string} | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Update conversation history for analysis
    setConversationHistory(prev => [...prev, input]);
    
    setInput("");
    setIsTyping(true);
    
    // Analyze the user input using AI
    const response = analyzeInput(input);
    
    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: response.mainResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
      
      // Add follow-up after a short delay
      setTimeout(() => {
        const followUpResponse: Message = {
          id: Date.now() + 2,
          text: response.followUp,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, followUpResponse]);
        
        // Assess health risk after a few messages
        if (conversationHistory.length >= 2) {
          const assessment = assessHealthRisk([...conversationHistory, input]);
          setRiskAssessment(assessment);
          
          // Show toast for medium/high risk
          if (assessment.level !== 'low') {
            toast({
              title: "Health Risk Assessment",
              description: assessment.message,
              variant: assessment.level === 'high' ? 'destructive' : 'default',
            });
          }
        }
      }, 2000);
    }, 1500);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="container mx-auto h-[calc(100vh-2rem)] flex flex-col py-4 px-4">
      <div className="flex items-center mb-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">AI Medical Assistant</h1>
        
        <div className="ml-auto">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {
              toast({
                title: "Calling Medical Professional",
                description: "Connecting to a human medical assistant...",
              });
            }}
          >
            <Phone className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {riskAssessment && riskAssessment.level !== 'low' && (
        <div className={`mb-4 p-3 rounded-md flex items-center ${
          riskAssessment.level === 'high' ? 'bg-destructive/15 text-destructive' : 'bg-amber-500/15 text-amber-600'
        }`}>
          <AlertCircle className="h-5 w-5 mr-2" />
          <span>{riskAssessment.message}</span>
        </div>
      )}
      
      <Card className="flex-1 overflow-hidden flex flex-col">
        <CardContent className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map(message => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                    message.sender === 'user' ? 'bg-primary ml-2' : 'bg-muted'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div>
                    <div 
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.text}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%]">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted mr-2">
                    <Bot className="h-4 w-4" />
                  </div>
                  
                  <div className="rounded-lg px-4 py-2 bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-current animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
        
        <div className="p-4 border-t">
          <form 
            className="flex items-center gap-2" 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <Button 
              type="button"
              variant="outline" 
              size="icon"
              onClick={() => {
                toast({
                  title: "Attach Files",
                  description: "Please select a file to upload",
                });
              }}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Input
              placeholder="Describe your symptoms or ask a medical question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1"
            />
            
            <Button 
              type="submit"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
          
          <div className="mt-2 text-xs text-muted-foreground text-center">
            <p>For emergencies, please call 999 or visit your nearest emergency room</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatWithDoctor;
