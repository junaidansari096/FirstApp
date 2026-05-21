# FirstApp - React Native Feed & Favorites App

A high-performance React Native CLI application (Android & iOS) designed as a real-world product. The app loads posts from a public API, supports infinite scrolling, debounced search filtering, detail view loading with comments, and offline capability through local data persistence.

---

## 📱 App Features

1. **Global Feed (Home)**:
   - Loads posts from JSONPlaceholder API.
   - **Debounced Search**: Text search debounced by 500ms to throttle API queries as you type.
   - **Infinite Scroll**: Fetches the next page of posts dynamically as the user scrolls to the bottom of the list.
   - **Pull-to-Refresh**: Resets the feed to page 1 and performs a fresh API request.
   - **Offline Mode**: If the device is offline or the API request fails, the app displays the first page of posts cached from the last successful online session with a clear offline banner.

2. **Favorites Tab**:
   - Lists all saved posts marked as favorites.
   - **Local Search**: Instantly filters your favorites locally without calling the API.
   - **Offline Persistent**: Works completely offline.

3. **Post Details Screen**:
   - Shows the full title and body of the post.
   - Allows users to favorite/unfavorite the post directly from the detail view.
   - **Comments List**: Automatically fetches comments (`/posts/:id/comments`) with loading indicators, empty states, and error retries.

4. **App Lifecycle Monitoring**:
   - Tracks app state transitions (`active` ⇄ `background` ⇄ `inactive`) and registers them in the Redux store.

---

## 🛠️ Technical Stack & Architecture Decisions

### 1. Pure JS Custom Stack Navigator (Zero Native Bloat)
Instead of adding heavy third-party routing libraries (like React Navigation or React Native Navigation) which can run into compiling or linking incompatibilities with newer React Native (0.85) / React (19) versions, we designed a lightweight **state-driven custom stack navigator**:
- It runs inside Redux (`navigationSlice.ts`) to manage stack routing.
- **Hardware Back Button Handling**: Registers a listener to Android's `BackHandler` so that when a user is on the `Detail` screen, pressing the hardware back button pops the detail screen back to `Home` instead of exiting the app.
- **Sliding Animations**: Uses React Native's `Animated` API with `useNativeDriver: true` to perform hardware-accelerated cubic transitions. The Detail Screen slides in smoothly from the right, providing a premium, native feel at 60fps.

### 2. Custom Redux State Persistence
Rather than relying on `redux-persist` (which suffers from compatibility issues under React 19 / React Native 0.85), we built a clean, subscription-based persistence manager:
- In `src/store/index.ts`, a store subscription monitors changes to `favorites`, `cachedFeed`, and `searchQuery`.
- Upon state changes, it serializes and writes the data to `AsyncStorage`.
- When the app boots, it reads from disk and dispatches a single hydration action (`hydrateStore`), restoring the app to its last saved state instantly before rendering.

### 3. High-Performance List Optimizations
To ensure smooth scrolling and low memory consumption on large lists:
- FlatLists use performance-tuning props:
  - `removeClippedSubviews={true}`: Unmounts components when scrolled off-screen to reclaim RAM.
  - `initialNumToRender={10}` & `maxToRenderPerBatch={10}`: Constrains the number of items rendered simultaneously to avoid dropping frames.
  - `windowSize={5}`: Restricts the virtual rendering window.
- **Single scroll container pattern**: In `DetailScreen.tsx`, rather than nesting a scrollable FlatList inside a ScrollView (which breaks item recycling and creates scroll-locking bugs), we put the post details in the `ListHeaderComponent` of the comments `FlatList`. This maintains a single scroll window that is fully hardware-accelerated.

---

## ⚙️ How to Run the Project

### Prerequisites
Make sure you have your local React Native CLI development environment set up for Android and/or iOS. If not, follow the official guide: [React Native Environment Setup](https://reactnative.dev/docs/environment-setup).

1. **Clone & Open Workspace**:
   Navigate to the root directory `E:\first app`.

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start the Metro Bundler**:
   ```bash
   npm run start
   ```

4. **Run on Android**:
   Make sure you have an Android emulator running or a physical device connected via USB debugging.
   ```bash
   npm run android
   ```

5. **Run on iOS** (macOS only):
   Install pods before building:
   ```bash
   cd ios && pod install && cd ..
   npm run ios
   ```

---

## 🚀 Future Improvements (Given More Time)

1. **Dynamic Connection Status**:
   Integrate `@react-native-community/netinfo` to actively monitor internet state and show a persistent overlay banner, disabling search input when the device has lost connection.
2. **Post Detail Caching**:
   Cache post comments in AsyncStorage so that comments fetched when online can also be read offline.
3. **Advanced Micro-Animations**:
   Add a heart burst/scale animation when toggling favorites, and skeleton placeholders during initial loading instead of activity indicators.
4. **Unit and Integration Testing**:
   Write tests using Jest and `@testing-library/react-native` for the Redux slices, custom hooks, and screen components.
