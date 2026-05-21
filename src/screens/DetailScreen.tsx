import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { fetchComments, clearComments, toggleFavorite } from '../store/postsSlice';
import { navigateBack } from '../store/navigationSlice';
import { Header } from '../components/Header';
import { CommentItem } from '../components/CommentItem';

export const DetailScreen: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();

  // Redux Selectors
  const post = useAppSelector(state => state.navigation.selectedPost);
  const { comments, commentsStatus, commentsError, favorites } = useAppSelector(
    state => state.posts
  );

  // Determine favorite state
  const isFavorite = post ? favorites.some(item => item.id === post.id) : false;

  // Fetch comments when the screen mounts
  useEffect(() => {
    if (post) {
      dispatch(fetchComments(post.id));
    }
    return () => {
      // Clear comments cache when leaving the screen
      dispatch(clearComments());
    };
  }, [post, dispatch]);

  if (!post) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: No post selected</Text>
      </View>
    );
  }

  const handleBack = () => {
    dispatch(navigateBack());
  };

  const handleFavoriteToggle = () => {
    dispatch(toggleFavorite(post));
  };

  const colors = {
    background: isDarkMode ? '#0F172A' : '#F8FAFC',
    cardBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#F8FAFC' : '#0F172A',
    textSub: isDarkMode ? '#94A3B8' : '#64748B',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    starActive: '#F59E0B',
    starInactive: isDarkMode ? '#475569' : '#CBD5E1',
    loader: '#3B82F6',
    commentHeader: isDarkMode ? '#F8FAFC' : '#1F2937',
  };

  // Render Post Details as Header
  const renderPostHeader = () => (
    <View style={styles.postContainer}>
      {/* Category/User Label */}
      <Text style={[styles.authorLabel, { color: colors.loader }]}>
        POST BY USER {post.userId}
      </Text>

      {/* Main Title */}
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.textMain }]}>
          {post.title}
        </Text>
        <TouchableOpacity
          onPress={handleFavoriteToggle}
          style={styles.favToggle}
          activeOpacity={0.6}
        >
          <Text style={[styles.favToggleText, { color: isFavorite ? colors.starActive : colors.starInactive }]}>
            {isFavorite ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {/* Body Content */}
      <Text style={[styles.bodyText, { color: colors.textSub }]}>
        {post.body}
      </Text>

      {/* Comments Header Section */}
      <View style={styles.commentsSectionHeader}>
        <Text style={[styles.commentsSectionTitle, { color: colors.commentHeader }]}>
          Comments
        </Text>
        {commentsStatus === 'succeeded' && (
          <Text style={[styles.commentsCount, { color: colors.textSub }]}>
            ({comments.length})
          </Text>
        )}
      </View>

      {/* Loader / Errors for Comments */}
      {commentsStatus === 'loading' && (
        <View style={styles.commentsLoader}>
          <ActivityIndicator size="small" color={colors.loader} />
          <Text style={[styles.commentsLoaderText, { color: colors.textSub }]}>
            Loading comments...
          </Text>
        </View>
      )}

      {commentsStatus === 'failed' && (
        <View style={styles.commentsErrorCard}>
          <Text style={styles.commentsErrorText}>
            ⚠️ {commentsError || 'Failed to load comments.'}
          </Text>
          <TouchableOpacity
            style={styles.commentsRetryBtn}
            onPress={() => dispatch(fetchComments(post.id))}
          >
            <Text style={styles.commentsRetryText}>Tap to retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {commentsStatus === 'succeeded' && comments.length === 0 && (
        <Text style={[styles.noCommentsText, { color: colors.textSub }]}>
          No comments yet. Be the first to discuss!
        </Text>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="Post Details"
        onBackPress={handleBack}
      />
      <FlatList
        data={commentsStatus === 'succeeded' ? comments : []}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <CommentItem comment={item} />}
        ListHeaderComponent={renderPostHeader}
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
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postContainer: {
    paddingVertical: 20,
  },
  authorLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 8,
    fontFamily: 'System',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 28,
    textTransform: 'capitalize',
    fontFamily: 'System',
    paddingRight: 8,
  },
  favToggle: {
    padding: 6,
  },
  favToggleText: {
    fontSize: 28,
    lineHeight: 28,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'System',
    marginBottom: 24,
  },
  commentsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  commentsSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
    marginRight: 6,
  },
  commentsCount: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
  commentsLoader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  commentsLoaderText: {
    fontSize: 14,
    marginLeft: 8,
    fontFamily: 'System',
  },
  commentsErrorCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: '#FED7D7',
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentsErrorText: {
    color: '#C53030',
    fontSize: 13,
    fontFamily: 'System',
  },
  commentsRetryBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#FED7D7',
  },
  commentsRetryText: {
    color: '#9B2C2C',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  noCommentsText: {
    fontSize: 14,
    fontStyle: 'italic',
    paddingVertical: 16,
    fontFamily: 'System',
  },
});
