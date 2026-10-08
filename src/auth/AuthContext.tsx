import { useEffect, useState, type ReactNode } from "react"
import { Navigate, useLocation } from "react-router-dom"
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth"
import { auth } from "./firebase"
import { AuthContext } from "./authContextValue"
import { useAuth } from "@/hooks/useAuth"
import type { AuthValue } from "@/types/auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u)
      setLoading(false)
    })
  }, [])

  const value: AuthValue = {
    user,
    loading,
    signUp: async (email, password) => {
      await createUserWithEmailAndPassword(auth, email, password)
    },
    login: async (email, password) => {
      await signInWithEmailAndPassword(auth, email, password)
    },
    logout: () => signOut(auth),
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="grid min-h-screen place-items-center text-neutral-400">Loading…</div>
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <>{children}</>
}