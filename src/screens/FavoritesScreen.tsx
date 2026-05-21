import React, { useState } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useAppSelector } from '../store';
import { SearchBar } from '../components/SearchBar';
import { PostCard } from '../components/PostCard';

export const FavoritesScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';

  // Get favorites from Redux
  const favorites = useAppSelector(state => state.posts.favorites);

  // Local state for searching within favorites
  const [searchQuery, setSearchQuery] = useState('');

  // Filter favorites based on search query locally
  const filteredFavorites = favorites.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const colors = {
    background: isDarkMode ? '#0F172A' : '#F8FAFC',
    textMain: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
  };

  const renderHeader = () => {
    if (favorites.length === 0) return null;
    return (
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Filter favorites..."
      />
    );
  };

  const renderEmpty = () => {
    if (favorites.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>⭐</Text>
          <Text style={[styles.emptyText, { color: colors.textMain }]}>
            No favorites yet
          </Text>
          <Text style={[styles.emptySubText, { color: colors.textSub }]}>
            Tap the star icon on any post in the feed to save it here for offline reading.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyEmoji}>🔎</Text>
        <Text style={[styles.emptyText, { color: colors.textMain }]}>
          No matches found
        </Text>
        <Text style={[styles.emptySubText, { color: colors.textSub }]}>
          No saved posts match your filter query.
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={filteredFavorites}
        keyExtractor={item => `fav-${item.id}`}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmpty()}
        contentContainerStyle={styles.listContent}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
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
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 60,
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
    lineHeight: 20,
    fontFamily: 'System',
  },
});
