'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Settings, Database, Shield, Sparkles } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Configurações</h1>
        <p className="text-slate-500 mt-1">
          Configurações e informações do sistema
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle>FGlink</CardTitle>
                <CardDescription>Sistema Comercial v2.0</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Versão:</span>
              <Badge variant="secondary">2.0.0</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ambiente:</span>
              <Badge variant="info">Desenvolvimento</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Framework:</span>
              <span className="font-medium">Next.js 14</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Database className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <CardTitle>Banco de Dados</CardTitle>
                <CardDescription>Informações do banco</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tipo:</span>
              <span className="font-medium">SQLite</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">ORM:</span>
              <span className="font-medium">Prisma</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="success">Conectado</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Segurança</CardTitle>
                <CardDescription>Configurações de segurança</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Autenticação:</span>
              <Badge variant="success">NextAuth</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Criptografia:</span>
              <span className="font-medium">bcrypt</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Sessão:</span>
              <span className="font-medium">JWT</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle>Funcionalidades</CardTitle>
                <CardDescription>Módulos disponíveis</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Gestão de Clientes</span>
              <Badge variant="success">Ativo</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Propostas Comerciais</span>
              <Badge variant="success">Ativo</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Comissões Automáticas</span>
              <Badge variant="success">Ativo</Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Relatórios</span>
              <Badge variant="success">Ativo</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-primary/20">
        <CardHeader>
          <CardTitle>Sobre o Sistema</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">FGlink - Sistema Comercial</h3>
            <p className="text-sm text-muted-foreground">
              Sistema para gestão de propostas comerciais e comissões, desenvolvido por Douglas Marques.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">Principais Funcionalidades:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Cadastro completo de clientes (PF e PJ)</li>
              <li>Criação e acompanhamento de propostas comerciais</li>
              <li>Cálculo automático de comissões (5% Regular / 4% MOT)</li>
              <li>Dashboard com métricas e gráficos em tempo real</li>
              <li>Relatórios detalhados por vendedor, cliente e serviço</li>
              <li>Gestão de usuários com diferentes níveis de acesso</li>
              <li>Interface moderna e responsiva</li>
            </ul>
          </div>
          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              © 2025 FGlink. Todos os direitos reservados.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

