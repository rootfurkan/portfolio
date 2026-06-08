import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { loginSuccess } from '../../store/slices/authSlice'
import { authAPI } from '../../services/api'
import { Code2, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email || !form.password) {
      toast.error('Lutfen tum alanlari doldurun')
      return
    }

    setLoading(true)
    try {
      const res = await authAPI.login(form)
      dispatch(loginSuccess(res.data))
      toast.success('Giriş başarılı!')
      navigate('/admin')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Giriş başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <Helmet>
            <title>Giriş — Admin Panel</title>
        </Helmet>
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Code2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Paneli</h1>
          <p className="text-gray-400 mt-2">Portfolyo yönetim paneline giriş yapın</p>
        </div>

        {/* Form */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="admin@email.com"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* Sifre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Şifre
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Buton */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                'Giris Yap'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Portfolyoya dön:{' '}
          <a href="/" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Ana Sayfa
          </a>
        </p>
      </div>
    </div>
  )
}

export default Login