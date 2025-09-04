'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Mail, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'

export default function VerifyForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const { supabase } = await import('@/lib/supabase')
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // User is already logged in, redirect to dashboard
        router.push('/dashboard')
        return
      }
    }
    checkAuth()
  }, [router])

  // Redirect if no email parameter
  useEffect(() => {
    if (!email) {
      router.push('/register')
    }
  }, [email, router])

  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!otpCode || otpCode.length !== 6) {
      setIsLoading(false)
      setError('Please enter a valid 6-digit verification code')
      return
    }

    if (!email) {
      setIsLoading(false)
      setError('Email address is missing')
      return
    }

    try {
      const { verifyOtpToken } = await import('@/lib/auth')
      const result = await verifyOtpToken(email, otpCode, 'user')

      if (result.error) {
        setError(result.error)
      } else if (result.data?.user) {
        // OTP verified successfully, redirect to dashboard (no password setup for regular users)
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) return

    setResendLoading(true)
    setError('')

    try {
      const { signInWithOtpValidation } = await import('@/lib/auth')
      const result = await signInWithOtpValidation(email, 'user')

      if (result.success) {
        setError('Verification code sent! Check your email.')
        setTimeout(() => setError(''), 3000)
      } else {
        setError(result.message)
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to resend verification code'
      setError(message)
    } finally {
      setResendLoading(false)
    }
  }

  if (!email) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/register" passHref>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800 p-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="flex items-center">
              <Shield className="w-6 h-6 text-blue-600 mr-2" />
              <h1 className="text-lg font-bold text-slate-800">DBC Event Hub</h1>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Verification Form */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Verify Your Email
              </CardTitle>
              <CardDescription className="text-slate-600">
                We sent a 6-digit code to your email address
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Error/Success Display */}
          {error && (
            <Card className={`mb-6 ${error.includes('sent') ? 'border-green-200 bg-green-50 text-green-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
              <CardContent className="pt-4">
                <p className="text-sm">{error}</p>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-lg border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-green-600" />
                Enter Verification Code
              </CardTitle>
              <CardDescription>
                Enter the 6-digit code sent to <strong>{email}</strong>
                <Badge variant="secondary" className="ml-2 text-xs">
                  Expires in 5 minutes
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleOtpVerification} className="space-y-6">
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
              </form>

              <div className="mt-6 pt-6 border-t border-slate-200 text-center">
                <p className="text-sm text-slate-600 mb-4">
                  Didnt receive the code?
                </p>
                <Button
                  variant="outline"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="text-slate-600 hover:text-slate-800"
                >
                  {resendLoading ? 'Sending...' : 'Resend Code'}
                </Button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-500">
                  Codes expire after 5 minutes for security
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Link href="/register" passHref>
              <Button variant="ghost" className="text-slate-600 hover:text-slate-800">
                ← Back to registration
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
