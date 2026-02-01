import React, { useState, useLayoutEffect, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Keyboard,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

import HeroSection from '../components/HeroSection';
import EventCard from '../components/EventCard';
import { useEventStore } from '../store/eventStore';
import { useUserStore } from '../store/userStore';
import { calculateUserAge } from '../utils/dateUtils';

export default function SearchScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { events, fetchEvents } = useEventStore();
  const { user } = useUserStore();

  const [searchValue, setSearchValue] = useState('');
  const [currentFilters, setCurrentFilters] = useState<Record<string, string>>({});
  const [refreshing, setRefreshing] = useState(false);

  const userAge = useMemo(() => calculateUserAge(user.birthDate), [user.birthDate]);

  // Авто-обновление при фокусе на экран
  useFocusEffect(
    useCallback(() => {
      fetchEvents();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  }, [fetchEvents]);

  useEffect(() => {
    if (route.params?.incomingFilters) {
      setCurrentFilters(prev => ({ ...prev, ...route.params.incomingFilters }));
      navigation.setParams({ incomingFilters: undefined });
    }
  }, [route.params?.incomingFilters]);

  const isSearching = searchValue.length > 0 || Object.keys(currentFilters).length > 0;

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const filteredEvents = useMemo(() => {
    let result = events.filter(e => userAge >= (e.ageLimit || 0));

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
          if (key === 'category') {
            const hasCat = event.categories?.some(
              c => c.toLowerCase() === value.toLowerCase()
            );
            if (!hasCat) return false;
          }
          if (key === 'price') {
            const p = event.priceValue || 0;
            if (value === 'free' && p !== 0) return false;
            if (value === 'low' && p > 5000) return false;
            if (value === 'medium' && (p < 5000 || p > 15000)) return false;
            if (value === 'high' && p < 15000) return false;
          }
        }
        return true;
      });
    }

    const sortMode = currentFilters['sort'];
    return [...result].sort((a, b) => {
      if (sortMode === 'popular') return (b.stats || 0) - (a.stats || 0);
      if (sortMode === 'soon') return (a.timestamp || 0) - (b.timestamp || 0);
      return (b.timestamp || 0) - (a.timestamp || 0);
    });
  }, [events, searchValue, currentFilters, isSearching, userAge]);

  const handleReset = () => {
    setSearchValue('');
    setCurrentFilters({});
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Поиск</Text>
        <View style={styles.headerButtonRight} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.light.primary]}
            tintColor={colors.light.primary}
          />
        }
      >
        <HeroSection
          searchPlaceholder="Поиск мероприятий..."
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          onSearchClear={() => setSearchValue('')}
          activeFilters={currentFilters}
          onApplyFilters={setCurrentFilters}
          autoApply={true}
          showApplyButton={false}
          compact={false}
        />

        <View style={styles.listContent}>
          <View style={styles.resHead}>
            <Text style={styles.resTitle}>
              {isSearching ? `Найдено: ${filteredEvents.length}` : 'Все мероприятия'}
            </Text>
            {isSearching && (
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetTxt}>Сбросить</Text>
              </TouchableOpacity>
            )}
          </View>

          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard
                key={event.id}
                {...event}
                style={styles.eventCardOverride}
                onPress={() => navigation.navigate('EventDetail', { ...event })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Ionicons
                  name={isSearching ? 'search-outline' : 'calendar-clear-outline'}
                  size={60}
                  color={colors.light.mutedForeground || colors.light.foreground}
                />
              </View>
              <Text style={styles.emptyTextTitle}>
                {isSearching ? 'Ничего не найдено' : 'Мероприятий пока нет'}
              </Text>
              <Text style={styles.emptyTextSub}>
                {isSearching
                  ? 'Попробуйте изменить поисковый запрос или фильтры'
                  : 'На данный момент список мероприятий пуст. Загляните позже!'}
              </Text>
            </View>
          )}
        </View>
        <View style={{ height: 60 }} />
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
    backgroundColor: colors.light.background,
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
  },
  container: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs, // Уменьшил отступ сверху (было sm)
    paddingBottom: 40,
  },
  resHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  resTitle: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  resetTxt: {
    color: colors.light.primary,
    fontWeight: '600',
    fontSize: typography.base,
  },
  eventCardOverride: { width: '100%', marginBottom: spacing.md },

  // Empty State Styles
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${colors.light.primary}08`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTextTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.foreground,
    marginBottom: 8,
  },
  emptyTextSub: {
    color: colors.light.mutedForeground || '#666',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 20,
  },
});
