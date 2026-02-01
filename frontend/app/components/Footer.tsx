import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, borderRadius, typography } from "../theme/colors"

export default function Footer() {
  return (
    <View style={styles.container}>
      {/* Logo and Description */}
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Ionicons name="flash" size={20} color={colors.light.primaryForeground} />
          </View>
          <Text style={styles.logoText}>Eventum</Text>
        </View>
        <Text style={styles.description}>
          Платформа для поиска мероприятий, встреч с единомышленниками и незабываемых впечатлений.
        </Text>

        {/* Social Links */}
        <View style={styles.socialLinks}>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-instagram" size={16} color={colors.light.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-facebook" size={16} color={colors.light.foreground} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Ionicons name="logo-youtube" size={16} color={colors.light.foreground} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Contact Info */}
      <View style={styles.contactSection}>
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={14} color={colors.light.mutedForeground} />
          <Text style={styles.contactText}>info@eventum.kz</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={14} color={colors.light.mutedForeground} />
          <Text style={styles.contactText}>+7 (727) 123-45-67</Text>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="location-outline" size={14} color={colors.light.mutedForeground} />
          <Text style={styles.contactText}>Алматы, Казахстан</Text>
        </View>
      </View>

      {/* Copyright */}
      <Text style={styles.copyright}>© 2025 Eventum. Все права защищены.</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light.card,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    padding: spacing["2xl"],
    marginTop: spacing["3xl"],
  },
  logoSection: {
    marginBottom: spacing.lg,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.light.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontSize: typography.xl,
    fontWeight: "700",
    color: colors.light.foreground,
  },
  description: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  socialLinks: {
    flexDirection: "row",
    gap: spacing.md,
  },
  socialButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: colors.light.muted,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: spacing.lg,
  },
  contactSection: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  contactText: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
  },
  copyright: {
    fontSize: typography.sm,
    color: colors.light.mutedForeground,
    textAlign: "center",
  },
})
