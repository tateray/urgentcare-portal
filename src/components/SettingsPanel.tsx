
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Languages, Accessibility, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  open,
  onClose,
  darkMode,
  toggleDarkMode
}) => {
  const { toast } = useToast();
  const [language, setLanguage] = useState<string>("english");
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [screenReader, setScreenReader] = useState<boolean>(false);

  // Apply accessibility settings
  useEffect(() => {
    const html = document.documentElement;
    
    if (highContrast) {
      html.classList.add('high-contrast');
    } else {
      html.classList.remove('high-contrast');
    }
    
    if (largeText) {
      html.classList.add('large-text');
    } else {
      html.classList.remove('large-text');
    }
    
    if (reduceMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }
  }, [highContrast, largeText, reduceMotion]);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: "Language Changed",
      description: `Language set to ${value.charAt(0).toUpperCase() + value.slice(1)}`,
    });
    // In a real app, this would trigger language context/state changes
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    toast({
      title: highContrast ? "High Contrast Disabled" : "High Contrast Enabled",
      description: "Your display settings have been updated.",
    });
  };

  const toggleLargeText = () => {
    setLargeText(!largeText);
    toast({
      title: largeText ? "Large Text Disabled" : "Large Text Enabled",
      description: "Your text size preferences have been updated.",
    });
  };

  const toggleReduceMotion = () => {
    setReduceMotion(!reduceMotion);
    toast({
      title: reduceMotion ? "Reduced Motion Disabled" : "Reduced Motion Enabled",
      description: "Your animation preferences have been updated.",
    });
  };

  const toggleScreenReader = () => {
    setScreenReader(!screenReader);
    toast({
      title: screenReader ? "Screen Reader Support Disabled" : "Screen Reader Support Enabled",
      description: "Your accessibility preferences have been updated.",
    });
    // In a real app, this would enable screen reader compatibility mode
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your application preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="language">Language</TabsTrigger>
            <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="dark-mode" className="font-medium">
                  {darkMode ? "Dark Mode" : "Light Mode"}
                </Label>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Changing the theme will adjust the appearance of the application to reduce eye strain in different lighting conditions.
            </p>
          </TabsContent>
          
          <TabsContent value="language" className="space-y-4 pt-4">
            <div className="flex items-center gap-2 mb-2">
              <Languages className="h-5 w-5" />
              <Label htmlFor="language-select" className="font-medium">
                Display Language
              </Label>
            </div>
            
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="english">English</SelectItem>
                <SelectItem value="shona">Shona</SelectItem>
                <SelectItem value="ndebele">Ndebele</SelectItem>
              </SelectContent>
            </Select>
            
            <p className="text-sm text-muted-foreground">
              This will change the language of the user interface throughout the application.
            </p>
          </TabsContent>
          
          <TabsContent value="accessibility" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Accessibility className="h-5 w-5" />
                <Label htmlFor="high-contrast" className="font-medium">
                  High Contrast
                </Label>
              </div>
              <Switch
                id="high-contrast"
                checked={highContrast}
                onCheckedChange={toggleHighContrast}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="large-text" className="font-medium">
                Large Text
              </Label>
              <Switch
                id="large-text"
                checked={largeText}
                onCheckedChange={toggleLargeText}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="reduce-motion" className="font-medium">
                Reduce Motion
              </Label>
              <Switch
                id="reduce-motion"
                checked={reduceMotion}
                onCheckedChange={toggleReduceMotion}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="screen-reader" className="font-medium">
                Screen Reader Support
              </Label>
              <Switch
                id="screen-reader"
                checked={screenReader}
                onCheckedChange={toggleScreenReader}
              />
            </div>
            
            <p className="text-sm text-muted-foreground">
              These settings help improve the accessibility of the application.
            </p>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
