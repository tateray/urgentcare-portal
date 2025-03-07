
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface AddEmergencyNumberProps {
  onAddContact: (contact: { name: string; phone: string; isDefault: boolean }) => void;
}

const AddEmergencyNumber: React.FC<AddEmergencyNumberProps> = ({ onAddContact }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !phone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and phone number",
        variant: "destructive",
      });
      return;
    }
    
    onAddContact({
      name,
      phone,
      isDefault
    });
    
    // Reset the form
    setName('');
    setPhone('');
    setIsDefault(false);
    setOpen(false);
    
    toast({
      title: "Emergency Contact Added",
      description: `${name} has been added to your emergency contacts`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('add_contact')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('add_new_contact')}</DialogTitle>
          <DialogDescription>
            Add a new emergency contact to your directory.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="name">{t('contact_name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="E.g., Local Police, Hospital"
            />
          </div>
          
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="phone">{t('phone_number')}</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="E.g., 999, +263 71 234 5678"
              type="tel"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              id="isDefault"
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
            />
            <Label htmlFor="isDefault" className="text-sm font-normal">
              Mark as critical emergency service
            </Label>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t('cancel')}
            </Button>
            <Button type="submit">{t('add_contact')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmergencyNumber;
