document.addEventListener("DOMContentLoaded", () => {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const totalPrice = parseFloat(localStorage.getItem("totalPrice")) || 0;
  
    const checkoutContainer = document.getElementById("checkoutContainer");
    const checkoutTotal = document.getElementById("checkoutTotal");
  
    if (cartItems.length === 0) {
      checkoutContainer.innerHTML = "<p>Your cart is empty.</p>";
      checkoutTotal.textContent = "Total: £0.00";
      return;
    }
  
    cartItems.forEach(product => {
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
});

function checkoutConfirm() {
  cart = [];
  totalPrice = 0;

  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  if (cartItems.length === 0) {
    alert("No items in cart.");
    return;
  }

  updateLocalStorage();

  const checkoutContainer = document.getElementById("checkoutContainer");
  const checkoutTotal = document.getElementById("checkoutTotal");

  if (checkoutContainer && checkoutTotal) {
    checkoutContainer.innerHTML = "<p>Your cart is now empty. Thank you for your order!</p>";
    checkoutTotal.textContent = "Total: £0.00";
  }

  const cartMenu = document.getElementById("cartMenu");
  if (cartMenu) {
    cartMenu.style.display = "none";
  }

  alert("Order completed successfully!");
}

document.addEventListener("DOMContentLoaded", () => {
  const completeOrderButton = document.getElementById("completeOrderButton");
  if (completeOrderButton) {
    completeOrderButton.addEventListener("click", checkoutConfirm);
  }
});
