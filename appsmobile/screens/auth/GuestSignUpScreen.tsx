import React, { useState } from 'react';
import { StyleSheet, Alert, Pressable, ScrollView } from 'react-native';
import { YStack, H1, Input, Button, Text, Image } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

export const GuestSignUpScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    collegeName: '',
    phoneNo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async () => {
    // Basic validation
    if (!userData.firstName || !userData.lastName || !userData.email ||
        !userData.password || !userData.confirmPassword) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!acceptedTerms) {
      Alert.alert('Error', 'Please accept the terms of service');
      return;
    }

    if (userData.password !== userData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (userData.password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            college_name: userData.collegeName,
            phone_number: userData.phoneNo,
            is_guest: true,
          }
        }
      });

      if (error) throw error;

      // Navigate to OTP verification
      (navigation as any).navigate('OTP', {
        email: userData.email,
        isNewUser: true,
        nextScreen: 'Personalization'
      });

    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="white" padding="$4">
      <YStack alignItems="center" marginTop="$2" marginBottom="$4">
        <Image
          source={require('../../assets/logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
        <H1 color="#011025" textAlign="center">
          Create a Guest Account
        </H1>
      </YStack>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <YStack space="$4" paddingHorizontal="$4">
          <Text color="#011025" fontSize="$5" fontWeight="bold">
            Your Details
          </Text>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">First Name *</Text>
            <Input
              placeholder="Enter your first name"
              placeholderTextColor="#6c757d"
              value={userData.firstName}
              onChangeText={(value) => setUserData({...userData, firstName: value})}
              style={styles.input}
              autoCapitalize="words"
            />
          </YStack>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">Last Name *</Text>
            <Input
              placeholder="Enter your last name"
              placeholderTextColor="#6c757d"
              value={userData.lastName}
              onChangeText={(value) => setUserData({...userData, lastName: value})}
              style={styles.input}
              autoCapitalize="words"
            />
          </YStack>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">College Name</Text>
            <Input
              placeholder="Your college or organization"
              placeholderTextColor="#6c757d"
              value={userData.collegeName}
              onChangeText={(value) => setUserData({...userData, collegeName: value})}
              style={styles.input}
              autoCapitalize="words"
            />
          </YStack>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">Phone Number</Text>
            <Input
              placeholder="+91 XXXXX XXXXX"
              placeholderTextColor="#6c757d"
              value={userData.phoneNo}
              onChangeText={(value) => setUserData({...userData, phoneNo: value})}
              style={styles.input}
              keyboardType="phone-pad"
            />
          </YStack>

          <Text color="#011025" fontSize="$5" fontWeight="bold" marginTop="$4">
            Your Login Info
          </Text>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">Email *</Text>
            <Input
              placeholder="your.email@example.com"
              placeholderTextColor="#6c757d"
              value={userData.email}
              onChangeText={(value) => setUserData({...userData, email: value})}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </YStack>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">Password *</Text>
            <Input
              placeholder="Create a password"
              placeholderTextColor="#6c757d"
              value={userData.password}
              onChangeText={(value) => setUserData({...userData, password: value})}
              style={styles.input}
              secureTextEntry
            />
          </YStack>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">Confirm Password *</Text>
            <Input
              placeholder="Confirm your password"
              placeholderTextColor="#6c757d"
              value={userData.confirmPassword}
              onChangeText={(value) => setUserData({...userData, confirmPassword: value})}
              style={styles.input}
              secureTextEntry
            />
          </YStack>

        

          <Button
            backgroundColor="#007bff"
            onPress={handleSubmit}
            disabled={loading || !acceptedTerms}
            marginTop="$6"
            marginBottom="$6"
            size="$5"
            pressStyle={{ backgroundColor: '#0056cc' }}
          >
            <Text fontSize="$5" fontWeight="bold" color="white">
              {loading ? 'CREATING...' : 'CREATE & VERIFY EMAIL'}
            </Text>
          </Button>
        </YStack>
      </ScrollView>

      <YStack alignItems="center" marginTop="auto" marginBottom="$4" paddingHorizontal="$4">
        <Pressable onPress={() => navigation.goBack()}>
          <Text color="#007bff" fontSize="$4">
            ← Back
          </Text>
        </Pressable>
      </YStack>
    </YStack>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 70,
    height: 70,
  },
  input: {
    borderColor: '#f8f9fa',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
});
