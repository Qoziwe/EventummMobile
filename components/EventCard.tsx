import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

export interface EventItem {
  id: string;
  title: string;
  date: string;
  location: string;
  price: string;
  image: any;
  // Поля для фильтров
  categories: string[];
  vibe: string;
  district: string;
  ageLimit: number;
  timestamp: number;
  priceValue: number;
  addedAt: string;
  // Опциональные
  tags?: string[];
  stats?: number;
  description?: string;
  organizer?: string;
  isPopular?: boolean;
  isForYou?: boolean;
  isNextWeek?: boolean;
}

interface EventCardProps extends EventItem {
  onPress?: () => void;
  variant?: 'default' | 'compact' | 'list';
  style?: ViewStyle;
}

export default function EventCard({
  title,
  date,
  location,
  stats,
  price,
  image,
  onPress,
  variant = 'default',
  style,
  categories,
}: EventCardProps) {
  const isCompact = variant === 'compact';
  const isList = variant === 'list';

  const source = typeof image === 'string' ? { uri: image } : image;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isCompact && styles.containerCompact,
        isList && styles.containerList,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View
        style={[
          styles.imageContainer,
          isCompact && styles.imageContainerCompact,
          isList && styles.imageContainerList,
        ]}
      >
        <Image source={source} style={styles.image} resizeMode="cover" />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {categories ? categories[0] : 'Событие'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, isCompact && styles.titleCompact]} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={12}
              color={colors.light.mutedForeground}
            />
            <Text style={styles.infoText}>{date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={12}
              color={colors.light.mutedForeground}
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {location}
            </Text>
          </View>
          {stats !== undefined && (
            <View style={styles.infoRow}>
              <Ionicons
                name="people-outline"
                size={12}
                color={colors.light.mutedForeground}
              />
              <Text style={styles.infoText}>{stats}</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <View style={styles.priceTag}>
            <Ionicons
              name="ticket-outline"
              size={14}
              color={colors.light.primaryForeground}
            />
            <Text style={styles.priceText}>{price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
    marginRight: spacing.sm,
    marginBottom: 4,
  },
  containerCompact: {
    width: 220,
  },
  containerList: {
    width: '100%',
    marginBottom: spacing.md,
    marginRight: 0,
    flexDirection: 'column',
  },
  imageContainer: {
    height: 140,
    backgroundColor: colors.light.muted,
    position: 'relative',
  },
  imageContainerCompact: {
    height: 120,
  },
  imageContainerList: {
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  categoryText: {
    fontSize: typography.xs,
    fontWeight: '700',
    color: colors.light.primary,
    textTransform: 'uppercase',
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.light.foreground,
    lineHeight: 20,
    minHeight: 40,
  },
  titleCompact: {
    fontSize: typography.sm,
    lineHeight: 18,
    minHeight: 36,
  },
  infoContainer: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    flex: 1,
  },
  footer: {
    marginTop: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.light.primary,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.md,
  },
  priceText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
});
