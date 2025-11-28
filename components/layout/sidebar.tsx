'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  FileText,
  DollarSign,
  BarChart3,
  Settings,
  Sparkles,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Clientes',
    href: '/dashboard/clients',
    icon: Users,
  },
  {
    title: 'Propostas',
    href: '/dashboard/proposals',
    icon: FileText,
  },
  {
    title: 'Comissões',
    href: '/dashboard/commissions',
    icon: DollarSign,
  },
  {
    title: 'Relatórios',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
  {
    title: 'Templates',
    href: '/dashboard/templates',
    icon: FileText,
  },
  {
    title: 'Importar Modelo PDF',
    href: '/dashboard/pdf-editor/upload-simple',
    icon: FileText,
  },
  {
    title: 'Usuários',
    href: '/dashboard/users',
    icon: UserCircle,
  },
  {
    title: 'Meu Perfil',
    href: '/dashboard/profile',
    icon: Settings,
  },
]

function UserInfo() {
  const { data: session } = useSession()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetch('/api/profile')
        .then(res => res.json())
        .then(userData => setAvatarUrl(userData.avatarUrl || null))
        .catch(() => setAvatarUrl(null))
    }
  }, [session])

  if (!session?.user) return null

  const handleLogout = () => {
    if (confirm('Deseja sair do sistema?')) {
      signOut({ callbackUrl: '/login' })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={session.user.name || 'Avatar'}
            className="w-10 h-10 rounded-full object-cover border-2 border-primary"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
            {session.user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {session.user.name}
          </p>
          <p className="text-xs text-slate-400 truncate">
            {session.user.email}
          </p>
        </div>
      </div>
      <Button
        variant="ghost"
        className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50"
        onClick={handleLogout}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sair
      </Button>
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Fechar menu mobile ao mudar de rota
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Filtrar itens do menu baseado no role do usuário
  const filteredMenuItems = menuItems.filter((item) => {
    // Itens apenas para ADMIN
    if (item.href === '/dashboard/users' && session?.user?.role !== 'ADMIN') {
      return false
    }
    if (item.href === '/dashboard/settings' && session?.user?.role !== 'ADMIN') {
      return false
    }
    if (item.href === '/dashboard/templates' && session?.user?.role !== 'ADMIN') {
      return false
    }
    if (item.href === '/dashboard/pdf-editor' && session?.user?.role !== 'ADMIN') {
      return false
    }
    if (item.href === '/dashboard/pdf-editor/upload-simple' && session?.user?.role !== 'ADMIN') {
      return false
    }
    if (item.href === '/dashboard/reports' && session?.user?.role === 'VENDEDOR') {
      return false
    }
    return true
  })

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-900 text-white rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay para mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white transition-transform duration-300 ease-in-out",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-6">
          <img 
            src="/logo-fglink.png" 
            alt="FGlink Logo" 
            className="w-12 h-12 object-contain"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              const fallback = e.currentTarget.nextElementSibling as HTMLElement
              if (fallback) fallback.style.display = 'flex'
            }}
          />
          <div className="hidden items-center justify-center w-10 h-10 bg-primary rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg lg:text-xl font-bold">FGlink</h1>
            <p className="text-xs text-slate-400">v2.0</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-slate-700/50',
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-300 hover:text-white'
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">{item.title}</span>
              </Link>
            )
          })}
        </nav>
        <div className="border-t border-slate-700 p-4">
          <UserInfo />
        </div>
      </div>
    </>
  )
}

