'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, Download, ChevronLeft, ChevronRight, Check, X } from 'lucide-react'

// Campos pré-definidos
const PRESET_FIELDS = [
  { id: 'empresa', label: '🏢 Empresa (Nome do Cliente)', type: 'text', description: 'Nome da empresa do cliente' },
  { id: 'fone', label: '📞 Telefone', type: 'text', description: 'Telefone do cliente' },
  { id: 'contato', label: '👤 Contato', type: 'text', description: 'Nome da pessoa de contato' },
  { id: 'emailCliente', label: '📧 Email', type: 'text', description: 'Email do cliente' },
  { id: 'numeroProposta', label: '📄 Número da Proposta', type: 'text', description: 'Ex: PROP-202511-0001' },
  { id: 'dataSimples', label: '📅 Data', type: 'text', description: 'Data da proposta' },
  { id: 'items', label: '📊 Tabela de Itens', type: 'table', description: 'Clique na primeira linha da tabela' },
  { id: 'valorTotal', label: '💰 Valor Total', type: 'text', description: 'Valor total da proposta' },
]

export default function PDFUploadSimplePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [mappedFields, setMappedFields] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfKey, setPdfKey] = useState(0)
  const [activeField, setActiveField] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      alert('❌ Por favor, selecione um arquivo PDF válido')
      return
    }

    setUploadedFile(file)
    const url = URL.createObjectURL(file)
    setPdfUrl(url)

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('pdf', file)

      const response = await fetch('/api/pdf-template/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setUploadedFileName(data.fileName)
        alert('✅ PDF enviado com sucesso! Agora mapeie os campos.')
      } else {
        alert('❌ Erro ao enviar PDF')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao enviar PDF')
    } finally {
      setUploading(false)
    }
  }

  const handleFieldClick = (fieldId: string) => {
    setActiveField(fieldId)
    alert(`✅ Campo "${PRESET_FIELDS.find(f => f.id === fieldId)?.label}" selecionado!\n\n📍 Agora clique no PDF onde este campo deve aparecer.`)
  }

  const handlePDFClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!activeField) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const field = PRESET_FIELDS.find(f => f.id === activeField)
    if (!field) return

    // Remover campo existente se já foi mapeado
    const filtered = mappedFields.filter(f => f.id !== activeField)

    // Adicionar novo mapeamento
    setMappedFields([...filtered, {
      id: activeField,
      name: activeField,
      type: field.type,
      x: Math.round(x),
      y: Math.round(y),
      page: currentPage,
      label: field.label,
    }])

    setActiveField(null)
    alert(`✅ Campo posicionado!\n\n${field.label}\nPágina: ${currentPage}\nX: ${Math.round(x)}, Y: ${Math.round(y)}`)
  }

  const handleRemoveField = (fieldId: string) => {
    setMappedFields(mappedFields.filter(f => f.id !== fieldId))
  }

  const handleSaveTemplate = async () => {
    if (!uploadedFile || !uploadedFileName) {
      alert('❌ Nenhum PDF carregado')
      return
    }

    if (mappedFields.length === 0) {
      alert('❌ Você precisa mapear pelo menos um campo')
      return
    }

    const templateName = prompt('Digite um nome para este template:', 'Proposta Comercial')
    if (!templateName) return

    try {
      const response = await fetch('/api/pdf-template/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          fileName: uploadedFileName,
          description: `Template criado em ${new Date().toLocaleDateString('pt-BR')}`,
          fields: mappedFields,
        }),
      })

      if (response.ok) {
        alert(`✅ Template "${templateName}" salvo com sucesso!\n\n🎉 Agora você pode usá-lo ao criar propostas!`)
        window.location.href = '/dashboard/proposals'
      } else {
        alert('❌ Erro ao salvar template')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao salvar template')
    }
  }

  const isFieldMapped = (fieldId: string) => {
    return mappedFields.some(f => f.id === fieldId)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Importar PDF - Modo Simples</h1>
          <p className="text-slate-500 mt-1">
            Selecione os campos e clique no PDF para posicioná-los
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">1. Upload do PDF</TabsTrigger>
          <TabsTrigger value="map" disabled={!uploadedFile}>2. Mapear Campos</TabsTrigger>
        </TabsList>

        {/* TAB 1: Upload */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Enviar PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {uploadedFile ? uploadedFile.name : 'Selecione seu PDF'}
                </h3>
                <p className="text-slate-500 mb-4">
                  Arquivo de proposta comercial
                </p>
                <label>
                  <Button asChild>
                    <span>
                      <FileText className="h-4 w-4 mr-2" />
                      Escolher Arquivo
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {uploadedFile && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <Check className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="font-semibold text-green-900">{uploadedFile.name}</p>
                  <p className="text-sm text-green-600 mt-1">
                    PDF enviado! Vá para a próxima etapa →
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Mapear */}
        <TabsContent value="map">
          <div className="grid grid-cols-3 gap-6">
            {/* Coluna 1: Campos Disponíveis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Campos Disponíveis</CardTitle>
                <p className="text-sm text-slate-500">Clique em um campo e depois no PDF</p>
              </CardHeader>
              <CardContent className="space-y-2">
                {PRESET_FIELDS.map((field) => {
                  const mapped = isFieldMapped(field.id)
                  return (
                    <Button
                      key={field.id}
                      variant={mapped ? "secondary" : "outline"}
                      className={`w-full justify-start text-left h-auto py-3 ${
                        activeField === field.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                      }`}
                      onClick={() => handleFieldClick(field.id)}
                      disabled={mapped}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span>{field.label}</span>
                          {mapped && <Check className="h-4 w-4 text-green-600" />}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{field.description}</p>
                      </div>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Coluna 2 e 3: PDF Preview */}
            <Card className="col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Preview do PDF</CardTitle>
                  {activeField && (
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium animate-pulse">
                      📍 Clique no PDF para posicionar
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Navegação */}
                <div className="flex items-center justify-center gap-4 bg-slate-100 p-2 rounded-lg">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentPage(Math.max(1, currentPage - 1))
                      setPdfKey(prev => prev + 1)
                    }}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Página</span>
                    <Input
                      type="number"
                      min="1"
                      value={currentPage}
                      onChange={(e) => {
                        setCurrentPage(parseInt(e.target.value) || 1)
                        setPdfKey(prev => prev + 1)
                      }}
                      className="w-16 text-center"
                    />
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setCurrentPage(currentPage + 1)
                      setPdfKey(prev => prev + 1)
                    }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* PDF */}
                {pdfUrl && (
                  <div
                    className={`border rounded-lg overflow-hidden relative ${
                      activeField ? 'cursor-crosshair ring-4 ring-blue-400' : ''
                    }`}
                    style={{ height: '600px' }}
                    onClick={handlePDFClick}
                  >
                    <iframe
                      key={pdfKey}
                      src={`${pdfUrl}#page=${currentPage}`}
                      className="w-full h-full pointer-events-none"
                      title="PDF Preview"
                    />
                  </div>
                )}

                {/* Campos Mapeados */}
                {mappedFields.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">
                      ✅ Campos Mapeados ({mappedFields.length})
                    </h4>
                    <div className="space-y-1">
                      {mappedFields.map((field) => (
                        <div key={field.id} className="flex items-center justify-between text-sm bg-white p-2 rounded">
                          <span className="text-green-800">
                            {field.label} - Pág {field.page}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleRemoveField(field.id)}
                          >
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Botão Salvar */}
                <Button
                  onClick={handleSaveTemplate}
                  size="lg"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={mappedFields.length === 0}
                >
                  <Download className="h-5 w-5 mr-2" />
                  Salvar Template ({mappedFields.length} campos)
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

