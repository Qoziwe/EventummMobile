import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { colors, spacing, borderRadius, typography } from '../theme/colors';

import {
  BillingToggle,
  type BillingPeriod,
} from '../components/SubsComponents/BillingToggle';
import { PlanCard, type Plan } from '../components/SubsComponents/PlanCard';

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Базовый доступ',
    monthlyPrice: 0,
    yearlyPrice: 0,
    iconType: 'free',
    features: [
      { text: 'Просмотр мероприятий', included: true },
      { text: 'Покупка билетов', included: true },
      { text: 'Сохранение событий', included: true },
      { text: 'Базовый профиль', included: true },
      { text: 'Друзья и чат', included: false },
      { text: 'Поиск компаньонов', included: false },
    ],
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Общение и друзья',
    monthlyPrice: 2990,
    yearlyPrice: 29900,
    iconType: 'community',
    recommended: true,
    features: [
      { text: 'Всё из Free', included: true },
      { text: 'Друзья и чат', included: true },
      { text: 'Статус активности', included: true },
      { text: 'Поиск компаньонов', included: true },
      { text: 'Сообщества', included: true },
      { text: 'VIP мероприятия', included: false },
    ],
  },
  {
    id: 'vip',
    name: 'VIP',
    description: 'Максимум возможностей',
    monthlyPrice: 7990,
    yearlyPrice: 79900,
    iconType: 'vip',
    features: [
      { text: 'Всё из Community', included: true },
      { text: 'Без сервисных сборов', included: true },
      { text: 'Приоритетное бронирование', included: true },
      { text: 'VIP мероприятия', included: true },
      { text: 'Скидки до 20%', included: true },
    ],
  },
];

const CURRENT_PLAN_ID = 'free';

export function SubscriptionsScreen() {
  const navigation = useNavigation();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('1month');

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSelectPlan = (planId: string) => {
    // plan selected: handle accordingly
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButtonLeft}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Подписки</Text>

        <View style={styles.headerButtonRight} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Выберите план</Text>
            <Text style={styles.subtitle}>Откройте все возможности приложения</Text>
          </View>

          <BillingToggle value={billingPeriod} onChange={setBillingPeriod} />

          <View style={styles.plansSection}>
            <Text style={styles.sectionTitle}>Тарифы</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.plansContainer}
              snapToInterval={300 + spacing.md}
              decelerationRate="fast"
            >
              {PLANS.map(plan => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  billingPeriod={billingPeriod}
                  isCurrentPlan={plan.id === CURRENT_PLAN_ID}
                  onSelect={handleSelectPlan}
                />
              ))}
            </ScrollView>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoIcon}>
              <Ionicons
                name="information-circle"
                size={24}
                color={colors.light.primary}
              />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Как работает подписка</Text>
              <Text style={styles.infoText}>
                Подписка продлевается автоматически. Отменить можно в любой момент в
                настройках.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
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
  content: { flex: 1 },
  titleSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.foreground,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.base,
    color: colors.light.mutedForeground,
    textAlign: 'center',
  },
  plansSection: { paddingTop: spacing.lg },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  plansContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  infoCard: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  infoIcon: { alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoTitle: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: 4,
  },
  infoText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    lineHeight: 18,
  },
});
