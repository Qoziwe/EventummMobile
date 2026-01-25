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
  { id: 'all', label: 'Все' },
  { id: 'music', label: 'Музыка' },
  { id: 'tech', label: 'Технологии' },
  { id: 'sport', label: 'Спорт' },
  { id: 'food', label: 'Еда' },
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

  function openCommunityPosts(communityId: string) {
    const post = MOCK_POSTS.find(p => p.communityId === communityId);
    if (post) {
      navigation.navigate('PostThread' as never, { postId: post.id } as never);
    }
  }

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
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.light.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск сообществ..."
            placeholderTextColor={colors.light.mutedForeground}
            value={searchValue}
            onChangeText={setSearchValue}
          />
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
              onPress={() => openCommunityPosts(community.id)}
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
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  container: { flex: 1 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.lg,
    paddingHorizontal: spacing.md,
    height: 44,
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  searchInput: { flex: 1, fontSize: typography.base, color: colors.light.foreground },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  categoryLabel: { fontSize: typography.sm, color: colors.light.foreground },
  categoryLabelActive: { color: colors.light.primaryForeground },
  communitiesGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
