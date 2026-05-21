import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';

interface HeaderProps {
  title: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  rightComponent,
}) => {
  const isDarkMode = useColorScheme() === 'dark';

  const colors = {
    headerBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    textMain: isDarkMode ? '#F8FAFC' : '#0F172A',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    backBtn: isDarkMode ? '#F8FAFC' : '#0F172A',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.headerBg, borderBottomColor: colors.border }]}>
      {/* Left side: Back Button or Empty */}
      <View style={styles.leftContainer}>
        {onBackPress && (
          <TouchableOpacity
            onPress={onBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.backText, { color: colors.backBtn }]}>‹</Text>
            <Text style={[styles.backLabel, { color: colors.backBtn }]}>Back</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Center side: Title */}
      <View style={styles.centerContainer}>
        <Text style={[styles.title, { color: colors.textMain }]} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {/* Right side: Optional component */}
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  backText: {
    fontSize: 28,
    lineHeight: 28,
    marginRight: 4,
    fontWeight: '300',
  },
  backLabel: {
    fontSize: 15,
    fontFamily: 'System',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'System',
    textAlign: 'center',
  },
});
