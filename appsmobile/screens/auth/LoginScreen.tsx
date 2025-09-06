// Import necessary modules from React and React Native
import React, { useState } from 'react';
import { StyleSheet, Alert, Pressable, Dimensions } from 'react-native';

// Import UI components from Tamagui for a consistent design system
import { YStack, H2, Input, Button, Text, Image, Spacer } from 'tamagui';

// Import navigation hook from React Navigation to handle screen transitions
import { useNavigation } from '@react-navigation/native';

// Import the Supabase client for authentication and database interactions
import { supabase } from '../../lib/supabase';

// Import LinearGradient for creating visually appealing gradient backgrounds
import { LinearGradient } from '@tamagui/linear-gradient';

// Define the LoginScreen functional component
export const LoginScreen = () => {
  // Initialize navigation hook to programmatically navigate between screens
  const navigation = useNavigation();

  // State for storing the user's input (email or registration number)
  const [credential, setCredential] = useState('');

  // State for storing the user's password
  const [password, setPassword] = useState('');

  // State for managing the loading indicator during async operations like login
  const [loading, setLoading] = useState(false);

  // Asynchronous function to handle the user login process
  const handleLogin = async () => {
    // Validate that both credential and password fields are filled
    if (!credential || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Set loading to true to provide feedback to the user (e.g., disable button, show spinner)
    setLoading(true);

    try {
      // Check if the credential input is likely a registration number by testing for digits
      const isRegisterNumber = /\d/.test(credential);

      // If it's a registration number, create a placeholder email; otherwise, use the credential as is
      const email = isRegisterNumber
        ? `${credential.toLowerCase()}@dbcswoff.app`
        : credential;

      // Call Supabase's authentication method to sign in the user
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // If Supabase returns an error, throw it to be caught by the catch block
      if (error) throw error;

      // If the login is successful and a user object is returned...
      if (data.user) {
        // ...reset the navigation stack to the Dashboard, preventing the user from going back to the login screen
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' as never }],
        });
      }
    } catch (error: any) {
      // If any error occurs during the login process, show an alert with the error message
      Alert.alert('Login Failed', error.message);
    } finally {
      // Set loading back to false regardless of whether the login succeeded or failed
      setLoading(false);
    }
  };

  // Render the UI for the login screen
  return (
    // Main container stack that fills the entire screen
    <YStack flex={1} backgroundColor="$background">
      {/* A full-screen linear gradient for a modern, visually appealing background */}
      <LinearGradient
        colors={['#000000', '#1E3A8A']} // Gradient from black to a deep blue
        start={[0, 0]} // Gradient starts at the top-left corner
        end={[1, 1]}   // Gradient ends at the bottom-right corner
        style={StyleSheet.absoluteFill} // Ensures the gradient covers the entire screen
      />
      {/* Overlay stack with a semi-transparent background to ensure text readability */}
      <YStack flex={1} justifyContent="center" padding="$4" backgroundColor="rgba(0, 0, 0, 0.5)">
        {/* Spacer to push content down from the top */}
        <Spacer />
        {/* Logo and Welcome Text Section */}
        <YStack alignItems="center" marginBottom="$6">
          <Image
            source={require('../../assets/logo.webp')}
            style={styles.logo}
            resizeMode="contain"
          />
          <H2 color="white" fontWeight="bold" marginTop="$4" textAlign="center" letterSpacing={1}>
            Welcome Back!
          </H2>
          <Text color="$gray10" fontSize="$4" textAlign="center" marginTop="$2">
            Continue with DBC SWO
          </Text>
        </YStack>

        {/* Form Inputs and Buttons Section */}
        <YStack space="$4" paddingHorizontal="$4">
          {/* Input field for Email or Register Number */}
          <Input
            placeholder="Email or Register Number"
            placeholderTextColor="$gray10"
            value={credential}
            onChangeText={setCredential}
            autoCapitalize="none"
            style={styles.input}
            color="white"
            keyboardAppearance="dark" // Sets the keyboard theme to dark on iOS
          />
          {/* Input field for Password */}
          <Input
            placeholder="Password"
            placeholderTextColor="$gray10"
            value={password}
            onChangeText={setPassword}
            secureTextEntry // Hides the password input
            style={styles.input}
            color="white"
            keyboardAppearance="dark"
          />

          {/* Login Button */}
          <Button
            theme="blue" // Use a theme from Tamagui for base styles
            backgroundColor="#d6b46c" // Custom background color for a distinct look
            onPress={handleLogin}
            disabled={loading}
            marginTop="$4"
            pressStyle={{ backgroundColor: '#b89b5a' }} // Style for when the button is pressed
            animateOnly={['transform']} // Animate only the transform property for performance
            animation="bouncy" // Use a bouncy animation on press for a playful feel
          >
            <Text fontSize="$5" fontWeight="bold" color="black">
              {loading ? 'Logging in...' : 'LOG IN'}
            </Text>
          </Button>

          {/* Forgot Password Link */}
          <Pressable>
            <Text color="#d6b46c" textAlign="center" marginTop="$4">
              Forgot Password?
            </Text>
          </Pressable>

          {/* Sign Up Navigation Link */}
          <Pressable
            onPress={() => navigation.navigate('SignUpChoice' as never)}
            style={styles.signupButton}
          >
            <Text color="$gray10">Don't have an account? </Text>
            <Text color="#d6b46c" fontWeight="bold">
              Sign Up
            </Text>
          </Pressable>
        </YStack>

        {/* Admin Login Section, positioned at the bottom */}
        <YStack alignItems="center" marginTop="auto" marginBottom="$4">
          <Pressable
            onPress={() => navigation.navigate('AdminLogin' as never)}
            style={styles.adminButton}
          >
            <Text color="white" fontSize="$3">
              Are you an Admin?
            </Text>
          </Pressable>
        </YStack>
      </YStack>
    </YStack>
  );
};

// StyleSheet for custom styles that are not covered by Tamagui's props
const styles = StyleSheet.create({
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)', // Semi-transparent white background
    borderColor: '#f8f9fa', // Light border color
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  // Style for the sign-up button container to align text horizontally
  signupButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  // Style for the admin login button for a modern, pill-shaped look
  adminButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent white background
  },
});