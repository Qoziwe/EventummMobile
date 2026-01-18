import type React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme/colors';

interface ForYouSectionProps {
  title?: string;
  subtitle?: string;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  children?: React.ReactNode;
}

export default function ForYouSection({
  title = 'Для вас',
  subtitle = 'На основе ваших интересов',
  onScrollLeft,
  onScrollRight,
  children,
}: ForYouSectionProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity style={styles.controlButton} onPress={onScrollLeft}>
            <Ionicons name="chevron-back" size={16} color={colors.light.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlButton} onPress={onScrollRight}>
            <Ionicons name="chevron-forward" size={16} color={colors.light.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Events Carousel */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventsContainer}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginTop: spacing.xs,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    minHeight: 200,
  },
});
