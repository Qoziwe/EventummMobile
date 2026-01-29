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
import CommunityCard from '../components/CommunityComponents/CommunityCard';
import { COMMUNITIES, MOCK_POSTS } from '../data/communitiesMockData';

const defaultCategories = [
  { id: 'all', label: 'Все', icon: 'apps-outline' },
  { id: 'music', label: 'Музыка', icon: 'musical-notes-outline' },
  { id: 'tech', label: 'Технологии', icon: 'hardware-chip-outline' },
  { id: 'sport', label: 'Спорт', icon: 'fitness-outline' },
  { id: 'food', label: 'Еда', icon: 'restaurant-outline' },
];

export default function CommunitiesScreen() {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredCommunities = useMemo(() => {
    return COMMUNITIES.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchValue.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || c.categorySlug === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchValue, selectedCategory]);

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Сообщества</Text>
        <TouchableOpacity style={styles.headerButtonRight}>
          <Ionicons name="add" size={28} color={colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.light.mutedForeground} />
            <TextInput
              style={styles.searchInput}
              placeholder="Поиск сообществ..."
              placeholderTextColor={colors.light.mutedForeground}
              value={searchValue}
              onChangeText={setSearchValue}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {defaultCategories.map(category => {
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

        <View style={styles.communitiesGrid}>
          {filteredCommunities.map(community => (
            <CommunityCard
              key={community.id}
              {...community}
              onPress={() => {
                const post = MOCK_POSTS.find(p => p.communityId === community.id);
                if (post)
                  navigation.navigate(
                    'PostThread' as never,
                    { postId: post.id } as never
                  );
              }}
            />
          ))}
        </View>
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
  searchWrapper: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg }, // Унифицирован отступ
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
    backgroundColor: colors.light.secondary,
  },
  categoryLabel: { fontSize: typography.sm, color: colors.light.foreground },
  categoryLabelActive: { color: colors.light.primary, fontWeight: '600' },
  communitiesGrid: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
    gap: spacing.md, // Теперь карточки идут одна под другой
  },
});
