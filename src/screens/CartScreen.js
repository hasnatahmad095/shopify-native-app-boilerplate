import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getCartLines } from "../api/shopify";
import {
  changeLineQuantity,
  removeItem,
  selectCart,
  selectMutatingLineId,
} from "../redux/cartSlice";
import ProductImage from "../components/ProductImage";
import QuantityStepper from "../components/QuantityStepper";
import { EmptyState } from "../components/StateViews";
import { colors, radius, spacing, typography, formatMoney } from "../theme";

function variantSubtitle(merchandise) {
  const title = merchandise.title;
  return title && title !== "Default Title" ? title : null;
}

export default function CartScreen({ navigation }) {
  const dispatch = useDispatch();
  const cart = useSelector(selectCart);
  const mutatingLineId = useSelector(selectMutatingLineId);

  const lines = getCartLines(cart);

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Browse the shop and add something you like."
        actionLabel="Start shopping"
        onAction={() => navigation.navigate("Shop")}
      />
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {lines.map((line) => {
          const { merchandise } = line;
          const subtitle = variantSubtitle(merchandise);
          const busy = mutatingLineId === line.id;
          return (
            <View key={line.id} style={styles.item}>
              <ProductImage
                uri={merchandise.image?.url}
                style={styles.image}
              />
              <View style={styles.details}>
                <Text style={styles.itemTitle} numberOfLines={2}>
                  {merchandise.product.title}
                </Text>
                {subtitle ? (
                  <Text style={styles.subtitle}>{subtitle}</Text>
                ) : null}
                <Text style={styles.lineTotal}>
                  {formatMoney(line.cost.totalAmount)}
                </Text>
                <QuantityStepper
                  value={line.quantity}
                  busy={busy}
                  onChange={(quantity) =>
                    dispatch(changeLineQuantity({ lineId: line.id, quantity }))
                  }
                />
              </View>
              <TouchableOpacity
                style={styles.remove}
                disabled={busy}
                onPress={() => dispatch(removeItem({ lineId: line.id }))}
              >
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={styles.summary}>
          <SummaryRow
            label="Subtotal"
            value={formatMoney(cart.cost.subtotalAmount)}
          />
          {cart.cost.totalTaxAmount ? (
            <SummaryRow
              label="Tax"
              value={formatMoney(cart.cost.totalTaxAmount)}
            />
          ) : null}
          <SummaryRow
            label="Total"
            value={formatMoney(cart.cost.totalAmount)}
            emphasize
          />
          <Text style={styles.note}>
            Shipping and discounts are calculated at checkout.
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() =>
            navigation.navigate("Checkout", { url: cart.checkoutUrl })
          }
        >
          <Text style={styles.checkoutText}>Proceed to checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function SummaryRow({ label, value, emphasize }) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, emphasize && styles.emphasize]}>
        {label}
      </Text>
      <Text style={[styles.summaryValue, emphasize && styles.emphasize]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, gap: spacing.md },
  item: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  image: { width: 84, height: 84, borderRadius: radius.sm },
  details: { flex: 1, gap: spacing.xs },
  itemTitle: { ...typography.body, fontWeight: "600" },
  subtitle: { ...typography.muted },
  lineTotal: { ...typography.price, marginBottom: spacing.xs },
  remove: { paddingLeft: spacing.sm },
  removeText: { ...typography.muted, color: colors.danger },
  summary: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.lg,
    gap: spacing.sm,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: { ...typography.body, color: colors.textMuted },
  summaryValue: { ...typography.body },
  emphasize: { fontWeight: "700", color: colors.text, fontSize: 17 },
  note: { ...typography.muted, marginTop: spacing.xs },
  footer: {
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  checkoutButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  checkoutText: { color: colors.primaryText, fontWeight: "700", fontSize: 16 },
});
