
import React from 'react';
import { Helmet } from 'react-helmet';
import SelfHelpWidget from '@/components/SelfHelpWidget';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, Info, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { auth } from '@/lib/firebase';

const SelfHealthMonitoring: React.FC = () => {
  const user = auth.currentUser;
  
  return (
    <div className="container mx-auto pb-20 pt-4 px-4">
      <Helmet>
        <title>Self Health Monitoring | MediConnect</title>
      </Helmet>
      
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/user-dashboard">
            <Button variant="ghost" size="sm" className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Self Health Monitoring</h1>
        </div>
        
        <Button variant="outline" size="sm" className="gap-1">
          <Info className="h-4 w-4" /> Help
        </Button>
      </div>
      
      <Card className="mb-6 bg-blue-50 border-0">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="mr-4 mt-1 bg-blue-100 p-2 rounded-full">
              <Info className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Monitor your health metrics</h3>
              <p className="text-sm text-gray-600 mb-2">
                Track your vital signs, get AI insights, and share data securely with healthcare providers.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1" /> Export Data
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <SelfHelpWidget userId={user?.uid} className="mb-6" />
      
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>Always consult with healthcare professionals for medical advice.</p>
        <p>This tool is for informational purposes only.</p>
      </div>
    </div>
  );
};

export default SelfHealthMonitoring;
