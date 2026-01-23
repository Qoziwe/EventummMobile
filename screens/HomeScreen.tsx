import React, { useState, useMemo } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import ForYouSection from '../components/ribbons/ForYouSection';
import NextWeekFeed from '../components/ribbons/NextWeekFeed';
import EventsGrid from '../components/EventsGrid';
import CommunityPulse from '../components/CommunityPulse';
import Footer from '../components/Footer';
import EventCard, { EventItem } from '../components/EventCard';
import { ALL_EVENTS } from '../data/mockData';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const hasActiveFilters = Object.keys(activeFilters).length > 0;

  // --- ЛОГИКА ФИЛЬТРАЦИИ ---
  const filterEvents = (events: EventItem[]) => {
    if (!hasActiveFilters) return events;

    return events.filter(event => {
      // 1. Категория
      if (activeFilters.category) {
        if (
          !event.category.toLowerCase().includes(activeFilters.category.toLowerCase()) &&
          !event.tags?.some(t => t.toLowerCase() === activeFilters.category.toLowerCase())
        ) {
          return false;
        }
      }
      // 2. Цена
      if (activeFilters.price) {
        if (activeFilters.price === 'free' && event.priceValue !== 0) return false;
        if (activeFilters.price === 'low' && event.priceValue > 5000) return false;
      }
      // 3. Вайб
      if (activeFilters.vibe) {
        const v = activeFilters.vibe.toLowerCase();
        if (!event.tags?.some(t => t.toLowerCase().includes(v))) return false;
      }

      return true;
    });
  };

  // --- СОРТИРОВКА (Для главной важна сортировка по фильтру Sort) ---
  const sortEvents = (events: EventItem[]) => {
    const sortMode = activeFilters.sort;
    if (!sortMode) return events;

    return [...events].sort((a, b) => {
      if (sortMode === 'popular') return (b.stats || 0) - (a.stats || 0);
      if (sortMode === 'soon') return a.timestamp - b.timestamp;
      if (sortMode === 'new') {
        const dateA = a.addedAt ? new Date(a.addedAt).getTime() : 0;
        const dateB = b.addedAt ? new Date(b.addedAt).getTime() : 0;
        return dateB - dateA;
      }
      return 0;
    });
  };

  // Применяем фильтры ко всем событиям
  const allFiltered = useMemo(() => {
    return sortEvents(filterEvents(ALL_EVENTS));
  }, [activeFilters]);

  // Разбиваем отфильтрованные данные обратно по секциям
  const filteredPopular = allFiltered.filter(e => e.isPopular);
  const filteredForYou = allFiltered.filter(e => e.isForYou);
  const filteredNextWeek = allFiltered.filter(e => e.isNextWeek);

  // Если после фильтрации секции пусты, но есть общие результаты, покажем их в сетке
  const showFallbackGrid =
    hasActiveFilters &&
    filteredPopular.length === 0 &&
    filteredForYou.length === 0 &&
    filteredNextWeek.length === 0 &&
    allFiltered.length > 0;

  function openEventDetails(event: EventItem) {
    navigation.navigate('EventDetail' as never, { ...event, eventId: event.id } as never);
  }

  return (
    <>
      <Header
        onSearchPress={() =>
          navigation.navigate('MainTabs' as never, { screen: 'Search' } as never)
        }
        onProfilePress={() =>
          navigation.navigate('MainTabs' as never, { screen: 'Profile' } as never)
        }
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HeroSection
          onApplyFilters={setActiveFilters}
          activeFilters={activeFilters}
          autoApply={false}
          showApplyButton={true}
        />

        {hasActiveFilters && (
          <View style={styles.activeFiltersContainer}>
            <Text style={styles.activeFiltersText}>
              Активные фильтры: {Object.keys(activeFilters).length}
            </Text>
            <TouchableOpacity
              onPress={() => setActiveFilters({})}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>Сбросить</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Если ничего не найдено */}
        {allFiltered.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Нет событий по выбранным фильтрам</Text>
          </View>
        )}

        {/* Если фильтры жесткие и стандартные секции пропали, показываем все что есть */}
        {showFallbackGrid ? (
          <EventsGrid onViewAll={() => {}}>
            {allFiltered.map(event => (
              <EventCard
                key={event.id}
                {...event}
                onPress={() => openEventDetails(event)}
              />
            ))}
          </EventsGrid>
        ) : (
          // Стандартный вид
          <>
            {filteredForYou.length > 0 && (
              <ForYouSection>
                {filteredForYou.map(event => (
                  <EventCard
                    key={event.id}
                    {...event}
                    variant="compact"
                    onPress={() => openEventDetails(event)}
                  />
                ))}
              </ForYouSection>
            )}

            {filteredNextWeek.length > 0 && (
              <NextWeekFeed
                title="На следующей неделе"
                events={filteredNextWeek}
                onEventPress={openEventDetails}
              />
            )}

            {filteredPopular.length > 0 && (
              <EventsGrid onViewAll={() => navigation.navigate('AllEvents' as never)}>
                {filteredPopular.map(event => (
                  <EventCard
                    key={event.id}
                    {...event}
                    onPress={() => openEventDetails(event)}
                  />
                ))}
              </EventsGrid>
            )}
          </>
        )}

        <CommunityPulse
          onViewAll={() =>
            navigation.navigate('MainTabs' as never, { screen: 'Communities' } as never)
          }
        />
        <Footer />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  activeFiltersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.light.secondary,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
  },
  activeFiltersText: { fontSize: typography.sm, fontWeight: '500' },
  resetButtonText: { fontSize: typography.sm, color: '#FF3B30', fontWeight: '600' },
  emptyState: { padding: spacing.xl, alignItems: 'center' },
  emptyText: { color: colors.light.mutedForeground },
});
