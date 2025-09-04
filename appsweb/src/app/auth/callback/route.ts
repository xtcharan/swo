import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const mode = searchParams.get('mode') || 'public' // student, admin, or public

  if (code) {
    // Handle OAuth callback (OTP and OAuth authentication)
    const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(error.message)}`)
    }

    if (sessionData?.user) {
      const email = sessionData.user.email
      const userId = sessionData.user.id

      try {
        // For admin mode with OTP, validate admin whitelist
        // For user mode, whitelist is already validated during OTP request
        if (mode === 'admin') {
          // Validate admin whitelist
          const { data: whitelistEntry } = await supabase
            .from('admin_whitelist')
            .select('email, "name"')
            .eq('email', email!.toLowerCase())
            .single()

          if (!whitelistEntry) {
            await supabase.auth.signOut()
            return NextResponse.redirect(`${origin}/?error=Admin+access+not+authorized&mode=admin`)
          }
        }

        // Set up user profile and role
        await setupUserProfile(userId, email!, mode as 'student' | 'admin' | 'public')

      // For OTP first-time login, redirect to password setup
        if (mode === 'admin') {
          // Always send new admins to password setup (whether first-time or not)
          // This ensures they always have a password for future logins
          const redirectUrl = `${origin}/admin/setup-password?email=${encodeURIComponent(email!)}&mode=${mode}&auth=otp`
          console.log(`Redirecting admin ${email} from OTP to password setup`)
          return NextResponse.redirect(redirectUrl)
        }

        // For user mode (regular users), redirect to dashboard
        // For other modes, redirect normally
        if (mode === 'user') {
          const redirectUrl = `${origin}/dashboard`
          console.log(`Redirecting user ${email} to dashboard`)
          return NextResponse.redirect(redirectUrl)
        }

        const redirectUrl = getRedirectUrl(mode, origin)
        return NextResponse.redirect(redirectUrl)

      } catch (validationError: unknown) {
        console.error('Validation error:', validationError)
        await supabase.auth.signOut()
        const message = validationError instanceof Error ? validationError.message : 'An unexpected error occurred'
        return NextResponse.redirect(`${origin}/?error=${encodeURIComponent(message)}&mode=${mode}`)
      }
    }
  } else {
    // Handle direct access without code (e.g., password login)
    const redirectUrl = mode === 'admin' ? `${origin}/admin/setup-password?direct=true` : getRedirectUrl(mode, origin)
    return NextResponse.redirect(redirectUrl)
  }

  // No code provided - redirect to appropriate login
  return NextResponse.redirect(`${origin}/${mode === 'admin' ? 'admin/login' : ''}`)
}



async function setupUserProfile(userId: string, email: string, mode: 'student' | 'admin' | 'user' | 'public') {
  try {
    // Import whitelist and role checking functions
    const { getWhitelistedRole } = await import('@/lib/auth')

    // Get whitelisted role first (takes priority)
    const whitelistedRole = await getWhitelistedRole(email)

    // Determine role based on whitelist priority
    let role: string
    let password_set = false
    if (whitelistedRole) {
      role = whitelistedRole
      // Admins need password setup, students/attendees don't
      password_set = whitelistedRole !== 'admin'
    } else if (mode === 'student') {
      // Non-whitelisted college domain gets attendee
      const domain = email.split('@')[1]?.toLowerCase()
      role = domain === 'dbcblr.edu.in' ? 'attendee' : 'attendee'
      password_set = true
    } else if (mode === 'admin') {
      role = 'admin' // Though this should be caught by whitelist
      password_set = false
    } else if (mode === 'user') {
      role = 'attendee' // Regular users
      password_set = true
    } else {
      role = 'public'
      password_set = false
    }

    // Extract domain for profile
    const domain = email.split('@')[1]?.toLowerCase()

    // Create or update user profile with all new fields
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        email: email.toLowerCase(),
        role: role,
        domain: domain === 'dbcblr.edu.in' ? domain : null,
        password_set: password_set,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })

    if (error) {
      console.error('Profile setup error:', error)
      // Don't throw - profile creation might fail due to RLS, but auth can still work
    }

    return { role, password_set: password_set }
  } catch (err) {
    console.error('Profile setup failed:', err)
    return { role: 'public', password_set: false }
  }
}

function getRedirectUrl(mode: string, origin: string): string {
  switch (mode) {
    case 'student':
      return `${origin}/student/dashboard` // You can create this page
    case 'admin':
      return `${origin}/admin/dashboard`
    case 'public':
      return `${origin}/` // Regular user dashboard
    default:
      return `${origin}/`
  }
}

export async function POST(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const next = searchParams.get('next') ?? '/'

  // Handle POST requests as well in case needed
  return NextResponse.redirect(`${origin}${next}`)
}
