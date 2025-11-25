'use client'

import { useState } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Mail, FileDown, Link2, Printer, Loader2, FileText } from 'lucide-react'

interface ProposalSendDialogProps {
  open: boolean
  onClose: () => void
  proposal: any
}

export function ProposalSendDialog({ open, onClose, proposal }: ProposalSendDialogProps) {
  const [emailTo, setEmailTo] = useState(proposal?.client?.email || '')
  const [emailSubject, setEmailSubject] = useState(`Proposta Comercial - ${proposal?.number}`)
  const [emailMessage, setEmailMessage] = useState(
    `Prezado(a) ${proposal?.client?.name},\n\nSegue em anexo nossa proposta comercial.\n\nEstamos à disposição para esclarecimentos.\n\nAtenciosamente,\nEquipe FGlink`
  )
  const [sending, setSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  if (!proposal) return null

  const handleSendEmail = async () => {
    setSending(true)
    try {
      const response = await fetch('/api/proposals/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId: proposal.id,
          to: emailTo,
          subject: emailSubject,
          message: emailMessage,
        }),
      })

      if (response.ok) {
        setSendSuccess(true)
        setTimeout(() => {
          onClose()
          setSendSuccess(false)
        }, 2000)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Erro ao enviar email. Tente novamente.')
    } finally {
      setSending(false)
    }
  }

  const handleDownloadPDF = async () => {
    try {
      // Verificar se existe template personalizado
      const templateResponse = await fetch(`/api/proposals/${proposal.id}/pdf-template`)
      
      if (templateResponse.ok) {
        // Usar template personalizado
        const blob = await templateResponse.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Proposta-${proposal.number}.pdf`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        // Usar gerador padrão
        const { downloadOfficialProposalPDF } = await import('@/lib/pdf-generator-official')
        await downloadOfficialProposalPDF(proposal)
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Erro ao baixar PDF. Tente novamente.')
    }
  }

  const handleViewPDF = async () => {
    try {
      // Verificar se existe template personalizado
      const templateResponse = await fetch(`/api/proposals/${proposal.id}/pdf-template`)
      
      if (templateResponse.ok) {
        // Usar template personalizado
        const blob = await templateResponse.blob()
        const url = window.URL.createObjectURL(blob)
        window.open(url, '_blank')
      } else {
        // Usar gerador padrão
        const { viewOfficialProposalPDF } = await import('@/lib/pdf-generator-official')
        await viewOfficialProposalPDF(proposal)
      }
    } catch (error) {
      console.error('Error viewing PDF:', error)
      alert('Erro ao visualizar PDF. Tente novamente.')
    }
  }

  const handleCopyLink = () => {
    const link = `${window.location.origin}/proposta/${proposal.id}`
    navigator.clipboard.writeText(link)
    alert('Link copiado para área de transferência!')
  }

  const handlePrint = () => {
    window.open(`/proposta/${proposal.id}/print`, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Enviar Proposta ao Cliente</DialogTitle>
          <DialogDescription>
            Escolha como deseja enviar a proposta {proposal.number} para o cliente
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="email">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </TabsTrigger>
            <TabsTrigger value="pdf">
              <FileDown className="h-4 w-4 mr-2" />
              PDF
            </TabsTrigger>
            <TabsTrigger value="link">
              <Link2 className="h-4 w-4 mr-2" />
              Link
            </TabsTrigger>
            <TabsTrigger value="print">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </TabsTrigger>
          </TabsList>

          {/* Email Tab */}
          <TabsContent value="email" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="emailTo">Email do Cliente *</Label>
                <Input
                  id="emailTo"
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="cliente@email.com"
                />
              </div>

              <div>
                <Label htmlFor="emailSubject">Assunto *</Label>
                <Input
                  id="emailSubject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="emailMessage">Mensagem *</Label>
                <Textarea
                  id="emailMessage"
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                  rows={6}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Nota:</strong> A proposta será enviada em formato PDF como anexo do email.
                </p>
              </div>

              {sendSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800 font-semibold">
                    ✅ Email enviado com sucesso!
                  </p>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={handleSendEmail} disabled={sending || !emailTo}>
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Enviar Email
                  </>
                )}
              </Button>
            </DialogFooter>
          </TabsContent>

          {/* PDF Tab */}
          <TabsContent value="pdf" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-slate-50 border rounded-lg p-6 text-center">
                <FileDown className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Proposta em PDF</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Visualize, baixe ou imprima a proposta em formato PDF profissional
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Button onClick={handleViewPDF} size="lg" variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button onClick={handleDownloadPDF} size="lg">
                    <FileDown className="mr-2 h-4 w-4" />
                    Baixar
                  </Button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Arquivo inclui:</strong> Logo da empresa, dados do cliente,
                  itens detalhados, valores e informações de contato em formato profissional.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Link Tab */}
          <TabsContent value="link" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-slate-50 border rounded-lg p-6">
                <Link2 className="h-12 w-12 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-center">Compartilhar Link</h3>
                <p className="text-sm text-muted-foreground mb-4 text-center">
                  Gere um link público para visualização da proposta online
                </p>

                <div className="space-y-3">
                  <div className="bg-white border rounded-lg p-3">
                    <Label className="text-xs text-muted-foreground">Link da Proposta:</Label>
                    <Input
                      value={`${window.location.origin}/proposta/${proposal.id}`}
                      readOnly
                      className="mt-1 font-mono text-sm"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCopyLink} className="flex-1">
                      <Link2 className="mr-2 h-4 w-4" />
                      Copiar Link
                    </Button>
                    <Button
                      onClick={() => window.open(`/proposta/${proposal.id}`, '_blank')}
                      variant="outline"
                      className="flex-1"
                    >
                      Visualizar
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> O link permite visualização pública da proposta.
                  Compartilhe apenas com pessoas autorizadas.
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Print Tab */}
          <TabsContent value="print" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-slate-50 border rounded-lg p-6 text-center">
                <Printer className="h-16 w-16 mx-auto text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">Imprimir Proposta</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Abra a versão otimizada para impressão da proposta
                </p>
                <Button onClick={handlePrint} size="lg">
                  <Printer className="mr-2 h-4 w-4" />
                  Abrir para Impressão
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Dica:</strong> A versão de impressão é otimizada para papel A4
                  e inclui todas as informações da proposta.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

