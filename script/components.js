// Page transition loader control
function showPageTransitionLoader() {
    const loader = document.getElementById('pageTransitionLoader');
    if (loader) {
      loader.style.display = 'flex';
    }
  }
  
  function hidePageTransitionLoader() {
    const loader = document.getElementById('pageTransitionLoader');
    if (loader) {
      loader.style.display = 'none';
    }
  }
  
  // Intercept all link clicks
  document.addEventListener('DOMContentLoaded', () => {
    // Show loader when any link is clicked
    document.body.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (link && link.href && !link.href.includes('javascript:') && 
          link.target !== '_blank' && !link.hasAttribute('data-no-loader')) {
        event.preventDefault();
        showPageTransitionLoader();
        
        // Delay navigation slightly to allow loader to show
        setTimeout(() => {
          window.location.href = link.href;
        }, 1000);
      }
    });
  
    // Hide loader when page is fully loaded
    window.addEventListener('load', hidePageTransitionLoader);
  });
  
  // Also show loader when going back/forward
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      hidePageTransitionLoader();
    }
  });
  
  // Show loader
  function showLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
      console.log('Showing loader');
      loader.style.display = 'block';
    }
  }
  
  function hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) {
      console.log('Hiding loader');
      loader.style.display = 'none';
    }
  }
  
  // Wrapper to show loader during async actions
  async function withGlobalLoader(callback) {
    showLoader();
    const startTime = Date.now();
    
    try {
      const result = callback();
      const callbackResult = result instanceof Promise ? await result : result;
      
      // Calculate remaining time to reach 1 second
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsed);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      return callbackResult;
    } finally {
      hideLoader();
    }
  }
  
  // Render cart items
  function renderCartItems(cartItems) {
    const container = document.getElementById('cartItem');
    if (!container) return;
  
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
    renderCartItems(cart);
    const totalElement = document.getElementById('total');
    if (totalElement) {
      totalElement.textContent = `$${totalPrice.toFixed(2)}`;
    }
  }