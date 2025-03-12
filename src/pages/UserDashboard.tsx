
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar, MapPin, Phone, MessageCircle, FileText, LogOut, Settings, Bell, Clock } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { signOut } from 'firebase/auth';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AiMedicalToolsWidget from "@/components/AiMedicalToolsWidget";

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState([]);
  const [queueStatus, setQueueStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mock data - would come from Firebase in a real app
  const upcomingAppointments = [
    { id: 1, date: "2023-10-15", time: "10:30 AM", doctor: "Dr. Sarah Moyo", specialty: "Cardiology" },
    { id: 2, date: "2023-10-22", time: "2:00 PM", doctor: "Dr. John Mutasa", specialty: "General Practice" }
  ];

  const recentMedications = [
    { id: 1, name: "Paracetamol", dosage: "500mg", frequency: "Every 6 hours", startDate: "2023-09-01", endDate: "2023-10-15" },
    { id: 2, name: "Amoxicillin", dosage: "250mg", frequency: "Three times daily", startDate: "2023-09-10", endDate: "2023-09-17" }
  ];

  // Fetch appointments from Supabase
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          setLoading(true);
          
          const { data, error } = await supabase
            .from('appointments')
            .select(`
              id, 
              doctor_name, 
              specialty, 
              appointment_date, 
              status, 
              hospitals(name, address)
            `)
            .eq('user_id', userData.user.id)
            .order('appointment_date', { ascending: true });
            
          if (error) throw error;
          
          setAppointments(data || []);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast({
          title: "Error",
          description: "Could not load appointments",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAppointments();
  }, [toast]);

  // Check if user is in a queue
  useEffect(() => {
    const checkQueueStatus = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user) {
          const { data, error } = await supabase
            .from('patient_queue')
            .select(`
              id,
              position_in_queue,
              estimated_wait_time,
              status,
              check_in_time,
              hospitals(name)
            `)
            .eq('user_id', userData.user.id)
            .eq('status', 'waiting')
            .single();
            
          if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
            throw error;
          }
          
          setQueueStatus(data || null);
        }
      } catch (error) {
        console.error("Error checking queue status:", error);
      }
    };
    
    checkQueueStatus();
    
    // Set up realtime subscription for queue updates
    const queueSubscription = supabase
      .channel('public:patient_queue')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'patient_queue' }, 
        checkQueueStatus
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(queueSubscription);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Logout Failed",
        description: error.message || "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="apple-nav py-4 px-4 sm:px-6 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="text-destructive h-6 w-6" />
            <h1 className="text-xl font-semibold sf-pro-text">Health Dashboard</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-destructive text-xs">
                2
              </Badge>
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-6 px-4">
        {/* Queue Status Alert if user is in a queue */}
        {queueStatus && (
          <Card className="mb-6 border-l-4 border-blue-500">
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">You're in the queue at {queueStatus.hospitals.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Current position: <span className="font-semibold">{queueStatus.position_in_queue}</span> • 
                      Estimated wait time: <span className="font-semibold">{queueStatus.estimated_wait_time} min</span>
                    </p>
                  </div>
                </div>
                <Link to="/ai-features?feature=queue">
                  <Button size="sm">View Details</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 sf-pro-text">Quick Actions</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/emergency-contacts">
              <Card className="hover:shadow-md transition-all apple-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-red-100 dark:bg-red-900/20 p-3 rounded-full mb-3">
                    <Phone className="h-6 w-6 text-destructive" />
                  </div>
                  <p className="font-medium">Emergency Contacts</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/hospital-locator">
              <Card className="hover:shadow-md transition-all apple-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full mb-3">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <p className="font-medium">Hospital Locator</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/chat">
              <Card className="hover:shadow-md transition-all apple-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full mb-3">
                    <MessageCircle className="h-6 w-6 text-green-500" />
                  </div>
                  <p className="font-medium">Chat with Doctor</p>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/ambulance">
              <Card className="hover:shadow-md transition-all apple-card">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full mb-3">
                    <Heart className="h-6 w-6 text-orange-500" />
                  </div>
                  <p className="font-medium">Book Ambulance</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <AiMedicalToolsWidget className="apple-card" />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 sf-pro-text">Your Health</h2>
          
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-4">
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="history">Medical History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Upcoming Appointments</CardTitle>
                    <Link to="/ai-features?feature=appointments">
                      <Button size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        Book New
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>Your scheduled medical appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <div className="h-20 bg-muted animate-pulse rounded-lg"></div>
                      <div className="h-20 bg-muted animate-pulse rounded-lg"></div>
                    </div>
                  ) : appointments.length > 0 ? (
                    <div className="space-y-4">
                      {appointments.map(appointment => (
                        <div key={appointment.id} className="p-4 border rounded-lg flex justify-between items-center">
                          <div>
                            <p className="font-medium">{appointment.doctor_name}</p>
                            <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                            <div className="flex items-center mt-1 text-sm">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>
                                {new Date(appointment.appointment_date).toLocaleDateString()} at {" "}
                                {new Date(appointment.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            </div>
                            {appointment.hospitals && (
                              <div className="flex items-center mt-1 text-sm">
                                <MapPin className="h-3 w-3 mr-1" />
                                <span>{appointment.hospitals.name}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Reschedule</Button>
                            <Button variant="outline" size="sm">Cancel</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Calendar className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                      <p className="text-muted-foreground">No upcoming appointments.</p>
                      <Link to="/ai-features?feature=appointments">
                        <Button variant="outline" className="mt-4">
                          Schedule Your First Appointment
                        </Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="medications">
              <Card>
                <CardHeader>
                  <CardTitle>Current Medications</CardTitle>
                  <CardDescription>Your prescribed medications and schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentMedications.length > 0 ? (
                    <div className="space-y-4">
                      {recentMedications.map(medication => (
                        <div key={medication.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between">
                            <p className="font-medium">{medication.name} ({medication.dosage})</p>
                            <Badge variant="outline">{new Date(medication.endDate) > new Date() ? "Active" : "Completed"}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{medication.frequency}</p>
                          <p className="text-sm mt-1">
                            {medication.startDate} to {medication.endDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center py-4 text-muted-foreground">
                      No current medications prescribed.
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Medical History</CardTitle>
                    <Link to="/medical-history">
                      <Button size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Full History
                      </Button>
                    </Link>
                  </div>
                  <CardDescription>Your recent medical events and conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="relative pl-6 pb-4 border-l border-dashed">
                      <div className="absolute top-0 left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-blue-500"></div>
                      <p className="font-medium">Annual Physical Examination</p>
                      <p className="text-sm text-muted-foreground">June 12, 2023</p>
                      <p className="text-sm mt-1">
                        Results: Normal, blood pressure slightly elevated. Recommended follow-up in 3 months.
                      </p>
                    </div>
                    
                    <div className="relative pl-6 pb-4 border-l border-dashed">
                      <div className="absolute top-0 left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-red-500"></div>
                      <p className="font-medium">Emergency Room Visit</p>
                      <p className="text-sm text-muted-foreground">March 3, 2023</p>
                      <p className="text-sm mt-1">
                        Severe migraine. Treated with pain medication and hydration. Discharged same day.
                      </p>
                    </div>
                    
                    <div className="relative pl-6">
                      <div className="absolute top-0 left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-green-500"></div>
                      <p className="font-medium">Vaccination</p>
                      <p className="text-sm text-muted-foreground">January 15, 2023</p>
                      <p className="text-sm mt-1">
                        COVID-19 booster shot. No adverse reactions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>
      </main>
    </div>
  );
};

export default UserDashboard;
