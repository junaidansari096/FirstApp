import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store';
import { setTab, TabType } from '../store/navigationSlice';

export const TabBar: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector(state => state.navigation.activeTab);

  const colors = {
    barBg: isDarkMode ? '#1E293B' : '#FFFFFF',
    border: isDarkMode ? '#334155' : '#E2E8F0',
    activeText: '#3B82F6',
    inactiveText: isDarkMode ? '#64748B' : '#94A3B8',
  };

  const handleTabPress = (tab: TabType) => {
    dispatch(setTab(tab));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.barBg, borderTopColor: colors.border }]}>
      {/* Feed Tab */}
      <TouchableOpacity
        onPress={() => handleTabPress('Feed')}
        style={styles.tabButton}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabIcon, { color: activeTab === 'Feed' ? colors.activeText : colors.inactiveText }]}>
          📰
        </Text>
        <Text style={[styles.tabLabel, { color: activeTab === 'Feed' ? colors.activeText : colors.inactiveText }]}>
          Feed
        </Text>
        {activeTab === 'Feed' && <View style={[styles.indicator, { backgroundColor: colors.activeText }]} />}
      </TouchableOpacity>

      {/* Favorites Tab */}
      <TouchableOpacity
        onPress={() => handleTabPress('Favorites')}
        style={styles.tabButton}
        activeOpacity={0.8}
      >
        <Text style={[styles.tabIcon, { color: activeTab === 'Favorites' ? colors.activeText : colors.inactiveText }]}>
          ⭐
        </Text>
        <Text style={[styles.tabLabel, { color: activeTab === 'Favorites' ? colors.activeText : colors.inactiveText }]}>
          Favorites
        </Text>
        {activeTab === 'Favorites' && <View style={[styles.indicator, { backgroundColor: colors.activeText }]} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    borderTopWidth: 1,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    position: 'relative',
  },
  tabIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  indicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 3,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },
});
