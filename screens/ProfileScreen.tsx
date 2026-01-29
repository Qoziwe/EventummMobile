import React, { useState } from 'react';
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
import { useUserStore } from '../store/userStore';
import { useEventStore } from '../store/eventStore';
import { useDiscussionStore } from '../store/discussionStore'; // Убедитесь, что этот импорт есть
import { useToast } from '../components/ToastProvider';

import FavoritesList from '../components/ProfileComponents/FavoritesList';
import TicketsList from '../components/ProfileComponents/TicketsList';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const { user, logout, clearAllData, becomeOrganizer } = useUserStore();
  const { clearAllEvents } = useEventStore();
  const { clearAllDiscussions } = useDiscussionStore(); // Подключаем метод
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'tickets' | 'favorites'>('tickets');

  const {
    avatarInitials,
    name,
    email,
    role,
    userType,
    subscriptionStatus,
    interests,
    stats,
    savedEventIds,
    purchasedTickets,
  } = user;

  const handleLogout = () => {
    logout();
    showToast({ message: 'Вы вышли из аккаунта', type: 'info' });
  };

  const handleBecomeOrganizer = () => {
    becomeOrganizer();
    showToast({ message: 'Теперь вы организатор!', type: 'success' });
  };

  const handleSecretClear = async () => {
    try {
      // Последовательно очищаем все хранилища
      await clearAllData();
      await clearAllEvents();
      await clearAllDiscussions();

      showToast({ message: 'Все данные (вкл. обсуждения) сброшены', type: 'success' });
    } catch (error) {
      showToast({ message: 'Ошибка при сбросе данных', type: 'error' });
    }
  };

  const menuItems = [
    {
      id: 'subscriptions',
      title: 'Подписки',
      icon: 'card-outline',
      screen: 'Subscriptions',
    },
    // Пункт только для исследователей
    ...(userType === 'explorer'
      ? [
          {
            id: 'followed_organizers',
            title: 'Мои авторы',
            icon: 'heart-outline',
            screen: 'FollowedOrganizers',
          },
        ]
      : []),
    {
      id: 'saved_events',
      title: 'Сохраненные события',
      icon: 'bookmark-outline',
      screen: 'SavedEvents',
    },
    {
      id: 'my_discussions',
      title: 'Мои обсуждения',
      icon: 'chatbubbles-outline',
      screen: 'Communities', // Здесь остается имя роута из App.tsx (Communities)
    },
    { id: 'settings', title: 'Настройки', icon: 'settings-outline', screen: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.fullContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Профиль</Text>
        <TouchableOpacity
          style={styles.headerBtn}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeaderContainer}>
          <View style={styles.topRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{avatarInitials}</Text>
            </View>
            <View style={styles.infoColumn}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>{name}</Text>
                {subscriptionStatus && subscriptionStatus !== 'none' && (
                  <View style={styles.premiumBadge}>
                    <Text style={styles.premiumText}>
                      {subscriptionStatus.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.email}>{email}</Text>
              <Text style={styles.role}>{role}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editButtonText}>Редактировать профиль</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={20} color={colors.light.primary} />
            <Text style={styles.statValue}>{purchasedTickets.length}</Text>
            <Text style={styles.statLabel}>Билетов</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="bookmark-outline" size={20} color={colors.light.primary} />
            <Text style={styles.statValue}>{savedEventIds.length}</Text>
            <Text style={styles.statLabel}>Сохранено</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="chatbubbles-outline" size={20} color={colors.light.primary} />
            <Text style={styles.statValue}>{stats.communitiesJoined}</Text>
            <Text style={styles.statLabel}>Обсуждения</Text>
          </View>
        </View>

        {userType === 'explorer' && (
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
        )}

        {userType !== 'organizer' && (
          <View style={styles.creatorCard}>
            <View style={styles.creatorContent}>
              <View style={styles.creatorIcon}>
                <Ionicons name="sparkles" size={18} color={colors.light.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.creatorTitle}>
                  Хотите создавать свои мероприятия?
                </Text>
                <Text style={styles.creatorDescription}>
                  Станьте организатором и получите доступ к Studio
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.creatorButton}
              onPress={handleBecomeOrganizer}
            >
              <Text style={styles.creatorButtonText}>Стать организатором</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionsContainer}>
          {menuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.sectionItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.sectionIconContainer}>
                <Ionicons
                  name={item.icon as any}
                  size={20}
                  color={colors.light.primary}
                />
              </View>
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.light.mutedForeground}
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.sectionItem, { borderBottomWidth: 0 }]}
            onPress={handleLogout}
          >
            <View style={styles.sectionIconContainer}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.menuItemText, { color: '#EF4444' }]}>
              Выйти из аккаунта
            </Text>
          </TouchableOpacity>
        </View>

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
              Сохраненное
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          {activeTab === 'tickets' ? <TicketsList /> : <FavoritesList />}
        </View>

        <TouchableOpacity onPress={handleSecretClear} style={styles.resetTrigger}>
          <Text style={styles.resetText}>v.1.0.4-production-reset</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
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
  headerBtn: { width: 40, height: 40, justifyContent: 'center' },
  headerTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  container: { flex: 1 },
  profileHeaderContainer: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '700' },
  infoColumn: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 18, fontWeight: '700' },
  premiumBadge: {
    backgroundColor: colors.light.primary,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  premiumText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  email: { color: colors.light.mutedForeground, fontSize: 13, marginTop: 1 },
  role: { color: colors.light.mutedForeground, fontSize: 11 },
  editButton: {
    marginTop: spacing.md,
    padding: 10,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
  },
  editButtonText: { fontWeight: '700', fontSize: 14 },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  statCard: {
    flex: 1,
    padding: spacing.sm,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  statValue: { fontSize: 16, fontWeight: '700', marginTop: 4 },
  statLabel: { fontSize: 11, color: colors.light.mutedForeground },
  interestsSection: { paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  sectionHeaderTitle: { fontSize: 16, fontWeight: '700', marginBottom: spacing.sm },
  interestsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  interestBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.light.secondary,
    borderRadius: 16,
  },
  interestText: { fontSize: 13, fontWeight: '500' },
  creatorCard: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  creatorContent: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  creatorIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${colors.light.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  creatorTitle: { fontSize: 13, fontWeight: '700' },
  creatorDescription: { fontSize: 11, color: colors.light.mutedForeground, marginTop: 1 },
  creatorButton: {
    backgroundColor: colors.light.foreground,
    padding: 12,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  creatorButtonText: { color: colors.light.background, fontWeight: '700', fontSize: 14 },
  sectionsContainer: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    overflow: 'hidden',
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  sectionIconContainer: { width: 28 },
  menuItemText: { flex: 1, fontWeight: '600', fontSize: 14 },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: 10,
    marginVertical: spacing.md,
  },
  tab: { flex: 1, padding: 10, borderRadius: borderRadius.lg, alignItems: 'center' },
  tabActive: { backgroundColor: colors.light.secondary },
  tabText: { fontWeight: '500', color: colors.light.mutedForeground, fontSize: 13 },
  tabTextActive: { color: colors.light.foreground, fontWeight: '700' },
  resetTrigger: { marginTop: 30, alignItems: 'center', opacity: 0.15 },
  resetText: { fontSize: 9 },
});
