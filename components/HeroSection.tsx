import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

interface FilterItem {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface FilterOption {
  id: string;
  label: string;
  value: string;
}

interface HeroSectionProps {
  title?: string;
  titleSecondary?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchClear?: () => void;
  onApplyFilters?: (filters: Record<string, string>) => void;
  activeFilters?: Record<string, string>;
  showTitle?: boolean;
  compact?: boolean;
  containerStyle?: ViewStyle;
  autoApply?: boolean;
  showApplyButton?: boolean;
}

const FILTERS_CONFIG: FilterItem[] = [
  { id: 'sort', label: 'Сортировка', icon: 'filter-outline' },
  { id: 'date', label: 'Дата', icon: 'calendar-outline' },
  { id: 'category', label: 'Категория', icon: 'pricetag-outline' },
  { id: 'price', label: 'Цена', icon: 'cash-outline' },
  { id: 'vibe', label: 'Вайб', icon: 'flash-outline' },
  { id: 'time', label: 'Время', icon: 'time-outline' },
  { id: 'age', label: 'Возраст', icon: 'people-outline' },
  { id: 'district', label: 'Район', icon: 'location-outline' },
];

const FILTER_OPTIONS: Record<string, FilterOption[]> = {
  sort: [
    { id: 's1', label: 'Популярное', value: 'popular' },
    { id: 's2', label: 'Ближайшие', value: 'soon' },
    { id: 's3', label: 'Недавно добавленные', value: 'new' },
  ],
  date: [
    { id: 'd1', label: 'Сегодня', value: 'today' },
    { id: 'd2', label: 'Завтра', value: 'tomorrow' },
    { id: 'd3', label: 'На этой неделе', value: 'week' },
    { id: 'd4', label: 'На выходных', value: 'weekend' },
  ],
  category: [
    { id: 'c1', label: 'Музыка', value: 'music' },
    { id: 'c2', label: 'Искусство', value: 'art' },
    { id: 'c3', label: 'Спорт', value: 'sport' },
    { id: 'c4', label: 'Обучение', value: 'education' },
    { id: 'c5', label: 'Театр', value: 'theater' },
    { id: 'c6', label: 'Бизнес', value: 'business' },
  ],
  price: [
    { id: 'p1', label: 'Бесплатно', value: 'free' },
    { id: 'p2', label: 'до 5 000₸', value: 'low' },
    { id: 'p5', label: 'Любая', value: 'any' },
  ],
  vibe: [
    { id: 'v1', label: 'Вечеринка', value: 'party' },
    { id: 'v2', label: 'Спокойствие', value: 'chill' },
  ],
  time: [
    { id: 't1', label: 'Утро (06:00-12:00)', value: 'morning' },
    { id: 't2', label: 'День (12:00-18:00)', value: 'afternoon' },
    { id: 't3', label: 'Вечер (18:00-00:00)', value: 'evening' },
    { id: 't4', label: 'Ночь (00:00-06:00)', value: 'night' },
  ],
  age: [
    { id: 'a1', label: '0+', value: '0' },
    { id: 'a2', label: '12+', value: '12' },
    { id: 'a3', label: '18+', value: '18' },
  ],
  district: [
    { id: 'l1', label: 'Алмалинский', value: 'almaly' },
    { id: 'l2', label: 'Медеуский', value: 'medeu' },
    { id: 'l3', label: 'Бостандыкский', value: 'bostandyk' },
  ],
};

export default function HeroSection({
  title = 'Твой город. Твои люди.',
  titleSecondary = 'Твой следующий шаг.',
  searchPlaceholder = 'Поиск событий, тегов, мест...',
  searchValue = '',
  onSearchChange,
  onSearchClear,
  onApplyFilters,
  activeFilters,
  showTitle = true,
  compact = false,
  containerStyle,
  autoApply = false,
  showApplyButton = true,
}: HeroSectionProps) {
  const [internalFilters, setInternalFilters] = useState<Record<string, string>>(
    activeFilters || {}
  );
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);

  useEffect(() => {
    if (activeFilters) setInternalFilters(activeFilters);
  }, [activeFilters]);

  const handleFilterPress = (filterId: string) => setActiveFilterId(filterId);

  const handleOptionSelect = (option: FilterOption) => {
    if (!activeFilterId) return;
    const newFilters = { ...internalFilters, [activeFilterId]: option.value };
    setInternalFilters(newFilters);
    setActiveFilterId(null);
    if (autoApply && onApplyFilters) onApplyFilters(newFilters);
  };

  const getDisplayLabel = (filter: FilterItem) => {
    const selectedValue = internalFilters[filter.id];
    if (!selectedValue) return filter.label;
    const options = FILTER_OPTIONS[filter.id];
    const selectedOption = options?.find(opt => opt.value === selectedValue);
    return selectedOption ? selectedOption.label : filter.label;
  };

  const isFilterActive = (filterId: string) => !!internalFilters[filterId];

  const renderOptionItem = ({ item }: { item: FilterOption }) => {
    const isSelected = activeFilterId
      ? internalFilters[activeFilterId] === item.value
      : false;
    return (
      <TouchableOpacity
        style={[styles.dropdownItem, isSelected && styles.selectedDropdownItem]}
        onPress={() => handleOptionSelect(item)}
      >
        <Text
          style={[styles.dropdownItemText, isSelected && styles.selectedDropdownItemText]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark" size={18} color={colors.light.primary} />
        )}
      </TouchableOpacity>
    );
  };

  const handleApplyPress = () => onApplyFilters?.(internalFilters);

  return (
    <>
      <View
        style={[styles.container, compact && styles.containerCompact, containerStyle]}
      >
        {showTitle && (
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.titleSecondary}>{titleSecondary}</Text>
          </View>
        )}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.light.mutedForeground} />
          <TextInput
            style={styles.searchInput}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.light.mutedForeground}
            value={searchValue}
            onChangeText={onSearchChange}
          />
          {searchValue.length > 0 && (
            <TouchableOpacity onPress={onSearchClear}>
              <Ionicons
                name="close-circle"
                size={20}
                color={colors.light.mutedForeground}
              />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS_CONFIG.map(filter => {
            const isActive = isFilterActive(filter.id);
            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterChip, isActive && styles.activeFilterChip]}
                onPress={() => handleFilterPress(filter.id)}
              >
                <Ionicons
                  name={filter.icon}
                  size={14}
                  color={isActive ? colors.light.primary : colors.light.foreground}
                />
                <Text style={[styles.filterText, isActive && styles.activeFilterText]}>
                  {getDisplayLabel(filter)}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={isActive ? colors.light.primary : colors.light.mutedForeground}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {showApplyButton && (
          <TouchableOpacity style={styles.applyButton} onPress={handleApplyPress}>
            <Text style={styles.applyButtonText}>Применить фильтры</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={!!activeFilterId}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActiveFilterId(null)}
      >
        <TouchableWithoutFeedback onPress={() => setActiveFilterId(null)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdownContainer}>
                <Text style={styles.dropdownTitle}>
                  {activeFilterId
                    ? FILTERS_CONFIG.find(f => f.id === activeFilterId)?.label
                    : 'Выберите'}
                </Text>
                <FlatList
                  data={activeFilterId ? FILTER_OPTIONS[activeFilterId] || [] : []}
                  renderItem={renderOptionItem}
                  keyExtractor={item => item.id}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing['2xl'],
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  containerCompact: {
    paddingVertical: spacing.md,
  },
  titleContainer: {
    marginBottom: spacing['2xl'],
    alignItems: 'center',
  },
  title: {
    fontSize: typography['3xl'],
    fontWeight: '700',
    color: colors.light.foreground,
    textAlign: 'center',
  },
  titleSecondary: {
    fontSize: typography['3xl'],
    fontWeight: '700',
    color: colors.light.foreground,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.background,
    borderWidth: 2,
    borderColor: colors.light.border,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  filtersContainer: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  activeFilterChip: {
    borderColor: colors.light.primary,
    backgroundColor: colors.light.secondary,
  },
  filterText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  activeFilterText: {
    color: colors.light.primary,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  applyButtonText: {
    color: colors.light.primaryForeground,
    fontSize: typography.base,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  dropdownContainer: {
    backgroundColor: colors.light.background,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 400,
  },
  dropdownTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.mutedForeground,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  selectedDropdownItem: {
    backgroundColor: colors.light.secondary,
  },
  dropdownItemText: {
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  selectedDropdownItemText: {
    fontWeight: '600',
    color: colors.light.primary,
  },
});
