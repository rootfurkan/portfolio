import { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  projectsAPI, experiencesAPI, educationsAPI, certificatesAPI
} from '../../../services/api'
import { Download, Eye, EyeOff, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'

const parseArray = (val) => {
  if (!val) return []
  if (Array.isArray(val)) return val
  try { return JSON.parse(val) } catch { return [] }
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short' })
}

const THEMES = [
  { id: 'slate',   label: 'Uzay Grisi', accent: '#475569', light: '#f1f5f9', dark: '#1e293b' },
  { id: 'indigo',  label: 'İndigo',     accent: '#6366f1', light: '#eef2ff', dark: '#3730a3' },
  { id: 'cyan',    label: 'Siyan',      accent: '#0891b2', light: '#ecfeff', dark: '#164e63' },
  { id: 'emerald', label: 'Zümrüt',     accent: '#059669', light: '#ecfdf5', dark: '#064e3b' },
  { id: 'rose',    label: 'Gül',        accent: '#e11d48', light: '#fff1f2', dark: '#881337' },
]

const CVPanel = () => {
  const { data: profile } = useSelector((state) => state.profile)
  const [projects, setProjects]         = useState([])
  const [experiences, setExperiences]   = useState([])
  const [educations, setEducations]     = useState([])
  const [certificates, setCertificates] = useState([])
  const [loading, setLoading]           = useState(false)
  const [preview, setPreview]           = useState(true)
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0])
  const [sections, setSections] = useState({
    skills: true, experience: true, education: true,
    certificates: true, projects: true,
  })
  const cvRef = useRef(null)

  useEffect(() => {
    projectsAPI.getAll().then(r => setProjects(r.data)).catch(() => {})
    experiencesAPI.getAll().then(r => setExperiences(r.data)).catch(() => {})
    educationsAPI.getAll().then(r => setEducations(r.data)).catch(() => {})
    certificatesAPI.getAll().then(r => setCertificates(r.data)).catch(() => {})
  }, [])

  const toggleSection = (key) => setSections(prev => ({ ...prev, [key]: !prev[key] }))

  const handleDownload = async () => {
    if (!cvRef.current) return
    setLoading(true)
    try {
      const { default: jsPDF }        = await import('jspdf')
      const { default: html2canvas }  = await import('html2canvas')

      const canvas = await html2canvas(cvRef.current, {
        scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff',
      })

      const imgData     = canvas.toDataURL('image/png')
      const pdf         = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pdfWidth    = pdf.internal.pageSize.getWidth()
      const pdfHeight   = pdf.internal.pageSize.getHeight()
      const pdfImgHeight = pdfWidth / (canvas.width / canvas.height)

      let heightLeft = pdfImgHeight
      let position   = 0
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight)
      heightLeft -= pdfHeight

      while (heightLeft > 0) {
        position = heightLeft - pdfImgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfImgHeight)
        heightLeft -= pdfHeight
      }

      const fileName = (profile?.fullName || 'CV').replace(/\s+/g, '_') + '_CV.pdf'
      pdf.save(fileName)
      toast.success('CV indirildi!')
    } catch (err) {
      console.error(err)
      toast.error('PDF oluşturulamadı')
    } finally {
      setLoading(false)
    }
  }

  const theme  = selectedTheme
  const skills = parseArray(profile?.skills)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">CV Oluşturucu</h2>
          <p className="text-gray-400 text-sm mt-1">Profil verilerinden otomatik PDF CV oluştur</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setPreview(p => !p)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium rounded-lg transition-colors">
            {preview ? <EyeOff size={15} /> : <Eye size={15} />}
            {preview ? 'Önizlemeyi Gizle' : 'Önizleme'}
          </button>
          <button onClick={handleDownload} disabled={loading}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
            {loading
              ? <><Loader size={15} className="animate-spin" /> Oluşturuluyor...</>
              : <><Download size={15} /> PDF İndir</>}
          </button>
        </div>
      </div>

      {/* Ayarlar */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="text-sm font-medium text-gray-300 mb-3">Renk Teması</p>
          <div className="flex gap-2 flex-wrap">
            {THEMES.map(t => (
              <button key={t.id} onClick={() => setSelectedTheme(t)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                style={{
                  borderColor: selectedTheme.id === t.id ? t.accent : 'transparent',
                  background:  selectedTheme.id === t.id ? t.accent + '22' : '#1f2937',
                  color:       selectedTheme.id === t.id ? t.accent : '#9ca3af'
                }}>
                <span className="w-3 h-3 rounded-full" style={{ background: t.accent }} />
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-300 mb-3">Bölümler</p>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'skills',       label: 'Yetenekler'   },
              { key: 'experience',   label: 'Deneyim'      },
              { key: 'education',    label: 'Eğitim'       },
              { key: 'certificates', label: 'Sertifikalar' },
              { key: 'projects',     label: 'Projeler'     },
            ].map(s => (
              <button key={s.key} onClick={() => toggleSection(s.key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                style={{
                  borderColor: sections[s.key] ? '#6366f1' : '#374151',
                  background:  sections[s.key] ? '#6366f122' : '#1f2937',
                  color:       sections[s.key] ? '#818cf8' : '#6b7280'
                }}>
                {sections[s.key] ? '✓ ' : ''}{s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CV Önizleme */}
      {preview && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 overflow-auto">
          <p className="text-xs text-gray-500 mb-4 text-center">— CV Önizleme (A4 formatında indirilecek) —</p>
          <div className="flex justify-center">
            <div ref={cvRef} style={{
              width: '794px', minHeight: '1123px', background: '#ffffff',
              fontFamily: "'Segoe UI', Arial, sans-serif", fontSize: '13px',
              color: '#1a1a2e', boxShadow: '0 4px 32px rgba(0,0,0,0.3)',
            }}>
              {/* HEADER */}
              <div style={{
                background: theme.dark, padding: '40px 48px 32px',
                color: '#fff', display: 'flex', alignItems: 'center', gap: '28px',
              }}>
                {profile?.photoUrl ? (
                  <img src={API_URL + profile.photoUrl} alt={profile?.fullName} crossOrigin="anonymous"
                    style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover',
                      border: '3px solid ' + theme.accent, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: theme.accent,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '32px', fontWeight: 'bold', color: '#fff', flexShrink: 0 }}>
                    {profile?.fullName?.charAt(0) || 'P'}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <h1 style={{ margin: 0, fontSize: '26px', fontWeight: '700', letterSpacing: '-0.5px' }}>
                    {profile?.fullName || 'Ad Soyad'}
                  </h1>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color:'#fff', fontWeight: '500' }}>
                    {profile?.title || 'Yazılım Geliştirici'}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '14px' }}>
                    {[
                      profile?.email    && { icon: '✉', text: profile.email },
                      profile?.phone    && { icon: '☎', text: profile.phone },
                      profile?.location && { icon: '📍', text: profile.location },
                      profile?.github   && { icon: '⌥', text: profile.github.replace('https://', '') },
                      profile?.linkedin && { icon: 'in', text: profile.linkedin.replace('https://www.linkedin.com/in/', '') },
                    ].filter(Boolean).map((item, i) => (
                      <span key={i} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ color: theme.accent }}>{item.icon}</span> {item.text}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* BODY */}
              <div style={{ padding: '32px 48px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>

                {/* SOL SÜTUN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {profile?.bio && (
                    <div>
                      <SectionHeader label="Hakkımda" accent={theme.accent} />
                      <p style={{ margin: 0, lineHeight: '1.6', color: '#374151', fontSize: '12px' }}>
                        {profile.bio}
                      </p>
                    </div>
                  )}

                  {sections.skills && skills.length > 0 && (
                    <div>
                      <SectionHeader label="Yetenekler" accent={theme.accent} />
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {skills.map(skill => (
                          <span key={skill} style={{
                            background: theme.light, color: theme.dark,
                            padding: '3px 10px', borderRadius: '99px', fontSize: '11px',
                            fontWeight: '500', border: '1px solid ' + theme.accent + '44',
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {sections.education && educations.length > 0 && (
                    <div>
                      <SectionHeader label="Eğitim" accent={theme.accent} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {educations.map(edu => (
                          <div key={edu.id}>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '12px', color: '#111827' }}>{edu.school}</p>
                            <p style={{ margin: '2px 0', fontSize: '11px', color: theme.accent, fontWeight: '500' }}>
                              {edu.degree}{edu.field && ' — ' + edu.field}
                            </p>
                            <p style={{ margin: 0, fontSize: '10px', color: '#9ca3af' }}>
                              {formatDate(edu.startDate)} — {edu.isCurrent ? 'Devam' : formatDate(edu.endDate)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sections.certificates && certificates.length > 0 && (
                    <div>
                      <SectionHeader label="Sertifikalar" accent={theme.accent} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {certificates.map(cert => (
                          <div key={cert.id}>
                            <p style={{ margin: 0, fontWeight: '600', fontSize: '12px', color: '#111827' }}>{cert.name}</p>
                            <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#6b7280' }}>
                              {cert.issuer} {cert.date && '· ' + formatDate(cert.date)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* SAĞ SÜTUN */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {sections.experience && experiences.length > 0 && (
                    <div>
                      <SectionHeader label="Deneyim" accent={theme.accent} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {experiences.map((exp, i) => (
                          <div key={exp.id} style={{
                            paddingLeft: '14px',
                            borderLeft: '2px solid ' + (i === 0 ? theme.accent : '#e5e7eb'),
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <div>
                                <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: '#111827' }}>{exp.position}</p>
                                <p style={{ margin: '2px 0', fontSize: '12px', color: theme.accent, fontWeight: '500' }}>{exp.company}</p>
                              </div>
                              <span style={{ fontSize: '10px', color: '#9ca3af', whiteSpace: 'nowrap', marginLeft: '8px' }}>
                                {formatDate(exp.startDate)} — {exp.isCurrent ? 'Devam' : formatDate(exp.endDate)}
                              </span>
                            </div>
                            {exp.description && (
                              <p style={{ margin: '6px 0 0', fontSize: '11px', color: '#4b5563', lineHeight: '1.5' }}>
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sections.projects && projects.length > 0 && (
                    <div>
                      <SectionHeader label="Projeler" accent={theme.accent} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {projects.slice(0, 4).map(project => {
                          const techs = parseArray(project.technologies)
                          return (
                            <div key={project.id} style={{
                              background: theme.light, borderRadius: '8px',
                              padding: '10px 14px', borderLeft: '3px solid ' + theme.accent,
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <p style={{ margin: 0, fontWeight: '700', fontSize: '13px', color: '#111827' }}>{project.title}</p>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  {project.githubUrl && <span style={{ fontSize: '10px', color: theme.accent }}>GitHub</span>}
                                  {project.liveUrl   && <span style={{ fontSize: '10px', color: theme.accent }}>Demo</span>}
                                </div>
                              </div>
                              {project.description && (
                                <p style={{ margin: '4px 0 6px', fontSize: '11px', color: '#4b5563', lineHeight: '1.5' }}>
                                  {project.description}
                                </p>
                              )}
                              {techs.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                  {techs.slice(0, 6).map(tech => (
                                    <span key={tech} style={{
                                      fontSize: '10px', color: theme.dark, background: '#fff',
                                      padding: '1px 7px', borderRadius: '99px',
                                      border: '1px solid ' + theme.accent + '55',
                                    }}>
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div style={{
                borderTop: '1px solid #e5e7eb', padding: '12px 48px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {profile?.fullName} — {profile?.title}
                </span>
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {new Date().toLocaleDateString('tr-TR')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const SectionHeader = ({ label, accent }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
    <span style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', color: accent }}>
      {label}
    </span>
    <div style={{ flex: 1, height: '1px', background: accent + '33' }} />
  </div>
)

export default CVPanel