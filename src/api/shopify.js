/**
 * Thin Shopify Storefront GraphQL client.
 *
 * Uses the modern Cart API (not the deprecated Checkout API). Carts expose a
 * `checkoutUrl` that we open in a WebView so the customer completes payment on
 * Shopify's own hosted, PCI-compliant checkout.
 *
 * Docs: https://shopify.dev/docs/api/storefront/latest/objects/Cart
 */

import {
  STOREFRONT_ENDPOINT,
  STOREFRONT_ACCESS_TOKEN,
} from "../config/shopify";

async function storefront(query, variables = {}) {
  let response;
  try {
    response = await fetch(STOREFRONT_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (networkError) {
    throw new Error(
      "Could not reach Shopify. Check your network connection and store domain."
    );
  }

  const json = await response.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join("\n"));
  }

  return json.data;
}

/* -------------------------------------------------------------------------- */
/* Reusable GraphQL fragments                                                 */
/* -------------------------------------------------------------------------- */

const MONEY_FRAGMENT = /* GraphQL */ `
  fragment Money on MoneyV2 {
    amount
    currencyCode
  }
`;

const CART_FRAGMENT = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { ...Money }
      totalTaxAmount { ...Money }
      totalAmount { ...Money }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount { ...Money }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              image { url altText }
              price { ...Money }
              product { title handle }
            }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

/* -------------------------------------------------------------------------- */
/* Products                                                                   */
/* -------------------------------------------------------------------------- */

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $after: String) {
    products(first: $first, after: $after, sortKey: BEST_SELLING) {
      pageInfo { hasNextPage endCursor }
      edges {
        node {
          id
          title
          handle
          featuredImage { url altText }
          priceRange {
            minVariantPrice { ...Money }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

export async function fetchProducts({ first = 20, after = null } = {}) {
  const data = await storefront(PRODUCTS_QUERY, { first, after });
  const { edges, pageInfo } = data.products;
  return {
    products: edges.map((edge) => edge.node),
    pageInfo,
  };
}

const PRODUCT_QUERY = /* GraphQL */ `
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      images(first: 10) {
        edges { node { url altText } }
      }
      options {
        id
        name
        values
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price { ...Money }
            selectedOptions { name value }
            image { url altText }
          }
        }
      }
    }
  }
  ${MONEY_FRAGMENT}
`;

export async function fetchProductByHandle(handle) {
  const data = await storefront(PRODUCT_QUERY, { handle });
  const product = data.product;
  if (!product) return null;
  return {
    ...product,
    images: product.images.edges.map((e) => e.node),
    variants: product.variants.edges.map((e) => e.node),
  };
}

/* -------------------------------------------------------------------------- */
/* Cart                                                                       */
/* -------------------------------------------------------------------------- */

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]) {
    cartCreate(input: { lines: $lines }) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_QUERY = /* GraphQL */ `
  query Cart($id: ID!) {
    cart(id: $id) { ...CartFields }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_ADD = /* GraphQL */ `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_UPDATE = /* GraphQL */ `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

const CART_LINES_REMOVE = /* GraphQL */ `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ...CartFields }
      userErrors { field message }
    }
  }
  ${CART_FRAGMENT}
`;

function throwOnUserErrors(userErrors) {
  if (userErrors?.length) {
    throw new Error(userErrors.map((e) => e.message).join("\n"));
  }
}

export async function createCart(lines = []) {
  const data = await storefront(CART_CREATE, { lines });
  throwOnUserErrors(data.cartCreate.userErrors);
  return data.cartCreate.cart;
}

export async function getCart(cartId) {
  const data = await storefront(CART_QUERY, { id: cartId });
  return data.cart; // null if the cart has expired or been completed
}

export async function addCartLines(cartId, lines) {
  const data = await storefront(CART_LINES_ADD, { cartId, lines });
  throwOnUserErrors(data.cartLinesAdd.userErrors);
  return data.cartLinesAdd.cart;
}

export async function updateCartLines(cartId, lines) {
  const data = await storefront(CART_LINES_UPDATE, { cartId, lines });
  throwOnUserErrors(data.cartLinesUpdate.userErrors);
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(cartId, lineIds) {
  const data = await storefront(CART_LINES_REMOVE, { cartId, lineIds });
  throwOnUserErrors(data.cartLinesRemove.userErrors);
  return data.cartLinesRemove.cart;
}

/**
 * Normalizes a raw Cart object's line edges into a flat array for the UI.
 */
export function getCartLines(cart) {
  if (!cart?.lines?.edges) return [];
  return cart.lines.edges.map((edge) => edge.node);
}
