import type { User } from "firebase/auth"

export interface AuthValue {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}