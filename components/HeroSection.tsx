import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Modal,
  TouchableWithoutFeedback,
  Easing,
  ViewStyle,
  FlatList,
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
  icon?: keyof typeof Ionicons.glyphMap;
}

interface HeroSectionProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (text: string) => void;
  onSearchClear?: () => void;
  onApplyFilters?: (filters: Record<string, string>) => void;
  activeFilters?: Record<string, string>;
  compact?: boolean;
  containerStyle?: ViewStyle;
  autoApply?: boolean;
  showApplyButton?: boolean;
  showTitle?: boolean;
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

const DAYS = Array.from({ length: 31 }, (_, i) => ({
  id: `d${i + 1}`,
  label: `${i + 1}`,
  value: `${i + 1}`,
}));

const MONTHS = [
  { id: 'm0', label: 'Январь', value: '0' },
  { id: 'm1', label: 'Февраль', value: '1' },
  { id: 'm2', label: 'Март', value: '2' },
  { id: 'm3', label: 'Апрель', value: '3' },
  { id: 'm4', label: 'Май', value: '4' },
  { id: 'm5', label: 'Июнь', value: '5' },
  { id: 'm6', label: 'Июль', value: '6' },
  { id: 'm7', label: 'Август', value: '7' },
  { id: 'm8', label: 'Сентябрь', value: '8' },
  { id: 'm9', label: 'Октябрь', value: '9' },
  { id: 'm10', label: 'Ноябрь', value: '10' },
  { id: 'm11', label: 'Декабрь', value: '11' },
];

const YEARS = [
  { id: 'y2025', label: '2025', value: '2025' },
  { id: 'y2026', label: '2026', value: '2026' },
];

const FILTER_OPTIONS: Record<string, FilterOption[]> = {
  sort: [
    { id: 's1', label: 'Популярное', value: 'popular', icon: 'flame-outline' },
    { id: 's2', label: 'Ближайшие', value: 'soon', icon: 'time-outline' },
    { id: 's3', label: 'Недавно добавленные', value: 'new', icon: 'sparkles-outline' },
  ],
  category: [
    { id: 'c1', label: 'Музыка', value: 'music', icon: 'musical-notes-outline' },
    { id: 'c2', label: 'Искусство', value: 'art', icon: 'color-palette-outline' },
    { id: 'c3', label: 'Спорт', value: 'sport', icon: 'fitness-outline' },
    { id: 'c4', label: 'Обучение', value: 'education', icon: 'school-outline' },
    { id: 'c5', label: 'Театр', value: 'theater', icon: 'film-outline' },
    { id: 'c6', label: 'Бизнес', value: 'business', icon: 'briefcase-outline' },
    { id: 'c7', label: 'Кино', value: 'cinema', icon: 'videocam-outline' },
    { id: 'c8', label: 'Еда', value: 'food', icon: 'restaurant-outline' },
    { id: 'c9', label: 'Технологии', value: 'tech', icon: 'hardware-chip-outline' },
    { id: 'c10', label: 'Путешествия', value: 'travel', icon: 'airplane-outline' },
    { id: 'c11', label: 'Вечеринки', value: 'party', icon: 'wine-outline' },
    { id: 'c12', label: 'Нетворкинг', value: 'networking', icon: 'people-outline' },
    { id: 'c13', label: 'Игры', value: 'games', icon: 'game-controller-outline' },
    { id: 'c14', label: 'Здоровье', value: 'health', icon: 'heart-outline' },
    { id: 'c15', label: 'Мода', value: 'fashion', icon: 'shirt-outline' },
    { id: 'c16', label: 'Танцы', value: 'dance', icon: 'sparkles-outline' },
  ],
  price: [
    { id: 'p1', label: 'Бесплатно', value: 'free', icon: 'gift-outline' },
    { id: 'p2', label: 'до 5 000₸', value: 'low', icon: 'cash-outline' },
    { id: 'p3', label: '5 000₸ - 15 000₸', value: 'medium', icon: 'wallet-outline' },
    { id: 'p4', label: 'от 15 000₸', value: 'high', icon: 'card-outline' },
  ],
  vibe: [
    { id: 'v1', label: 'Активный', value: 'active', icon: 'flash-outline' },
    { id: 'v2', label: 'Спокойный', value: 'chill', icon: 'leaf-outline' },
    { id: 'v3', label: 'Семейный', value: 'family', icon: 'people-outline' },
    { id: 'v4', label: 'Романтичный', value: 'romantic', icon: 'heart-outline' },
    { id: 'v5', label: 'Вечеринка', value: 'party', icon: 'wine-outline' },
  ],
  time: [
    { id: 't1', label: 'Утро (06:00-12:00)', value: 'morning', icon: 'sunny-outline' },
    {
      id: 't2',
      label: 'День (12:00-18:00)',
      value: 'afternoon',
      icon: 'partly-sunny-outline',
    },
    { id: 't3', label: 'Вечер (18:00-00:00)', value: 'evening', icon: 'moon-outline' },
    {
      id: 't4',
      label: 'Ночь (00:00-06:00)',
      value: 'night',
      icon: 'cloudy-night-outline',
    },
  ],
  age: [
    { id: 'a1', label: '0+', value: '0', icon: 'happy-outline' },
    { id: 'a2', label: '6+', value: '6', icon: 'body-outline' },
    { id: 'a3', label: '12+', value: '12', icon: 'accessibility-outline' },
    { id: 'a4', label: '16+', value: '16', icon: 'shield-checkmark-outline' },
    { id: 'a5', label: '18+', value: '18', icon: 'alert-circle-outline' },
  ],
  district: [
    { id: 'l1', label: 'Алмалинский', value: 'Алмалинский', icon: 'map-outline' },
    { id: 'l2', label: 'Медеуский', value: 'Медеуский', icon: 'map-outline' },
    { id: 'l3', label: 'Бостандыкский', value: 'Бостандыкский', icon: 'map-outline' },
    { id: 'l4', label: 'Турксибский', value: 'Турксибский', icon: 'map-outline' },
    { id: 'l5', label: 'Ауэзовский', value: 'Ауэзовский', icon: 'map-outline' },
    { id: 'l6', label: 'Жетысуский', value: 'Жетысуский', icon: 'map-outline' },
    { id: 'l7', label: 'Наурызбайский', value: 'Наурызбайский', icon: 'map-outline' },
    { id: 'l8', label: 'Алатауский', value: 'Алатауский', icon: 'map-outline' },
  ],
};

export default function HeroSection({
  searchPlaceholder = 'Поиск событий, тегов, мест...',
  searchValue = '',
  onSearchChange,
  onSearchClear,
  onApplyFilters,
  activeFilters,
  compact = false,
  containerStyle,
  autoApply = false,
  showApplyButton = true,
}: HeroSectionProps) {
  const [internalFilters, setInternalFilters] = useState<Record<string, string>>(
    activeFilters || {}
  );
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (activeFilters) setInternalFilters(activeFilters);
  }, [activeFilters]);

  const openModal = (filterId: string) => {
    setActiveFilterId(filterId);
    setIsModalVisible(true);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setIsModalVisible(false);
      setActiveFilterId(null);
    });
  };

  const handleOptionSelect = (key: string, value: string) => {
    const newFilters = { ...internalFilters, [key]: value };
    setInternalFilters(newFilters);
    if (!key.startsWith('date_')) {
      closeModal();
      if (autoApply && onApplyFilters) onApplyFilters(newFilters);
    }
  };

  const getDisplayLabel = (filter: FilterItem) => {
    if (filter.id === 'date') {
      const { date_day, date_month, date_year } = internalFilters;
      if (!date_day && !date_month && !date_year) return 'Дата';
      const mLabel = MONTHS.find(m => m.value === date_month)?.label || '';
      return `${date_day || ''} ${mLabel} ${date_year || ''}`.trim();
    }
    const selectedValue = internalFilters[filter.id];
    if (!selectedValue) return filter.label;
    return (
      FILTER_OPTIONS[filter.id]?.find(opt => opt.value === selectedValue)?.label ||
      filter.label
    );
  };

  const isFilterActive = (filterId: string) => {
    if (filterId === 'date')
      return !!(
        internalFilters.date_day ||
        internalFilters.date_month ||
        internalFilters.date_year
      );
    return !!internalFilters[filterId];
  };

  const resetDate = () => {
    const next = { ...internalFilters };
    delete next.date_day;
    delete next.date_month;
    delete next.date_year;
    setInternalFilters(next);
    if (autoApply) onApplyFilters?.(next);
  };

  return (
    <>
      <View
        style={[styles.container, compact && styles.containerCompact, containerStyle]}
      >
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.light.mutedForeground} />
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
          contentContainerStyle={styles.filtersWrapper}
        >
          {FILTERS_CONFIG.map(filter => {
            const isActive = isFilterActive(filter.id);
            return (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterChip, isActive && styles.activeFilterChip]}
                onPress={() => openModal(filter.id)}
              >
                <Ionicons
                  name={filter.icon}
                  size={16}
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
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => onApplyFilters?.(internalFilters)}
          >
            <Text style={styles.applyButtonText}>Применить фильтры</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalRoot}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]} />
          </TouchableWithoutFeedback>

          <Animated.View
            style={[
              styles.dropdownContainer,
              activeFilterId === 'date' && styles.dateDropdown,
              { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
            ]}
          >
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownTitle}>
                {activeFilterId === 'date'
                  ? 'Выберите дату'
                  : FILTERS_CONFIG.find(f => f.id === activeFilterId)?.label}
              </Text>
              {activeFilterId === 'date' && (
                <TouchableOpacity onPress={resetDate}>
                  <Text style={styles.resetText}>Сброс</Text>
                </TouchableOpacity>
              )}
            </View>

            {activeFilterId === 'date' ? (
              <View style={styles.datePickerBody}>
                {[
                  { label: 'День', key: 'date_day', data: DAYS },
                  { label: 'Месяц', key: 'date_month', data: MONTHS },
                  { label: 'Год', key: 'date_year', data: YEARS },
                ].map(col => (
                  <View key={col.key} style={styles.dateCol}>
                    <Text style={styles.colLabel}>{col.label}</Text>
                    <FlatList
                      data={col.data}
                      keyExtractor={item => item.id}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => handleOptionSelect(col.key, item.value)}
                          style={[
                            styles.dateOpt,
                            internalFilters[col.key] === item.value &&
                              styles.dateOptActive,
                          ]}
                        >
                          <Text
                            style={[
                              styles.dateOptText,
                              internalFilters[col.key] === item.value &&
                                styles.dateOptTextActive,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                ))}
              </View>
            ) : (
              <FlatList
                data={FILTER_OPTIONS[activeFilterId!] || []}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.optionsList}
                renderItem={({ item }) => {
                  const isSelected = internalFilters[activeFilterId!] === item.value;
                  return (
                    <TouchableOpacity
                      style={[styles.optionItem, isSelected && styles.optionItemActive]}
                      onPress={() => handleOptionSelect(activeFilterId!, item.value)}
                    >
                      <View style={styles.optionContent}>
                        {item.icon && (
                          <Ionicons
                            name={item.icon}
                            size={20}
                            color={
                              isSelected
                                ? colors.light.primary
                                : colors.light.mutedForeground
                            }
                          />
                        )}
                        <Text
                          style={[
                            styles.optionText,
                            isSelected && styles.optionTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </View>
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={colors.light.primary}
                        />
                      )}
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            {activeFilterId === 'date' && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => {
                  onApplyFilters?.(internalFilters);
                  closeModal();
                }}
              >
                <Text style={styles.confirmButtonText}>Применить дату</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg, // Увеличен для соответствия странице сообществ
    backgroundColor: colors.light.background,
  },
  containerCompact: { paddingTop: spacing.lg }, // Также увеличен для идентичности
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  filtersWrapper: {
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  filterChip: {
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
    backgroundColor: colors.light.foreground,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  applyButtonText: {
    color: colors.light.background,
    fontSize: typography.base,
    fontWeight: '700',
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  dropdownContainer: {
    width: '90%',
    backgroundColor: colors.light.background,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.lg,
    maxHeight: '70%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  dateDropdown: { height: 450 },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  dropdownTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
  },
  resetText: {
    color: colors.light.primary,
    fontWeight: '600',
  },
  optionsList: {
    paddingHorizontal: spacing.md,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  optionItemActive: {
    backgroundColor: colors.light.secondary,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  optionText: {
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  optionTextActive: {
    color: colors.light.primary,
    fontWeight: '600',
  },
  datePickerBody: {
    flexDirection: 'row',
    flex: 1,
    paddingHorizontal: spacing.sm,
  },
  dateCol: { flex: 1 },
  colLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.light.mutedForeground,
    marginBottom: 8,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateOpt: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    marginHorizontal: 4,
  },
  dateOptActive: { backgroundColor: colors.light.primary },
  dateOptText: { fontSize: 16, color: colors.light.foreground },
  dateOptTextActive: { color: '#fff', fontWeight: '700' },
  confirmButton: {
    margin: spacing.lg,
    backgroundColor: colors.light.primary,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
