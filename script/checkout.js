// Fetches cart items to display on checkout page
document.addEventListener("DOMContentLoaded", () => {
  try {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const totalPrice = parseFloat(localStorage.getItem("totalPrice")) || 0;

    const checkoutContainer = document.getElementById("checkoutContainer");
    const checkoutTotal = document.getElementById("checkoutTotal");

    if (!checkoutContainer) {
      console.error("Checkout container element not found in DOM");
      return;
    }

    if (!checkoutTotal) {
      console.error("Checkout total element not found in DOM");
      return;
    }

    if (cartItems.length === 0) {
      checkoutContainer.innerHTML = "<p>Your cart is empty.</p>";
      checkoutTotal.textContent = "Total: £0.00";
    } else {
      cartItems.forEach(product => {
        if (!product.image || !product.image.url) {
          console.error("Product image URL is missing for product:", product);
          return;
        }
        
        if (typeof product.discountedPrice !== 'number') {
          console.error("Invalid discounted price for product:", product);
          return;
        }
        
        if (typeof product.quantity !== 'number' || product.quantity <= 0) {
          console.error("Invalid quantity for product:", product);
          return;
        }

        const item = document.createElement("div");
        item.classList.add("checkout-item");
        item.innerHTML = `
          <div class="checkout-item-inner">
            <img src="${product.image.url}" alt="${product.title}" />
            <div class="item-info">
              <h4>${product.title}</h4>
              <p>Price: £${product.discountedPrice.toFixed(2)}</p>
              <p>Quantity: ${product.quantity}</p>
              <p>Subtotal: £${(product.discountedPrice * product.quantity).toFixed(2)}</p>
            </div>
          </div>
        `;
        checkoutContainer.appendChild(item);
      });

      checkoutTotal.textContent = `Total: £${totalPrice.toFixed(2)}`;
    }

    const completeOrderButton = document.getElementById("completeOrderButton");
    if (completeOrderButton) {
      completeOrderButton.addEventListener("click", checkoutConfirm);
    } else {
      console.error("Complete order button not found in DOM");
    }
  } catch (error) {
    console.error("Error during checkout page initialization:", error);
  }
});

// Confirms checkout when clicking button and removes items from cart
function checkoutConfirm() {
  try {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    if (cartItems.length === 0) {
      console.error("Checkout attempted with empty cart");
      alert("No items in cart.");
      return;
    }

    localStorage.removeItem("cart");
    localStorage.removeItem("totalPrice");

    const checkoutContainer = document.getElementById("checkoutContainer");
    const checkoutTotal = document.getElementById("checkoutTotal");

    if (!checkoutContainer) {
      console.error("Checkout container element not found during confirmation");
      return;
    }

    if (!checkoutTotal) {
      console.error("Checkout total element not found during confirmation");
      return;
    }

    checkoutContainer.innerHTML = "<p>Your cart is now empty. Thank you for your order!</p>";
    checkoutTotal.textContent = "Total: £0.00";

    const cartMenu = document.getElementById("cartMenu");
    if (cartMenu) {
      cartMenu.style.display = "none";
    } else {
      console.error("Cart menu element not found during confirmation");
    }

    alert("Order completed successfully!");
  } catch (error) {
    console.error("Error during checkout confirmation:", error);
    alert("An error occurred during checkout. Please try again.");
  }
}