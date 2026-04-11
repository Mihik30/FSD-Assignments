// Cart state management
let cart = JSON.parse(localStorage.getItem('atlas-cart')) || [];

// DOM Elements
const cartCountElement = document.querySelector('.cart-count');
const cartItemsContainer = document.getElementById('cart-items');
const clearCartBtn = document.getElementById('clear-cart');
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

// Initialize UI
function init() {
  updateCartUI();
  setupEventListeners();
}

// Setup Event Listeners
function setupEventListeners() {
  addToCartButtons.forEach(button => {
    button.addEventListener('click', () => {
      const name = button.getAttribute('data-name');
      const price = button.getAttribute('data-price');
      addToCart({ name, price });
      
      // Visual feedback
      const originalText = button.textContent;
      button.textContent = 'Added!';
      button.style.backgroundColor = '#10b981';
      button.style.color = 'white';
      
      setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
        button.style.color = '';
      }, 1000);
    });
  });

  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }
}

// Add item to cart
function addToCart(item) {
  cart.push(item);
  saveCart();
  updateCartUI();
}

// Clear cart
function clearCart() {
  cart = [];
  saveCart();
  updateCartUI();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem('atlas-cart', JSON.stringify(cart));
}

// Update UI
function updateCartUI() {
  // Update count in header
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
  }

  // Update cart preview list
  if (cartItemsContainer) {
    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<li class="empty-msg">Your cart is empty.</li>';
    } else {
      cartItemsContainer.innerHTML = cart.map((item, index) => `
        <li>
          <span>${item.name}</span>
          <strong>${item.price}</strong>
        </li>
      `).join('');
    }
  }
}

// Start the app
init();
