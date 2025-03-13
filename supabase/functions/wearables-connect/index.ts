
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
    const { provider, accessToken, userId, action } = await req.json();
    
    // Validate required parameters
    if (!provider || !action) {
      throw new Error('Missing required parameters');
    }
    
    // Initialize response data
    let responseData;
    let authUrl;
    
    switch (action) {
      case 'auth':
        // Generate authentication URL based on provider
        if (provider === 'google_fit') {
          // Google Fit OAuth URL generation
          const clientId = Deno.env.get('GOOGLE_FIT_CLIENT_ID') || '';
          const redirectUri = Deno.env.get('APP_URL') + '/wearables?provider=google_fit';
          
          const scope = encodeURIComponent([
            'https://www.googleapis.com/auth/fitness.activity.read',
            'https://www.googleapis.com/auth/fitness.heart_rate.read',
            'https://www.googleapis.com/auth/fitness.sleep.read'
          ].join(' '));
          
          authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;
          responseData = { authUrl };
          
        } else if (provider === 'apple_health') {
          // For Apple Health, we usually handle auth on the client-side via the native SDK
          // This is a placeholder - in production you'd have a more complex implementation
          responseData = { 
            message: 'Apple Health authentication should be performed on iOS devices using HealthKit' 
          };
          
        } else if (provider === 'fitbit') {
          // Fitbit OAuth URL generation
          const clientId = Deno.env.get('FITBIT_CLIENT_ID') || '';
          const redirectUri = Deno.env.get('APP_URL') + '/wearables?provider=fitbit';
          
          const scope = encodeURIComponent('activity heartrate sleep');
          
          authUrl = `https://www.fitbit.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=${scope}&redirect_uri=${redirectUri}`;
          responseData = { authUrl };
          
        } else {
          throw new Error(`Unsupported provider: ${provider}`);
        }
        break;
        
      case 'fetch_data':
        // Fetch data from the provider using the access token
        if (!accessToken) {
          throw new Error('Access token is required for fetching data');
        }
        
        if (provider === 'google_fit') {
          // Example: Fetch steps data from Google Fit
          try {
            const today = new Date();
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(today.getDate() - 7);
            
            const startTimeMillis = sevenDaysAgo.getTime();
            const endTimeMillis = today.getTime();
            
            // This would be a real API call in production
            // In this demo, we return mock data since we don't have real credentials
            console.log(`Would fetch Google Fit data with token: ${accessToken.substring(0, 10)}...`);
            
            // Mock response data
            responseData = {
              steps: Math.floor(Math.random() * 5000) + 3000,
              heartRate: Math.floor(Math.random() * 30) + 65,
              sleepHours: Math.floor(Math.random() * 3) + 6,
              caloriesBurned: Math.floor(Math.random() * 300) + 1200,
              temperature: Math.floor(Math.random() * 1) + 36,
              bloodOxygen: Math.floor(Math.random() * 3) + 95
            };
            
          } catch (error) {
            console.error('Error fetching Google Fit data:', error);
            throw new Error(`Failed to fetch Google Fit data: ${error.message}`);
          }
          
        } else if (provider === 'apple_health') {
          // For demo purposes, simulate Apple Health data
          console.log(`Would process Apple Health data with token: ${accessToken.substring(0, 10)}...`);
          
          // Mock response data
          responseData = {
            steps: Math.floor(Math.random() * 5000) + 4000,
            heartRate: Math.floor(Math.random() * 25) + 60,
            sleepHours: Math.floor(Math.random() * 2) + 7,
            caloriesBurned: Math.floor(Math.random() * 400) + 1300,
            temperature: Math.floor(Math.random() * 1) + 36,
            bloodOxygen: Math.floor(Math.random() * 2) + 96
          };
          
        } else if (provider === 'fitbit') {
          // For demo purposes, simulate Fitbit data
          console.log(`Would fetch Fitbit data with token: ${accessToken.substring(0, 10)}...`);
          
          // Mock response data
          responseData = {
            steps: Math.floor(Math.random() * 6000) + 2000,
            heartRate: Math.floor(Math.random() * 20) + 68,
            sleepHours: Math.floor(Math.random() * 3) + 6,
            caloriesBurned: Math.floor(Math.random() * 350) + 1150,
            temperature: Math.floor(Math.random() * 1) + 36,
            bloodOxygen: Math.floor(Math.random() * 4) + 94
          };
          
        } else {
          throw new Error(`Unsupported provider: ${provider}`);
        }
        break;
        
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
    
    // If data was fetched and userId is provided, store it in the database
    if (action === 'fetch_data' && userId && responseData) {
      const { data, error } = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/health_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
        },
        body: JSON.stringify({
          user_id: userId,
          provider,
          data: responseData,
          timestamp: new Date().toISOString()
        })
      });
      
      if (error) {
        console.error('Error storing health data:', error);
      }
    }

    return new Response(
      JSON.stringify(responseData),
      { 
        headers: { 
          ...corsHeaders,
          "Content-Type": "application/json" 
        } 
      }
    );
  } catch (error) {
    console.error("Error in wearables-connect function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "An error occurred while processing the request",
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
