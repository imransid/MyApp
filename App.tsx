import React, { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import store, { persistor } from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from '@/screens/SplashScreen';

/// Deep linking configuration
const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      Home: 'home',
      Detail: 'place/:id',
    },
  },
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashFinished = () => {
    setShowSplash(false);
  };

  return (
    <Provider store={store}>
      {/* PersistGate delays rendering of the app until the persisted state has been retrieved. */}
      <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
        {showSplash ? (
          <SplashScreen onFinish={handleSplashFinished} bg={undefined} />
        ) : (
          <NavigationContainer linking={linking} fallback={<ActivityIndicator />}>
            <PaperProvider>
              <AppNavigator />
            </PaperProvider>
          </NavigationContainer>
        )}
      </PersistGate>
    </Provider >
  );
}