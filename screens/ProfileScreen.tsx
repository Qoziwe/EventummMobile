import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
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

interface ProfileSection {
  id: string;
  title: string;
  icon: string;
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
  bio?: string;
  eventsAttended?: number;
  eventsSaved?: number;
  communitiesJoined?: number;
  profileSections?: ProfileSection[];
  onTabChange?: (tab: 'tickets' | 'favorites') => void;
  onSettings?: () => void;
  onEdit?: () => void;
  onBecomeOrganizer?: () => void;
  onExplore?: () => void;
  onSectionPress?: (sectionId: string) => void;
  hasTickets?: boolean;
  children?: React.ReactNode;
}

// --------------------
// Компоненты
// --------------------

interface ProfileHeaderProps {
  avatarInitials: string;
  name: string;
  email: string;
  role: string;
  subscriptionType: string;
  bio?: string;
  onEdit: () => void;
}

function ProfileHeader({
  avatarInitials,
  name,
  email,
  role,
  subscriptionType,
  bio,
  onEdit,
}: ProfileHeaderProps) {
  const showSubscription = subscriptionType !== '';

  return (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{avatarInitials}</Text>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{name}</Text>

          {showSubscription && (
            <View style={styles.subscriptionBadge}>
              <Text style={styles.subscriptionText}>{subscriptionType}</Text>
            </View>
          )}
        </View>

        <Text style={styles.email}>{email}</Text>
        <Text style={styles.role}>{role}</Text>
        {bio && <Text style={styles.bioText}>{bio}</Text>}
      </View>

      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Ionicons name="create-outline" size={16} color={colors.light.foreground} />
        <Text style={styles.editButtonText}>Редактировать</Text>
      </TouchableOpacity>
    </View>
  );
}

interface ProfileStatsProps {
  eventsAttended: number;
  eventsSaved: number;
  communitiesJoined: number;
}

function ProfileStats({
  eventsAttended,
  eventsSaved,
  communitiesJoined,
}: ProfileStatsProps) {
  const stats = [
    {
      icon: 'calendar-outline' as const,
      value: eventsAttended.toString(),
      label: 'Посетил',
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

  const statCards = stats.map(function (stat, index) {
    return (
      <View key={index} style={styles.statCard}>
        <Ionicons name={stat.icon} size={24} color={colors.light.primary} />
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    );
  });

  return <View style={styles.statsGrid}>{statCards}</View>;
}

interface InterestTagsProps {
  interests: string[];
}

function InterestTags({ interests }: InterestTagsProps) {
  const interestBadges = interests.map(function (interest, index) {
    return (
      <View key={index} style={styles.interestBadge}>
        <Text style={styles.interestText}>{interest}</Text>
      </View>
    );
  });

  return (
    <View style={styles.interestsSection}>
      <Text style={styles.sectionTitle}>Интересы</Text>
      <View style={styles.interestsContainer}>{interestBadges}</View>
    </View>
  );
}

interface ProfileSectionListProps {
  sections: ProfileSection[];
  onSectionPress?: (sectionId: string) => void;
}

function ProfileSectionList({ sections, onSectionPress }: ProfileSectionListProps) {
  const sectionItems = sections.map(function (section) {
    function handleSectionPress() {
      if (onSectionPress) {
        onSectionPress(section.id);
      }
    }

    return (
      <TouchableOpacity
        key={section.id}
        style={styles.sectionItem}
        onPress={handleSectionPress}
      >
        <Text style={styles.sectionIcon}>{section.icon}</Text>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.light.mutedForeground} />
      </TouchableOpacity>
    );
  });

  return <View style={styles.sectionsContainer}>{sectionItems}</View>;
}

// --------------------
// Основной компонент
// --------------------
export default function ProfileScreen(props: ProfileScreenProps) {
  const navigation = useNavigation();

  // --------------------
  // Пропсы с дефолтами
  // --------------------
  const avatarInitials = props.avatarInitials || '';
  const name = props.name || '';
  const email = props.email || '';
  const role = props.role || '';
  const subscriptionType = props.subscriptionType || '';
  const bio = props.bio || '';
  const interests = props.interests || [];
  const stats = props.stats || [];
  const activeTab = props.activeTab || 'tickets';
  const hasTickets = props.hasTickets || false;

  const eventsAttended = props.eventsAttended || 0;
  const eventsSaved = props.eventsSaved || 0;
  const communitiesJoined = props.communitiesJoined || 0;

  const profileSections = props.profileSections || [
    { id: 'saved_events', title: 'Saved Events', icon: '🎫' },
    { id: 'my_communities', title: 'My Communities', icon: '👥' },
    { id: 'my_posts', title: 'My Posts & Comments', icon: '💬' },
    { id: 'settings', title: 'Settings', icon: '⚙️' },
  ];

  // --------------------
  // Обработчики
  // --------------------
  function handleBackPress() {
    navigation.goBack();
  }

  function openSettings() {
    if (props.onSettings) {
      props.onSettings();
    } else {
      console.log('Нажата кнопка настроек (обработчик не предоставлен)');
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

  function changeTabToTickets() {
    if (props.onTabChange) {
      props.onTabChange('tickets');
    }
  }

  function changeTabToFavorites() {
    if (props.onTabChange) {
      props.onTabChange('favorites');
    }
  }

  function handleSectionPress(sectionId: string) {
    if (props.onSectionPress) {
      props.onSectionPress(sectionId);
    }
  }

  // --------------------
  // Подготовка данных
  // --------------------
  function prepareInterestStrings() {
    if (interests.length > 0) {
      return interests.map(function (interest) {
        return interest.label;
      });
    } else {
      return ['Music', 'Technology', 'Art', 'Food & Drink', 'Networking'];
    }
  }

  function prepareDisplayStats() {
    if (stats.length > 0) {
      return stats;
    } else {
      return [
        {
          icon: 'calendar-outline' as const,
          value: eventsAttended.toString(),
          label: 'Посетил',
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
    }
  }

  const interestStrings = prepareInterestStrings();
  const displayStats = prepareDisplayStats();

  const hasStats = displayStats.length > 0;
  const hasInterests = interestStrings.length > 0;

  // --------------------
  // Определение стилей табов
  // --------------------
  const ticketsTabStyle = [styles.tab];
  const favoritesTabStyle = [styles.tab];
  const ticketsTextStyle = [styles.tabText];
  const favoritesTextStyle = [styles.tabText];

  if (activeTab === 'tickets') {
    ticketsTabStyle.push(styles.tabActive);
    ticketsTextStyle.push(styles.tabTextActive);
  }

  if (activeTab === 'favorites') {
    favoritesTabStyle.push(styles.tabActive);
    favoritesTextStyle.push(styles.tabTextActive);
  }

  // --------------------
  // Рендер контента
  // --------------------
  function renderContent() {
    if (hasTickets) {
      return props.children;
    } else {
      return (
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
      );
    }
  }

  // --------------------
  // Рендер
  // --------------------
  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      {/* Шапка как в SearchScreen */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Профиль</Text>
        <TouchableOpacity style={styles.settingsButton} onPress={openSettings}>
          <Ionicons name="settings-outline" size={22} color={colors.light.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Информация профиля */}
        <ProfileHeader
          avatarInitials={avatarInitials}
          name={name}
          email={email}
          role={role}
          subscriptionType={subscriptionType}
          bio={bio}
          onEdit={editProfile}
        />

        {/* Статистика */}
        {hasStats && (
          <ProfileStats
            eventsAttended={eventsAttended}
            eventsSaved={eventsSaved}
            communitiesJoined={communitiesJoined}
          />
        )}

        {/* Интересы */}
        {hasInterests && <InterestTags interests={interestStrings} />}

        {/* Стать организатором */}
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

        {/* Секции профиля */}
        <ProfileSectionList
          sections={profileSections}
          onSectionPress={handleSectionPress}
        />

        {/* Табы */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity style={ticketsTabStyle} onPress={changeTabToTickets}>
            <Text style={ticketsTextStyle}>Мои билеты</Text>
          </TouchableOpacity>

          <TouchableOpacity style={favoritesTabStyle} onPress={changeTabToFavorites}>
            <Text style={favoritesTextStyle}>Избранное</Text>
          </TouchableOpacity>
        </View>

        {/* Контент */}
        {renderContent()}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------
// Стили
// --------------------
const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  // Шапка как в SearchScreen
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  backButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
    textAlign: 'center',
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
    marginTop: 2,
  },
  role: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginTop: 2,
  },
  bioText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginTop: spacing.sm,
  },
  editButton: {
    flexDirection: 'row',
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    height: 36,
    alignSelf: 'flex-start',
  },
  editButtonText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  interestsSection: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  interestsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
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
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
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
  creatorText: {
    flex: 1,
  },
  creatorTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  creatorDescription: {
    fontSize: typography.sm,
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
  },
  creatorButtonText: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
  sectionsContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
    fontWeight: '500',
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
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
    color: colors.light.foreground,
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
  bottomSpacer: {
    height: 24,
  },
});
