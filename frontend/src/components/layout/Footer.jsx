import { useSelector } from 'react-redux'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const { data: profile } = useSelector((state) => state.profile)

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const pages = [
    { id: 'hero',         label: 'Ana Sayfa'    },
    { id: 'experience',   label: 'Deneyim'      },
    { id: 'education',    label: 'Eğitim'       },
    { id: 'certificates', label: 'Sertifikalar' },
    { id: 'projects',     label: 'Projeler'     },
  ]

  return (
    <footer className="relative mt-20 border-t" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Sol */}
          <div>
            <button onClick={() => scrollTo('hero')} className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl btn-glow flex items-center justify-center text-white font-bold text-sm"
                style={{ fontFamily: 'var(--font-display)' }}>
                {profile?.fullName?.split(' ').map(w => w[0]).join('').slice(0, 2) || 'PF'}
              </div>
              <span className="font-bold text-lg"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                {profile?.fullName || 'Portfolyo'}
              </span>
            </button>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {profile?.title || 'Yazılım Geliştirici'}
            </p>
          </div>

          {/* Orta */}
          <div>
            <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
              Sayfalar
            </h3>
            <ul className="space-y-3">
              {pages.map((p) => (
                <li key={p.id}>
                  <button
                    onClick={() => scrollTo(p.id)}
                    className="text-sm transition-all hover:translate-x-1"
                    style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-body)' }}
                    onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                    onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                  >
                    {p.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sağ */}
          <div>
            <h3 className="font-semibold mb-5 text-sm uppercase tracking-wider"
              style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
              İletişim
            </h3>
            <div className="flex gap-3">
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer"
                  className="glass w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Github size={17} />
                </a>
              )}
              {profile?.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                  className="glass w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Linkedin size={17} />
                </a>
              )}
              {profile?.email && (
                <a href={'mailto:' + profile.email}
                  className="glass w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                  style={{ color: 'var(--text-secondary)' }}>
                  <Mail size={17} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t flex items-center justify-center gap-2 text-sm"
          style={{ borderColor: 'var(--glass-border)', color: 'var(--text-secondary)' }}>
          <span>Created</span>
          <Heart size={14} className="text-red-400 fill-red-400" />
          <span>by —</span>
          <span className="gradient-text font-semibold">{profile?.fullName || 'Geliştirici'}</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer