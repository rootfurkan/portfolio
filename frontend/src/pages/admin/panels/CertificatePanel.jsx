import { useState, useEffect } from 'react'
import { certificatesAPI } from '../../../services/api'
import { Plus, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import TarihSecici from '../../../components/ui/TarihSecici'

const FormInput = ({ label, ...props }) => (
  <div>
    {label && <label className="block text-sm font-medium text-gray-300 mb-1.5">{label}</label>}
    <input className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors text-sm" {...props} />
  </div>
)

const Card = ({ children }) => (
  <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">{children}</div>
)

const formatDateTR = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
}

const emptyForm = { name: '', issuer: '', date: '', credentialUrl: '', order: 0 }

const CertificatePanel = () => {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)

  const fetchData = async () => {
    try { const res = await certificatesAPI.getAll(); setItems(res.data) }
    catch { toast.error('Veriler yüklenemedi') }
  }

  useEffect(() => { fetchData() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleEdit = (item) => {
    setForm({ name: item.name || '', issuer: item.issuer || '', date: item.date || '', credentialUrl: item.credentialUrl || '', order: item.order || 0 })
    setEditingId(item.id); setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => { setForm(emptyForm); setEditingId(null); setShowForm(false) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name) { toast.error('Sertifika adı zorunludur'); return }
    setLoading(true)
    try {
      if (editingId) { await certificatesAPI.update(editingId, form); toast.success('Güncellendi!') }
      else { await certificatesAPI.create(form); toast.success('Eklendi!') }
      handleCancel(); fetchData()
    } catch { toast.error('Bir hata oluştu') }
    finally { setLoading(false) }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Silmek istediğinizden emin misiniz?')) return
    try { await certificatesAPI.delete(id); toast.success('Silindi!'); fetchData() }
    catch { toast.error('Silinemedi') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Sertifikalar</h2>
          <p className="text-gray-400 text-sm mt-1">Sertifikalarınızı ekleyin ve düzenleyin</p>
        </div>
        <button onClick={() => { handleCancel(); setShowForm(!showForm) }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors">
          <Plus size={16} /> Yeni Ekle
        </button>
      </div>

      {showForm && (
        <Card>
          <h3 className="text-white font-medium mb-5">{editingId ? 'Sertifikayı Düzenle' : 'Yeni Sertifika Ekle'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput label="Sertifika Adı" name="name" value={form.name} onChange={handleChange} placeholder="Örnek: AWS Solutions Architect" />
              <FormInput label="Veren Kurum" name="issuer" value={form.issuer} onChange={handleChange} placeholder="Örnek: Amazon Web Services" />

              <TarihSecici
                label="Verilme Tarihi"
                value={form.date}
                onChange={(val) => setForm(f => ({ ...f, date: val }))}
              />

              <FormInput label="Sertifika URL" name="credentialUrl" value={form.credentialUrl} onChange={handleChange} placeholder="https://credential.net/..." />
            </div>
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
        <Card><p className="text-gray-500 text-center py-8">Henüz sertifika eklenmedi</p></Card>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <Card key={item.id}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="text-white font-medium">{item.name}</h4>
                  <p className="text-indigo-400 text-sm">{item.issuer}</p>
                  <p className="text-gray-500 text-xs mt-1">{formatDateTR(item.date)}</p>
                  {item.credentialUrl && (
                    <a href={item.credentialUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 text-xs hover:underline mt-1 inline-block">
                      Sertifikayı Gör →
                    </a>
                  )}
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

export default CertificatePanel