
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? `https://${Deno.env.get('SUPABASE_ID')}.supabase.co`;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseKey) throw new Error('Missing Supabase key');

    // Initialize Supabase client with the service role key
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Process queue management request
    const { action, queueId, appointmentId, userId, hospitalId } = await req.json();
    
    switch (action) {
      case 'check_in':
        // Patient checking in to the queue
        const checkInData = {
          appointment_id: appointmentId,
          user_id: userId,
          hospital_id: hospitalId,
          check_in_time: new Date().toISOString(),
          estimated_wait_time: 15, // Default 15 minutes wait time
          status: 'waiting'
        };
        
        const checkInResult = await supabase.from('patient_queue').insert(checkInData);
        
        if (checkInResult.error) throw checkInResult.error;
        
        // Get current position in queue
        const queuePosition = await supabase
          .from('patient_queue')
          .select('position_in_queue')
          .eq('appointment_id', appointmentId)
          .single();
          
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Successfully checked in to queue",
            position: queuePosition.data?.position_in_queue,
            estimatedWaitTime: checkInData.estimated_wait_time
          }),
          { 
            headers: { 
              ...corsHeaders,
              "Content-Type": "application/json" 
            } 
          }
        );
        
      case 'update_status':
        // Update patient status (e.g. from waiting to with_doctor)
        const { status } = await req.json();
        
        const statusUpdateResult = await supabase
          .from('patient_queue')
          .update({ status })
          .eq('id', queueId);
          
        if (statusUpdateResult.error) throw statusUpdateResult.error;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Queue status updated to ${status}`,
            queueId 
          }),
          { 
            headers: { 
              ...corsHeaders,
              "Content-Type": "application/json" 
            } 
          }
        );
        
      case 'get_queue_info':
        // Get current queue information for a specific hospital
        const queueInfo = await supabase
          .from('patient_queue')
          .select(`
            id,
            position_in_queue,
            estimated_wait_time,
            status,
            check_in_time,
            appointments!inner(
              id,
              doctor_name,
              specialty,
              appointment_date
            )
          `)
          .eq('hospital_id', hospitalId)
          .eq('status', 'waiting');
          
        return new Response(
          JSON.stringify({ 
            success: true, 
            queue: queueInfo.data || [],
            waitingCount: queueInfo.data?.length || 0
          }),
          { 
            headers: { 
              ...corsHeaders,
              "Content-Type": "application/json" 
            } 
          }
        );
        
      default:
        return new Response(
          JSON.stringify({ 
            error: "Invalid queue management action" 
          }),
          { 
            status: 400,
            headers: { 
              ...corsHeaders,
              "Content-Type": "application/json" 
            } 
          }
        );
    }
  } catch (error) {
    console.error("Error processing queue management request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your queue management request.",
        details: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  }
});
