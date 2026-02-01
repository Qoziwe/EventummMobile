import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme/colors';
import type { BillingPeriod } from './BillingToggle';

// --- Компонент строки фичи ---
const FeatureItem = ({ text, included }: { text: string; included: boolean }) => (
  <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 }}>
    <Ionicons
      name={included ? 'checkmark-circle' : 'close-circle'}
      size={18}
      color={included ? colors.light.primary : colors.light.muted}
      style={{ marginRight: 8, marginTop: 1 }}
    />
    <Text
      style={{
        fontSize: 13,
        color: included ? colors.light.foreground : colors.light.mutedForeground,
        flex: 1,
        lineHeight: 18,
        textDecorationLine: included ? 'none' : 'line-through',
      }}
    >
      {text}
    </Text>
  </View>
);

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: PlanFeature[];
  recommended?: boolean;
  iconType: 'free' | 'community' | 'vip';
}

interface PlanCardProps {
  plan: Plan;
  billingPeriod: BillingPeriod;
  isCurrentPlan: boolean;
  onSelect: (planId: string) => void;
}

const calculatePrice = (monthlyPrice: number, billingPeriod: BillingPeriod): number => {
  if (monthlyPrice === 0) return 0;
  switch (billingPeriod) {
    case '1month':
      return monthlyPrice;
    case '3months':
      return Math.round(monthlyPrice * 3 * 0.93);
    case '6months':
      return Math.round(monthlyPrice * 6 * 0.87);
    case 'yearly':
      return Math.round(monthlyPrice * 12 * 0.8);
    default:
      return monthlyPrice;
  }
};

export function PlanCard({
  plan,
  billingPeriod,
  isCurrentPlan,
  onSelect,
}: PlanCardProps) {
  const price = calculatePrice(plan.monthlyPrice, billingPeriod);
  const isFree = plan.id === 'free';

  // Иконки вместо эмодзи
  const getIconContent = () => {
    switch (plan.iconType) {
      case 'free':
        return { icon: 'ticket-outline', bg: '#007AFF' };
      case 'community':
        return { icon: 'people-outline', bg: '#34C759' };
      case 'vip':
        return { icon: 'star-outline', bg: '#FF9500' };
      default:
        return { icon: 'cube-outline', bg: '#007AFF' };
    }
  };

  const iconData = getIconContent();

  return (
    <View style={[styles.container, plan.recommended && styles.containerRecommended]}>
      {plan.recommended && (
        <View style={styles.recommendedBadge}>
          <Text style={styles.recommendedText}>Рекомендуем</Text>
        </View>
      )}

      {/* Иконка */}
      <View style={[styles.iconBox, { backgroundColor: iconData.bg }]}>
        <Ionicons name={iconData.icon as any} size={32} color="#FFFFFF" />
      </View>

      <Text style={styles.planName}>{plan.name}</Text>
      <Text style={styles.description}>{plan.description}</Text>

      {/* Цена */}
      <View style={styles.priceContainer}>
        {isFree ? (
          <Text style={styles.freePrice}>Бесплатно</Text>
        ) : (
          <View style={styles.priceRow}>
            <Text style={styles.currency}>₸</Text>
            <Text style={styles.priceAmount}>{price.toLocaleString('ru-RU')}</Text>
          </View>
        )}
      </View>

      {/* Фичи */}
      <View style={styles.featuresContainer}>
        {plan.features.map((feature, index) => (
          <FeatureItem key={index} text={feature.text} included={feature.included} />
        ))}
      </View>

      {/* Кнопка */}
      <View style={{ marginTop: 'auto' }}>
        <TouchableOpacity
          style={[
            styles.button,
            isCurrentPlan && styles.buttonCurrent,
            plan.recommended && !isCurrentPlan && styles.buttonRecommended,
          ]}
          onPress={() => onSelect(plan.id)}
          activeOpacity={0.8}
          disabled={isCurrentPlan}
        >
          <Text
            style={[
              styles.buttonText,
              isCurrentPlan && styles.buttonTextCurrent,
              plan.recommended && !isCurrentPlan && styles.buttonTextRecommended,
            ]}
          >
            {isCurrentPlan ? 'Текущий план' : 'Выбрать план'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    width: 280,
    marginRight: spacing.md,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 3,
  },
  containerRecommended: {
    borderColor: colors.light.primary,
    borderWidth: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: colors.light.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    zIndex: 10,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.primaryForeground,
    textTransform: 'uppercase',
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    marginTop: spacing.xs,
  },
  planName: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: colors.light.mutedForeground,
    marginBottom: spacing.lg,
    lineHeight: 18,
    minHeight: 36,
  },
  priceContainer: {
    marginBottom: spacing.lg,
    height: 40,
    justifyContent: 'center',
  },
  freePrice: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  currency: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.light.foreground,
    marginRight: 2,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  featuresContainer: {
    marginBottom: spacing.xl,
  },
  button: {
    backgroundColor: colors.light.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  buttonCurrent: {
    backgroundColor: colors.light.secondary,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  buttonRecommended: {
    backgroundColor: colors.light.primary,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
  buttonTextCurrent: {
    color: colors.light.mutedForeground,
  },
  buttonTextRecommended: {
    color: colors.light.primaryForeground,
  },
});
