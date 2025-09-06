// appsmobile/navigation/OnboardingNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DBCOnboardingScreen } from '../screens/auth/DBCOnboardingScreen';
// ... import OTPScreen, ProfilePersonalizationScreen

const OnboardingStack = createNativeStackNavigator();

export const OnboardingNavigator = () => (
  <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
    <OnboardingStack.Screen name="DBCOnboarding" component={DBCOnboardingScreen} />
    {/* Add other onboarding screens here if needed */}
  </OnboardingStack.Navigator>
);
