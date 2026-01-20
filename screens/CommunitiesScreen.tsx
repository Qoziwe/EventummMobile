import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useState } from 'react';

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

// Типы навигации
type RootStackParamList = {
  PostThread: { postId: string };
  CommunityPosts: { communityId: string };
  // ... другие экраны
};

// --------------------
// Категории по умолчанию
// --------------------
const defaultCategories: CategoryItem[] = [
  { id: 'all', label: 'Все' },
  { id: 'music', label: 'Музыка' },
  { id: 'tech', label: 'Технологии' },
  { id: 'art', label: 'Искусство' },
  { id: 'sport', label: 'Спорт' },
  { id: 'food', label: 'Еда' },
];

export default function CommunitiesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // --------------------
  // Состояние
  // --------------------
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchValue, setSearchValue] = useState<string>('');

  // --------------------
  // Обработчики
  // --------------------
  function openPostThread(postId: string) {
    navigation.navigate('PostThread', { postId });
  }

  function openCommunityPosts(communityId: string) {
    // Альтернативно: можно открывать экран с постами сообщества
    // navigation.navigate('CommunityPosts', { communityId });

    // Пока открываем конкретный пост
    openPostThread('sample-post-id');
  }

  function createCommunity() {
    console.log('Создание сообщества');
    // navigation.navigate('CreateCommunity');
  }

  function handleSearchChange(text: string) {
    setSearchValue(text);
    console.log('Поиск:', text);
  }

  function handleCategorySelect(categoryId: string) {
    setSelectedCategory(categoryId);
    console.log('Выбрана категория:', categoryId);
  }

  function handleBackPress() {
    navigation.goBack();
  }

  // --------------------
  // Данные сообществ
  // --------------------
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

  // --------------------
  // Карточки сообществ
  // --------------------
  const communityCards = communities.map(function (community) {
    function handlePress() {
      openCommunityPosts(community.id);
    }

    return (
      <CommunityCard
        key={community.id}
        id={community.id}
        name={community.name}
        members={community.members}
        category={community.category}
        description={community.description}
        isPrivate={community.isPrivate}
        onPress={handlePress}
      />
    );
  });

  // --------------------
  // Рендер
  // --------------------
  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      {/* Шапка как в SearchScreen */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Сообщества</Text>
        <TouchableOpacity style={styles.createButton} onPress={createCommunity}>
          <Ionicons name="add" size={20} color={colors.light.primaryForeground} />
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
            onChangeText={handleSearchChange}
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
                onPress={() => handleCategorySelect(category.id)}
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
        <View style={styles.communitiesGrid}>{communityCards}</View>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  // Шапка как в SearchScreen
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
    textAlign: 'center',
  },
  createButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
