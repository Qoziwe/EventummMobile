import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, borderRadius, typography } from "../theme/colors"

interface CommunityPulseProps {
  title?: string
  subtitle?: string
  onViewAll?: () => void
  children?: React.ReactNode
}

export default function CommunityPulse({
  title = "Сообщества",
  subtitle = "Активные сообщества по интересам",
  onViewAll,
  children,
}: CommunityPulseProps) {
  return (
    <View style={styles.container}>
      {/* View All Button */}
      <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
        <Text style={styles.viewAllText}>Все сообщества</Text>
        <Ionicons name="arrow-forward" size={16} color={colors.light.foreground} />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.liveBadge}>
          <View style={styles.liveIndicator} />
          <Text style={styles.liveText}>Live</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Communities List - Empty container */}
      <View style={styles.communitiesList}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
  },
  viewAllText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
    fontWeight: "500",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: typography.xl,
    fontWeight: "700",
    color: colors.light.foreground,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: colors.light.secondary,
    borderRadius: borderRadius.md,
  },
  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.accent,
  },
  liveText: {
    fontSize: typography.xs,
    fontWeight: "500",
    color: colors.light.foreground,
  },
  subtitle: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
  },
  communitiesList: {
    gap: spacing.md,
    minHeight: 100,
  },
})
