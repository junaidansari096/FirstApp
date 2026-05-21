import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAppDispatch } from '../store';
import { updateLifecycleState } from '../store/navigationSlice';

export function useAppState() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      // Map AppStateStatus to our Redux lifecycle types
      if (nextAppState === 'active' || nextAppState === 'background' || nextAppState === 'inactive') {
        dispatch(updateLifecycleState(nextAppState));
        console.log(`[Lifecycle] App transitioned to: ${nextAppState}`);
      } else {
        dispatch(updateLifecycleState('unknown'));
      }
    };

    // Register listener (React Native modern event API)
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Set initial status on hook mount
    const currentStatus = AppState.currentState;
    if (currentStatus === 'active' || currentStatus === 'background' || currentStatus === 'inactive') {
      dispatch(updateLifecycleState(currentStatus));
    }

    return () => {
      subscription.remove();
    };
  }, [dispatch]);
}
