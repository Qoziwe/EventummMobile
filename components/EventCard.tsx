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
  stats?: number;
}

interface EventCardProps extends EventItem {
  onPress?: () => void;
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
  style,
  categories,
}: EventCardProps) {
  const [imageError, setImageError] = useState(false);
  const source = imageError || !image || image === ''
    ? { uri: 'https://via.placeholder.com/800x450?text=Event' }
    : typeof image === 'string'
      ? { uri: image }
      : image;

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
          <Text style={styles.categoryText}>{categories ? categories[0] : 'Event'}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>
        <View style={styles.info}>
          <View style={styles.row}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.light.mutedForeground}
            />
            <Text style={styles.infoText}>{date}</Text>
          </View>
          <View style={styles.row}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.light.mutedForeground}
            />
            <Text style={styles.infoText} numberOfLines={1}>
              {location}
            </Text>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={styles.priceTag}>
            <Text style={styles.priceText}>{price}</Text>
          </View>
          {stats !== undefined && (
            <Text style={styles.statsText}>{stats} просмотров</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  imageContainer: { height: 180 },
  image: { width: '100%', height: '100%' },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.light.primary,
    textTransform: 'uppercase',
  },
  content: { padding: spacing.md },
  title: { fontSize: 16, fontWeight: '700', height: 44, marginBottom: 8 },
  info: { gap: 4, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  infoText: { fontSize: 13, color: colors.light.mutedForeground },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceTag: {
    backgroundColor: colors.light.foreground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.lg,
  },
  priceText: { color: colors.light.background, fontWeight: '700', fontSize: 12 },
  statsText: { fontSize: 11, color: colors.light.mutedForeground },
});
