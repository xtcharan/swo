import { supabase } from './supabase'

// Domain and authentication utilities for college system

export interface AuthOptions {
  mode: 'student' | 'admin' | 'public'
}

/**
 * Validate email domain for authentication
 */
export function isValidDomain(email: string, allowedDomains: string[] = ['dbcblr.edu.in']): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  return domain ? allowedDomains.includes(domain) : false
}

/**
 * Check if user is admin (needs database query)
 */
export async function isAdminUser(email: string): Promise<boolean> {
  try {
    // Check if email is in admin whitelist using count approach that handles duplicates
    const { count, error } = await supabase
      .from('admin_whitelist')
      .select('*', { count: 'exact', head: true })
      .eq('email', email.toLowerCase())
      .eq('role', 'admin')

    return !error && (count || 0) > 0
  } catch (err) {
    console.error('Admin check failed:', err)
    return false
  }
}

/**
 * Check if user is super admin (juniorsblr2024@gmail.com)
 */
export function isSuperAdmin(email: string): boolean {
  const superAdminEmails = ['juniorsblr2024@gmail.com']
  return superAdminEmails.includes(email.toLowerCase())
}

/**
 * Get user role from whitelist (prioritized over domain logic)
 */
export async function getWhitelistedRole(email: string): Promise<'admin' | 'student' | 'attendee' | null> {
  try {
    const { data: whitelistEntry, error } = await supabase
      .from('admin_whitelist')
      .select('role')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single()

    if (error || !whitelistEntry) {
      return null
    }

    return whitelistEntry.role as 'admin' | 'student' | 'attendee'
  } catch (err) {
    console.error('Whitelist role check failed:', err)
    return null
  }
}

/**
 * Get user role based on email and authentication mode (prioritizing whitelist)
 */
export async function getUserRole(email: string, mode: 'student' | 'admin' | 'public' = 'public'): Promise<'admin' | 'student' | 'attendee' | 'public' | null> {
  try {
    // ALWAYS check whitelist first - this takes priority over everything
    const whitelistedRole = await getWhitelistedRole(email)
    if (whitelistedRole) {
      return whitelistedRole
    }

    // If not whitelisted, apply domain logic
    const domain = email.split('@')[1]?.toLowerCase()

    if (mode === 'admin') {
      // For admin mode, if not whitelisted as admin, deny access
      return null
    }

    // For student mode, requires college domain
    if (mode === 'student') {
      return domain === 'dbcblr.edu.in' ? 'attendee' : null
    }

    // For public mode, any domain works but gets attendee role
    if (mode === 'public') {
      return domain ? 'public' : null
    }

    return null
  } catch (err) {
    console.error('Role determination failed:', err)
    return null
  }
}

/**
 * Handle post-authentication setup (called after successful Google login)
 */
export async function handlePostAuthSetup(userId: string, email: string, mode: 'student' | 'admin' | 'public' = 'public'): Promise<void> {
  try {
    const role = await getUserRole(email, mode)

    if (!role) {
      throw new Error('Authentication not allowed for this email domain')
    }

    // Insert user profile if it doesn't exist
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email.toLowerCase(),
        role: role,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // Don't throw here, just log - profile creation might fail due to RLS
    }

    console.log(`User ${email} authenticated as ${role}`)
  } catch (error) {
    console.error('Post-auth setup failed:', error)
    throw error
  }
}

/**
 * Check if email is in whitelist (for both admin and regular users) - handles duplicates
 */
export async function isEmailWhitelisted(email: string): Promise<boolean> {
  try {
    // Use count approach to handle duplicates properly
    const { count, error } = await supabase
      .from('admin_whitelist')
      .select('*', { count: 'exact', head: true })
      .eq('email', email.toLowerCase())

    return !error && (count || 0) > 0
  } catch (err) {
    console.error('Whitelist check failed:', err)
    return false
  }
}

/**
 * OTP Authentication with general whitelist validation (admin or regular users)
 */
export async function signInWithOtpValidation(email: string, userType: 'admin' | 'user' = 'user'): Promise<{ success: boolean; message: string }> {
  try {
    // Check if the email is in whitelist
    const isWhitelisted = await isEmailWhitelisted(email)

    if (!isWhitelisted) {
      return {
        success: false,
        message: 'This email is not authorized for registration. Contact administrator for access.'
      }
    }

    const redirectUrl = userType === 'admin'
      ? window.location.origin + `/auth/callback?mode=admin&type=otp`
      : window.location.origin + `/auth/callback?mode=user&type=otp`

    // Send OTP to whitelisted email - allow user creation for valid whitelisted emails
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        shouldCreateUser: true, // Allow creation of whitelisted users during OTP
        emailRedirectTo: redirectUrl
      }
    })

    if (otpError) {
      console.error('OTP send error:', otpError)
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      }
    }

    return {
      success: true,
      message: `OTP sent successfully to ${email}`
    }

  } catch (error) {
    console.error('OTP authentication failed:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.'
    }
  }
}

/**
 * OTP Authentication specifically for admin access
 */
export async function signInWithOtpAdminValidation(email: string): Promise<{ success: boolean; message: string }> {
  return signInWithOtpValidation(email, 'admin')
}

/**
 * Verify OTP token and handle authentication
 */
export async function verifyOtpToken(
  email: string,
  token: string,
  mode: string = 'admin'
): Promise<{
  data?: {
    user: unknown;
    session?: unknown;
  } | null;
  error?: string;
}> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token: token,
      type: 'email'
    });

    if (error) {
      console.error('OTP verification error:', error);
      return { error: 'Invalid OTP code. Please check and try again.' };
    }

    if (data?.user) {
      // Handle post-authentication setup
      await handlePostAuthSetup(data.user.id, email, mode as 'student' | 'admin' | 'public');
    }

    return { data };

  } catch (error) {
    console.error('OTP verification failed:', error);
    return { error: 'OTP verification failed. Please try again.' };
  }
}

/**
 * Google OAuth with domain validation
 */
export async function signInWithGoogleValidation(options: AuthOptions) {
  try {
    const { mode } = options

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + `/auth/callback?mode=${mode}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    })

    if (error) {
      console.error('Google auth error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Google auth with validation failed:', error)
    throw error
  }
}
