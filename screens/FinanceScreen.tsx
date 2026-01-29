import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function FinanceScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Финансы</Text>
        <View style={{ width: 24 }} />
      </View>
      <View style={{ padding: 24, alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: colors.light.mutedForeground }}>
          Доступно к выводу
        </Text>
        <Text style={{ fontSize: 32, fontWeight: '800', marginVertical: 8 }}>0 ₸</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Вывести средства</Text>
        </TouchableOpacity>
      </View>
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
  btn: {
    backgroundColor: colors.light.foreground,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: borderRadius.lg,
    marginTop: 20,
  },
});
