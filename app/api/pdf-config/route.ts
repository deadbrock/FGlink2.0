import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const CONFIG_FILE = join(process.cwd(), 'pdf-config.json')

export async function GET() {
  try {
    console.log('📂 Verificando arquivo de configuração:', CONFIG_FILE)
    
    if (existsSync(CONFIG_FILE)) {
      const data = await readFile(CONFIG_FILE, 'utf-8')
      const config = JSON.parse(data)
      
      console.log('✅ Configuração encontrada:', {
        companyName: config.companyName,
        headerColor: config.headerColor,
        showInsalubridadeColumn: config.showInsalubridadeColumn,
      })
      
      return NextResponse.json(config, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      })
    }
    
    console.log('⚠️ Arquivo de configuração não encontrado')
    return NextResponse.json({})
  } catch (error) {
    console.error('❌ Erro ao ler configuração:', error)
    return NextResponse.json({})
  }
}

export async function POST(request: NextRequest) {
  try {
    const config = await request.json()
    await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8')
    console.log('✅ Configuração salva:', CONFIG_FILE)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao salvar configuração:', error)
    return NextResponse.json(
      { error: 'Failed to save config' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  try {
    if (existsSync(CONFIG_FILE)) {
      await unlink(CONFIG_FILE)
      console.log('✅ Configuração deletada')
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao deletar configuração:', error)
    return NextResponse.json(
      { error: 'Failed to delete config' },
      { status: 500 }
    )
  }
}

