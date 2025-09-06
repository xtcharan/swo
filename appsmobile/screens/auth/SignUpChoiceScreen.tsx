import React, { useState } from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { YStack, H3, Text, Button, XStack, Image } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

export const SignUpChoiceScreen = () => {
const navigation = useNavigation();

return (
<YStack flex={1} backgroundColor="white" padding="$4">
<YStack alignItems="center" marginTop="$8" marginBottom="$6">
<Image
source={require('../../assets/logo.webp')}
style={styles.logo}
resizeMode="contain"
/>
<H3 color="#011025" textAlign="center" marginTop="$4">
Join the DBC Community
</H3>
<Text color="#6c757d" fontSize="$4" textAlign="center" marginTop="$2">
How would you like to sign up?
</Text>
</YStack>



<YStack space="$4" flex={1} justifyContent="center" paddingHorizontal="$4">
    <Button
      theme="blue"
      backgroundColor="#007bff"
      onPress={() => navigation.navigate('DBCActivation' as never)}
      size="$6"
      pressStyle={{ backgroundColor: '#0056cc' }}
      marginBottom="$2"
    >
      <YStack alignItems="center" space="$2">
        <MaterialIcons name="school" size={28} color="white" />
        <Text fontSize="$5" fontWeight="bold" color="white" textAlign="center">
          I am a DBC Student
        </Text>
      </YStack>
    </Button>

    <Button
      theme="alt1"
      backgroundColor="#d6b46c"
      onPress={() => navigation.navigate('GuestSignUp' as never)}
      size="$6"
      pressStyle={{ backgroundColor: '#b89958' }}
      borderWidth={0}
    >
      <YStack alignItems="center" space="$2">
        <MaterialIcons name="person-outline" size={28} color="black" />
        <Text fontSize="$5" fontWeight="bold" color="black" textAlign="center">
          I am a Guest
        </Text>
      </YStack>
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
});

