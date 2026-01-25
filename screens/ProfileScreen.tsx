import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { useUserStore } from '../store/userStore';
import { useEventStore } from '../store/eventStore'; // Добавлен импорт
import { useToast } from '../components/ToastProvider';

// Импорт новых компонентов списка
import FavoritesList from '../components/ProfileComponents/FavoritesList';
import TicketsList from '../components/ProfileComponents/TicketsList';

// --------------------
// Типы
// --------------------
interface ProfileSection {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

interface ProfileScreenProps {
  activeTab?: 'tickets' | 'favorites';
  profileSections?: ProfileSection[];
  onTabChange?: (tab: 'tickets' | 'favorites') => void;
  onSettings?: () => void;
  onEdit?: () => void;
  onBecomeOrganizer?: () => void;
  onSectionPress?: (sectionId: string) => void;
  onSubscriptionPress?: () => void;
}

// --------------------
// Вспомогательные компоненты
// --------------------

interface ProfileHeaderProps {
  avatarInitials: string;
  name: string;
  email: string;
  role: string;
  subscriptionStatus?: 'none' | 'basic' | 'premium';
  bio?: string;
  onEdit: () => void;
  onSubscriptionPress?: () => void;
}

function ProfileHeader({
  avatarInitials,
  name,
  email,
  role,
  subscriptionStatus,
  bio,
  onEdit,
  onSubscriptionPress,
}: ProfileHeaderProps) {
  const showSubscriptionBadge = subscriptionStatus && subscriptionStatus !== 'none';

  return (
    <View style={styles.profileHeaderContainer}>
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </View>

        <View style={styles.infoColumn}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {showSubscriptionBadge && (
              <TouchableOpacity onPress={onSubscriptionPress}>
                <View style={[styles.subscriptionBadge, styles.premiumBadge]}>
                  <Text style={styles.premiumText}>
                    {subscriptionStatus === 'premium' ? 'PREMIUM' : 'BASIC'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.email}>{email}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>

      {bio ? (
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      ) : null}

      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>Редактировать профиль</Text>
      </TouchableOpacity>
    </View>
  );
}

function ProfileStats({
  eventsAttended,
  eventsSaved,
  communitiesJoined,
}: {
  eventsAttended: number;
  eventsSaved: number;
  communitiesJoined: number;
}) {
  const stats = [
    {
      icon: 'calendar-outline' as const,
      value: eventsAttended.toString(),
      label: 'Билетов',
    },
    {
      icon: 'bookmark-outline' as const,
      value: eventsSaved.toString(),
      label: 'Сохранено',
    },
    {
      icon: 'people-outline' as const,
      value: communitiesJoined.toString(),
      label: 'Сообщества',
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

function InterestTags({ interests }: { interests: string[] }) {
  return (
    <View style={styles.interestsSection}>
      <Text style={styles.sectionHeaderTitle}>Интересы</Text>
      <View style={styles.interestsContainer}>
        {interests.map((interest, index) => (
          <View key={index} style={styles.interestBadge}>
            <Text style={styles.interestText}>{interest}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function ProfileSectionList({
  sections,
  onSectionPress,
  onLogout,
}: {
  sections: ProfileSection[];
  onSectionPress?: (sectionId: string) => void;
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

export default function ProfileScreen(props: ProfileScreenProps) {
  const navigation = useNavigation<any>();
  const { user, logout, clearAllData, becomeOrganizer } = useUserStore();
  const { clearAllEvents } = useEventStore(); // Деструктуризация метода очистки событий
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'tickets' | 'favorites'>(
    props.activeTab || 'tickets'
  );

  const {
    avatarInitials,
    name,
    email,
    role,
    userType,
    subscriptionStatus,
    bio,
    interests,
    stats,
    savedEventIds,
    purchasedTickets,
  } = user;

  const profileSections = props.profileSections || [
    { id: 'subscriptions', title: 'Подписки', icon: 'card-outline' },
    { id: 'saved_events', title: 'Сохраненные события', icon: 'bookmark-outline' },
    { id: 'my_communities', title: 'Мои сообщества', icon: 'people-outline' },
    {
      id: 'my_posts',
      title: 'Мои посты и комментарии',
      icon: 'chatbox-ellipses-outline',
    },
    { id: 'settings', title: 'Настройки', icon: 'settings-outline' },
  ];

  const handleBackPress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('MainTabs', { screen: 'Home' });
    }
  };

  const openSettings = () =>
    props.onSettings ? props.onSettings() : console.log('Settings');
  const editProfile = () => props.onEdit?.();

  const handleBecomeOrganizer = () => {
    becomeOrganizer();
    showToast({
      message: 'Поздравляем! Теперь вы организатор.',
      type: 'success',
    });
  };

  const handleSectionPress = (id: string) => {
    if (id === 'saved_events') {
      navigation.navigate('SavedEvents');
      return;
    }
    props.onSectionPress?.(id);
  };

  const handleSubscriptionPress = () =>
    props.onSubscriptionPress
      ? props.onSubscriptionPress()
      : handleSectionPress('subscriptions');

  const handleLogout = () => {
    const performLogout = () => {
      logout();
      showToast({ message: 'Вы вышли из аккаунта', type: 'info' });
    };

    if (Platform.OS === 'web') {
      const confirmed = window.confirm('Вы уверены, что хотите выйти из аккаунта?');
      if (confirmed) performLogout();
    } else {
      performLogout();
    }
  };

  const handleSecretClear = async () => {
    const performClear = async () => {
      await clearAllData();
      await clearAllEvents(); // Теперь события тоже очищаются
      showToast({ message: 'Все данные успешно сброшены', type: 'success' });
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Это удалит все локальные данные. Продолжить?')) {
        await performClear();
      }
    } else {
      await performClear();
    }
  };

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButtonLeft} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Профиль</Text>

        <TouchableOpacity style={styles.headerButtonRight} onPress={openSettings}>
          <Ionicons name="settings-outline" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ProfileHeader
          avatarInitials={avatarInitials}
          name={name}
          email={email}
          role={role}
          subscriptionStatus={subscriptionStatus}
          bio={bio}
          onEdit={editProfile}
          onSubscriptionPress={handleSubscriptionPress}
        />

        <ProfileStats
          eventsAttended={purchasedTickets.length}
          eventsSaved={savedEventIds.length}
          communitiesJoined={stats.communitiesJoined}
        />

        <InterestTags interests={interests} />

        {userType !== 'organizer' && (
          <View style={styles.creatorCard}>
            <View style={styles.creatorContent}>
              <View style={styles.creatorIcon}>
                <Ionicons name="sparkles" size={20} color={colors.light.primary} />
              </View>
              <View style={styles.creatorText}>
                <Text style={styles.creatorTitle}>
                  Хотите создавать свои мероприятия?
                </Text>
                <Text style={styles.creatorDescription}>
                  Станьте организатором и получите доступ к Creator Studio
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.creatorButton}
              onPress={handleBecomeOrganizer}
            >
              <Text style={styles.creatorButtonText}>Стать организатором</Text>
              <Ionicons
                name="arrow-forward"
                size={16}
                color={colors.light.primaryForeground}
              />
            </TouchableOpacity>
          </View>
        )}

        <ProfileSectionList
          sections={profileSections}
          onSectionPress={handleSectionPress}
          onLogout={handleLogout}
        />

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tickets' && styles.tabActive]}
            onPress={() => setActiveTab('tickets')}
          >
            <Text
              style={[styles.tabText, activeTab === 'tickets' && styles.tabTextActive]}
            >
              Мои билеты
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.tabActive]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text
              style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}
            >
              Избранное
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'tickets' ? <TicketsList /> : <FavoritesList />}

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
  fullContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
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
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  container: { flex: 1 },
  scrollContent: { paddingBottom: spacing['2xl'] },
  profileHeaderContainer: {
    padding: spacing.lg,
    backgroundColor: colors.light.background,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
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
  infoColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  subscriptionBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
  },
  premiumBadge: {
    backgroundColor: colors.light.primary,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.primaryForeground,
  },
  email: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginTop: 2,
  },
  role: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginTop: 2,
  },
  bioContainer: {
    marginTop: spacing.md,
  },
  bioText: {
    fontSize: typography.base,
    color: colors.light.foreground,
    lineHeight: 20,
  },
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
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    marginTop: 2,
  },
  interestsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionHeaderTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: spacing.sm,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestBadge: {
    backgroundColor: colors.light.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  interestText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  creatorCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  creatorContent: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  creatorIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: `${colors.light.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorText: { flex: 1 },
  creatorTitle: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  creatorDescription: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    marginTop: 2,
  },
  creatorButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  creatorButtonText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.light.primaryForeground,
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
  sectionIconContainer: {
    width: 32,
    alignItems: 'flex-start',
  },
  menuItemText: {
    flex: 1,
    fontSize: typography.sm,
    color: colors.light.foreground,
    fontWeight: '600',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  tabActive: {
    backgroundColor: colors.light.secondary,
  },
  tabText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    fontWeight: '500',
  },
  tabTextActive: {
    color: colors.light.foreground,
    fontWeight: '600',
  },
  secretContainer: {
    marginTop: spacing['2xl'],
    alignItems: 'center',
    opacity: 0.3,
  },
  secretText: {
    fontSize: 10,
    color: colors.light.mutedForeground,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  bottomSpacer: { height: 40 },
});
