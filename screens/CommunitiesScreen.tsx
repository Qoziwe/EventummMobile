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

import { colors, spacing, borderRadius, typography } from '../theme/colors';

// --------------------
// Типы
// --------------------
interface CategoryItem {
  id: string;
  label: string;
}

interface CommunitiesScreenProps {
  categories?: CategoryItem[];
  selectedCategory?: string;
  onCategorySelect?: (categoryId: string) => void;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onCreate?: () => void;
  children?: React.ReactNode;
}

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

export default function CommunitiesScreen(props: CommunitiesScreenProps) {
  // --------------------
  // Пропсы с значениями по умолчанию
  // --------------------
  const categories = props.categories || defaultCategories;
  const selectedCategory = props.selectedCategory || 'all';
  const searchValue = props.searchValue || '';

  // --------------------
  // Обработчики
  // --------------------
  function createCommunity() {
    if (props.onCreate) {
      props.onCreate();
    }
  }

  function changeSearch(text: string) {
    if (props.onSearchChange) {
      props.onSearchChange(text);
    }
  }

  function selectCategory(categoryId: string) {
    if (props.onCategorySelect) {
      props.onCategorySelect(categoryId);
    }
  }

  // --------------------
  // Рендер
  // --------------------
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Сообщества</Text>
          <Text style={styles.headerSubtitle}>
            Находите единомышленников и обсуждайте интересные темы
          </Text>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={createCommunity}>
          <Ionicons name="add" size={20} color={colors.light.primaryForeground} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.light.mutedForeground} />

        <TextInput
          style={styles.searchInput}
          placeholder="Поиск сообществ..."
          placeholderTextColor={colors.light.mutedForeground}
          value={searchValue}
          onChangeText={changeSearch}
        />
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map(function (category) {
          const isActive = selectedCategory === category.id;

          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryChip, isActive ? styles.categoryChipActive : null]}
              onPress={() => selectCategory(category.id)}
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

      {/* Communities */}
      <ScrollView
        contentContainerStyle={styles.communitiesGrid}
        showsVerticalScrollIndicator={false}
      >
        {props.children}
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------
// Стили
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  headerSubtitle: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    marginTop: spacing.xs,
    maxWidth: 260,
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
    paddingBottom: spacing['2xl'],
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
});
