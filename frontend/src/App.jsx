import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { fetchProfile } from './store/slices/profileSlice'

import Home from './pages/Home'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />
}

function App() {
  const dispatch = useDispatch()
  const { mode } = useSelector((state) => state.theme)
  const { data: profile } = useSelector((state) => state.profile)

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  useEffect(() => {
    const html = document.documentElement
    if (mode === 'dark') {
      html.classList.add('dark')
    } else {
      html.classList.remove('dark')
    }
  }, [mode])

  // Profil fotoğrafını favicon olarak ayarla
  useEffect(() => {
    if (!profile?.photoUrl) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = API_URL + profile.photoUrl

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 64
      const ctx = canvas.getContext('2d')

      // Yuvarlak kırpma
      ctx.beginPath()
      ctx.arc(32, 32, 32, 0, Math.PI * 2)
      ctx.closePath()
      ctx.clip()

      // Fotoğrafı kareye sığdır (ortadan kırp)
      const size = Math.min(img.width, img.height)
      const sx = (img.width - size) / 2
      const sy = (img.height - size) / 2
      ctx.drawImage(img, sx, sy, size, size, 0, 0, 64, 64)

      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.type = 'image/png'
      link.href = canvas.toDataURL('image/png')
    }

    img.onerror = () => {
      let link = document.querySelector("link[rel~='icon']")
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      link.href = API_URL + profile.photoUrl
    }
  }, [profile?.photoUrl])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Routes>
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <main>
                <Home />
              </main>
              <Footer />
            </>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App