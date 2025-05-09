// Fetches products from api
const fetchDataWithTimeout = (url, options, timeout = 5000) => 
  Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), timeout))
  ]);

async function fetchProducts() {
  try {
    const response = await fetchDataWithTimeout('https://v2.api.noroff.dev/gamehub');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching products:', error);

    const container = document.getElementById('cardsContainer');
    if (container) {
      container.innerHTML = '<p>Failed to load products. Please try again later.</p>';
    } else {
      console.error('Cards container not found when handling fetch error');
    }
    return null;
  }
}
  
// Displays products on the page
function displayProducts(products) {
  const container = document.getElementById('cardsContainer');
  if (!container) {
    console.error('Cards container not found');
    return;
  }

  if (!products || products.length === 0) {
    console.error('No products available to display');
    container.innerHTML = '<p>No products found.</p>';
    return;
  }

  container.innerHTML = '';
  products.forEach(product => {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');

    const productLink = document.createElement('a');
    productLink.href = `/JS1-Resit/product/index.html?id=${product.id}`;
    productLink.classList.add('product-link');

    productLink.innerHTML = `
      <img src="${product.image?.url || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="${product.title}">
      <h4>${product.title}</h4>
    `;

    const productInfo = document.createElement('div');
    productInfo.classList.add('product-info');
    productInfo.innerHTML = `
      <p class="price">$${product.discountedPrice}</p>
      <button class="add-to-cart-btn" data-id="${product.id}">Add to cart</button>
    `;

    productCard.appendChild(productLink);
    productCard.appendChild(productInfo);
    container.appendChild(productCard);
  });

  setupAddToCartButtons(products);
}
  
// Setup add to cart buttons
function setupAddToCartButtons(products) {
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = event.target.getAttribute('data-id');
      const product = products.find(prod => prod.id === productId);

      if (!product) {
        console.error(`Product with id ${productId} not found in products list`);
        return;
      }

      withGlobalLoader(() => new Promise(resolve => {
        addToCart(product);
        setTimeout(resolve, 1000);
      }));
    });
  });
}
  
// Filters products on the page
function filterProducts(products, criteria) {
  if (criteria === 'all') return products;

  return products.filter(product => {
    if (criteria === 'onSale') {
      return product.onSale === true;
    }

    const genreMatch = product.genre?.toLowerCase() === criteria.toLowerCase();
    const tagsMatch = product.tags?.some(tag => tag.toLowerCase() === criteria.toLowerCase());

    return genreMatch || tagsMatch;
  });
}
  
// Filters based on clicked buttons
async function setupFilterButtons(products) {
  document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', (event) => {
      const criteria = event.target.getAttribute('data-name');
      document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      event.target.classList.add('active');

      withGlobalLoader(() => new Promise(resolve => {
        const filteredProducts = filterProducts(products, criteria);
        if (filteredProducts.length === 0) {
          console.error(`No products found for filter criteria: ${criteria}`);
        }
        displayProducts(filteredProducts);
        setTimeout(resolve, 1000);
      }));
    });
  });
}
  
document.addEventListener('DOMContentLoaded', async () => {
  const products = await fetchProducts();
  if (products) {
    displayProducts(products);
    setupFilterButtons(products);
  }
});