'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react'

export default function AdminPasswordSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()

  // Validate user and check if they're authorized
  useEffect(() => {
    const validateUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        router.push('/admin/login')
        return
      }

      // Check if user is admin and in whitelist
      const { data: whitelistEntry } = await supabase
        .from('admin_whitelist')
        .select('email, name')
        .eq('email', user.email?.toLowerCase())
        .single()

      if (!whitelistEntry) {
        setError('You are not authorized for admin access')
        setTimeout(() => router.push('/admin/login'), 3000)
        return
      }

      // Check if password is already set
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, password_set')
        .eq('id', user.id)
        .single()

      if (profile?.role === 'admin' && profile.password_set) {
        router.push('/admin/dashboard')
        return
      }

      setUserEmail(user.email || '')
    }

    validateUser()
  }, [router])

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { label: 'Uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'Lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'Number', test: (pwd: string) => /\d/.test(pwd) },
    { label: 'Special character', test: (pwd: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd) },
  ]

  const validatePassword = (password: string): boolean => {
    return passwordRequirements.every(req => req.test(password))
  }

  const validateForm = (): boolean => {
    if (!formData.password) {
      setError('Password is required')
      return false
    }

    if (!validatePassword(formData.password)) {
      setError('Password does not meet security requirements')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    return true
  }

  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      // Update password in Supabase Auth
      const { error: passwordError } = await supabase.auth.updateUser({
        password: formData.password
      })

      if (passwordError) {
        throw passwordError
      }

      // Update profile to mark password as set
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email?.toLowerCase(),
            role: 'admin',
            domain: 'dbcblr.edu.in', // All admin emails are from college domain
            password_set: true,
            password_last_changed: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.error('Profile update error:', profileError)
          // Continue anyway since password was set
        }
      }

      setSuccess('Password setup successful! You can now sign in with your email and password.')
      setTimeout(() => router.push('/admin/login'), 2000)

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to set up password'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    const met = passwordRequirements.filter(req => req.test(password)).length

    if (met <= 2) return 'weak'
    if (met <= 4) return 'medium'
    return 'strong'
  }

  const strength = getPasswordStrength(formData.password)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Set Admin Password
            </CardTitle>
            <CardDescription className="text-slate-600">
              Create a secure password for {userEmail}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Success Message */}
        {success && (
          <Card className="mb-6 border-green-200 bg-green-50 text-green-700">
            <CardContent className="pt-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-700" />
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 text-red-700">
            <CardContent className="pt-4">
              <div className="flex items-center">
                <XCircle className="w-5 h-5 mr-2 text-red-700" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Password Setup Form */}
        <Card className="shadow-lg border border-slate-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-800 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Secure Your Account
            </CardTitle>
            <CardDescription>
              Create a strong password that meets security requirements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSetup} className="space-y-6">
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your new password"
                    className="h-12 pr-12 border-slate-300 focus:border-slate-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm your new password"
                    className="h-12 pr-12 border-slate-300 focus:border-slate-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-10 w-10 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-slate-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">Password Strength</span>
                    <Badge
                      variant={
                        strength === 'weak' ? 'destructive' :
                        strength === 'medium' ? 'secondary' :
                        'default'
                      }
                    >
                      {strength.charAt(0).toUpperCase() + strength.slice(1)}
                    </Badge>
                  </div>

                  {/* Requirements List */}
                  <div className="space-y-1">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center text-xs">
                        {req.test(formData.password) ? (
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                        ) : (
                          <XCircle className="w-3 h-3 text-slate-400 mr-2" />
                        )}
                        <span className={req.test(formData.password) ? 'text-green-600' : 'text-slate-500'}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || !formData.password || !formData.confirmPassword}
                className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
              >
                {isLoading ? 'Setting up...' : 'Set Password & Continue'}
              </Button>
            </form>

            {/* Security Tips */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <h4 className="text-sm font-semibold text-slate-800 mb-2">Security Tips:</h4>
              <ul className="text-xs text-slate-600 space-y-1">
                <li>• Use a unique password not used elsewhere</li>
                <li>• Include numbers and special characters</li>
                <li>• Passwords are securely encrypted</li>
                <li>• Regular password changes recommended</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
