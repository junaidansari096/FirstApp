import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Post, toggleFavorite } from '../store/postsSlice';
import { navigateToDetail } from '../store/navigationSlice';
import { useAppDispatch, useAppSelector } from '../store';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();

  // Get favorite state
  const isFavorite = useAppSelector(state =>
    state.posts.favorites.some(item => item.id === post.id)
  );

  // Generate color based on userId to make avatars colorful and distinct
  const avatarBgColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#6366F1',
    '#8B5CF6', '#EC4899', '#14B8A6', '#06B6D4', '#F43F5E'
  ];
  const avatarBg = avatarBgColors[post.userId % avatarBgColors.length];

  const colors = {
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#475569',
    border: isDarkMode ? '#334155' : '#F1F5F9',
    starActive: '#F59E0B',
    starInactive: isDarkMode ? '#475569' : '#CBD5E1',
  };

  const handleCardPress = () => {
    dispatch(navigateToDetail(post));
  };

  const handleFavoritePress = (e: any) => {
    e.stopPropagation(); // Avoid triggering card navigation
    dispatch(toggleFavorite(post));
  };

  return (
    <TouchableOpacity
      onPress={handleCardPress}
      activeOpacity={0.7}
      style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}
    >
      <View style={styles.cardHeader}>
        {/* User Avatar Placeholder */}
        <View style={[styles.avatar, { backgroundColor: avatarBg }]}>
          <Text style={styles.avatarText}>U{post.userId}</Text>
        </View>

        {/* Post Title */}
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textMain }]} numberOfLines={1}>
            {post.title}
          </Text>
        </View>

        {/* Favorite Star Button */}
        <TouchableOpacity
          onPress={handleFavoritePress}
          style={styles.favoriteButton}
          activeOpacity={0.6}
        >
          <Text style={[styles.starText, { color: isFavorite ? colors.starActive : colors.starInactive }]}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Post Snippet */}
      <Text style={[styles.body, { color: colors.textSub }]} numberOfLines={2}>
        {post.body}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1.5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'System',
    textTransform: 'capitalize',
  },
  favoriteButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starText: {
    fontSize: 22,
    lineHeight: 22,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'System',
    paddingLeft: 4,
  },
});
