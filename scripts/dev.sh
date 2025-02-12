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

sleep 3

# Executa pnpm start em primeiro plano
pnpm start