# 🔧 CORREÇÃO NECESSÁRIA - Template Antigo

## ❌ Problema:

O template antigo foi salvo com `fileName` incorreto:
- **Salvo no banco:** `modelo proposta.pdf`
- **Arquivo real:** `template-1764155503016.pdf`

Por isso o sistema não encontra o arquivo!

## ✅ SOLUÇÃO RÁPIDA:

### **Opção 1: Corrigir Manualmente no Banco (RECOMENDADO)**

1. **Abrir Prisma Studio:**
   ```bash
   npx prisma studio
   ```

2. **Ir em `PDFTemplate`**

3. **Encontrar o template "modelo proposta"**

4. **Editar o campo `fileName`:**
   - **DE:** `modelo proposta.pdf`
   - **PARA:** `template-1764155503016.pdf`

5. **Salvar**

6. **Testar novamente!**

---

### **Opção 2: Reimportar o PDF (MAIS FÁCIL)**

1. **Dashboard → Editor de PDF → Importar Modelo PDF**

2. **Upload do PDF novamente**

3. **Mapear campos (opcional):**
   - `{{numeroProposta}}` - Número da proposta
   - `{{nomeCliente}}` - Nome do cliente
   - `{{cnpj}}` - CNPJ
   - `{{data}}` - Data por extenso
   - `{{valorTotal}}` - Valor total
   - `{{observacoes}}` - Observações
   - `{{executivo}}` - Nome do vendedor

4. **Salvar com nome:** "Proposta FG Services"

5. **Editar a proposta** e selecionar o novo template

6. **Visualizar PDF** ✅

---

## 📋 Verificar Arquivos:

```bash
# Ver templates salvos:
dir public\pdf-templates

# Ver configs:
dir pdf-template-*.json
```

**Resultado esperado:**
```
public\pdf-templates\
  ├── template-1764155503016.pdf  ← Arquivo existe!

pdf-template-template-1764155503016.json  ← Config deve existir!
```

---

## 🎯 Após Corrigir:

Os logs devem mostrar:
```
🔍 Buscando config em: C:\...\pdf-template-template-1764155503016.json
✅ Config carregada: { fileName: 'template-1764155503016.pdf', fieldsCount: 5 }
📄 Carregando template: template-1764155503016.pdf
✅ Template carregado, preenchendo campos...
✅ Campos preenchidos com sucesso!
✅ PDF do template gerado com sucesso!
```

---

## 💡 Dica:

**Use a Opção 2 (reimportar)** - É mais rápido e garante que tudo está correto!

