
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, History, MessageCircle, Ambulance, Heart, Bell, User, Settings, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const EmergencyButton = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <Button 
    variant="destructive" 
    className="flex flex-col items-center justify-center h-24 w-full gap-2 transition-all hover:scale-105"
    onClick={onClick}
  >
    {icon}
    <span>{label}</span>
  </Button>
);

const QuickAccessCard = ({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) => (
  <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-105" onClick={onClick}>
    <CardContent className="p-6 flex flex-col items-center justify-center">
      {icon}
      <p className="mt-2 text-center font-medium">{label}</p>
    </CardContent>
  </Card>
);

const Index = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Apply dark mode class to document
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: darkMode ? "Light Mode Activated" : "Dark Mode Activated",
      description: "Your display preferences have been updated",
    });
  };

  const handleEmergencyCall = () => {
    toast({
      title: "Initiating Emergency Call",
      description: "Connecting to emergency services...",
      variant: "destructive",
    });
    // In a real app, this would trigger the phone call
    setTimeout(() => {
      window.location.href = "tel:911";
    }, 1000);
  };

  const handleFindHospital = () => {
    toast({
      title: "Finding Nearby Hospitals",
      description: "Loading hospital locations...",
    });
    // This would navigate to the hospital locator page in a real app
  };

  const handleMedicalHistory = () => {
    toast({
      title: "Accessing Medical Records",
      description: "Loading your medical history...",
    });
    // This would navigate to the medical history page in a real app
  };

  const handleAmbulance = () => {
    toast({
      title: "Ambulance Request",
      description: "Connecting to ambulance services...",
      variant: "destructive",
    });
    // This would navigate to the ambulance booking page in a real app
  };

  const handleChatWithDoctor = () => {
    toast({
      title: "Medical Assistant",
      description: "Connecting to a medical professional...",
    });
    // This would navigate to the chat page in a real app
  };

  return (
    <div className={`min-h-screen bg-background text-foreground`}>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b border-border py-4 px-6 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <Heart className="text-destructive h-6 w-6" />
          <h1 className="text-xl font-bold">Emergency Medical Assistance</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* Emergency Actions */}
        <section className="mb-8">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Emergency Services
              </CardTitle>
              <CardDescription>
                Quick access to critical emergency services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <EmergencyButton 
                  icon={<Phone className="h-8 w-8" />} 
                  label="Emergency Call" 
                  onClick={handleEmergencyCall} 
                />
                <EmergencyButton 
                  icon={<Ambulance className="h-8 w-8" />} 
                  label="Book Ambulance" 
                  onClick={handleAmbulance} 
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Quick Access Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <QuickAccessCard 
              icon={<MapPin className="h-8 w-8 text-primary" />} 
              label="Find Hospital" 
              onClick={handleFindHospital} 
            />
            <QuickAccessCard 
              icon={<History className="h-8 w-8 text-primary" />} 
              label="Medical History" 
              onClick={handleMedicalHistory} 
            />
            <QuickAccessCard 
              icon={<MessageCircle className="h-8 w-8 text-primary" />} 
              label="Chat with Doctor" 
              onClick={handleChatWithDoctor} 
            />
            <QuickAccessCard 
              icon={<Phone className="h-8 w-8 text-primary" />} 
              label="Emergency Contacts" 
              onClick={() => toast({ title: "Emergency Contacts", description: "Accessing your emergency contacts..." })} 
            />
          </div>
        </section>

        {/* Medical Query Section */}
        <section className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Medical Assistant</CardTitle>
              <CardDescription>
                Ask questions about symptoms or medical concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                <p className="mb-4">Need medical advice? Our AI assistant can help answer your questions.</p>
                <Button onClick={() => toast({ title: "AI Assistant", description: "Initializing medical assistant..." })}>
                  Ask Medical Question
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-6 px-4 text-center">
        <div className="container mx-auto">
          <p className="text-muted-foreground">
            © 2023 Emergency Medical Assistance | In case of life-threatening emergency, call local emergency services immediately
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <Button variant="link" size="sm">English</Button>
            <Button variant="link" size="sm">Shona</Button>
            <Button variant="link" size="sm">Ndebele</Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
