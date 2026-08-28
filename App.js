import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider, useDispatch } from "react-redux";
import { store } from "./src/redux/store";
import { initCart } from "./src/redux/cartSlice";
import { isShopifyConfigured } from "./src/config/shopify";
import RootNavigator from "./src/navigation/RootNavigator";

function AppContent() {
  const dispatch = useDispatch();

  // Rehydrate the persisted cart once on launch.
  useEffect(() => {
    if (isShopifyConfigured) {
      dispatch(initCart());
    }
  }, [dispatch]);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
