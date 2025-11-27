# 🌐 Acesso ao FGlink na Rede Local

Este guia explica como permitir que outros computadores na mesma rede acessem o sistema FGlink rodando localmente.

## 📋 Pré-requisitos

- Sistema FGlink rodando no computador servidor
- Computadores na mesma rede local (Wi-Fi ou cabo)
- Firewall do Windows configurado (ver instruções abaixo)

## 🚀 Passo a Passo

### 1️⃣ Descobrir o IP do Computador Servidor

Abra o **CMD** ou **PowerShell** e execute:

```cmd
ipconfig
```

Procure por **"Endereço IPv4"** na seção da sua conexão ativa (Wi-Fi ou Ethernet).

**Exemplo:**
```
Endereço IPv4. . . . . . . . : 192.168.1.100
```

Anote este IP (ex: `192.168.1.100`).

### 2️⃣ Atualizar o Arquivo `.env`

No arquivo `.env` na raiz do projeto, atualize a variável `NEXTAUTH_URL`:

**Antes:**
```env
NEXTAUTH_URL=http://localhost:3000
```

**Depois (use o IP que você anotou):**
```env
NEXTAUTH_URL=http://192.168.1.100:3000
```

### 3️⃣ Iniciar o Servidor para Rede

Pare o servidor se estiver rodando (Ctrl+C) e inicie com o novo comando:

```cmd
npm run dev:network
```

Você verá algo como:
```
- Local:        http://localhost:3000
- Network:      http://192.168.1.100:3000
```

### 4️⃣ Configurar o Firewall do Windows

O Windows pode bloquear conexões externas. Siga estes passos:

#### Opção A: Criar Regra no Firewall (Recomendado)

1. Abra o **Painel de Controle** → **Sistema e Segurança** → **Firewall do Windows Defender**
2. Clique em **"Configurações avançadas"** (lado esquerdo)
3. Clique em **"Regras de Entrada"** (lado esquerdo)
4. Clique em **"Nova Regra..."** (lado direito)
5. Selecione **"Porta"** → Clique em **"Avançar"**
6. Selecione **"TCP"** e digite **"3000"** em "Portas locais específicas" → **"Avançar"**
7. Selecione **"Permitir a conexão"** → **"Avançar"**
8. Marque todas as opções (Domínio, Privado, Público) → **"Avançar"**
9. Nome: **"FGlink - Next.js"** → **"Concluir"**

#### Opção B: Desabilitar Firewall Temporariamente (Apenas para Testes)

⚠️ **Não recomendado para uso prolongado!**

1. Abra o **Painel de Controle** → **Sistema e Segurança** → **Firewall do Windows Defender**
2. Clique em **"Ativar ou desativar o Firewall do Windows Defender"**
3. Desative para a rede privada (apenas para testes)

### 5️⃣ Acessar de Outro Computador

No outro computador na mesma rede, abra o navegador e acesse:

```
http://192.168.1.100:3000
```

(Substitua `192.168.1.100` pelo IP do seu computador servidor)

## 🔐 Credenciais de Acesso

**Administrador:**
- Email: `admin@fglink.com`
- Senha: `admin123`

**Vendedor:**
- Email: `vendedor@fglink.com`
- Senha: `vendedor123`

## 🛠️ Solução de Problemas

### Problema: "Não foi possível conectar"

**Soluções:**
1. Verifique se o servidor está rodando com `npm run dev:network`
2. Confirme que ambos os computadores estão na mesma rede
3. Verifique o Firewall (veja passo 4)
4. Tente desabilitar antivírus temporariamente
5. Verifique se o IP está correto com `ipconfig`

### Problema: "Erro de autenticação"

**Solução:**
- Certifique-se de que o `NEXTAUTH_URL` no arquivo `.env` está com o IP correto (não `localhost`)

### Problema: "Página não carrega completamente"

**Solução:**
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Tente em modo anônimo/privado
- Verifique se o servidor não apresenta erros no terminal

## 📱 Acesso via Celular

O mesmo processo funciona para celulares conectados na mesma rede Wi-Fi!

Abra o navegador do celular e acesse:
```
http://192.168.1.100:3000
```

## 🌍 Acesso pela Internet (Produção)

Para acesso pela internet (fora da rede local), você precisará:

1. **Configurar Port Forwarding no Roteador** (porta 3000)
2. **Usar um serviço de DNS dinâmico** (ex: No-IP, DuckDNS)
3. **Ou melhor: Hospedar em um servidor na nuvem** (Vercel, AWS, DigitalOcean, etc.)

### Recomendação para Produção:

- **Vercel** (Gratuito e fácil) - Recomendado para Next.js
- **Railway** (Gratuito com limites)
- **DigitalOcean** (Pago, mais controle)
- **AWS/Azure** (Pago, escalável)

## 📞 Suporte

Se tiver problemas, verifique:
- O terminal onde o servidor está rodando (erros aparecem lá)
- O console do navegador (F12 → Console)
- As configurações de rede do Windows

---

**Desenvolvido com ❤️ para FG Services**

