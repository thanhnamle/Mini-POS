import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS, RADII, SPACING, TYPE } from '../constants/theme';

interface FormFieldProps {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  multiline?: boolean;
}

export default function FormField({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry, multiline }: FormFieldProps) {
  return (
    <View style={{ marginBottom: SPACING.md }}>
      {!!label && <Text style={[TYPE.label, { marginBottom: 6 }]}>{label}</Text>}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSubtle}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        style={[s.input, multiline && { minHeight: 90, textAlignVertical: 'top' }]}
      />
    </View>
  );
}
const s = StyleSheet.create({
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADII.md,
    paddingHorizontal: SPACING.md, paddingVertical: 12,
    color: COLORS.text, fontSize: 15,
  },
});
