
let cart = [];
let totalPrice = 0;

try {
  const storedCart = localStorage.getItem('cart');
  if (storedCart !== null) {
    cart = JSON.parse(storedCart);
  }
} catch (error) {
  console.error('Error parsing cart data from localStorage:', error);
}

try {
  const storedTotalPrice = localStorage.getItem('totalPrice');
  if (storedTotalPrice !== null) {
    totalPrice = parseFloat(storedTotalPrice);
  }
} catch (error) {
  console.error('Error parsing totalPrice data from localStorage:', error);
}

// Removes from cart
async function removeFromCart(productId) {
  const productIndex = cart.findIndex(prod => prod.id === productId);
  if (productIndex > -1) {
    const removedProduct = cart.splice(productIndex, 1)[0];
    totalPrice -= removedProduct.discountedPrice * removedProduct.quantity;
    updateLocalStorage();
    updateCartUI();
    alert(`${removedProduct.title} has been removed from your cart.`);
  }
}

async function changeQuantity(productId, change) {
  const product = cart.find(prod => prod.id === productId);
  if (!product) return;

  product.quantity += change;
  if (product.quantity < 1) product.quantity = 1;
  if (product.quantity > 10) product.quantity = 10;

  totalPrice = cart.reduce((sum, product) => sum + (product.discountedPrice * product.quantity), 0);
  updateLocalStorage();
  updateCartUI();
}

async function handleCartButtonClick(event) {
  const button = event.target;
  if (!button.dataset.id) return;

  const productId = button.dataset.id;

  await withGlobalLoader(async () => {
    if (button.classList.contains('increase') || button.classList.contains('decrease')) {
      const change = parseInt(button.dataset.change);
      await changeQuantity(productId, change);
    } else if (button.classList.contains('remove')) {
      await removeFromCart(productId);
    }
  });
}

async function toggleCart() {
  withGlobalLoader(async () => {
    const cartMenu = document.getElementById('cartMenu');
    if (cartMenu) {
      cartMenu.style.display = cartMenu.style.display === 'block' ? 'none' : 'block';
      updateCartUI();
    }
  });
}

// Initialize cart functionality
document.addEventListener('DOMContentLoaded', () => {
  // Handle cart item buttons
  const cartItemContainer = document.getElementById('cartItem');
  if (cartItemContainer) {
    cartItemContainer.addEventListener('click', handleCartButtonClick);
  }

  // Initialize any add-to-cart buttons on this page
  const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id');
      const product = window.products?.find(prod => prod.id === productId);
      if (product) {
        withGlobalLoader(() => new Promise(resolve => {
          addToCart(product);
          setTimeout(resolve, 1000);
        }));
      }
    });
  });
});

function addToCart(product) {
  if (!product || !product.id || !product.discountedPrice || !product.image?.url) return;

  const existingProductIndex = cart.findIndex(p => p.id === product.id);

  if (existingProductIndex > -1) {
    cart[existingProductIndex].quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }

  totalPrice = cart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
  updateLocalStorage();
  alert(`${product.title} has been added to your cart!`);

  const cartMenu = document.getElementById('cartMenu');
  if (cartMenu && cartMenu.style.display === 'block') {
    updateCartUI();
  }
}

// Update localStorage
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
  offScreen.classList.toggle('open');
}
