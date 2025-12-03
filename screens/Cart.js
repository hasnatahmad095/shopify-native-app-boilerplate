import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCheckout,
  updateLineItem,
  removeLineItem,
} from "../shopifyFunctions";
import { setCheckout } from "../redux/checkoutSlice";
import {
  getCountryFromIP,
  getExchangeRate,
  countryToCurrency,
} from "../utils/currencyUtils";

const Cart = ({ navigation }) => {
  const dispatch = useDispatch();
  const checkout = useSelector((state) => state.checkout.checkout);
  const [loading, setLoading] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);

  const [localCurrency, setLocalCurrency] = useState("USD");
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    if (checkout?.id) {
      refreshCheckout();
    }
  }, []);

  useEffect(() => {
    if (checkout?.id) {
      refreshCheckout();
    }

    const loadCurrency = async () => {
      const userCountry = await getCountryFromIP();
      const targetCurrency = countryToCurrency[userCountry] || "USD";

      const rate = await getExchangeRate("USD", targetCurrency);
      setLocalCurrency(targetCurrency);
      setExchangeRate(rate);
    };

    loadCurrency();
  }, []);

  const refreshCheckout = async () => {
    try {
      setLoading(true);
      const updatedCheckout = await fetchCheckout(checkout.id);

      // Update cart state to include webUrl
      const newCart = {
        ...updatedCheckout,
        checkoutUrl: updatedCheckout.webUrl,
      };

      dispatch(setCheckout(newCart));
    } catch (error) {
      console.error("Error refreshing checkout:", error);
      Alert.alert("Error", "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (lineItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(lineItemId);
      return;
    }

    try {
      setUpdatingItem(lineItemId);
      const lineItems = [
        {
          id: lineItemId,
          quantity: parseInt(newQuantity),
        },
      ];
      const updatedCheckout = await updateLineItem(checkout.id, lineItems);
      dispatch(
        setCheckout({
          ...updatedCheckout,
          checkoutUrl: updatedCheckout.webUrl,
        })
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      Alert.alert("Error", "Failed to update quantity");
    } finally {
      setUpdatingItem(null);
    }
  };

  const removeItem = async (lineItemId) => {
    try {
      setUpdatingItem(lineItemId);
      const lineItemIds = [lineItemId];
      const updatedCheckout = await removeLineItem(checkout.id, lineItemIds);
      dispatch(
        setCheckout({
          ...updatedCheckout,
          checkoutUrl: updatedCheckout.webUrl,
        })
      );
    } catch (error) {
      console.error("Error removing item:", error);
      Alert.alert("Error", "Failed to remove item");
    } finally {
      setUpdatingItem(null);
    }
  };

  const proceedToCheckout = () => {
    if (checkout?.checkoutUrl) {
      navigation.navigate("CheckoutWebView", { uri: checkout.checkoutUrl });
    }
  };

  if (!checkout || !checkout.lineItems || checkout.lineItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyCart}>
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.continueShopping}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={styles.title}>Your Cart</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" style={styles.loader} />
        ) : (
          <>
            {checkout.lineItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Image
                  source={{
                    uri: item.variant.image?.src || "https://placehold.co/100",
                  }}
                  style={styles.itemImage}
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                  {/* <Text style={styles.itemPrice}>
                    {`${(item.variant.price.amount * exchangeRate).toFixed(
                      0
                    )} ${localCurrency}`}
                  </Text> */}
                  <Text style={styles.itemPrice}>
                    {`${(item.variant.price.amount * exchangeRate).toFixed(
                      0
                    )} × ${item.quantity} = ${(
                      item.variant.price.amount *
                      exchangeRate *
                      item.quantity
                    ).toFixed(0)} ${localCurrency}`}
                  </Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updatingItem === item.id}
                    >
                      <Text style={styles.quantityButton}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.quantityText}>
                      {updatingItem === item.id ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        item.quantity
                      )}
                    </Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updatingItem === item.id}
                    >
                      <Text style={styles.quantityButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeItem}
                  onPress={() => removeItem(item.id)}
                  disabled={updatingItem === item.id}
                >
                  <MaterialIcons name="delete" size={20} color="red" />
                </TouchableOpacity>
              </View>
            ))}

            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                {(checkout.subtotalPrice.amount * exchangeRate).toFixed(0)}{" "}
                {localCurrency}
                {/* <Text style={styles.summaryValue}>                
                  {checkout.subtotalPrice.amount}{" "}
                  {checkout.subtotalPrice.currencyCode}
                </Text> */}
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>
                  {(checkout.totalTax.amount * exchangeRate).toFixed(0)}{" "}
                  {localCurrency}
                  {/* {checkout.totalTax.amount} {checkout.totalTax.currencyCode} */}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, styles.totalLabel]}>
                  Total
                </Text>
                <Text style={[styles.summaryValue, styles.totalValue]}>
                  {(checkout.totalPrice.amount * exchangeRate).toFixed(0)}{" "}
                  {localCurrency}
                  {/* {checkout.totalPrice.amount}{" "}
                  {checkout.totalPrice.currencyCode} */}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.checkoutButton}
              onPress={proceedToCheckout}
            >
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
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
    fontWeight: "bold",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyCartText: {
    fontSize: 18,
    marginBottom: 20,
  },
  continueShopping: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 4,
  },
  continueShoppingText: {
    color: "#fff",
    fontWeight: "bold",
  },
  cartItem: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 15,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginVertical: 5,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  quantityButton: {
    fontSize: 18,
    paddingHorizontal: 10,
    backgroundColor: "#eee",
    borderRadius: 4,
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  removeItem: {
    justifyContent: "center",
    paddingLeft: 10,
  },
  summary: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 10,
    borderRadius: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
  },
  totalLabel: {
    fontWeight: "bold",
  },
  totalValue: {
    fontWeight: "bold",
    color: "#007bff",
  },
  checkoutButton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 4,
    margin: 15,
    alignItems: "center",
  },
  checkoutButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  loader: {
    marginVertical: 20,
  },
});

export default Cart;
