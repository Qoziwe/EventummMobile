import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius, typography } from '../theme/colors';

// --------------------
// Типы
// --------------------
interface InterestItem {
  id: string;
  label: string;
  icon: string;
}

interface StatItem {
  icon: keyof typeof Ionicons.glyphMap;
  value: string;
  label: string;
}

interface ProfileScreenProps {
  avatarInitials?: string;
  name?: string;
  email?: string;
  role?: string;
  subscriptionType?: string;
  interests?: InterestItem[];
  stats?: StatItem[];
  activeTab?: 'tickets' | 'favorites';
  onTabChange?: (tab: 'tickets' | 'favorites') => void;
  onSettings?: () => void;
  onEdit?: () => void;
  onBecomeOrganizer?: () => void;
  onExplore?: () => void;
  hasTickets?: boolean;
  children?: React.ReactNode;
}

export default function ProfileScreen(props: ProfileScreenProps) {
  // --------------------
  // Пропсы с дефолтами
  // --------------------
  const avatarInitials = props.avatarInitials || '';
  const name = props.name || '';
  const email = props.email || '';
  const role = props.role || '';
  const subscriptionType = props.subscriptionType || '';
  const interests = props.interests || [];
  const stats = props.stats || [];
  const activeTab = props.activeTab || 'tickets';
  const hasTickets = props.hasTickets || false;

  // --------------------
  // Обработчики
  // --------------------
  function openSettings() {
    if (props.onSettings) {
      props.onSettings();
    }
  }

  function editProfile() {
    if (props.onEdit) {
      props.onEdit();
    }
  }

  function becomeOrganizer() {
    if (props.onBecomeOrganizer) {
      props.onBecomeOrganizer();
    }
  }

  function exploreEvents() {
    if (props.onExplore) {
      props.onExplore();
    }
  }

  function changeTab(tab: 'tickets' | 'favorites') {
    if (props.onTabChange) {
      props.onTabChange(tab);
    }
  }

  // --------------------
  // Рендер
  // --------------------
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Профиль</Text>

          <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
            <Ionicons name="settings-outline" size={22} color={colors.light.foreground} />
          </TouchableOpacity>
        </View>

        {/* Profile info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarInitials}</Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{name}</Text>

              {subscriptionType !== '' ? (
                <View style={styles.subscriptionBadge}>
                  <Text style={styles.subscriptionText}>{subscriptionType}</Text>
                </View>
              ) : null}
            </View>

            <Text style={styles.email}>{email}</Text>
            <Text style={styles.role}>{role}</Text>
          </View>

          <TouchableOpacity style={styles.editButton} onPress={editProfile}>
            <Ionicons name="create-outline" size={16} color={colors.light.foreground} />
            <Text style={styles.editButtonText}>Редактировать</Text>
          </TouchableOpacity>
        </View>

        {/* Interests */}
        {interests.length > 0 ? (
          <View style={styles.interestsSection}>
            <View style={styles.interestsContainer}>
              {interests.map(function (interest) {
                return (
                  <View key={interest.id} style={styles.interestBadge}>
                    <Text>{interest.icon}</Text>
                    <Text style={styles.interestText}>{interest.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ) : null}

        {/* Stats */}
        {stats.length > 0 ? (
          <View style={styles.statsGrid}>
            {stats.map(function (stat, index) {
              return (
                <View key={index} style={styles.statCard}>
                  <Ionicons name={stat.icon} size={24} color={colors.light.primary} />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>
        ) : null}

        {/* Become organizer */}
        <View style={styles.creatorCard}>
          <View style={styles.creatorContent}>
            <View style={styles.creatorIcon}>
              <Ionicons name="sparkles" size={20} color={colors.light.primary} />
            </View>

            <View style={styles.creatorText}>
              <Text style={styles.creatorTitle}>Хотите создавать свои мероприятия?</Text>
              <Text style={styles.creatorDescription}>
                Станьте организатором и получите доступ к Creator Studio
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.creatorButton} onPress={becomeOrganizer}>
            <Text style={styles.creatorButtonText}>Стать организатором</Text>
            <Ionicons
              name="arrow-forward"
              size={16}
              color={colors.light.primaryForeground}
            />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'tickets' ? styles.tabActive : null]}
            onPress={() => changeTab('tickets')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'tickets' ? styles.tabTextActive : null,
              ]}
            >
              Мои билеты
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' ? styles.tabActive : null]}
            onPress={() => changeTab('favorites')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'favorites' ? styles.tabTextActive : null,
              ]}
            >
              Избранное
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content / Empty */}
        {hasTickets ? (
          props.children
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="ticket-outline"
                size={48}
                color={colors.light.mutedForeground}
              />
            </View>

            <Text style={styles.emptyTitle}>У вас пока нет билетов</Text>

            <Text style={styles.emptyDescription}>Начните исследовать мероприятия</Text>

            <TouchableOpacity style={styles.exploreButton} onPress={exploreEvents}>
              <Ionicons name="search" size={16} color={colors.light.primaryForeground} />
              <Text style={styles.exploreButtonText}>Найти мероприятия</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------
// Стили
// --------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  settingsButton: {
    padding: spacing.xs,
  },
  profileSection: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
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
  profileInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  subscriptionBadge: {
    backgroundColor: `${colors.categories.music}33`,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  subscriptionText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.categories.music,
  },
  email: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  role: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  editButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  editButtonText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  interestsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  interestBadge: {
    flexDirection: 'row',
    gap: spacing.xs,
    backgroundColor: colors.light.secondary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  interestText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
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
  },
  creatorCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    gap: spacing.lg,
  },
  creatorContent: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  creatorIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.lg,
    backgroundColor: `${colors.light.primary}10`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorTitle: {
    fontSize: typography.base,
    fontWeight: '600',
  },
  creatorDescription: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  creatorButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  creatorButtonText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.light.secondary,
  },
  tabText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  tabTextActive: {
    color: colors.light.foreground,
  },
  emptyState: {
    alignItems: 'center',
    padding: spacing['3xl'],
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.muted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginBottom: spacing.lg,
  },
  exploreButton: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.light.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  exploreButtonText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
});
