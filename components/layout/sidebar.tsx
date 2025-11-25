'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
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
} from 'lucide-react'

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
    title: 'Editor de PDF',
    href: '/dashboard/pdf-editor',
    icon: FileText,
  },
  {
    title: 'Usuários',
    href: '/dashboard/users',
    icon: UserCircle,
  },
  {
    title: 'Configurações',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <div className="flex h-16 items-center gap-2 border-b border-slate-700 px-6">
        <img 
          src="/logo-fglink.png" 
          alt="FGlink Logo" 
          className="w-16 h-16 object-contain"
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
          <h1 className="text-xl font-bold">FGlink</h1>
          <p className="text-xs text-slate-400">v2.0</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {menuItems.map((item) => {
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
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
      <div className="border-t border-slate-700 p-4">
        <div className="text-xs text-slate-400">
          <p>Sistema Comercial</p>
          <p className="mt-1">Serviços de Limpeza Profissional</p>
        </div>
      </div>
    </div>
  )
}

