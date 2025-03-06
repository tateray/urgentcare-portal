import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, User } from "lucide-react";

const Index = () => {
  const renderHeroSection = () => (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 sf-pro-text">
          Your Health, Our Priority
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Connecting you with the best emergency services and healthcare
          professionals in Zimbabwe.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/hospital-locator">Find a Hospital</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/ambulance">Book an Ambulance</Link>
          </Button>
        </div>
      </div>
    </section>
  );

  const renderFeaturesSection = () => (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="apple-card hover-scale">
            <CardHeader>
              <CardTitle className="text-xl">Emergency Assistance</CardTitle>
              <CardDescription>
                Fast and reliable ambulance booking service.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get immediate help in critical situations with our 24/7
                emergency response.
              </p>
            </CardContent>
          </Card>

          <Card className="apple-card hover-scale">
            <CardHeader>
              <CardTitle className="text-xl">Find Hospitals & Clinics</CardTitle>
              <CardDescription>
                Locate nearby healthcare facilities.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Discover the nearest hospitals, clinics, and pharmacies with
                our comprehensive locator tool.
              </p>
            </CardContent>
          </Card>

          <Card className="apple-card hover-scale">
            <CardHeader>
              <CardTitle className="text-xl">Medical History Tracking</CardTitle>
              <CardDescription>
                Keep track of your health records.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Securely store and manage your medical history, appointments,
                and prescriptions in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="apple-card hover-scale">
            <CardHeader>
              <CardTitle className="text-xl">Chat with Doctors</CardTitle>
              <CardDescription>
                Consult with healthcare professionals online.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Connect with qualified doctors and specialists for virtual
                consultations and medical advice.
              </p>
            </CardContent>
          </Card>

          <Card className="apple-card hover-scale">
            <CardHeader>
              <CardTitle className="text-xl">Emergency Contacts</CardTitle>
              <CardDescription>
                Manage your emergency contact list.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Store and quickly access your emergency contacts in case of
                urgent situations.
              </p>
            </CardContent>
          </Card>

          <Card className="apple-card hover-scale">
            <CardHeader>
              <CardTitle className="text-xl">Profile Management</CardTitle>
              <CardDescription>
                Control your personal health information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Customize your profile, manage your preferences, and ensure
                your data is always up-to-date.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );

  const renderCTASection = () => (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Experience the future of healthcare in Zimbabwe. Sign up today and
          take control of your health.
        </p>
        <Button size="lg" variant="secondary" asChild>
          <Link to="/auth">Sign Up Now</Link>
        </Button>
      </div>
    </section>
  );

  const renderFooter = () => (
    <footer className="py-8 bg-background border-t">
      <div className="container mx-auto px-4 text-center text-muted-foreground">
        <p>&copy; 2023 Emergency Medical Services. All rights reserved.</p>
        <p>
          Developed with <span className="text-destructive">❤️</span> in
          Zimbabwe
        </p>
      </div>
    </footer>
  );

  const renderAuthButtons = () => (
    <div className="flex gap-2">
      <Button variant="outline" asChild>
        <Link to="/auth">Sign In</Link>
      </Button>
      <Button asChild>
        <Link to="/auth">Sign Up</Link>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="apple-nav py-4 px-4 sm:px-6">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <Heart className="text-destructive h-6 w-6" />
            <span className="font-bold text-xl sf-pro-text">
              Emergency Medical Services
            </span>
          </Link>
          <nav>{renderAuthButtons()}</nav>
        </div>
      </header>

      <main className="flex-grow">
        {renderHeroSection()}
        {renderFeaturesSection()}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Create Your Health Account
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sign up for a personalized account to access your medical
                history, track appointments, and get faster emergency services
                when needed.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 justify-center">
              <Card className="w-full md:w-80 apple-card">
                <CardHeader className="text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>Patient Account</CardTitle>
                  <CardDescription>For individuals seeking care</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-center">
                  <p>Access medical records</p>
                  <p>Schedule appointments</p>
                  <p>Get emergency assistance</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" asChild>
                    <Link to="/auth">Sign Up Now</Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="w-full md:w-80 apple-card">
                <CardHeader className="text-center">
                  <div className="bg-red-100 dark:bg-red-900/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Shield className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Admin Access</CardTitle>
                  <CardDescription>For healthcare providers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-center">
                  <p>Manage ambulance fleet</p>
                  <p>Track emergency requests</p>
                  <p>View patient profiles</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/auth">Request Access</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
        {renderCTASection()}
      </main>

      {renderFooter()}
    </div>
  );
};

export default Index;
