import Client from 'shopify-buy';

const client = Client.buildClient({  
  domain: 'developmentstore84.myshopify.com', // Remove "https://" and trailing slash
  storefrontAccessToken: 'cb6b0d7e29788abaed48ed3c5f7f8b1e'
});

export async function fetchAllProducts() {
  try {
    const products = await client.product.fetchAll(250);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function fetchSingleProduct(productId) {
  try {
    const product = await client.product.fetch(productId);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

export async function createCheckout() {
  const checkout = await client.checkout.create();
  return checkout;
}

export async function addItemToCheckout(checkoutId, lineItems) {
  return client.checkout.addLineItems(checkoutId, lineItems);
}

export async function fetchCheckout(checkoutId) {
  return client.checkout.fetch(checkoutId);
}

export async function updateLineItem(checkoutId, lineItems) {
  return client.checkout.updateLineItems(checkoutId, lineItems);
}

export async function removeLineItem(checkoutId, lineItemIds) {
  return client.checkout.removeLineItems(checkoutId, lineItemIds);
}
