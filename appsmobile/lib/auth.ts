import { supabase } from './supabase'
import { Event } from './types'

// Mobile app authentication and event filtering utilities

/**
 * Check if user is whitelisted and get their role
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
 * Get user profile with enhanced whitelist logic
 */
export async function getUserProfile() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return null

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError && profileError.code !== 'PGRST116') { // Not found error
      console.error('Profile fetch error:', profileError)
    }

    // Get whitelisted role first (prioritizes whitelist)
    const whitelistedRole = await getWhitelistedRole(user.email!)
    const userDomain = profile?.domain || extractDomain(user.email || '')

    return {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || profile?.full_name,
      avatarUrl: user.user_metadata?.avatar_url,
      domain: userDomain,
      role: whitelistedRole || profile?.role || 'attendee',
      college_id: profile?.college_id,
      ...profile
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return null
  }
}

/**
 * Extract email domain
 */
export function extractDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() || ''
}

/**
 * Get events that the user can access
 */
export async function getAccessibleEvents(): Promise<Event[]> {
  try {
    const user = await getUserProfile()
    if (!user) return []

    // Get all active events that the user can see
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'active')
      .order('datetime', { ascending: true })

    if (error) throw error

    // Filter events based on user access
    return events.filter((event: Event) => canAccessEvent(event, user))
  } catch (error) {
    console.error('Error fetching events:', error)
    return []
  }
}

/**
 * Check if user can access a specific event
 */
export function canAccessEvent(event: Event, user: any): boolean {
  const userDomain = user?.domain || ''

  // Public events: All authenticated users can access
  if (event.visibility_level === 'public') {
    return true
  }

  // College events: Only same college domain can access
  if (event.visibility_level === 'college') {
    return userDomain === event.college_domain
  }

  // Admin-only events: Only specific admin users
  if (event.visibility_level === 'admin_only') {
    return user?.is_admin || user?.role === 'admin'
  }

  return false
}

/**
 * Check if user can register for an event
 */
export function canRegisterForEvent(event: Event, user: any): boolean {
  // Can only register if user can access the event
  if (!canAccessEvent(event, user)) {
    return false
  }

  // Additional checks for registration
  const now = new Date()
  const eventDate = new Date(event.datetime)
  const deadline = event.registration_deadline ? new Date(event.registration_deadline) : null

  // Check if event has passed
  if (eventDate < now) {
    return false
  }

  // Check registration deadline (if set)
  if (deadline && deadline < now) {
    return false
  }

  // Check capacity (if set)
  if (event.capacity > 0) {
    // We'll implement this later with registration counts
  }

  return true
}

/**
 * Register for an event
 */
export async function registerForEvent(eventId: string): Promise<{ success: boolean, message: string }> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, message: 'User not authenticated' }
    }

    const { data: existingRegistration, error: checkError } = await supabase
      .from('registrations')
      .select('*')
      .eq('event_id', eventId)
      .eq('user_id', user.id)
      .maybeSingle()

    if (existingRegistration) {
      return { success: false, message: 'Already registered for this event' }
    }

    const { error } = await supabase
      .from('registrations')
      .insert({
        event_id: eventId,
        user_id: user.id,
        status: 'confirmed',
        registered_at: new Date().toISOString()
      })

    if (error) throw error

    return { success: true, message: 'Successfully registered!' }
  } catch (error: any) {
    console.error('Registration error:', error)
    return { success: false, message: error.message || 'Registration failed' }
  }
}

/**
 * Get user's registrations
 */
export async function getUserRegistrations(): Promise<any[]> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) return []

    const { data, error } = await supabase
      .from('registrations')
      .select(`
        *,
        events (*)
      `)
      .eq('user_id', user.id)

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user registrations:', error)
    return []
  }
}

/**
 * Sign out user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

/**
 * Update user profile
 */
export async function updateUserProfile(updates: any): Promise<{ success: boolean, message: string }> {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return { success: false, message: 'User not authenticated' }
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        domain: updates.domain || extractDomain(user.email || ''),
        ...updates,
        updated_at: new Date().toISOString()
      })

    if (error) throw error

    return { success: true, message: 'Profile updated successfully' }
  } catch (error: any) {
    console.error('Profile update error:', error)
    return { success: false, message: error.message || 'Profile update failed' }
  }
}

/**
 * Get user's role type for UI display
 */
export function getUserRoleType(user: any): string {
  if (user?.role === 'admin' || user?.is_admin) return 'Admin'
  if (user?.domain === 'dbcblr.edu.in') return 'College Student'
  return 'General Student'
}
