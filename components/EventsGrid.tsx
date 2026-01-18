import type React from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, borderRadius, typography } from "../theme/colors"

interface EventsGridProps {
  title?: string
  subtitle?: string
  onViewAll?: () => void
  onScrollLeft?: () => void
  onScrollRight?: () => void
  children?: React.ReactNode
}

export default function EventsGrid({
  title = "Популярные мероприятия",
  subtitle = "Самые посещаемые события",
  onViewAll,
  onScrollLeft,
  onScrollRight,
  children,
}: EventsGridProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton} onPress={onScrollLeft}>
              <Ionicons name="chevron-back" size={16} color={colors.light.foreground} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton} onPress={onScrollRight}>
              <Ionicons name="chevron-forward" size={16} color={colors.light.foreground} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.viewAllButton} onPress={onViewAll}>
            <Text style={styles.viewAllText}>Все</Text>
            <Ionicons name="arrow-forward" size={16} color={colors.light.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Events Carousel */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.eventsContainer}>
        {children}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.lg,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.xl,
    fontWeight: "700",
    color: colors.light.foreground,
  },
  subtitle: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    marginTop: spacing.xs,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  controls: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.light.border,
    alignItems: "center",
    justifyContent: "center",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  viewAllText: {
    fontSize: typography.sm,
    color: colors.light.primary,
    fontWeight: "500",
  },
  eventsContainer: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    minHeight: 200,
  },
})
