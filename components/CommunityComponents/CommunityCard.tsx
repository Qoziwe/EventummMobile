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
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.mainContent}>
        <View style={styles.textColumn}>
          <View style={styles.headerRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            {isPrivate && (
              <Ionicons
                name="lock-closed"
                size={12}
                color={colors.light.mutedForeground}
              />
            )}
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.description} numberOfLines={1}>
            {description}
          </Text>

          <View style={styles.footer}>
            <View style={styles.membersRow}>
              <Ionicons name="people" size={14} color={colors.light.primary} />
              <Text style={styles.memberText}>{members.toLocaleString()} участников</Text>
            </View>
          </View>
        </View>

        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color={colors.light.border} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%', // На всю ширину
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.light.border,
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textColumn: {
    flex: 1,
    gap: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  categoryBadge: {
    backgroundColor: colors.light.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.primary,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.foreground,
  },
  description: {
    fontSize: 13,
    color: colors.light.mutedForeground,
  },
  footer: {
    marginTop: 4,
  },
  membersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  memberText: {
    fontSize: 12,
    color: colors.light.mutedForeground,
    fontWeight: '500',
  },
  arrowContainer: {
    paddingLeft: spacing.sm,
  },
});
