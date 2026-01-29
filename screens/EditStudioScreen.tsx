import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, spacing, borderRadius } from '../theme/colors';

export default function EditStudioScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.light.foreground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Профиль студии</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ color: colors.light.primary, fontWeight: '700' }}>Готово</Text>
        </TouchableOpacity>
      </View>
      <View style={{ padding: spacing.lg, gap: spacing.md }}>
        <Text style={styles.label}>Название студии</Text>
        <TextInput style={styles.input} placeholder="Как называется ваша организация?" />
        <Text style={styles.label}>Описание деятельности</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          multiline
          placeholder="Расскажите о своих ивентах"
        />
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
  label: { fontWeight: '700', fontSize: 13, marginBottom: -8 },
  input: {
    backgroundColor: colors.light.card,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: borderRadius.lg,
    padding: 12,
  },
});
