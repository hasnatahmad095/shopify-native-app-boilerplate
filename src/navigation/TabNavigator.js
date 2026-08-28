import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import ShopScreen from "../screens/ShopScreen";
import CartScreen from "../screens/CartScreen";
import AccountScreen from "../screens/AccountScreen";
import { selectCartCount } from "../redux/cartSlice";
import { colors } from "../theme";

const Tab = createBottomTabNavigator();

const ICONS = {
  Shop: "storefront-outline",
  Cart: "cart-outline",
  Account: "person-outline",
};

export default function TabNavigator() {
  // Re-renders when the count changes, which refreshes the Cart tab badge.
  const cartCount = useSelector(selectCartCount);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerTitleStyle: { color: colors.text },
        headerShadowVisible: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarIcon: ({ color, size }) => (
          <Ionicons name={ICONS[route.name]} size={size} color={color} />
        ),
      })}
    >
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{ tabBarBadge: cartCount > 0 ? cartCount : undefined }}
      />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
