'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { CheckCircle, Clock, Calendar, DollarSign, TrendingUp } from 'lucide-react'

interface InstallmentsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  commission: {
    id: string
    amount: number
    percentage: number
    installments?: number
    paymentType?: string
    proposal: {
      number: string
      title: string
    }
    user: {
      name: string
    }
    installmentsPaid?: Array<{
      id: string
      installmentNumber: number
      amount: number
      status: string
      receivedAt?: string
      dueDate?: string
    }>
  }
  onSuccess: () => void
}

export function InstallmentsDialog({
  open,
  onOpenChange,
  commission,
  onSuccess,
}: InstallmentsDialogProps) {
  const [loading, setLoading] = useState(false)

  if (!commission) return null

  const installments = commission.installmentsPaid || []
  const receivedCount = installments.filter(i => i.status === 'RECEBIDA').length
  const pendingCount = installments.filter(i => i.status === 'PENDENTE').length
  const totalReceived = installments
    .filter(i => i.status === 'RECEBIDA')
    .reduce((sum, i) => sum + i.amount, 0)

  const handleMarkAsReceived = async (installmentId: string) => {
    if (!confirm('Confirmar recebimento desta parcela?')) return

    setLoading(true)
    try {
      const response = await fetch(`/api/commissions/installments/${installmentId}/receive`, {
        method: 'PUT',
      })

      if (response.ok) {
        onSuccess()
      } else {
        alert('Erro ao confirmar recebimento')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('Erro ao confirmar recebimento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="h-6 w-6 text-green-600" />
            Parcelas da Comissão
          </DialogTitle>
          <DialogDescription>
            Acompanhe o recebimento de cada parcela
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações da Comissão */}
          <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Proposta</p>
                  <p className="font-mono font-semibold">{commission.proposal.number}</p>
                  <p className="text-sm text-slate-600">{commission.proposal.title}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Vendedor</p>
                  <p className="font-semibold">{commission.user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Valor Total</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(commission.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Forma de Pagamento</p>
                  <Badge variant="outline" className="text-base">
                    {commission.installments}x de {formatCurrency(commission.amount / (commission.installments || 1))}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resumo */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Recebidas</p>
                    <p className="text-2xl font-bold text-green-600">{receivedCount}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-yellow-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-600">Total Recebido</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(totalReceived)}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Parcelas */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Parcelas
            </h3>

            {installments.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-slate-500">
                  <Clock className="h-12 w-12 mx-auto mb-2 text-slate-400" />
                  <p>Nenhuma parcela encontrada</p>
                </CardContent>
              </Card>
            ) : (
              installments.map((installment) => (
                <Card
                  key={installment.id}
                  className={`transition-all ${
                    installment.status === 'RECEBIDA'
                      ? 'bg-green-50 border-green-200'
                      : 'bg-white hover:shadow-md'
                  }`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          installment.status === 'RECEBIDA'
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          <span className="font-bold text-lg">
                            {installment.installmentNumber}
                          </span>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-lg">
                              Parcela {installment.installmentNumber} de {commission.installments}
                            </p>
                            <Badge
                              variant={installment.status === 'RECEBIDA' ? 'success' : 'warning'}
                            >
                              {installment.status === 'RECEBIDA' ? '✓ Recebida' : '⏳ Pendente'}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatCurrency(installment.amount)}
                            </span>
                            {installment.receivedAt && (
                              <span className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="h-4 w-4" />
                                Recebida em {formatDate(installment.receivedAt)}
                              </span>
                            )}
                            {installment.dueDate && !installment.receivedAt && (
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Vencimento: {formatDate(installment.dueDate)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {installment.status === 'PENDENTE' && (
                        <Button
                          onClick={() => handleMarkAsReceived(installment.id)}
                          disabled={loading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Confirmar Recebimento
                        </Button>
                      )}

                      {installment.status === 'RECEBIDA' && (
                        <div className="text-green-600 font-semibold flex items-center gap-2">
                          <CheckCircle className="h-5 w-5" />
                          Recebida
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Progresso */}
          {installments.length > 0 && (
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">Progresso de Recebimento</span>
                    <span className="font-bold text-blue-600">
                      {receivedCount} de {installments.length} parcelas
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${(receivedCount / installments.length) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Recebido: {formatCurrency(totalReceived)}</span>
                    <span>Faltam: {formatCurrency(commission.amount - totalReceived)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

