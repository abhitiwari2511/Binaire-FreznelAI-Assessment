import { createBrowserRouter } from "react-router-dom"
import { ProtectedRoute } from "@/auth/AuthContext"
import { RootLayout } from "@/components/layout/RootLayout"
import AuthPage from "@/pages/AuthPage"
import HomePage from "../pages/HomePage"
import BrowsePage from "../pages/BrowsePage"
import MovieDetailsPage from "../pages/MovieDetailPage"

export const router = createBrowserRouter([
  { path: "/login", element: <AuthPage mode="login" /> },
  { path: "/signup", element: <AuthPage mode="signup" /> },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <RootLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: "browse", element: <BrowsePage /> },
      { path: "movie/:id", element: <MovieDetailsPage /> },
    ],
  },
])