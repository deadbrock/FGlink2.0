'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
import { Plus, Trash2, FileDown } from 'lucide-react'
import { generateProposalNumber, calculateCommission } from '@/lib/utils'

interface ProposalDialogProps {
  open: boolean
  onClose: () => void
  proposal?: any
}

interface ProposalItem {
  id?: string
  description: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export function ProposalDialog({ open, onClose, proposal }: ProposalDialogProps) {
  const { data: session } = useSession()
  const [clients, setClients] = useState<any[]>([])
  const [templates, setTemplates] = useState<any[]>([])
  const [pdfTemplates, setPdfTemplates] = useState<any[]>([])
  const [formData, setFormData] = useState({
    clientId: '',
    title: '',
    description: '',
    serviceType: 'LIMPEZA_GERAL',
    contractType: 'CONTRATO_REGULAR',
    startDate: '',
    endDate: '',
    observations: '',
    pdfTemplateId: '',
  })
  const [items, setItems] = useState<ProposalItem[]>([
    { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }
  ])
  const [loading, setLoading] = useState(false)
  const [showTemplateSelect, setShowTemplateSelect] = useState(false)

  useEffect(() => {
    if (open) {
      fetchClients()
      fetchTemplates()
      fetchPdfTemplates()
    }
  }, [open])

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      const data = await response.json()
      setTemplates(data.filter((t: any) => t.active))
    } catch (error) {
      console.error('Erro ao buscar templates:', error)
    }
  }

  const fetchPdfTemplates = async () => {
    try {
      const response = await fetch('/api/pdf-templates')
      const data = await response.json()
      setPdfTemplates(data)
    } catch (error) {
      console.error('Erro ao buscar templates de PDF:', error)
    }
  }

  const handleImportTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    // Importar dados do template
    setFormData({
      ...formData,
      serviceType: template.serviceType,
      contractType: template.contractType,
      title: template.name,
      description: template.description || '',
    })

    // Importar itens do template
    if (template.items && template.items.length > 0) {
      setItems(template.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.quantity * item.unitPrice,
      })))
    }

    setShowTemplateSelect(false)
    alert(`✅ Template "${template.name}" importado com sucesso!\n\n${template.items?.length || 0} itens foram adicionados.`)
  }

  useEffect(() => {
    if (proposal) {
      setFormData({
        clientId: proposal.clientId || '',
        title: proposal.title || '',
        description: proposal.description || '',
        serviceType: proposal.serviceType || 'LIMPEZA_GERAL',
        contractType: proposal.contractType || 'CONTRATO_REGULAR',
        startDate: proposal.startDate ? new Date(proposal.startDate).toISOString().split('T')[0] : '',
        endDate: proposal.endDate ? new Date(proposal.endDate).toISOString().split('T')[0] : '',
        observations: proposal.observations || '',
        pdfTemplateId: proposal.pdfTemplateId || '',
      })
      if (proposal.items && proposal.items.length > 0) {
        setItems(proposal.items)
      }
    } else {
      setFormData({
        clientId: '',
        title: '',
        description: '',
        serviceType: 'LIMPEZA_GERAL',
        contractType: 'CONTRATO_REGULAR',
        startDate: '',
        endDate: '',
        observations: '',
        pdfTemplateId: '',
      })
      setItems([{ description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }])
    }
  }, [proposal, open])

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients')
      const data = await response.json()
      setClients(data.filter((c: any) => c.active))
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const handleItemChange = (index: number, field: keyof ProposalItem, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    
    if (field === 'quantity' || field === 'unitPrice') {
      newItems[index].totalPrice = newItems[index].quantity * newItems[index].unitPrice
    }
    
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, totalPrice: 0 }])
  }

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index))
    }
  }

  const getTotalValue = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0)
  }

  const getCommissionValue = () => {
    const total = getTotalValue()
    return calculateCommission(total, formData.contractType as any)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const totalValue = getTotalValue()
      const url = proposal ? `/api/proposals/${proposal.id}` : '/api/proposals'
      const method = proposal ? 'PUT' : 'POST'

      const dataToSend = {
        ...formData,
        userId: session?.user?.id,
        number: proposal?.number || generateProposalNumber(),
        totalValue,
        items: items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
        startDate: formData.startDate ? new Date(formData.startDate) : null,
        endDate: formData.endDate ? new Date(formData.endDate) : null,
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      })

      if (response.ok) {
        onClose()
      }
    } catch (error) {
      console.error('Error saving proposal:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {proposal ? 'Editar Proposta' : 'Nova Proposta'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados da proposta comercial
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="clientId">Cliente *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="title">Título da Proposta *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
              <Label htmlFor="startDate">Data de Início</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="endDate">Data de Término</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Itens da Proposta *</Label>
              <div className="flex gap-2">
                {!proposal && templates.length > 0 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowTemplateSelect(!showTemplateSelect)}
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Importar Template
                  </Button>
                )}
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>
            </div>

            {showTemplateSelect && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Label htmlFor="template">Selecione um Template</Label>
                <Select onValueChange={handleImportTemplate}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Escolha um template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.items?.length || 0} itens)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end p-4 border rounded-lg">
                <div className="col-span-5">
                  <Label>Descrição</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label>Valor Unit.</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>
                <div className="col-span-2">
                  <Label>Total</Label>
                  <Input
                    value={item.totalPrice.toFixed(2)}
                    disabled
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(index)}
                    disabled={items.length === 1}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between text-lg font-semibold">
              <span>Valor Total:</span>
              <span className="text-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(getTotalValue())}
              </span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Comissão ({formData.contractType === 'MOT' ? '4%' : '5%'}):</span>
              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(getCommissionValue())}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="observations">Observações</Label>
            <Textarea
              id="observations"
              value={formData.observations}
              onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="pdfTemplate">Template de PDF</Label>
            <Select
              value={formData.pdfTemplateId}
              onValueChange={(value) => setFormData({ ...formData, pdfTemplateId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um template (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Usar gerador padrão</SelectItem>
                {pdfTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-slate-500 mt-1">
              {pdfTemplates.length === 0 
                ? '⚠️ Nenhum template importado. Vá em Editor de PDF → Importar Modelo PDF'
                : '✅ Selecione um template para usar seu modelo personalizado'}
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : 'Salvar Proposta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

