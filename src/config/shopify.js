/**
 * Shopify Storefront API configuration.
 *
 * Values are read from environment variables at build time. In Expo, any
 * variable prefixed with `EXPO_PUBLIC_` is inlined into the JS bundle, so put
 * them in a `.env` file at the project root (see `.env.example`).
 *
 * The Storefront Access Token is designed to be public (it is safe to ship in a
 * client app). Do NOT use the Admin API access token here.
 *
 * Where to find these:
 *   Shopify admin → Settings → Apps and sales channels → Develop apps →
 *   (your app) → API credentials → Storefront API access token.
 */

const PLACEHOLDER_DOMAIN = "your-store.myshopify.com";
const PLACEHOLDER_TOKEN = "your-storefront-access-token";

export const SHOPIFY_DOMAIN =
  process.env.EXPO_PUBLIC_SHOPIFY_DOMAIN || PLACEHOLDER_DOMAIN;

export const STOREFRONT_ACCESS_TOKEN =
  process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_TOKEN || PLACEHOLDER_TOKEN;

export const API_VERSION =
  process.env.EXPO_PUBLIC_SHOPIFY_API_VERSION || "2025-01";

/**
 * True once the developer has supplied real credentials. Screens use this to
 * show a friendly setup message instead of failing with a network error.
 */
export const isShopifyConfigured =
  SHOPIFY_DOMAIN !== PLACEHOLDER_DOMAIN &&
  STOREFRONT_ACCESS_TOKEN !== PLACEHOLDER_TOKEN;

export const STOREFRONT_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/${API_VERSION}/graphql.json`;
