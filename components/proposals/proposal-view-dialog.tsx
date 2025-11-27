'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  FileText, 
  User, 
  Building2, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Send
} from 'lucide-react'
import { useState } from 'react'
import { ProposalSendDialog } from './proposal-send-dialog'

interface ProposalViewDialogProps {
  open: boolean
  onClose: () => void
  proposal: any
}

const statusMap: Record<string, { label: string; variant: any; icon: any }> = {
  EM_ANALISE: { label: 'Em Análise', variant: 'warning', icon: Clock },
  APROVADA: { label: 'Aprovada', variant: 'success', icon: CheckCircle },
  REJEITADA: { label: 'Rejeitada', variant: 'destructive', icon: XCircle },
  EM_NEGOCIACAO: { label: 'Em Negociação', variant: 'info', icon: Clock },
  CANCELADA: { label: 'Cancelada', variant: 'secondary', icon: XCircle },
}

export function ProposalViewDialog({ open, onClose, proposal }: ProposalViewDialogProps) {
  const [updating, setUpdating] = useState(false)
  const [sendDialogOpen, setSendDialogOpen] = useState(false)

  if (!proposal) return null

  const statusInfo = statusMap[proposal.status]
  const StatusIcon = statusInfo?.icon

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    try {
      await fetch(`/api/proposals/${proposal.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      onClose()
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Detalhes da Proposta</DialogTitle>
            <Badge variant={statusInfo?.variant} className="text-sm">
              {StatusIcon && <StatusIcon className="h-4 w-4 mr-1" />}
              {statusInfo?.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Número</p>
                    <p className="font-mono font-semibold">{proposal.number}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Criação</p>
                    <p className="font-semibold">{formatDate(proposal.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <p className="font-semibold">{proposal.client?.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">Vendedor</p>
                    <p className="font-semibold">{proposal.user?.name}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Proposal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da Proposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Título</p>
                <p className="text-lg font-semibold">{proposal.title}</p>
              </div>

              {proposal.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Descrição</p>
                  <p className="text-sm">{proposal.description}</p>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo de Serviço</p>
                  <Badge variant="secondary" className="mt-1">
                    {proposal.serviceType?.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Tipo de Contrato</p>
                  <Badge variant={proposal.contractType === 'MOT' ? 'info' : 'secondary'} className="mt-1">
                    {proposal.contractType === 'MOT' ? 'MOT' : 'Regular'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Período</p>
                  <p className="text-sm mt-1">
                    {proposal.startDate && proposal.endDate
                      ? `${formatDate(proposal.startDate)} - ${formatDate(proposal.endDate)}`
                      : 'Não definido'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Itens da Proposta</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead className="text-right">Quant. de Postos</TableHead>
                    <TableHead className="text-right">Valor Unit. do Posto</TableHead>
                    <TableHead className="text-right">Total Mensal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposal.items?.map((item: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{item.description}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatCurrency(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Total and Commission */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Valor Total Mensal</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(proposal.totalValue)}
                  </span>
                </div>
                {proposal.commission && (
                  <div className="flex justify-between items-center text-sm border-t pt-3">
                    <span className="text-muted-foreground">
                      Comissão ({proposal.commission.percentage}%)
                    </span>
                    <span className="font-semibold text-green-600">
                      {formatCurrency(proposal.commission.amount)}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {proposal.observations && (
            <Card>
              <CardHeader>
                <CardTitle>Observações</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{proposal.observations}</p>
              </CardContent>
            </Card>
          )}

          {/* Send Button */}
          <div className="flex gap-2">
            <Button
              className="flex-1"
              variant="outline"
              onClick={() => setSendDialogOpen(true)}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar ao Cliente
            </Button>
          </div>

          {/* Actions */}
          {proposal.status === 'EM_ANALISE' && (
            <div className="flex gap-2">
              <Button
                className="flex-1"
                variant="default"
                onClick={() => handleStatusChange('APROVADA')}
                disabled={updating}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Aprovar Proposta
              </Button>
              <Button
                className="flex-1"
                variant="destructive"
                onClick={() => handleStatusChange('REJEITADA')}
                disabled={updating}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Rejeitar Proposta
              </Button>
            </div>
          )}
        </div>
      </DialogContent>

      <ProposalSendDialog
        open={sendDialogOpen}
        onClose={() => setSendDialogOpen(false)}
        proposal={proposal}
      />
    </Dialog>
  )
}

