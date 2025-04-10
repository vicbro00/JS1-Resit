let currentProduct = null;

// Get product ID from URL
function getProductIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Validates the Id
function isValidId(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

// Fetch product details from API
async function fetchProductDetails(productId) {
  if (!isValidId(productId)) {
    throw new Error('Invalid product ID format');
  }

  const apiUrl = `https://v2.api.noroff.dev/gamehub/${productId}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(response.status === 404
      ? `Product with ID ${productId} not found`
      : `HTTP error! Status: ${response.status}`);
  }

  const responseData = await response.json();
  if (!responseData.data) {
    throw new Error('Unexpected API response format');
  }

  return responseData.data;
}

// Display product details on page
function displayProductDetails(product) {
  currentProduct = product;
  const container = document.getElementById('productDetails');
  if (!container) return;

  if (!product || !product.title || !product.image) {
    container.innerHTML = '<p>Invalid product data</p>';
    return;
  }

  container.innerHTML = `
    <div class="product-detail-card">
      <img src="${product.image?.url || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${product.image?.alt || product.title}" class="product-image">
      <div class="product-info">
        <h2>${product.title}</h2>
        <p class="description">${product.description}</p>
        <p class="price">$${product.discountedPrice ?? product.price}</p>
        ${product.sizes ? `<p class="sizes">Sizes: ${product.sizes.join(', ')}</p>` : ''}
        ${product.baseColor ? `<p class="color">Color: ${product.baseColor}</p>` : ''}
        ${product.gender ? `<p class="gender">Gender: ${product.gender}</p>` : ''}
        <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
      </div>
    </div>
  `;

  const addToCartButton = container.querySelector('.add-to-cart-btn');
  if (addToCartButton) {
    addToCartButton.addEventListener('click', () => {
      if (currentProduct) {
        withGlobalLoader(() => new Promise(resolve => {
          addToCart(currentProduct);
          setTimeout(resolve, 1000);
        }));
      }
    });
  }
}

async function initializeProductPage() {
  const productId = getProductIdFromUrl();
  if (!productId) {
    window.location.href = '/products.html';
    return;
  }

  try {
    const product = await fetchProductDetails(productId);
    displayProductDetails(product);
  } catch (error) {
    console.error('Error loading product:', error);
    document.getElementById('productDetails').innerHTML = `
      <div class="error-message">
        <p>Failed to load product details.</p>
        <a href="/products.html" class="back-link">Return to products</a>
      </div>
    `;
  }
}

if (document.getElementById('productDetails')) {
  document.addEventListener('DOMContentLoaded', initializeProductPage);
}