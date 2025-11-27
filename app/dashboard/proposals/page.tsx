'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Eye, Edit, Trash2, FileText } from 'lucide-react'
import { ProposalDialog } from '@/components/proposals/proposal-dialog'
import { ProposalViewDialog } from '@/components/proposals/proposal-view-dialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface Proposal {
  id: string
  number: string
  title: string
  status: string
  serviceType: string
  contractType: string
  totalValue: number
  createdAt: string
  client: {
    name: string
  }
  user: {
    name: string
  }
}

const statusMap: Record<string, { label: string; variant: any }> = {
  EM_ANALISE: { label: 'Em Análise', variant: 'warning' },
  APROVADA: { label: 'Aprovada', variant: 'success' },
  REJEITADA: { label: 'Rejeitada', variant: 'destructive' },
  EM_NEGOCIACAO: { label: 'Em Negociação', variant: 'info' },
  CANCELADA: { label: 'Cancelada', variant: 'secondary' },
}

const serviceTypeMap: Record<string, string> = {
  COPEIRAGEM: 'Copeiragem',
  LIMPEZA_POS_OBRA: 'Limpeza Pós-Obra',
  LIMPEZA_GERAL: 'Limpeza Geral',
  LIMPEZA_INDUSTRIAL: 'Limpeza Industrial',
  JARDINAGEM: 'Jardinagem',
  PORTARIA: 'Portaria',
  RECEPCAO: 'Recepção',
  OUTROS: 'Outros',
}

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedProposal, setSelectedProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProposals()
  }, [])

  useEffect(() => {
    let filtered = proposals

    if (searchTerm) {
      filtered = filtered.filter(proposal =>
        proposal.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proposal.client.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(proposal => proposal.status === statusFilter)
    }

    setFilteredProposals(filtered)
  }, [searchTerm, statusFilter, proposals])

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/proposals')
      const data = await response.json()
      setProposals(data)
      setFilteredProposals(data)
    } catch (error) {
      console.error('Error fetching proposals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleView = async (proposal: Proposal) => {
    try {
      const response = await fetch(`/api/proposals/${proposal.id}`)
      const data = await response.json()
      setSelectedProposal(data)
      setViewDialogOpen(true)
    } catch (error) {
      console.error('Error fetching proposal:', error)
    }
  }

  const handleEdit = async (proposal: Proposal) => {
    try {
      const response = await fetch(`/api/proposals/${proposal.id}`)
      const data = await response.json()
      setSelectedProposal(data)
      setDialogOpen(true)
    } catch (error) {
      console.error('Error fetching proposal:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta proposta?')) return

    try {
      await fetch(`/api/proposals/${id}`, { method: 'DELETE' })
      fetchProposals()
    } catch (error) {
      console.error('Error deleting proposal:', error)
    }
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
    setViewDialogOpen(false)
    setSelectedProposal(null)
    fetchProposals()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando propostas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Propostas Comerciais</h1>
          <p className="text-slate-500 mt-1">
            Gerencie suas propostas e acompanhe o status
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Proposta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número, título ou cliente..."
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
                <SelectItem value="EM_ANALISE">Em Análise</SelectItem>
                <SelectItem value="APROVADA">Aprovada</SelectItem>
                <SelectItem value="REJEITADA">Rejeitada</SelectItem>
                <SelectItem value="EM_NEGOCIACAO">Em Negociação</SelectItem>
                <SelectItem value="CANCELADA">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm text-muted-foreground">
              {filteredProposals.length} proposta(s)
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Serviço</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    Nenhuma proposta encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredProposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell className="font-mono text-sm">
                      {proposal.number}
                    </TableCell>
                    <TableCell className="font-medium">{proposal.title}</TableCell>
                    <TableCell>{proposal.client.name}</TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {serviceTypeMap[proposal.serviceType]}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={proposal.contractType === 'MOT' ? 'info' : 'secondary'}>
                        {proposal.contractType === 'MOT' ? 'MOT' : 'Regular'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(proposal.totalValue)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusMap[proposal.status]?.variant}>
                        {statusMap[proposal.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(proposal.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(proposal)}
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(proposal)}
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(proposal.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <ProposalDialog
        open={dialogOpen}
        onClose={handleDialogClose}
        proposal={selectedProposal}
      />

      <ProposalViewDialog
        open={viewDialogOpen}
        onClose={handleDialogClose}
        proposal={selectedProposal}
      />
    </div>
  )
}

