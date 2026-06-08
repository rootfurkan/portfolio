import { useState, useEffect } from 'react'
import { projectsAPI } from '../../../services/api'
import { Plus, Pencil, X, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'

const parseArray = (val) => {
  if (!val) return []
  if (Array.isArray(val)) return val
  try { return JSON.parse(val) } catch { return [] }
}

const FormInput = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
    <input
      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm"
      {...props}
    />
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

const emptyForm = {
  title: '', description: '', longDescription: '',
  technologies: [], githubUrl: '', liveUrl: '',
  featured: false, order: 0
}

const ProjectPanel = () => {
  const [items, setItems]               = useState([])
  const [form, setForm]                 = useState(emptyForm)
  const [techInput, setTechInput]       = useState('')
  const [editingId, setEditingId]       = useState(null)
  const [showForm, setShowForm]         = useState(false)
  const [coverFile, setCoverFile]       = useState(null)
  const [coverPreview, setCoverPreview] = useState(null)
  const [imageFiles, setImageFiles]     = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [existingImages, setExistingImages] = useState([])
  const [loading, setLoading]           = useState(false)

  const fetchData = async () => {
    try {
      const res = await projectsAPI.getAll()
      setItems(res.data)
    } catch {
      toast.error('Veriler yüklenemedi')
    }
  }

  useEffect(() => { fetchData() }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleCoverChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return
    setImageFiles(prev => [...prev, ...files])
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
  }

  const removeNewImage      = (idx) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx))
    setImagePreviews(prev => prev.filter((_, i) => i !== idx))
  }
  const removeExistingImage = (url) => setExistingImages(prev => prev.filter(img => img !== url))

  const addTech = () => {
    const t = techInput.trim()
    if (!t) return
    if (form.technologies.includes(t)) { toast.error('Zaten eklendi'); return }
    setForm({ ...form, technologies: [...form.technologies, t] })
    setTechInput('')
  }

  const removeTech = (tech) => setForm({ ...form, technologies: form.technologies.filter(t => t !== tech) })

  const handleEdit = (item) => {
    const techs  = parseArray(item.technologies)
    const images = parseArray(item.images)
    setForm({
      title:           item.title           || '',
      description:     item.description     || '',
      longDescription: item.longDescription || '',
      technologies:    techs,
      githubUrl:       item.githubUrl       || '',
      liveUrl:         item.liveUrl         || '',
      featured:        item.featured        || false,
      order:           item.order           || 0
    })
    setEditingId(item.id)
    setCoverFile(null)
    setCoverPreview(item.imageUrl ? API_URL + item.imageUrl : null)
    setImageFiles([])
    setImagePreviews([])
    setExistingImages(images)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
    setCoverFile(null)
    setCoverPreview(null)
    setImageFiles([])
    setImagePreviews([])
    setExistingImages([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title) { toast.error('Proje adı zorunlu'); return }
    setLoading(true)
    try {
      const formData = new FormData()
      Object.keys(form).forEach(key => {
        if (key === 'technologies') {
          formData.append(key, JSON.stringify(form[key]))
        } else {
          formData.append(key, form[key])
        }
      })
      if (coverFile) formData.append('image', coverFile)
      imageFiles.forEach(file => formData.append('images', file))
      formData.append('existingImages', JSON.stringify(existingImages))

      if (editingId) {
        await projectsAPI.update(editingId, formData)
        toast.success('Güncellendi!')
      } else {
        await projectsAPI.create(formData)
        toast.success('Eklendi!')
      }
      handleCancel()
      fetchData()
    } catch {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Silmek istediğinizden emin misiniz?')) return
    try {
      await projectsAPI.delete(id)
      toast.success('Silindi!')
      fetchData()
    } catch {
      toast.error('Silinemedi')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Projeler</h2>
          <p className="text-gray-400 text-sm mt-1">Projelerinizi ekleyin, görsel ve detay bilgisi ekleyin</p>
        </div>
        <button
          onClick={() => { handleCancel(); setShowForm(!showForm) }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} /> Yeni Ekle
        </button>
      </div>

      {showForm && (
        <Card>
          <h3 className="text-white font-medium mb-5">
            {editingId ? 'Projeyi Düzenle' : 'Yeni Proje Ekle'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Proje Adı *" name="title" value={form.title} onChange={handleChange} placeholder="Örnek: E-Ticaret Sitesi" />
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600" />
                  <span className="text-sm text-gray-300">Öne çıkan proje</span>
                </label>
              </div>
              <FormInput label="GitHub URL" name="githubUrl" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
              <FormInput label="Canlı Demo URL" name="liveUrl" value={form.liveUrl} onChange={handleChange} placeholder="https://proje.com" />
            </div>

            <FormTextarea label="Kısa Açıklama (Kart üzerinde görünür)" name="description"
              value={form.description} onChange={handleChange}
              placeholder="Projenin kısa açıklaması..." rows={3} />

            <FormTextarea label="Detaylı Açıklama (Modal'da görünür)" name="longDescription"
              value={form.longDescription} onChange={handleChange}
              placeholder="Projenin detaylı açıklaması, amacı, çözüm yaklaşımınız, vb..." rows={5} />

            {/* Teknolojiler */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">Teknolojiler</label>
              <div className="flex gap-2 mb-2">
                <input type="text" value={techInput}
                  onChange={e => setTechInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech() } }}
                  placeholder="Örnek: React, Node.js..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-sm" />
                <button type="button" onClick={addTech}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition-colors">
                  Ekle
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.technologies.map(tech => (
                  <span key={tech} className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-900/30 text-indigo-300 border border-indigo-700 rounded-lg text-sm">
                    {tech}
                    <button type="button" onClick={() => removeTech(tech)} className="text-indigo-400 hover:text-red-400 transition-colors">
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Kapak görseli */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Kapak Görseli <span className="text-gray-500 font-normal">(kart ve modal'da ana görsel)</span>
              </label>
              <input type="file" accept="image/*" onChange={handleCoverChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white file:cursor-pointer hover:file:bg-indigo-700" />
              {coverPreview && (
                <div className="relative mt-3 inline-block">
                  <img src={coverPreview} alt="Kapak" className="h-40 rounded-lg object-cover" />
                  <button type="button" onClick={() => { setCoverFile(null); setCoverPreview(null) }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <X size={12} className="text-white" />
                  </button>
                </div>
              )}
            </div>

            {/* Slider görselleri */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Slider Görselleri <span className="text-gray-500 font-normal">(modal'da slider ile gösterilir, max 10)</span>
              </label>
              {existingImages.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Mevcut görseller:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((img, i) => (
                      <div key={i} className="relative">
                        <img src={API_URL + img} alt="" className="h-20 w-28 object-cover rounded-lg" />
                        <button type="button" onClick={() => removeExistingImage(img)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <X size={10} className="text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <input type="file" accept="image/*" multiple onChange={handleImagesChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-700 file:text-white file:cursor-pointer hover:file:bg-gray-600" />
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative">
                      <img src={src} alt="" className="h-20 w-28 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeNewImage(i)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                        <X size={10} className="text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={handleCancel}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">
                İptal
              </button>
              <button type="submit" disabled={loading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Kaydediliyor...</>
                  : 'Kaydet'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Proje Listesi */}
      {items.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-8">Henüz proje eklenmedi</p></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(item => {
            const techs  = parseArray(item.technologies)
            const images = parseArray(item.images)
            return (
              <Card key={item.id}>
                {item.imageUrl && (
                  <img src={API_URL + item.imageUrl} alt={item.title}
                    className="w-full h-40 object-cover rounded-lg mb-4" />
                )}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium">{item.title}</h4>
                      {item.featured && (
                        <span className="px-2 py-0.5 bg-indigo-900/30 text-indigo-400 text-xs rounded-full">Öne Çıkan</span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-400 text-sm line-clamp-2">{item.description}</p>
                    )}
                  </div>
                </div>

                {techs.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {techs.slice(0, 5).map(t => (
                      <span key={t} className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded">{t}</span>
                    ))}
                    {techs.length > 5 && (
                      <span className="px-2 py-0.5 bg-gray-800 text-gray-500 text-xs rounded">+{techs.length - 5}</span>
                    )}
                  </div>
                )}

                {images.length > 0 && (
                  <p className="text-gray-500 text-xs mb-4">
                    📸 {images.length + (item.imageUrl ? 1 : 0)} görsel (slider aktif)
                  </p>
                )}

                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)}
                    className="flex-1 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                    <Pencil size={12} /> Düzenle
                  </button>
                  <button onClick={() => handleDelete(item.id)}
                    className="flex-1 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs rounded-lg transition-colors flex items-center justify-center gap-1">
                    <Trash2 size={12} /> Sil
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProjectPanel