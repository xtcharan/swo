import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { supabase, signUpWithEmail, resendVerificationEmail } from './lib/supabase';
import { getWhitelistedRole } from './lib/auth';

// 🔧 TEMPORARY DEBUG LOGGING - REMOVE AFTER FIXING
console.log('🚀 MOBILE APP DEBUGGING ACTIVATED');
console.log('📱 SUPABASE_URL exists:', !!process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('🔑 SUPABASE_KEY exists:', !!process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY);
console.log('🌐 SUPABASE URL value:', process.env.EXPO_PUBLIC_SUPABASE_URL);
console.log('🏠 Environment file path should be:', 'appsmobile/.env.local');

// Test basic Supabase connection
supabase.auth.getSession().then(({ data, error }) => {
  console.log('🧪 Supabase session test - data:', !!data);
  console.log('🚨 Supabase session test - error:', error);
}).catch(err => {
  console.log('💥 Supabase connection test failed:', err);
});

// Complete Mobile Event Management App with Industry-Standard Authentication
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'signin' | 'signup-email' | 'signup-coll-form' | 'signup-ext-form' | 'email-verification' | 'password-setup' | 'dashboard' | 'student-dashboard' | 'events' | 'bookings'>('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User data states
  const [userData, setUserData] = useState({
    email: '',
    isCollegeStudent: false,
    userType: '' as 'dbc-student' | 'other-college-student' | 'external',
    firstName: '',
    lastName: '',
    department: '',
    semester: '',
    year: '',
    collegeOrg: '',
    phone: '',
    password: '',
    otpCode: ''
  });

  const [userRole, setUserRole] = useState<'student' | 'admin' | 'external' | null>(null);

  const renderWelcome = () => (
    <ImageBackground
      source={require('./assets/college.webp')}
      style={styles.backgroundImage}
      resizeMode="cover"
      onError={() => {
        // If image fails to load, switch to plain background
        setCurrentScreen('signin');
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.title}>DBC Event Hub</Text>
          <Text style={styles.subtitle}>Discover, Connect, Celebrate with DBC Community</Text>

          {/* Single prominent button for student registration */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setCurrentScreen('signup-email')}
            activeOpacity={0.7}
          >
            <View style={styles.primaryButtonIcon}>
              <Ionicons name="school" size={55} color="#007bff" />
            </View>
            <Text style={styles.primaryButtonTitle}>Create Account</Text>
            <Text style={styles.primaryButtonSubtitle}>Smart Registration for All Students</Text>
          </TouchableOpacity>

          {/* Small discreet admin login link */}
          <TouchableOpacity
            style={styles.staffLoginButton}
            onPress={() => setCurrentScreen('signin')}
          >
            <Text style={styles.staffLoginText}>Staff Login</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>Welcome to DBC College Events Platform</Text>
        </View>
      </View>
    </ImageBackground>
  );

  const renderSignIn = () => (
    <View style={styles.signinContainer}>
      <View style={styles.signinCard}>
        <Text style={styles.signinTitle}>Sign In</Text>

        <TextInput
          style={styles.input}
          placeholder="@dbcblr.edu.in Email"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={() => {
            setLoading(true);
            // Simulate login success
            setTimeout(() => {
              setLoading(false);
              setUserRole('student'); // Change to 'admin' based on login logic
              setCurrentScreen('student-dashboard');
            }, 1000);
          }}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => setCurrentScreen('welcome')}
        >
          <Text style={styles.buttonTextSecondary}>Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderStudentDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.header}>
        <MaterialIcons name="school" size={28} color="#007bff" />
        <Text style={styles.headerTitle}>Student Dashboard</Text>
        <MaterialIcons name="person" size={28} color="#007bff" />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeMessage}>Welcome back to DBC!</Text>
          <Text style={styles.welcomeSubtext}>Discover amazing events happening around campus</Text>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setCurrentScreen('events')}
          >
            <Ionicons name="calendar-outline" size={40} color="#4CAF50" />
            <Text style={styles.actionTitle}>Browse Events</Text>
            <Text style={styles.actionDescription}>Find upcoming events</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => setCurrentScreen('bookings')}
          >
            <Ionicons name="bookmark-outline" size={40} color="#FF9800" />
            <Text style={styles.actionTitle}>My Registrations</Text>
            <Text style={styles.actionDescription}>View your bookings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingEvents}>
          <Text style={styles.sectionTitle}>Today's Events</Text>
          <View style={styles.eventCard}>
            <Text style={styles.eventTitle}>College Cultural Fest</Text>
            <Text style={styles.eventTime}>2:00 PM - 6:00 PM</Text>
            <Text style={styles.eventLocation}>Main Auditorium</Text>
            <TouchableOpacity style={styles.registrationBtn}>
              <Text style={styles.registrationBtnText}>Register Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );

  const renderAdminDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.header}>
        <MaterialIcons name="admin-panel-settings" size={28} color="#007bff" />
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <MaterialIcons name="logout" size={28} color="#007bff" onPress={() => setCurrentScreen('welcome')} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Total Registrations</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Active Students</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="add-circle-outline" size={40} color="#2196F3" />
            <Text style={styles.actionTitle}>Create Event</Text>
            <Text style={styles.actionDescription}>Add new events</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="list-outline" size={40} color="#4CAF50" />
            <Text style={styles.actionTitle}>Manage Events</Text>
            <Text style={styles.actionDescription}>Edit & delete events</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="people-outline" size={40} color="#FF9800" />
            <Text style={styles.actionTitle}>User Management</Text>
            <Text style={styles.actionDescription}>Manage students</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <Ionicons name="bar-chart-outline" size={40} color="#9C27B0" />
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionDescription}>View reports</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.activityItem}>• New event created: "Tech Symposium 2025"</Text>
          <Text style={styles.activityItem}>• 12 students registered for "Campus Fest"</Text>
          <Text style={styles.activityItem}>• Event "Blood Donation Camp" completed</Text>
        </View>
      </ScrollView>
    </View>
  );

  const renderMainView = () => {
    switch (currentScreen) {
      case 'welcome':
        return renderWelcome();
      case 'signin':
        return renderSignIn();
      case 'signup-email':
        return renderEmailSignup();
      case 'signup-coll-form':
        return renderCollegeForm();
      case 'signup-ext-form':
        return renderExternalForm();
      case 'email-verification':
        return renderEmailVerification();
      case 'password-setup':
        return renderPasswordSetup();
      case 'dashboard':
        return renderDashboard();
      case 'student-dashboard':
        return renderStudentDashboard();
      case 'events':
        return renderEvents();
      case 'bookings':
        return renderBookings();
      default:
        return renderWelcome();
    }
  };

  // New authentication screens
  const renderEmailSignup = () => (
    <View style={styles.signinContainer}>
      <View style={styles.signinCard}>
        <Text style={styles.signinTitle}>Create Account</Text>

        <Text style={styles.inputLabel}>Enter your email address</Text>
        <TextInput
          style={styles.input}
          placeholder="your.email@example.com"
          value={userData.email}
          onChangeText={(value) => setUserData({ ...userData, email: value })}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={handleEmailSubmit}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Continue'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => setCurrentScreen('welcome')}
        >
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderCollegeForm = () => (
    <View style={styles.signinContainer}>
      <View style={styles.signinCard}>
        <Text style={styles.signinTitle}>DBC Student Details</Text>

        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={userData.firstName}
          onChangeText={(value) => setUserData({ ...userData, firstName: value })}
        />

        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={userData.lastName}
          onChangeText={(value) => setUserData({ ...userData, lastName: value })}
        />

        <Text style={styles.inputLabel}>Department</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Computer Science, Engineering"
          value={userData.department}
          onChangeText={(value) => setUserData({ ...userData, department: value })}
        />

        <Text style={styles.inputLabel}>Semester/Year</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., 4th Year, Semester 6"
          value={userData.semester}
          onChangeText={(value) => setUserData({ ...userData, semester: value })}
        />

        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 XXXXX XXXXX"
          value={userData.phone}
          onChangeText={(value) => setUserData({ ...userData, phone: value })}
          keyboardType="phone-pad"
        />

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={handleCollegeFormSubmit}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Complete Registration'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => setCurrentScreen('signup-email')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderExternalForm = () => (
    <View style={styles.signinContainer}>
      <View style={styles.signinCard}>
        <Text style={styles.signinTitle}>Complete Your Profile</Text>

        <Text style={styles.inputLabel}>First Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your first name"
          value={userData.firstName}
          onChangeText={(value) => setUserData({ ...userData, firstName: value })}
        />

        <Text style={styles.inputLabel}>Last Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your last name"
          value={userData.lastName}
          onChangeText={(value) => setUserData({ ...userData, lastName: value })}
        />

        <Text style={styles.inputLabel}>College/Organization Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your college or organization"
          value={userData.collegeOrg}
          onChangeText={(value) => setUserData({ ...userData, collegeOrg: value })}
        />

        <Text style={styles.inputLabel}>Department/Stream</Text>
        <TextInput
          style={styles.input}
          placeholder="Your department or major"
          value={userData.department}
          onChangeText={(value) => setUserData({ ...userData, department: value })}
        />

        <Text style={styles.inputLabel}>Year/Semester</Text>
        <TextInput
          style={styles.input}
          placeholder="Current year or semester"
          value={userData.year}
          onChangeText={(value) => setUserData({ ...userData, year: value })}
        />

        <Text style={styles.inputLabel}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="+91 XXXXX XXXXX"
          value={userData.phone}
          onChangeText={(value) => setUserData({ ...userData, phone: value })}
          keyboardType="phone-pad"
        />

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={handleExternalFormSubmit}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Processing...' : 'Complete Registration'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => setCurrentScreen('signup-email')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmailVerification = () => (
    <View style={styles.signinContainer}>
      <View style={styles.signinCard}>
        <Text style={styles.signinTitle}>Verify Your Email</Text>

        <Text style={styles.descriptionText}>
          We've sent a 6-digit verification code to {userData.email}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="XXXXXX"
          value={userData.otpCode}
          onChangeText={(value) => setUserData({ ...userData, otpCode: value })}
          keyboardType="numeric"
          maxLength={6}
        />

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={handleEmailVerification}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.helpButton}
          onPress={handleResendCode}
        >
          <Text style={styles.helpButtonText}>Didn't receive code? Resend</Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => setCurrentScreen(userData.isCollegeStudent ? 'signup-coll-form' : 'signup-ext-form')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderPasswordSetup = () => (
    <View style={styles.signinContainer}>
      <View style={styles.signinCard}>
        <Text style={styles.signinTitle}>Set Your Password</Text>

        <Text style={styles.descriptionText}>
          Create a secure password for your account
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Create a new password"
          value={userData.password}
          onChangeText={(value) => setUserData({ ...userData, password: value })}
          secureTextEntry
        />

        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          disabled={loading}
          onPress={handlePasswordSetup}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Setting up...' : 'Complete Setup'}
          </Text>
        </Pressable>

        <Pressable
          style={styles.backButton}
          onPress={() => setCurrentScreen('email-verification')}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderDashboard = () => {
    if (!userRole) return renderWelcome();

    return userRole === 'admin' ? renderAdminDashboard() : renderStudentDashboard();
  };

  // Form validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateFormData = (formData: Partial<typeof userData>): boolean => {
    if (!formData.firstName?.trim()) {
      setError('First name is required');
      return false;
    }
    if (!formData.lastName?.trim()) {
      setError('Last name is required');
      return false;
    }
    if (!formData.phone?.trim()) {
      setError('Phone number is required');
      return false;
    }
    if (formData.password && formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    return true;
  };

  // Email submission handler - Step 1 - Collect email and determine user type (with whitelist priority)
  const handleEmailSubmit = async () => {
    console.log('🔧 DEBUG: handleEmailSubmit called');

    const email = userData.email.trim();
    console.log('🔧 DEBUG: Email entered:', email);

    if (!validateEmail(email)) {
      console.log('🔧 DEBUG: Email validation failed');
      setError('Please enter a valid email address');
      return;
    }

    console.log('🔧 DEBUG: Email validation passed');
    setLoading(true);
    setError(null);

    try {
      // Check whitelist first - takes priority over domain
      const whitelistedRole = await getWhitelistedRole(email);
      console.log('🔧 DEBUG: Whitelisted role:', whitelistedRole);

      // Check domain for fallback logic
      const domain = email.split('@')[1]?.toLowerCase();
      console.log('🔧 DEBUG: Email domain:', domain);

      const isCollegeStudent = domain === 'dbcblr.edu.in';
      console.log('🔧 DEBUG: Is DBC domain:', isCollegeStudent);

      setUserData(prev => ({
        ...prev,
        isCollegeStudent,
        email
      }));

      console.log('🔧 DEBUG: User data updated, navigating to form');

      // Navigate based on whitelist or domain
      if (whitelistedRole) {
        // Whitelisted users get appropriate forms
        setCurrentScreen(isCollegeStudent ? 'signup-coll-form' : 'signup-ext-form');
      } else {
        // Non-whitelisted users follow domain logic
        setCurrentScreen(isCollegeStudent ? 'signup-coll-form' : 'signup-ext-form');
      }

    } catch (err: any) {
      console.log('🔧 DEBUG: handleEmailSubmit error:', err);
      console.log('🔧 DEBUG: Error message:', err.message);
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
      console.log('🔧 DEBUG: handleEmailSubmit completed');
    }
  };

  // College form submission - Step 2 - Send OTP with signInWithOtp
  const handleCollegeFormSubmit = async () => {
    if (!validateFormData(userData)) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔧 DEBUG: Sending OTP to college student:', userData.email);

      // Use signInWithOtp for clean OTP authentication
      const { data, error } = await supabase.auth.signInWithOtp({
        email: userData.email,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            department: userData.department,
            semester: userData.semester,
            phone: userData.phone,
            user_type: 'dbc-student',
            is_college_student: true,
            college: 'DBCBLR',
            domain: 'dbcblr.edu.in'
          }
        }
      });

      if (error) {
        console.log('🔧 DEBUG: OTP send error:', error);
        throw error;
      }

      console.log('🔧 DEBUG: OTP sent successfully to:', userData.email);

      // Now user will receive a 6-digit code via email
      setCurrentScreen('email-verification');

    } catch (err: any) {
      console.log('🔧 DEBUG: handleCollegeFormSubmit error:', err.message);
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // External form submission - Step 2 - Send OTP with signInWithOtp
  const handleExternalFormSubmit = async () => {
    if (!validateFormData(userData)) return;

    setLoading(true);
    setError(null);

    try {
      console.log('🔧 DEBUG: Sending OTP to external user:', userData.email);

      // Use signInWithOtp for clean OTP authentication
      const { data, error } = await supabase.auth.signInWithOtp({
        email: userData.email,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            department: userData.department,
            year: userData.year,
            phone: userData.phone,
            user_type: 'external',
            is_college_student: false,
            organization: userData.collegeOrg,
            domain: userData.email.split('@')[1]
          }
        }
      });

      if (error) {
        console.log('🔧 DEBUG: OTP send error:', error);
        throw error;
      }

      console.log('🔧 DEBUG: OTP sent successfully to:', userData.email);

      // Now user will receive a 6-digit code via email
      setCurrentScreen('email-verification');

    } catch (err: any) {
      console.log('🔧 DEBUG: handleExternalFormSubmit error:', err.message);
      setError(err.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Email verification handler - Step 3 - Handle email verification codes
  const handleEmailVerification = async () => {
    if (!userData.otpCode || userData.otpCode.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Verify email with Supabase using the token provided by user
      const { data, error } = await supabase.auth.verifyOtp({
        email: userData.email,
        token: userData.otpCode,
        type: 'email'
      });

      if (error) throw error;

      // Email verified successfully
      console.log('Email verified for user:', userData.email);

      // Set user role based on domain and proceed
      const domain = userData.email.split('@')[1]?.toLowerCase();
      const role = domain === 'dbcblr.edu.in' ? 'student' : 'external';
      setUserRole(role);

      setCurrentScreen('dashboard');

    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check your code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend verification code - Real email functionality with Supabase
  const handleResendCode = async () => {
    setLoading(true);

    try {
      const { error } = await resendVerificationEmail(userData.email);

      if (error) throw error;

      setError('Verification code sent! Check your email.');
      setTimeout(() => setError(null), 3000);

    } catch (err: any) {
      setError(err.message || 'Failed to resend verification code');
    } finally {
      setLoading(false);
    }
  };

  // Password setup handler - Step 4 - Complete user account setup
  const handlePasswordSetup = async () => {
    if (!validateFormData({ password: userData.password })) return;

    setLoading(true);
    setError(null);

    try {
      // Complete the authentication with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: userData.password
      });

      if (error) throw error;

      // Authentication successful
      console.log('User authenticated:', userData.email);

      // Set user role based on domain
      const domain = userData.email.split('@')[1]?.toLowerCase();
      const role = domain === 'dbcblr.edu.in' ? 'student' : 'external';
      setUserRole(role);

      setCurrentScreen('dashboard');

    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const renderEvents = () => (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={30} color="#007bff" onPress={() => setCurrentScreen('student-dashboard')} />
        <Text style={styles.screenTitle}>Available Events</Text>
        <Ionicons name="calendar" size={30} color="#007bff" />
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>Tech Symposium 2025</Text>
          <Text style={styles.eventDate}>March 15, 2025</Text>
          <Text style={styles.eventDescription}>Annual technology symposium featuring latest innovations</Text>
          <Text style={styles.eventDetails}>📍 Seminar Hall | 👥 200 capacity | 🎫 Free</Text>
          <TouchableOpacity style={styles.registrationBtn}>
            <Text style={styles.registrationBtnText}>Register Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>Campus Fest 2025</Text>
          <Text style={styles.eventDate}>April 2, 2025</Text>
          <Text style={styles.eventDescription}>Three day cultural festival with music, dance and drama</Text>
          <Text style={styles.eventDetails}>📍 Campus Grounds | 👥 500 capacity | 🎫 ₹100</Text>
          <TouchableOpacity style={styles.registrationBtn}>
            <Text style={styles.registrationBtnText}>Register Now</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventCard}>
          <Text style={styles.eventTitle}>Blood Donation Camp</Text>
          <Text style={styles.eventDate}>April 10, 2025</Text>
          <Text style={styles.eventDescription}>Save lives by donating blood at our annual camp</Text>
          <Text style={styles.eventDetails}>📍 Health Center | 👥 50 capacity | 🎫 Free</Text>
          <TouchableOpacity style={[styles.registrationBtn, styles.registeredBtn]}>
            <Text style={styles.registrationBtnText}>Already Registered</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderBookings = () => (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={30} color="#007bff" onPress={() => setCurrentScreen('student-dashboard')} />
        <Text style={styles.screenTitle}>My Registrations</Text>
        <Ionicons name="bookmark" size={30} color="#007bff" />
      </View>

      <ScrollView style={styles.scrollContent}>
        <View style={styles.bookingCard}>
          <Text style={styles.eventTitle}>Blood Donation Camp</Text>
          <Text style={styles.bookingDate}>📅 April 10, 2025 | 📍 Health Center</Text>
          <Text style={styles.statusText}>✅ Registered</Text>
        </View>

        <View style={styles.bookingCard}>
          <Text style={styles.eventTitle}>Campus Fest 2025</Text>
          <Text style={styles.bookingDate}>📅 April 2, 2025 | 📍 Campus Grounds</Text>
          <Text style={styles.statusText}>✅ Registered</Text>
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {renderMainView()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 50,
    opacity: 0.9,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 25,
    marginBottom: 30,
  },
  menuCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    padding: 25,
    width: 150,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  menuIcon: {
    fontSize: 35,
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  menuDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    position: 'absolute',
    bottom: 50,
    opacity: 0.8,
  },
  signinContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#f8f9fa',
  },
  signinCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  signinTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: '#6c757d',
  },
  buttonTextSecondary: {
    color: '#fff',
    fontSize: 16,
  },
  // Dashboard Styles
  dashboardContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeCard: {
    backgroundColor: '#007bff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  welcomeMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#e6f3ff',
    lineHeight: 20,
  },
  quickActions: {
    marginBottom: 20,
  },
  actionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
  },
  upcomingEvents: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  eventCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  eventDate: {
    fontSize: 14,
    color: '#007bff',
    marginBottom: 5,
  },
  eventTime: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 2,
  },
  eventLocation: {
    fontSize: 14,
    color: '#6c757d',
  },
  eventDetails: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  registrationBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  registeredBtn: {
    backgroundColor: '#6c757d',
  },
  registrationBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  recentActivity: {
    marginBottom: 20,
  },
  activityItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
  },
  // Screen Styles
  screen: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollContent: {
    flex: 1,
    padding: 20,
  },
  // Booking Styles
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  bookingDate: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
  },
  // Authentication Styles
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
    marginTop: 10,
  },
  errorText: {
    color: '#dc3545',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  backButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
  },
  descriptionText: {
    color: '#6c757d',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  helpButton: {
    alignSelf: 'center',
    marginTop: 10,
  },
  helpButtonText: {
    color: '#007bff',
    fontSize: 14,
  },
  // Enhanced Professional Welcome Screen Styles
  primaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 45,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 60,
    minHeight: 120,
  },
  primaryButtonIcon: {
    marginBottom: 15,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007bff',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  primaryButtonSubtitle: {
    fontSize: 16,
    color: '#007bff',
    textAlign: 'center',
    opacity: 0.85,
    fontWeight: '500',
    maxWidth: 280,
    lineHeight: 22,
  },
  staffLoginButton: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  staffLoginText: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
    fontWeight: '600',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    textDecorationLine: 'underline',
    textDecorationColor: '#ffffff',
  },
});
