import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Dimensions,
  RefreshControl,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { colors, spacing, borderRadius, typography } from '../theme/colors';
import DiscussionCard from '../components/DiscussionComponents/DiscussionCard';
import { useDiscussionStore } from '../store/discussionStore';
import { useUserStore } from '../store/userStore';
import { DISCUSSION_CATEGORIES } from '../data/discussionMockData';
import { calculateUserAge } from '../utils/dateUtils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function DiscussionsScreen() {
  const navigation = useNavigation<any>();
  const { posts, fetchPosts } = useDiscussionStore();
  const { user } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');
  const [refreshing, setRefreshing] = useState(false);

  const userAge = useMemo(() => calculateUserAge(user.birthDate), [user.birthDate]);
  const categories = DISCUSSION_CATEGORIES || [];

  // Авто-обновление при фокусе на экран
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    const currentPosts = posts || [];
    return currentPosts.filter(p => {
      const isAgeAppropriate = userAge >= (p.ageLimit || 0);
      if (!isAgeAppropriate) return false;

      const matchesSearch =
        p.content.toLowerCase().includes(searchValue.toLowerCase()) ||
        p.authorName.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || p.categorySlug === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchValue, selectedCategory, posts, userAge]);

  const isFiltering = searchValue.length > 0 || selectedCategory !== 'all';

  const handleReset = () => {
    setSearchValue('');
    setSelectedCategory('all');
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Обсуждения</Text>
        <TouchableOpacity
          style={styles.headerButtonRight}
          onPress={() => navigation.navigate('CreateDiscussion')}
        >
          <Ionicons name="add" size={28} color={colors.light.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[1]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.light.primary]}
            tintColor={colors.light.primary}
          />
        }
      >
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search-outline"
              size={20}
              color={colors.light.mutedForeground}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск по темам..."
              placeholderTextColor={colors.light.mutedForeground}
              value={searchValue}
              onChangeText={setSearchValue}
            />
            {searchValue.length > 0 && (
              <TouchableOpacity onPress={() => setSearchValue('')}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={colors.light.mutedForeground}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filtersSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(category => {
              const isActive = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Ionicons
                    name={category.icon as any}
                    size={16}
                    color={isActive ? '#fff' : colors.light.foreground}
                  />
                  <Text
                    style={[styles.categoryLabel, isActive && styles.categoryLabelActive]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <View style={styles.listContent}>
          <View style={styles.resHead}>
            <Text style={styles.resTitle}>
              {isFiltering ? `Найдено: ${filteredPosts.length}` : 'Все обсуждения'}
            </Text>
            {isFiltering && (
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetTxt}>Сбросить</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <DiscussionCard
                key={post.id}
                {...post}
                onPress={() => navigation.navigate('PostThread', { postId: post.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name="chatbubbles-outline"
                  size={60}
                  color={colors.light.mutedForeground}
                />
              </View>
              <Text style={styles.emptyTextTitle}>Тишина в эфире</Text>
              <Text style={styles.emptyTextSub}>
                Попробуйте изменить категорию или создайте своё обсуждение первым!
              </Text>
            </View>
          )}
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: colors.light.background },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerButtonRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  container: { flex: 1 },
  searchWrapper: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    height: 54,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
    fontWeight: '500',
  },
  filtersSection: {
    backgroundColor: colors.light.background,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1.2,
    borderColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  categoryChipActive: {
    borderColor: colors.light.primary,
    backgroundColor: colors.light.primary,
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryLabel: {
    fontSize: 13,
    color: colors.light.foreground,
    fontWeight: '600',
  },
  categoryLabelActive: {
    color: '#fff',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs, // Added to increase gap between filters and title
    paddingBottom: 40,
  },
  resHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  resetTxt: {
    color: colors.light.primary,
    fontWeight: '600',
    fontSize: typography.base,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.light.primary}08`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTextTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.foreground,
    marginBottom: 8,
  },
  emptyTextSub: {
    color: colors.light.mutedForeground,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});
