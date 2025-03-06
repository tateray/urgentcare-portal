
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MapPin, History, MessageCircle, Ambulance, Heart, Bell, User, Settings, Moon, Sun } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import SettingsPanel from "@/components/SettingsPanel";
import PhonebookDialer from "@/components/PhonebookDialer";

const EmergencyButton = ({ icon, label, onClick, to }: { icon: React.ReactNode; label: string; onClick?: () => void; to?: string }) => {
  const button = (
    <Button 
      variant="destructive" 
      className="flex flex-col items-center justify-center h-24 w-full gap-2 transition-all hover:scale-105 sf-pro-text"
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Button>
  );
  
  if (to) {
    return <Link to={to}>{button}</Link>;
  }
  
  return button;
};

const QuickAccessCard = ({ icon, label, onClick, to }: { icon: React.ReactNode; label: string; onClick?: () => void; to?: string }) => {
  const card = (
    <Card className="cursor-pointer hover:shadow-md transition-all hover:scale-105 apple-card" onClick={onClick}>
      <CardContent className="p-6 flex flex-col items-center justify-center">
        {icon}
        <p className="mt-2 text-center font-medium sf-pro-text">{label}</p>
      </CardContent>
    </Card>
  );
  
  if (to) {
    return <Link to={to}>{card}</Link>;
  }
  
  return card;
};

const Index = () => {
  const { toast } = useToast();
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPhonebook, setShowPhonebook] = useState(false);

  useEffect(() => {
    // Check if dark mode preference was saved
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    
    // Apply dark mode class to document
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save preference
    localStorage.setItem('darkMode', String(newMode));
    
    toast({
      title: newMode ? "Dark Mode Activated" : "Light Mode Activated",
      description: "Your display preferences have been updated",
    });
  };

  const handleEmergencyCall = () => {
    setShowPhonebook(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground sf-pro-text">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border py-4 px-6 flex justify-between items-center shadow-sm apple-nav">
        <div className="flex items-center gap-2">
          <Heart className="text-destructive h-6 w-6" />
          <h1 className="text-xl font-semibold">Emergency Medical Assistance</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* Emergency Actions */}
        <section className="mb-8">
          <Card className="border-destructive apple-card">
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
                  to="/ambulance"
                />
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* Phonebook Section (conditionally rendered) */}
        {showPhonebook && (
          <section className="mb-8">
            <Card className="apple-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Emergency Contacts</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowPhonebook(false)}
                  >
                    Close
                  </Button>
                </div>
                <CardDescription>
                  Call emergency services or personal contacts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PhonebookDialer />
              </CardContent>
            </Card>
          </section>
        )}

        {/* Quick Access Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <QuickAccessCard 
              icon={<MapPin className="h-8 w-8 text-primary" />} 
              label="Find Hospital"
              to="/hospital-locator"
            />
            <QuickAccessCard 
              icon={<History className="h-8 w-8 text-primary" />} 
              label="Medical History"
              to="/medical-history"
            />
            <QuickAccessCard 
              icon={<MessageCircle className="h-8 w-8 text-primary" />} 
              label="Chat with Doctor"
              to="/chat"
            />
            <QuickAccessCard 
              icon={<Phone className="h-8 w-8 text-primary" />} 
              label="Emergency Contacts"
              to="/emergency-contacts"
            />
          </div>
        </section>

        {/* Medical Query Section */}
        <section className="mb-8">
          <Card className="apple-card">
            <CardHeader>
              <CardTitle>Medical Assistant</CardTitle>
              <CardDescription>
                Ask questions about symptoms or medical concerns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-6 text-center">
                <p className="mb-4">Need medical advice? Our AI assistant can help answer your questions.</p>
                <Link to="/chat">
                  <Button className="apple-button">
                    Ask Medical Question
                  </Button>
                </Link>
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
          <p className="mt-2 text-xs text-muted-foreground">
            <Link to="/auth">User Login</Link> | <Link to="/admin">Admin Portal</Link>
          </p>
        </div>
      </footer>

      {/* Settings Panel */}
      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </div>
  );
};

export default Index;
