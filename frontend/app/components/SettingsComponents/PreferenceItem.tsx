import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

/**
 * PreferenceItem
 * 
 * A reusable settings row component that can display:
 * - Simple navigable item (with chevron)
 * - Item with a current value display
 * - Item with custom right content
 */

interface PreferenceItemProps {
  label: string;
  description?: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  rightContent?: React.ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
}

export function PreferenceItem({
  label,
  description,
  value,
  onPress,
  showChevron = true,
  rightContent,
  icon,
}: PreferenceItemProps) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {icon && (
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color="#6B7280" />
        </View>
      )}
      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        {description && <Text style={styles.description}>{description}</Text>}
      </View>
      {rightContent ? (
        rightContent
      ) : (
        <View style={styles.rightContainer}>
          {value && <Text style={styles.value}>{value}</Text>}
          {showChevron && onPress && (
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          )}
        </View>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 14,
    color: '#6B7280',
  },
});
