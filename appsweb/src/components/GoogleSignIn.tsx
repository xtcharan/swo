'use client'

import React, { useState } from 'react'
import { supabase } from '../lib/supabase'

interface GoogleSignInProps {
  customText?: string
  onSuccess?: () => void
  onError?: (error: string) => void
  className?: string
  variant?: 'primary' | 'outline' | 'secondary'
  mode?: 'student' | 'admin' | 'public'
  allowedDomains?: string[]
}

export default function GoogleSignIn({
  customText = 'Sign in with Google',
  onSuccess,
  onError,
  className = '',
  variant = 'primary'
}: GoogleSignInProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/auth/callback'
        }
      })

      if (error) throw error

      onSuccess?.()
    } catch (err: unknown) {
      setLoading(false)
      const errorMessage = err instanceof Error ? err.message : 'Something went wrong'
      setError(errorMessage)
      onError?.(errorMessage)
    }
  }

  const getButtonStyles = () => {
    const baseStyles = `
      inline-flex items-center justify-center px-4 py-2 border border-transparent
      text-sm font-medium rounded-md shadow-sm transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
      w-full max-w-xs mx-auto
    `

    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-blue-600 text-white hover:bg-blue-700 border-blue-600`
      case 'outline':
        return `${baseStyles} bg-white text-gray-700 border-gray-300 hover:bg-gray-50`
      case 'secondary':
        return `${baseStyles} bg-gray-600 text-white hover:bg-gray-700 border-gray-600`
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGoogleSignIn}
        disabled={loading}
        className={getButtonStyles()}
      >
        <div className="flex items-center justify-center">
          {/* Google logo SVG */}
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC04"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>

          {loading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Signing in...
            </div>
          ) : (
            customText
          )}
        </div>
      </button>

      <div className="text-xs text-gray-500 text-center">
        Secure authentication powered by Google
      </div>
    </div>
  )
}
