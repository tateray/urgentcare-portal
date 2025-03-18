
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Star, 
  Search, 
  Heart, 
  Bell, 
  Filter, 
  MapPin, 
  Settings, 
  Clock, 
  Phone, 
  ChevronLeft, 
  Stethoscope 
} from "lucide-react";

const DesignSystem = () => {
  return (
    <div className="container mx-auto p-6 space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-4">Healthcare Design System</h1>
        <p className="text-muted-foreground mb-6">
          A cohesive design system for the Emergency Medical Services app based on modern design principles.
        </p>
      </div>

      <section>
        <h2 className="text-2xl font-bold mb-4">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="flex flex-col">
            <div className="h-24 rounded-lg bg-primary"></div>
            <p className="mt-2 font-medium">Primary</p>
            <p className="text-xs text-muted-foreground">hsl(358, 79%, 69%)</p>
          </div>
          <div className="flex flex-col">
            <div className="h-24 rounded-lg bg-secondary"></div>
            <p className="mt-2 font-medium">Secondary</p>
            <p className="text-xs text-muted-foreground">hsl(240, 4.8%, 95.9%)</p>
          </div>
          <div className="flex flex-col">
            <div className="h-24 rounded-lg bg-muted"></div>
            <p className="mt-2 font-medium">Muted</p>
            <p className="text-xs text-muted-foreground">hsl(240, 4.8%, 95.9%)</p>
          </div>
          <div className="flex flex-col">
            <div className="h-24 rounded-lg bg-accent"></div>
            <p className="mt-2 font-medium">Accent</p>
            <p className="text-xs text-muted-foreground">hsl(240, 4.8%, 95.9%)</p>
          </div>
          <div className="flex flex-col">
            <div className="h-24 rounded-lg bg-destructive"></div>
            <p className="mt-2 font-medium">Destructive</p>
            <p className="text-xs text-muted-foreground">hsl(0, 84.2%, 60.2%)</p>
          </div>
          <div className="flex flex-col">
            <div className="h-24 rounded-lg bg-black"></div>
            <p className="mt-2 font-medium">Black</p>
            <p className="text-xs text-muted-foreground">#000000</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Typography</h2>
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold">Heading 1</h1>
            <p className="text-sm text-muted-foreground">4xl / Bold / Poppins</p>
          </div>
          <div>
            <h2 className="text-3xl font-bold">Heading 2</h2>
            <p className="text-sm text-muted-foreground">3xl / Bold / Poppins</p>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Heading 3</h3>
            <p className="text-sm text-muted-foreground">2xl / Bold / Poppins</p>
          </div>
          <div>
            <h4 className="text-xl font-bold">Heading 4</h4>
            <p className="text-sm text-muted-foreground">xl / Bold / Poppins</p>
          </div>
          <div>
            <p className="text-base">Body Text - This is regular body text for the app.</p>
            <p className="text-sm text-muted-foreground">base / Regular / Poppins</p>
          </div>
          <div>
            <p className="text-sm">Small Text - Used for less important information.</p>
            <p className="text-sm text-muted-foreground">sm / Regular / Poppins</p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-2">Default Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-2">Custom Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button size="pill" className="bg-primary">
                <Heart className="h-4 w-4 mr-2" />
                Pill Button
              </Button>
              <Button variant="filter" size="pill">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="rating" size="sm">
                <Star className="h-4 w-4 mr-1" />
                Rating 5.0
              </Button>
              <Button variant="appointment" className="max-w-xs">
                Book Appointment
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-2">Button Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="lg">Large</Button>
              <Button>Default</Button>
              <Button size="sm">Small</Button>
              <Button size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-2">Icon Buttons</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <MapPin className="h-4 w-4" />
              </Button>
              <Button size="icon" className="rounded-full bg-primary">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Badges</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="rating" className="flex items-center gap-1">
              <Star className="h-3 w-3" />
              Rating 5.0
            </Badge>
            <Badge variant="specialty" className="flex items-center gap-1">
              <Stethoscope className="h-3 w-3" />
              Cardiology
            </Badge>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description text</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Standard card with header and content</p>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl overflow-hidden">
            <div className="aspect-video w-full overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070&auto=format&fit=crop"
                alt="Hospital"
                className="object-cover w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="font-bold">Card with Image</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Description text for this card with an image
              </p>
            </CardContent>
          </Card>
          
          <Card className="specialist-card">
            <div className="flex overflow-hidden">
              <div className="w-1/3">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop"
                  alt="Doctor"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="w-2/3 p-4">
                <p className="text-xs text-primary uppercase tracking-wide mb-1">
                  Cardiologist
                </p>
                <h3 className="font-bold text-lg">
                  Dr. Sarah Johnson
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  <Badge variant="rating" className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    5.0
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                  <MapPin className="h-3.5 w-3.5 flex-shrink-0" /> 
                  123 Medical Center Dr
                </p>
                <p className="text-sm flex items-center gap-1 mt-1">
                  <Clock className="h-3.5 w-3.5" /> 
                  15 min wait
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-2">Text Inputs</h3>
            <div className="space-y-4">
              <Input placeholder="Default input" />
              <Input className="modern-input" placeholder="Modern style input" />
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" placeholder="Search input with icon" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-xl font-medium mb-2">Search with Button</h3>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9 modern-input" placeholder="Search doctors, specialties..." />
              </div>
              <Button size="pill">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Tabs</h2>
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="specialists">Specialists</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Home Tab Content</h3>
                <p className="text-muted-foreground">
                  Content for the home tab would appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="specialists">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Specialists Tab Content</h3>
                <p className="text-muted-foreground">
                  Content for the specialists tab would appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="appointments">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Appointments Tab Content</h3>
                <p className="text-muted-foreground">
                  Content for the appointments tab would appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="profile">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-medium mb-2">Profile Tab Content</h3>
                <p className="text-muted-foreground">
                  Content for the profile tab would appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Navigation</h2>
        <Card className="rounded-2xl">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="mr-2">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-xl font-bold">Page Title</h3>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default DesignSystem;
