import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { router } from "./utils/routerWrapper";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
