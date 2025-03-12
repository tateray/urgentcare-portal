
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
    
    // Process notification request
    const { action, appointmentId, userId, message } = await req.json();
    
    switch (action) {
      case 'create_appointment':
        // Logic for creating a new appointment notification
        const appointmentData = await supabase
          .from('appointments')
          .select('*')
          .eq('id', appointmentId)
          .single();
        
        if (appointmentData.error) throw appointmentData.error;
        
        // Here you would typically send an email or SMS notification
        // For demo, we'll just update the appointment record
        const updateResult = await supabase
          .from('appointments')
          .update({ notification_sent: true })
          .eq('id', appointmentId);
        
        if (updateResult.error) throw updateResult.error;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Appointment notification sent successfully",
            appointmentId 
          }),
          { 
            headers: { 
              ...corsHeaders,
              "Content-Type": "application/json" 
            } 
          }
        );
        
      case 'reminder':
        // Logic for sending appointment reminders
        // This would typically be triggered by a cron job
        const reminderResult = await supabase
          .from('appointments')
          .update({ notification_sent: true })
          .eq('id', appointmentId);
          
        if (reminderResult.error) throw reminderResult.error;
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: "Appointment reminder sent successfully",
            appointmentId 
          }),
          { 
            headers: { 
              ...corsHeaders,
              "Content-Type": "application/json" 
            } 
          }
        );
        
      case 'reschedule':
      case 'cancel':
        // Logic for rescheduling or cancellation notifications
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: `Appointment ${action} notification sent`,
            appointmentId 
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
            error: "Invalid notification action" 
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
    console.error("Error processing notification request:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing your notification request.",
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
