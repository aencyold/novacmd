#!/bin/bash

# Função para limpar processos em background
cleanup() {
    echo "Encerrando processos em background..."
    kill $DEV_PID 2>/dev/null
    exit 0
}

# Registra a função cleanup para ser chamada quando o script for interrompido
trap cleanup SIGINT SIGTERM EXIT

# Executa pnpm install
pnpm install

# Executa pnpm build e aguarda 3 segundos
pnpm build
echo "Aguardando 3 segundos após o build..."
sleep 3

# Executa pnpm dev em background e guarda o PID
pnpm dev &
DEV_PID=$!

# Aguarda 3 segundos para garantir que o servidor de desenvolvimento esteja rodando
echo "Aguardando 3 segundos para o servidor dev..."
sleep 3

# Executa pnpm start em primeiro plano
pnpm start