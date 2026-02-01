import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function AnalyticsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Аналитика</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>
        <View style={styles.card}>
          <Text style={styles.val}>1,240</Text>
          <Text style={styles.lbl}>Просмотров за неделю</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.val}>45</Text>
          <Text style={styles.lbl}>Продано билетов</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.val, { color: '#22C55E' }]}>+12%</Text>
          <Text style={styles.lbl}>Рост аудитории</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.light.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  headerTitle: { fontSize: 18, fontWeight: '700' },
  card: {
    padding: 20,
    backgroundColor: colors.light.card,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginBottom: 12,
  },
  val: { fontSize: 24, fontWeight: '800' },
  lbl: { color: colors.light.mutedForeground, fontSize: 12 },
});
