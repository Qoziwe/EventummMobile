import React, { useState } from 'react';
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
  categories: string[];
  vibe: string;
  district: string;
  ageLimit: number;
  timestamp: number;
  priceValue: number;
  addedAt: string;
  tags?: string[];
  stats?: number;
  isForYou?: boolean;
  isNextWeek?: boolean;
}

interface EventCardProps extends EventItem {
  onPress?: () => void;
  style?: ViewStyle;
}

const PLACEHOLDER_IMAGE = 'https://via.placeholder.com/800x450?text=Event+Image';

export default function EventCard({
  title,
  date,
  location,
  stats,
  price,
  image,
  onPress,
  style,
  categories,
}: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  const source = imageError 
    ? { uri: PLACEHOLDER_IMAGE } 
    : (typeof image === 'string' ? { uri: image } : image);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={source} 
          style={styles.image} 
          resizeMode="cover" 
          onError={() => setImageError(true)}
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>
            {categories ? categories[0] : 'Событие'}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.light.mutedForeground}
            />
            <Text style={styles.infoText}>{date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons
              name="location-outline"
              size={14}
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
                size={14}
                color={colors.light.mutedForeground}
              />
              <Text style={styles.infoText}>{stats} просмотров</Text>
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
    width: 280,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: spacing.sm,
  },
  imageContainer: {
    height: 160,
    backgroundColor: colors.light.muted,
  },
  image: { width: '100%', height: '100%' },
  categoryBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
  content: { padding: spacing.md, gap: spacing.sm },
  title: {
    fontSize: typography.base,
    fontWeight: '700',
    color: colors.light.foreground,
    lineHeight: 22,
    height: 44,
  },
  infoContainer: { gap: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: typography.sm, color: colors.light.mutedForeground },
  footer: { marginTop: spacing.xs },
  priceTag: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.light.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: borderRadius.lg,
  },
  priceText: {
    fontSize: typography.sm,
    fontWeight: '600',
    color: colors.light.primaryForeground,
  },
});