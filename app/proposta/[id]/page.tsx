'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { 
  Building2, 
  Calendar, 
  FileText, 
  Mail, 
  Phone, 
  Sparkles,
  CheckCircle,
  XCircle,
  MessageSquare,
  Download,
  Printer
} from 'lucide-react'

export default function PublicProposalPage() {
  const params = useParams()
  const [proposal, setProposal] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | 'negotiate' | null>(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [actionSuccess, setActionSuccess] = useState(false)

  useEffect(() => {
    fetchProposal()
  }, [params.id])

  const fetchProposal = async () => {
    try {
      const response = await fetch(`/api/proposals/${params.id}`)
      const data = await response.json()
      setProposal(data)
    } catch (error) {
      console.error('Error fetching proposal:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action: 'approve' | 'reject' | 'negotiate') => {
    setSubmitting(true)
    try {
      let newStatus = 'EM_ANALISE'
      if (action === 'approve') newStatus = 'APROVADA'
      if (action === 'reject') newStatus = 'REJEITADA'
      if (action === 'negotiate') newStatus = 'EM_NEGOCIACAO'

      const response = await fetch(`/api/proposals/${params.id}/client-action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          status: newStatus,
          message,
        }),
      })

      if (response.ok) {
        setActionSuccess(true)
        setTimeout(() => {
          setActionDialog(null)
          setMessage('')
          fetchProposal()
          setActionSuccess(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Error submitting action:', error)
      alert('Erro ao processar ação. Tente novamente.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDownload = async () => {
    try {
      const { downloadOfficialProposalPDF } = await import('@/lib/pdf-generator-official')
      await downloadOfficialProposalPDF(proposal)
    } catch (error) {
      console.error('Error downloading:', error)
      alert('Erro ao baixar PDF. Tente novamente.')
    }
  }

  const handleView = async () => {
    try {
      const { viewOfficialProposalPDF } = await import('@/lib/pdf-generator-official')
      await viewOfficialProposalPDF(proposal)
    } catch (error) {
      console.error('Error viewing:', error)
      alert('Erro ao visualizar PDF. Tente novamente.')
    }
  }

  const handlePrint = async () => {
    try {
      const { viewOfficialProposalPDF } = await import('@/lib/pdf-generator-official')
      await viewOfficialProposalPDF(proposal)
      setTimeout(() => window.print(), 1000)
    } catch (error) {
      console.error('Error printing:', error)
      alert('Erro ao imprimir. Tente novamente.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando proposta...</p>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-bold mb-2">Proposta não encontrada</h2>
            <p className="text-muted-foreground">
              A proposta que você está procurando não existe ou foi removida.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-t-4 border-t-primary">
          <CardHeader className="text-center">
            <div className="flex flex-col items-center mb-4">
              <img 
                src="/logo-fglink.png" 
                alt="FGlink Logo" 
                className="w-48 h-auto mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement
                  if (fallback) fallback.style.display = 'flex'
                }}
              />
              <div className="hidden items-center justify-center w-16 h-16 bg-primary rounded-xl mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-primary">FGlink</h1>
              <p className="text-sm text-muted-foreground">Serviços de Limpeza Profissional</p>
            </div>
            <CardTitle className="text-3xl">Proposta Comercial</CardTitle>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Badge variant="secondary" className="text-lg px-4 py-1">
                {proposal.number}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-semibold">{proposal.client.name}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="h-3 w-3" /> Email
                </p>
                <p className="font-semibold">{proposal.client.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Telefone
                </p>
                <p className="font-semibold">{proposal.client.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Detalhes da Proposta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Título</p>
              <p className="text-lg font-semibold">{proposal.title}</p>
            </div>
            {proposal.description && (
              <div>
                <p className="text-sm text-muted-foreground">Descrição</p>
                <p>{proposal.description}</p>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Serviço</p>
                <Badge variant="secondary">{proposal.serviceType.replace(/_/g, ' ')}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tipo de Contrato</p>
                <Badge variant={proposal.contractType === 'MOT' ? 'info' : 'secondary'}>
                  {proposal.contractType === 'MOT' ? 'MOT' : 'Regular'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Data de Criação
                </p>
                <p className="font-semibold">{formatDate(proposal.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itens */}
        <Card>
          <CardHeader>
            <CardTitle>Itens da Proposta</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Valor Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposal.items?.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.description}</TableCell>
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

        {/* Total */}
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <span className="text-xl font-semibold">Valor Total</span>
              <span className="text-3xl font-bold text-primary">
                {formatCurrency(proposal.totalValue)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
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

        {/* Actions - Only show if proposal is pending */}
        {proposal.status === 'EM_ANALISE' && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-center">O que você deseja fazer?</CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                Escolha uma das opções abaixo para responder à proposta
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  size="lg"
                  className="h-auto py-6 flex-col gap-2 bg-green-600 hover:bg-green-700"
                  onClick={() => setActionDialog('approve')}
                >
                  <CheckCircle className="h-8 w-8" />
                  <span className="text-lg font-semibold">Aprovar</span>
                  <span className="text-xs opacity-90">Aceito a proposta</span>
                </Button>

                <Button
                  size="lg"
                  className="h-auto py-6 flex-col gap-2 bg-blue-600 hover:bg-blue-700"
                  onClick={() => setActionDialog('negotiate')}
                >
                  <MessageSquare className="h-8 w-8" />
                  <span className="text-lg font-semibold">Negociar</span>
                  <span className="text-xs opacity-90">Quero conversar</span>
                </Button>

                <Button
                  size="lg"
                  variant="destructive"
                  className="h-auto py-6 flex-col gap-2"
                  onClick={() => setActionDialog('reject')}
                >
                  <XCircle className="h-8 w-8" />
                  <span className="text-lg font-semibold">Recusar</span>
                  <span className="text-xs opacity-90">Não tenho interesse</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Message */}
        {proposal.status !== 'EM_ANALISE' && (
          <Card className={`border-2 ${
            proposal.status === 'APROVADA' ? 'border-green-500 bg-green-50' :
            proposal.status === 'REJEITADA' ? 'border-red-500 bg-red-50' :
            proposal.status === 'EM_NEGOCIACAO' ? 'border-blue-500 bg-blue-50' :
            'border-gray-500 bg-gray-50'
          }`}>
            <CardContent className="pt-6 text-center">
              {proposal.status === 'APROVADA' && (
                <>
                  <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Proposta Aprovada!</h3>
                  <p className="text-green-700">
                    Obrigado por aceitar nossa proposta. Entraremos em contato em breve para dar continuidade.
                  </p>
                </>
              )}
              {proposal.status === 'REJEITADA' && (
                <>
                  <XCircle className="h-16 w-16 mx-auto text-red-600 mb-4" />
                  <h3 className="text-2xl font-bold text-red-800 mb-2">Proposta Recusada</h3>
                  <p className="text-red-700">
                    Agradecemos seu tempo em avaliar nossa proposta. Ficamos à disposição para futuras oportunidades.
                  </p>
                </>
              )}
              {proposal.status === 'EM_NEGOCIACAO' && (
                <>
                  <MessageSquare className="h-16 w-16 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-2xl font-bold text-blue-800 mb-2">Em Negociação</h3>
                  <p className="text-blue-700">
                    Recebemos sua solicitação. Nossa equipe entrará em contato em breve para conversar sobre os detalhes.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Download and Print Buttons */}
        <div className="flex gap-3 justify-center print:hidden flex-wrap">
          <Button variant="outline" onClick={handleView} size="lg">
            <FileText className="h-4 w-4 mr-2" />
            Visualizar PDF
          </Button>
          <Button variant="outline" onClick={handleDownload} size="lg">
            <Download className="h-4 w-4 mr-2" />
            Baixar PDF
          </Button>
          <Button variant="outline" onClick={handlePrint} size="lg">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </div>

        {/* Footer */}
        <Card className="print:border-t-2">
          <CardContent className="pt-6 text-center text-sm text-muted-foreground">
            <p className="font-semibold text-foreground">FGlink - Serviços de Limpeza Profissional</p>
            <p className="mt-1">Email: contato@fglink.com | Telefone: (11) 1234-5678</p>
            <p className="mt-2 text-xs">Proposta válida por 30 dias a partir da data de emissão</p>
            <p className="mt-1 text-xs">Data de emissão: {formatDate(proposal.createdAt)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Dialogs */}
      <Dialog open={actionDialog === 'approve'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              Aprovar Proposta
            </DialogTitle>
            <DialogDescription>
              Você está prestes a aprovar esta proposta. Nossa equipe será notificada e entrará em contato para dar continuidade.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="approve-message">Mensagem (opcional)</Label>
              <Textarea
                id="approve-message"
                placeholder="Deixe uma mensagem para nossa equipe..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            {actionSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-semibold">
                  ✅ Proposta aprovada com sucesso!
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleAction('approve')} 
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Processando...' : 'Confirmar Aprovação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog === 'negotiate'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Solicitar Negociação
            </DialogTitle>
            <DialogDescription>
              Conte-nos o que você gostaria de discutir ou ajustar na proposta.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="negotiate-message">Mensagem *</Label>
              <Textarea
                id="negotiate-message"
                placeholder="Ex: Gostaria de discutir os valores, prazos, forma de pagamento..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                required
              />
            </div>

            {actionSuccess && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 font-semibold">
                  ✅ Solicitação enviada com sucesso!
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleAction('negotiate')} 
              disabled={submitting || !message}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {submitting ? 'Enviando...' : 'Enviar Solicitação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionDialog === 'reject'} onOpenChange={() => setActionDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-600" />
              Recusar Proposta
            </DialogTitle>
            <DialogDescription>
              Lamentamos que a proposta não atendeu suas expectativas. Sua opinião é importante para nós.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="reject-message">Motivo da recusa (opcional)</Label>
              <Textarea
                id="reject-message"
                placeholder="Nos ajude a entender o motivo da recusa..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>

            {actionSuccess && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-semibold">
                  ✅ Resposta registrada com sucesso!
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setActionDialog(null)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleAction('reject')} 
              disabled={submitting}
              variant="destructive"
            >
              {submitting ? 'Processando...' : 'Confirmar Recusa'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

