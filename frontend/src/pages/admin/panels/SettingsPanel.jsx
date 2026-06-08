import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { authAPI } from '../../../services/api'
import { Eye, EyeOff, Lock, ShieldCheck, LogOut, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const FormInput = ({ label, hint, ...props }) => (
  <div>
    {label && (
      <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>
    )}
    <input
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm disabled:opacity-50"
      {...props}
    />
    {hint && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
  </div>
)

const Card = ({ children, className = '' }) => (
  <div className={"bg-gray-900 rounded-xl border border-gray-800 p-6 " + className}>
    {children}
  </div>
)

const SettingsPanel = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [show, setShow] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Şifre güçlülük göstergesi
  const getStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score <= 1) return { score, label: 'Zayıf', color: '#ef4444' }
    if (score === 2) return { score, label: 'Orta', color: '#f59e0b' }
    if (score === 3) return { score, label: 'İyi', color: '#3b82f6' }
    return { score, label: 'Güçlü', color: '#10b981' }
  }

  const strength = getStrength(form.newPassword)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      toast.error('Tüm alanları doldurun')
      return
    }

    if (form.newPassword.length < 6) {
      toast.error('Yeni şifre en az 6 karakter olmalıdır')
      return
    }

    if (form.newPassword !== form.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor')
      return
    }

    if (form.currentPassword === form.newPassword) {
      toast.error('Yeni şifre mevcut şifreden farklı olmalıdır')
      return
    }

    setLoading(true)
    try {
      await authAPI.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      })
      toast.success('Şifre başarıyla güncellendi')
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Çıkış yapıldı')
    navigate('/admin/login')
  }

  return (
    <div className="space-y-6 max-w-lg">
      {/* Başlık */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Ayarlar</h2>
        <p className="text-gray-400 text-sm mt-1">Hesap güvenliği ve oturum yönetimi</p>
      </div>

      {/* Hesap bilgisi */}
      <Card>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold">Admin Hesabı</p>
            <p className="text-gray-400 text-sm">{user?.email}</p>
          </div>
        </div>
      </Card>

      {/* Şifre değiştirme formu */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Lock size={18} className="text-indigo-400" />
          <h3 className="text-white font-semibold">Şifre Değiştir</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Mevcut şifre */}
          <div className="relative">
            <FormInput
              label="Mevcut Şifre"
              name="currentPassword"
              type={show.current ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, current: !s.current }))}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Yeni şifre */}
          <div className="relative">
            <FormInput
              label="Yeni Şifre"
              name="newPassword"
              type={show.new ? 'text' : 'password'}
              value={form.newPassword}
              onChange={handleChange}
              placeholder="••••••••"
              hint="En az 6 karakter"
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, new: !s.new }))}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {/* Şifre güç göstergesi */}
          {form.newPassword && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-gray-500">Şifre gücü</span>
                <span className="text-xs font-medium" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="flex-1 h-1.5 rounded-full transition-all duration-300"
                    style={{
                      background: i <= strength.score ? strength.color : '#374151'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Şifre tekrar */}
          <div className="relative">
            <FormInput
              label="Yeni Şifre Tekrar"
              name="confirmPassword"
              type={show.confirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShow(s => ({ ...s, confirm: !s.confirm }))}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            {/* Eşleşme kontrolü */}
            {form.confirmPassword && (
              <p className={"text-xs mt-1 " + (form.newPassword === form.confirmPassword ? 'text-green-400' : 'text-red-400')}>
                {form.newPassword === form.confirmPassword ? '✓ Şifreler eşleşiyor' : '✗ Şifreler eşleşmiyor'}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Güncelleniyor...
                </>
              ) : (
                <>
                  <Lock size={15} />
                  Şifreyi Güncelle
                </>
              )}
            </button>
          </div>
        </form>
      </Card>

      {/* Oturum kapat */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-red-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-1">Oturumu Kapat</h3>
            <p className="text-gray-400 text-sm mb-4">
              Oturumu kapatırsanız yeniden giriş yapmanız gerekecektir.
            </p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-400 hover:text-red-300 text-sm font-medium rounded-lg transition-colors"
            >
              <LogOut size={15} />
              Çıkış Yap
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default SettingsPanel