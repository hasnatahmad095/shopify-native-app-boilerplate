# Shopify Native App — React Native (Expo) E-commerce Boilerplate

A clean starting point for a mobile storefront powered by **Shopify**. Products
are read through the **Storefront GraphQL API**, the cart uses the modern
**Cart API**, and checkout is handed off to **Shopify's hosted checkout** in a
WebView — so payments, shipping and taxes stay on Shopify's PCI-compliant flow.

## Features

- Product grid with pull-to-refresh and infinite scroll
- Product detail with variant/option selection and add-to-cart
- Cart with quantity updates, line removal and live totals
- Checkout via Shopify's hosted checkout (WebView), with automatic cart reset on
  order completion
- Cart persisted across app restarts (AsyncStorage)
- Bottom-tab navigation (Shop · Cart · Account) with a live cart badge
- Redux Toolkit state, centralized theme tokens, and friendly loading / error /
  empty / "setup required" states

## Tech stack

Expo SDK 53 · React Native 0.76 · React Navigation 7 (native-stack +
bottom-tabs) · Redux Toolkit · react-native-webview · Shopify Storefront API.

## Getting started

1. **Install dependencies**

   ```bash
   npm install
   ```

   If Expo reports a native-module version mismatch, align them with:

   ```bash
   npx expo install --fix
   ```

2. **Add your Shopify credentials**

   ```bash
   cp .env.example .env
   ```

   Then edit `.env`:

   - `EXPO_PUBLIC_SHOPIFY_DOMAIN` — e.g. `my-store.myshopify.com`
   - `EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` — your Storefront API access token
   - `EXPO_PUBLIC_SHOPIFY_API_VERSION` — optional, defaults to `2025-01`

   Get a Storefront token in the Shopify admin: **Settings → Apps and sales
   channels → Develop apps → (your app) → API credentials → Storefront API
   access token**. This token is public and safe to ship in a client app — do
   **not** use the Admin API token.

3. **Run**

   ```bash
   npx expo start -c
   ```

   The `-c` clears the Metro cache so newly added `.env` values are picked up.
   Press `i` (iOS), `a` (Android), or `w` (web).

> Until credentials are set, the Shop tab shows a "Connect your Shopify store"
> message instead of erroring.

## Project structure

```
App.js                     App providers + cart rehydration
src/
  config/shopify.js        Reads env vars, exposes domain/token/endpoint
  api/shopify.js           Storefront GraphQL client, product + cart operations
  redux/
    store.js               Redux Toolkit store
    cartSlice.js           Cart thunks (Cart API) + AsyncStorage persistence
  navigation/
    RootNavigator.js       Stack: Tabs, ProductDetail, Checkout
    TabNavigator.js        Bottom tabs: Shop, Cart, Account
  screens/
    ShopScreen.js          Product grid
    ProductDetailScreen.js Variant selection + add to cart
    CartScreen.js          Line items, totals, checkout button
    CheckoutScreen.js      Shopify hosted checkout (WebView)
    AccountScreen.js       Placeholder / extension point
  components/               ProductCard, QuantityStepper, ProductImage, StateViews
  theme/index.js           Colors, spacing, typography, money formatting
```

## How checkout works

The Cart API returns a `checkoutUrl` for the current cart. Tapping **Proceed to
checkout** opens that URL in a WebView (`CheckoutScreen`). When the customer
reaches Shopify's order-confirmation page, the app detects the "thank you" URL
and clears the local cart.

## Extending

- **Collections / search** — add Storefront queries and screens.
- **Customer accounts** — integrate the Storefront Customer API from the
  Account tab (login, order history, addresses).
- **Theming** — edit `src/theme/index.js`.
