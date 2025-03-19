
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Activity, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AiAnalysisTabProps {
  aiAnalysis: string;
  onAddData: () => void;
}

const AiAnalysisTab: React.FC<AiAnalysisTabProps> = ({ aiAnalysis, onAddData }) => {
  if (!aiAnalysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">AI Health Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No Analysis Available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add vital sign readings to get personalized AI health insights.
            </p>
            <Button onClick={onAddData}>
              <Plus className="h-4 w-4 mr-2" /> Add Health Data
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">AI Health Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <p>{aiAnalysis}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default AiAnalysisTab;
