
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface QueueEntry {
  id: string;
  position_in_queue: number;
  estimated_wait_time: number;
  status: string;
  doctor_name: string;
  specialty: string;
  check_in_time: string;
}

const QueueManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [queueEntries, setQueueEntries] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueueEntries();
  }, []);

  const fetchQueueEntries = async () => {
    try {
      const { data: entries, error } = await supabase
        .from('patient_queue')
        .select(`
          id,
          position_in_queue,
          estimated_wait_time,
          status,
          check_in_time,
          appointments (
            doctor_name,
            specialty
          )
        `)
        .eq('status', 'waiting')
        .order('position_in_queue', { ascending: true });

      if (error) throw error;
      setQueueEntries(entries || []);
    } catch (error) {
      console.error('Error fetching queue entries:', error);
      toast({
        title: "Error",
        description: "Failed to load queue information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Patient Queue Management</h1>
      {loading ? (
        <p>Loading queue information...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {queueEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle>Queue Position: {entry.position_in_queue}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Estimated Wait: {entry.estimated_wait_time} minutes
                </p>
                <p className="font-medium">Dr. {entry.doctor_name}</p>
                <p className="text-sm text-muted-foreground">{entry.specialty}</p>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate('/appointments')}
                  >
                    View Appointment Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {queueEntries.length === 0 && (
            <p>No active queue entries found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default QueueManagement;
