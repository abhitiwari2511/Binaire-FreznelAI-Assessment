import type { AuthValue } from "@/types/auth"
import { createContext } from "react"

export const AuthContext = createContext<AuthValue | null>(null)
