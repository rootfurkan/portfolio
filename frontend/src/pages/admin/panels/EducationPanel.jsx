import { useState, useEffect } from 'react'
import { educationsAPI } from '../../../services/api'
import { Plus, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import TarihSecici from '../../../components/ui/TarihSecici'

const FormInput = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
    <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm disabled:opacity-50" {...props} />
  </div>
)

const FormTextarea = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
    <textarea rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm resize-none" {...props} />
  </div>
)

const Card = ({ children }) => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">{children}</div>
)

const formatDateTR = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
}

const emptyForm = { school: '', degree: '', field: '', startDate: '', endDate: '', isCurrent: false, description: '' }

const EducationPanel = () => {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try { const res = await educationsAPI.getAll(); setItems(res.data) }
    catch { toast.error('Veriler yüklenemedi') }
  }

  useEffect(() => { fetchData() }, [])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const handleEdit = (item) => {
    setForm({
      school: item.school || '', degree: item.degree || '', field: item.field || '',
      startDate: item.startDate || '', endDate: item.endDate || '',
      isCurrent: item.isCurrent || false, description: item.description || ''
    })
    setEditingId(item.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => { setForm(emptyForm); setEditingId(null); setShowForm(false) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.school) { toast.error('Okul adı zorunludur'); return }
    setLoading(true)
    try {
      if (editingId) { await educationsAPI.update(editingId, form); toast.success('Güncellendi!') }
      else { await educationsAPI.create(form); toast.success('Eklendi!') }
      handleCancel(); fetchData()
    } catch { toast.error('Bir hata oluştu') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Silmek istediğinizden emin misiniz?')) return
    try { await educationsAPI.delete(id); toast.success('Silindi!'); fetchData() }
    catch { toast.error('Silinemedi') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Eğitim</h2>
          <p className="text-gray-400 text-sm mt-1">Eğitim bilgilerinizi ekleyin ve düzenleyin</p>
        </div>
        <button onClick={() => { handleCancel(); setShowForm(!showForm) }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Yeni Ekle
        </button>
      </div>

      {showForm && (
        <Card>
          <h3 className="text-white font-medium mb-5">{editingId ? 'Eğitimi Düzenle' : 'Yeni Eğitim Ekle'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Okul Adı" name="school" value={form.school} onChange={handleChange} placeholder="Örnek: İstanbul Üniversitesi" />
              <FormInput label="Derece" name="degree" value={form.degree} onChange={handleChange} placeholder="Lisans / Önlisans / Yüksek Lisans" />
              <FormInput label="Bölüm" name="field" value={form.field} onChange={handleChange} placeholder="Bilgisayar Mühendisliği" />
              <div /> {/* boşluk */}

              <TarihSecici
                label="Başlangıç Tarihi"
                value={form.startDate}
                onChange={(val) => setForm(f => ({ ...f, startDate: val }))}
              />

              <div className="space-y-2">
                <TarihSecici
                  label="Bitiş Tarihi"
                  value={form.endDate}
                  onChange={(val) => setForm(f => ({ ...f, endDate: val }))}
                  disabled={form.isCurrent}
                  placeholder={form.isCurrent ? 'Devam ediyor' : 'Tarih seçin'}
                />
                <label className="flex items-center gap-2 cursor-pointer mt-1">
                  <input type="checkbox" name="isCurrent" checked={form.isCurrent}
                    onChange={handleChange} className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-indigo-600" />
                  <span className="text-sm text-gray-300">Hâlâ devam ediyor</span>
                </label>
              </div>
            </div>

            <FormTextarea label="Açıklama" name="description" value={form.description} onChange={handleChange} placeholder="Eğitim hakkında kısa bilgi..." />

            <div className="flex gap-3 justify-end pt-2">
              <button type="button" onClick={handleCancel} className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors">İptal</button>
              <button type="submit" disabled={loading} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
                {loading ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Kaydediliyor...</> : 'Kaydet'}
              </button>
            </div>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <Card><p className="text-gray-500 text-center py-8">Henüz eğitim bilgisi eklenmedi</p></Card>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{item.school}</h4>
                  <p className="text-indigo-400 text-sm">{item.degree}{item.field && ' — ' + item.field}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {formatDateTR(item.startDate)} — {item.isCurrent ? 'Devam ediyor' : formatDateTR(item.endDate)}
                  </p>
                  {item.description && <p className="text-gray-400 text-sm mt-2">{item.description}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => handleEdit(item)} className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1">
                    <Pencil size={12} /> Düzenle
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs font-medium rounded-lg transition-colors">Sil</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default EducationPanel