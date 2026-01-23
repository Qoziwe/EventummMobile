import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
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
  icon: keyof typeof Ionicons.glyphMap; // ИСПРАВЛЕНО: Теперь ждем имя иконки, а не эмодзи
}

interface ProfileScreenProps {
  avatarInitials?: string;
  name?: string;
  email?: string;
  role?: string;
  subscriptionType?: string;
  subscriptionStatus?: 'free' | 'premium' | 'pro';
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
  onSubscriptionPress?: () => void;
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
  subscriptionStatus?: 'free' | 'premium' | 'pro';
  bio?: string;
  onEdit: () => void;
  onSubscriptionPress?: () => void;
}

function ProfileHeader({
  avatarInitials,
  name,
  email,
  role,
  subscriptionType,
  subscriptionStatus,
  bio,
  onEdit,
  onSubscriptionPress,
}: ProfileHeaderProps) {
  const showSubscription = subscriptionType !== '';
  const showSubscriptionBadge = subscriptionStatus && subscriptionStatus !== 'free';

  return (
    <View style={styles.profileHeaderContainer}>
      {/* Верхняя часть: Аватар и Инфо */}
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
                    {subscriptionStatus === 'premium' ? 'PREMIUM' : 'PRO'}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={styles.email}>{email}</Text>
          <Text style={styles.role}>{role}</Text>
        </View>
      </View>

      {/* Описание (Bio) - теперь на всю ширину */}
      {bio && (
        <View style={styles.bioContainer}>
          <Text style={styles.bioText}>{bio}</Text>
        </View>
      )}

      {/* Кнопка редактирования - теперь на всю ширину */}
      <TouchableOpacity style={styles.editButton} onPress={onEdit}>
        <Text style={styles.editButtonText}>Редактировать профиль</Text>
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

interface InterestTagsProps {
  interests: string[];
}

function InterestTags({ interests }: InterestTagsProps) {
  return (
    <View style={styles.interestsSection}>
      <Text style={styles.sectionTitle}>Интересы</Text>
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

interface ProfileSectionListProps {
  sections: ProfileSection[];
  onSectionPress?: (sectionId: string) => void;
}

function ProfileSectionList({ sections, onSectionPress }: ProfileSectionListProps) {
  return (
    <View style={styles.sectionsContainer}>
      {sections.map((section) => (
        <TouchableOpacity
          key={section.id}
          style={styles.sectionItem}
          onPress={() => onSectionPress?.(section.id)}
        >
          <View style={styles.sectionIconContainer}>
             <Ionicons name={section.icon} size={20} color={colors.light.primary} />
          </View>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.light.mutedForeground} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

// --------------------
// Основной компонент
// --------------------
export default function ProfileScreen(props: ProfileScreenProps) {
  const navigation = useNavigation();

  // Дефолтные значения
  const avatarInitials = props.avatarInitials || 'AJ';
  const name = props.name || 'Alex Johnson';
  const email = props.email || 'alex@example.com';
  const role = props.role || 'Пользователь';
  const subscriptionType = props.subscriptionType || '';
  const subscriptionStatus = props.subscriptionStatus || 'free';
  const bio = props.bio || 'Music lover, tech enthusiast, always looking for the next great event.';
  const interests = props.interests || [];
  const activeTab = props.activeTab || 'tickets';
  const hasTickets = props.hasTickets || false;

  const eventsAttended = props.eventsAttended || 24;
  const eventsSaved = props.eventsSaved || 12;
  const communitiesJoined = props.communitiesJoined || 5;

  // ИСПРАВЛЕНО: Используем имена иконок Ionicons вместо эмодзи
  const profileSections = props.profileSections || [
    { id: 'subscriptions', title: 'Подписки', icon: 'card-outline' },
    { id: 'saved_events', title: 'Сохраненные события', icon: 'bookmark-outline' },
    { id: 'my_communities', title: 'Мои сообщества', icon: 'people-outline' },
    { id: 'my_posts', title: 'Мои посты и комментарии', icon: 'chatbox-ellipses-outline' },
    { id: 'settings', title: 'Настройки', icon: 'settings-outline' },
  ];

  // Обработчики
  const handleBackPress = () => navigation.goBack();
  const openSettings = () => props.onSettings ? props.onSettings() : console.log('Settings');
  const editProfile = () => props.onEdit?.();
  const becomeOrganizer = () => props.onBecomeOrganizer?.();
  const exploreEvents = () => props.onExplore?.();
  const changeTabToTickets = () => props.onTabChange?.('tickets');
  const changeTabToFavorites = () => props.onTabChange?.('favorites');
  const handleSectionPress = (id: string) => props.onSectionPress?.(id);
  const handleSubscriptionPress = () => props.onSubscriptionPress ? props.onSubscriptionPress() : handleSectionPress('subscriptions');

  const interestStrings = interests.length > 0 
    ? interests.map(i => i.label) 
    : ['Music', 'Technology', 'Art', 'Food & Drink', 'Networking'];

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      {/* --- СТАНДАРТИЗИРОВАННЫЙ ХЕДЕР --- */}
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
        {/* Шапка профиля */}
        <ProfileHeader
          avatarInitials={avatarInitials}
          name={name}
          email={email}
          role={role}
          subscriptionType={subscriptionType}
          subscriptionStatus={subscriptionStatus}
          bio={bio}
          onEdit={editProfile}
          onSubscriptionPress={handleSubscriptionPress}
        />

        {/* Статистика */}
        <ProfileStats
          eventsAttended={eventsAttended}
          eventsSaved={eventsSaved}
          communitiesJoined={communitiesJoined}
        />

        {/* Интересы */}
        <InterestTags interests={interestStrings} />

        {/* Баннер организатора */}
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
            <Ionicons name="arrow-forward" size={16} color={colors.light.primaryForeground} />
          </TouchableOpacity>
        </View>

        {/* Секции (Меню) */}
        <ProfileSectionList
          sections={profileSections}
          onSectionPress={handleSectionPress}
        />

        {/* Табы */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'tickets' && styles.tabActive]} 
            onPress={changeTabToTickets}
          >
            <Text style={[styles.tabText, activeTab === 'tickets' && styles.tabTextActive]}>Мои билеты</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.tab, activeTab === 'favorites' && styles.tabActive]} 
            onPress={changeTabToFavorites}
          >
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.tabTextActive]}>Избранное</Text>
          </TouchableOpacity>
        </View>

        {/* Контент табов */}
        {hasTickets ? props.children : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="ticket-outline" size={48} color={colors.light.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>У вас пока нет билетов</Text>
            <Text style={styles.emptyDescription}>Начните исследовать мероприятия</Text>
            <TouchableOpacity style={styles.exploreButton} onPress={exploreEvents}>
              <Ionicons name="search" size={16} color={colors.light.primaryForeground} />
              <Text style={styles.exploreButtonText}>Найти мероприятия</Text>
            </TouchableOpacity>
          </View>
        )}

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
  
  // --- ЕДИНЫЕ СТИЛИ ХЕДЕРА ---
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
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
  // ---------------------------

  container: { flex: 1 },
  scrollContent: { paddingBottom: spacing['2xl'] },

  // --- Стили профиля (ИСПРАВЛЕНЫ) ---
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
  premiumBadge: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
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

  // Статистика
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
    // Тень
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
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

  // Интересы
  interestsSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
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

  // Баннер создателя
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
  creatorTitle: { fontSize: typography.base, fontWeight: '600', color: colors.light.foreground },
  creatorDescription: { fontSize: typography.sm, color: colors.light.mutedForeground, marginTop: 2 },
  creatorButton: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, backgroundColor: colors.light.primary, paddingVertical: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center' },
  creatorButtonText: { fontSize: typography.base, fontWeight: '600', color: colors.light.primaryForeground },

  // Список секций
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
  sectionTitle: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
    fontWeight: '500',
  },

  // Табы
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

  // Пустое состояние
  emptyState: { alignItems: 'center', padding: spacing['3xl'] },
  emptyIcon: { width: 80, height: 80, borderRadius: borderRadius.full, backgroundColor: colors.light.muted, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.lg },
  emptyTitle: { fontSize: typography.lg, fontWeight: '600', marginBottom: spacing.sm, color: colors.light.foreground, textAlign: 'center' },
  emptyDescription: { fontSize: typography.sm, color: colors.light.mutedForeground, marginBottom: spacing.lg, textAlign: 'center' },
  exploreButton: { flexDirection: 'row', gap: spacing.sm, backgroundColor: colors.light.primary, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, borderRadius: borderRadius.lg, alignItems: 'center' },
  exploreButtonText: { fontSize: typography.base, fontWeight: '600', color: colors.light.primaryForeground },
  bottomSpacer: { height: 24 },
});