// appsmobile/navigation/MainAppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';

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

export const MainAppNavigator = () => {
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
