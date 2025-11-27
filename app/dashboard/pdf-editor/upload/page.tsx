'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, FileText, Eye, Download, Trash2, Settings, MousePointer, ChevronLeft, ChevronRight } from 'lucide-react'

export default function PDFUploadPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [fields, setFields] = useState<any[]>([])
  const [uploading, setUploading] = useState(false)
  const [activeFieldId, setActiveFieldId] = useState<number | null>(null)
  const [clickMode, setClickMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfKey, setPdfKey] = useState(0) // Para forçar reload do iframe
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      alert('❌ Por favor, selecione um arquivo PDF válido')
      return
    }

    setUploadedFile(file)
    
    // Criar URL temporária para preview
    const url = URL.createObjectURL(file)
    setPdfUrl(url)

    // Upload para o servidor
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
        setUploadedFileName(data.fileName) // Salvar o fileName retornado pela API
        console.log('✅ PDF enviado, fileName:', data.fileName)
        alert('✅ PDF enviado com sucesso!')
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

  const handleAddField = () => {
    const newField = {
      id: Date.now(),
      name: '',
      type: 'text',
      x: 0,
      y: 0,
      page: 1,
    }
    setFields([...fields, newField])
    setActiveFieldId(newField.id)
    setClickMode(true)
    alert('✅ Campo adicionado!\n\n📍 Agora clique no PDF onde deseja posicionar este campo.')
  }

  const handlePDFClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!clickMode || !activeFieldId) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    console.log('📍 Clique no PDF:', { x, y, page: currentPage })

    // Atualizar coordenadas do campo ativo
    const newFields = fields.map(f =>
      f.id === activeFieldId ? { 
        ...f, 
        x: Math.round(x), 
        y: Math.round(y),
        page: currentPage 
      } : f
    )
    setFields(newFields)
    setClickMode(false)
    setActiveFieldId(null)
    
    alert(`✅ Posição definida!\n\nPágina: ${currentPage}\nX: ${Math.round(x)}\nY: ${Math.round(y)}`)
  }

  const handleRemoveField = (id: number) => {
    setFields(fields.filter(f => f.id !== id))
  }

  const handleSaveTemplate = async () => {
    if (!uploadedFile || !uploadedFileName) {
      alert('❌ Nenhum PDF carregado')
      return
    }

    const templateName = prompt('Digite um nome para este template:', uploadedFile.name.replace('.pdf', ''))
    if (!templateName) return

    console.log('💾 Salvando template:', {
      name: templateName,
      fileName: uploadedFileName, // Usar o fileName retornado pela API
      fieldsCount: fields.length,
    })

    try {
      const response = await fetch('/api/pdf-template/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: templateName,
          fileName: uploadedFileName, // IMPORTANTE: Usar o fileName correto (ex: template-123456.pdf)
          description: `Template importado em ${new Date().toLocaleDateString('pt-BR')}`,
          fields: fields,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        alert(`✅ Template "${templateName}" salvo com sucesso!\n\nAgora você pode selecioná-lo ao criar propostas.`)
        window.location.href = '/dashboard/proposals'
      } else {
        alert('❌ Erro ao salvar template')
      }
    } catch (error) {
      console.error('Erro:', error)
      alert('❌ Erro ao salvar template')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Importar Modelo de PDF</h1>
          <p className="text-slate-500 mt-1">
            Faça upload do seu PDF e mapeie os campos para preenchimento automático
          </p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload">1. Upload do PDF</TabsTrigger>
          <TabsTrigger value="fields" disabled={!uploadedFile}>2. Mapear Campos</TabsTrigger>
          <TabsTrigger value="preview" disabled={!uploadedFile}>3. Preview</TabsTrigger>
        </TabsList>

        {/* TAB 1: Upload */}
        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Enviar Modelo de PDF</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-blue-400 transition-colors">
                <Upload className="h-16 w-16 mx-auto text-slate-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {uploadedFile ? uploadedFile.name : 'Arraste seu PDF aqui'}
                </h3>
                <p className="text-slate-500 mb-4">
                  ou clique para selecionar
                </p>
                <label>
                  <Button asChild>
                    <span>
                      <FileText className="h-4 w-4 mr-2" />
                      Selecionar PDF
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
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">{uploadedFile.name}</p>
                        <p className="text-sm text-green-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUploadedFile(null)
                        setPdfUrl(null)
                        setFields([])
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">📋 Instruções:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Faça upload do seu PDF modelo (até 10 MB)</li>
                  <li>Na próxima aba, mapeie os campos que devem ser preenchidos</li>
                  <li>Visualize o resultado e salve o template</li>
                  <li>Use o template ao criar propostas!</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: Mapear Campos */}
        <TabsContent value="fields">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Mapear Campos do PDF</CardTitle>
                <Button onClick={handleAddField}>
                  <Settings className="h-4 w-4 mr-2" />
                  Adicionar Campo
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                {/* Lista de Campos */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Campos Disponíveis:</h3>
                  
                  <div className="space-y-2">
                    {fields.length === 0 ? (
                      <p className="text-slate-500 text-sm">
                        Nenhum campo adicionado. Clique em "Adicionar Campo" para começar.
                      </p>
                    ) : (
                      fields.map((field) => (
                        <div 
                          key={field.id} 
                          className={`border rounded-lg p-3 ${activeFieldId === field.id ? 'ring-2 ring-blue-400 bg-blue-50' : ''}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Input
                              placeholder="Nome do campo (ex: empresa, fone)"
                              value={field.name}
                              onChange={(e) => {
                                const newFields = fields.map(f =>
                                  f.id === field.id ? { ...f, name: e.target.value } : f
                                )
                                setFields(newFields)
                              }}
                              className="flex-1 mr-2"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveField(field.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div>
                              <Label>Tipo</Label>
                              <select
                                className="w-full border rounded px-2 py-1"
                                value={field.type}
                                onChange={(e) => {
                                  const newFields = fields.map(f =>
                                    f.id === field.id ? { ...f, type: e.target.value } : f
                                  )
                                  setFields(newFields)
                                }}
                              >
                                <option value="text">Texto</option>
                                <option value="number">Número</option>
                                <option value="date">Data</option>
                                <option value="table">Tabela</option>
                              </select>
                            </div>
                            <div>
                              <Label>Página</Label>
                              <Input
                                type="number"
                                min="1"
                                value={field.page}
                                onChange={(e) => {
                                  const newFields = fields.map(f =>
                                    f.id === field.id ? { ...f, page: parseInt(e.target.value) } : f
                                  )
                                  setFields(newFields)
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded">
                            <span>Página {field.page} • X={field.x}, Y={field.y}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setActiveFieldId(field.id)
                                setClickMode(true)
                                setCurrentPage(field.page) // Ir para a página do campo
                              }}
                              className="h-6 text-xs"
                            >
                              <MousePointer className="h-3 w-3 mr-1" />
                              Reposicionar
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">💡 Campos Comuns:</h4>
                    <div className="text-sm text-yellow-800 space-y-1">
                      <p>• <code>{'{{nomeCliente}}'}</code> - Nome do cliente</p>
                      <p>• <code>{'{{cnpj}}'}</code> - CNPJ do cliente</p>
                      <p>• <code>{'{{numeroProposta}}'}</code> - Número da proposta</p>
                      <p>• <code>{'{{data}}'}</code> - Data atual</p>
                      <p>• <code>{'{{valorTotal}}'}</code> - Valor total</p>
                      <p>• <code>{'{{itens}}'}</code> - Tabela de itens</p>
                    </div>
                  </div>
                </div>

                {/* Preview do PDF */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Preview do PDF:</h3>
                    {clickMode && (
                      <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium animate-pulse">
                        <MousePointer className="h-4 w-4" />
                        Clique no PDF para posicionar
                      </div>
                    )}
                  </div>

                  {/* Controles de Navegação */}
                  <div className="flex items-center justify-center gap-4 mb-3 bg-slate-100 p-2 rounded-lg">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newPage = Math.max(1, currentPage - 1)
                        setCurrentPage(newPage)
                        setPdfKey(prev => prev + 1) // Força reload
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
                          const newPage = parseInt(e.target.value) || 1
                          setCurrentPage(newPage)
                          setPdfKey(prev => prev + 1) // Força reload
                        }}
                        className="w-16 text-center"
                      />
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newPage = currentPage + 1
                        setCurrentPage(newPage)
                        setPdfKey(prev => prev + 1) // Força reload
                      }}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {pdfUrl ? (
                    <div 
                      className={`border rounded-lg overflow-hidden relative ${clickMode ? 'cursor-crosshair ring-4 ring-blue-400' : ''}`}
                      style={{ height: '600px' }}
                      onClick={handlePDFClick}
                    >
                      <iframe
                        key={pdfKey} // Força recriação do iframe
                        ref={iframeRef}
                        src={`${pdfUrl}#page=${currentPage}`}
                        className="w-full h-full pointer-events-none"
                        title="PDF Preview"
                      />
                    </div>
                  ) : (
                    <div className="border rounded-lg h-96 flex items-center justify-center text-slate-400">
                      <p>Carregando preview...</p>
                    </div>
                  )}
                  {clickMode && (
                    <p className="text-sm text-blue-600 mt-2 text-center">
                      💡 Dica: Clique exatamente onde o texto deve aparecer no PDF
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveTemplate} size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Salvar Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: Preview */}
        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Preview do Template</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">✅ Template Configurado!</h4>
                  <p className="text-sm text-green-800">
                    Seu template está pronto para ser usado. Ao criar uma proposta, os dados serão preenchidos automaticamente no PDF.
                  </p>
                </div>

                {pdfUrl && (
                  <div className="border rounded-lg overflow-hidden" style={{ height: '700px' }}>
                    <iframe
                      src={pdfUrl}
                      className="w-full h-full"
                      title="PDF Preview Final"
                    />
                  </div>
                )}

                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => window.location.href = '/dashboard/proposals'}>
                    <FileText className="h-4 w-4 mr-2" />
                    Ir para Propostas
                  </Button>
                  <Button onClick={handleSaveTemplate}>
                    <Download className="h-4 w-4 mr-2" />
                    Salvar Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

