import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const templateConfig = {
      fileName: data.fileName,
      fields: data.fields,
      createdAt: new Date().toISOString(),
    }

    // Salvar configuração do template
    const configPath = join(process.cwd(), `pdf-template-${data.fileName}.json`)
    await writeFile(configPath, JSON.stringify(templateConfig, null, 2))
    
    // Salvar no banco de dados
    const template = await prisma.pDFTemplate.create({
      data: {
        name: data.name || 'Template Personalizado',
        fileName: data.fileName,
        description: data.description || 'Template importado',
        active: true,
      },
    })
    
    console.log('✅ Configuração do template salva:', template.id)

    return NextResponse.json({
      success: true,
      message: 'Template salvo com sucesso',
      templateId: template.id,
    })
  } catch (error) {
    console.error('Erro ao salvar template:', error)
    return NextResponse.json(
      { error: 'Erro ao salvar template' },
      { status: 500 }
    )
  }
}

