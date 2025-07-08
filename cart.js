// Shopping Cart Manager Class
class CartManager {
  constructor() {
    this.cartItems = []
    this.init()
  }

  init() {
    this.loadCartFromStorage()
    this.updateCartUI()
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Cart button click
    document.getElementById("cartBtn").addEventListener("click", () => this.openCart())

    // Close cart events
    document.getElementById("closeCart").addEventListener("click", () => this.closeCart())
    document.getElementById("cartOverlay").addEventListener("click", () => this.closeCart())
    document.getElementById("continueShopping").addEventListener("click", () => this.closeCart())

    // Keyboard events
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeCart()
      }
    })
  }

  loadCartFromStorage() {
    const savedCart = localStorage.getItem("amazonClone_cart")
    if (savedCart) {
      try {
        this.cartItems = JSON.parse(savedCart)
      } catch (e) {
        console.error("Error loading cart from storage:", e)
        this.cartItems = []
      }
    }
  }

  saveCartToStorage() {
    localStorage.setItem("amazonClone_cart", JSON.stringify(this.cartItems))
  }

  openCart() {
    const sidebar = document.getElementById("cartSidebar")
    const panel = document.getElementById("cartPanel")

    sidebar.classList.remove("hidden")
    setTimeout(() => {
      panel.classList.remove("translate-x-full")
    }, 10)

    this.renderCartItems()
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  closeCart() {
    const sidebar = document.getElementById("cartSidebar")
    const panel = document.getElementById("cartPanel")

    panel.classList.add("translate-x-full")
    setTimeout(() => {
      sidebar.classList.add("hidden")
      document.body.style.overflow = "" // Restore scrolling
    }, 300)
  }

  addToCart(product) {
    if (!product || !product.id) {
      console.error("Invalid product data")
      return
    }

    const existingItem = this.cartItems.find((item) => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += 1
    } else {
      this.cartItems.push({
        ...product,
        quantity: 1,
        addedAt: new Date().toISOString(),
      })
    }

    this.saveCartToStorage()
    this.updateCartUI()
    this.showAddToCartNotification(product.title)
  }

  removeFromCart(productId) {
    const itemIndex = this.cartItems.findIndex((item) => item.id === productId)
    if (itemIndex > -1) {
      const removedItem = this.cartItems[itemIndex]
      this.cartItems.splice(itemIndex, 1)
      this.saveCartToStorage()
      this.updateCartUI()
      this.renderCartItems()
      this.showNotification(`Removed "${removedItem.title}" from cart`)
    }
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(productId)
      return
    }

    const item = this.cartItems.find((item) => item.id === productId)
    if (item) {
      item.quantity = quantity
      this.saveCartToStorage()
      this.updateCartUI()
      this.renderCartItems()
    }
  }

  getCartTotal() {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  getCartCount() {
    return this.cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  updateCartUI() {
    const cartCount = this.getCartCount()
    const cartCountElement = document.getElementById("cartCount")

    if (cartCount > 0) {
      cartCountElement.textContent = cartCount > 99 ? "99+" : cartCount
      cartCountElement.classList.remove("hidden")
    } else {
      cartCountElement.classList.add("hidden")
    }
  }

  renderCartItems() {
    const cartItemsContainer = document.getElementById("cartItems")
    const cartFooter = document.getElementById("cartFooter")
    const cartTotal = document.getElementById("cartTotal")

    if (this.cartItems.length === 0) {
      cartItemsContainer.innerHTML = this.getEmptyCartHTML()
      cartFooter.classList.add("hidden")
    } else {
      cartItemsContainer.innerHTML = this.cartItems.map((item) => this.createCartItemHTML(item)).join("")
      cartTotal.textContent = window.formatPrice(this.getCartTotal())
      cartFooter.classList.remove("hidden")
    }
  }

  getEmptyCartHTML() {
    return `
            <div class="text-center py-12">
                <i class="fas fa-shopping-cart text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg mb-4">Your cart is empty</p>
                <p class="text-gray-400 text-sm mb-6">Add some products to get started</p>
                <button onclick="cartManager.closeCart()" class="bg-orange-400 hover:bg-orange-500 text-gray-900 px-6 py-3 rounded-lg font-semibold transition-colors btn-hover">
                    Continue Shopping
                </button>
            </div>
        `
  }

  createCartItemHTML(item) {
    const discountPercentage = item.originalPrice
      ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
      : 0

    return `
            <div class="flex gap-3 p-4 border border-gray-200 rounded-lg mb-3 bg-white hover:shadow-md transition-shadow">
                <div class="flex-shrink-0">
                    <img src="${item.image}" alt="${item.title}" 
                         class="w-20 h-20 object-cover rounded-md"
                         onerror="this.src='https://via.placeholder.com/80x80?text=No+Image'">
                </div>
                
                <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-sm line-clamp-2 mb-2 text-gray-900">${item.title}</h3>
                    
                    <div class="flex items-center gap-2 mb-2">
                        <span class="font-bold text-lg text-gray-900">${window.formatPrice(item.price)}</span>
                        ${item.originalPrice ? `<span class="text-sm text-gray-500 line-through">${window.formatPrice(item.originalPrice)}</span>` : ""}
                        ${discountPercentage > 0 ? `<span class="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">${discountPercentage}% OFF</span>` : ""}
                    </div>

                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <button onclick="cartManager.updateQuantity('${item.id}', ${item.quantity - 1})" 
                                    class="w-8 h-8 border border-gray-300 hover:bg-gray-50 rounded-md flex items-center justify-center transition-colors ${item.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}"
                                    ${item.quantity <= 1 ? "disabled" : ""}>
                                <i class="fas fa-minus text-xs"></i>
                            </button>
                            
                            <span class="w-12 text-center py-1 border border-gray-300 rounded-md text-sm font-medium">${item.quantity}</span>
                            
                            <button onclick="cartManager.updateQuantity('${item.id}', ${item.quantity + 1})" 
                                    class="w-8 h-8 border border-gray-300 hover:bg-gray-50 rounded-md flex items-center justify-center transition-colors">
                                <i class="fas fa-plus text-xs"></i>
                            </button>
                        </div>

                        <button onclick="cartManager.removeFromCart('${item.id}')" 
                                class="text-red-500 hover:text-red-700 p-2 rounded-md hover:bg-red-50 transition-colors"
                                title="Remove from cart">
                            <i class="fas fa-trash text-sm"></i>
                        </button>
                    </div>

                    <div class="mt-2 text-xs text-gray-500">
                        Subtotal: ${window.formatPrice(item.price * item.quantity)}
                    </div>
                </div>
            </div>
        `
  }

  showAddToCartNotification(productTitle) {
    const message = `Added "${productTitle}" to cart`
    this.showNotification(message, "success")
  }

  showNotification(message, type = "success") {
    if (typeof window.showNotification === "function") {
      window.showNotification(message, type)
    }
  }

  clearCart() {
    this.cartItems = []
    this.saveCartToStorage()
    this.updateCartUI()
    this.renderCartItems()
    this.showNotification("Cart cleared successfully")
  }

  // Get cart items (for use by other modules)
  getCartItems() {
    return [...this.cartItems]
  }

  // Check if product is in cart
  isInCart(productId) {
    return this.cartItems.some((item) => item.id === productId)
  }

  // Get item quantity in cart
  getItemQuantity(productId) {
    const item = this.cartItems.find((item) => item.id === productId)
    return item ? item.quantity : 0
  }
}

// Initialize cart manager
const cartManager = new CartManager()

// Assuming formatPrice and showNotification are defined globally
window.formatPrice = (price) => {
  return `$${price.toFixed(2)}`
}

window.showNotification = (message, type) => {
  console.log(`Notification (${type}): ${message}`)
}

// Make cartManager globally available
window.cartManager = cartManager
