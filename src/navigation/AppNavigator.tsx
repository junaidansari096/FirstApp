import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  BackHandler,
  Dimensions,
  Animated,
  Easing,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '../store';
import { navigateBack } from '../store/navigationSlice';
import { FeedScreen } from '../screens/FeedScreen';
import { FavoritesScreen } from '../screens/FavoritesScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { TabBar } from '../components/TabBar';
import { Header } from '../components/Header';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const AppNavigator: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();
  
  // Select navigation states
  const currentScreen = useAppSelector(state => state.navigation.currentScreen);
  const activeTab = useAppSelector(state => state.navigation.activeTab);

  // Animated slide value initialized offscreen-right
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  // Intercept Android hardware Back button
  useEffect(() => {
    const onBackPress = () => {
      if (currentScreen === 'Detail') {
        dispatch(navigateBack());
        return true; // Intercepted: navigate back in stack
      }
      return false; // Not intercepted: fallback to default OS behavior
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => {
      backHandlerSubscription.remove();
    };
  }, [currentScreen, dispatch]);

  // Execute slide transition whenever currentScreen changes
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: currentScreen === 'Detail' ? 0 : SCREEN_WIDTH,
      duration: 250,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true, // Hardware acceleration for buttery-smooth 60fps
    }).start();
  }, [currentScreen, slideAnim]);

  const colors = {
    background: isDarkMode ? '#0F172A' : '#F8FAFC',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Primary Tab View (Feed/Favorites) - Always kept alive */}
      <View style={styles.container}>
        <Header title={activeTab === 'Feed' ? 'Global Feed' : 'Favorites'} />
        
        <View style={styles.screenContent}>
          {activeTab === 'Feed' ? <FeedScreen /> : <FavoritesScreen />}
        </View>

        <TabBar />
      </View>

      {/* Animated Detail Screen overlay (slides from right on top of feed) */}
      <Animated.View
        style={[
          styles.detailWrapper,
          {
            transform: [{ translateX: slideAnim }],
            backgroundColor: colors.background,
          },
        ]}
      >
        <DetailScreen />
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screenContent: {
    flex: 1,
  },
  detailWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    elevation: 100, // Ensure detail screen floats above tab bar in Android rendering
  },
});
