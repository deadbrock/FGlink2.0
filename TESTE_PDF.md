# 🧪 Como Testar a Configuração do PDF

## ✅ Correções Implementadas

1. **API de Configuração** melhorada com cache desabilitado
2. **Carregamento automático** da configuração do servidor
3. **Logs de debug** para rastrear o carregamento
4. **Botão de teste** para verificar a configuração

## 📋 Sua Configuração Atual

Está salva em `pdf-config.json`:
- ✅ Nome: **FG SERVICES**
- ✅ Cor do cabeçalho: **#000000** (preto)
- ✅ Tamanho da logo: **155px**
- ✅ Coluna de Insalubridade: **Ativada**

## 🔍 Como Testar

### 1️⃣ Testar no Editor
1. Acesse: **Dashboard → Editor de PDF**
2. Clique no botão **"Testar Config"**
3. Abra o console (F12) e veja a configuração carregada
4. Verifique se os valores estão corretos

### 2️⃣ Testar Geração de PDF
1. Acesse: **Dashboard → Propostas**
2. Clique em qualquer proposta
3. Clique em **"Enviar"**
4. Clique em **"Visualizar"** ou **"Baixar"**
5. Abra o console (F12) e procure por:
   ```
   🎨 Configuração do PDF carregada: {...}
   ```
6. Verifique se o PDF gerado usa:
   - Nome: **FG SERVICES**
   - Cor preta no cabeçalho
   - Coluna de Insalubridade na tabela

### 3️⃣ Se Ainda Não Funcionar

**Opção A: Limpar Cache do Navegador**
1. Pressione `Ctrl + Shift + Delete`
2. Limpe o cache
3. Recarregue a página (`Ctrl + F5`)

**Opção B: Reiniciar o Servidor**
```bash
# Pare o servidor (Ctrl + C)
npm run dev
```

**Opção C: Verificar no Console**
Quando gerar o PDF, você deve ver:
```
🎨 Configuração do PDF carregada: {
  companyName: "FG SERVICES",
  headerColor: "#000000",
  logoSize: "155px",
  showInsalubridadeColumn: true
}
```

## 🐛 Debug

Se não funcionar, me envie:
1. O que aparece no console quando você clica em "Testar Config"
2. O que aparece no console quando você gera um PDF
3. Uma captura de tela do PDF gerado

## 📝 Notas Importantes

- A configuração é carregada **toda vez** que você gera um PDF
- Não precisa reiniciar o servidor após salvar
- O cache está desabilitado para garantir que sempre carregue a versão mais recente
- Os logs no console ajudam a identificar se a configuração está sendo aplicada

