
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Share2, Download, Plus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Mock medical history data - would be replaced with Firebase data
const mockMedicalRecords = [
  { 
    id: 1, 
    date: "2023-10-15", 
    doctor: "Dr. Moyo", 
    facility: "Parirenyatwa Hospital",
    diagnosis: "Common Cold",
    notes: "Prescribed rest and fluids. Follow-up not required.",
    medications: ["Paracetamol", "Vitamin C"]
  },
  { 
    id: 2, 
    date: "2023-05-22", 
    doctor: "Dr. Ncube", 
    facility: "Avenues Clinic",
    diagnosis: "Minor Sprain",
    notes: "Right ankle sprain from sports activity. Apply ice and rest for 3 days.",
    medications: ["Ibuprofen"]
  },
  { 
    id: 3, 
    date: "2022-12-07", 
    doctor: "Dr. Sibanda", 
    facility: "Westend Hospital",
    diagnosis: "Annual Physical",
    notes: "All vitals normal. Recommended increased physical activity.",
    medications: []
  }
];

// Mock allergies and conditions
const mockAllergies = ["Penicillin", "Peanuts"];
const mockConditions = ["Asthma", "Hypertension"];

const MedicalRecordCard = ({ record }: { record: typeof mockMedicalRecords[0] }) => {
  const { toast } = useToast();
  
  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{record.diagnosis}</CardTitle>
          <span className="text-sm text-muted-foreground">{record.date}</span>
        </div>
        <CardDescription>{record.facility} • {record.doctor}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm">
          <p className="font-medium mb-1">Notes:</p>
          <p className="text-muted-foreground">{record.notes}</p>
          
          {record.medications.length > 0 && (
            <div className="mt-2">
              <p className="font-medium mb-1">Medications:</p>
              <ul className="list-disc pl-5 text-muted-foreground">
                {record.medications.map((med, idx) => (
                  <li key={idx}>{med}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="mr-2" onClick={() => {
          toast({
            title: "Medical Record Shared",
            description: "Record has been shared with your selected contact",
          });
        }}>
          <Share2 className="h-4 w-4 mr-1" /> Share
        </Button>
        <Button variant="outline" size="sm" onClick={() => {
          toast({
            title: "Downloading Record",
            description: "Your medical record is being downloaded",
          });
        }}>
          <Download className="h-4 w-4 mr-1" /> Download
        </Button>
      </CardFooter>
    </Card>
  );
};

const MedicalHistory = () => {
  const { toast } = useToast();
  const [records] = useState(mockMedicalRecords);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Medical History</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="h-5 w-5 text-destructive mr-2" />
              Allergies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mockAllergies.length > 0 ? (
              <ul className="list-disc pl-5">
                {mockAllergies.map((allergy, idx) => (
                  <li key={idx} className="mb-1">{allergy}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No allergies recorded</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => {
              toast({
                title: "Add Allergy",
                description: "Please consult your healthcare provider to update allergies",
              });
            }}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Chronic Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            {mockConditions.length > 0 ? (
              <ul className="list-disc pl-5">
                {mockConditions.map((condition, idx) => (
                  <li key={idx} className="mb-1">{condition}</li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No chronic conditions recorded</p>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => {
              toast({
                title: "Update Conditions",
                description: "Please consult your healthcare provider to update conditions",
              });
            }}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">Upload medical documents</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" onClick={() => {
              toast({
                title: "Upload Document",
                description: "Please select a document to upload",
              });
            }}>
              <Plus className="h-4 w-4 mr-1" /> Upload
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Medical Records</h2>
      {records.map(record => (
        <MedicalRecordCard key={record.id} record={record} />
      ))}
      
      <div className="flex justify-center mt-6">
        <Button onClick={() => {
          toast({
            title: "Request Medical Records",
            description: "Contact your healthcare provider to request additional records",
          });
        }}>
          <Plus className="h-4 w-4 mr-2" /> Add Medical Record
        </Button>
      </div>
    </div>
  );
};

export default MedicalHistory;
