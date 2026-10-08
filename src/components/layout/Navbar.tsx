import { Link, useLocation } from "react-router-dom"
import { interactive } from "@/utils/constants"
import { useAuth } from "@/hooks/useAuth"

export function Navbar() {
  const { user, logout } = useAuth()
  const onHome = useLocation().pathname === "/"
  const link = "rounded px-1 text-[#b8b6b4] transition-colors hover:text-white focus:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#66c0f4]"

  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-[#171a21] shadow-lg">
      <nav aria-label="Main" className="mx-auto flex h-14 max-w-[1400px] items-center gap-6 px-6 text-sm">
        <Link to="/" className={`rounded text-xl font-extrabold tracking-[0.2em] text-white ${interactive}`}>Movie Bhandaar</Link>
        {onHome && (
          <>
            <a href="#featured" className={link}>Featured</a>
            <a href="#browse" className={link}>Top Rated</a>
          </>
        )}
        <div className="ml-auto flex items-center gap-4">
          <span className="hidden text-[#b8b6b4] sm:inline">{user?.email}</span>
          <button
            onClick={logout}
            className={`rounded-sm bg-linear-to-r from-[#47bfff] to-[#1a44c2] px-3 py-1.5 font-medium text-white ${interactive}`}
          >
            Log out
          </button>
        </div>
      </nav>
    </header>
  )
}