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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center">
          <div className="relative">
            <div className="h-20 w-20 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-blue-600 animate-pulse" />
            </div>
          </div>
          <p className="mt-6 text-slate-600 font-medium text-lg">Carregando proposta...</p>
        </div>
      </div>
    )
  }

  if (!proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
        <Card className="max-w-md border-none shadow-2xl">
          <div className="bg-gradient-to-r from-red-600 to-rose-600 h-2"></div>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="inline-flex p-6 bg-red-100 rounded-full mb-6">
              <FileText className="h-16 w-16 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4 text-slate-800">Proposta não encontrada</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              A proposta que você está procurando não existe ou foi removida.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <Card className="border-none shadow-2xl bg-white overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 h-2"></div>
          <CardHeader className="text-center pb-8 pt-10">
            <div className="flex justify-center mb-0">
              <img 
                src="/logo-fgservices.png" 
                alt="FG Services" 
                className="h-41 w-41"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </div>
            <div className="space-y-3">
              <CardTitle className="text-4xl font-bold text-slate-800">Proposta Comercial</CardTitle>
              <div className="flex items-center justify-center gap-2">
                <Badge className="text-lg px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {proposal.number}
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Cliente */}
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              Dados do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            <div className="bg-slate-50 p-4 rounded-lg">
              <p className="text-sm text-slate-600 font-medium mb-1">Nome</p>
              <p className="text-lg font-bold text-slate-800">{proposal.client.name}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 font-medium flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-blue-600" /> Email
                </p>
                <p className="font-semibold text-slate-800">{proposal.client.email}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 font-medium flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-blue-600" /> Telefone
                </p>
                <p className="font-semibold text-slate-800">{proposal.client.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes */}
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Detalhes da Proposta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-100">
              <p className="text-sm text-slate-600 font-medium mb-2">Título</p>
              <p className="text-xl font-bold text-slate-800">{proposal.title}</p>
            </div>
            {proposal.description && (
              <div className="bg-slate-50 p-5 rounded-lg">
                <p className="text-sm text-slate-600 font-medium mb-2">Descrição</p>
                <p className="text-slate-700 leading-relaxed">{proposal.description}</p>
              </div>
            )}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 font-medium mb-2">Tipo de Serviço</p>
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white">
                  {proposal.serviceType.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 font-medium mb-2">Tipo de Contrato</p>
                <Badge className={proposal.contractType === 'MOT' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-slate-600 hover:bg-slate-700'}>
                  {proposal.contractType === 'MOT' ? 'MOT' : 'Regular'}
                </Badge>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600 font-medium flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-600" /> Data de Criação
                </p>
                <p className="font-bold text-slate-800">{formatDate(proposal.createdAt)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Itens */}
        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Itens da Proposta
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-100">
                    <TableHead className="font-bold text-slate-700">Descrição</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Quant. de Postos</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Valor Unit. do Posto</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Total Mensal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {proposal.items?.map((item: any, index: number) => (
                    <TableRow key={index} className="hover:bg-blue-50 transition-colors">
                      <TableCell className="font-medium text-slate-800">{item.description}</TableCell>
                      <TableCell className="text-right text-slate-700">{item.quantity}</TableCell>
                      <TableCell className="text-right text-slate-700">{formatCurrency(item.unitPrice)}</TableCell>
                      <TableCell className="text-right font-bold text-blue-600">
                        {formatCurrency(item.totalPrice)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Total */}
        <Card className="border-none shadow-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          <CardContent className="pt-8 pb-8 relative z-10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Valor Total da Proposta</p>
                <span className="text-2xl font-bold">Valor Total Mensal</span>
              </div>
              <div className="text-right">
                <span className="text-5xl font-black tracking-tight">
                  {formatCurrency(proposal.totalValue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Observações */}
        {proposal.observations && (
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                Observações
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg">
                <p className="text-slate-700 leading-relaxed">{proposal.observations}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions - Only show if proposal is pending */}
        {proposal.status === 'EM_ANALISE' && (
          <Card className="border-none shadow-2xl bg-white overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 h-2"></div>
            <CardHeader className="text-center pb-6 pt-8 bg-gradient-to-br from-slate-50 to-blue-50">
              <CardTitle className="text-3xl font-bold text-slate-800 mb-2">O que você deseja fazer?</CardTitle>
              <p className="text-slate-600 text-base">
                Escolha uma das opções abaixo para responder à proposta
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <Button
                  size="lg"
                  className="h-auto py-8 flex-col gap-3 bg-gradient-to-br from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setActionDialog('approve')}
                >
                  <div className="p-3 bg-white/20 rounded-full">
                    <CheckCircle className="h-10 w-10" />
                  </div>
                  <span className="text-xl font-bold">Aprovar</span>
                  <span className="text-sm opacity-90 font-medium">Aceito a proposta</span>
                </Button>

                <Button
                  size="lg"
                  className="h-auto py-8 flex-col gap-3 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setActionDialog('negotiate')}
                >
                  <div className="p-3 bg-white/20 rounded-full">
                    <MessageSquare className="h-10 w-10" />
                  </div>
                  <span className="text-xl font-bold">Negociar</span>
                  <span className="text-sm opacity-90 font-medium">Quero conversar</span>
                </Button>

                <Button
                  size="lg"
                  className="h-auto py-8 flex-col gap-3 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={() => setActionDialog('reject')}
                >
                  <div className="p-3 bg-white/20 rounded-full">
                    <XCircle className="h-10 w-10" />
                  </div>
                  <span className="text-xl font-bold">Recusar</span>
                  <span className="text-sm opacity-90 font-medium">Não tenho interesse</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Message */}
        {proposal.status !== 'EM_ANALISE' && (
          <Card className={`border-none shadow-2xl overflow-hidden ${
            proposal.status === 'APROVADA' ? 'bg-gradient-to-br from-green-50 to-emerald-50' :
            proposal.status === 'REJEITADA' ? 'bg-gradient-to-br from-red-50 to-rose-50' :
            proposal.status === 'EM_NEGOCIACAO' ? 'bg-gradient-to-br from-blue-50 to-indigo-50' :
            'bg-gradient-to-br from-gray-50 to-slate-50'
          }`}>
            <div className={`h-2 ${
              proposal.status === 'APROVADA' ? 'bg-gradient-to-r from-green-600 to-emerald-600' :
              proposal.status === 'REJEITADA' ? 'bg-gradient-to-r from-red-600 to-rose-600' :
              proposal.status === 'EM_NEGOCIACAO' ? 'bg-gradient-to-r from-blue-600 to-indigo-600' :
              'bg-gradient-to-r from-gray-600 to-slate-600'
            }`}></div>
            <CardContent className="pt-12 pb-12 text-center">
              {proposal.status === 'APROVADA' && (
                <>
                  <div className="inline-flex p-6 bg-green-100 rounded-full mb-6">
                    <CheckCircle className="h-20 w-20 text-green-600" />
                  </div>
                  <h3 className="text-4xl font-bold text-green-800 mb-4">Proposta Aprovada!</h3>
                  <p className="text-lg text-green-700 max-w-2xl mx-auto leading-relaxed">
                    Obrigado por aceitar nossa proposta. Entraremos em contato em breve para dar continuidade.
                  </p>
                </>
              )}
              {proposal.status === 'REJEITADA' && (
                <>
                  <div className="inline-flex p-6 bg-red-100 rounded-full mb-6">
                    <XCircle className="h-20 w-20 text-red-600" />
                  </div>
                  <h3 className="text-4xl font-bold text-red-800 mb-4">Proposta Recusada</h3>
                  <p className="text-lg text-red-700 max-w-2xl mx-auto leading-relaxed">
                    Agradecemos seu tempo em avaliar nossa proposta. Ficamos à disposição para futuras oportunidades.
                  </p>
                </>
              )}
              {proposal.status === 'EM_NEGOCIACAO' && (
                <>
                  <div className="inline-flex p-6 bg-blue-100 rounded-full mb-6">
                    <MessageSquare className="h-20 w-20 text-blue-600" />
                  </div>
                  <h3 className="text-4xl font-bold text-blue-800 mb-4">Em Negociação</h3>
                  <p className="text-lg text-blue-700 max-w-2xl mx-auto leading-relaxed">
                    Recebemos sua solicitação. Nossa equipe entrará em contato em breve para conversar sobre os detalhes.
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Download and Print Buttons */}
        <div className="flex gap-4 justify-center print:hidden flex-wrap">
          <Button 
            variant="outline" 
            onClick={handleView} 
            size="lg"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg px-8"
          >
            <FileText className="h-5 w-5 mr-2" />
            Visualizar PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownload} 
            size="lg"
            className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg px-8"
          >
            <Download className="h-5 w-5 mr-2" />
            Baixar PDF
          </Button>
          <Button 
            variant="outline" 
            onClick={handlePrint} 
            size="lg"
            className="border-2 border-slate-600 text-slate-600 hover:bg-slate-600 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg px-8"
          >
            <Printer className="h-5 w-5 mr-2" />
            Imprimir
          </Button>
        </div>

        {/* Footer */}
        <Card className="border-none shadow-lg bg-gradient-to-r from-slate-800 to-slate-900 text-white print:border-t-2">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Building2 className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold">FG Services</p>
              </div>
              <p className="text-lg font-semibold text-blue-200">Terceirização de Serviços</p>
              <div className="flex items-center justify-center gap-6 text-sm text-slate-300 flex-wrap">
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  contato@fgservices.com.br
                </span>
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (81) 99123-6035
                </span>
              </div>
              <div className="border-t border-white/20 pt-4 mt-4 space-y-2">
                <p className="text-sm text-slate-400">
                  Proposta válida por 30 dias a partir da data de emissão
                </p>
                <p className="text-xs text-slate-500 flex items-center justify-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Data de emissão: {formatDate(proposal.createdAt)}
                </p>
              </div>
            </div>
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

