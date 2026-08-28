import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, typography } from "../theme";

/**
 * Renders a product image, falling back to a neutral placeholder when the
 * product has no image (Shopify products are not required to have one).
 */
export default function ProductImage({ uri, style, resizeMode = "cover" }) {
  if (uri) {
    return <Image source={{ uri }} style={style} resizeMode={resizeMode} />;
  }
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={styles.placeholderText}>No image</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: { ...typography.muted },
});
