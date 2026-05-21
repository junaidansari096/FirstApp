import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Post } from './postsSlice';

export type TabType = 'Feed' | 'Favorites';
export type ScreenType = 'Home' | 'Detail';

interface NavigationState {
  currentScreen: ScreenType;
  activeTab: TabType;
  selectedPost: Post | null;
  appLifecycleState: 'active' | 'background' | 'inactive' | 'unknown';
}

const initialState: NavigationState = {
  currentScreen: 'Home',
  activeTab: 'Feed',
  selectedPost: null,
  appLifecycleState: 'active',
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setTab(state, action: PayloadAction<TabType>) {
      state.activeTab = action.payload;
    },
    navigateToDetail(state, action: PayloadAction<Post>) {
      state.currentScreen = 'Detail';
      state.selectedPost = action.payload;
    },
    navigateBack(state) {
      state.currentScreen = 'Home';
      state.selectedPost = null;
    },
    updateLifecycleState(state, action: PayloadAction<'active' | 'background' | 'inactive' | 'unknown'>) {
      state.appLifecycleState = action.payload;
    },
  },
});

export const { setTab, navigateToDetail, navigateBack, updateLifecycleState } = navigationSlice.actions;
export default navigationSlice.reducer;
