import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { useEventStore } from '../store/eventStore';
import EventCard from '../components/EventCard';
import Header from '../components/Header';

export default function SavedEventsScreen() {
  const navigation = useNavigation<any>();
  const { user } = useUserStore();
  const { events, fetchEvents } = useEventStore();

  // Если вдруг события еще не загружены в глобальный стор, пробуем их подтянуть
  useEffect(() => {
    if (events.length === 0) {
      fetchEvents();
    }
  }, []);

  // Получаем список событий, которые есть в избранном у пользователя, фильтруя массив из стора
  const savedEvents = events.filter(event => user.savedEventIds.includes(event.id));

  const handleBack = () => navigation.goBack();

  return (
    <View style={styles.fullContainer}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <Header title="Сохраненные" showBack={true} onBackPress={handleBack} />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {savedEvents.length > 0 ? (
          <View style={styles.resultsWrapper}>
            <Text style={styles.resTitle}>
              У вас {savedEvents.length} сохраненных событий
            </Text>
            {savedEvents.map(event => (
              <EventCard
                key={event.id}
                {...event}
                style={styles.eventCardOverride}
                onPress={() => navigation.navigate('EventDetail', { ...event })}
              />
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="bookmark-outline"
                size={60}
                color={colors.light.mutedForeground}
              />
            </View>
            <Text style={styles.emptyTitle}>Список пуст</Text>
            <Text style={styles.emptyTxt}>Вы еще не сохранили ни одного события.</Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => navigation.navigate('MainTabs', { screen: 'Search' })}
            >
              <Text style={styles.exploreBtnText}>Найти что-нибудь</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: { flex: 1, backgroundColor: colors.light.background },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  resultsWrapper: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  resTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.mutedForeground,
    marginBottom: spacing.md,
    marginLeft: 4,
  },
  eventCardOverride: {
    width: '100%',
    marginBottom: spacing.md,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
    marginBottom: spacing.xs,
  },
  emptyTxt: {
    color: colors.light.mutedForeground,
    fontSize: typography.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  exploreBtn: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  exploreBtnText: {
    color: colors.light.primaryForeground,
    fontWeight: '700',
    fontSize: 15,
  },
});
