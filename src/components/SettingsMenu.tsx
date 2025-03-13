
import React, { useState, useEffect } from "react";
import { 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  ZoomIn, 
  Type, 
  Palette,
  Check,
  X,
  Languages
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const SettingsMenu = () => {
  const { toast } = useToast();
  const { language: currentLanguage, setLanguage: setContextLanguage } = useLanguage();
  
  // Local state for settings (to be applied only when saved)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isReduceMotion, setIsReduceMotion] = useState(false);
  const [language, setLanguage] = useState(currentLanguage);
  const [region, setRegion] = useState("zw");
  
  // Initialize theme state from document
  useEffect(() => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("system");
    } else {
      setTheme("light");
    }
    
    // Initialize accessibility states from document
    setIsHighContrast(document.documentElement.classList.contains("high-contrast"));
    setIsLargeText(document.documentElement.classList.contains("large-text"));
    setIsReduceMotion(document.documentElement.classList.contains("reduce-motion"));
  }, []);
  
  // Reset local settings to current applied settings
  const resetLocalSettings = () => {
    if (document.documentElement.classList.contains("dark")) {
      setTheme("dark");
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("system");
    } else {
      setTheme("light");
    }
    
    setIsHighContrast(document.documentElement.classList.contains("high-contrast"));
    setIsLargeText(document.documentElement.classList.contains("large-text"));
    setIsReduceMotion(document.documentElement.classList.contains("reduce-motion"));
    setLanguage(currentLanguage);
  };

  // Apply all settings
  const applySettings = () => {
    // Apply theme
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // Check system preference
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    
    // Apply accessibility settings
    if (isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    if (isLargeText) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
    
    if (isReduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    
    // Apply language
    if (language !== currentLanguage) {
      setContextLanguage(language);
      toast({
        title: "Language Changed",
        description: `Language set to ${language === 'en' ? 'English' : language === 'sn' ? 'Shona' : 'Ndebele'}`,
      });
    }
    
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated",
    });
  };

  const handleCancel = (close: () => void) => {
    resetLocalSettings();
    close();
    toast({
      title: "Changes Discarded",
      description: "Settings have been reset to previous values",
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="apple-card w-[340px] sm:w-[400px] py-10">
        <SheetHeader className="mb-5">
          <SheetTitle className="text-2xl sf-pro-text">Settings</SheetTitle>
          <SheetDescription>
            Customize your experience
          </SheetDescription>
        </SheetHeader>
        
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <Languages className="h-4 w-4 mr-2" />
              <span>Language & Accessibility</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Theme</h3>
              <div className="flex flex-col space-y-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setTheme("system")}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M12 1v2M12 21v2M1 12h2M21 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" 
                      stroke="currentColor" strokeWidth="2" />
                  </svg>
                  System
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="accessibility" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Language & Region</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language-select">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language-select">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="sn">Shona</SelectItem>
                      <SelectItem value="nd">Ndebele</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="region-select">Region</Label>
                  <Select value={region} onValueChange={setRegion}>
                    <SelectTrigger id="region-select">
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zw">Zimbabwe</SelectItem>
                      <SelectItem value="za">South Africa</SelectItem>
                      <SelectItem value="bw">Botswana</SelectItem>
                      <SelectItem value="mz">Mozambique</SelectItem>
                      <SelectItem value="zm">Zambia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mt-6">Accessibility</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="high-contrast" className="text-base">High Contrast</Label>
                    <span className="text-xs text-muted-foreground">Increase contrast for better readability</span>
                  </div>
                  <Switch 
                    id="high-contrast" 
                    checked={isHighContrast}
                    onCheckedChange={setIsHighContrast}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="large-text" className="text-base">
                      <Type className="h-4 w-4 inline mr-2" />
                      Larger Text
                    </Label>
                    <span className="text-xs text-muted-foreground">Increase text size</span>
                  </div>
                  <Switch 
                    id="large-text" 
                    checked={isLargeText}
                    onCheckedChange={setIsLargeText}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="reduce-motion" className="text-base">Reduce Motion</Label>
                    <span className="text-xs text-muted-foreground">Minimize animation effects</span>
                  </div>
                  <Switch 
                    id="reduce-motion" 
                    checked={isReduceMotion}
                    onCheckedChange={setIsReduceMotion}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-6 flex justify-between">
          <SheetClose asChild>
            {(close) => (
              <Button 
                variant="outline" 
                className="w-1/2 mr-2"
                onClick={() => handleCancel(close)}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            )}
          </SheetClose>
          
          <SheetClose asChild>
            {(close) => (
              <Button 
                className="w-1/2 ml-2 apple-button"
                onClick={() => {
                  applySettings();
                  close();
                }}
              >
                <Check className="mr-2 h-4 w-4" />
                Save
              </Button>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsMenu;
