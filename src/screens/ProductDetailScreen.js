import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { fetchProductByHandle } from "../api/shopify";
import { addItem } from "../redux/cartSlice";
import ProductImage from "../components/ProductImage";
import { ErrorState, Loading } from "../components/StateViews";
import { colors, radius, spacing, typography, formatMoney } from "../theme";

// Shopify gives single-variant products a synthetic "Title" option; hide it.
function hasRealOptions(product) {
  return !(
    product.options?.length === 1 &&
    product.options[0].name === "Title" &&
    product.options[0].values?.length === 1
  );
}

function findVariant(variants, selected) {
  return variants.find((variant) =>
    variant.selectedOptions.every((opt) => selected[opt.name] === opt.value)
  );
}

export default function ProductDetailScreen({ route, navigation }) {
  const { handle } = route.params;
  const { width } = useWindowDimensions();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState({});
  const [adding, setAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      setStatus("loading");
      try {
        const data = await fetchProductByHandle(handle);
        if (!active) return;
        if (!data) {
          setError("This product is no longer available.");
          setStatus("error");
          return;
        }
        setProduct(data);
        // Default to the first available variant's options.
        const firstAvailable =
          data.variants.find((v) => v.availableForSale) || data.variants[0];
        const initial = {};
        firstAvailable?.selectedOptions.forEach((opt) => {
          initial[opt.name] = opt.value;
        });
        setSelected(initial);
        setStatus("ready");
      } catch (e) {
        if (active) {
          setError(e.message);
          setStatus("error");
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [handle]);

  const activeVariant = useMemo(() => {
    if (!product) return null;
    return findVariant(product.variants, selected) || product.variants[0];
  }, [product, selected]);

  const heroImage =
    activeVariant?.image?.url || product?.images?.[0]?.url || null;

  const onAdd = async () => {
    if (!activeVariant) return;
    setAdding(true);
    setJustAdded(false);
    try {
      await dispatch(addItem({ variantId: activeVariant.id })).unwrap();
      setJustAdded(true);
    } catch {
      // Error is surfaced via cart state; keep the button usable.
    } finally {
      setAdding(false);
    }
  };

  if (status === "loading") return <Loading />;
  if (status === "error") {
    return <ErrorState message={error} onRetry={() => navigation.goBack()} />;
  }

  const soldOut = activeVariant && !activeVariant.availableForSale;
  const showOptions = hasRealOptions(product);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ProductImage
        uri={heroImage}
        style={[styles.hero, { width, height: width }]}
      />

      <View style={styles.body}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>{formatMoney(activeVariant?.price)}</Text>

        {showOptions
          ? product.options.map((option) => (
              <View key={option.id} style={styles.optionBlock}>
                <Text style={styles.optionName}>{option.name}</Text>
                <View style={styles.optionValues}>
                  {option.values.map((value) => {
                    const isActive = selected[option.name] === value;
                    return (
                      <TouchableOpacity
                        key={value}
                        style={[styles.chip, isActive && styles.chipActive]}
                        onPress={() =>
                          setSelected((prev) => ({
                            ...prev,
                            [option.name]: value,
                          }))
                        }
                      >
                        <Text
                          style={[
                            styles.chipText,
                            isActive && styles.chipTextActive,
                          ]}
                        >
                          {value}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            ))
          : null}

        {product.description ? (
          <Text style={styles.description}>{product.description}</Text>
        ) : null}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.addButton, (adding || soldOut) && styles.addDisabled]}
          disabled={adding || soldOut}
          onPress={onAdd}
        >
          <Text style={styles.addButtonText}>
            {soldOut
              ? "Sold out"
              : adding
              ? "Adding…"
              : justAdded
              ? "Added ✓"
              : "Add to cart"}
          </Text>
        </TouchableOpacity>

        {justAdded ? (
          <TouchableOpacity
            style={styles.viewCart}
            onPress={() => navigation.navigate("Tabs", { screen: "Cart" })}
          >
            <Text style={styles.viewCartText}>View cart</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background },
  content: { paddingBottom: spacing.xxl },
  hero: { backgroundColor: colors.surface },
  body: { padding: spacing.lg, gap: spacing.md },
  title: { ...typography.h1 },
  price: { ...typography.h2 },
  optionBlock: { gap: spacing.sm },
  optionName: { ...typography.h3 },
  optionValues: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  chipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipText: { ...typography.body },
  chipTextActive: { color: colors.primaryText, fontWeight: "600" },
  description: {
    ...typography.body,
    color: colors.textMuted,
    lineHeight: 22,
    marginTop: spacing.sm,
  },
  footer: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  addDisabled: { opacity: 0.5 },
  addButtonText: {
    color: colors.primaryText,
    fontWeight: "700",
    fontSize: 16,
  },
  viewCart: { alignItems: "center", paddingVertical: spacing.sm },
  viewCartText: { ...typography.body, color: colors.accent, fontWeight: "600" },
});
