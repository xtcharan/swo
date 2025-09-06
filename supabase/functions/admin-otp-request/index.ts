// supabase/functions/admin-otp-request/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Define the CORS headers that your browser needs
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allows requests from any origin
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // THIS IS THE CRITICAL FIX: Handle the OPTIONS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let email;
  try {
    const body = await req.json();
    email = body.email;
    if (!email) throw new Error('Email is required.');
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Invalid request body. Email is required.' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { data, error: checkError } = await supabaseAdmin
    .from('admin_whitelist')
    .select('email')
    .eq('email', email)
    .single();

  if (checkError || !data) {
    return new Response(
      JSON.stringify({ error: 'This email is not authorized for admin access.' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const { error: otpError } = await supabaseAdmin.auth.signInWithOtp({
    email: email,
  });

  if (otpError) {
    return new Response(
      JSON.stringify({ error: otpError.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  return new Response(JSON.stringify({ message: 'OTP sent successfully.' }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});