import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Comment } from '../store/postsSlice';

interface CommentItemProps {
  comment: Comment;
}

export const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  const isDarkMode = useColorScheme() === 'dark';

  // Generate simple initial for commenter avatar
  const initial = comment.email.substring(0, 1).toUpperCase();

  const colors = {
    container: isDarkMode ? '#1E293B' : '#F8FAFC',
    textMain: isDarkMode ? '#E2E8F0' : '#1F2937',
    textSub: isDarkMode ? '#64748B' : '#64748B',
    avatarBg: isDarkMode ? '#334155' : '#E2E8F0',
    avatarText: isDarkMode ? '#94A3B8' : '#475569',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.container }]}>
      <View style={styles.header}>
        {/* Commenter Avatar */}
        <View style={[styles.avatar, { backgroundColor: colors.avatarBg }]}>
          <Text style={[styles.avatarText, { color: colors.avatarText }]}>{initial}</Text>
        </View>

        {/* Commenter Details */}
        <View style={styles.commenterInfo}>
          <Text style={[styles.name, { color: colors.textMain }]} numberOfLines={1}>
            {comment.name}
          </Text>
          <Text style={[styles.email, { color: colors.textSub }]} numberOfLines={1}>
            {comment.email.toLowerCase()}
          </Text>
        </View>
      </View>

      {/* Comment Body */}
      <Text style={[styles.body, { color: colors.textMain }]}>
        {comment.body}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  commenterInfo: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
    fontFamily: 'System',
  },
  email: {
    fontSize: 11,
    fontFamily: 'System',
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'System',
    paddingLeft: 4,
  },
});
