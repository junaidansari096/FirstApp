import React, { useEffect, useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store, rehydrateStore } from './src/store';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useAppState } from './src/hooks/useAppState';

function AppContent() {
  // Listen for active / background / closed state transitions
  useAppState();

  const isDarkMode = useColorScheme() === 'dark';
  const barStyle = isDarkMode ? 'light-content' : 'dark-content';
  const statusBarColor = isDarkMode ? '#1E293B' : '#FFFFFF';

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={statusBarColor}
        translucent={false}
      />
      <AppNavigator />
    </View>
  );
}

function App() {
  const [isHydrated, setIsHydrated] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  // Load favorites, cached feed items, and search state from AsyncStorage on app boot
  useEffect(() => {
    const initializeStore = async () => {
      await rehydrateStore();
      setIsHydrated(true);
    };
    initializeStore();
  }, []);

  const loaderBg = isDarkMode ? '#0F172A' : '#F8FAFC';
  const loaderColor = '#3B82F6';

  if (!isHydrated) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: loaderBg }]}>
        <ActivityIndicator size="large" color={loaderColor} />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
