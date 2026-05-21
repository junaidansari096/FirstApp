import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchPosts, incrementPage, setSearchQuery } from '../store/postsSlice';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/SearchBar';
import { PostCard } from '../components/PostCard';

export const FeedScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();

  // Redux Selectors
  const { feedPosts, status, error, page, limit, hasMore, searchQuery, refreshing, cachedFeed } = useAppSelector(
    state => state.posts
  );

  // Local state for immediate typing (before debouncing)
  const [searchInput, setSearchInput] = useState(searchQuery);
  const debouncedSearch = useDebounce(searchInput, 500);

  // Sync debounced search to Redux
  useEffect(() => {
    if (debouncedSearch !== searchQuery) {
      dispatch(setSearchQuery(debouncedSearch));
    }
  }, [debouncedSearch, searchQuery, dispatch]);

  // Sync external Redux search query to input (e.g. on store hydration)
  useEffect(() => {
    setSearchInput(searchQuery);
  }, [searchQuery]);

  // Main fetch effect that triggers on page or search query change
  useEffect(() => {
    // Only fetch if status is idle (which is set on search change or page change)
    if (status === 'idle') {
      dispatch(fetchPosts({ page, limit, query: searchQuery }));
    }
  }, [status, page, limit, searchQuery, dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchPosts({ page: 1, limit, query: searchQuery, isRefresh: true }));
  }, [limit, searchQuery, dispatch]);

  const handleLoadMore = useCallback(() => {
    // Only load more if we aren't loading, there's more data, and no error
    if (status !== 'loading' && !refreshing && hasMore && status !== 'failed') {
      dispatch(incrementPage());
      dispatch(fetchPosts({ page: page + 1, limit, query: searchQuery }));
    }
  }, [status, refreshing, hasMore, page, limit, searchQuery, dispatch]);

  const handleRetry = () => {
    dispatch(fetchPosts({ page, limit, query: searchQuery }));
  };

  const colors = {
    background: isDarkMode ? '#0F172A' : '#F8FAFC',
    textMain: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    loader: '#3B82F6',
    errorBg: isDarkMode ? '#7F1D1D' : '#FEE2E2',
    errorText: isDarkMode ? '#FCA5A5' : '#EF4444',
    btnBg: '#3B82F6',
    btnText: '#FFFFFF',
    offlineBannerBg: isDarkMode ? '#1E293B' : '#E2E8F0',
  };

  // Render components
  const renderHeader = () => (
    <View>
      <SearchBar
        value={searchInput}
        onChangeText={setSearchInput}
        placeholder="Search posts..."
      />
      {status === 'failed' && cachedFeed.length > 0 && (
        <View style={[styles.offlineBanner, { backgroundColor: colors.offlineBannerBg }]}>
          <Text style={[styles.offlineBannerText, { color: colors.textSub }]}>
            ⚠️ Network unavailable. Showing offline cached posts.
          </Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => {
    if (status === 'loading' && page > 1) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color={colors.loader} />
        </View>
      );
    }
    if (!hasMore && feedPosts.length > 0) {
      return (
        <Text style={[styles.endOfListText, { color: colors.textSub }]}>
          You've reached the end of the feed.
        </Text>
      );
    }
    return null;
  };

  const renderEmpty = () => {
    if (status === 'loading' && page === 1) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.loader} />
          <Text style={[styles.loadingText, { color: colors.textSub }]}>
            Fetching posts...
          </Text>
        </View>
      );
    }

    if (status === 'failed' && feedPosts.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <View style={[styles.errorCard, { backgroundColor: colors.errorBg }]}>
            <Text style={[styles.errorTitle, { color: colors.errorText }]}>
              Failed to load feed
            </Text>
            <Text style={[styles.errorMsg, { color: colors.errorText }]}>
              {error || 'An unexpected network error occurred.'}
            </Text>
            <TouchableOpacity
              onPress={handleRetry}
              style={[styles.retryBtn, { backgroundColor: colors.btnBg }]}
              activeOpacity={0.8}
            >
              <Text style={[styles.retryBtnText, { color: colors.btnText }]}>
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyEmoji}>🔎</Text>
        <Text style={[styles.emptyText, { color: colors.textMain }]}>
          No posts found
        </Text>
        <Text style={[styles.emptySubText, { color: colors.textSub }]}>
          Try modifying your search query.
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={feedPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={renderHeader()}
        ListFooterComponent={renderFooter()}
        ListEmptyComponent={renderEmpty()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true} // Performance optimization for large lists
        initialNumToRender={10} // Performance optimization
        maxToRenderPerBatch={10} // Performance optimization
        windowSize={5} // Performance optimization to reduce memory footprints
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  endOfListText: {
    textAlign: 'center',
    fontSize: 13,
    marginVertical: 20,
    fontFamily: 'System',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'System',
  },
  errorCard: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'System',
  },
  errorMsg: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'System',
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  retryBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  offlineBanner: {
    padding: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  offlineBannerText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'System',
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'System',
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    fontFamily: 'System',
  },
});
