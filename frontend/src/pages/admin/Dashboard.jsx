import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  User, Briefcase, GraduationCap, Award,
  FolderGit2, LogOut, Menu, X, Code2,
  Home, FileText, Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

import ProfilePanel     from './panels/ProfilePanel'
import ExperiencePanel  from './panels/ExperiencePanel'
import EducationPanel   from './panels/EducationPanel'
import CertificatePanel from './panels/CertificatePanel'
import ProjectPanel     from './panels/ProjectPanel'
import CVPanel          from './panels/CVPanel'
import SettingsPanel    from './panels/SettingsPanel'

const menuItems = [
  { id: 'profile',      label: 'Profil',       icon: User },
  { id: 'experience',   label: 'Deneyim',      icon: Briefcase },
  { id: 'education',    label: 'Eğitim',       icon: GraduationCap },
  { id: 'certificates', label: 'Sertifikalar', icon: Award },
  { id: 'projects',     label: 'Projeler',     icon: FolderGit2 },
  { id: 'cv',           label: 'CV Oluştur',   icon: FileText },
]

const Dashboard = () => {
  const dispatch  = useDispatch()
  const navigate  = useNavigate()
  const { user }  = useSelector((state) => state.auth)
  const { data: profile } = useSelector((state) => state.profile)

  const [activePanel, setActivePanel] = useState('profile')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Çıkış yapıldı')
    navigate('/admin/login')
  }

  const renderPanel = () => {
    switch (activePanel) {
      case 'profile':      return <ProfilePanel />
      case 'experience':   return <ExperiencePanel />
      case 'education':    return <EducationPanel />
      case 'certificates': return <CertificatePanel />
      case 'projects':     return <ProjectPanel />
      case 'cv':           return <CVPanel />
      case 'settings':     return <SettingsPanel />
      default:             return <ProfilePanel />
    }
  }

  const allItems  = [...menuItems, { id: 'settings', label: 'Ayarlar' }]
  const activeItem = allItems.find((m) => m.id === activePanel)

  return (
    <>
      <Helmet>
        <title>Admin Panel — {profile?.fullName || 'Portfolyo'}</title>
      </Helmet>

      <div className="min-h-screen bg-gray-950 flex">

        {/* Sidebar */}
        <aside className={"fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col transition-transform duration-300 " + (
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Code2 size={18} className="text-white" />
            </div>
            <span className="font-bold text-white">Admin Panel</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto lg:hidden text-gray-400 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Menü */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => { setActivePanel(id); setSidebarOpen(false) }}
                className={"w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all " + (
                  activePanel === id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                )}
              >
                <Icon size={18} />
                {label}
                {id === 'cv' && (
                  <span className="ml-auto text-xs bg-indigo-500 text-white px-1.5 py-0.5 rounded-md">
                    Yeni
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Alt kısım */}
          <div className="px-3 py-4 border-t border-gray-800 space-y-1">
            <button
              onClick={() => { setActivePanel('settings'); setSidebarOpen(false) }}
              className={"w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all " + (
                activePanel === 'settings'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Settings size={18} />
              Ayarlar
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
            >
              <Home size={18} />
              Siteyi Gör
            </a>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-all"
            >
              <LogOut size={18} />
              Çıkış Yap
            </button>
          </div>
        </aside>

        {/* Mobil overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Ana içerik */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur border-b border-gray-800 px-4 sm:px-6 py-4 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-400 hover:text-white transition-colors"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-white font-semibold">{activeItem?.label || 'Dashboard'}</h1>
              <p className="text-gray-500 text-xs">{user?.email}</p>
            </div>
          </header>

          <main className="flex-1 p-4 sm:p-6">
            {renderPanel()}
          </main>
        </div>
      </div>
    </>
  )
}

export default Dashboard