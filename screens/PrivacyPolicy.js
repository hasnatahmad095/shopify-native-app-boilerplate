import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";

import { fetchAllProducts } from "../shopifyFunctions";

const PrivacyPolicy = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchAllProducts();
        console.log(data, "data");

        setProducts(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching products: ", err);
        setError(
          "Failed to load products. Please check your internet connection."
        );
        Alert.alert("Error", "Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
   <SafeAreaView style={styles.container}>
  <ScrollView contentContainerStyle={styles.scrollContainer}>
    {products.map((product) => {
      // Get total inventory quantity across all variants
      const totalQuantity = product.variants?.reduce((sum, variant) => {
        return sum + (variant.inventoryQuantity || 0);
      }, 0) || 0;

      // Clean description text
      const cleanDescription = product.description 
        ? product.description.replace(/<[^>]*>?/gm, "").trim()
        : null;

      return (
        <View key={product.id} style={styles.productItem}>
          {/* Product Image */}
          <Image
            source={{
              uri: product.images[0]?.src || "https://placehold.co/400",
            }}
            style={styles.productImage}
            resizeMode="contain"
          />

          {/* Product Title */}
          <Text style={styles.productTitle}>{product.title}</Text>

          {/* Product Vendor - wrapped in conditional */}
          {product.vendor ? (
            <Text style={styles.productVendor}>Vendor: {product.vendor}</Text>
          ) : null}

          {/* Product Type - wrapped in conditional */}
          {product.productType ? (
            <Text style={styles.productType}>Type: {product.productType}</Text>
          ) : null}

          {/* Availability & Stock Quantity */}
          <View style={styles.stockContainer}>
            <Text
              style={[
                styles.availability,
                product.availableForSale ? styles.available : styles.unavailable,
              ]}
            >
              {product.availableForSale ? "In Stock" : "Out of Stock"}
            </Text>
            {product.availableForSale && (
              <Text style={styles.stockQuantity}>
                ({totalQuantity} available)
              </Text>
            )}
          </View>

          {/* Price - properly wrapped */}
          {product.variants?.[0]?.price && (
            <Text style={styles.price}>
              Price: {product.variants[0].price.amount}{" "}
              {product.variants[0].price.currencyCode}
            </Text>
          )}

          {/* Description - properly wrapped with null check */}
          {cleanDescription ? (
            <Text style={styles.description}>{cleanDescription}</Text>
          ) : null}

          {/* Details Button */}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate("Terms Conditions", { product })}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      );
    })}
  </ScrollView>
</SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 16,
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    marginBottom: 12,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productVendor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  productType: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  availability: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  available: {
    color: 'green',
  },
  unavailable: {
    color: 'red',
  },
  stockQuantity: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  detailsButton: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default PrivacyPolicy;
