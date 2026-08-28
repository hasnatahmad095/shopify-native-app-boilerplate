import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SHOPIFY_DOMAIN, API_VERSION } from "../config/shopify";
import { colors, radius, spacing, typography } from "../theme";

/**
 * Placeholder account tab. Wire up the Storefront Customer API here for login,
 * order history and addresses when you need real accounts.
 */
export default function AccountScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
    >
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Store</Text>
        <Row label="Domain" value={SHOPIFY_DOMAIN} />
        <Row label="Storefront API" value={API_VERSION} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Next steps</Text>
        <Text style={styles.bullet}>
          • Add customer login with the Storefront Customer API.
        </Text>
        <Text style={styles.bullet}>
          • Show order history and saved addresses.
        </Text>
        <Text style={styles.bullet}>
          • Add collections, search and wishlist screens.
        </Text>
      </View>
    </ScrollView>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardTitle: { ...typography.h3, marginBottom: spacing.xs },
  row: { flexDirection: "row", justifyContent: "space-between" },
  rowLabel: { ...typography.body, color: colors.textMuted },
  rowValue: { ...typography.body, fontWeight: "600" },
  bullet: { ...typography.body, color: colors.textMuted, lineHeight: 22 },
});
