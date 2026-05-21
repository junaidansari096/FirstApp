# FirstApp - Technology & Architecture Notes

This document explains how **FirstApp** was built, the technologies used, and the engineering decisions made during development.

## 🚀 Core Technology Stack

- **React Native (v0.85.3)**: Built using the bare React Native CLI (not Expo) to allow full control over native Android/iOS compilation and the New Architecture (TurboModules / Fabric).
- **TypeScript**: Strictly typed JavaScript to prevent runtime crashes and improve developer experience.
- **Redux Toolkit**: Used for global state management (managing the API feed, search queries, pagination, and favorites).
- **AsyncStorage**: Used to persist the Redux state to the physical device. This enables the "Offline Mode" by caching the feed and saving favorited posts between app launches.

## 🏗️ Architectural Decisions

### 1. Custom State-Driven Navigation (No Third-Party Libraries)
Instead of using popular libraries like `react-navigation` (which often have peer-dependency conflicts with bleeding-edge React Native versions), we built a **Custom Stack Navigator** from scratch. 
- **How it works**: The current screen is stored in the Redux store (`navigationSlice.ts`). 
- **Animations**: We used the native `Animated` API with `useNativeDriver: true` to create buttery smooth, hardware-accelerated 60FPS slide-in animations.
- **Hardware Integration**: We tied the navigation state directly to the Android physical Back button (`BackHandler`), ensuring a truly native feel.

### 2. Custom Offline Persistence Manager
Rather than using heavy libraries like `redux-persist`, we built a lightweight, subscription-based listener in `src/store/index.ts`. Every time the Redux state changes, it serializes the Feed and Favorites and saves them to `AsyncStorage`. When the app boots, it reads from disk and dispatches a single "hydration" action to instantly restore the user's data before the first render.

### 3. Highly Optimized FlatLists
The `FeedScreen` manages infinite scrolling and debounced searching. To prevent memory leaks and crashes with large lists of data, the `FlatList` component was highly optimized using:
- `removeClippedSubviews={true}`
- `initialNumToRender={10}`
- `windowSize={5}`

### 4. Debounced Search System
A custom `useDebounce` hook was created to throttle API calls. When a user types in the search bar, the app waits 500ms after they stop typing before dispatching the Redux action to filter the feed. This prevents spamming the API on every single keystroke.

### 5. Overcoming Native Build Challenges
During development, we resolved complex native Android build issues:
- **Gradle Versioning**: Upgraded and aligned Gradle to version 8.13 to satisfy both React Native 0.85 build plugin requirements and modern Java toolchain dependencies.
- **AsyncStorage Maven Linking**: Manually patched the `android/build.gradle` file to map to the new `local_repo` maven registry, bypassing a known bug in React Native 0.85 when linking native storage modules.

---

**Built by:** Junaid (React Native Developer)
