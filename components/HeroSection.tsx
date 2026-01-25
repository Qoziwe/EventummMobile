import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  ],
  price: [
    { id: 'p1', label: 'Бесплатно', value: 'free', icon: 'gift-outline' },
    { id: 'p2', label: 'до 5 000₸', value: 'low', icon: 'cash-outline' },
    { id: 'p3', label: '5 000₸ - 15 000₸', value: 'medium', icon: 'wallet-outline' },
    { id: 'p4', label: 'от 15 000₸', value: 'high', icon: 'card-outline' },
    { id: 'p5', label: 'Любая цена', value: 'any', icon: 'infinite-outline' },
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
    { id: 'a6', label: '21+', value: '21', icon: 'ban-outline' },
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
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
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
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsModalVisible(false);
      setActiveFilterId(null);
    });
  };

  const handleFilterPress = (filterId: string) => openModal(filterId);

  const handleOptionSelect = (key: string, value: string) => {
    const newFilters = { ...internalFilters, [key]: value };
    setInternalFilters(newFilters);
    if (!key.startsWith('date_')) {
      closeModal();
    }
    if (autoApply && onApplyFilters) onApplyFilters(newFilters);
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
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
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
                <View style={styles.dateCol}>
                  <Text style={styles.colLabel}>День</Text>
                  <FlatList
                    data={DAYS}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleOptionSelect('date_day', item.value)}
                        style={[
                          styles.dateOpt,
                          internalFilters.date_day === item.value && styles.dateOptActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateOptText,
                            internalFilters.date_day === item.value &&
                              styles.dateOptTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={i => i.id}
                  />
                </View>
                <View style={styles.dateCol}>
                  <Text style={styles.colLabel}>Месяц</Text>
                  <FlatList
                    data={MONTHS}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleOptionSelect('date_month', item.value)}
                        style={[
                          styles.dateOpt,
                          internalFilters.date_month === item.value &&
                            styles.dateOptActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateOptText,
                            internalFilters.date_month === item.value &&
                              styles.dateOptTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={i => i.id}
                  />
                </View>
                <View style={styles.dateCol}>
                  <Text style={styles.colLabel}>Год</Text>
                  <FlatList
                    data={YEARS}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => handleOptionSelect('date_year', item.value)}
                        style={[
                          styles.dateOpt,
                          internalFilters.date_year === item.value &&
                            styles.dateOptActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateOptText,
                            internalFilters.date_year === item.value &&
                              styles.dateOptTextActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={i => i.id}
                  />
                </View>
              </View>
            ) : (
              <FlatList
                data={FILTER_OPTIONS[activeFilterId!] || []}
                contentContainerStyle={styles.dropdownListContent}
                ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
                renderItem={({ item }) => {
                  const isSelected = internalFilters[activeFilterId!] === item.value;
                  return (
                    <TouchableOpacity
                      style={[styles.dropdownItem, isSelected && styles.selectedItem]}
                      onPress={() => handleOptionSelect(activeFilterId!, item.value)}
                    >
                      <View style={styles.dropdownItemLeft}>
                        {item.icon ? (
                          <Ionicons
                            name={item.icon}
                            size={20}
                            color={
                              isSelected
                                ? colors.light.primary
                                : colors.light.mutedForeground
                            }
                          />
                        ) : (
                          <View
                            style={[styles.bullet, isSelected && styles.bulletActive]}
                          />
                        )}
                        <Text
                          style={[
                            styles.dropdownItemText,
                            isSelected && styles.selectedItemText,
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
                keyExtractor={item => item.id}
              />
            )}
            {activeFilterId === 'date' && (
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={() => {
                  onApplyFilters?.(internalFilters);
                  closeModal();
                }}
              >
                <Text style={styles.confirmBtnText}>Готово</Text>
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
    paddingBottom: spacing['2xl'],
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  containerCompact: { paddingVertical: spacing.md },
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
  },
  searchInput: { flex: 1, fontSize: typography.base, color: colors.light.foreground },
  filtersContainer: { gap: spacing.sm, paddingBottom: spacing.lg },
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
  filterText: { fontSize: typography.sm, color: colors.light.foreground },
  activeFilterText: { color: colors.light.primary, fontWeight: '600' },
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
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  dropdownContainer: {
    width: '90%',
    backgroundColor: colors.light.background,
    borderRadius: 20,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: colors.light.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  dateDropdown: { height: 500 },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  dropdownTitle: {
    fontSize: typography.xl,
    fontWeight: '800',
    color: colors.light.foreground,
  },
  resetText: {
    color: colors.light.primary,
    fontSize: typography.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dropdownListContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  itemSeparator: {
    height: 1,
    backgroundColor: colors.light.border,
    marginHorizontal: spacing.xl,
    opacity: 0.4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  dropdownItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.border,
  },
  bulletActive: {
    backgroundColor: colors.light.primary,
    width: 8,
    height: 8,
  },
  selectedItem: {
    backgroundColor: colors.light.secondary,
  },
  dropdownItemText: {
    fontSize: typography.base,
    color: colors.light.foreground,
    fontWeight: '500',
  },
  selectedItemText: {
    fontWeight: '700',
    color: colors.light.primary,
  },
  datePickerBody: { flexDirection: 'row', flex: 1, paddingHorizontal: spacing.sm },
  dateCol: { flex: 1 },
  colLabel: {
    textAlign: 'center',
    fontSize: 10,
    color: colors.light.mutedForeground,
    marginVertical: 4,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  dateOpt: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  dateOptActive: { backgroundColor: colors.light.primary },
  dateOptText: { fontSize: 16, color: colors.light.foreground },
  dateOptTextActive: { color: '#fff', fontWeight: '700' },
  confirmBtn: {
    margin: spacing.xl,
    backgroundColor: colors.light.primary,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    shadowColor: colors.light.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  confirmBtnText: { color: '#fff', fontWeight: '800', fontSize: typography.base },
});
