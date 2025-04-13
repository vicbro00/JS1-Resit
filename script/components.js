// Page transition loader
function showPageTransitionLoader() {
  const loader = document.getElementById('pageTransitionLoader');
  if (loader) {
      loader.style.display = 'flex';
  } else {
      console.error('Page transition loader element not found');
  }
}
  
function hidePageTransitionLoader() {
  const loader = document.getElementById('pageTransitionLoader');
  if (loader) {
      loader.style.display = 'none';
  } else {
      console.error('Page transition loader element not found');
  }
}
  
document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && link.href && !link.href.includes('javascript:') && 
          link.target !== '_blank' && !link.hasAttribute('data-no-loader')) {
          event.preventDefault();
          showPageTransitionLoader();

          setTimeout(() => {
              window.location.href = link.href;
          }, 1000);
      }
  });

  window.addEventListener('load', hidePageTransitionLoader);
});
  
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
      hidePageTransitionLoader();
  }
});
  
  // Show loader
function showLoader() {
  const loader = document.getElementById('globalLoader');
  if (loader) {
      loader.style.display = 'block';
  } else {
      console.error('Global loader element not found');
  }
}
  
  // Hide loader
function hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        loader.style.display = 'none';
    } else {
        console.error('Global loader element not found');
    }
}
  
// Shows loader on async actions
async function withGlobalLoader(callback) {
  showLoader();
  const startTime = Date.now();

  try {
      const result = callback();
      const callbackResult = result instanceof Promise ? await result : result;

      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsed);

      if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      return callbackResult;
  } catch (error) {
      console.error('Error during async action:', error);
  } finally {
      hideLoader();
  }
}

// Render cart items
function renderCartItems(cartItems) {
  const container = document.getElementById('cartItem');
  if (!container) {
      console.error('Cart item container not found');
      return;
  }

  container.innerHTML = '';

  if (!cartItems || cartItems.length === 0) {
      container.innerHTML = '<p>Your cart is empty</p>';
      return;
  }

  cartItems.forEach(product => {
      const productInCart = document.createElement('div');
      productInCart.classList.add('cart-item');
      productInCart.innerHTML = `
          <img src="${product.image.url}" alt="${product.title}">
          <h4>${product.title}</h4>
          <p>Price: $${(product.discountedPrice * product.quantity).toFixed(2)}</p>
          <div>
              <button class="decrease" data-id="${product.id}" data-change="-1">-</button>
              x${product.quantity}
              <button class="increase" data-id="${product.id}" data-change="1">+</button>
          </div>
          <button class="remove" data-id="${product.id}">Remove</button>
      `;
      container.appendChild(productInCart);
  });
}
  
// Update cart UI
function updateCartUI() {
    if (!Array.isArray(cart)) {
        console.error('Cart is not an array:', cart);
        return;
    }

    renderCartItems(cart);

    const totalElement = document.getElementById('total');
    if (totalElement) {
        totalElement.textContent = `$${totalPrice.toFixed(2)}`;
    } else {
        console.error('Total element not found');
    }
}