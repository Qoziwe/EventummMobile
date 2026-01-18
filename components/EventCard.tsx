import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, borderRadius, typography } from "../theme/colors"

interface EventCardProps {
  title: string
  date: string
  venue: string
  attendees: number
  price: string
  category: string
  imageUri?: string
  onPress?: () => void
  variant?: "default" | "compact"
}

export default function EventCard({
  title,
  date,
  venue,
  attendees,
  price,
  category,
  imageUri,
  onPress,
  variant = "default",
}: EventCardProps) {
  const isCompact = variant === "compact"

  return (
    <TouchableOpacity
      style={[styles.container, isCompact && styles.containerCompact]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image */}
      <View style={[styles.imageContainer, isCompact && styles.imageContainerCompact]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{category}</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, isCompact && styles.titleCompact]} numberOfLines={2}>
          {title}
        </Text>

        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={12} color={colors.light.mutedForeground} />
            <Text style={styles.infoText}>{date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={12} color={colors.light.mutedForeground} />
            <Text style={styles.infoText} numberOfLines={1}>
              {venue}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={12} color={colors.light.mutedForeground} />
            <Text style={styles.infoText}>{attendees} участников</Text>
          </View>
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Ionicons name="ticket-outline" size={14} color={colors.light.primaryForeground} />
          <Text style={styles.buttonText}>{price}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  containerCompact: {
    width: 220,
  },
  imageContainer: {
    height: 140,
    position: "relative",
  },
  imageContainerCompact: {
    height: 120,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.light.muted,
  },
  categoryBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.light.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  categoryText: {
    fontSize: typography.xs,
    fontWeight: "600",
    color: colors.light.primaryForeground,
  },
  content: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontSize: typography.sm,
    fontWeight: "700",
    color: colors.light.foreground,
    lineHeight: 18,
  },
  titleCompact: {
    fontSize: typography.sm,
  },
  infoContainer: {
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  infoText: {
    fontSize: typography.xs,
    color: colors.light.mutedForeground,
    flex: 1,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  buttonText: {
    fontSize: typography.xs,
    fontWeight: "600",
    color: colors.light.primaryForeground,
  },
})
