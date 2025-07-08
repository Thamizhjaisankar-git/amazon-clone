// Authentication functionality
class AuthManager {
  constructor() {
    this.currentUser = null
    this.isLogin = true
    this.init()
  }

  init() {
    // Load user from localStorage
    this.loadUserFromStorage()
    this.updateAuthUI()
    this.setupEventListeners()
  }

  setupEventListeners() {
    // Auth button click
    document.getElementById("authBtn").addEventListener("click", () => {
      if (this.currentUser) {
        this.showLogoutConfirm()
      } else {
        this.openAuthModal()
      }
    })

    // Modal close events
    document.getElementById("closeAuth").addEventListener("click", () => this.closeAuthModal())
    document.getElementById("authOverlay").addEventListener("click", () => this.closeAuthModal())

    // Form events
    document.getElementById("authSwitch").addEventListener("click", () => this.switchAuthMode())
    document.getElementById("authForm").addEventListener("submit", (e) => this.handleAuthSubmit(e))
    document.getElementById("togglePassword").addEventListener("click", () => this.togglePasswordVisibility())

    // Real-time validation
    document.getElementById("email").addEventListener("input", () => this.clearError("emailError"))
    document.getElementById("password").addEventListener("input", () => this.clearError("passwordError"))
    document.getElementById("name").addEventListener("input", () => this.clearError("nameError"))
    document.getElementById("confirmPassword").addEventListener("input", () => this.clearError("confirmPasswordError"))
  }

  loadUserFromStorage() {
    const savedUser = localStorage.getItem("amazonClone_user")
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser)
      } catch (e) {
        console.error("Error loading user from storage:", e)
        localStorage.removeItem("amazonClone_user")
      }
    }
  }

  openAuthModal() {
    const modal = document.getElementById("authModal")
    const modalContent = document.getElementById("authModalContent")

    modal.classList.remove("hidden")
    setTimeout(() => {
      modalContent.classList.remove("scale-95")
      modalContent.classList.add("scale-100")
    }, 10)

    this.updateAuthModal()
  }

  closeAuthModal() {
    const modal = document.getElementById("authModal")
    const modalContent = document.getElementById("authModalContent")

    modalContent.classList.remove("scale-100")
    modalContent.classList.add("scale-95")

    setTimeout(() => {
      modal.classList.add("hidden")
      this.clearForm()
    }, 300)
  }

  switchAuthMode() {
    this.isLogin = !this.isLogin
    this.updateAuthModal()
    this.clearForm()
  }

  updateAuthModal() {
    const title = document.getElementById("authModalTitle")
    const nameField = document.getElementById("nameField")
    const confirmPasswordField = document.getElementById("confirmPasswordField")
    const submitBtn = document.getElementById("authSubmit")
    const switchText = document.getElementById("authSwitchText")
    const switchBtn = document.getElementById("authSwitch")

    if (this.isLogin) {
      title.textContent = "Sign In to Your Account"
      nameField.classList.add("hidden")
      confirmPasswordField.classList.add("hidden")
      submitBtn.textContent = "Sign In"
      switchText.textContent = "Don't have an account?"
      switchBtn.textContent = "Create one"
    } else {
      title.textContent = "Create New Account"
      nameField.classList.remove("hidden")
      confirmPasswordField.classList.remove("hidden")
      submitBtn.textContent = "Create Account"
      switchText.textContent = "Already have an account?"
      switchBtn.textContent = "Sign in"
    }
  }

  togglePasswordVisibility() {
    const passwordInput = document.getElementById("password")
    const toggleBtn = document.getElementById("togglePassword")
    const icon = toggleBtn.querySelector("i")

    if (passwordInput.type === "password") {
      passwordInput.type = "text"
      icon.classList.remove("fa-eye")
      icon.classList.add("fa-eye-slash")
    } else {
      passwordInput.type = "password"
      icon.classList.remove("fa-eye-slash")
      icon.classList.add("fa-eye")
    }
  }

  validateForm() {
    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value
    const name = document.getElementById("name").value.trim()
    const confirmPassword = document.getElementById("confirmPassword").value

    let isValid = true
    this.clearAllErrors()

    // Email validation
    if (!email) {
      this.showError("emailError", "Email is required")
      isValid = false
    } else if (!this.isValidEmail(email)) {
      this.showError("emailError", "Please enter a valid email address")
      isValid = false
    }

    // Password validation
    if (!password) {
      this.showError("passwordError", "Password is required")
      isValid = false
    } else if (password.length < 6) {
      this.showError("passwordError", "Password must be at least 6 characters")
      isValid = false
    }

    // Registration-specific validation
    if (!this.isLogin) {
      if (!name) {
        this.showError("nameError", "Full name is required")
        isValid = false
      } else if (name.length < 2) {
        this.showError("nameError", "Name must be at least 2 characters")
        isValid = false
      }

      if (!confirmPassword) {
        this.showError("confirmPasswordError", "Please confirm your password")
        isValid = false
      } else if (password !== confirmPassword) {
        this.showError("confirmPasswordError", "Passwords do not match")
        isValid = false
      }
    }

    return isValid
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  showError(elementId, message) {
    const errorElement = document.getElementById(elementId)
    errorElement.textContent = message
    errorElement.classList.remove("hidden")

    // Add error styling to input
    const inputId = elementId.replace("Error", "")
    const input = document.getElementById(inputId)
    input.classList.add("border-red-500")
  }

  clearError(elementId) {
    const errorElement = document.getElementById(elementId)
    errorElement.classList.add("hidden")

    // Remove error styling from input
    const inputId = elementId.replace("Error", "")
    const input = document.getElementById(inputId)
    input.classList.remove("border-red-500")
  }

  clearAllErrors() {
    const errorElements = ["nameError", "emailError", "passwordError", "confirmPasswordError"]
    errorElements.forEach((id) => this.clearError(id))
  }

  clearForm() {
    document.getElementById("authForm").reset()
    this.clearAllErrors()
  }

  handleAuthSubmit(e) {
    e.preventDefault()

    if (!this.validateForm()) return

    const email = document.getElementById("email").value.trim()
    const password = document.getElementById("password").value
    const name = document.getElementById("name").value.trim()

    // Show loading state
    const submitBtn = document.getElementById("authSubmit")
    const originalText = submitBtn.textContent
    submitBtn.classList.add("btn-loading")
    submitBtn.disabled = true

    // Simulate API call delay
    setTimeout(() => {
      if (this.isLogin) {
        this.login(email, password)
      } else {
        this.register(name, email, password)
      }

      // Reset button state
      submitBtn.classList.remove("btn-loading")
      submitBtn.disabled = false
      submitBtn.textContent = originalText
    }, 1000)
  }

  login(email, password) {
    // Simulate successful login
    const userData = {
      id: Date.now().toString(),
      name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
      email: email,
      loginTime: new Date().toISOString(),
    }

    this.currentUser = userData
    this.saveUserToStorage()
    this.updateAuthUI()
    this.closeAuthModal()
    window.showNotification(`Welcome back, ${userData.name}!`)
  }

  register(name, email, password) {
    // Simulate successful registration
    const userData = {
      id: Date.now().toString(),
      name: name,
      email: email,
      registrationTime: new Date().toISOString(),
    }

    this.currentUser = userData
    this.saveUserToStorage()
    this.updateAuthUI()
    this.closeAuthModal()
    window.showNotification(`Welcome to AmazonClone, ${userData.name}!`)
  }

  logout() {
    this.currentUser = null
    localStorage.removeItem("amazonClone_user")
    this.updateAuthUI()
    window.showNotification("You have been logged out successfully")
  }

  showLogoutConfirm() {
    if (confirm(`Are you sure you want to logout, ${this.currentUser.name}?`)) {
      this.logout()
    }
  }

  saveUserToStorage() {
    localStorage.setItem("amazonClone_user", JSON.stringify(this.currentUser))
  }

  updateAuthUI() {
    const authText = document.getElementById("authText")
    if (this.currentUser) {
      authText.textContent = `Hello, ${this.currentUser.name}`
    } else {
      authText.textContent = "Sign In"
    }
  }

  // Get current user (for use by other modules)
  getCurrentUser() {
    return this.currentUser
  }

  // Check if user is authenticated
  isAuthenticated() {
    return this.currentUser !== null
  }
}

// Initialize auth manager
const authManager = new AuthManager()

// Declare showNotification function
// function showNotification(message) {
//   alert(message)
// }
