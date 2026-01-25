import React, { useState, useLayoutEffect, useMemo, useEffect } from 'react';
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
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

import HeroSection from '../components/HeroSection';
import EventCard from '../components/EventCard';

// Импортируем стор для получения динамических данных
import { useEventStore } from '../store/eventStore';

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Получаем динамический список мероприятий
  const { events } = useEventStore();

  const [searchValue, setSearchValue] = useState('');
  const [currentFilters, setCurrentFilters] = useState<Record<string, string>>({});

  useEffect(() => {
    if (route.params?.incomingFilters) {
      setCurrentFilters(route.params.incomingFilters);
      navigation.setParams({ incomingFilters: undefined });
    }
  }, [route.params?.incomingFilters]);

  const isSearching = searchValue.length > 0 || Object.keys(currentFilters).length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const filteredEvents = useMemo(() => {
    // Используем события из стора вместо статического массива
    let result = events;

    if (isSearching) {
      result = result.filter(event => {
        if (searchValue.length > 0) {
          const s = searchValue.toLowerCase();
          const matches =
            event.title.toLowerCase().includes(s) ||
            event.location.toLowerCase().includes(s) ||
            (event.tags && event.tags.some(t => t.toLowerCase().includes(s)));
          if (!matches) return false;
        }

        if (
          currentFilters.date_day ||
          currentFilters.date_month ||
          currentFilters.date_year
        ) {
          const evDate = new Date(event.timestamp);
          if (
            currentFilters.date_day &&
            evDate.getDate() !== parseInt(currentFilters.date_day)
          )
            return false;
          if (
            currentFilters.date_month &&
            evDate.getMonth() !== parseInt(currentFilters.date_month)
          )
            return false;
          if (
            currentFilters.date_year &&
            evDate.getFullYear() !== parseInt(currentFilters.date_year)
          )
            return false;
        }

        for (const [key, value] of Object.entries(currentFilters)) {
          if (!value || value === 'any' || key.startsWith('date_')) continue;

          if (key === 'district' && event.district !== value) return false;
          if (key === 'vibe' && event.vibe !== value) return false;
          if (key === 'age' && event.ageLimit < parseInt(value)) return false;
          if (
            key === 'category' &&
            !event.categories?.some(c => c.toLowerCase().includes(value.toLowerCase()))
          )
            return false;

          if (key === 'price') {
            if (value === 'free' && event.priceValue !== 0) return false;
            if (value === 'low' && (event.priceValue || 0) > 5000) return false;
            if (
              value === 'medium' &&
              ((event.priceValue || 0) < 5000 || (event.priceValue || 0) > 15000)
            )
              return false;
            if (value === 'high' && (event.priceValue || 0) < 15000) return false;
          }

          if (key === 'time') {
            const hour = new Date(event.timestamp).getHours();
            if (value === 'morning' && (hour < 6 || hour >= 12)) return false;
            if (value === 'afternoon' && (hour < 12 || hour >= 18)) return false;
            if (value === 'evening' && (hour < 18 || hour >= 24)) return false;
            if (value === 'night' && (hour < 0 || hour >= 6)) return false;
          }
        }
        return true;
      });
    }

    const sortMode = currentFilters['sort'];
    return [...result].sort((a, b) => {
      if (sortMode === 'popular') return (b.stats || 0) - (a.stats || 0);
      if (sortMode === 'soon') return (a.timestamp || 0) - (b.timestamp || 0);
      return b.timestamp - a.timestamp;
    });
  }, [events, searchValue, currentFilters, isSearching]);

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Поиск</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
        />

        <View style={styles.resultsWrapper}>
          {isSearching && (
            <View style={styles.resHead}>
              <Text style={styles.resTitle}>Найдено: {filteredEvents.length}</Text>
              <TouchableOpacity
                onPress={() => {
                  setSearchValue('');
                  setCurrentFilters({});
                  Keyboard.dismiss();
                }}
              >
                <Text style={styles.resetTxt}>Сбросить всё</Text>
              </TouchableOpacity>
            </View>
          )}

          {filteredEvents.map(event => (
            <EventCard
              key={event.id}
              {...event}
              style={styles.eventCardOverride}
              onPress={() => navigation.navigate('EventDetail', { ...event })}
            />
          ))}

          {isSearching && filteredEvents.length === 0 && (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={64} color={colors.light.border} />
              <Text style={styles.emptyTxt}>Ничего не нашли...</Text>
              <Text style={styles.emptySubTxt}>
                Попробуйте изменить параметры поиска или фильтры
              </Text>
            </View>
          )}
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
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  container: { flex: 1 },
  resultsWrapper: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
  },
  eventCardOverride: {
    width: '100%',
    marginBottom: spacing.md,
  },
  resHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  resTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  resetTxt: { color: colors.light.primary, fontWeight: '600' },
  empty: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyTxt: {
    color: colors.light.foreground,
    fontSize: typography.lg,
    fontWeight: '600',
  },
  emptySubTxt: {
    color: colors.light.mutedForeground,
    fontSize: typography.sm,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
