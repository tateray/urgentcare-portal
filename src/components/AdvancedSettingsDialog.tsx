
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Languages, Moon, Sun, ChevronRight, Globe, Users, X, Eye, Accessibility, MapPin } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import LocationSelector from "./LocationSelector";

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

interface SettingOption {
  id: string;
  name: string;
  description?: string;
  icon?: React.ReactNode;
}

const AdvancedSettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onClose
}) => {
  const { toast } = useToast();
  const { language: currentLanguage, setLanguage, t } = useLanguage();
  
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [currentCity, setCurrentCity] = useState({ id: 1, name: "Harare" });
  const [notification, setNotification] = useState(true);
  const [dataUsage, setDataUsage] = useState("low");
  
  // Initialize theme state from document on mount
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("system");
    } else {
      setTheme("light");
    }
    
    // Initialize accessibility states
    setHighContrast(document.documentElement.classList.contains("high-contrast"));
    setLargeText(document.documentElement.classList.contains("large-text"));
    setReduceMotion(document.documentElement.classList.contains("reduce-motion"));
  }, []);

  // Apply all settings
  const applySettings = () => {
    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    
    // Apply accessibility settings
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    if (largeText) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
    
    if (reduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }

    toast({
      title: t('settings'),
      description: t('customize_experience'),
    });
    
    onClose();
  };
  
  const languageOptions: SettingOption[] = [
    { id: "en", name: t('english'), icon: <Globe className="h-5 w-5" /> },
    { id: "sn", name: t('shona'), icon: <Globe className="h-5 w-5" /> },
    { id: "nd", name: t('ndebele'), icon: <Globe className="h-5 w-5" /> },
  ];
  
  const handleLanguageChange = (languageId: string) => {
    if (languageId === "en" || languageId === "sn" || languageId === "nd") {
      setLanguage(languageId);
      toast({
        title: t('language_changed'),
        description: `${t('language_set_to')} ${languageId === 'en' ? t('english') : languageId === 'sn' ? t('shona') : t('ndebele')}`,
      });
    }
  };
  
  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b">
            <DialogTitle className="text-lg">{t('settings')}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-3 w-full rounded-none border-b h-12">
              <TabsTrigger value="general" className="rounded-none">General</TabsTrigger>
              <TabsTrigger value="language" className="rounded-none">{t('language')}</TabsTrigger>
              <TabsTrigger value="accessibility" className="rounded-none">{t('accessibility')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="p-4 space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('appearance')}</h3>
                <RadioGroup 
                  value={theme} 
                  onValueChange={(value) => setTheme(value as "light" | "dark" | "system")}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="light" id="light" />
                      <Label htmlFor="light" className="flex items-center gap-2">
                        <Sun className="h-4 w-4" /> {t('light_mode')}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dark" id="dark" />
                      <Label htmlFor="dark" className="flex items-center gap-2">
                        <Moon className="h-4 w-4" /> {t('dark_mode')}
                      </Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="system" id="system" />
                      <Label htmlFor="system" className="flex items-center gap-2">
                        <svg className="h-4 w-4" viewBox="0 0 24 24">
                          <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                          <path d="M12 1v2M12 21v2M1 12h2M21 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" 
                            stroke="currentColor" strokeWidth="2" />
                        </svg> {t('system')}
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Location</h3>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  onClick={() => setLocationModalOpen(true)}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{currentCity.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Notifications</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Push Notifications</Label>
                  <Switch 
                    id="notifications" 
                    checked={notification}
                    onCheckedChange={setNotification}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Data Usage</h3>
                <RadioGroup 
                  value={dataUsage} 
                  onValueChange={setDataUsage}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="low" id="low" />
                      <Label htmlFor="low">Low - Save Data</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium - Balanced</Label>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="high" id="high" />
                      <Label htmlFor="high">High - Best Quality</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </TabsContent>
            
            <TabsContent value="language" className="p-0">
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium text-muted-foreground">SELECT {t('language').toUpperCase()}</h3>
              </div>
              
              <div className="divide-y">
                {languageOptions.map((option) => (
                  <div 
                    key={option.id}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleLanguageChange(option.id)}
                  >
                    <div className="flex items-center gap-3">
                      {option.icon}
                      <span>{option.name}</span>
                    </div>
                    {currentLanguage === option.id && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="accessibility" className="p-4 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="high-contrast" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      <span>{t('high_contrast')}</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Increases contrast for better readability
                    </p>
                  </div>
                  <Switch 
                    id="high-contrast" 
                    checked={highContrast}
                    onCheckedChange={setHighContrast}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <Label htmlFor="large-text" className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{t('large_text')}</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Increases text size throughout the app
                    </p>
                  </div>
                  <Switch 
                    id="large-text" 
                    checked={largeText}
                    onCheckedChange={setLargeText}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <Label htmlFor="reduce-motion" className="flex items-center gap-2">
                      <Accessibility className="h-4 w-4" />
                      <span>{t('reduce_motion')}</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Minimizes animation effects
                    </p>
                  </div>
                  <Switch 
                    id="reduce-motion" 
                    checked={reduceMotion}
                    onCheckedChange={setReduceMotion}
                  />
                </div>
                
                <div className="flex items-center justify-between pt-3">
                  <div>
                    <Label htmlFor="screen-reader" className="flex items-center gap-2">
                      <Languages className="h-4 w-4" />
                      <span>Screen Reader Support</span>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Enhances compatibility with screen readers
                    </p>
                  </div>
                  <Switch 
                    id="screen-reader" 
                    checked={screenReader}
                    onCheckedChange={setScreenReader}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex items-center justify-end gap-2 p-4 border-t">
            <Button variant="outline" onClick={onClose} className="gap-1">
              <X className="h-4 w-4" /> {t('cancel')}
            </Button>
            <Button onClick={applySettings} className="gap-1">
              <Check className="h-4 w-4" /> {t('save_changes')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <LocationSelector
        open={locationModalOpen}
        onClose={() => setLocationModalOpen(false)}
        onSelectLocation={(city) => setCurrentCity(city)}
        currentLocation={currentCity}
      />
    </>
  );
};

export default AdvancedSettingsDialog;
