import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

// Import navigators and screens
import { AuthNavigator } from './AuthNavigator';
import { supabase } from '../lib/supabase';

// Dashboard screens (existing functionality)
const StudentDashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#011025' }}>Student Dashboard</Text>
    <Text style={{ fontSize: 16, color: '#6c757d', marginTop: 10 }}>Welcome back to DBC!</Text>
  </View>
);
const AdminDashboardScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' }}>
    <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#011025' }}>Admin Dashboard</Text>
    <Text style={{ fontSize: 16, color: '#6c757d', marginTop: 10 }}>Manage your events</Text>
  </View>
);
const EventsScreen = () => null; // Placeholder
const BookingsScreen = () => null; // Placeholder

const MainStack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="StudentDashboard" component={StudentDashboardScreen} />
      <MainStack.Screen name="Dashboard" component={AdminDashboardScreen} />
      <MainStack.Screen name="Events" component={EventsScreen} />
      <MainStack.Screen name="Bookings" component={BookingsScreen} />
      {/* Add all your existing screens here */}
    </MainStack.Navigator>
  );
};

export const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'admin' | 'external' | null>(null);

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        // Determine user role based on email or metadata
        const email = session.user.email || '';
        if (email.includes('@dbcblr.edu.in')) {
          setUserRole('student');
        } else if (email.includes('@admin') || session.user.user_metadata?.role === 'admin') {
          setUserRole('admin');
        } else {
          setUserRole('external');
        }
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setIsAuthenticated(true);
          const email = session.user.email || '';
          if (email.includes('@dbcblr.edu.in')) {
            setUserRole('student');
          } else if (email.includes('@admin') || session.user.user_metadata?.role === 'admin') {
            setUserRole('admin');
          } else {
            setUserRole('external');
          }
        } else {
          setIsAuthenticated(false);
          setUserRole(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
