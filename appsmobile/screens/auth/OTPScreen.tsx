import React, { useState } from 'react';
import { StyleSheet, Alert, Pressable } from 'react-native';
import { YStack, H2, Input, Button, Text, Image } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';

export const OTPScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const email = (route.params as any)?.email || '';
  const isNewUser = (route.params as any)?.isNewUser || false;
  const nextScreen = (route.params as any)?.nextScreen || 'Dashboard';

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: 'email'
      });

      if (error) throw error;

      // Verification successful
      if (nextScreen === 'Personalization') {
        (navigation as any).navigate('Personalization');
      } else {
        // Navigate to main app dashboard
        navigation.reset({
          index: 0,
          routes: [{ name: 'Dashboard' as never }],
        });
      }

    } catch (error: any) {
      Alert.alert('Verification Failed', 'Please check your code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);

    try {
      if (isNewUser) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email: email,
        });
        if (error) throw error;
      }

      Alert.alert('Success', 'Verification code sent to your email');
    } catch (error: any) {
      Alert.alert('Error', 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleOtpChange = (text: string) => {
    // Only allow numbers and limit to 6 digits
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(numericText);
  };

  return (
    <YStack flex={1} backgroundColor="white" justifyContent="center" padding="$4">
      <YStack alignItems="center" marginBottom="$6">
        <Image
          source={require('../../assets/logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
        <H2 color="#011025" textAlign="center" marginTop="$4">
          Verify Your Email
        </H2>
        <Text color="#6c757d" fontSize="$4" textAlign="center" marginTop="$2">
          We've sent a 6-digit code to
        </Text>
        <Text color="#011025" fontSize="$4" fontWeight="bold" textAlign="center">
          {email}
        </Text>
        <Text color="#6c757d" fontSize="$3" textAlign="center" marginTop="$2">
          Please enter it below
        </Text>
      </YStack>

      <YStack space="$6" paddingHorizontal="$6">
        <Input
          placeholder="XXXXXX"
          placeholderTextColor="#6c757d"
          value={otp}
          onChangeText={handleOtpChange}
          style={styles.otpInput}
          textAlign="center"
          keyboardType="numeric"
          maxLength={6}
          fontSize={24}
          fontWeight="bold"
        />

        <Button
          backgroundColor="#d6b46c"
          onPress={handleVerify}
          disabled={loading || otp.length !== 6}
          size="$5"
          pressStyle={{ backgroundColor: '#b89958' }}
        >
          <Text fontSize="$5" fontWeight="bold" color="black">
            {loading ? 'VERIFYING...' : 'VERIFY'}
          </Text>
        </Button>

        <YStack alignItems="center" space="$2">
          <Text color="#6c757d" fontSize="$3">
            Didn't receive code?
          </Text>
          <Pressable
            onPress={handleResend}
            disabled={resendLoading}
          >
            <Text color="#007bff" fontSize="$4" fontWeight="bold">
              {resendLoading ? 'Sending...' : 'Resend Code'}
            </Text>
          </Pressable>
        </YStack>
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
    width: 60,
    height: 60,
  },
  otpInput: {
    borderColor: '#f8f9fa',
    borderWidth: 3,
    borderRadius: 12,
    padding: 16,
    fontSize: 24,
    letterSpacing: 8,
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
});
