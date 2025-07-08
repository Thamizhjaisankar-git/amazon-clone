// Main Application Class
class ECommerceApp {
  constructor(products, calculateDiscount, cartManager, formatPrice) {
    this.allProducts = [...products]
    this.filteredProducts = [...products]
    this.currentCategory = "All"
    this.searchQuery = ""
    this.wishlist = []
    this.isLoading = false
    this.calculateDiscount = calculateDiscount
    this.cartManager = cartManager
    this.formatPrice = formatPrice
    this.init()
  }

  init() {
    this.loadWishlist()
    this.setupEventListeners()
    this.showLoadingSkeleton()

    // Simulate initial loading
    setTimeout(() => {
      this.hideLoadingSkeleton()
      this.renderProducts()
      this.updateResultsCount()
    }, 1500)
  }

  setupEventListeners() {
    // Search functionality
    document.getElementById("searchInput").addEventListener(
      "input",
      this.debounce((e) => {
        this.searchQuery = e.target.value
        this.filterProducts()
      }, 300),
    )

    document.getElementById("searchBtn").addEventListener("click", () => this.filterProducts())

    // Category selection
    document.getElementById("categorySelect").addEventListener("change", (e) => {
      this.currentCategory = e.target.value
      this.filterProducts()
      this.updateActiveCategory()
    })

    // Navigation category buttons
    document.querySelectorAll(".nav-category").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.currentCategory = e.target.dataset.category
        document.getElementById("categorySelect").value = this.currentCategory
        this.filterProducts()
        this.updateActiveCategory(e.target)
      })
    })

    // Mobile menu toggle
    document.getElementById("mobileMenuBtn").addEventListener("click", () => {
      const mobileNav = document.getElementById("mobileNavigation")
      mobileNav.classList.toggle("hidden")
    })

    // Clear filters
    document.getElementById("clearFilters").addEventListener("click", () => this.clearFilters())

    // Enter key for search
    document.getElementById("searchInput").addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.filterProducts()
      }
    })

    // Wishlist button
    document.getElementById("wishlistBtn").addEventListener("click", () => this.showWishlist())
  }

  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  filterProducts() {
    if (this.isLoading) return

    this.isLoading = true
    this.showLoadingSkeleton()

    // Simulate API call delay
    setTimeout(() => {
      let filtered = [...this.allProducts]

      // Filter by category
      if (this.currentCategory !== "All") {
        filtered = filtered.filter((product) => product.category === this.currentCategory)
      }

      // Filter by search query
      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        filtered = filtered.filter(
          (product) =>
            product.title.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            product.category.toLowerCase().includes(query),
        )
      }

      this.filteredProducts = filtered
      this.hideLoadingSkeleton()
      this.renderProducts()
      this.updateResultsCount()
      this.updateSectionTitle()
      this.isLoading = false
    }, 500)
  }

  renderProducts() {
    const productGrid = document.getElementById("productGrid")
    const noResults = document.getElementById("noResults")

    if (this.filteredProducts.length === 0) {
      productGrid.innerHTML = ""
      noResults.classList.remove("hidden")
    } else {
      noResults.classList.add("hidden")
      productGrid.innerHTML = this.filteredProducts.map((product) => this.createProductCard(product)).join("")
    }
  }

  createProductCard(product) {
    const discountPercentage = this.calculateDiscount(product.originalPrice, product.price)
    const isWishlisted = this.wishlist.includes(product.id)
    const inCart = this.cartManager.isInCart(product.id)
    const cartQuantity = this.cartManager.getItemQuantity(product.id)

    return `
            <div class="bg-white rounded-lg shadow-md overflow-hidden product-card group">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" 
                         alt="${product.title}" 
                         class="w-full h-48 object-cover product-image transition-transform duration-300"
                         onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                    
                    <!-- Badges -->
                    <div class="absolute top-2 left-2 flex flex-col gap-1">
                        ${discountPercentage > 0 ? `<span class="badge bg-red-500 text-white">-${discountPercentage}%</span>` : ""}
                        ${product.fastDelivery ? '<span class="badge bg-orange-500 text-white">Fast Delivery</span>' : ""}
                        ${!product.inStock ? '<span class="badge bg-gray-500 text-white">Out of Stock</span>' : ""}
                        ${inCart ? '<span class="badge bg-green-500 text-white">In Cart</span>' : ""}
                    </div>

                    <!-- Wishlist Button -->
                    <button onclick="app.toggleWishlist('${product.id}')" 
                            class="absolute top-2 right-2 w-10 h-10 bg-white bg-opacity-90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                            title="${isWishlisted ? "Remove from wishlist" : "Add to wishlist"}">
                        <i class="fas fa-heart ${isWishlisted ? "text-red-500" : "text-gray-400"}"></i>
                    </button>
                </div>

                <div class="p-4">
                    <h3 class="font-semibold text-sm mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors cursor-pointer"
                        onclick="app.showProductDetails('${product.id}')">
                        ${product.title}
                    </h3>

                    <!-- Rating -->
                    <div class="flex items-center gap-1 mb-2">
                        <div class="flex text-sm">
                            ${this.renderStars(product.rating)}
                        </div>
                        <span class="text-sm text-gray-600">(${product.reviews.toLocaleString()})</span>
                    </div>

                    <!-- Price -->
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-lg font-bold text-gray-900">${this.formatPrice(product.price)}</span>
                        ${product.originalPrice ? `<span class="text-sm text-gray-500 line-through">${this.formatPrice(product.originalPrice)}</span>` : ""}
                    </div>

                    <!-- Description -->
                    <p class="text-xs text-gray-600 line-clamp-2 mb-4">${product.description}</p>

                    <!-- Add to Cart Button -->
                    <div class="space-y-2">
                        <button onclick="app.addToCart('${product.id}')" 
                                class="w-full bg-orange-400 hover:bg-orange-500 text-gray-900 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 btn-hover ${!product.inStock ? "opacity-50 cursor-not-allowed" : ""}"
                                ${!product.inStock ? "disabled" : ""}>
                            <i class="fas fa-shopping-cart"></i>
                            ${product.inStock ? "Add to Cart" : "Out of Stock"}
                        </button>
                        
                        ${inCart ? `<div class="text-center text-sm text-green-600 font-medium">✓ ${cartQuantity} in cart</div>` : ""}
                    </div>
                </div>
            </div>
        `
  }

  renderStars(rating) {
    let stars = ""
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars += '<i class="fas fa-star star-filled"></i>'
      } else if (i - 0.5 <= rating) {
        stars += '<i class="fas fa-star-half-alt star-filled"></i>'
      } else {
        stars += '<i class="far fa-star star-empty"></i>'
      }
    }
    return stars
  }

  addToCart(productId) {
    const product = this.allProducts.find((p) => p.id === productId)
    if (product && product.inStock) {
      this.cartManager.addToCart(product)
      this.renderProducts() // Re-render to update "In Cart" badges
    }
  }

  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId)
    if (index > -1) {
      this.wishlist.splice(index, 1)
      this.showNotification("Removed from wishlist")
    } else {
      this.wishlist.push(productId)
      this.showNotification("Added to wishlist")
    }
    this.saveWishlist()
    this.updateWishlistUI()
    this.renderProducts() // Re-render to update heart icons
  }

  showProductDetails(productId) {
    const product = this.allProducts.find((p) => p.id === productId)
    if (product) {
      alert(
        `Product Details:\n\nTitle: ${product.title}\nPrice: ${this.formatPrice(product.price)}\nCategory: ${product.category}\nRating: ${product.rating}/5 (${product.reviews} reviews)\n\nDescription: ${product.description}`,
      )
    }
  }

  showWishlist() {
    if (this.wishlist.length === 0) {
      alert("Your wishlist is empty!\nStart adding products to your wishlist by clicking the heart icon.")
      return
    }

    const wishlistProducts = this.allProducts.filter((p) => this.wishlist.includes(p.id))
    const wishlistText = wishlistProducts.map((p) => `• ${p.title} - ${this.formatPrice(p.price)}`).join("\n")
    alert(`Your Wishlist (${this.wishlist.length} items):\n\n${wishlistText}`)
  }

  updateResultsCount() {
    const resultsCount = document.getElementById("resultsCount")
    const count = this.filteredProducts.length
    let text = `${count} result${count !== 1 ? "s" : ""}`

    if (this.searchQuery.trim()) {
      text += ` for "${this.searchQuery}"`
    }

    resultsCount.textContent = text
  }

  updateSectionTitle() {
    const sectionTitle = document.getElementById("sectionTitle")
    if (this.currentCategory === "All") {
      sectionTitle.textContent = this.searchQuery ? "Search Results" : "Featured Products"
    } else {
      sectionTitle.textContent = this.currentCategory
    }
  }

  updateActiveCategory(activeBtn = null) {
    document.querySelectorAll(".nav-category").forEach((btn) => {
      btn.classList.remove("text-orange-400")
    })

    if (activeBtn) {
      activeBtn.classList.add("text-orange-400")
    } else {
      // Find and highlight the current category button
      document.querySelectorAll(".nav-category").forEach((btn) => {
        if (btn.dataset.category === this.currentCategory) {
          btn.classList.add("text-orange-400")
        }
      })
    }
  }

  clearFilters() {
    this.searchQuery = ""
    this.currentCategory = "All"
    document.getElementById("searchInput").value = ""
    document.getElementById("categorySelect").value = "All"
    document.querySelectorAll(".nav-category").forEach((btn) => {
      btn.classList.remove("text-orange-400")
    })
    this.filterProducts()
  }

  loadWishlist() {
    const savedWishlist = localStorage.getItem("amazonClone_wishlist")
    if (savedWishlist) {
      try {
        this.wishlist = JSON.parse(savedWishlist)
      } catch (e) {
        console.error("Error loading wishlist:", e)
        this.wishlist = []
      }
    }
    this.updateWishlistUI()
  }

  saveWishlist() {
    localStorage.setItem("amazonClone_wishlist", JSON.stringify(this.wishlist))
  }

  updateWishlistUI() {
    const wishlistCount = document.getElementById("wishlistCount")
    const count = this.wishlist.length

    if (count > 0) {
      wishlistCount.textContent = count > 99 ? "99+" : count
      wishlistCount.classList.remove("hidden")
    } else {
      wishlistCount.classList.add("hidden")
    }
  }

  showLoadingSkeleton() {
    const skeleton = document.getElementById("loadingSkeleton")
    const productGrid = document.getElementById("productGrid")

    // Create skeleton cards
    skeleton.innerHTML = Array(8)
      .fill()
      .map(
        () => `
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="skeleton h-48 w-full"></div>
                <div class="p-4">
                    <div class="skeleton h-4 w-3/4 mb-2"></div>
                    <div class="skeleton h-3 w-1/2 mb-2"></div>
                    <div class="skeleton h-4 w-1/4 mb-4"></div>
                    <div class="skeleton h-10 w-full"></div>
                </div>
            </div>
        `,
      )
      .join("")

    skeleton.classList.remove("hidden")
    productGrid.classList.add("hidden")
  }

  hideLoadingSkeleton() {
    const skeleton = document.getElementById("loadingSkeleton")
    const productGrid = document.getElementById("productGrid")

    skeleton.classList.add("hidden")
    productGrid.classList.remove("hidden")
  }

  showNotification(message, type = "success") {
    if (typeof window.showNotification === "function") {
      window.showNotification(message, type)
    } else {
      // Fallback notification system
      this.createNotification(message, type)
    }
  }

  createNotification(message, type = "success") {
    const notification = document.getElementById("notification")
    const notificationText = document.getElementById("notificationText")

    // Update notification content
    notificationText.textContent = message

    // Update notification style based on type
    const notificationDiv = notification.querySelector("div")
    notificationDiv.className = `px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
          ? "bg-red-500 text-white"
          : "bg-blue-500 text-white"
    }`

    // Show notification
    notification.classList.remove("translate-x-full")

    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.add("translate-x-full")
    }, 3000)
  }
}

// Global notification function
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification")
  const notificationText = document.getElementById("notificationText")

  if (notification && notificationText) {
    notificationText.textContent = message

    const notificationDiv = notification.querySelector("div")
    notificationDiv.className = `px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
      type === "success"
        ? "bg-green-500 text-white"
        : type === "error"
          ? "bg-red-500 text-white"
          : "bg-blue-500 text-white"
    }`

    notification.classList.remove("translate-x-full")

    setTimeout(() => {
      notification.classList.add("translate-x-full")
    }, 3000)
  }
}

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Ensure all dependencies are available
  const products = window.products || []
  const calculateDiscount = window.calculateDiscount || ((originalPrice, price) => 0)
  const cartManager = window.cartManager || {
    isInCart: () => false,
    getItemQuantity: () => 0,
    addToCart: () => {},
    updateCartUI: () => {},
  }
  const formatPrice = window.formatPrice || ((price) => price.toFixed(2))

  if (
    typeof products === "undefined" ||
    typeof calculateDiscount === "undefined" ||
    typeof cartManager === "undefined" ||
    typeof formatPrice === "undefined"
  ) {
    console.error("Dependencies not loaded properly")
    return
  }

  // Initialize the main application with proper dependencies
  window.app = new ECommerceApp(products, calculateDiscount, cartManager, formatPrice)

  // Show welcome message
  setTimeout(() => {
    showNotification("Welcome to AmazonClone! Start shopping now.", "success")
  }, 2000)
})

// Handle page visibility changes
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    // Refresh cart and wishlist counts when page becomes visible
    if (window.cartManager) {
      window.cartManager.updateCartUI()
    }
    if (window.app) {
      window.app.updateWishlistUI()
    }
  }
})

// Handle online/offline status
window.addEventListener("online", () => {
  window.showNotification("You are back online!", "success")
})

window.addEventListener("offline", () => {
  window.showNotification("You are offline. Some features may not work.", "error")
})
