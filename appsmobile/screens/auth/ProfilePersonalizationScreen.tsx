import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { YStack, H2, Input, Button, Text, Image, XStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../lib/supabase';
import { MaterialIcons } from '@expo/vector-icons';

const interestOptions = [
  'Sports', 'Tech', 'Music', 'Arts', 'Dance', 'Debating', 'Gaming',
  'Cultural', 'Art', 'Music', 'Sports', 'Tech', 'Coding', 'Literature'
];

export const ProfilePersonalizationScreen = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    username: '',
    interests: [] as string[],
  });

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.user) {
        throw new Error('No authenticated user');
      }

      // Update user profile with username and interests
      const { error } = await supabase.from('user_profiles').update({
        username: userData.username,
        interests: userData.interests,
        updated_at: new Date().toISOString(),
      }).eq('user_id', session.session.user.id);

      if (error) throw error;

      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Dashboard' as never }],
      });

    } catch (error: any) {
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    // Navigate to main app without personalization
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' as never }],
    });
  };

  const toggleInterest = (interest: string) => {
    setUserData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  return (
    <YStack flex={1} backgroundColor="white" padding="$4">
      <YStack alignItems="center" marginTop="$6" marginBottom="$4">
        <Image
          source={require('../../assets/logo.webp')}
          style={styles.logo}
          resizeMode="contain"
        />
        <H2 color="#011025" textAlign="center" marginTop="$4">
          You're In! 🎉
        </H2>
        <Text color="#6c757d" fontSize="$4" textAlign="center">
          Let's personalize your profile
        </Text>
      </YStack>

      <YStack flex={1} space="$4" paddingHorizontal="$4">
        {/* Avatar Upload Placeholder */}
        <YStack alignItems="center" space="$2">
          <YStack
            width={100}
            height={100}
            backgroundColor="#f8f9fa"
            borderRadius={50}
            alignItems="center"
            justifyContent="center"
            borderWidth={2}
            borderColor="#d6b46c"
          >
            <MaterialIcons name="person" size={50} color="#6c757d" />
            <YStack
              position="absolute"
              bottom={0}
              right={0}
              backgroundColor="#d6b46c"
              borderRadius={15}
              width={30}
              height={30}
              alignItems="center"
              justifyContent="center"
            >
              <MaterialIcons name="add" size={20} color="white" />
            </YStack>
          </YStack>
          <Text color="#d6b46c" fontSize="$3" fontWeight="bold">
            Upload Avatar
          </Text>
        </YStack>

        {/* Username Input */}
        <YStack space="$2">
          <Text color="#011025" fontSize="$4" fontWeight="bold">
            Username
          </Text>
          <Input
            placeholder="e.g., JohnDoe25"
            placeholderTextColor="#6c757d"
            value={userData.username}
            onChangeText={(value) => setUserData({...userData, username: value})}
            style={styles.input}
            autoCapitalize="none"
          />
        </YStack>

        {/* Interests Selection */}
        <YStack space="$2">
          <Text color="#011025" fontSize="$4" fontWeight="bold">
            What are you interested in?
          </Text>
          <XStack flexWrap="wrap" gap="$2">
            {interestOptions.map((interest) => (
              <Pressable
                key={interest}
                onPress={() => toggleInterest(interest)}
                style={[
                  styles.interestButton,
                  userData.interests.includes(interest) && styles.interestButtonSelected,
                ]}
              >
                <Text
                  style={[
                    styles.interestText,
                    userData.interests.includes(interest) && styles.interestTextSelected,
                  ]}
                >
                  {interest}
                </Text>
              </Pressable>
            ))}
          </XStack>
        </YStack>

        <YStack space="$3" marginTop="$4">
          <Button
            backgroundColor="#d6b46c"
            onPress={handleSubmit}
            disabled={loading}
            size="$5"
            pressStyle={{ backgroundColor: '#b89958' }}
          >
            <Text fontSize="$5" fontWeight="bold" color="black">
              {loading ? 'SAVING...' : 'SAVE & ENTER'}
            </Text>
          </Button>

          <Pressable onPress={handleSkip} style={styles.skipButton}>
            <Text color="#6c757d" fontSize="$4">
              Skip for now
            </Text>
          </Pressable>
        </YStack>
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
  interestButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  interestButtonSelected: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  interestText: {
    fontSize: 14,
    color: '#6c757d',
  },
  interestTextSelected: {
    color: 'white',
    fontWeight: 'bold',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
});
