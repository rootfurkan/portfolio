import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '../../store/slices/themeSlice'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  { id: 'hero',         label: 'Ana Sayfa'    },
  { id: 'about',        label: 'Hakkımda'     },
  { id: 'skills',       label: 'Yetenekler'   },
  { id: 'experience',   label: 'Deneyim'      },
  { id: 'education',    label: 'Eğitim'       },
  { id: 'certificates', label: 'Sertifikalar' },
  { id: 'projects',     label: 'Projeler'     },
  { id: 'contact',      label: 'İletişim'     },
]

const Navbar = () => {
  const dispatch = useDispatch()
  const { mode } = useSelector((state) => state.theme)
  const { data: profile } = useSelector((state) => state.profile)

  const [menuOpen, setMenuOpen]           = useState(false)
  const [scrolled, setScrolled]           = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
      const sections = navLinks.map((l) => document.getElementById(l.id)).filter(Boolean)
      const current = sections.find((s) => {
        const r = s.getBoundingClientRect()
        return r.top <= 80 && r.bottom >= 80
      })
      if (current) setActiveSection(current.id)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
      >
        <div className={"glass rounded-2xl transition-all duration-500 " + (
          scrolled ? 'w-full max-w-4xl px-5 py-3' : 'w-full max-w-5xl px-6 py-4'
        )}>
          <div className="flex items-center justify-between">

            {/* Logo — Ad Soyad */}
            <button
              onClick={() => scrollTo('hero')}
              className="flex items-center"
            >
              <span
                className="font-bold text-lg gradient-text"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {profile?.fullName || 'Portfolyo'}
              </span>
            </button>

            {/* Masaüstü menü */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={"relative px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 " + (
                    activeSection === id ? 'text-white btn-glow' : 'hover:bg-white/10'
                  )}
                  style={{
                    color: activeSection === id ? 'white' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)'
                  }}
                >
                  {label}
                </button>
              ))}
            </nav>

            {/* Sağ kısım */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => dispatch(toggleTheme())}
                className="glass w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{ color: 'var(--text-secondary)' }}
              >
                {mode === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden glass w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ color: 'var(--text-secondary)' }}
              >
                {menuOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobil menü */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed top-24 left-4 right-4 z-40 glass rounded-2xl p-3"
          >
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={"w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all " + (
                  activeSection === id ? 'btn-glow text-white' : 'hover:bg-white/10'
                )}
                style={{
                  color: activeSection === id ? 'white' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)'
                }}
              >
                {label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default Navbar