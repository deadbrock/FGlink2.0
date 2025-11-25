'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Copy } from 'lucide-react'
import { TemplateDialog } from '@/components/templates/template-dialog'

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/templates')
      if (response.ok) {
        const data = await response.json()
        setTemplates(data)
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este template?')) return

    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        loadTemplates()
      }
    } catch (error) {
      console.error('Erro ao excluir template:', error)
    }
  }

  const handleDuplicate = async (template: any) => {
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...template,
          name: `${template.name} (Cópia)`,
        }),
      })

      if (response.ok) {
        loadTemplates()
      }
    } catch (error) {
      console.error('Erro ao duplicar template:', error)
    }
  }

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(search.toLowerCase())
  )

  const getServiceTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      COPEIRAGEM: 'Copeiragem',
      LIMPEZA_POS_OBRA: 'Limpeza Pós-Obra',
      LIMPEZA_GERAL: 'Limpeza Geral',
      LIMPEZA_INDUSTRIAL: 'Limpeza Industrial',
      JARDINAGEM: 'Jardinagem',
      PORTARIA: 'Portaria',
      RECEPCAO: 'Recepção',
      OUTROS: 'Outros',
    }
    return types[type] || type
  }

  const getContractTypeLabel = (type: string) => {
    return type === 'MOT' ? 'MOT' : 'Contrato Regular'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Templates de Proposta</h1>
          <p className="text-slate-500 mt-1">
            Crie modelos com itens pré-configurados para agilizar suas propostas
          </p>
        </div>
        <Button onClick={() => { setSelectedTemplate(null); setDialogOpen(true) }}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Template
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Templates Cadastrados</CardTitle>
            <Input
              placeholder="Buscar templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              {search ? 'Nenhum template encontrado' : 'Nenhum template cadastrado'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo de Serviço</TableHead>
                  <TableHead>Tipo de Contrato</TableHead>
                  <TableHead>Itens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium">
                      {template.name}
                      {template.description && (
                        <p className="text-sm text-slate-500">{template.description}</p>
                      )}
                    </TableCell>
                    <TableCell>{getServiceTypeLabel(template.serviceType)}</TableCell>
                    <TableCell>{getContractTypeLabel(template.contractType)}</TableCell>
                    <TableCell>{template.items?.length || 0} itens</TableCell>
                    <TableCell>
                      <Badge variant={template.active ? 'default' : 'secondary'}>
                        {template.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDuplicate(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedTemplate(template); setDialogOpen(true) }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <TemplateDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setSelectedTemplate(null) }}
        template={selectedTemplate}
        onSave={loadTemplates}
      />
    </div>
  )
}

