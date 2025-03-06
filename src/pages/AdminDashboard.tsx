
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ambulance, User, Phone, Calendar, MapPin, Bell, LogOut, BarChart, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [selectedAmbulance, setSelectedAmbulance] = useState<any>(null);
  const [showAddAmbulanceDialog, setShowAddAmbulanceDialog] = useState<boolean>(false);
  const [newAmbulanceId, setNewAmbulanceId] = useState<string>("");
  const [newAmbulanceDriver, setNewAmbulanceDriver] = useState<string>("");

  // Mock data - would be fetched from Firebase/Supabase in production
  const ambulances = [
    { id: "AMB-001", status: "available", driver: "John Doe", location: "Harare Central" },
    { id: "AMB-002", status: "dispatched", driver: "Jane Smith", location: "Chitungwiza", patient: "Michael Brown", destination: "Parirenyatwa Hospital" },
    { id: "AMB-003", status: "maintenance", driver: "Robert Johnson", location: "Service Center" },
    { id: "AMB-004", status: "available", driver: "Sarah Williams", location: "Avenues" },
  ];

  const emergencyRequests = [
    { id: "ER-001", time: "10:32 AM", patient: "Thomas Moyo", location: "12 Samora Machel Ave", status: "pending" },
    { id: "ER-002", time: "09:45 AM", patient: "Grace Ncube", location: "25 Second St, Harare", status: "dispatched", ambulance: "AMB-002" },
    { id: "ER-003", time: "08:15 AM", patient: "David Mutasa", location: "7 Livingstone Ave", status: "completed" },
  ];

  const patients = [
    { id: "P-001", name: "Thomas Moyo", age: 45, lastVisit: "2023-05-10", condition: "Hypertension" },
    { id: "P-002", name: "Grace Ncube", age: 32, lastVisit: "2023-06-22", condition: "Pregnancy - 3rd Trimester" },
    { id: "P-003", name: "David Mutasa", age: 58, lastVisit: "2023-04-15", condition: "Diabetes" },
    { id: "P-004", name: "Mary Shumba", age: 27, lastVisit: "2023-06-18", condition: "Asthma" },
  ];

  const handleAmbulanceClick = (ambulance: any) => {
    setSelectedAmbulance(ambulance);
  };

  const handleAddAmbulance = () => {
    if (!newAmbulanceId || !newAmbulanceDriver) {
      toast({
        title: "Missing Information",
        description: "Please provide both ambulance ID and driver name",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Ambulance Added",
      description: `New ambulance ${newAmbulanceId} has been added to the fleet`,
    });

    setNewAmbulanceId("");
    setNewAmbulanceDriver("");
    setShowAddAmbulanceDialog(false);
  };

  const renderDashboardStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex flex-col items-center">
          <div className="bg-blue-100 p-2 rounded-full mb-2">
            <Ambulance className="h-6 w-6 text-blue-700" />
          </div>
          <p className="text-2xl font-semibold">{ambulances.length}</p>
          <p className="text-sm text-muted-foreground">Ambulances</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center">
          <div className="bg-green-100 p-2 rounded-full mb-2">
            <Phone className="h-6 w-6 text-green-700" />
          </div>
          <p className="text-2xl font-semibold">{emergencyRequests.filter(r => r.status === "pending").length}</p>
          <p className="text-sm text-muted-foreground">Pending Calls</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center">
          <div className="bg-purple-100 p-2 rounded-full mb-2">
            <Users className="h-6 w-6 text-purple-700" />
          </div>
          <p className="text-2xl font-semibold">{patients.length}</p>
          <p className="text-sm text-muted-foreground">Active Patients</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 flex flex-col items-center">
          <div className="bg-yellow-100 p-2 rounded-full mb-2">
            <Clock className="h-6 w-6 text-yellow-700" />
          </div>
          <p className="text-2xl font-semibold">5.2 min</p>
          <p className="text-sm text-muted-foreground">Avg. Response Time</p>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto py-6 px-4 min-h-screen bg-background">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center pb-6 border-b mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage emergency services and resources</p>
        </div>
        <div className="flex mt-4 md:mt-0 gap-2">
          <Link to="/">
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
              <Badge className="ml-2 bg-destructive">3</Badge>
            </Button>
          </Link>
          <Link to="/auth">
            <Button variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </Link>
        </div>
      </div>

      {renderDashboardStats()}

      <Tabs defaultValue="ambulances" className="w-full">
        <TabsList className="w-full grid grid-cols-3 mb-4">
          <TabsTrigger value="ambulances">Ambulances</TabsTrigger>
          <TabsTrigger value="emergencies">Emergency Requests</TabsTrigger>
          <TabsTrigger value="patients">Patients</TabsTrigger>
        </TabsList>
        
        <TabsContent value="ambulances">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Ambulance Fleet</h2>
            <Button onClick={() => setShowAddAmbulanceDialog(true)}>
              Add Ambulance
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ambulances.map((ambulance) => (
              <Card 
                key={ambulance.id}
                className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => handleAmbulanceClick(ambulance)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{ambulance.id}</CardTitle>
                    <Badge 
                      className={
                        ambulance.status === "available" ? "bg-green-500" :
                        ambulance.status === "dispatched" ? "bg-orange-500" :
                        "bg-slate-500"
                      }
                    >
                      {ambulance.status}
                    </Badge>
                  </div>
                  <CardDescription>{ambulance.driver}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{ambulance.location}</span>
                  </div>
                  
                  {ambulance.status === "dispatched" && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">Current Job:</p>
                      <p>Patient: {ambulance.patient}</p>
                      <p>Destination: {ambulance.destination}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="emergencies">
          <h2 className="text-xl font-semibold mb-4">Emergency Requests</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Time</th>
                  <th className="py-2 px-4 text-left">Patient</th>
                  <th className="py-2 px-4 text-left">Location</th>
                  <th className="py-2 px-4 text-left">Status</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {emergencyRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4">{request.id}</td>
                    <td className="py-2 px-4">{request.time}</td>
                    <td className="py-2 px-4">{request.patient}</td>
                    <td className="py-2 px-4">{request.location}</td>
                    <td className="py-2 px-4">
                      <Badge 
                        className={
                          request.status === "pending" ? "bg-yellow-500" :
                          request.status === "dispatched" ? "bg-blue-500" :
                          "bg-green-500"
                        }
                      >
                        {request.status}
                      </Badge>
                    </td>
                    <td className="py-2 px-4">
                      {request.status === "pending" && (
                        <Button variant="outline" size="sm">
                          Dispatch
                        </Button>
                      )}
                      {request.status === "dispatched" && (
                        <Button variant="outline" size="sm">
                          Track
                        </Button>
                      )}
                      {request.status === "completed" && (
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="patients">
          <h2 className="text-xl font-semibold mb-4">Patient Records</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">ID</th>
                  <th className="py-2 px-4 text-left">Name</th>
                  <th className="py-2 px-4 text-left">Age</th>
                  <th className="py-2 px-4 text-left">Last Visit</th>
                  <th className="py-2 px-4 text-left">Condition</th>
                  <th className="py-2 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient) => (
                  <tr key={patient.id} className="border-b hover:bg-muted/50">
                    <td className="py-2 px-4">{patient.id}</td>
                    <td className="py-2 px-4">{patient.name}</td>
                    <td className="py-2 px-4">{patient.age}</td>
                    <td className="py-2 px-4">{patient.lastVisit}</td>
                    <td className="py-2 px-4">{patient.condition}</td>
                    <td className="py-2 px-4">
                      <Button variant="outline" size="sm">
                        View Record
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Ambulance Details Dialog */}
      <Dialog open={!!selectedAmbulance} onOpenChange={() => setSelectedAmbulance(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedAmbulance && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Ambulance className="h-5 w-5" />
                  Ambulance {selectedAmbulance.id}
                </DialogTitle>
                <DialogDescription>
                  View and manage ambulance details
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Driver</Label>
                  <div className="col-span-3">{selectedAmbulance.driver}</div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Status</Label>
                  <div className="col-span-3">
                    <Badge 
                      className={
                        selectedAmbulance.status === "available" ? "bg-green-500" :
                        selectedAmbulance.status === "dispatched" ? "bg-orange-500" :
                        "bg-slate-500"
                      }
                    >
                      {selectedAmbulance.status}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Location</Label>
                  <div className="col-span-3">{selectedAmbulance.location}</div>
                </div>
                
                {selectedAmbulance.status === "dispatched" && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Patient</Label>
                      <div className="col-span-3">{selectedAmbulance.patient}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Destination</Label>
                      <div className="col-span-3">{selectedAmbulance.destination}</div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="p-4 bg-muted rounded-lg mb-4">
                <h4 className="font-medium mb-2">Last 24 Hours Activity</h4>
                <ul className="text-sm space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">08:30 AM</span>
                    <span>Started shift at Harare Central</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">09:45 AM</span>
                    <span>Dispatched to emergency at 25 Second St</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">10:30 AM</span>
                    <span>Arrived at emergency location</span>
                  </li>
                </ul>
              </div>
              
              <DialogFooter className="flex gap-2 justify-end">
                <Button variant="outline">
                  Maintenance Log
                </Button>
                <Button>
                  {selectedAmbulance.status === "available" ? "Dispatch" : 
                   selectedAmbulance.status === "dispatched" ? "Track Live" : 
                   "Return to Service"}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Add Ambulance Dialog */}
      <Dialog open={showAddAmbulanceDialog} onOpenChange={setShowAddAmbulanceDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Ambulance</DialogTitle>
            <DialogDescription>
              Add a new ambulance to your emergency fleet.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ambulance-id" className="text-right">
                Ambulance ID
              </Label>
              <Input
                id="ambulance-id"
                value={newAmbulanceId}
                onChange={(e) => setNewAmbulanceId(e.target.value)}
                placeholder="AMB-XXX"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="driver-name" className="text-right">
                Driver
              </Label>
              <Input
                id="driver-name"
                value={newAmbulanceDriver}
                onChange={(e) => setNewAmbulanceDriver(e.target.value)}
                placeholder="Driver Name"
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAmbulanceDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddAmbulance}>
              Add Ambulance
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
