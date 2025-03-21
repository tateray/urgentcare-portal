
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Moon, Sun, Languages, Accessibility, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language: currentLanguage, setLanguage: setContextLanguage, t } = useLanguage();
  const [language, setLanguage] = useState<"en" | "sn" | "nd">(currentLanguage);
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);
  const [screenReader, setScreenReader] = useState<boolean>(false);

  // Update internal state when context language changes
  useEffect(() => {
    setLanguage(currentLanguage);
  }, [currentLanguage]);

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
    if (value === "en" || value === "sn" || value === "nd") {
      setLanguage(value);
      setContextLanguage(value);
      
      toast({
        title: t('language_changed'),
        description: `${t('language_set_to')} ${value === 'en' ? t('english') : value === 'sn' ? t('shona') : t('ndebele')}`,
      });
    }
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
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            {t('settings')}
          </DialogTitle>
          <DialogDescription>
            {t('customize_experience')}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="appearance">{t('appearance')}</TabsTrigger>
            <TabsTrigger value="language">{t('language')}</TabsTrigger>
            <TabsTrigger value="accessibility">{t('accessibility')}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <Label htmlFor="dark-mode" className="font-medium">
                  {darkMode ? t('dark_mode') : t('light_mode')}
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
                {t('display_language')}
              </Label>
            </div>
            
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger id="language-select">
                <SelectValue placeholder={`${t('language')}`} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">{t('english')}</SelectItem>
                <SelectItem value="sn">{t('shona')}</SelectItem>
                <SelectItem value="nd">{t('ndebele')}</SelectItem>
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
                  {t('high_contrast')}
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
                {t('large_text')}
              </Label>
              <Switch
                id="large-text"
                checked={largeText}
                onCheckedChange={toggleLargeText}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="reduce-motion" className="font-medium">
                {t('reduce_motion')}
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
          <Button onClick={onClose}>{t('done')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsPanel;
