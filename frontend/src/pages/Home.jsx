import { useSelector } from 'react-redux'
import { Helmet } from 'react-helmet-async'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Github, Linkedin, Mail, MapPin, Phone,
  Download, ArrowRight, Briefcase,
  GraduationCap, Award, FolderGit2,
  ExternalLink, Calendar, Building2,
  Sparkles, X, ChevronLeft, ChevronRight, Code2
} from 'lucide-react'
import { useEffect, useState, useCallback } from 'react'
import SectionTitle from '../components/ui/SectionTitle'
import {
  projectsAPI, experiencesAPI, educationsAPI, certificatesAPI
} from '../services/api'

const API_URL = import.meta.env.VITE_API_URL?.replace(/\/api$/, '') || 'http://localhost:5000'

// Veritabanından string veya array gelebilir — ikisini de handle et
const parseArray = (val) => {
  if (!val) return []
  if (Array.isArray(val)) return val
  try { return JSON.parse(val) } catch { return [] }
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const formatDate = (d) => {
  if (!d) return ''
  return new Date(d).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long' })
}

const MeshBackground = () => (
  <div className="mesh-bg">
    <div className="mesh-orb mesh-orb-1" />
    <div className="mesh-orb mesh-orb-2" />
    <div className="mesh-orb mesh-orb-3" />
  </div>
)

const GlassCard = ({ children, className = '' }) => (
  <div className={"glass rounded-2xl " + className}>{children}</div>
)

// ===== PROJE MODALİ =====
const ProjectModal = ({ project, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const allImages = [
    ...(project.imageUrl ? [project.imageUrl] : []),
    ...parseArray(project.images)
  ].filter(Boolean)

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const prev = useCallback(() => {
    setCurrentSlide((s) => (s === 0 ? allImages.length - 1 : s - 1))
  }, [allImages.length])

  const next = useCallback(() => {
    setCurrentSlide((s) => (s === allImages.length - 1 ? 0 : s + 1))
  }, [allImages.length])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0"
        style={{ background: 'rgba(5,6,12,0.88)', backdropFilter: 'blur(14px)' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 30 }}
        transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl glass"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-xl glass flex items-center justify-center transition-all hover:scale-110"
          style={{ color: 'var(--text-secondary)' }}>
          <X size={17} />
        </button>

        {allImages.length > 0 && (
          <div className="relative rounded-t-3xl overflow-hidden" style={{ height: '320px' }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={currentSlide}
                src={API_URL + allImages[currentSlide]}
                alt={project.title}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </AnimatePresence>

            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, rgba(5,6,12,0.7) 0%, transparent 55%)' }} />

            {allImages.length > 1 && (
              <>
                <button onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl glass flex items-center justify-center hover:scale-110 transition-all"
                  style={{ color: 'white' }}>
                  <ChevronLeft size={19} />
                </button>
                <button onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl glass flex items-center justify-center hover:scale-110 transition-all"
                  style={{ color: 'white' }}>
                  <ChevronRight size={19} />
                </button>
                <div className="absolute top-4 left-4 glass px-3 py-1 rounded-xl text-xs font-medium"
                  style={{ color: 'white' }}>
                  {currentSlide + 1} / {allImages.length}
                </div>
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)}
                      className="rounded-full transition-all duration-300"
                      style={{
                        width: i === currentSlide ? '22px' : '8px',
                        height: '8px',
                        background: i === currentSlide ? 'var(--accent)' : 'rgba(255,255,255,0.35)'
                      }} />
                  ))}
                </div>
                <div className="absolute bottom-0 left-0 right-0 flex gap-2 px-4 pb-3 overflow-x-auto"
                  style={{ background: 'linear-gradient(to top, rgba(5,6,12,0.85), transparent)' }}>
                  {allImages.map((img, i) => (
                    <button key={i} onClick={() => setCurrentSlide(i)}
                      className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
                      style={{
                        width: '52px', height: '38px',
                        border: i === currentSlide ? '2px solid var(--accent)' : '2px solid rgba(255,255,255,0.15)',
                        opacity: i === currentSlide ? 1 : 0.55
                      }}>
                      <img src={API_URL + img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="p-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {project.title}
            </h2>
            {project.featured && <span className="chip flex-shrink-0">Öne Çıkan</span>}
          </div>

          {(project.longDescription || project.description) && (
            <p className="text-base leading-relaxed mb-7"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
              {project.longDescription || project.description}
            </p>
          )}

          {parseArray(project.technologies).length > 0 && (
            <div className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <Code2 size={15} style={{ color: 'var(--accent)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
                  Teknolojiler
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {parseArray(project.technologies).map((tech) => (
                  <span key={tech} className="chip">{tech}</span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-5 border-t" style={{ borderColor: 'var(--glass-border)' }}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                className="glass flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold hover:scale-105 transition-all"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                <Github size={16} /> Kaynak Kod
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                className="btn-glow flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ fontFamily: 'var(--font-body)' }}>
                <ExternalLink size={16} /> Canlı Demo
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ===== ANA SAYFA =====
const Home = () => {
  const { data: profile, loading } = useSelector((state) => state.profile)
  const [projects, setProjects]       = useState([])
  const [experiences, setExperiences] = useState([])
  const [educations, setEducations]   = useState([])
  const [certificates, setCertificates] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    projectsAPI.getAll().then((r) => setProjects(r.data)).catch(() => {})
    experiencesAPI.getAll().then((r) => setExperiences(r.data)).catch(() => {})
    educationsAPI.getAll().then((r) => setEducations(r.data)).catch(() => {})
    certificatesAPI.getAll().then((r) => setCertificates(r.data)).catch(() => {})
  }, [])

  if (loading) {
    return (
      <>
        <MeshBackground />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
            style={{ borderTopColor: 'var(--accent)' }} />
        </div>
      </>
    )
  }

  const skills = parseArray(profile?.skills)

  return (
    <>
      <Helmet>
        <title>{profile?.fullName || 'Portfolyo'} — {profile?.title || 'Geliştirici'}</title>
        <meta name="description" content={profile?.bio?.slice(0, 160) || 'Kişisel portfolyo'} />
      </Helmet>

      <MeshBackground />

      {/* ====== HERO ====== */}
      <section id="hero" className="min-h-screen flex items-center relative pt-28 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0}>
                <span className="glass inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
                  style={{ color: 'var(--accent)', fontFamily: 'var(--font-body)' }}>
                  <Sparkles size={14} />
                  {profile?.location || 'Yazılım Geliştirici'}
                </span>
              </motion.div>

              <motion.h1 variants={fadeUp} initial="hidden" animate="visible" custom={1}
                className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] mb-5"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                Merhaba,<br />
                ben <span className="gradient-text">{profile?.fullName || 'Ad Soyad'}</span>
              </motion.h1>

              <motion.p variants={fadeUp} initial="hidden" animate="visible" custom={2}
                className="text-xl font-medium mb-5" style={{ color: 'var(--accent)' }}>
                {profile?.title || 'Yazılım Geliştirici'}
              </motion.p>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={4}
                className="flex flex-wrap gap-4 mb-10">
                <button onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-glow text-white px-7 py-3.5 rounded-2xl font-semibold text-sm flex items-center gap-2"
                  style={{ fontFamily: 'var(--font-body)' }}>
                  Projelerim <ArrowRight size={17} />
                </button>
                <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="glass px-7 py-3.5 rounded-2xl font-semibold text-sm"
                  style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                  İletişim
                </button>
              </motion.div>

              <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={5} className="flex items-center gap-4">
                {[
                  profile?.github   && { href: profile.github,            Icon: Github   },
                  profile?.linkedin && { href: profile.linkedin,          Icon: Linkedin },
                  profile?.email    && { href: 'mailto:' + profile.email, Icon: Mail     },
                ].filter(Boolean).map((item, i) => (
                  <a key={i} href={item.href}
                    target={item.href.startsWith('mailto') ? undefined : '_blank'}
                    rel="noopener noreferrer"
                    className="glass w-11 h-11 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                    style={{ color: 'var(--text-secondary)' }}>
                    <item.Icon size={19} />
                  </a>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-6 rounded-3xl opacity-30 blur-2xl btn-glow" />
                <div className="glass rounded-3xl p-2 relative">
                  {profile?.photoUrl ? (
                    <img src={API_URL + profile.photoUrl} alt={profile.fullName}
                      className="w-64 h-64 sm:w-80 sm:h-80 object-cover rounded-2xl" />
                  ) : (
                    <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-2xl btn-glow flex items-center justify-center">
                      <span className="text-white text-7xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                        {profile?.fullName?.charAt(0) || 'P'}
                      </span>
                    </div>
                  )}
                </div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                  className="glass absolute -bottom-5 -left-5 rounded-2xl px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                      Açık pozisyonlara müsait
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== HAKKIMDA ====== */}
<section id="about" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Hakkımda" subtitle="Kendim hakkında kısa bilgi" />
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }} className="lg:col-span-3">
              <GlassCard className="p-8">
                <p className="text-lg leading-relaxed mb-8 whitespace-pre-line" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                  {(profile?.bio || 'Admin panelinden biyografinizi ekleyin.').replace(/<br\s*\/?>/gi, '\n')}
                </p>
                <div className="space-y-3">
                  {[
                    profile?.location && { icon: MapPin, text: profile.location },
                    profile?.email    && { icon: Mail,   text: profile.email    },
                    profile?.phone    && { icon: Phone,  text: profile.phone    },
                  ].filter(Boolean).map((item, i) => (
                    <div key={i} className="flex items-center gap-3" style={{ color: 'var(--text-secondary)' }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--accent-soft)' }}>
                        <item.icon size={15} style={{ color: 'var(--accent)' }} />
                      </div>
                      <span className="text-sm" style={{ fontFamily: 'var(--font-body)' }}>{item.text}</span>
                    </div>
                  ))}
                </div>
                {profile?.resumeUrl && (
                  <a href={API_URL + profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="btn-glow text-white inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm mt-8"
                    style={{ fontFamily: 'var(--font-body)' }}>
                    <Download size={16} /> CV İndir
                  </a>
                )}
              </GlassCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[
                { label: 'Proje',     count: projects.length,     icon: FolderGit2    },
                { label: 'Deneyim',   count: experiences.length,  icon: Briefcase     },
                { label: 'Eğitim',    count: educations.length,   icon: GraduationCap },
                { label: 'Sertifika', count: certificates.length, icon: Award         },
              ].map((item) => (
                <GlassCard key={item.label} className="p-6 flex flex-col items-center justify-center text-center" style={{ minHeight: '140px' }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: 'var(--accent-soft)' }}>
                    <item.icon size={20} style={{ color: 'var(--accent)' }} />
                  </div>
                  <div className="text-4xl font-bold mb-1 gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                    {item.count}
                  </div>
                  <div className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    {item.label}
                  </div>
                </GlassCard>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====== YETENEKLERˇ====== */}
      {skills.length > 0 && (
        <section id="skills" className="py-24 section-alt">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="Yetenekler" subtitle="Kullandığım teknolojiler ve araçlar" />
            <div className="flex flex-wrap gap-3">
              {skills.map((skill, i) => (
                <motion.span key={skill}
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                  className="chip cursor-default" style={{ fontFamily: 'var(--font-body)' }}>
                  {skill}
                </motion.span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====== DENEYİM ====== */}
      <section id="experience" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Deneyim" subtitle="Profesyonel iş geçmişim" />
          {experiences.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <p style={{ color: 'var(--text-secondary)' }}>Henüz deneyim eklenmedi.</p>
            </GlassCard>
          ) : (
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-px"
                style={{ background: 'linear-gradient(to bottom, transparent, var(--accent), transparent)' }} />
              <div className="space-y-6">
                {experiences.map((exp, i) => (
                  <motion.div key={exp.id} variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i * 0.1} className="pl-16 relative">
                    <div className="absolute left-2 top-5 w-8 h-8 rounded-xl btn-glow flex items-center justify-center">
                      <Briefcase size={14} className="text-white" />
                    </div>
                    <GlassCard className="p-6">
                      <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                        <div>
                          <h3 className="text-lg font-bold mb-1"
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                            {exp.position}
                          </h3>
                          <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'var(--accent)' }}>
                            <Building2 size={13} /> {exp.company}
                          </div>
                        </div>
                        <span className="glass px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5"
                          style={{ color: 'var(--text-secondary)' }}>
                          <Calendar size={11} />
                          {formatDate(exp.startDate)} — {exp.isCurrent ? 'Devam ediyor' : formatDate(exp.endDate)}
                        </span>
                      </div>
                      {exp.description && (
                        <p className="text-sm leading-relaxed"
                          style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                          {exp.description}
                        </p>
                      )}
                    </GlassCard>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====== EĞİTİM ====== */}
      <section id="education" className="py-24 section-alt">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Eğitim" subtitle="Akademik geçmişim" />
          {educations.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <p style={{ color: 'var(--text-secondary)' }}>Henüz eğitim bilgisi eklenmedi.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {educations.map((edu, i) => (
                <motion.div key={edu.id} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i * 0.1}>
                  <GlassCard className="p-6 h-full">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--accent-soft)' }}>
                        <GraduationCap size={22} style={{ color: 'var(--accent)' }} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-1"
                          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                          {edu.school}
                        </h3>
                        <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>
                          {edu.degree}{edu.field && ' — ' + edu.field}
                        </p>
                        <span className="glass inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs"
                          style={{ color: 'var(--text-secondary)' }}>
                          <Calendar size={11} />
                          {formatDate(edu.startDate)} — {edu.isCurrent ? 'Devam ediyor' : formatDate(edu.endDate)}
                        </span>
                        {edu.description && (
                          <p className="text-sm mt-3 leading-relaxed"
                            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                            {edu.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====== SERTİFİKALAR ====== */}
      <section id="certificates" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Sertifikalar" subtitle="Aldığım sertifikalar ve başarılar" />
          {certificates.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <p style={{ color: 'var(--text-secondary)' }}>Henüz sertifika eklenmedi.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificates.map((cert, i) => (
                <motion.div key={cert.id} variants={fadeUp} initial="hidden" whileInView="visible"
                  viewport={{ once: true }} custom={i * 0.1}>
                  <GlassCard className="p-6 h-full flex flex-col">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(234,179,8,0.12)' }}>
                        <Award size={20} style={{ color: '#eab308' }} />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm leading-snug"
                          style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                          {cert.name}
                        </h3>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{cert.issuer}</p>
                      </div>
                    </div>
                    {cert.date && (
                      <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
                        <Calendar size={11} /> {formatDate(cert.date)}
                      </div>
                    )}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium"
                        style={{ color: 'var(--accent)' }}>
                        Sertifikayı Gör <ExternalLink size={13} />
                      </a>
                    )}
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====== PROJELER ====== */}
      <section id="projects" className="py-24 section-alt">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Projeler" subtitle="Geliştirdiğim projeler" />
          {projects.length === 0 ? (
            <GlassCard className="p-12 text-center">
              <p style={{ color: 'var(--text-secondary)' }}>Henüz proje eklenmedi.</p>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => {
                const techs  = parseArray(project.technologies)
                const images = parseArray(project.images)
                return (
                  <motion.div key={project.id} variants={fadeUp} initial="hidden" whileInView="visible"
                    viewport={{ once: true }} custom={i * 0.1}>
                    <div className="glass rounded-2xl overflow-hidden flex flex-col group cursor-pointer h-full"
                      onClick={() => setSelectedProject(project)}>

                      {project.imageUrl ? (
                        <div className="relative overflow-hidden" style={{ height: '200px' }}>
                          <img src={API_URL + project.imageUrl} alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                            style={{ background: 'rgba(5,6,12,0.55)' }}>
                            <span className="glass px-4 py-2 rounded-xl text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                              Detayları Gör
                            </span>
                          </div>
                          {images.length > 0 && (
                            <div className="absolute top-3 right-3 glass px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1"
                              style={{ color: 'var(--accent)' }}>
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                              </svg>
                              {images.length + 1}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center group-hover:opacity-80 transition-opacity"
                          style={{ height: '120px', background: 'var(--accent-soft)' }}>
                          <FolderGit2 size={36} style={{ color: 'var(--accent)', opacity: 0.5 }} />
                        </div>
                      )}

                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="font-bold text-lg"
                            style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                            {project.title}
                          </h3>
                          {project.featured && (
                            <span className="chip text-xs flex-shrink-0 ml-2">Öne Çıkan</span>
                          )}
                        </div>

                        {project.description && (
                          <p className="text-sm leading-relaxed mb-4 flex-1 line-clamp-2"
                            style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                            {project.description}
                          </p>
                        )}

                        {techs.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-5">
                            {techs.slice(0, 4).map((tech) => (
                              <span key={tech} className="chip">{tech}</span>
                            ))}
                            {techs.length > 4 && (
                              <span className="chip">+{techs.length - 4}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-4 border-t mt-auto"
                          style={{ borderColor: 'var(--glass-border)' }}>
                          <div className="flex gap-3">
                            {project.githubUrl && (
                              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                                <Github size={14} /> Kod
                              </a>
                            )}
                            {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="flex items-center gap-1.5 text-xs font-medium transition-colors"
                                style={{ color: 'var(--text-secondary)' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                                <ExternalLink size={14} /> Demo
                              </a>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); setSelectedProject(project) }}
                            className="btn-glow text-white text-xs font-semibold px-4 py-1.5 rounded-xl flex items-center gap-1.5"
                            style={{ fontFamily: 'var(--font-body)' }}>
                            Detay Gör <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ====== İLETİŞİM ====== */}
      <section id="contact" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <GlassCard className="p-12">
                <div className="w-16 h-16 rounded-2xl btn-glow flex items-center justify-center mx-auto mb-6">
                  <Mail size={28} className="text-white" />
                </div>
                <h2 className="text-4xl font-bold mb-4 gradient-text" style={{ fontFamily: 'var(--font-display)' }}>
                  Birlikte çalışalım
                </h2>
                <p className="text-lg mb-10" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}>
                  Yeni bir proje mi var? Fikir alışverişi yapalım.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  {profile?.email && (
                    <a href={'mailto:' + profile.email}
                      className="btn-glow text-white px-7 py-3.5 rounded-2xl font-semibold text-sm flex items-center gap-2"
                      style={{ fontFamily: 'var(--font-body)' }}>
                      <Mail size={17} /> Mail Gönder
                    </a>
                  )}
                  {profile?.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                      className="glass px-7 py-3.5 rounded-2xl font-semibold text-sm flex items-center gap-2"
                      style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
                      <Linkedin size={17} /> LinkedIn
                    </a>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </>
  )
}

export default Home