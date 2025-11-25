'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Search, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Commission {
  id: string
  baseValue: number
  percentage: number
  amount: number
  status: string
  createdAt: string
  paidAt?: string
  proposal: {
    number: string
    title: string
    client: {
      name: string
    }
  }
  user: {
    name: string
  }
}

const statusMap: Record<string, { label: string; variant: any }> = {
  PENDENTE: { label: 'Pendente', variant: 'warning' },
  PAGA: { label: 'Paga', variant: 'success' },
  CANCELADA: { label: 'Cancelada', variant: 'destructive' },
}

export default function CommissionsPage() {
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [filteredCommissions, setFilteredCommissions] = useState<Commission[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    paid: 0,
    thisMonth: 0,
  })

  useEffect(() => {
    fetchCommissions()
  }, [])

  useEffect(() => {
    let filtered = commissions

    if (searchTerm) {
      filtered = filtered.filter(commission =>
        commission.proposal.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        commission.user.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(commission => commission.status === statusFilter)
    }

    setFilteredCommissions(filtered)
  }, [searchTerm, statusFilter, commissions])

  const fetchCommissions = async () => {
    try {
      const response = await fetch('/api/commissions')
      const data = await response.json()
      setCommissions(data.commissions)
      setFilteredCommissions(data.commissions)
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching commissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handlePayCommission = async (id: string) => {
    if (!confirm('Confirmar pagamento desta comissão?')) return

    try {
      await fetch(`/api/commissions/${id}/pay`, {
        method: 'PUT',
      })
      fetchCommissions()
    } catch (error) {
      console.error('Error paying commission:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando comissões...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Comissões</h1>
        <p className="text-slate-500 mt-1">
          Acompanhe e gerencie as comissões dos vendedores
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Acumulado
            </CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Todas as comissões
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pendentes
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pending)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Aguardando pagamento
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pagas
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.paid)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Já pagas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Este Mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.thisMonth)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Comissões do mês
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por proposta, vendedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Todos os Status</SelectItem>
                <SelectItem value="PENDENTE">Pendente</SelectItem>
                <SelectItem value="PAGA">Paga</SelectItem>
                <SelectItem value="CANCELADA">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {filteredCommissions.length} comissão(ões)
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposta</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Vendedor</TableHead>
                <TableHead>Valor Base</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Comissão</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommissions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhuma comissão encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredCommissions.map((commission) => (
                  <TableRow key={commission.id}>
                    <TableCell>
                      <div>
                        <p className="font-mono text-sm">{commission.proposal.number}</p>
                        <p className="text-xs text-muted-foreground">
                          {commission.proposal.title}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{commission.proposal.client.name}</TableCell>
                    <TableCell className="font-medium">{commission.user.name}</TableCell>
                    <TableCell>{formatCurrency(commission.baseValue)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{commission.percentage}%</Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(commission.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[commission.status]?.variant}>
                        {statusMap[commission.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {commission.paidAt
                        ? `Paga em ${formatDate(commission.paidAt)}`
                        : formatDate(commission.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      {commission.status === 'PENDENTE' && (
                        <Button
                          size="sm"
                          onClick={() => handlePayCommission(commission.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Pagar
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

