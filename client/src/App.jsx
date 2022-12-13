import { useContext } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'

import { Navbar, LeftBar, RightBar } from './components'
import { Login, Register, Home, Profile } from './pages'

import { DarkModeContext } from './context/darkModeContext'
import { AuthContext } from './context/authContext'

import './style.scss'

const App = () => {
  const { currentUser } = useContext(AuthContext)
  const { darkMode } = useContext(DarkModeContext)
  const queryClient = new QueryClient()

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div className={`theme-${darkMode ? 'dark' : 'light'}`}>
          <Navbar />
          <div style={{ display: 'flex' }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    )
  }

  const ProtectedRoute = ({ children }) => {
    if (!currentUser) <Navigate to="/login" />
    return children
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: '/', element: <Home /> },
        { path: '/profile/:id', element: <Profile /> },
      ],
    },
    { path: '/login', element: <Login /> },
    { path: '/register', element: <Register /> },
  ])

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
