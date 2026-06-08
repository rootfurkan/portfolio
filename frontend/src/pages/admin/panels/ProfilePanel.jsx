import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfileData } from '../../../store/slices/profileSlice'
import { profileAPI } from '../../../services/api'
import { Camera, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'

const parseArray = (val) => {
  if (!val) return []
  if (Array.isArray(val)) return val
  try { return JSON.parse(val) } catch { return [] }
}

const FormInput = ({ label, hint, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
    <input
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
      {...props}
    />
    {hint && <p className="text-gray-500 text-xs mt-1">{hint}</p>}
  </div>
)

const FormTextarea = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
    <textarea
      rows={4}
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm resize-none"
      {...props}
    />
  </div>
)

const Card = ({ children }) => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">{children}</div>
)

const ProfilePanel = () => {
  const dispatch = useDispatch()
  const { data: profile } = useSelector((state) => state.profile)

  const [form, setForm] = useState({
    fullName: '', title: '', bio: '', email: '',
    phone: '', location: '', github: '', linkedin: '',
    website: '', skills: []
  })
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [photoLoading, setPhotoLoading] = useState(false)

  useEffect(() => {
    if (profile) {
      setForm({
        fullName:  profile.fullName  || '',
        title:     profile.title     || '',
        bio:       profile.bio       || '',
        email:     profile.email     || '',
        phone:     profile.phone     || '',
        location:  profile.location  || '',
        github:    profile.github    || '',
        linkedin:  profile.linkedin  || '',
        website:   profile.website   || '',
        skills:    parseArray(profile.skills)
      })
    }
  }, [profile])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (!trimmed) return
    if (form.skills.includes(trimmed)) { toast.error('Bu yetenek zaten ekli'); return }
    setForm({ ...form, skills: [...form.skills, trimmed] })
    setSkillInput('')
  }

  const removeSkill = (skill) => setForm({ ...form, skills: form.skills.filter(s => s !== skill) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await profileAPI.update(form)
      dispatch(updateProfileData(res.data))
      toast.success('Profil güncellendi!')
    } catch {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPhotoLoading(true)
    try {
      const res = await profileAPI.uploadPhoto(file)
      dispatch(updateProfileData({ photoUrl: res.data.photoUrl }))
      toast.success('Fotoğraf güncellendi!')
    } catch {
      toast.error('Fotoğraf yüklenemedi')
    } finally {
      setPhotoLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white">Profil Bilgileri</h2>
        <p className="text-gray-400 text-sm mt-1">Kişisel bilgilerinizi güncelleyin</p>
      </div>

      {/* Fotoğraf */}
      <Card>
        <h3 className="text-white font-medium mb-4">Profil Fotoğrafı</h3>
        <div className="flex items-center gap-6">
          <div className="relative">
            {profile?.photoUrl ? (
              <img src={API_URL + profile.photoUrl} alt="Profil" className="w-20 h-20 rounded-xl object-cover" />
            ) : (
              <div className="w-20 h-20 bg-indigo-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{form.fullName?.charAt(0) || 'P'}</span>
              </div>
            )}
            <label className="absolute -bottom-2 -right-2 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-indigo-700 transition-colors">
              <Camera size={14} className="text-white" />
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
          </div>
          <div>
            <p className="text-gray-300 text-sm font-medium">Fotoğraf Yükle</p>
            <p className="text-gray-500 text-xs mt-1">JPEG, PNG veya WebP — Maks. 5MB</p>
            {photoLoading && <p className="text-indigo-400 text-xs mt-1">Yükleniyor...</p>}
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h3 className="text-white font-medium mb-4">Temel Bilgiler</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Ad Soyad" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Örnek: Furkan Yılmaz" />
            <FormInput label="Meslek Ünvanı" name="title" value={form.title} onChange={handleChange} placeholder="Örnek: Full Stack Developer" />
            <FormInput label="E-posta" name="email" type="email" value={form.email} onChange={handleChange} placeholder="ornek@email.com" />
            <FormInput label="Telefon" name="phone" value={form.phone} onChange={handleChange} placeholder="+90 555 000 00 00" />
            <FormInput label="Konum" name="location" value={form.location} onChange={handleChange} placeholder="İstanbul, Türkiye" />
            <FormInput label="Web Sitesi" name="website" value={form.website} onChange={handleChange} placeholder="https://siteadi.com" />
          </div>
          <div className="mt-4">
            <FormTextarea label="Biyografi" name="bio" value={form.bio} onChange={handleChange} placeholder="Kendinizden kısaca bahsedin..." rows={5} />
          </div>
        </Card>

        <Card>
          <h3 className="text-white font-medium mb-4">Sosyal Medya</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="GitHub" name="github" value={form.github} onChange={handleChange} placeholder="https://github.com/kullaniciadi" />
            <FormInput label="LinkedIn" name="linkedin" value={form.linkedin} onChange={handleChange} placeholder="https://linkedin.com/in/kullaniciadi" />
          </div>
        </Card>

        <Card>
          <h3 className="text-white font-medium mb-4">Yetenekler</h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
              placeholder="Örnek: React, Node.js..."
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm"
            />
            <button type="button" onClick={addSkill}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm">
              <Plus size={16} /> Ekle
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.skills.map(skill => (
              <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-900/30 text-indigo-300 border border-indigo-700 rounded-lg text-sm">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)} className="text-indigo-400 hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </span>
            ))}
            {form.skills.length === 0 && <p className="text-gray-500 text-sm">Henüz yetenek eklenmedi</p>}
          </div>
        </Card>

        <div className="flex justify-end">
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            {loading
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Kaydediliyor...</>
              : 'Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfilePanel