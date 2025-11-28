@echo off
echo ========================================
echo   CONFIGURACAO DO BANCO DE DADOS
echo   FGlink 2.0 - Railway
echo ========================================
echo.

echo [1/3] Fazendo login no Railway...
call npx @railway/cli login
if %errorlevel% neq 0 (
    echo ERRO: Falha no login
    pause
    exit /b 1
)
echo.

echo [2/3] Conectando ao projeto...
call npx @railway/cli link
if %errorlevel% neq 0 (
    echo ERRO: Falha ao conectar ao projeto
    pause
    exit /b 1
)
echo.

echo [3/3] Criando tabelas no banco de dados...
call npx @railway/cli run npx prisma db push --accept-data-loss
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar tabelas
    pause
    exit /b 1
)
echo.

echo [4/4] Criando usuario administrador...
call npx @railway/cli run npm run create-admin
if %errorlevel% neq 0 (
    echo ERRO: Falha ao criar usuario admin
    pause
    exit /b 1
)
echo.

echo ========================================
echo   CONFIGURACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Credenciais de acesso:
echo   Email: admin@fglink.com
echo   Senha: admin123
echo.
echo Acesse: https://f-glink2-0.vercel.app
echo.
pause

