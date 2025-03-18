
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Stethoscope, 
  Tooth, 
  Baby, 
  Brain, 
  Bone, 
  Eye, 
  Microscope, 
  Pill, 
  Activity 
} from "lucide-react";

interface SpecialtyOption {
  icon: React.ReactNode;
  name: string;
  color: string;
  bgColor: string;
  path: string;
}

const specialties: SpecialtyOption[] = [
  {
    icon: <Heart className="h-6 w-6" />,
    name: "Cardiology",
    color: "text-primary",
    bgColor: "bg-primary/10",
    path: "/specialty/cardiology"
  },
  {
    icon: <Tooth className="h-6 w-6" />,
    name: "Dental",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    path: "/specialty/dental"
  },
  {
    icon: <Baby className="h-6 w-6" />,
    name: "Pediatrics",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    path: "/specialty/pediatrics"
  },
  {
    icon: <Brain className="h-6 w-6" />,
    name: "Neurology",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    path: "/specialty/neurology"
  },
  {
    icon: <Bone className="h-6 w-6" />,
    name: "Orthopedics",
    color: "text-green-600",
    bgColor: "bg-green-50",
    path: "/specialty/orthopedics"
  },
  {
    icon: <Eye className="h-6 w-6" />,
    name: "Ophthalmology",
    color: "text-cyan-600",
    bgColor: "bg-cyan-50",
    path: "/specialty/ophthalmology"
  },
  {
    icon: <Stethoscope className="h-6 w-6" />,
    name: "General",
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    path: "/specialty/general"
  },
  {
    icon: <Microscope className="h-6 w-6" />,
    name: "Diagnostics",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    path: "/specialty/diagnostics"
  },
  {
    icon: <Pill className="h-6 w-6" />,
    name: "Pharmacy",
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    path: "/specialty/pharmacy"
  },
  {
    icon: <Activity className="h-6 w-6" />,
    name: "Emergency",
    color: "text-red-600",
    bgColor: "bg-red-50",
    path: "/specialty/emergency"
  }
];

interface SpecialtyMenuProps {
  onSelect?: (specialty: string) => void;
  className?: string;
}

const SpecialtyMenu: React.FC<SpecialtyMenuProps> = ({ onSelect, className }) => {
  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {specialties.map((specialty) => (
          <Card 
            key={specialty.name}
            className="specialty-card cursor-pointer hover:scale-105 transition-all"
            onClick={() => onSelect && onSelect(specialty.path)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <div className={`w-14 h-14 rounded-full ${specialty.bgColor} flex items-center justify-center mb-3`}>
                <div className={specialty.color}>{specialty.icon}</div>
              </div>
              <span className="font-medium">{specialty.name}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SpecialtyMenu;
