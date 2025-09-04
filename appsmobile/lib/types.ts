export interface Event {
  id: string
  title: string
  description?: string
  location?: string
  capacity: number
  datetime: string
  event_type: 'public' | 'private'
  organizing_college?: string
  college_domain?: string
  visibility_level: 'public' | 'college' | 'admin_only'
  category?: string
  entry_fee: number
  is_team_event: boolean
  registration_deadline?: string
  status: 'draft' | 'active' | 'cancelled' | 'completed'
  created_at: string
  updated_at: string
  created_by: string
}

export interface UserProfile {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  domain: string
  role?: string
  is_admin?: boolean
}

export interface Registration {
  id: string
  event_id: string
  user_id: string
  status: 'pending' | 'confirmed' | 'cancelled'
  registered_at: string
  team_name?: string
  team_members?: any[]
  special_requests?: string
  payment_status: 'pending' | 'completed' | 'failed'
}
