// appsmobile/components/AppGate.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { LoadingScreen } from '../screens/LoadingScreen';
import { OnboardingNavigator } from '../navigation/OnboardingNavigator';

export const AppGate = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [isProfileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // This case should ideally not be hit if AppGate is used correctly, but it's a safe fallback.
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('first_name, last_name')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is not an error here.
          throw error;
        }

        // If we have data and both first_name and last_name are not null/empty, the profile is complete.
        if (data && data.first_name && data.last_name) {
          setProfileComplete(true);
        } else {
          setProfileComplete(false);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfileComplete(false); // Default to incomplete on error
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return <LoadingScreen />;
  }

  // Render children (the main app) if the profile is complete, otherwise render the onboarding flow.
  return isProfileComplete ? <>{children}</> : <OnboardingNavigator />;
};
