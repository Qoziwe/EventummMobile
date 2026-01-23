import React, { useState } from 'react';
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

// --------------------
// Типы
// --------------------
interface CategoryItem {
  id: string;
  label: string;
}

interface CommunityItem {
  id: string;
  name: string;
  members: number;
  category: string;
  description: string;
  isPrivate: boolean;
}

// --------------------
// Данные
// --------------------
const defaultCategories: CategoryItem[] = [
  { id: 'all', label: 'Все' },
  { id: 'music', label: 'Музыка' },
  { id: 'tech', label: 'Технологии' },
  { id: 'art', label: 'Искусство' },
  { id: 'sport', label: 'Спорт' },
  { id: 'food', label: 'Еда' },
];

const communities: CommunityItem[] = [
  {
    id: '1',
    name: 'Музыкальные фестивали',
    members: 1250,
    category: 'Музыка',
    description: 'Обсуждаем лучшие музыкальные мероприятия',
    isPrivate: false,
  },
  {
    id: '2',
    name: 'Tech Talks',
    members: 890,
    category: 'Технологии',
    description: 'ИТ-конференции и встречи разработчиков',
    isPrivate: false,
  },
  {
    id: '3',
    name: 'Фотографы событий',
    members: 450,
    category: 'Фотография',
    description: 'Советы по съемке мероприятий',
    isPrivate: false,
  },
  {
    id: '4',
    name: 'Спортивные болельщики',
    members: 2100,
    category: 'Спорт',
    description: 'Обсуждения матчей и турниров',
    isPrivate: false,
  },
];

export default function CommunitiesScreen() {
  const navigation = useNavigation();

  // Состояние
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');

  // Обработчики
  function openPostThread(postId: string) {
    navigation.navigate('PostThread' as never, { postId } as never);
  }

  function openCommunityPosts(communityId: string) {
    // Для примера открываем тред
    openPostThread('sample-post-id');
  }

  function createCommunity() {
    console.log('Создание сообщества');
  }

  function handleBackPress() {
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      {/* --- СТАНДАРТИЗИРОВАННЫЙ ХЕДЕР --- */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonLeft} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Сообщества</Text>

        <TouchableOpacity style={styles.headerButtonRight} onPress={createCommunity}>
          <Ionicons name="add" size={28} color={colors.light.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Поиск */}
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

        {/* Категории */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {defaultCategories.map(function (category) {
            const isActive = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryChip, isActive ? styles.categoryChipActive : null]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive ? styles.categoryLabelActive : null,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Сообщества */}
        <View style={styles.communitiesGrid}>
          {communities.map(community => (
            <CommunityCard
              key={community.id}
              id={community.id}
              name={community.name}
              members={community.members}
              category={community.category}
              description={community.description}
              isPrivate={community.isPrivate}
              onPress={() => openCommunityPosts(community.id)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------
// Стили
// --------------------
const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },

  // --- ЕДИНЫЕ СТИЛИ ХЕДЕРА ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
    minHeight: 56, // Фиксированная высота
  },
  headerButtonLeft: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerButtonRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerTitle: {
    flex: 1,
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
    textAlign: 'center',
  },
  // ---------------------------

  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
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
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  categoriesContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light.background,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  categoryChipActive: {
    backgroundColor: colors.light.primary,
    borderColor: colors.light.primary,
  },
  categoryLabel: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  categoryLabelActive: {
    color: colors.light.primaryForeground,
  },
  communitiesGrid: {
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
