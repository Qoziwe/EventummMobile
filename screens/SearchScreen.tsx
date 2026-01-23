import React, { useState, useLayoutEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

import HeroSection from '../components/HeroSection';
import EventCard, { EventItem } from '../components/EventCard';
import { ALL_EVENTS } from '../data/mockData';

export default function SearchScreen() {
  const navigation = useNavigation();

  const [searchValue, setSearchValue] = useState('');
  const [currentFilters, setCurrentFilters] = useState<Record<string, string>>({});

  const isSearching = searchValue.length > 0 || Object.keys(currentFilters).length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // --- ГЛАВНАЯ ЛОГИКА ФИЛЬТРАЦИИ ---
  const filteredEvents = useMemo(() => {
    let result = ALL_EVENTS;

    if (isSearching) {
      result = result.filter(event => {
        // 1. Поиск по тексту
        if (searchValue.length > 0) {
          const s = searchValue.toLowerCase();
          const matches =
            event.title.toLowerCase().includes(s) ||
            event.location.toLowerCase().includes(s) ||
            (event.tags && event.tags.some(t => t.toLowerCase().includes(s)));

          if (!matches) return false;
        }

        // 2. ФИЛЬТРЫ
        for (const [key, value] of Object.entries(currentFilters)) {
          if (!value || value === 'any') continue;

          // Район
          if (key === 'district' && event.district !== value) return false;

          // Возраст
          if (key === 'age' && event.ageLimit !== parseInt(value)) return false;

          // Время (Математика по часам)
          if (key === 'time') {
            const hour = new Date(event.timestamp || 0).getHours();
            if (value === 'morning' && (hour < 6 || hour >= 12)) return false;
            if (value === 'afternoon' && (hour < 12 || hour >= 18)) return false;
            if (value === 'evening' && (hour < 18 || hour >= 24)) return false;
            if (value === 'night' && (hour < 0 || hour >= 6)) return false;
          }

          // Категория
          if (key === 'category' && !event.categories?.includes(value)) return false;

          // Вайб
          if (key === 'vibe' && event.vibe !== value) return false;

          // Цена
          if (key === 'price') {
            if (value === 'free' && event.priceValue !== 0) return false;
            if (value === 'low' && (event.priceValue || 0) > 5000) return false;
          }

          // Дата
          if (key === 'date') {
            const now = new Date();
            const todayStart = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            ).getTime();
            const tomorrowStart = todayStart + 24 * 60 * 60 * 1000;
            const dayAfterTomorrowStart = tomorrowStart + 24 * 60 * 60 * 1000;
            const eventTime = event.timestamp || 0;

            if (value === 'today') {
              if (eventTime < todayStart || eventTime >= tomorrowStart) return false;
            }
            if (value === 'tomorrow') {
              if (eventTime < tomorrowStart || eventTime >= dayAfterTomorrowStart)
                return false;
            }
            if (value === 'week') {
              if (
                eventTime < todayStart ||
                eventTime > todayStart + 7 * 24 * 60 * 60 * 1000
              )
                return false;
            }
            if (value === 'weekend') {
              const d = new Date(eventTime).getDay();
              if (d !== 0 && d !== 6 && d !== 5) return false;
            }
          }
        }
        return true;
      });
    }

    // СОРТИРОВКА
    const sortMode = currentFilters['sort'];
    return [...result].sort((a, b) => {
      if (sortMode === 'popular') return (b.stats || 0) - (a.stats || 0);
      if (sortMode === 'soon') return (a.timestamp || 0) - (b.timestamp || 0);
      return new Date(b.addedAt || 0).getTime() - new Date(a.addedAt || 0).getTime();
    });
  }, [searchValue, currentFilters, isSearching]);

  const handleTagPress = (tag: string) => {
    if (tag === 'Бесплатно') setCurrentFilters(prev => ({ ...prev, price: 'free' }));
    else if (tag === 'Вечеринка') setCurrentFilters(prev => ({ ...prev, vibe: 'party' }));
    else setSearchValue(tag);
  };

  const handleResetAll = () => {
    setSearchValue('');
    setCurrentFilters({});
    Keyboard.dismiss();
  };

  const applyPresetFilter = (key: string, value: string) => {
    setCurrentFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Поиск</Text>
        <View style={styles.headerButtonRight} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchClear={() => setSearchValue('')}
          activeFilters={currentFilters}
          onApplyFilters={setCurrentFilters}
          autoApply={true}
          showApplyButton={false}
          showTitle={false}
          compact={true}
          searchPlaceholder="События, места, люди..."
        />

        {isSearching ? (
          <View style={styles.resultsList}>
            <View style={styles.resultsHeader}>
              <Text style={styles.sectionTitle}>
                Найдено {filteredEvents.length} событий
              </Text>
              <TouchableOpacity onPress={handleResetAll} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Сбросить</Text>
                <Ionicons
                  name="close-circle-outline"
                  size={16}
                  color={colors.light.primary}
                />
              </TouchableOpacity>
            </View>
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                {...event}
                variant="list"
                onPress={() =>
                  navigation.navigate('EventDetail' as never, { ...event } as never)
                }
              />
            ))}
            {filteredEvents.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>Ничего не найдено</Text>
              </View>
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Популярные теги</Text>
              <View style={styles.tagsContainer}>
                {[
                  'Концерт',
                  'Искусство',
                  'Спорт',
                  'Бизнес',
                  'Бесплатно',
                  'Вечеринка',
                ].map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.tag}
                    onPress={() => handleTagPress(tag)}
                  >
                    <Text style={styles.tagText}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Быстрые подборки</Text>
              <View style={styles.quickFiltersGrid}>
                <TouchableOpacity
                  style={styles.quickFilterButton}
                  onPress={() => applyPresetFilter('sort', 'popular')}
                >
                  <Ionicons
                    name="flame-outline"
                    size={20}
                    color={colors.light.foreground}
                  />
                  <Text style={styles.quickFilterText}>Популярное</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickFilterButton}
                  onPress={() => applyPresetFilter('date', 'today')}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={colors.light.foreground}
                  />
                  <Text style={styles.quickFilterText}>Сегодня</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickFilterButton}
                  onPress={() => applyPresetFilter('price', 'free')}
                >
                  <Ionicons
                    name="gift-outline"
                    size={20}
                    color={colors.light.foreground}
                  />
                  <Text style={styles.quickFilterText}>Бесплатно</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Недавно добавленные</Text>
              <View style={{ gap: 12 }}>
                {filteredEvents.map(event => (
                  <EventCard
                    key={event.id}
                    {...event}
                    variant="list"
                    onPress={() =>
                      navigation.navigate('EventDetail' as never, { ...event } as never)
                    }
                  />
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    minHeight: 56,
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
  container: { flex: 1 },
  scrollContent: { paddingBottom: spacing['2xl'] },
  section: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.light.foreground,
    marginBottom: spacing.md,
  },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  tag: {
    backgroundColor: colors.light.secondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 10,
    borderRadius: 20,
  },
  tagText: { fontSize: typography.sm, color: colors.light.foreground, fontWeight: '500' },
  quickFiltersGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  quickFilterButton: {
    width: '30%',
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.lg,
    gap: spacing.sm,
  },
  quickFilterText: {
    fontSize: typography.sm,
    fontWeight: '500',
    color: colors.light.foreground,
  },
  resultsList: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  resetButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resetButtonText: {
    color: colors.light.primary,
    fontSize: typography.sm,
    fontWeight: '600',
  },
  emptyState: { alignItems: 'center', paddingVertical: spacing.xl },
  emptyStateText: { fontSize: typography.base, color: colors.light.mutedForeground },
});
