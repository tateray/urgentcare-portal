import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Heart, 
  Phone, 
  Hospital, 
  Ambulance, 
  MessageCircle, 
  User, 
  ShieldAlert, 
  Search, 
  Clock, 
  MapPin,
  Settings,
  Sun,
  Moon,
  FireExtinguisher
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Map from "@/components/Map";
import AiMedicalToolsWidget from "@/components/AiMedicalToolsWidget";
import FloatingTopMenu from "@/components/FloatingTopMenu";

const EmergencyCard = ({ 
  title, 
  icon, 
  color, 
  number, 
  to
}: { 
  title: string; 
  icon: React.ReactNode; 
  color: string; 
  number?: string;
  to: string;
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (number) {
      toast({
        title: `Calling ${title}`,
        description: `Dialing ${number}...`,
      });
      window.location.href = `tel:${number}`;
    } else {
      navigate(to);
    }
  };
  
  return (
    <Card className={`border-l-4 ${color} hover:shadow-md transition-all hover-scale cursor-pointer`} onClick={handleClick}>
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color.replace('border', 'bg')}`}>
            {icon}
          </div>
          <div>
            <h3 className="font-bold">{title}</h3>
            {number && <p className="text-sm text-muted-foreground">{number}</p>}
          </div>
        </div>
        <Button size="sm" variant="ghost">
          {number ? "Call" : "Open"}
        </Button>
      </CardContent>
    </Card>
  );
};

const ServiceCard = ({ 
  title, 
  description, 
  icon, 
  to 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode; 
  to: string;
}) => {
  return (
    <Link to={to} className="block">
      <Card className="h-full hover:shadow-md transition-all hover-scale">
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              {icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const Index = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<'light' | 'dark'>(
    document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  );
  const [showSettings, setShowSettings] = useState(false);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    toast({
      title: "Search",
      description: `Searching for "${searchQuery}"...`,
    });
    
    setSearchQuery("");
  };
  
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    toast({
      title: `${newTheme === 'dark' ? 'Dark' : 'Light'} Theme Activated`,
      description: `Switched to ${newTheme} mode`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <FloatingTopMenu />
      
      <header className="apple-nav py-4 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="text-destructive h-6 w-6" />
            <h1 className="text-xl font-semibold sf-pro-display">Emergency Medical Services</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings className="h-5 w-5" />
            </Button>
            
            {user ? (
              <Link to="/user-dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      
      {showSettings && (
        <div className="container mx-auto px-4 py-2">
          <Card className="animate-fade-in">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={toggleTheme}
                  >
                    {theme === 'light' ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Accessibility Mode",
                        description: "High contrast mode activated",
                      });
                      document.body.classList.toggle('high-contrast');
                    }}
                  >
                    Accessibility
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      toast({
                        title: "Language",
                        description: "Language would be changed here",
                      });
                    }}
                  >
                    Language
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <main className="container mx-auto py-6 px-4">
        <section className="mb-8">
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for hospitals, services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 apple-input"
              />
            </div>
            <Button onClick={handleSearch}>Search</Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-3 overflow-hidden apple-card">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col justify-center">
                    <h2 className="text-3xl font-bold mb-4 sf-pro-display">
                      Zimbabwe Emergency Medical Services
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Fast access to emergency services, hospital locations, and medical assistance across Zimbabwe.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/emergency-contacts">
                        <Button className="w-full sm:w-auto apple-button">
                          <Phone className="mr-2 h-4 w-4" />
                          Emergency Contacts
                        </Button>
                      </Link>
                      <Link to="/hospital-locator">
                        <Button variant="outline" className="w-full sm:w-auto">
                          <MapPin className="mr-2 h-4 w-4" />
                          Find Hospitals
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="flex justify-center items-center p-4">
                    <Heart className="h-32 w-32 text-destructive animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 sf-pro-display">AI-Powered Medical Assistance</h2>
          <AiMedicalToolsWidget />
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 sf-pro-display">Emergency Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/emergency-contacts">
              <EmergencyCard 
                title="Emergency Number" 
                icon={<Phone className="h-5 w-5 text-white" />}
                color="border-destructive bg-destructive/90"
                number="999"
                to="/emergency-contacts"
              />
            </Link>
            
            <Link to="/ambulance">
              <EmergencyCard 
                title="Ambulance Services" 
                icon={<Ambulance className="h-5 w-5 text-white" />}
                color="border-orange-500 bg-orange-500"
                number="994"
                to="/ambulance"
              />
            </Link>
            
            <Link to="/hospital-locator">
              <EmergencyCard 
                title="Hospital Locator" 
                icon={<Hospital className="h-5 w-5 text-white" />}
                color="border-blue-500 bg-blue-500"
                to="/hospital-locator"
              />
            </Link>
            
            <Link to="/fire-emergency">
              <EmergencyCard 
                title="Fire Emergency" 
                icon={<FireExtinguisher className="h-5 w-5 text-white" />}
                color="border-red-600 bg-red-600"
                number="993"
                to="/fire-emergency"
              />
            </Link>
          </div>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 sf-pro-display">Medical Services</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <ServiceCard 
              title="Hospital Finder" 
              description="Find the nearest hospitals and medical facilities"
              icon={<Hospital className="h-6 w-6 text-blue-500" />}
              to="/hospital-locator"
            />
            
            <ServiceCard 
              title="Emergency Contacts" 
              description="Quick access to emergency phone numbers"
              icon={<Phone className="h-6 w-6 text-destructive" />}
              to="/emergency-contacts"
            />
            
            <ServiceCard 
              title="Ambulance Booking" 
              description="Request emergency or scheduled ambulance service"
              icon={<Ambulance className="h-6 w-6 text-orange-500" />}
              to="/ambulance"
            />
            
            <ServiceCard 
              title="Chat With Doctor" 
              description="Get medical advice from healthcare professionals"
              icon={<MessageCircle className="h-6 w-6 text-green-500" />}
              to="/chat"
            />
          </div>
        </section>
        
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold sf-pro-display">Hospital Map</h2>
            <Link to="/hospital-locator">
              <Button variant="outline" size="sm">
                View Full Map
              </Button>
            </Link>
          </div>
          
          <Card className="overflow-hidden apple-card">
            <CardContent className="p-0">
              <Map />
            </CardContent>
          </Card>
        </section>
        
        <section className="mb-8">
          <Tabs defaultValue="patients" className="w-full">
            <TabsList className="w-full grid grid-cols-2 mb-6">
              <TabsTrigger value="patients">For Patients</TabsTrigger>
              <TabsTrigger value="providers">For Healthcare Providers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="patients" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Clock className="h-12 w-12 text-primary mb-4" />
                    <h3 className="text-xl font-semibold mb-2">24/7 Emergency Care</h3>
                    <p className="text-muted-foreground">
                      Access emergency medical services any time, day or night
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <MessageCircle className="h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Medical Consultation</h3>
                    <p className="text-muted-foreground">
                      Chat with healthcare professionals for medical advice
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <ShieldAlert className="h-12 w-12 text-amber-500 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Health Information</h3>
                    <p className="text-muted-foreground">
                      Access your medical records and healthcare information
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="providers" className="animate-fade-in">
              <div className="bg-muted p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4">For Healthcare Providers</h3>
                <p className="mb-4">
                  Join our network of healthcare providers to offer your services through our platform.
                </p>
                <div className="flex gap-4">
                  <Link to="/auth">
                    <Button>
                      Provider Login
                    </Button>
                  </Link>
                  <Button variant="outline">
                    Learn More
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>
      
      <footer className="bg-muted py-8 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="text-destructive h-6 w-6" />
              <span className="font-semibold">Emergency Medical Services</span>
            </div>
            <div className="flex flex-wrap gap-6">
              <Link to="/emergency-contacts" className="text-muted-foreground hover:text-foreground transition-colors">
                Emergency Contacts
              </Link>
              <Link to="/hospital-locator" className="text-muted-foreground hover:text-foreground transition-colors">
                Hospital Locator
              </Link>
              <Link to="/ambulance" className="text-muted-foreground hover:text-foreground transition-colors">
                Ambulance Services
              </Link>
              <Link to="/auth" className="text-muted-foreground hover:text-foreground transition-colors">
                Login / Register
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Zimbabwe Emergency Medical Services. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
