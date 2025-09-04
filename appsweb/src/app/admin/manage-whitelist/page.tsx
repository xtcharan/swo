'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Plus, Trash2, Shield, Users, User } from 'lucide-react'

type WhitelistEntry = {
  id: number
  email: string
  name: string | null
  role: 'admin' | 'student' | 'attendee' | null
  is_active: boolean | null
  created_at: string
}

export default function ManageWhitelist() {
  const [isLoading, setIsLoading] = useState(false)
  const [entries, setEntries] = useState<WhitelistEntry[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'admin' | 'student' | 'attendee'>('attendee')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const router = useRouter()

  // Check if user is super admin
  useEffect(() => {
    const checkSuperAdmin = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/admin/login')
        return
      }

      const { isSuperAdmin: checkSuperAdmin } = await import('@/lib/auth')
      const isSuper = checkSuperAdmin(user.email!)

      if (!isSuper) {
        setError('Super admin access required')
        setTimeout(() => router.push('/admin/dashboard'), 3000)
        return
      }

      setIsSuperAdmin(true)
      fetchWhitelist()
    }

    checkSuperAdmin()
  }, [router])

  const fetchWhitelist = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_whitelist')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEntries(data || [])
    } catch (err) {
      console.error('Failed to fetch whitelist:', err)
    }
  }

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !name) {
      setError('Email and name are required')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const { error: insertError } = await supabase
        .from('admin_whitelist')
        .insert({
          email: email.toLowerCase(),
          name: name.trim(),
          role: role
        })

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This email is already in the whitelist')
        } else {
          throw insertError
        }
        return
      }

      setSuccess('User added to whitelist successfully!')
      setEmail('')
      setName('')
      setRole('attendee')
      fetchWhitelist()

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to add user')
      } else {
        setError('Failed to add user')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveEntry = async (entryId: number, entryEmail: string) => {
    if (entryEmail === 'juniorsblr2024@gmail.com') {
      setError('Cannot remove super admin from whitelist')
      return
    }

    if (!confirm(`Remove ${entryEmail} from whitelist?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('admin_whitelist')
        .delete()
        .eq('id', entryId)

      if (error) throw error

      setSuccess('User removed from whitelist')
      fetchWhitelist()

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || 'Failed to remove user')
      } else {
        setError('Failed to remove user')
      }
    }
  }

  const getRoleIcon = (userRole: string) => {
    switch (userRole) {
      case 'admin': return <Shield className="w-4 h-4" />
      case 'student': return <User className="w-4 h-4" />
      default: return <Users className="w-4 h-4" />
    }
  }

  const getRoleBadgeColor = (userRole: string) => {
    switch (userRole) {
      case 'admin': return 'destructive'
      case 'student': return 'default'
      case 'attendee': return 'secondary'
      default: return 'outline'
    }
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="shadow-xl max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-red-500" />
              <CardTitle className="text-xl mb-2">Access Denied</CardTitle>
              <CardDescription className="text-slate-600">
                Super admin permissions required to manage whitelist
              </CardDescription>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Button
          variant="ghost"
          onClick={() => router.push('/admin/dashboard')}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Manage Whitelist
            </CardTitle>
            <CardDescription className="text-slate-600">
              Control access by managing authorized users and their roles
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Add New Entry Form */}
        <Card className="mb-8 shadow-lg border border-slate-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-blue-600" />
              Add New User
            </CardTitle>
            <CardDescription>
              Invite new users with specific roles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="border-slate-300 focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="border-slate-300 focus:border-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Role
                  </label>
                  <Select value={role} onValueChange={(value: 'admin' | 'student' | 'attendee') => setRole(value)}>
                    <SelectTrigger className="border-slate-300 focus:border-slate-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="attendee">Attendee</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading || !email || !name}
                  className="bg-slate-800 hover:bg-slate-900 text-white"
                >
                  {isLoading ? 'Adding...' : 'Add User'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Messages */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 text-red-700">
            <CardContent className="pt-4">
              <p className="text-sm">{error}</p>
            </CardContent>
          </Card>
        )}

        {success && (
          <Card className="mb-6 border-green-200 bg-green-50 text-green-700">
            <CardContent className="pt-4">
              <p className="text-sm">{success}</p>
            </CardContent>
          </Card>
        )}

        {/* Whitelist Table */}
        <Card className="shadow-lg border border-slate-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <Users className="w-5 h-5 mr-2 text-slate-600" />
              Authorized Users ({entries.length})
            </CardTitle>
            <CardDescription>
              Manage users who can access the application
            </CardDescription>
          </CardHeader>
          <CardContent>
            {entries.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                No users in whitelist yet
              </div>
            ) : (
              <div className="space-y-3">
                {entries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getRoleIcon(entry.role || 'attendee')}
                      <div>
                        <p className="font-medium text-slate-800">{entry.name}</p>
                        <p className="text-sm text-slate-600">{entry.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Badge variant={getRoleBadgeColor(entry.role || 'attendee')}>
                        {entry.role ? entry.role.charAt(0).toUpperCase() + entry.role.slice(1) : 'Attendee'}
                      </Badge>

                      {entry.email !== 'juniorsblr2024@gmail.com' && entry.email && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEntry(entry.id, entry.email)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer Info */}
        <Card className="mt-8 shadow-md border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Whitelist Management
              </h3>
              <p className="text-xs text-slate-600">
                Changes take effect immediately. Users can sign up right away with their assigned roles.
                Super admin (juniorsblr2024@gmail.com) cannot be removed.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
