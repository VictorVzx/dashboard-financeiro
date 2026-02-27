import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'

import Home from './pages/main/Home.tsx'
import Login from './pages/auth/Login.tsx'
import Register from './pages/auth/Register.tsx'
import ForgotPassword from './pages/auth/ForgotPassword.tsx'
import Accounts from './pages/others/Accounts.tsx'
import Budgets from './pages/others/Budgets.tsx'
import Goals from './pages/others/Goals.tsx'
import Transactions from './pages/others/Transactions.tsx'
import RequireAuth from './components/RequireAuth.tsx'

const router = createBrowserRouter([
  {
    element: <RequireAuth />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contas",
        element: <Accounts />,
      },
      {
        path: "/transacoes",
        element: <Transactions />,
      },
      {
        path: "/orcamentos",
        element: <Budgets />,
      },
      {
        path: "/metas",
        element: <Goals />,
      },
      {
        path: "/accounts",
        element: <Accounts />,
      },
      {
        path: "/transactions",
        element: <Transactions />,
      },
      {
        path: "/budgets",
        element: <Budgets />,
      },
      {
        path: "/goals",
        element: <Goals />,
      },
    ],
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
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
