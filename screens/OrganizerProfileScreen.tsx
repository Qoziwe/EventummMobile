import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { useEventStore } from '../store/eventStore';
import { useToast } from '../components/ToastProvider';
import EventCard from '../components/EventCard';

// --------------------
// Вспомогательные компоненты (в стиле ProfileScreen)
// --------------------

interface ProfileHeaderProps {
  avatarInitials: string;
  name: string;
  location: string;
  role: string;
  bio?: string;
  onEdit: () => void;
}

function ProfileHeader({
  avatarInitials,
  name,
  location,
  role,
  bio,
  onEdit,
}: ProfileHeaderProps) {
  return (
    <View style={styles.profileHeaderContainer}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </View>

        <View style={styles.infoColumn}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            <View style={[styles.subscriptionBadge, styles.organizerBadge]}>
              <Text style={styles.organizerBadgeText}>CREATOR</Text>
            </View>
          </View>

          <Text style={styles.email}>{location}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>

      {bio ? (
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>Настроить профиль студии</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileStats({
  revenue,
  ticketsSold,
  totalViews,
}: {
  revenue: string;
  ticketsSold: number;
  totalViews: number;
}) {
  const stats = [
    {
      icon: 'cash-outline' as const,
      value: revenue,
      label: 'Баланс',
    },
    {
      icon: 'ticket-outline' as const,
      value: ticketsSold.toString(),
      label: 'Продано',
    },
    {
      icon: 'trending-up-outline' as const,
      value: totalViews.toString(),
      label: 'Охват',
    },
  ];

  return (
    <View style={styles.statsGrid}>
      {stats.map((stat, index) => (
        <View key={index} style={styles.statCard}>
          <Ionicons name={stat.icon} size={24} color={colors.light.primary} />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
}

function ProfileSectionList({
  sections,
  onSectionPress,
  onLogout,
}: {
  sections: any[];
  onSectionPress?: (id: string) => void;
  onLogout: () => void;
}) {
  return (
    <View style={styles.sectionsContainer}>
      {sections.map(section => (
        <TouchableOpacity
          key={section.id}
          style={styles.sectionItem}
          onPress={() => onSectionPress?.(section.id)}
        >
          <View style={styles.sectionIconContainer}>
            <Ionicons name={section.icon} size={20} color={colors.light.primary} />
          </View>
          <Text style={styles.menuItemText}>{section.title}</Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color={colors.light.mutedForeground}
          />
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.sectionItem, { borderBottomWidth: 0 }]}
        onPress={onLogout}
      >
        <View style={styles.sectionIconContainer}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </View>
        <Text style={[styles.menuItemText, { color: '#EF4444' }]}>Выйти из аккаунта</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function OrganizerProfileScreen({
  onSettings,
  onEdit,
}: {
  onSettings?: () => void;
  onEdit?: () => void;
}) {
  const navigation = useNavigation<any>();
  const { user, logout, clearAllData } = useUserStore();
  const { events } = useEventStore();
  const { showToast } = useToast();

  // Аналитика
  const myEvents = useMemo(
    () => events.filter(e => e.organizerId === user.id),
    [events, user.id]
  );

  const totalViews = useMemo(
    () => myEvents.reduce((acc, curr) => acc + (curr.stats || 0), 0),
    [myEvents]
  );

  const ticketsSold = useMemo(() => Math.floor(totalViews * 0.15), [totalViews]);

  const revenueFormatted = useMemo(() => {
    const rev = myEvents.reduce(
      (acc, curr) =>
        acc + (curr.priceValue || 0) * (ticketsSold / (myEvents.length || 1)),
      0
    );
    return `${Math.round(rev).toLocaleString()} ₸`;
  }, [myEvents, ticketsSold]);

  const studioTools = [
    { id: 'create', title: 'Опубликовать мероприятие', icon: 'add-circle-outline' },
    { id: 'analytics', title: 'Аналитика продаж', icon: 'bar-chart-outline' },
    { id: 'finance', title: 'Финансы и выплаты', icon: 'wallet-outline' },
    { id: 'audience', title: 'Управление аудиторией', icon: 'people-outline' },
  ];

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  const handleSectionPress = (id: string) => {
    if (id === 'create') {
      navigation.navigate('CreateEvent');
    } else {
      console.log('Tool:', id);
    }
  };

  const handleLogout = () => {
    logout();
    showToast({ message: 'Вы вышли из аккаунта', type: 'info' });
  };

  const handleSecretClear = () => {
    clearAllData();
    showToast({ message: 'Данные сброшены', type: 'success' });
  };

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonLeft} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Creator Studio</Text>

        <TouchableOpacity style={styles.headerButtonRight} onPress={onSettings}>
          <Ionicons name="settings-outline" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader
          avatarInitials={user.avatarInitials}
          name={user.name}
          location={user.location}
          role="Организатор мероприятий"
          bio={user.bio}
          onEdit={onEdit || (() => {})}
        />

        <ProfileStats
          revenue={revenueFormatted}
          ticketsSold={ticketsSold}
          totalViews={totalViews}
        />

        <View style={styles.toolHeader}>
          <Text style={styles.sectionHeaderTitle}>Инструменты студии</Text>
        </View>
        <ProfileSectionList
          sections={studioTools}
          onSectionPress={handleSectionPress}
          onLogout={handleLogout}
        />

        <View style={styles.publicationsHeader}>
          <Text style={styles.sectionHeaderTitle}>
            Мои публикации ({myEvents.length})
          </Text>
        </View>

        <View style={styles.eventsList}>
          {myEvents.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color={colors.light.mutedForeground}
              />
              <Text style={styles.emptyTitle}>У вас пока нет публикаций</Text>
              <Text style={styles.emptyDescription}>
                Создайте свое первое мероприятие, чтобы оно появилось здесь
              </Text>
            </View>
          ) : (
            myEvents.map(event => (
              <View key={event.id} style={styles.eventWrapper}>
                <EventCard
                  {...event}
                  style={styles.card}
                  onPress={() => navigation.navigate('EventDetail', { ...event })}
                />
                <View style={styles.eventStatsRow}>
                  <View style={styles.miniStat}>
                    <Ionicons
                      name="eye-outline"
                      size={14}
                      color={colors.light.mutedForeground}
                    />
                    <Text style={styles.miniStatText}>{event.stats || 0} просмотров</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('CreateEvent', { event })}
                    style={styles.editIconBtn}
                  >
                    <Ionicons
                      name="create-outline"
                      size={16}
                      color={colors.light.primary}
                    />
                    <Text style={styles.editText}>Редактировать</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.secretContainer}>
          <TouchableOpacity onPress={handleSecretClear} activeOpacity={0.7}>
            <Text style={styles.secretText}>v.1.0.4-production-build-stable-reset</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
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
  profileHeaderContainer: {
    padding: spacing.lg,
    backgroundColor: colors.light.background,
  },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography['2xl'],
    fontWeight: '600',
    color: colors.light.foreground,
  },
  infoColumn: { flex: 1, justifyContent: 'center' },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  name: { fontSize: typography.xl, fontWeight: '700', color: colors.light.foreground },
  subscriptionBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
  },
  organizerBadge: { backgroundColor: colors.light.primary },
  organizerBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.primaryForeground,
  },
  email: { fontSize: typography.sm, color: colors.light.mutedForeground, marginTop: 2 },
  role: { fontSize: typography.sm, color: colors.light.mutedForeground, marginTop: 2 },
  bioContainer: { marginTop: spacing.md },
  bioText: { fontSize: typography.base, color: colors.light.foreground, lineHeight: 20 },
  editButton: {
    marginTop: spacing.md,
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    elevation: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.foreground,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    marginTop: 2,
  },
  toolHeader: { paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  publicationsHeader: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionHeaderTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  sectionsContainer: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  sectionIconContainer: { width: 32, alignItems: 'flex-start' },
  menuItemText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.light.foreground,
    fontWeight: '600',
  },
  eventsList: { paddingHorizontal: spacing.lg },
  eventWrapper: {
    marginBottom: spacing.lg,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  card: { width: '100%', marginBottom: 0, borderWidth: 0, borderRadius: 0 },
  eventStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: `${colors.light.primary}05`,
  },
  miniStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  miniStatText: { fontSize: 12, color: colors.light.mutedForeground, fontWeight: '600' },
  editIconBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  editText: { fontSize: 12, color: colors.light.primary, fontWeight: '700' },
  emptyState: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.foreground,
    marginTop: 12,
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.light.mutedForeground,
    textAlign: 'center',
    marginTop: 4,
  },
  secretContainer: { marginTop: spacing['2xl'], alignItems: 'center', opacity: 0.3 },
  secretText: {
    fontSize: 10,
    color: colors.light.mutedForeground,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  bottomSpacer: { height: 40 },
});
