import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import { Loader2, User, Calendar, ListChecks, Settings, HelpCircle, Heart } from "lucide-react";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading, error } = useUser();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view the dashboard.</p>
        <Button onClick={() => navigate('/auth')}>Log In</Button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {auth.currentUser?.email}!</h1>
        <p className="text-muted-foreground">Here's an overview of your account.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5 text-primary" /> 
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              View and update your personal information.
            </p>
            <Button variant="link" onClick={() => navigate('/profile')}>
              Edit Profile
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-primary" /> 
              Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Manage your upcoming and past appointments.
            </p>
            <Button variant="link" onClick={() => navigate('/appointments')}>
              View Appointments
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <ListChecks className="mr-2 h-5 w-5 text-primary" /> 
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Check your current position in the patient queue.
            </p>
            <Button variant="link" onClick={() => navigate('/queue')}>
              Check Queue
            </Button>
          </CardContent>
        </Card>

        {/* Add new Self Health Monitoring card */}
        <Link to="/self-health-monitoring" className="block">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-primary" /> 
                Self Health Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Track your vital signs, blood pressure, and get AI-powered health insights.
              </p>
            </CardContent>
          </Card>
        </Link>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-primary" /> 
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Configure your account settings and preferences.
            </p>
            <Button variant="link" onClick={() => navigate('/settings')}>
              Go to Settings
            </Button>
          </CardContent>
        </Card>
        
        <Card className="transition-all hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-primary" /> 
              Help & Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Get assistance and find answers to common questions.
            </p>
            <Button variant="link" onClick={() => navigate('/help')}>
              Visit Help Center
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>
          Logged in as {auth.currentUser?.email} | <Button variant="link" onClick={() => auth.signOut()}>Logout</Button>
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;
