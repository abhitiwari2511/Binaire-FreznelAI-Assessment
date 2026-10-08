import { useState, type FormEvent, type ReactNode } from "react"
import { Link, Navigate, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { interactive } from "@/utils/constants"
import { useAuth } from "@/hooks/useAuth"

const messages: Record<string, string> = {
  "auth/email-already-in-use": "That email is already registered.",
  "auth/invalid-credential": "Wrong email or password.",
  "auth/weak-password": "Password must be at least 6 characters.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
}

interface FieldProps {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  autoComplete?: string
  trailing?: ReactNode
}

function Field({ id, label, type = "text", value, onChange, autoComplete, trailing }: FieldProps) {
  return (
    <div className="group rounded-sm border border-[#3c4048] bg-[#32353c] transition-colors duration-200 hover:border-[#5a5f69] focus-within:border-[#66c0f4] focus-within:bg-[#383c44]">
      <label
        htmlFor={id}
        className="block px-3 pt-2 text-xs font-medium uppercase tracking-wide text-[#8f98a0] transition-colors group-focus-within:text-[#66c0f4]"
      >
        {label}
      </label>
      <div className="flex items-center">
        <input
          id={id}
          type={type}
          required
          minLength={type === "password" ? 6 : undefined}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 pb-2 pt-1 text-white focus:outline-none"
        />
        {trailing}
      </div>
    </div>
  )
}

export default function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const { user, signUp, login } = useAuth()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from ?? "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const isSignup = mode === "signup"

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    if (isSignup && password !== confirm) {
      setError("Passwords don't match.")
      return
    }
    setBusy(true)
    try {
      if (isSignup) await signUp(email, password)
      else await login(email, password)
    } catch (err) {
      const code = (err as { code?: string }).code ?? ""
      setError(messages[code] ?? "Something went wrong. Try again.")
    } finally {
      setBusy(false)
    }
  }

  if (user) return <Navigate to={from} replace />

  return (
    <main className="grid min-h-screen place-items-center bg-linear-to-b from-[#3a1a12] via-[#1f0f0d] to-[#120a0a] px-4 py-10">
      <motion.div
        key={mode}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <p className="mb-6 text-center text-3xl font-extrabold tracking-[0.2em] text-white">Movie Bhandaar</p>

        <form
          onSubmit={onSubmit}
          noValidate={false}
          className="rounded-sm bg-[#171a21] p-8 shadow-2xl transition-shadow duration-300 hover:shadow-[0_20px_60px_rgba(0,0,0,0.6)] focus-within:shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
        >
          <h1 className="mb-6 text-2xl font-bold text-white">
            {isSignup ? "Create your account" : "Sign in"}
          </h1>

          <Field id="email" label="Email" type="email" autoComplete="email" value={email} onChange={setEmail} />

          <div className="pt-4">
            <Field
              id="password"
              label="Password"
              type={showPw ? "text" : "password"}
              autoComplete={isSignup ? "new-password" : "current-password"}
              value={password}
              onChange={setPassword}
              trailing={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  aria-pressed={showPw}
                  aria-label={showPw ? "Hide password" : "Show password"}
                  className="mr-2 rounded px-2 py-1 text-xs text-[#8f98a0] transition hover:text-white active:scale-90 focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4]"
                >
                  {showPw ? "Hide" : "Show"}
                </button>
              }
            />
          </div>

          <AnimatePresence initial={false}>
            {isSignup && (
              <motion.div
                key="confirm"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-px pt-4">
                  <Field
                    id="confirm"
                    label="Confirm password"
                    type={showPw ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirm}
                    onChange={setConfirm}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isSignup && (
            <div className="mt-3">
              <a
                href="#tips"
                className="rounded text-xs text-[#66c0f4] underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4]"
              >
                Password tips
              </a>
              <aside
                id="tips"
                className="mt-2 scroll-mt-24 rounded-sm border border-transparent p-3 text-xs text-[#8f98a0] transition-colors duration-300 target:border-[#a4d007] target:bg-[#a4d007]/10 target:text-white"
              >
                Use at least 6 characters. A longer phrase you can remember beats a short complicated one.
              </aside>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.p
                key={error}
                role="alert"
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: [0, -8, 8, -6, 6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-4 rounded-sm bg-red-500/10 px-3 py-2 text-sm text-red-300"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            disabled={busy}
            className={`mt-6 w-full rounded-sm bg-linear-to-r from-[#06bfff] to-[#2d73ff] py-3 font-semibold text-white disabled:pointer-events-none disabled:opacity-60 ${interactive}`}
          >
            {busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
          </button>

          <p className="mt-6 text-center text-sm text-[#8f98a0]">
            {isSignup ? "Already have an account?" : "New to Store?"}{" "}
            <Link
              to={isSignup ? "/login" : "/signup"}
              className="rounded font-medium text-[#66c0f4] underline-offset-2 transition hover:text-white hover:underline active:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4]"
            >
              {isSignup ? "Sign in" : "Create one"}
            </Link>
          </p>
        </form>
      </motion.div>
    </main>
  )
}