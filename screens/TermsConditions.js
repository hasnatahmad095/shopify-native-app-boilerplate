import { useState, useEffect } from "react";
import { useFonts } from "expo-font";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { createCheckout, addItemToCheckout } from "../shopifyFunctions";
import { useDispatch, useSelector } from "react-redux";
import { setCheckout } from "../redux/checkoutSlice";

const TermsConditions = ({ navigation, route }) => {
  const { product } = route.params || {};
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const checkout = useSelector((state) => state.checkout.checkout);

  const updateQuantity = (text) => {
    // Only allow numeric input
    if (/^\d*$/.test(text)) {
      setQuantity(text);
    }
  };

  const addToCart = async () => {
    if (!product.availableForSale) {
      Alert.alert("Error", "This product is out of stock");
      return;
    }

    if (!quantity || parseInt(quantity) < 1) {
      Alert.alert("Error", "Please enter a valid quantity");
      return;
    }

    setLoading(true);
    try {
      let currentCheckout = checkout;
      
      // Create new checkout if one doesn't exist
      if (!currentCheckout) {
        currentCheckout = await createCheckout();
        dispatch(setCheckout(currentCheckout));
      }

      const lineItems = [
        {
          variantId: product.variants[0].id,
          quantity: parseInt(quantity),
        },
      ];

      const updatedCheckout = await addItemToCheckout(currentCheckout.id, lineItems);
      dispatch(setCheckout(updatedCheckout));
      
      Alert.alert("Success", "Product added to cart");
      navigation.navigate("Cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
      Alert.alert("Error", "Failed to add product to cart");
    } finally {
      setLoading(false);
    }
  };



  if (!product) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialIcons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>Terms & Conditions</Text>
          </View>
          
            <Text style={styles.sectionTitle}>1. General Terms</Text>
            <Text style={styles.text}>
              By accessing and using this app, you accept and agree to be bound by the terms and provisions of this agreement.
            </Text>
            
            <Text style={styles.sectionTitle}>2. Product Information</Text>
            <Text style={styles.text}>
              We strive to ensure all product information is accurate, but we cannot guarantee that all descriptions, colors, or other content are completely accurate or error-free.
            </Text>
            
            <Text style={styles.sectionTitle}>3. Purchases</Text>
            <Text style={styles.text}>
              All purchases are subject to availability. We reserve the right to discontinue any products at any time for any reason.
            </Text>
            
            <Text style={styles.sectionTitle}>4. Returns & Refunds</Text>
            <Text style={styles.text}>
              Please refer to our Return Policy for details about returning products and refunds.
            </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Calculate total available quantity
  const totalQuantity = product.variants?.reduce((sum, variant) => {
    return sum + (variant.inventoryQuantity || 0);
  }, 0) || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Product Details</Text>

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

        {/* Product Vendor */}
        {product.vendor && (
          <Text style={styles.productVendor}>Vendor: {product.vendor}</Text>
        )}

        {/* Product Type */}
        {product.productType && (
          <Text style={styles.productType}>Type: {product.productType}</Text>
        )}

        {/* Availability & Stock Quantity */}
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

        {/* Price */}
        {product.variants &&
          product.variants.length > 0 &&
          product.variants[0].price && (
            <Text style={styles.price}>
              Price: {product.variants[0].price.amount}{" "}
              {product.variants[0].price.currencyCode}
            </Text>
          )}

        {/* Description */}
        {product.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.sectionTitle}> Description </Text>
            <Text style={styles.description}>
              {product.description.replace(/<[^>]*>?/gm, "")}
            </Text>
          </View>
        )}

        {/* Quantity Input */}
          <Text style={styles.quantityLabel}>Quantity:</Text>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            value={quantity}
            onChangeText={updateQuantity}
          />

        {/* Add to Cart Button */}
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            !product.availableForSale && styles.disabledButton,
          ]}
          onPress={addToCart}
          disabled={!product.availableForSale || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.addToCartText}>
              {product.availableForSale ? "Add to Cart" : "Out of Stock"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Terms & Conditions Section */}
        <View style={styles.termsSection}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <Text style={styles.text}>
            By purchasing this product, you agree to our terms regarding returns, refunds, and product usage. All sales are final unless defective.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: {
    fontSize: 20,
    marginLeft: 15,
  },
  content: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 10,
    color: "#333",
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
    marginBottom: 10,
  },
  productImage: {
    width: "100%",
    height: 300,
    marginVertical: 15,
  },
  productTitle: {
    fontSize: 22,
    marginHorizontal: 15,
    marginBottom: 5,
    color: "#333",
  },
  productVendor: {
    fontSize: 16,
    marginHorizontal: 15,
    marginBottom: 3,
    color: "#666",
  },
  productType: {
    fontSize: 16,
    marginHorizontal: 15,
    marginBottom: 3,
    color: "#666",
  },
  stockContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 5,
  },
  availability: {
    fontSize: 16,
  },
  available: {
    color: "green",
  },
  unavailable: {
    color: "red",
  },
  stockQuantity: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  price: {
    fontSize: 18,
    marginHorizontal: 15,
    marginBottom: 15,
    color: "#333",
  },
  descriptionContainer: {
    marginHorizontal: 15,
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#555",
  },
  termsSection: {
    marginHorizontal: 15,
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  quantityLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 4,
    padding: 10,
    width: 60,
    textAlign: "center",
  },
  addToCartButton: {
    backgroundColor: "#007bff",
    padding: 15,
    marginHorizontal: 15,
    borderRadius: 4,
    alignItems: "center",
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default TermsConditions;