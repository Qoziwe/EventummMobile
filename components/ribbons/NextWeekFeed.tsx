import type React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const CARD_IMAGE_HEIGHT = 170;

interface Event {
  id: string;
  title: string;
  image: any;
  date: string;
  location: string;
  price: string;
  isFeatured?: boolean;
}

interface NextWeekFeedProps {
  title?: string;
  subtitle?: string;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  events: Event[];
  onEventPress?: (event: Event) => void;
}

export default function NextWeekFeed({
  title = 'На следующей неделе',
  subtitle = 'Самые интересные события на ближайшие 7 дней',
  onScrollLeft,
  onScrollRight,
  events,
  onEventPress,
}: NextWeekFeedProps) {
  const renderEventCard = (item: Event) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.9}
      style={styles.cardContainer}
      onPress={() => onEventPress?.(item)}
    >
      {/* Featured Badge */}
      {item.isFeatured && (
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredText}>Featured</Text>
        </View>
      )}

      {/* Event Image */}
      <Image source={item.image} style={styles.cardImage} />

      {/* Event Details */}
      <View style={styles.detailsContainer}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.detailRow}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={colors.light.mutedForeground}
          />
          <Text style={styles.detailText}>{item.date}</Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.light.mutedForeground}
          />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.priceLabel}>From</Text>
            <Text style={styles.price}>{item.price}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionSubtitle}>{subtitle}</Text>
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventsContainer}
      >
        {events.map(renderEventCard)}
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
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  sectionSubtitle: {
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
  },
  cardContainer: {
    width: CARD_WIDTH,
    backgroundColor: colors.light.card,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: colors.light.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: '#FFD700',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    zIndex: 1,
  },
  featuredText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: '#000',
  },
  cardImage: {
    width: '100%',
    height: CARD_IMAGE_HEIGHT,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: spacing.md,
  },
  cardTitle: {
    fontSize: typography.md,
    fontWeight: '700',
    color: colors.light.foreground,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  detailText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
  priceLabel: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    marginBottom: 2,
  },
  price: {
    fontSize: typography.lg,
    fontWeight: '700',
    color: colors.light.primary,
  },
});
