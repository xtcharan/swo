import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import authentication screens
import { LoginScreen } from '../screens/auth/LoginScreen';
import { SignUpChoiceScreen } from '../screens/auth/SignUpChoiceScreen';
import { DBCActivationScreen } from '../screens/auth/DBCActivationScreen';
import { DBCOnboardingScreen } from '../screens/auth/DBCOnboardingScreen';
import { GuestSignUpScreen } from '../screens/auth/GuestSignUpScreen';
import { OTPScreen } from '../screens/auth/OTPScreen';
import { ProfilePersonalizationScreen } from '../screens/auth/ProfilePersonalizationScreen';

const AuthStack = createNativeStackNavigator();

export const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="SignUpChoice" component={SignUpChoiceScreen} />
      <AuthStack.Screen name="DBCActivation" component={DBCActivationScreen} />
      <AuthStack.Screen name="DBCOnboarding" component={DBCOnboardingScreen} />
      <AuthStack.Screen name="GuestSignUp" component={GuestSignUpScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
      <AuthStack.Screen name="Personalization" component={ProfilePersonalizationScreen} />
    </AuthStack.Navigator>
  );
};
