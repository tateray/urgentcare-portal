
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Star, StarOff, Phone, Plus, User, Trash2, Hash } from "lucide-react";

// Mock emergency contacts - would be replaced with Firebase data in production
const defaultEmergencyContacts = [
  { id: 1, name: "Zimbabwe Emergency Services", phone: "999", isFavorite: true, isDefault: true },
  { id: 2, name: "Zimbabwe Police", phone: "995", isFavorite: true, isDefault: false },
  { id: 3, name: "Fire Department", phone: "993", isFavorite: false, isDefault: false },
  { id: 4, name: "Ambulance Services", phone: "994", isFavorite: true, isDefault: false },
];

interface Contact {
  id: number;
  name: string;
  phone: string;
  isFavorite: boolean;
  isDefault: boolean;
}

const PhonebookDialer = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>(defaultEmergencyContacts);
  const [dialerNumber, setDialerNumber] = useState<string>("");
  const [showAddContactDialog, setShowAddContactDialog] = useState<boolean>(false);
  const [newContactName, setNewContactName] = useState<string>("");
  const [newContactPhone, setNewContactPhone] = useState<string>("");
  
  const handleAddDigit = (digit: string) => {
    setDialerNumber(prev => prev + digit);
  };
  
  const handleBackspace = () => {
    setDialerNumber(prev => prev.slice(0, -1));
  };
  
  const handleCall = (number: string) => {
    toast({
      title: "Calling...",
      description: `Dialing ${number}`,
    });
    
    // In a real app, this would trigger the phone call
    window.location.href = `tel:${number}`;
  };
  
  const handleToggleFavorite = (id: number) => {
    setContacts(contacts.map(contact => 
      contact.id === id 
        ? { ...contact, isFavorite: !contact.isFavorite }
        : contact
    ));
  };
  
  const handleDeleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
    toast({
      title: "Contact Deleted",
      description: "Emergency contact has been removed",
    });
  };
  
  const handleAddContact = () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and phone number",
        variant: "destructive",
      });
      return;
    }
    
    const newContact = {
      id: Date.now(),
      name: newContactName,
      phone: newContactPhone,
      isFavorite: false,
      isDefault: false,
    };
    
    setContacts([...contacts, newContact]);
    setNewContactName("");
    setNewContactPhone("");
    setShowAddContactDialog(false);
    
    toast({
      title: "Contact Added",
      description: "New emergency contact has been added",
    });
  };

  return (
    <div className="mb-6">
      <Tabs defaultValue="dialer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="dialer">Dialer</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="contacts">All Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dialer" className="space-y-4 pt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center mb-4">
                <Input 
                  value={dialerNumber}
                  onChange={(e) => setDialerNumber(e.target.value)}
                  className="text-2xl text-center mb-4 font-mono"
                  placeholder="Enter number"
                />
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((digit) => (
                    <Button
                      key={digit}
                      variant="outline"
                      className="h-14 w-14 rounded-full mx-auto font-semibold text-lg"
                      onClick={() => handleAddDigit(digit.toString())}
                    >
                      {digit}
                      {digit === 0 && <span className="ml-1 text-xs">+</span>}
                    </Button>
                  ))}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button 
                    variant="outline"
                    className="h-14 w-14 rounded-full"
                    onClick={handleBackspace}
                  >
                    <Trash2 className="h-6 w-6" />
                  </Button>
                  
                  <Button
                    variant="default"
                    className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600"
                    onClick={() => handleCall(dialerNumber)}
                    disabled={!dialerNumber.trim()}
                  >
                    <Phone className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="favorites" className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Favorite Contacts</h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddContactDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
          
          {contacts.filter(c => c.isFavorite).map(contact => (
            <Card key={contact.id} className="mb-2">
              <CardContent className="p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(contact.id)}
                  >
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCall(contact.phone)}
                  >
                    <Phone className="h-5 w-5 text-green-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {contacts.filter(c => c.isFavorite).length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              <p>No favorite contacts yet.</p>
              <p className="text-sm">Add contacts to your favorites for quick access.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4 pt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">All Contacts</h3>
            <Button variant="outline" size="sm" onClick={() => setShowAddContactDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </div>
          
          {contacts.map(contact => (
            <Card key={contact.id} className="mb-2">
              <CardContent className="p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.phone}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(contact.id)}
                  >
                    {contact.isFavorite ? (
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-5 w-5" />
                    )}
                  </Button>
                  {!contact.isDefault && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteContact(contact.id)}
                    >
                      <Trash2 className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleCall(contact.phone)}
                  >
                    <Phone className="h-5 w-5 text-green-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
      
      <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>
              Add a new emergency contact to your phonebook.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={newContactName}
                onChange={(e) => setNewContactName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Phone
              </Label>
              <Input
                id="phone"
                value={newContactPhone}
                onChange={(e) => setNewContactPhone(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContactDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddContact}>
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhonebookDialer;

import { Label } from "@/components/ui/label";
