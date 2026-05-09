import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => { if (d.code === 200) setUser(d.data); else logout() })
        .catch(() => logout())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = (userData, newToken) => {
    setUser(userData)
    setToken(newToken)
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    setUser(null)
    setToken('')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
