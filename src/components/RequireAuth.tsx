import { Navigate, Outlet } from "react-router-dom"
import { isAuthenticated } from "@/lib/auth"

function RequireAuth() {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default RequireAuth
