import React, { useState } from 'react';
import { StyleSheet, Alert, Pressable, ScrollView } from 'react-native';
import { YStack, H2, Input, Button, Text, Image, XStack, RadioGroup } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

export const DBCOnboardingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    department: '',
    year: '',
    phoneNo: '',
    personalEmail: '',
    newPassword: '',
    confirmPassword: '',
  });

  const departmentOptions = ['BCA', 'B.COM', 'BA', 'BBM', 'BSW', 'BCOM', 'BA'];
  const yearOptions = ['1st Year', '2nd Year', '3rd Year'];

  const handleSubmit = async () => {
    // Basic validation
    if (!userData.firstName || !userData.lastName || !userData.personalEmail ||
        !userData.newPassword || !userData.confirmPassword) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (userData.newPassword !== userData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (userData.newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      // Get current user
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        throw new Error('No authenticated user');
      }

      // Update user email and password
      const { data: userUpdate, error: authError } = await supabase.auth.updateUser({
        email: userData.personalEmail,
        password: userData.newPassword,
      });

      if (authError) throw authError;

      // Update profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.session.user.id,
        first_name: userData.firstName,
        last_name: userData.lastName,
        department: userData.department,
        year: userData.year,
        phone_number: userData.phoneNo,
        email: userData.personalEmail,
        created_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      // Navigate to verification screen
      (navigation as any).navigate('OTP', {
        email: userData.personalEmail,
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
      <YStack alignItems="center" marginTop="$4" marginBottom="$4">
        <Image
          source={require('../../assets/logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
        <H2 color="#011025" textAlign="center" marginTop="$2">
          Welcome! Let's get you set up.
        </H2>
        <Text color="#6c757d" fontSize="$3" textAlign="center">
          Complete your profile to continue
        </Text>
      </YStack>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <YStack space="$4" paddingHorizontal="$4">
        <Text color="#011025" fontSize="$4" fontWeight="bold">
          Register Number: {(route.params as any)?.registerNumber || 'Your Reg No'}
        </Text>

          <Text color="#011025" fontSize="$5" fontWeight="bold">
            Your Details
          </Text>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">First Name *</Text>
            <Input
              placeholder="Enter first name"
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
              placeholder="Enter last name"
              placeholderTextColor="#6c757d"
              value={userData.lastName}
              onChangeText={(value) => setUserData({...userData, lastName: value})}
              style={styles.input}
              autoCapitalize="words"
            />
          </YStack>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">Department</Text>
            <XStack flexWrap="wrap" gap="$2">
              {departmentOptions.map((dept) => (
                <Pressable
                  key={dept}
                  onPress={() => setUserData({...userData, department: dept})}
                  style={[
                    styles.optionButton,
                    userData.department === dept && styles.optionButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      userData.department === dept && styles.optionTextSelected,
                    ]}
                  >
                    {dept}
                  </Text>
                </Pressable>
              ))}
            </XStack>
          </YStack>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">Year</Text>
            <XStack flexWrap="wrap" gap="$2">
              {yearOptions.map((year) => (
                <Pressable
                  key={year}
                  onPress={() => setUserData({...userData, year: year})}
                  style={[
                    styles.optionButton,
                    userData.year === year && styles.optionButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      userData.year === year && styles.optionTextSelected,
                    ]}
                  >
                    {year}
                  </Text>
                </Pressable>
              ))}
            </XStack>
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
            <Text color="#6c757d" fontSize="$3">Personal Email *</Text>
            <Input
              placeholder="your.email@gmail.com"
              placeholderTextColor="#6c757d"
              value={userData.personalEmail}
              onChangeText={(value) => setUserData({...userData, personalEmail: value})}
              style={styles.input}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </YStack>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">New Password *</Text>
            <Input
              placeholder="Enter new password"
              placeholderTextColor="#6c757d"
              value={userData.newPassword}
              onChangeText={(value) => setUserData({...userData, newPassword: value})}
              style={styles.input}
              secureTextEntry
            />
          </YStack>

          <YStack space="$2">
            <Text color="#6c757d" fontSize="$3">Confirm Password *</Text>
            <Input
              placeholder="Confirm new password"
              placeholderTextColor="#6c757d"
              value={userData.confirmPassword}
              onChangeText={(value) => setUserData({...userData, confirmPassword: value})}
              style={styles.input}
              secureTextEntry
            />
          </YStack>

          <Button
            backgroundColor="#d6b46c"
            onPress={handleSubmit}
            disabled={loading}
            marginTop="$6"
            marginBottom="$6"
            size="$5"
            pressStyle={{ backgroundColor: '#b89958' }}
          >
            <Text fontSize="$5" fontWeight="bold" color="black">
              {loading ? 'PROCESSING...' : 'FINISH & VERIFY EMAIL'}
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
    width: 60,
    height: 60,
  },
  input: {
    borderColor: '#f8f9fa',
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  optionButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  optionText: {
    fontSize: 14,
    color: '#6c757d',
  },
  optionTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
});
