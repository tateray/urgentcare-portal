
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Image,
  MessageCircle,
  Calculator,
  Search,
  Microscope,
  Sparkles,
  Heart,
  Calendar,
  Clock,
  Watch,
  Phone,
  Pill,
  ActivitySquare
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Define types for our AI tools
interface AiTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  isNew?: boolean;
  isPopular?: boolean;
}

const AiMedicalToolsWidget = ({ className }: { className?: string }) => {
  const { toast } = useToast();

  // Define the available AI tools
  const aiTools: AiTool[] = [
    {
      id: 'chat',
      title: 'Medical Chatbot',
      description: 'Get answers to your medical questions instantly',
      icon: <MessageCircle className="h-8 w-8 text-green-500" />,
      path: '/chat',
      isPopular: true
    },
    {
      id: 'wearables',
      title: 'Health Wearables',
      description: 'Connect devices & get AI health insights',
      icon: <Watch className="h-8 w-8 text-cyan-500" />,
      path: '/wearables',
      isNew: true,
      isPopular: true
    },
    {
      id: 'image',
      title: 'Symptom Scanner',
      description: 'Upload images for AI-powered medical interpretation',
      icon: <Image className="h-8 w-8 text-blue-500" />,
      path: '/ai-features?feature=image',
    },
    {
      id: 'risk',
      title: 'Health Risk Assessment',
      description: 'Get an AI assessment of potential health risks',
      icon: <Calculator className="h-8 w-8 text-red-500" />,
      path: '/ai-features?feature=risk',
    },
    {
      id: 'search',
      title: 'Smart Medical Search',
      description: 'Find hospitals and health information with AI',
      icon: <Search className="h-8 w-8 text-amber-500" />,
      path: '/ai-features?feature=search',
    },
    {
      id: 'recommendations',
      title: 'Personalized Care',
      description: 'AI-generated health recommendations',
      icon: <Heart className="h-8 w-8 text-pink-500" />,
      path: '/ai-features?feature=recommendations',
    },
    {
      id: 'analytics',
      title: 'Health Analytics',
      description: 'Predictive analytics for your health data',
      icon: <Microscope className="h-8 w-8 text-purple-500" />,
      path: '/ai-features?feature=analytics',
    },
    {
      id: 'appointments',
      title: 'Smart Scheduling',
      description: 'AI-powered appointment scheduling system',
      icon: <Calendar className="h-8 w-8 text-indigo-500" />,
      path: '/ai-features?feature=appointments',
    },
    {
      id: 'queue',
      title: 'Queue Management',
      description: 'Real-time updates on wait times',
      icon: <Clock className="h-8 w-8 text-indigo-500" />,
      path: '/queue',
    },
    {
      id: 'teleconsult',
      title: 'Virtual Doctor',
      description: 'AI-assisted telehealth consultations',
      icon: <Phone className="h-8 w-8 text-emerald-500" />,
      path: '/ai-features',
      isNew: true
    },
    {
      id: 'medication',
      title: 'Medication Assistant',
      description: 'AI reminders and drug interaction checks',
      icon: <Pill className="h-8 w-8 text-orange-500" />,
      path: '/ai-features',
    },
    {
      id: 'activity',
      title: 'Fitness Planner',
      description: 'AI-generated exercise plans based on health',
      icon: <ActivitySquare className="h-8 w-8 text-teal-500" />,
      path: '/ai-features',
      isNew: true
    }
  ];

  // Get popular tools
  const popularTools = aiTools.filter(tool => tool.isPopular);
  
  // Get the rest of the tools
  const otherTools = aiTools.filter(tool => !tool.isPopular);

  const handleToolClick = async (tool: AiTool) => {
    // Track user interaction with AI tools
    try {
      const { data: userData } = await supabase.auth.getUser();
      
      if (userData?.user) {
        // Log tool usage in chat messages instead
        await supabase.from('ai_chat_messages').insert({
          user_id: userData.user.id,
          message: `Accessed ${tool.title} tool`,
          response: `Tool interaction recorded: ${tool.id}`
        }).select();
      }
    } catch (error) {
      console.error("Error tracking AI tool interaction:", error);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-xl">
          <Brain className="h-5 w-5 mr-2 text-purple-500" />
          AI Medical Tools
        </CardTitle>
        <CardDescription>
          Advanced AI-powered tools to help with your healthcare needs
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Featured section for popular tools */}
        {popularTools.length > 0 && (
          <>
            <h3 className="text-sm font-medium mb-3">Featured Tools</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {popularTools.map((tool) => (
                <Link 
                  key={tool.id} 
                  to={tool.path} 
                  className="block"
                  onClick={() => handleToolClick(tool)}
                >
                  <Card className="h-full hover:shadow-md transition-all hover:bg-muted border-none relative">
                    {tool.isNew && (
                      <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                    <CardContent className="p-4 flex items-center">
                      <div className="mr-4 flex-shrink-0">
                        {tool.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-base mb-1">{tool.title}</h3>
                        <p className="text-xs text-muted-foreground leading-tight">
                          {tool.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
        
        {/* Grid of all other tools */}
        <h3 className="text-sm font-medium mb-3">All Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {otherTools.map((tool) => (
            <Link 
              key={tool.id} 
              to={tool.path} 
              className="block"
              onClick={() => handleToolClick(tool)}
            >
              <Card className="h-full hover:shadow-md transition-all hover:bg-muted border-none relative">
                {tool.isNew && (
                  <span className="absolute top-1 right-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className="mb-3 mt-2">
                    {tool.icon}
                  </div>
                  <h3 className="font-medium text-sm mb-1">{tool.title}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <Link to="/ai-features">
            <Button variant="outline" className="w-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Explore All AI Features
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiMedicalToolsWidget;
