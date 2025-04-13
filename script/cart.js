
let cart = [];
let totalPrice = 0;

// Fetches stored cart
try {
  const storedCart = localStorage.getItem('cart');
  if (storedCart !== null) {
    const parsedCart = JSON.parse(storedCart);
    if (Array.isArray(parsedCart)) {
      cart = parsedCart;
    } else {
      console.error('Stored cart is not an array:', parsedCart);
    }
  }
} catch (error) {
  console.error('Error parsing cart data from localStorage:', error);
}

// Fetches stored cart price
try {
  const storedTotalPrice = localStorage.getItem('totalPrice');
  if (storedTotalPrice !== null) {
    const parsedPrice = parseFloat(storedTotalPrice);
    if (!isNaN(parsedPrice)) {
      totalPrice = parsedPrice;
    } else {
      console.error('Stored totalPrice is not a valid number:', storedTotalPrice);
    }
  }
} catch (error) {
  console.error('Error parsing totalPrice data from localStorage:', error);
}

// Removes from cart
async function removeFromCart(productId) {
  if (!productId) {
    console.error('removeFromCart was called without a productId');
    return;
  }

  const productIndex = cart.findIndex(prod => prod.id === productId);
  if (productIndex > -1) {
    const removedProduct = cart.splice(productIndex, 1)[0];
    if (!removedProduct || typeof removedProduct.discountedPrice !== 'number') {
      console.error('Invalid product data while removing:', removedProduct);
      return;
    }

    totalPrice -= removedProduct.discountedPrice * removedProduct.quantity;
    updateLocalStorage();
    updateCartUI();
    alert(`${removedProduct.title} has been removed from your cart.`);
  } else {
    console.warn(`Product with ID ${productId} not found in cart.`);
  }
}

// Changes item quantity in cart
async function changeQuantity(productId, change) {
  if (!productId || typeof change !== 'number' || isNaN(change)) {
    console.error('changeQuantity called with invalid inputs:', productId, change);
    return;
  }

  const product = cart.find(prod => prod.id === productId);
  if (!product) {
    console.error(`Product with ID ${productId} not found in cart.`);
    return;
  }

  product.quantity += change;
  if (product.quantity < 1) product.quantity = 1;
  if (product.quantity > 10) product.quantity = 10;

  totalPrice = cart.reduce((sum, product) => {
    if (!product || typeof product.discountedPrice !== 'number' || typeof product.quantity !== 'number') {
      console.error('Invalid product data in cart:', product);
      return sum;
    }
    return sum + (product.discountedPrice * product.quantity);
  }, 0);

  updateLocalStorage();
  updateCartUI();
}

// Handles button interactions with loader
async function handleCartButtonClick(event) {
  const button = event.target;
  if (!button.dataset.id) {
    console.error('Cart button clicked without data-id');
    return;
  }

  const productId = button.dataset.id;

  await withGlobalLoader(async () => {
    if (button.classList.contains('increase') || button.classList.contains('decrease')) {
      const change = parseInt(button.dataset.change);
      if (isNaN(change)) {
        console.error('Invalid change value on button:', button.dataset.change);
        return;
      }
      await changeQuantity(productId, change);
    } else if (button.classList.contains('remove')) {
      await removeFromCart(productId);
    } else {
      console.warn('Unhandled cart button action');
    }
  });
}

// Toggles cart when clicked with loader
async function toggleCart() {
  withGlobalLoader(async () => {
    const cartMenu = document.getElementById('cartMenu');
    if (!cartMenu) {
      console.error('Cart menu element not found');
      return;
    }

    cartMenu.style.display = cartMenu.style.display === 'block' ? 'none' : 'block';
    updateCartUI();
  });
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
  const cartItemContainer = document.getElementById('cartItem');
  if (!cartItemContainer) {
    console.warn('Cart item container not found');
  } else {
    cartItemContainer.addEventListener('click', handleCartButtonClick);
  }

  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  if (addToCartButtons.length === 0) {
    console.warn('No add-to-cart buttons found on the page');
  }

  addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id');
      if (!productId) {
        console.error('Add to cart button missing data-id');
        return;
      }

      const product = window.products?.find(prod => prod.id === productId);
      if (!product) {
        console.error(`Product with ID ${productId} not found in window.products`);
        return;
      }

      withGlobalLoader(async () => {
        addToCart(product);
        await new Promise(resolve => setTimeout(resolve, 1000));
      });
    });
  });
});

// Add a product to the cart or increase quantity if it already exists
function addToCart(product) {
  if (!product) {
    console.error('addToCart called with no product');
    return;
  }

  if (!product.id) console.error('Product is missing ID:', product);
  if (typeof product.discountedPrice !== 'number') console.error('Product is missing or has invalid discountedPrice:', product);
  if (!product.image?.url) console.error('Product is missing image URL:', product);

  if (!product.id || typeof product.discountedPrice !== 'number' || !product.image?.url) return;

  const existingProductIndex = cart.findIndex(p => p.id === product.id);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  totalPrice = cart.reduce((sum, item) => {
    if (!item || typeof item.discountedPrice !== 'number' || typeof item.quantity !== 'number') {
      console.error('Invalid cart item while updating total:', item);
      return sum;
    }
    return sum + (item.discountedPrice * item.quantity);
  }, 0);

  updateLocalStorage();
  alert(`${product.title} has been added to your cart!`);

  const cartMenu = document.getElementById('cartMenu');
  if (cartMenu && cartMenu.style.display === 'block') {
    updateCartUI();
  }
}

// Update localStorage after added to cart
function updateLocalStorage() {
  try {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('totalPrice', totalPrice.toFixed(2));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Toggles menu in mobile view
function toggleMenu() {
  const offScreen = document.getElementById('offScreen');
  if (!offScreen) {
    console.error('Off-screen menu not found');
    return;
  }
  offScreen.classList.toggle('open');
}