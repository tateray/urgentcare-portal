
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList } from "lucide-react";

interface UserInfo {
  name: string;
  image?: string;
}

interface InsuranceInfo {
  title: string;
  coverage: string;
  available: string;
  spent: string;
}

interface WelcomeCardProps {
  user: UserInfo;
  insurance: InsuranceInfo;
  className?: string;
}

const WelcomeCard: React.FC<WelcomeCardProps> = ({ 
  user, 
  insurance,
  className 
}) => {
  return (
    <Card className={`overflow-hidden rounded-2xl ${className}`}>
      <div className="relative">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 p-6 md:p-8">
            <div className="space-y-6">
              <div>
                <p className="text-lg text-muted-foreground">Welcome!</p>
                <h1 className="text-3xl font-bold mt-1">{user.name}</h1>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-bold flex items-center">
                  <ClipboardList className="mr-2 h-5 w-5 text-primary" />
                  {insurance.title}
                </h2>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Spent</span>
                    <span className="font-semibold">${insurance.spent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available</span>
                    <span className="font-semibold">${insurance.available}</span>
                  </div>
                </div>
                
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full" 
                    style={{ 
                      width: `${(parseInt(insurance.spent) / (parseInt(insurance.spent) + parseInt(insurance.available)) * 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 bg-gray-100 relative">
            {user.image ? (
              <img 
                src={user.image} 
                alt={user.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gray-200">
                <span className="text-gray-400 text-lg">No image available</span>
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 h-24 pattern-dots"></div>
            <div className="absolute bottom-0 left-0 w-full h-24 pattern-lines"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WelcomeCard;
