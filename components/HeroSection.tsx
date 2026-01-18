import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { colors, spacing, borderRadius, typography } from "../theme/colors"

interface FilterItem {
  id: string
  label: string
  icon: keyof typeof Ionicons.glyphMap
}

interface HeroSectionProps {
  title?: string
  titleSecondary?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (text: string) => void
  onSearchClear?: () => void
  filters?: FilterItem[]
  onFilterPress?: (filterId: string) => void
  onApplyFilters?: () => void
}

const defaultFilters: FilterItem[] = [
  { id: "date", label: "Дата", icon: "calendar-outline" },
  { id: "category", label: "Категория", icon: "pricetag-outline" },
  { id: "vibe", label: "Вайб", icon: "flash-outline" },
  { id: "price", label: "Цена", icon: "cash-outline" },
  { id: "age", label: "Возраст", icon: "person-outline" },
  { id: "district", label: "Район", icon: "location-outline" },
]

export default function HeroSection({
  title = "Твой город. Твои люди.",
  titleSecondary = "Твой следующий шаг.",
  searchPlaceholder = "Поиск событий, тегов, мест...",
  searchValue = "",
  onSearchChange,
  onSearchClear,
  filters = defaultFilters,
  onFilterPress,
  onApplyFilters,
}: HeroSectionProps) {
  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.titleSecondary}>{titleSecondary}</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color={colors.light.mutedForeground} />
        <TextInput
          style={styles.searchInput}
          placeholder={searchPlaceholder}
          placeholderTextColor={colors.light.mutedForeground}
          value={searchValue}
          onChangeText={onSearchChange}
        />
        {searchValue.length > 0 && (
          <TouchableOpacity onPress={onSearchClear}>
            <Ionicons name="close-circle" size={20} color={colors.light.mutedForeground} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContainer}>
        {filters.map((filter) => (
          <TouchableOpacity key={filter.id} style={styles.filterChip} onPress={() => onFilterPress?.(filter.id)}>
            <Ionicons name={filter.icon} size={14} color={colors.light.foreground} />
            <Text style={styles.filterText}>{filter.label}</Text>
            <Ionicons name="chevron-down" size={14} color={colors.light.mutedForeground} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Apply Button */}
      <TouchableOpacity style={styles.applyButton} onPress={onApplyFilters}>
        <Text style={styles.applyButtonText}>Применить фильтры</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing["2xl"],
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  titleContainer: {
    marginBottom: spacing["2xl"],
    alignItems: "center",
  },
  title: {
    fontSize: typography["3xl"],
    fontWeight: "700",
    color: colors.light.foreground,
    textAlign: "center",
  },
  titleSecondary: {
    fontSize: typography["3xl"],
    fontWeight: "700",
    color: colors.light.foreground,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.light.background,
    borderWidth: 2,
    borderColor: colors.light.border,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    marginBottom: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.base,
    color: colors.light.foreground,
  },
  filtersContainer: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.background,
  },
  filterText: {
    fontSize: typography.sm,
    color: colors.light.foreground,
  },
  applyButton: {
    backgroundColor: colors.light.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: "center",
  },
  applyButtonText: {
    color: colors.light.primaryForeground,
    fontSize: typography.base,
    fontWeight: "600",
  },
})
