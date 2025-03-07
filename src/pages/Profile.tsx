
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Save, LogOut, Settings, Moon, Sun, Image, Camera } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Profile = () => {
  const { toast } = useToast();
  const { language, setLanguage, t } = useLanguage();
  const [darkMode, setDarkMode] = useState(false);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [phone, setPhone] = useState("+263 71 234 5678");
  const [nationalID, setNationalID] = useState("12345678A00");
  const [isEditing, setIsEditing] = useState(false);
  
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
  
  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved",
    });
  };
  
  const handleLogout = () => {
    toast({
      title: "Logging Out",
      description: "You have been logged out successfully",
    });
    // In a real app with Firebase, this would be:
    // auth.signOut().then(() => { ... })
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{t('profile')}</h1>
        
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button variant="outline" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{t('profilePicture')}</CardTitle>
              <CardDescription>
                {t('manageProfileImage')}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative mb-4">
                <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                  <User className="h-20 w-20 text-muted-foreground" />
                </div>
                <Button 
                  variant="secondary" 
                  size="icon" 
                  className="absolute bottom-0 right-0 rounded-full"
                  onClick={() => {
                    toast({
                      title: "Upload Profile Picture",
                      description: "Please select an image file",
                    });
                  }}
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Upload Image",
                      description: "Please select an image file",
                    });
                  }}
                >
                  <Image className="h-4 w-4 mr-2" />
                  {t('upload')}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    toast({
                      title: "Take Photo",
                      description: "Camera access requested",
                    });
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {t('takePhoto')}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle>{t('languageSettings')}</CardTitle>
              <CardDescription>
                {t('chooseLanguage')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setLanguage('english');
                    toast({
                      title: "Language Changed",
                      description: "Language set to English",
                    });
                  }}
                >
                  {language === 'english' && (
                    <span className="w-6 h-6 mr-2 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs">✓</span>
                    </span>
                  )}
                  English
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setLanguage('shona');
                    toast({
                      title: "Language Changed",
                      description: "Language set to Shona",
                    });
                  }}
                >
                  {language === 'shona' && (
                    <span className="w-6 h-6 mr-2 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs">✓</span>
                    </span>
                  )}
                  Shona
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    setLanguage('ndebele');
                    toast({
                      title: "Language Changed",
                      description: "Language set to Ndebele",
                    });
                  }}
                >
                  {language === 'ndebele' && (
                    <span className="w-6 h-6 mr-2 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground text-xs">✓</span>
                    </span>
                  )}
                  Ndebele
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t('personalInfo')}</CardTitle>
              <CardDescription>
                {t('managePersonal')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      {t('fullName')}
                    </label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      {t('emailAddress')}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      {t('phoneNumber')}
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="nationalID" className="text-sm font-medium">
                      {t('nationalID')}
                    </label>
                    <Input
                      id="nationalID"
                      value={nationalID}
                      onChange={(e) => setNationalID(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button onClick={handleSaveProfile}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('saveChanges')}
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                  className="ml-auto"
                >
                  {t('editProfile')}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{t('medicalInfo')}</CardTitle>
              <CardDescription>
                {t('importantHealth')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="bloodType" className="text-sm font-medium">
                      {t('bloodType')}
                    </label>
                    <select 
                      id="bloodType" 
                      className="w-full p-2 rounded-md border border-input bg-background"
                      disabled={!isEditing}
                    >
                      <option>A+</option>
                      <option>A-</option>
                      <option>B+</option>
                      <option>B-</option>
                      <option>AB+</option>
                      <option>AB-</option>
                      <option>O+</option>
                      <option>O-</option>
                      <option>Unknown</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="allergies" className="text-sm font-medium">
                      {t('allergies')}
                    </label>
                    <Input
                      id="allergies"
                      placeholder="e.g., Penicillin, Peanuts"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="conditions" className="text-sm font-medium">
                    {t('medicalConditions')}
                  </label>
                  <Input
                    id="conditions"
                    placeholder="e.g., Asthma, Diabetes"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="medications" className="text-sm font-medium">
                    {t('currentMedications')}
                  </label>
                  <Input
                    id="medications"
                    placeholder="List current medications"
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="emergencyContact" className="text-sm font-medium">
                    {t('emergencyContact')}
                  </label>
                  <Input
                    id="emergencyContact"
                    placeholder="Name and phone number"
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/medical-history" className="w-full">
                <Button variant="outline" className="w-full">
                  {t('viewFullMedical')}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
