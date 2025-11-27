'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency } from '@/lib/utils'
import { Calendar, DollarSign } from 'lucide-react'

interface ReceiveCommissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  commission: {
    id: string
    amount: number
    proposal: {
      number: string
      title: string
    }
    user: {
      name: string
    }
  }
  onSuccess: () => void
}

export function ReceiveCommissionDialog({
  open,
  onOpenChange,
  commission,
  onSuccess,
}: ReceiveCommissionDialogProps) {
  const [paymentType, setPaymentType] = useState<'A_VISTA' | 'PARCELADO'>('A_VISTA')
  const [installments, setInstallments] = useState(2)
  const [observations, setObservations] = useState('')
  const [loading, setLoading] = useState(false)

  const installmentValue = commission.amount / installments

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/commissions/${commission.id}/receive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentType,
          installments: paymentType === 'PARCELADO' ? installments : 1,
          observations,
        }),
      })

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
        // Reset form
        setPaymentType('A_VISTA')
        setInstallments(2)
        setObservations('')
      } else {
        alert('Erro ao confirmar recebimento')
      }
    } catch (error) {
      console.error('Error receiving commission:', error)
      alert('Erro ao confirmar recebimento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Confirmar Recebimento de Comissão
          </DialogTitle>
          <DialogDescription>
            Configure os detalhes do recebimento da comissão
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Informações da Comissão */}
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Proposta:</span>
              <span className="font-mono text-sm font-medium">{commission.proposal.number}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-600">Vendedor:</span>
              <span className="text-sm font-medium">{commission.user.name}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t">
              <span className="text-sm font-semibold text-slate-700">Valor Total:</span>
              <span className="text-lg font-bold text-green-600">
                {formatCurrency(commission.amount)}
              </span>
            </div>
          </div>

          {/* Tipo de Pagamento */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Forma de Recebimento</Label>
            <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as 'A_VISTA' | 'PARCELADO')}>
              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="A_VISTA" id="a_vista" />
                <Label htmlFor="a_vista" className="flex-1 cursor-pointer">
                  <div className="font-medium">À Vista</div>
                  <div className="text-sm text-slate-500">Recebimento integral</div>
                </Label>
                <div className="text-sm font-semibold text-green-600">
                  {formatCurrency(commission.amount)}
                </div>
              </div>

              <div className="flex items-center space-x-2 border rounded-lg p-3 cursor-pointer hover:bg-slate-50">
                <RadioGroupItem value="PARCELADO" id="parcelado" />
                <Label htmlFor="parcelado" className="flex-1 cursor-pointer">
                  <div className="font-medium">Parcelado</div>
                  <div className="text-sm text-slate-500">Recebimento em parcelas</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Número de Parcelas */}
          {paymentType === 'PARCELADO' && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              <Label htmlFor="installments" className="text-base font-semibold">
                Número de Parcelas
              </Label>
              <div className="space-y-2">
                <Input
                  id="installments"
                  type="number"
                  min="2"
                  max="12"
                  value={installments}
                  onChange={(e) => setInstallments(Math.max(2, Math.min(12, parseInt(e.target.value) || 2)))}
                  className="text-center text-lg font-semibold"
                />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-blue-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Valor por parcela:
                    </span>
                    <span className="text-base font-bold text-blue-700">
                      {formatCurrency(installmentValue)}
                    </span>
                  </div>
                  <p className="text-xs text-blue-600 mt-1">
                    {installments}x de {formatCurrency(installmentValue)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="observations">Observações (opcional)</Label>
            <Textarea
              id="observations"
              placeholder="Adicione observações sobre o recebimento..."
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Confirmando...' : 'Confirmar Recebimento'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

