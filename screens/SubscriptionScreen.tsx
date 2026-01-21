import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
// !!! ИЗМЕНЕНИЕ: Импортируем SafeAreaView из правильной библиотеки, как в CommunitiesScreen
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Подключаем тему
import { colors, spacing, borderRadius, typography } from '../theme/colors';

// Импорт компонентов
import {
  BillingToggle,
  type BillingPeriod,
} from '../components/SubsComponents/BillingToggle';
import { PlanCard, type Plan } from '../components/SubsComponents/PlanCard';

// Данные планов
const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Базовый доступ к платформе',
    monthlyPrice: 0,
    yearlyPrice: 0,
    iconType: 'free',
    features: [
      { text: 'Просмотр всех мероприятий', included: true },
      { text: 'Покупка билетов', included: true },
      { text: 'Сохранение мероприятий', included: true },
      { text: 'Базовый профиль', included: true },
      { text: 'Друзья и чат', included: false },
      { text: 'Статус активности друзей', included: false },
      { text: 'Поиск компаньонов', included: false },
      { text: 'Без сервисных сборов', included: false },
      { text: 'Приоритетное бронирование', included: false },
      { text: 'VIP мероприятия', included: false },
    ],
  },
  {
    id: 'community',
    name: 'Community',
    description: 'Общайтесь и находите компаньонов',
    monthlyPrice: 2990,
    yearlyPrice: 29900,
    iconType: 'community',
    recommended: true,
    features: [
      { text: 'Всё из Free', included: true },
      { text: 'Друзья и чат', included: true },
      { text: 'Статус активности друзей', included: true },
      { text: 'Поиск компаньонов', included: true },
      { text: 'Сообщества по интересам', included: true },
      { text: 'Без сервисных сборов', included: false },
      { text: 'Приоритетное бронирование', included: false },
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
      { text: 'Доступ к VIP мероприятиям', included: true },
      { text: 'Ранний доступ к билетам', included: true },
      { text: 'Скидки до 20%', included: true },
      { text: 'VIP поддержка', included: true },
    ],
  },
];

const CURRENT_PLAN_ID = 'free';

export function SubscriptionsScreen() {
  const navigation = useNavigation();
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('1month');

  // Скрываем нативный хедер навигации
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  function handleBackPress() {
    navigation.goBack();
  }

  const handleSelectPlan = (planId: string) => {
    console.log('Selected plan:', planId, 'Billing:', billingPeriod);
  };

  return (
    // !!! ИЗМЕНЕНИЕ: Добавляем edges={['top']}, чтобы отступить от статус-бара
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.light.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Подписки</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Выберите план</Text>
            <Text style={styles.subtitle}>План, который подходит именно вам</Text>
          </View>

          <BillingToggle value={billingPeriod} onChange={setBillingPeriod} />

          <View style={styles.plansSection}>
            <Text style={styles.sectionTitle}>Доступные тарифы</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.plansContainer}
              snapToInterval={296}
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
                Подписка продлевается автоматически. Отменить можно в любой момент.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
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
  headerSpacer: {
    width: 40,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing['2xl'],
  },
  content: {
    flex: 1,
  },
  titleSection: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography['2xl'],
    fontWeight: '700',
    color: colors.light.foreground,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.base,
    color: colors.light.mutedForeground,
    lineHeight: 20,
  },
  plansSection: {
    paddingTop: spacing.lg,
  },
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
  infoIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
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
