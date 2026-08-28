import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors, radius, spacing, typography } from "../theme";

/**
 * Minus / value / plus control. When `busy` is true the value is replaced by a
 * spinner and the buttons are disabled.
 */
export default function QuantityStepper({ value, onChange, busy, min = 0 }) {
  return (
    <View style={styles.row}>
      <TouchableOpacity
        style={styles.button}
        disabled={busy || value <= min}
        onPress={() => onChange(value - 1)}
      >
        <Text style={styles.symbol}>−</Text>
      </TouchableOpacity>

      <View style={styles.value}>
        {busy ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Text style={styles.valueText}>{value}</Text>
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        disabled={busy}
        onPress={() => onChange(value + 1)}
      >
        <Text style={styles.symbol}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignSelf: "flex-start",
  },
  button: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  symbol: { fontSize: 18, color: colors.text },
  value: { minWidth: 40, alignItems: "center" },
  valueText: { ...typography.body, fontWeight: "600" },
});
