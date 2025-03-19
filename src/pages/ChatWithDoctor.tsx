
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Phone, User, Bot, Paperclip, AlertCircle, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface RiskAssessment {
  level: 'low' | 'medium' | 'high';
  message: string;
}

interface ServiceRecommendation {
  id: string;
  name: string;
  description: string;
  path: string;
}

const ASSISTANT_PERSONAS = {
  general: {
    name: "Dr. AI Health Assistant",
    greeting: "Hello! I'm your personal health assistant. How can I help you today?",
    color: "bg-primary"
  },
  imageAnalysis: {
    name: "Dr. Vision",
    greeting: "Hello! I'm Dr. Vision. I can analyze images of symptoms to help identify potential health issues. Upload an image or describe what you're seeing.",
    color: "bg-purple-500"
  },
  medicalAssistant: {
    name: "Dr. MedInfo",
    greeting: "Hello! I'm Dr. MedInfo. I can provide detailed medical information, explanations about conditions, and answer health-related questions.",
    color: "bg-blue-500"
  },
  personalizedCare: {
    name: "Dr. Care",
    greeting: "Hello! I'm Dr. Care. I provide personalized health recommendations based on your profile and health goals. How can I assist you today?",
    color: "bg-green-500"
  },
  fitnessPlanner: {
    name: "Dr. Fit",
    greeting: "Hello! I'm Dr. Fit. I can help create fitness plans tailored to your health status and goals. What fitness goals are you working towards?",
    color: "bg-orange-500"
  },
  riskAssessment: {
    name: "Dr. Assess",
    greeting: "Hello! I'm Dr. Assess. I can help evaluate your health risks based on symptoms and health history. What would you like me to assess?",
    color: "bg-red-500"
  }
};

const ChatWithDoctor = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [persona, setPersona] = useState<keyof typeof ASSISTANT_PERSONAS>("general");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: ASSISTANT_PERSONAS[persona].greeting,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<string[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [serviceRecommendations, setServiceRecommendations] = useState<ServiceRecommendation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Update greeting when persona changes
  useEffect(() => {
    setMessages([
      {
        id: 1,
        text: ASSISTANT_PERSONAS[persona].greeting,
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setConversationHistory([]);
    setRiskAssessment(null);
    setServiceRecommendations([]);
  }, [persona]);
  
  const saveMessageToDatabase = async (message: string, response: string) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        await supabase.from('ai_chat_messages').insert({
          user_id: userData.user.id,
          message,
          response
        });
      }
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  };
  
  const handleSendMessage = async () => {
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
    const updatedHistory = [...conversationHistory, input];
    setConversationHistory(updatedHistory);
    
    setInput("");
    setIsTyping(true);
    
    try {
      // Call the medical chatbot edge function
      const { data, error } = await supabase.functions.invoke('medical-chatbot', {
        body: {
          message: input,
          conversation: updatedHistory.join(' ')
        }
      });
      
      if (error) throw error;
      
      // Add main response from chatbot
      const botResponse: Message = {
        id: Date.now() + 1,
        text: data.mainResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, botResponse]);
      
      // Save message and response to database
      await saveMessageToDatabase(input, data.mainResponse);
      
      // Set risk assessment if provided
      if (data.risk) {
        setRiskAssessment(data.risk);
        
        // Show toast for medium/high risk
        if (data.risk.level !== 'low') {
          toast({
            title: "Health Risk Assessment",
            description: data.risk.message,
            variant: data.risk.level === 'high' ? 'destructive' : 'default',
          });
        }
      }
      
      // Set service recommendations if provided
      if (data.recommendedServices && data.recommendedServices.length > 0) {
        setServiceRecommendations(data.recommendedServices);
      }
      
      // After a short delay, add follow-up question
      setTimeout(() => {
        const followUpResponse: Message = {
          id: Date.now() + 2,
          text: data.followUp,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prevMessages => [...prevMessages, followUpResponse]);
        setIsTyping(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error from chatbot:", error);
      setIsTyping(false);
      
      // Add error message from bot
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble processing your request. Please try again later.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant",
        variant: "destructive",
      });
    }
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
  
  const handleSwitchPersona = (newPersona: keyof typeof ASSISTANT_PERSONAS) => {
    if (newPersona !== persona) {
      setPersona(newPersona);
      
      toast({
        title: `Switched to ${ASSISTANT_PERSONAS[newPersona].name}`,
        description: "Your conversation has been reset with a new assistant",
      });
    }
  };
  
  const handleServiceSelect = (path: string) => {
    navigate(path);
  };
  
  return (
    <div className="container mx-auto h-[calc(100vh-2rem)] flex flex-col py-4 px-4">
      <div className="flex items-center mb-4">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{ASSISTANT_PERSONAS[persona].name}</h1>
        
        <div className="ml-auto flex gap-2">
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
      
      {/* Persona selector */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
        <Button 
          variant={persona === "general" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleSwitchPersona("general")}
          className="whitespace-nowrap"
        >
          General Health
        </Button>
        <Button 
          variant={persona === "imageAnalysis" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleSwitchPersona("imageAnalysis")}
          className="whitespace-nowrap"
        >
          Image Analysis
        </Button>
        <Button 
          variant={persona === "medicalAssistant" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleSwitchPersona("medicalAssistant")}
          className="whitespace-nowrap"
        >
          Medical Assistant
        </Button>
        <Button 
          variant={persona === "personalizedCare" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleSwitchPersona("personalizedCare")}
          className="whitespace-nowrap"
        >
          Personalized Care
        </Button>
        <Button 
          variant={persona === "fitnessPlanner" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleSwitchPersona("fitnessPlanner")}
          className="whitespace-nowrap"
        >
          Fitness Planner
        </Button>
        <Button 
          variant={persona === "riskAssessment" ? "default" : "outline"} 
          size="sm"
          onClick={() => handleSwitchPersona("riskAssessment")}
          className="whitespace-nowrap"
        >
          Risk Assessment
        </Button>
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
                    message.sender === 'user' ? 'bg-primary ml-2' : message.sender === 'bot' ? ASSISTANT_PERSONAS[persona].color : 'bg-muted'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-4 w-4 text-primary-foreground" />
                    ) : (
                      <Bot className="h-4 w-4 text-white" />
                    )}
                  </div>
                  
                  <div>
                    <div 
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : message.sender === 'bot' ? `${ASSISTANT_PERSONAS[persona].color} text-white` : 'bg-muted'
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
            
            {/* Service recommendations */}
            {serviceRecommendations.length > 0 && !isTyping && (
              <div className="flex justify-start">
                <div className="max-w-[90%]">
                  <p className="text-sm font-medium mb-2">Recommended services:</p>
                  <div className="flex flex-wrap gap-2">
                    {serviceRecommendations.map((service) => (
                      <Button 
                        key={service.id}
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleServiceSelect(service.path)}
                      >
                        <ExternalLink className="h-3 w-3" />
                        {service.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start max-w-[80%]">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${ASSISTANT_PERSONAS[persona].color}`}>
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  
                  <div className={`rounded-lg px-4 py-2 ${ASSISTANT_PERSONAS[persona].color} text-white`}>
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
                if (persona === "imageAnalysis") {
                  navigate("/ai-features?feature=image");
                } else {
                  toast({
                    title: "Attach Files",
                    description: "Please select a file to upload",
                  });
                }
              }}
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            
            <Input
              placeholder={`Ask ${ASSISTANT_PERSONAS[persona].name.split(' ')[0]} a question...`}
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
