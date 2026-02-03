import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' // Adicione isso
import './index.css'

// Importe suas novas páginas
import Home from './pages/main/Home.tsx'
import Login from './pages/auth/Login.tsx'
import Register from './pages/auth/Register.tsx'
import ForgotPassword from './pages/auth/ForgotPassword.tsx'

// Configure o mapa de rotas
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot",
    element: <ForgotPassword />,
  }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Em vez de renderizar <Home />, renderizamos o provedor de rotas */}
    <RouterProvider router={router} />
  </StrictMode>,
)