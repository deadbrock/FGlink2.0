'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, Save, Download, RotateCcw, Upload } from 'lucide-react'

export default function PDFEditorPage() {
  const [config, setConfig] = useState({
    // Cabeçalho
    showLogo: true,
    logoSize: '150px',
    companyName: 'FGlink',
    companySubtitle: 'Serviços de Limpeza Profissional',
    headerColor: '#3b82f6',
    
    // Carta de Apresentação
    introText: `A FGlink antecipa seus agradecimentos pela confiança depositada em nosso trabalho, visto que atuamos neste mercado com reconhecida capacidade técnica operacional.

Ao longo dos anos aprimoramos nossa gestão, implantando serviços especializados e inovadores que trazem satisfação aos nossos clientes.

Parte deste sucesso, deve-se à preocupação constante com o acompanhamento de todos os nossos colaboradores e das suas tarefas, que possibilita aprender com os processos e implantar melhorias contínuas, mantendo nossa QUALIDADE sempre em alta.`,
    
    // Quadro Resumo
    tableHeaderColor: '#3b82f6',
    tableHeaderText: 'QUADRO RESUMO',
    showInsalubridadeColumn: false,
    
    // Itens Inclusos
    itemsIncluded: 'Salário, Vale transporte, Vale refeição, Cesta básica, Fardamento e EPI\'s, Encargos e Impostos',
    
    // Observações
    defaultObservation: 'Na presente proposta não estão previstos reajustes de salário e benefícios, devendo a mesma ser reajustada conforme homologação da convenção coletiva da categoria.',
    observationBgColor: '#fff3cd',
    observationBorderColor: '#ffc107',
    
    // Condições Comerciais
    paymentTerms: 'O faturamento da nota será realizado após 30 (trinta) dias corridos da prestação do serviço com pagamento programado para 10 (dez) dias corridos a contar da data da sua emissão.',
    proposalValidity: '30 (trinta) dias',
    
    // Assinatura
    executiveTitle: 'Executivo(a) Comercial',
    companyPhone: '(11) 1234-5678',
    companyMobile: '(11) 99999-9999',
    companyEmail: 'contato@fglink.com',
    companyWebsite: 'www.fglink.com',
    companyCNPJ: '00.000.000/0001-00',
    companyAddress: 'Endereço da Empresa',
    
    // Termo de Aceite
    acceptanceTitle: 'TERMO DE ACEITE DA PROPOSTA COMERCIAL',
    acceptanceText: 'Declaramos para os devidos fins que estamos de acordo com os termos da Proposta Comercial',
    
    // Estilos Gerais
    fontSize: '11pt',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
    pageMargin: '20mm',
  })

  const [previewKey, setPreviewKey] = useState(0)

  useEffect(() => {
    // Carregar configuração do servidor
    fetch('/api/pdf-config')
      .then(res => res.json())
      .then(data => {
        if (data && Object.keys(data).length > 0) {
          setConfig(prev => ({ ...prev, ...data }))
        }
      })
      .catch(error => {
        console.error('Erro ao carregar configuração:', error)
      })
  }, [])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/pdf-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      })
      
      if (response.ok) {
        alert('✅ Configurações salvas com sucesso! Os PDFs gerados agora usarão este layout.')
      } else {
        alert('❌ Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('❌ Erro ao salvar configurações')
    }
  }

  const handleReset = async () => {
    if (confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      try {
        // Deletar configuração do servidor
        await fetch('/api/pdf-config', {
          method: 'DELETE',
        })
        window.location.reload()
      } catch (error) {
        console.error('Erro ao resetar:', error)
        window.location.reload()
      }
    }
  }

  const handlePreview = () => {
    setPreviewKey(prev => prev + 1)
  }

  const handleTestConfig = async () => {
    try {
      const response = await fetch('/api/pdf-config')
      const data = await response.json()
      console.log('📋 Configuração atual no servidor:', data)
      
      // Mostrar em alerta também
      const summary = `✅ CONFIGURAÇÃO CARREGADA COM SUCESSO!

📋 Empresa: ${data.companyName || 'Não definido'}
🎨 Cor do Cabeçalho: ${data.headerColor || 'Não definido'}
📏 Tamanho da Logo: ${data.logoSize || 'Não definido'}
📊 Cor da Tabela: ${data.tableHeaderColor || 'Não definido'}
${data.showInsalubridadeColumn ? '✅' : '❌'} Coluna de Insalubridade
📞 Telefone: ${data.companyPhone || 'Não definido'}
📧 Email: ${data.companyEmail || 'Não definido'}

Os PDFs serão gerados com estas configurações!`
      
      alert(summary)
    } catch (error) {
      console.error('Erro ao testar:', error)
      alert('❌ Erro ao carregar configuração')
    }
  }

  const handleExportConfig = () => {
    const dataStr = JSON.stringify(config, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'fglink-pdf-config.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target?.result as string)
          setConfig(imported)
          alert('✅ Configuração importada com sucesso!')
        } catch (error) {
          alert('❌ Erro ao importar configuração')
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Editor de PDF</h1>
          <p className="text-slate-500 mt-1">
            Personalize o template da proposta comercial
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => window.location.href = '/dashboard/pdf-editor/upload'}
          >
            <Eye className="h-4 w-4 mr-2" />
            Importar Modelo PDF
          </Button>
          <Button variant="outline" onClick={handleTestConfig}>
            <Eye className="h-4 w-4 mr-2" />
            Testar Config
          </Button>
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button variant="outline" onClick={handleExportConfig}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Config
          </Button>
          <label>
            <Button variant="outline" asChild>
              <span>
                <Download className="h-4 w-4 mr-2" />
                Importar Config
              </span>
            </Button>
            <input
              type="file"
              accept=".json"
              onChange={handleImportConfig}
              className="hidden"
            />
          </label>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Editor */}
        <Card className="h-[calc(100vh-200px)] overflow-auto">
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="header">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="header">Cabeçalho</TabsTrigger>
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="table">Tabela</TabsTrigger>
                <TabsTrigger value="footer">Rodapé</TabsTrigger>
              </TabsList>

              {/* Cabeçalho */}
              <TabsContent value="header" className="space-y-4">
                <div>
                  <Label>Nome da Empresa</Label>
                  <Input
                    value={config.companyName}
                    onChange={(e) => setConfig({...config, companyName: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Subtítulo</Label>
                  <Input
                    value={config.companySubtitle}
                    onChange={(e) => setConfig({...config, companySubtitle: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Cor do Cabeçalho</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.headerColor}
                      onChange={(e) => setConfig({...config, headerColor: e.target.value})}
                      className="w-20"
                    />
                    <Input
                      value={config.headerColor}
                      onChange={(e) => setConfig({...config, headerColor: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Tamanho da Logo</Label>
                  <Input
                    value={config.logoSize}
                    onChange={(e) => setConfig({...config, logoSize: e.target.value})}
                    placeholder="150px"
                  />
                </div>

                <div>
                  <Label>Tamanho da Fonte</Label>
                  <Input
                    value={config.fontSize}
                    onChange={(e) => setConfig({...config, fontSize: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Margem da Página</Label>
                  <Input
                    value={config.pageMargin}
                    onChange={(e) => setConfig({...config, pageMargin: e.target.value})}
                  />
                </div>
              </TabsContent>

              {/* Conteúdo */}
              <TabsContent value="content" className="space-y-4">
                <div>
                  <Label>Texto de Introdução</Label>
                  <Textarea
                    value={config.introText}
                    onChange={(e) => setConfig({...config, introText: e.target.value})}
                    rows={10}
                  />
                </div>

                <div>
                  <Label>Itens Inclusos</Label>
                  <Textarea
                    value={config.itemsIncluded}
                    onChange={(e) => setConfig({...config, itemsIncluded: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Observação Padrão</Label>
                  <Textarea
                    value={config.defaultObservation}
                    onChange={(e) => setConfig({...config, defaultObservation: e.target.value})}
                    rows={4}
                  />
                </div>

                <div>
                  <Label>Cor de Fundo da Observação</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.observationBgColor}
                      onChange={(e) => setConfig({...config, observationBgColor: e.target.value})}
                      className="w-20"
                    />
                    <Input
                      value={config.observationBgColor}
                      onChange={(e) => setConfig({...config, observationBgColor: e.target.value})}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Tabela */}
              <TabsContent value="table" className="space-y-4">
                <div>
                  <Label>Título da Tabela</Label>
                  <Input
                    value={config.tableHeaderText}
                    onChange={(e) => setConfig({...config, tableHeaderText: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Cor do Cabeçalho da Tabela</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={config.tableHeaderColor}
                      onChange={(e) => setConfig({...config, tableHeaderColor: e.target.value})}
                      className="w-20"
                    />
                    <Input
                      value={config.tableHeaderColor}
                      onChange={(e) => setConfig({...config, tableHeaderColor: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.showInsalubridadeColumn}
                    onChange={(e) => setConfig({...config, showInsalubridadeColumn: e.target.checked})}
                    className="w-4 h-4"
                  />
                  <Label>Mostrar Coluna de Insalubridade</Label>
                </div>
              </TabsContent>

              {/* Rodapé */}
              <TabsContent value="footer" className="space-y-4">
                <div>
                  <Label>Telefone</Label>
                  <Input
                    value={config.companyPhone}
                    onChange={(e) => setConfig({...config, companyPhone: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Celular</Label>
                  <Input
                    value={config.companyMobile}
                    onChange={(e) => setConfig({...config, companyMobile: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    value={config.companyEmail}
                    onChange={(e) => setConfig({...config, companyEmail: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Website</Label>
                  <Input
                    value={config.companyWebsite}
                    onChange={(e) => setConfig({...config, companyWebsite: e.target.value})}
                  />
                </div>

                <div>
                  <Label>CNPJ</Label>
                  <Input
                    value={config.companyCNPJ}
                    onChange={(e) => setConfig({...config, companyCNPJ: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Endereço</Label>
                  <Input
                    value={config.companyAddress}
                    onChange={(e) => setConfig({...config, companyAddress: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Condições de Pagamento</Label>
                  <Textarea
                    value={config.paymentTerms}
                    onChange={(e) => setConfig({...config, paymentTerms: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Validade da Proposta</Label>
                  <Input
                    value={config.proposalValidity}
                    onChange={(e) => setConfig({...config, proposalValidity: e.target.value})}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="h-[calc(100vh-200px)] overflow-auto">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preview</CardTitle>
              <Button size="sm" onClick={handlePreview}>
                <Eye className="h-4 w-4 mr-2" />
                Atualizar Preview
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div 
              key={previewKey}
              className="bg-white border rounded-lg p-8 shadow-lg"
              style={{
                fontSize: config.fontSize,
                fontFamily: config.fontFamily,
                lineHeight: config.lineHeight,
              }}
            >
              {/* Preview do Cabeçalho */}
              <div className="text-center mb-6 pb-4" style={{ borderBottom: `3px solid ${config.headerColor}` }}>
                {config.showLogo && (
                  <div className="mb-3">
                    <div 
                      className="mx-auto bg-slate-200 rounded flex items-center justify-center"
                      style={{ width: config.logoSize, height: config.logoSize }}
                    >
                      <span className="text-xs text-slate-500">LOGO</span>
                    </div>
                  </div>
                )}
                <h1 style={{ color: config.headerColor, margin: 0, fontSize: '24pt' }}>
                  {config.companyName}
                </h1>
                <p style={{ color: '#666', margin: '5px 0' }}>
                  {config.companySubtitle}
                </p>
              </div>

              {/* Preview do Conteúdo */}
              <div className="mb-6">
                <p className="text-sm mb-2"><strong>Data:</strong> 25 de novembro de 2024</p>
                <p className="text-sm mb-2"><strong>Att.</strong> Cliente Exemplo</p>
                <p className="text-sm"><strong>Empresa:</strong> Empresa XYZ Ltda</p>
              </div>

              <div className="mb-6 text-justify whitespace-pre-line text-sm">
                {config.introText.substring(0, 200)}...
              </div>

              {/* Preview da Tabela */}
              <div className="mb-6">
                <h3 
                  className="text-white text-center py-2 mb-1"
                  style={{ background: config.tableHeaderColor }}
                >
                  {config.tableHeaderText}
                </h3>
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr style={{ background: '#e3f2fd' }}>
                      <th className="border border-slate-300 p-2 text-left">DESCRIÇÃO</th>
                      {config.showInsalubridadeColumn && (
                        <th className="border border-slate-300 p-2">INSALUBR.</th>
                      )}
                      <th className="border border-slate-300 p-2">PERÍODO</th>
                      <th className="border border-slate-300 p-2 text-right">VALOR</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 p-2">Serviço Exemplo</td>
                      {config.showInsalubridadeColumn && (
                        <td className="border border-slate-300 p-2 text-center">NÃO</td>
                      )}
                      <td className="border border-slate-300 p-2 text-center">30 dias</td>
                      <td className="border border-slate-300 p-2 text-right">R$ 5.000,00</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Preview Itens Inclusos */}
              <div className="mb-4 text-sm">
                <strong>A presente proposta contempla:</strong> {config.itemsIncluded}
              </div>

              {/* Preview Observação */}
              <div 
                className="p-3 mb-4 text-sm"
                style={{ 
                  background: config.observationBgColor,
                  borderLeft: `4px solid ${config.observationBorderColor}`
                }}
              >
                <strong>Observação:</strong> {config.defaultObservation.substring(0, 100)}...
              </div>

              {/* Preview Rodapé */}
              <div 
                className="text-center pt-4 text-xs"
                style={{ borderTop: `2px solid ${config.headerColor}`, color: '#666' }}
              >
                <p>📞 {config.companyPhone} | 📱 {config.companyMobile}</p>
                <p>📧 {config.companyEmail} | 🌐 {config.companyWebsite}</p>
                <p>📍 {config.companyAddress}</p>
                <p className="mt-2">CNPJ: {config.companyCNPJ}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

