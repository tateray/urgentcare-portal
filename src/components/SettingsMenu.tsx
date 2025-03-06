
import React, { useState } from "react";
import { 
  Settings, 
  Moon, 
  Sun, 
  Globe, 
  ZoomIn, 
  Type, 
  Palette 
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

const SettingsMenu = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [isReduceMotion, setIsReduceMotion] = useState(false);
  const [language, setLanguage] = useState("en");

  const toggleTheme = (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "light") {
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
  };

  const toggleHighContrast = () => {
    setIsHighContrast(!isHighContrast);
    if (!isHighContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const toggleLargeText = () => {
    setIsLargeText(!isLargeText);
    if (!isLargeText) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }
  };

  const toggleReduceMotion = () => {
    setIsReduceMotion(!isReduceMotion);
    if (!isReduceMotion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
  };

  const changeLanguage = (value: string) => {
    setLanguage(value);
    // In a real app, this would trigger language change throughout the app
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
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="appearance">
              <Palette className="h-4 w-4 mr-2" />
              <span>Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <ZoomIn className="h-4 w-4 mr-2" />
              <span>Accessibility</span>
            </TabsTrigger>
            <TabsTrigger value="language">
              <Globe className="h-4 w-4 mr-2" />
              <span>Language</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Theme</h3>
              <div className="flex flex-col space-y-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => toggleTheme("light")}
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => toggleTheme("dark")}
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => toggleTheme("system")}
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
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="high-contrast" className="text-base">High Contrast</Label>
                  <span className="text-xs text-muted-foreground">Increase contrast for better readability</span>
                </div>
                <Switch 
                  id="high-contrast" 
                  checked={isHighContrast}
                  onCheckedChange={toggleHighContrast}
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
                  onCheckedChange={toggleLargeText}
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
                  onCheckedChange={toggleReduceMotion}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="language" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Language</h3>
              <Select value={language} onValueChange={changeLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                  <SelectItem value="ja">日本語</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="sn">Shona</SelectItem>
                  <SelectItem value="nd">Ndebele</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
        </Tabs>
        
        <SheetFooter className="mt-6">
          <SheetClose asChild>
            <Button type="submit" className="apple-button w-full">Done</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default SettingsMenu;
