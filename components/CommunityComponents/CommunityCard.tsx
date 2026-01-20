// components/CommunityComponents/CommunityCard.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, typography } from '../../theme/colors';

interface CommunityCardProps {
  name: string;
  members: number;
  category: string;
  description: string;
  isPrivate: boolean;
  onPress: () => void;
}

export default function CommunityCard({
  name,
  members,
  category,
  description,
  isPrivate,
  onPress,
}: CommunityCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>

        {isPrivate && (
          <Ionicons name="lock-closed" size={14} color={colors.light.mutedForeground} />
        )}
      </View>

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.description} numberOfLines={2}>
        {description}
      </Text>

      <View style={styles.footer}>
        <View style={styles.memberInfo}>
          <Ionicons name="people" size={14} color={colors.light.mutedForeground} />
          <Text style={styles.memberCount}>{members.toLocaleString()}</Text>
        </View>

        <Ionicons name="chevron-forward" size={16} color={colors.light.mutedForeground} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    backgroundColor: colors.light.secondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  categoryText: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.light.foreground,
  },
  name: {
    fontSize: typography.base,
    fontWeight: '600',
    color: colors.light.foreground,
    marginBottom: spacing.xs,
  },
  description: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  memberCount: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
});
