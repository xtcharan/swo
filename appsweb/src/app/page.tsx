'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Mail, Lock, Eye, EyeOff, CheckCircle, XCircle, Clock, ArrowLeft, AlertCircle } from 'lucide-react'

export default function AdminAuthPage() {
  const [authState, setAuthState] = useState<'initial' | 'otp-pending' | 'password-setup' | 'login-method'>('initial')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Form data
  const [email, setEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const router = useRouter()

  // Check if admin is already authenticated on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { supabase } = await import('@/lib/supabase')
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
          // Check if authenticated user is admin
          const { isAdminUser } = await import('@/lib/auth')
          const isAdmin = await isAdminUser(user.email!)

          if (isAdmin) {
            router.push('/admin/dashboard')
            return
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      }
    }
    checkAuth()
  }, [router])

  // Password strength requirements
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

  const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    const met = passwordRequirements.filter(req => req.test(password)).length

    if (met <= 2) return 'weak'
    if (met <= 4) return 'medium'
    return 'strong'
  }

  // Initial email submission handler
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!email) {
      setIsLoading(false)
      setError('Please enter your admin email address')
      return
    }

    try {
      const { signInWithOtpAdminValidation } = await import('@/lib/auth')
      const result = await signInWithOtpAdminValidation(email)

      if (result.success) {
        setAuthState('otp-pending')
        setSuccess(`OTP sent successfully to ${email}`)
      } else {
        setError(result.message)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send verification code'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // OTP verification handler
  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!otpCode || otpCode.length !== 6) {
      setIsLoading(false)
      setError('Please enter a valid 6-digit verification code')
      return
    }

    try {
      const { verifyOtpToken } = await import('@/lib/auth')
      const result = await verifyOtpToken(email, otpCode, 'admin')

      if (result.error) {
        setError(result.error)
      } else if (result.data?.user) {
        const userId = (result.data.user as { id: string })?.id

        if (!userId) {
          setError('User ID is missing from authentication result')
          return
        }

        // Check if admin already has password set
        const { data: profile } = await (await import('@/lib/supabase')).supabase
          .from('profiles')
          .select('password_set')
          .eq('id', userId)
          .single()

        if (profile?.password_set) {
          // Admin has password set, go to login methods
          setAuthState('login-method')
        } else {
          // First-time admin, setup password
          setAuthState('password-setup')
        }
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OTP verification failed'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Password setup handler
  const handlePasswordSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!password) {
      setIsLoading(false)
      setError('Password is required')
      return
    }

    if (!validatePassword(password)) {
      setIsLoading(false)
      setError('Password does not meet security requirements')
      return
    }

    if (password !== confirmPassword) {
      setIsLoading(false)
      setError('Passwords do not match')
      return
    }

    try {
      // Update password in Supabase Auth
      const { supabase } = await import('@/lib/supabase')
      const { error: passwordError } = await supabase.auth.updateUser({
        password: password
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
            domain: 'dbcblr.edu.in',
            password_set: true,
            password_last_changed: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (profileError) {
          console.error('Profile update error:', profileError)
        }
      }

      setSuccess('Password setup successful! Taking you to dashboard...')
      setTimeout(() => router.push('/admin/dashboard'), 2000)

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to set up password'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Password login handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email || !password) {
      setIsLoading(false)
      setError('Please enter both email and password')
      return
    }

    try {
      const { supabase } = await import('@/lib/supabase')

      // Verify email is admin before password login
      const { data: whitelistEntry } = await supabase
        .from('admin_whitelist')
        .select('email, name')
        .eq('email', email.toLowerCase())
        .single()

      if (!whitelistEntry) {
        setIsLoading(false)
        setError('This email is not authorized for admin access')
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })

      if (error) {
        setIsLoading(false)
        setError(error.message || 'Login failed')
        return
      }

      if (data.user) {
        router.push('/admin/dashboard')
      }
    } catch (err: unknown) {
      setIsLoading(false)
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
    }
  }

  // Back navigation handlers
  const handleBackToEmail = () => {
    setAuthState('initial')
    setOtpCode('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setSuccess('')
  }

  const handleBackToOtp = () => {
    setAuthState('otp-pending')
    setPassword('')
    setConfirmPassword('')
    setError('')
  }

  // Google OAuth handler
  const handleGoogleAuth = async () => {
    try {
      const { signInWithGoogleValidation } = await import('@/lib/auth')
      await signInWithGoogleValidation({ mode: 'admin' })
    } catch (error) {
      setError('Google authentication failed')
      console.error('Google auth error:', error)
    }
  }

  const renderAuthContent = () => {
    switch (authState) {
      case 'initial':
        return (
          <div className="space-y-6">
            <Card className="shadow-lg border border-slate-200 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-slate-800 flex items-center">
                  <Mail className="w-5 h-5 mr-2 text-blue-600" />
                  Admin Access Portal
                </CardTitle>
                <CardDescription>
                  Enter your admin email address to receive a secure verification code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Admin Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@dbcblr.edu.in"
                      className="h-12 border-slate-300 focus:border-slate-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                  >
                    {isLoading ? 'Sending OTP...' : 'Send Verification Code'}
                  </Button>

                  <div className="text-xs text-slate-500 text-center">
                    Only whitelisted admin emails will receive verification codes
                  </div>
                </form>

                {/* Alternative OAuth */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <Button
                    onClick={handleGoogleAuth}
                    variant="outline"
                    className="w-full text-slate-600 hover:text-slate-800"
                  >
                    Continue with Google
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'otp-pending':
        return (
          <Card className="shadow-lg border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToEmail}
                  className="text-slate-600 hover:text-slate-800 p-0"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Verify Your Identity
              </CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to <strong>{email}</strong>
                <Badge variant="secondary" className="ml-2 text-xs">Expires in 5 minutes</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpVerification} className="space-y-4">
                <div>
                  <Input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="h-16 border-slate-300 focus:border-slate-500 text-center text-2xl tracking-widest font-mono"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-slate-500 text-center mt-2">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || otpCode.length !== 6}
                  className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                >
                  {isLoading ? 'Verifying...' : 'Verify & Continue'}
                </Button>

                <div className="text-xs text-slate-500 text-center">
                  Didnt receive the code? Check your spam folder
                </div>
              </form>
            </CardContent>
          </Card>
        )

      case 'password-setup':
        return (
          <Card className="shadow-lg border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleBackToOtp}
                  className="text-slate-600 hover:text-slate-800 p-0"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </div>
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-orange-600" />
                Set Admin Password
              </CardTitle>
              <CardDescription>
                Create a secure password for future access
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordSetup} className="space-y-4">
                {/* Password Input */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create strong password"
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
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
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
                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Password Strength</span>
                      <Badge
                        variant={
                          getPasswordStrength(password) === 'weak' ? 'destructive' :
                          getPasswordStrength(password) === 'medium' ? 'secondary' :
                          'default'
                        }
                      >
                        {getPasswordStrength(password).charAt(0).toUpperCase() + getPasswordStrength(password).slice(1)}
                      </Badge>
                    </div>

                    {/* Requirements List */}
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center text-xs">
                          {req.test(password) ? (
                            <CheckCircle className="w-3 h-3 text-green-600 mr-2" />
                          ) : (
                            <XCircle className="w-3 h-3 text-slate-400 mr-2" />
                          )}
                          <span className={req.test(password) ? 'text-green-600' : 'text-slate-500'}>
                            {req.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isLoading || !password || !confirmPassword}
                  className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                >
                  {isLoading ? 'Setting up...' : 'Set Password & Access Admin Panel'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )

      case 'login-method':
        return (
          <Card className="shadow-lg border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <Button
                type="button"
                variant="ghost"
                onClick={handleBackToOtp}
                className="mb-4 text-slate-600 hover:text-slate-800 p-0 justify-start"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <CardTitle className="text-lg text-slate-800">
                Choose Login Method
              </CardTitle>
              <CardDescription>
                Welcome back, <strong>{email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label htmlFor="loginPassword" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Password
                  </label>
                  <Input
                    id="loginPassword"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 border-slate-300 focus:border-slate-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !password}
                  className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                >
                  {isLoading ? 'Signing in...' : 'Sign In to Admin Panel'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-slate-600">
              Secure access for authorized administrators only
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
                <AlertCircle className="w-5 h-5 mr-2 text-red-700" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Authentication Content */}
        {renderAuthContent()}

        {/* Footer */}
        <Card className="mt-8 shadow-md border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-xs text-slate-500">
                Access is restricted to authorized administrators.
                Contact the system administrator if you need access.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
