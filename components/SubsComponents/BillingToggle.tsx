import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography } from '../../theme/colors';

export type BillingPeriod = '1month' | '3months' | '6months' | 'yearly';

interface BillingToggleProps {
  value: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
}

interface BillingOption {
  period: BillingPeriod;
  label: string;
  discount?: string;
}

const BILLING_OPTIONS: BillingOption[] = [
  { period: '1month', label: '1 месяц' },
  { period: '3months', label: '3 месяца', discount: '-7%' },
  { period: '6months', label: '6 месяцев', discount: '-13%' },
  { period: 'yearly', label: '1 год', discount: '-20%' },
];

export function BillingToggle({ value, onChange }: BillingToggleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.optionsRow}>
        {BILLING_OPTIONS.map(option => {
          const isActive = value === option.period;

          return (
            <TouchableOpacity
              key={option.period}
              style={[styles.option, isActive && styles.optionActive]}
              onPress={() => onChange(option.period)}
              activeOpacity={0.7}
            >
              <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                {option.label}
              </Text>
              {option.discount && (
                <View style={[styles.discountBadge, isActive && styles.discountBadgeActive]}>
                  <Text style={styles.discountText}>{option.discount}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.light.background,
  },
  optionsRow: {
    flexDirection: 'row',
    backgroundColor: colors.light.secondary, // Светло-серый фон как на скрине
    borderRadius: borderRadius.lg,
    padding: 4,
    height: 80, // Фиксированная высота для выравнивания
  },
  option: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    gap: 4,
  },
  optionActive: {
    backgroundColor: colors.light.card, // Белый фон для активного
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  optionText: {
    fontSize: typography.xs,
    fontWeight: '500',
    color: colors.light.mutedForeground,
    textAlign: 'center',
  },
  optionTextActive: {
    color: colors.light.foreground,
    fontWeight: '600',
  },
  discountBadge: {
    backgroundColor: colors.light.foreground, // Черный бейдж как на скрине
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  discountBadgeActive: {
    backgroundColor: colors.light.foreground,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.background, // Белый текст
  },
});