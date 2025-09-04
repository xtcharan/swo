'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Mail, ChevronLeft, ArrowLeft } from 'lucide-react'

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otpToken, setOtpToken] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email') // Track authentication step
  const [otpSent, setOtpSent] = useState(false)
  const router = useRouter()

  // Check if admin is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check if user is admin using updated whitelist logic
        const { isAdminUser } = await import('@/lib/auth')
        const isAdmin = await isAdminUser(user.email!)

        if (isAdmin) {
          router.push('/admin/dashboard')
          return
        }
      }
    }
    checkAuth()
  }, [router])



  // OTP Request Handler - Now using server-side API for better security
  const handleOtpRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email) {
      setIsLoading(false)
      setError('Please enter your admin email')
      return
    }

    try {
      const response = await fetch('/api/admin/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An unknown error occurred.')
      }

      // Success - OTP has been sent
      setOtpSent(true)
      setStep('otp')
      setMessage(data.message)

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send OTP. Please try again.'
      setError(message)
      setOtpSent(false)
    } finally {
      setIsLoading(false)
    }
  }

  // OTP Verification Handler - Updated to bypass domain validation for admin
  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!otpToken) {
      setIsLoading(false)
      setError('Please enter the OTP code')
      return
    }

    try {
      // Direct Supabase OTP verification - bypasses conflicting domain validation logic
      const { data, error } = await supabase.auth.verifyOtp({
        email: email.toLowerCase().trim(),
        token: otpToken,
        type: 'email'
      });

      if (error) {
        setError(error.message || 'OTP verification failed');
        return;
      }

      if (data?.user) {
        // OTP verified successfully for admin - no domain validation needed
        router.push('/admin/setup-password')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OTP verification failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  // Back to Email Step
  const handleBackToEmail = () => {
    setStep('email')
    setOtpSent(false)
    setOtpToken('')
    setError('')
    setMessage('')
  }

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    if (!email || !password) {
      setIsLoading(false)
      setError('Please enter both email and password')
      return
    }

    try {
      // First verify this email is in admin whitelist
      const { data: whitelistEntry, error: whitelistError } = await supabase
        .from('admin_whitelist')
        .select('email, "name"')
        .eq('email', email.toLowerCase())
        .single()

      if (whitelistError || !whitelistEntry) {
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
        setError(error?.message || 'Login failed')
        return
      }

      if (data.user) {
        // Admin logged in successfully, redirect to dashboard
        router.push('/admin/dashboard')
      }

    } catch (err: unknown) {
      setIsLoading(false)
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setError(message)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Navigation */}
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
          className="mb-6 text-slate-600 hover:text-slate-800"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        {/* Header Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              Admin Portal
            </CardTitle>
            <CardDescription className="text-slate-600">
              Secure access for authorized administrators
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50 text-red-700">
            <CardContent className="pt-4">
              <p className="text-sm text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Success Message Display */}
        {message && (
          <Card className="mb-6 border-green-200 bg-green-50 text-green-700">
            <CardContent className="pt-4">
              <p className="text-sm text-green-700">{message}</p>
            </CardContent>
          </Card>
        )}

        {/* Login Methods */}
        <div className="space-y-6">
          {/* OTP Authentication Method */}
          <Card className="shadow-lg border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Admin OTP Authentication
              </CardTitle>
              <CardDescription>
                Secure token-based authentication
                <Badge variant="secondary" className="ml-2 text-xs">
                  Recommended
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === 'email' ? (
                // Step 1: Email Input
                <form onSubmit={handleOtpRequest} className="space-y-4">
                  <div>
                    <label htmlFor="otpEmail" className="block text-sm font-medium text-slate-700 mb-2">
                      Admin Email Address
                    </label>
                    <Input
                      id="otpEmail"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.admin@email.com"
                      className="h-12 border-slate-300 focus:border-slate-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                  >
                    {isLoading ? 'Sending OTP...' : 'Send OTP Code'}
                  </Button>

                  <div className="text-xs text-slate-500 text-center">
                    Only whitelisted admin emails will receive OTP codes
                  </div>
                </form>
              ) : (
                // Step 2: OTP Verification
                <form onSubmit={handleOtpVerification} className="space-y-4">
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

                  {otpSent && (
                    <div className="text-center mb-4">
                      <p className="text-sm text-slate-600">
                        OTP sent to <strong>{email}</strong>
                      </p>
                      <p className="text-xs text-slate-500">
                        Check your email for the verification code
                      </p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-slate-700 mb-2">
                      Enter OTP Code
                    </label>
                    <Input
                      id="otp"
                      type="text"
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      placeholder="Enter 6-digit code"
                      className="h-12 border-slate-300 focus:border-slate-500 text-center text-lg tracking-widest"
                      maxLength={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                  >
                    {isLoading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>

                  <div className="text-xs text-slate-500 text-center">
                    Code expires in 5 minutes • Check your email
                  </div>
                </form>
              )}
            </CardContent>
          </Card>

          {/* Password Method */}
          <Card className="shadow-lg border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-orange-600" />
                Admin Password Login
              </CardTitle>
              <CardDescription>
                Use your admin credentials 
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordLogin} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Admin Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.admin@email.com"
                    className="h-12 border-slate-300 focus:border-slate-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your admin password"
                    className="h-12 border-slate-300 focus:border-slate-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
              <div className="mt-3 text-xs text-slate-500 text-center">
                Only whitelisted admin emails will work
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <Card className="mt-8 shadow-md border-0 bg-white/60 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-slate-800 mb-2">
                Admin Authorization
              </h3>
              <p className="text-xs text-slate-600">
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
