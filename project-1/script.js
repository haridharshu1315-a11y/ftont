let cartCount = 0;

function addToCart(button) {
  cartCount++;
  document.getElementById("cart-count").textContent = cartCount;

  const product = button.closest('.product');
  const name = product.getAttribute("data-name");
  const price = product.getAttribute("data-price");

  console.log(`Added to cart: ${name} - $${price}`);
  let cart = [];

// Add product to cart
function addToCart(button) {
  const productDiv = button.closest('.product');
  const name = productDiv.dataset.name;
  let price = productDiv.dataset.price;

  // Remove commas from price string and convert to number
  price = Number(price.replace(/,/g, ''));

  // Check if item is already in cart
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartCount();
  alert(`${name} added to cart`);
}

// Update cart count in header
function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count').textContent = count;
}

// Show cart modal
document.getElementById('cart').addEventListener('click', showCart);

function showCart() {
  const cartModal = document.getElementById('cart-modal');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');

  // Clear previous list
  cartItems.innerHTML = '';

  let total = 0;

  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price.toLocaleString()} x ${item.quantity}`;
    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = total.toLocaleString();
  cartModal.style.display = 'block';
}

// Close cart modal
function closeCart() {
  document.getElementById('cart-modal').style.display = 'none';
}


}
function addToCart(name, price, index) {
  const qty = parseInt(document.getElementById(`qty-${index}`).value);

  if (!qty || qty < 1) {
    showToast("⚠️ Please enter a valid quantity!");
    return;
  }

  const existing = cart.find(item => item.name === name);
  const addButton = document.querySelectorAll(".product button")[index * 2]; // First button (Add to Cart)

  if (existing) {
    // Show warning instead of adding again
    showToast("⚠️ This item is already in your cart!");
    addButton.style.background = "#999";
    addButton.textContent = "Already Added";
    return;
  }

  // Add new item to cart
  cart.push({ name, price, quantity: qty });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  // Success feedback
  showToast(`${qty} × ${name} added to cart!`);
  addButton.style.background = "#999";
  addButton.textContent = "Added";
}

