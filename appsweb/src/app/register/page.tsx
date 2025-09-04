'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Mail, UserPlus, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const router = useRouter()

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!email) {
      setIsLoading(false)
      setError('Please enter your email address')
      return
    }

    try {
      const { signInWithOtpValidation } = await import('@/lib/auth')
      const result = await signInWithOtpValidation(email, 'user')

      if (result.success) {
        setSuccess(true)
        // Redirect to verify page after showing success message
        setTimeout(() => {
          router.push(`/register/verify?email=${encodeURIComponent(email)}`)
        }, 2000)
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

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8 text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800 mb-4">
                Verification Code Sent!
              </CardTitle>
              <CardDescription className="text-base text-slate-600 mb-6">
                Weve sent a 6-digit verification code to <strong>{email}</strong>.
                <br />
                Please check your email and continue to the next step.
              </CardDescription>
              <div className="text-sm text-slate-500">
                Redirecting you to verification page...
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" passHref>
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

      {/* Registration Form */}
      <div className="flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-800">
                Join DBC Event Hub
              </CardTitle>
              <CardDescription className="text-slate-600">
                Create your account and unlock exclusive access to events
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

          <Card className="shadow-lg border border-slate-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-slate-800 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                Email Verification
              </CardTitle>
              <CardDescription>
                Enter your email address to receive a verification code
                <Badge variant="secondary" className="ml-2 text-xs">
                  Whitelisted Access Only
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="h-12 border-slate-300 focus:border-slate-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-slate-800 hover:bg-slate-900 text-white"
                >
                  {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                </Button>
              </form>

              <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
                <p className="text-xs text-slate-500 text-center">
                  Your email must be on our approved list to register.<br />
                  Contact administrator if you need access.
                </p>

                <Link href="/login" passHref>
                  <Button variant="ghost" className="w-full text-slate-600 hover:text-slate-800">
                    Already have an account? Sign in here
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
