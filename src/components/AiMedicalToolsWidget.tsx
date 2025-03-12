
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
  Heart
} from "lucide-react";

// Define types for our AI tools
interface AiTool {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}

const AiMedicalToolsWidget = ({ className }: { className?: string }) => {
  // Define the available AI tools
  const aiTools: AiTool[] = [
    {
      id: 'chat',
      title: 'Medical Chatbot',
      description: 'Get answers to your medical questions instantly',
      icon: <MessageCircle className="h-8 w-8 text-green-500" />,
      path: '/chat',
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
    }
  ];

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
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {aiTools.map((tool) => (
            <Link key={tool.id} to={tool.path} className="block">
              <Card className="h-full hover:shadow-md transition-all hover:bg-muted border-none">
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
