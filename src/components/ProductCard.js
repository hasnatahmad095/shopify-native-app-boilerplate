import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProductImage from "./ProductImage";
import { colors, radius, spacing, typography, formatMoney } from "../theme";

/**
 * Grid cell for a single product. `width` is passed in by the list so two
 * columns line up regardless of screen size.
 */
export default function ProductCard({ product, width, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { width }]}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <ProductImage
        uri={product.featuredImage?.url}
        style={styles.image}
      />
      <View style={styles.body}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>
          {formatMoney(product.priceRange?.minVariantPrice)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 1,
  },
  body: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  title: { ...typography.body, fontWeight: "600" },
  price: { ...typography.price },
});
