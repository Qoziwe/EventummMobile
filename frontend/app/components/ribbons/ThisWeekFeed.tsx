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
import EventPlaceholder from '../../assets/placeholder.jpg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 280;

interface Event {
  id: string;
  title: string;
  image: any;
  date: string;
  location: string;
  price: string;
  isPaid: boolean;
  isPromoted: boolean;
}

interface ThisWeekFeedProps {
  title?: string;
  subtitle?: string;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  events: Event[];
  onEventPress?: (event: Event) => void;
}

export default function ThisWeekFeed({
  title = 'На этой неделе',
  subtitle = 'События на этой неделе',
  onScrollLeft,
  onScrollRight,
  events,
  onEventPress,
}: ThisWeekFeedProps) {
  const renderEventCard = (item: Event) => (
    <TouchableOpacity
      key={item.id}
      activeOpacity={0.8}
      style={styles.cardContainer}
      onPress={() => onEventPress?.(item)}
    >
      <View style={styles.card}>
        <Image
          source={
            !item.image || item.image === ''
              ? EventPlaceholder
              : typeof item.image === 'string'
                ? { uri: item.image }
                : item.image
          }
          style={styles.cardImage}
        />
        <View style={styles.badgesContainer}>
          {item.isPromoted && (
            <View style={styles.promotedBadge}>
              <Text style={styles.promotedText}>Featured</Text>
            </View>
          )}
        </View>
        <View style={styles.gradient} />
        <View style={styles.contentContainer}>
          <View style={styles.comingSoonBadge}>
            <Text style={styles.comingSoonText}>Coming Soon</Text>
          </View>
          <Text style={styles.eventTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.date} numberOfLines={1}>
            {item.date}
          </Text>
          <Text style={styles.location} numberOfLines={1}>
            📍 {item.location}
          </Text>
          <View style={styles.footerContainer}>
            <View>
              <Text style={styles.priceLabel}>From</Text>
              <Text style={styles.price}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.notifyButton}>
              <Text style={styles.notifyButtonText}>Notify Me</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
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

      {/* Events Carousel */}
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
  },
  card: {
    height: CARD_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  badgesContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 2,
  },
  promotedBadge: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  promotedText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
  contentContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    zIndex: 1,
  },
  comingSoonBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
    lineHeight: 20,
  },
  date: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFD700',
  },
  notifyButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  notifyButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000',
  },
});
