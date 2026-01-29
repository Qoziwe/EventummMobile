import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors, spacing, borderRadius, typography } from '../theme/colors';
import DiscussionCard from '../components/DiscussionComponents/DiscussionCard';
import { useDiscussionStore } from '../store/discussionStore';
import { useUserStore } from '../store/userStore';
import { DISCUSSION_CATEGORIES } from '../data/discussionMockData';

const calculateUserAge = (birthDate: string): number => {
  const today = new Date();
  const birthDateObj = new Date(birthDate);
  let age = today.getFullYear() - birthDateObj.getFullYear();
  const m = today.getMonth() - birthDateObj.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
    age--;
  }
  return age;
};

export default function DiscussionsScreen() {
  const navigation = useNavigation<any>();
  const { posts } = useDiscussionStore();
  const { user } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');

  const userAge = useMemo(() => calculateUserAge(user.birthDate), [user.birthDate]);
  const categories = DISCUSSION_CATEGORIES || [];

  const filteredPosts = useMemo(() => {
    const currentPosts = posts || [];
    return currentPosts.filter(p => {
      // КИБЕРБЕЗОПАСНОСТЬ: Фильтрация по возрасту
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
          <Ionicons name="add" size={28} color={colors.light.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchWrapper}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.light.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по темам..."
            placeholderTextColor={colors.light.mutedForeground}
            value={searchValue}
            onChangeText={setSearchValue}
          />
        </View>
      </View>

      <View>
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
                  color={isActive ? colors.light.primary : colors.light.foreground}
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

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.listContent}>
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
              <Ionicons
                name="chatbubbles-outline"
                size={48}
                color={colors.light.border}
              />
              <Text style={styles.emptyText}>Обсуждений не найдено</Text>
            </View>
          )}
        </View>
        <View style={{ height: 40 }} />
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
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: typography.base, color: colors.light.foreground },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  categoryChipActive: {
    borderColor: colors.light.primary,
    backgroundColor: `${colors.light.primary}08`,
  },
  categoryLabel: { fontSize: typography.sm, color: colors.light.foreground },
  categoryLabelActive: { color: colors.light.primary, fontWeight: '600' },
  listContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 12 },
  emptyText: { color: colors.light.mutedForeground, fontSize: 16, fontWeight: '500' },
});
