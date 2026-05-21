import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import postsReducer, { hydrateStore } from './postsSlice';
import navigationReducer from './navigationSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    navigation: navigationReducer,
  },
  // Adding custom middleware or serializable checks if needed, RTK defaults are perfect
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Custom hooks to ensure TypeScript safety across the app
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const PERSIST_KEY = '@FirstApp:store_persistence';

// Subscribe to store changes to automatically serialize and persist changes
let previousState = store.getState();
store.subscribe(() => {
  const currentState = store.getState();
  // Only write if favorites, cachedFeed, or searchQuery actually changed
  if (
    currentState.posts.favorites !== previousState.posts.favorites ||
    currentState.posts.cachedFeed !== previousState.posts.cachedFeed ||
    currentState.posts.searchQuery !== previousState.posts.searchQuery
  ) {
    const stateToPersist = {
      favorites: currentState.posts.favorites,
      cachedFeed: currentState.posts.cachedFeed,
      searchQuery: currentState.posts.searchQuery,
    };
    AsyncStorage.setItem(PERSIST_KEY, JSON.stringify(stateToPersist)).catch((err) => {
      console.error('Failed to write store persistence to disk:', err);
    });
  }
  previousState = currentState;
});

// Rehydrate the store with saved state upon app boot
export const rehydrateStore = async () => {
  try {
    const rawData = await AsyncStorage.getItem(PERSIST_KEY);
    if (rawData) {
      const parsedData = JSON.parse(rawData);
      store.dispatch(hydrateStore(parsedData));
      console.log('Successfully rehydrated Redux store from AsyncStorage');
    }
  } catch (err) {
    console.error('Error rehydrating Redux store:', err);
  }
};
