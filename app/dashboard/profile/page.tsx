'use client'

import { useEffect, useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, User, Mail, Lock, Save, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const roleMap: Record<string, { label: string; variant: any }> = {
  ADMIN: { label: 'Administrador', variant: 'destructive' },
  GERENTE: { label: 'Gerente', variant: 'info' },
  VENDEDOR: { label: 'Vendedor', variant: 'secondary' },
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatarUrl: '',
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.user) {
      // Buscar dados completos do usuário (incluindo avatar)
      fetch('/api/profile')
        .then(res => res.json())
        .then(userData => {
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            avatarUrl: userData.avatarUrl || '',
          })
          setAvatarPreview(userData.avatarUrl || null)
        })
        .catch(err => {
          console.error('Erro ao carregar perfil:', err)
          // Fallback para dados da sessão
          setFormData({
            name: session.user.name || '',
            email: session.user.email || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            avatarUrl: '',
          })
        })
    }
  }, [session])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Imagem muito grande! Máximo 2MB' })
      return
    }

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Apenas imagens são permitidas' })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
      setFormData({ ...formData, avatarUrl: reader.result as string })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      console.log('📤 Enviando dados:', {
        name: formData.name,
        email: formData.email,
        avatarUrl: formData.avatarUrl ? 'presente' : 'vazio',
      })

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          avatarUrl: formData.avatarUrl,
        }),
      })

      const data = await response.json()
      console.log('📥 Resposta da API:', data)

      if (response.ok) {
        setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' })
        
        // Atualizar sessão
        console.log('🔄 Atualizando sessão...')
        await update({
          ...session,
          user: {
            ...session?.user,
            name: data.name,
            email: data.email,
            avatarUrl: data.avatarUrl,
          },
        })
        console.log('✅ Sessão atualizada!')

        // Recarregar a página após 1 segundo para garantir que a sessão foi atualizada
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao atualizar perfil' })
      }
    } catch (error) {
      console.error('❌ Erro:', error)
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' })
      setLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter no mínimo 6 caracteres' })
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.error || 'Erro ao alterar senha' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao alterar senha' })
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Meu Perfil</h1>
        <p className="text-slate-500 mt-1">
          Gerencie suas informações pessoais e configurações
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Informações do Perfil */}
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>Atualize suas informações pessoais</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile} className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-6">
              <div
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center cursor-pointer group hover:opacity-80 transition-opacity"
                onClick={handleAvatarClick}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{session.user.name}</h3>
                <p className="text-sm text-slate-500">{session.user.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-slate-400" />
                  <Badge variant={roleMap[session.user.role]?.variant}>
                    {roleMap[session.user.role]?.label}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Seu nome"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Alterar Senha */}
      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPassword} className="space-y-4">
            {/* Senha Atual */}
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Senha Atual
              </Label>
              <Input
                id="currentPassword"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="••••••••"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nova Senha */}
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova Senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <p className="text-xs text-slate-500">
              A senha deve ter no mínimo 6 caracteres
            </p>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                <Lock className="mr-2 h-4 w-4" />
                {loading ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

