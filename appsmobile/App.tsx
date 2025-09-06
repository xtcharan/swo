import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';

// Import your new context and components
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppGate } from './components/AppGate';

// Import your navigators
import { AuthNavigator } from './navigation/AuthNavigator';
import { MainAppNavigator } from './navigation/MainAppNavigator';

// The main App component now only sets up the providers.
export default function App() {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <AuthProvider>
        <NavigationContainer>
          <AppContent />
        </NavigationContainer>
      </AuthProvider>
    </TamaguiProvider>
  );
}

// This new component contains the core logic and can access the AuthContext.
const AppContent = () => {
  const { session, loading } = useAuth(); // Get state from the context hook

  if (loading) {
    // While the initial session is being fetched, show a simple loading screen.
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
        <div style={{ color: '#011025', fontSize: 20 }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <>
      {session && session.user ? (
        // If a user session exists, go through the AppGate.
        <AppGate>
          {/* The AppGate will decide to show this... */}
          <MainAppNavigator />
        </AppGate>
      ) : (
        // If no session, show the authentication flow.
        <AuthNavigator />
      )}
    </>
  );
};
