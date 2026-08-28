import React, { useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice";
import { ErrorState } from "../components/StateViews";
import { colors } from "../theme";

/**
 * Hosts Shopify's own checkout in a WebView. Payment, shipping and taxes are all
 * handled by Shopify — we only watch for the order-confirmation ("thank you")
 * URL so we can empty the local cart once the order is placed.
 */
export default function CheckoutScreen({ route, navigation }) {
  const { url } = route.params;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const completed = useRef(false);

  const onNavStateChange = (navState) => {
    const current = navState.url || "";
    // Shopify order-status pages land on ".../thank_you" or ".../thank-you".
    if (!completed.current && /\/(thank_you|thank-you)/.test(current)) {
      completed.current = true;
      dispatch(clearCart());
    }
  };

  if (failed) {
    return (
      <ErrorState
        message="The checkout page could not be loaded."
        onRetry={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        onNavigationStateChange={onNavStateChange}
        onLoadEnd={() => setLoading(false)}
        onError={() => setFailed(true)}
        startInLoadingState
      />
      {loading ? (
        <View style={styles.loader} pointerEvents="none">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loader: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
