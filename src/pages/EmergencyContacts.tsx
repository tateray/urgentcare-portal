
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Phone, User, Star, StarOff, Plus, Trash2, ArrowLeft, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

// Mock emergency contacts - would be replaced with Firebase data
const mockContacts = [
  { id: 1, name: "Zimbabwe Emergency Services", phone: "999", isFavorite: true, isDefault: true },
  { id: 2, name: "Zimbabwe Police", phone: "995", isFavorite: true, isDefault: false },
  { id: 3, name: "Fire Department", phone: "993", isFavorite: false, isDefault: false },
  { id: 4, name: "Ambulance Services", phone: "994", isFavorite: true, isDefault: false },
  { id: 5, name: "Mom", phone: "+263 77 123 4567", isFavorite: true, isDefault: false },
];

const EmergencyContactCard = ({ 
  contact, 
  onToggleFavorite,
  onDelete
}: { 
  contact: typeof mockContacts[0],
  onToggleFavorite: (id: number) => void,
  onDelete: (id: number) => void
}) => {
  const { toast } = useToast();
  
  const handleCall = () => {
    toast({
      title: `Calling ${contact.name}`,
      description: `Dialing ${contact.phone}...`,
    });
    
    // In a real app, this would trigger the phone call
    setTimeout(() => {
      window.location.href = `tel:${contact.phone}`;
    }, 1000);
  };
  
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              contact.isDefault ? 'bg-destructive text-white' : 'bg-muted'
            }`}>
              {contact.isDefault ? (
                <Heart className="h-5 w-5" />
              ) : (
                <User className="h-5 w-5" />
              )}
            </div>
            <div>
              <h3 className="font-medium">
                {contact.name} 
                {contact.isDefault && (
                  <span className="ml-2 text-xs text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                    Default
                  </span>
                )}
              </h3>
              <p className="text-muted-foreground text-sm">{contact.phone}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onToggleFavorite(contact.id)}
            >
              {contact.isFavorite ? (
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              ) : (
                <StarOff className="h-5 w-5" />
              )}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(contact.id)}
              disabled={contact.isDefault}
            >
              <Trash2 className="h-5 w-5 text-muted-foreground" />
            </Button>
            
            <Button 
              variant="default"
              size="icon"
              onClick={handleCall}
            >
              <Phone className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EmergencyContacts = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState(mockContacts);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  
  const handleToggleFavorite = (id: number) => {
    setContacts(contacts.map(contact => 
      contact.id === id 
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    ));
  };
  
  const handleDelete = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Deleted",
      description: "Emergency contact has been removed",
    });
  };
  
  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and phone number",
        variant: "destructive",
      });
      return;
    }
    
    const newContact = {
      id: Date.now(),
      name: newName,
      phone: newPhone,
      isFavorite: false,
      isDefault: false,
    };
    
    setContacts([...contacts, newContact]);
    setNewName("");
    setNewPhone("");
    
    toast({
      title: "Contact Added",
      description: "New emergency contact has been added",
    });
  };
  
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Emergency Contacts</h1>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Contact Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              <Input
                placeholder="Phone Number"
                type="tel"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
              />
            </div>
            <Button onClick={handleAddContact}>
              <Plus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <h2 className="text-xl font-semibold mb-4">Favorites</h2>
      {contacts.filter(c => c.isFavorite).map(contact => (
        <EmergencyContactCard 
          key={contact.id} 
          contact={contact} 
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
        />
      ))}
      
      <h2 className="text-xl font-semibold my-4">All Contacts</h2>
      {contacts.filter(c => !c.isFavorite).map(contact => (
        <EmergencyContactCard 
          key={contact.id} 
          contact={contact} 
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default EmergencyContacts;
