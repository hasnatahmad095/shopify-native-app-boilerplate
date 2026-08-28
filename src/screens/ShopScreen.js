import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { fetchProducts } from "../api/shopify";
import { isShopifyConfigured } from "../config/shopify";
import ProductCard from "../components/ProductCard";
import {
  EmptyState,
  ErrorState,
  Loading,
  SetupRequired,
} from "../components/StateViews";
import { colors, spacing } from "../theme";

const PAGE_SIZE = 20;
const GAP = spacing.md;
const H_PADDING = spacing.lg;

export default function ShopScreen({ navigation }) {
  const { width } = useWindowDimensions();
  const columnWidth = (width - H_PADDING * 2 - GAP) / 2;

  const [products, setProducts] = useState([]);
  const [pageInfo, setPageInfo] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const { products: items, pageInfo: info } = await fetchProducts({
        first: PAGE_SIZE,
      });
      setProducts(items);
      setPageInfo(info);
      setStatus("ready");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (isShopifyConfigured) load();
  }, [load]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const { products: items, pageInfo: info } = await fetchProducts({
        first: PAGE_SIZE,
      });
      setProducts(items);
      setPageInfo(info);
      setStatus("ready");
    } catch (e) {
      setError(e.message);
      setStatus("error");
    } finally {
      setRefreshing(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || !pageInfo?.hasNextPage) return;
    setLoadingMore(true);
    try {
      const { products: items, pageInfo: info } = await fetchProducts({
        first: PAGE_SIZE,
        after: pageInfo.endCursor,
      });
      setProducts((prev) => [...prev, ...items]);
      setPageInfo(info);
    } catch {
      // Keep the already-loaded page on a pagination failure.
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, pageInfo]);

  if (!isShopifyConfigured) return <SetupRequired />;
  if (status === "loading" && products.length === 0) return <Loading />;
  if (status === "error" && products.length === 0) {
    return <ErrorState message={error} onRetry={load} />;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={styles.content}
      columnWrapperStyle={styles.column}
      showsVerticalScrollIndicator={false}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <ProductCard
          product={item}
          width={columnWidth}
          onPress={() =>
            navigation.navigate("ProductDetail", {
              handle: item.handle,
              title: item.title,
            })
          }
        />
      )}
      ListEmptyComponent={
        <EmptyState
          title="No products yet"
          message="Add products to your Shopify store to see them here."
        />
      }
      ListFooterComponent={
        loadingMore ? (
          <ActivityIndicator style={styles.footer} color={colors.primary} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    padding: H_PADDING,
    gap: GAP,
    backgroundColor: colors.background,
    flexGrow: 1,
  },
  column: {
    gap: GAP,
  },
  footer: {
    paddingVertical: spacing.lg,
  },
});
