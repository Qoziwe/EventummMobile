'use client';

import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
} from 'react-native';

/**
 * ForYouControls
 * 
 * Controls behavior of the "For You" feed ONLY.
 * 
 * Time Filter Toggle:
 * - When ON: Shows time filter chips (Today / Tomorrow / Week)
 *   inside the For You feed, allowing quick temporal filtering.
 * - When OFF: For You feed shows all personalized events
 *   without time-based segmentation.
 * 
 * NOTE: Other feeds (Today, Tomorrow, This Week, etc.) already
 * represent specific time periods by design and are NOT affected
 * by this toggle. This setting only applies to the "For You" feed.
 */

interface ForYouControlsProps {
  isTimeFilterEnabled: boolean;
  onTimeFilterToggle: (value: boolean) => void;
}

export function ForYouControls({
  isTimeFilterEnabled,
  onTimeFilterToggle,
}: ForYouControlsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>For You Feed Controls</Text>
      <Text style={styles.sectionDescription}>
        Customize behavior of the "For You" feed only
      </Text>

      <View style={styles.toggleRow}>
        <View style={styles.toggleTextContainer}>
          <Text style={styles.toggleLabel}>Enable time filter</Text>
          <Text style={styles.toggleDescription}>
            Show Today / Tomorrow / Week filter chips
          </Text>
        </View>
        <Switch
          value={isTimeFilterEnabled}
          onValueChange={onTimeFilterToggle}
          trackColor={{ false: '#D1D5DB', true: '#A5B4FC' }}
          thumbColor={isTimeFilterEnabled ? '#6366F1' : '#F4F4F5'}
          ios_backgroundColor="#D1D5DB"
        />
      </View>

      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>
          Note: Other feeds like "Today", "Tomorrow", and "This Week" already
          represent specific time periods and are not affected by this setting.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  toggleDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  noteContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  noteText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 16,
  },
});
