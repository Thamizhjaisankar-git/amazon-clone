"use client"

import { useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
  }, [])

  const login = (email: string, password: string) => {
    // Simulate API call
    const userData: User = {
      id: "1",
      name: email.split("@")[0],
      email,
    }

    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const register = (name: string, email: string, password: string) => {
    // Simulate API call
    const userData: User = {
      id: Date.now().toString(),
      name,
      email,
    }

    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }
}
