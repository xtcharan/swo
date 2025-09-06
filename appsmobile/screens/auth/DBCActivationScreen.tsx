import React, { useState } from 'react';
import { StyleSheet, Alert, Pressable } from 'react-native';
import { YStack, H2, Input, Button, Text, Image, Spacer } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

export const DBCActivationScreen = () => {
  const navigation = useNavigation();
  const [registerNumber, setRegisterNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleActivation = async () => {
    if (!registerNumber || !password) {
      Alert.alert('Error', 'Please enter your register number and password');
      return;
    }

    setLoading(true);

    try {
      // Create placeholder email for DBC student
      const placeholderEmail = `${registerNumber.toLowerCase()}@dbcswoff.app`;

      // Attempt to sign in with the temporary credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: placeholderEmail,
        password: password,
      });

      if (error) {
        // If login fails, the account might be pre-provisioned but not activated
        throw new Error('Account not found or invalid credentials. Please contact DBC admin.');
      }

      if (data.user) {
        // Navigate to onboarding to complete profile
        navigation.navigate('DBCOnboarding' as never);
      }
    } catch (error: any) {
      Alert.alert('Activation Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <YStack flex={1} backgroundColor="white" padding="$4">
      <YStack alignItems="center" marginTop="$6" marginBottom="$6">
        <Image
          source={require('../../assets/logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
        <H2 color="#011025" textAlign="center" marginTop="$4">
          Activate Your Account
        </H2>
        <Text color="#6c757d" fontSize="$4" textAlign="center" marginTop="$2">
          Welcome to DBC SWO! Let's get started.
        </Text>
      </YStack>

      <YStack space="$4" paddingHorizontal="$4" flex={1} justifyContent="center">
        <Text color="#011025" fontSize="$5" fontWeight="bold" textAlign="center">
          Enter Your Details
        </Text>

        <YStack space="$2">
          <Text color="#6c757d" fontSize="$3">Register Number</Text>
          <Input
            placeholder="e.g., U19PD"
            placeholderTextColor="#6c757d"
            value={registerNumber}
            onChangeText={setRegisterNumber}
            autoCapitalize="none"
            style={styles.input}
          />
        </YStack>

        <Spacer />

        <YStack space="$2">
          <Text color="#6c757d" fontSize="$3">Password</Text>
          <Input
            placeholder="Enter your password"
            placeholderTextColor="#6c757d"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </YStack>

        <Button
          backgroundColor="#007bff"
          onPress={handleActivation}
          disabled={loading}
          marginTop="$6"
          size="$5"
          pressStyle={{ backgroundColor: '#0056cc' }}
        >
          <Text fontSize="$5" fontWeight="bold" color="white">
            {loading ? 'Activating...' : 'PROCEED'}
          </Text>
        </Button>
      </YStack>

      <YStack alignItems="center" marginTop="auto" marginBottom="$4">
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
    width: 80,
    height: 80,
  },
  input: {
    borderColor: '#f8f9fa',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
});
