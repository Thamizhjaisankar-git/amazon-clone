"use client"

import { useState, useEffect } from "react"
import { Search, ShoppingCart, User, Heart, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import ProductCard from "./components/product-card"
import CartSidebar from "./components/cart-sidebar"
import AuthModal from "./components/auth-modal"
import { useCart } from "./hooks/use-cart"
import { useAuth } from "./hooks/use-auth"
import type { Product } from "./types"

const categories = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Beauty", "Toys"]

const featuredProducts: Product[] = [
  {
    id: "1",
    title: "Wireless Bluetooth Headphones",
    price: 79.99,
    originalPrice: 99.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.5,
    reviews: 1234,
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation",
    inStock: true,
    fastDelivery: true,
  },
  {
    id: "2",
    title: "Smart Fitness Watch",
    price: 199.99,
    originalPrice: 249.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.3,
    reviews: 856,
    category: "Electronics",
    description: "Advanced fitness tracking with heart rate monitor",
    inStock: true,
    fastDelivery: true,
  },
  {
    id: "3",
    title: "Premium Coffee Maker",
    price: 149.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.7,
    reviews: 432,
    category: "Home & Garden",
    description: "Professional-grade coffee maker with programmable settings",
    inStock: true,
    fastDelivery: false,
  },
  {
    id: "4",
    title: "Organic Cotton T-Shirt",
    price: 24.99,
    originalPrice: 34.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.2,
    reviews: 678,
    category: "Clothing",
    description: "Comfortable organic cotton t-shirt in various colors",
    inStock: true,
    fastDelivery: true,
  },
  {
    id: "5",
    title: "Gaming Mechanical Keyboard",
    price: 89.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.6,
    reviews: 923,
    category: "Electronics",
    description: "RGB backlit mechanical keyboard for gaming",
    inStock: false,
    fastDelivery: false,
  },
  {
    id: "6",
    title: "Yoga Mat Premium",
    price: 39.99,
    originalPrice: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    rating: 4.4,
    reviews: 567,
    category: "Sports",
    description: "Non-slip premium yoga mat with carrying strap",
    inStock: true,
    fastDelivery: true,
  },
]

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(featuredProducts)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { cartItems, cartCount, addToCart } = useCart()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    let filtered = featuredProducts

    if (selectedCategory !== "All") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }, [searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gray-900 text-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Header */}
          <div className="flex items-center justify-between py-2 border-b border-gray-700">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-orange-400">AmazonClone</h1>
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <span>Deliver to</span>
                <span className="font-semibold">New York 10001</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAuthOpen(true)}
                className="text-white hover:text-orange-400"
              >
                <User className="w-4 h-4 mr-1" />
                {isAuthenticated ? `Hello, ${user?.name}` : "Sign In"}
              </Button>

              <Button variant="ghost" size="sm" className="text-white hover:text-orange-400">
                <Heart className="w-4 h-4 mr-1" />
                Wishlist
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCartOpen(true)}
                className="text-white hover:text-orange-400 relative"
              >
                <ShoppingCart className="w-4 h-4 mr-1" />
                Cart
                {cartCount > 0 && <Badge className="absolute -top-2 -right-2 bg-orange-500 text-xs">{cartCount}</Badge>}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="py-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden text-white"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-5 h-5" />
              </Button>

              <div className="flex-1 flex">
                <select
                  className="bg-gray-200 text-gray-900 px-3 py-2 rounded-l-md border-r border-gray-300 focus:outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 rounded-none border-0 focus:ring-0"
                />

                <Button className="bg-orange-400 hover:bg-orange-500 text-gray-900 rounded-l-none px-6">
                  <Search className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className={`${isMobileMenuOpen ? "block" : "hidden"} md:block pb-2`}>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-6 text-sm">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-left hover:text-orange-400 transition-colors ${
                    selectedCategory === category ? "text-orange-400" : ""
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Great Deals Every Day</h2>
          <p className="text-xl mb-6">Discover millions of products at unbeatable prices</p>
          <Button size="lg" className="bg-orange-400 hover:bg-orange-500 text-gray-900">
            Shop Now
          </Button>
        </div>
      </section>

      {/* Product Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-semibold">
            {selectedCategory === "All" ? "Featured Products" : selectedCategory}
          </h3>
          <p className="text-gray-600">
            {filteredProducts.length} results
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("All")
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Get to Know Us</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Press Releases
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Make Money with Us</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Sell products
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Become an Affiliate
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Advertise Your Products
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Payment Products</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Business Card
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Shop with Points
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Reload Your Balance
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Let Us Help You</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <a href="#" className="hover:text-white">
                    Your Account
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Your Orders
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 AmazonClone. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals and Sidebars */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  )
}
