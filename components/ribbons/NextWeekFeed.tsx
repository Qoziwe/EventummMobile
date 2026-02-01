import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme/colors';
import EventCard, { EventItem } from '../EventCard';

interface NextWeekFeedProps {
  title?: string;
  subtitle?: string;
  onScrollLeft?: () => void;
  onScrollRight?: () => void;
  events: EventItem[];
  onEventPress?: (event: EventItem) => void;
  cardStyle?: ViewStyle;
}

export default function NextWeekFeed({
  title = 'На следующей неделе',
  subtitle = 'Самые интересные события',
  onScrollLeft,
  onScrollRight,
  events,
  onEventPress,
  cardStyle,
}: NextWeekFeedProps) {
  return (
    <View style={styles.container}>
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.eventsContainer}
      >
        {events.map(event => (
          <EventCard
            key={event.id}
            {...event}
            onPress={() => onEventPress?.(event)}
            style={cardStyle}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: spacing.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: { fontSize: typography.xl, fontWeight: '700', color: colors.light.foreground },
  subtitle: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginTop: spacing.xs,
  },
  controls: { flexDirection: 'row', gap: spacing.sm },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventsContainer: { paddingHorizontal: spacing.lg, gap: spacing.md, minHeight: 200 },
});
