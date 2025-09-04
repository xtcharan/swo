import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Define a type for the response data for clarity
type ResponseData = {
  message?: string;
  error?: string;
};

// Initialize the Supabase client using environment variables.
// Using the ANON_KEY is correct here because your RLS policy allows public access for this specific check.
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required and must be a string.' }, { status: 400 });
    }

    // Step 1: Verify the email against the admin_whitelist table using secure function
    // This bypasses all RLS policies and prevents infinite recursion
    const { data: isAdmin, error: queryError } = await supabase
      .rpc('is_user_admin_secure', { user_email: email.toLowerCase().trim() });

    // If there was an error or user is not admin, deny access.
    if (queryError || !isAdmin) {
      console.error('Admin verification failed for:', email, queryError);
      return NextResponse.json({
        error: 'You are not an admin or your email is not authorized. Please contact an administrator.',
      }, { status: 403 });
    }

    // Step 3: If verification succeeds, send the OTP - allow user creation for whitelisted admins
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        shouldCreateUser: true, // Allow creation for whitelisted admin users
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback?mode=admin&type=otp`
      }
    });

    if (otpError) {
      console.error('OTP send error:', otpError);
      return NextResponse.json({
        error: 'Failed to send OTP. Please try again.',
      }, { status: 500 });
    }

    // Step 4: Respond with a success message
    return NextResponse.json({
      message: 'OTP has been sent to your email address.'
    }, { status: 200 });

  } catch (error) {
    console.error('Error during admin OTP request:', error);
    return NextResponse.json({
      error: 'An internal server error occurred.'
    }, { status: 500 });
  }
}
