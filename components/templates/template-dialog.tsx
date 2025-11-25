'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

interface TemplateDialogProps {
  open: boolean
  onClose: () => void
  template?: any
  onSave: () => void
}

export function TemplateDialog({ open, onClose, template, onSave }: TemplateDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    serviceType: 'LIMPEZA_GERAL',
    contractType: 'CONTRATO_REGULAR',
    active: true,
  })

  const [items, setItems] = useState<any[]>([
    { description: '', quantity: 1, unitPrice: 0 }
  ])

  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        description: template.description || '',
        serviceType: template.serviceType,
        contractType: template.contractType,
        active: template.active,
      })
      setItems(template.items?.length > 0 ? template.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })) : [{ description: '', quantity: 1, unitPrice: 0 }])
    } else {
      setFormData({
        name: '',
        description: '',
        serviceType: 'LIMPEZA_GERAL',
        contractType: 'CONTRATO_REGULAR',
        active: true,
      })
      setItems([{ description: '', quantity: 1, unitPrice: 0 }])
    }
  }, [template, open])

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = template ? `/api/templates/${template.id}` : '/api/templates'
      const method = template ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: items.filter(item => item.description.trim()),
        }),
      })

      if (response.ok) {
        onSave()
        onClose()
      } else {
        alert('Erro ao salvar template')
      }
    } catch (error) {
      console.error('Erro ao salvar template:', error)
      alert('Erro ao salvar template')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{template ? 'Editar Template' : 'Novo Template'}</DialogTitle>
          <DialogDescription>
            Crie um modelo de proposta com itens pré-configurados
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome do Template *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="serviceType">Tipo de Serviço *</Label>
              <Select
                value={formData.serviceType}
                onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="COPEIRAGEM">Copeiragem</SelectItem>
                  <SelectItem value="LIMPEZA_POS_OBRA">Limpeza Pós-Obra</SelectItem>
                  <SelectItem value="LIMPEZA_GERAL">Limpeza Geral</SelectItem>
                  <SelectItem value="LIMPEZA_INDUSTRIAL">Limpeza Industrial</SelectItem>
                  <SelectItem value="JARDINAGEM">Jardinagem</SelectItem>
                  <SelectItem value="PORTARIA">Portaria</SelectItem>
                  <SelectItem value="RECEPCAO">Recepção</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contractType">Tipo de Contrato *</Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) => setFormData({ ...formData, contractType: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CONTRATO_REGULAR">Contrato Regular (5%)</SelectItem>
                  <SelectItem value="MOT">MOT - Mão de Obra Temporária (4%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="active">Status</Label>
              <Select
                value={formData.active ? 'true' : 'false'}
                onValueChange={(value) => setFormData({ ...formData, active: value === 'true' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Ativo</SelectItem>
                  <SelectItem value="false">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-lg">Itens do Template</Label>
              <Button type="button" size="sm" onClick={handleAddItem}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start p-3 border rounded-lg">
                  <div className="flex-1">
                    <Input
                      placeholder="Descrição do item"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      required
                    />
                  </div>
                  <div className="w-32">
                    <Input
                      type="number"
                      placeholder="Quantidade"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="w-40">
                    <Input
                      type="number"
                      placeholder="Valor Unitário"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => handleRemoveItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium">
                Total de Itens: {items.filter(i => i.description.trim()).length}
              </p>
              <p className="text-sm text-slate-600">
                Valor Total Estimado: R$ {items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0).toFixed(2)}
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar Template'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

