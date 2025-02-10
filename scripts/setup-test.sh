# NAO EXECUTAR POR FAVOR

#!/usr/bin/env bash
set -eo pipefail

# Configuração de cores melhorada
BOLD='\033[1m'
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Constantes
REPO_URL="https://github.com/aencyproject/novacmd/"
PROJECT_DIR="${HOME}/novacmd"
PNPM_VERSION="8.15.5"
LOG_FILE="${PROJECT_DIR}/setup.log"

# Função para tratamento de erros
error_handler() {
  local exit_code=$1
  local line=$2
  echo -e "${RED}${BOLD}Erro na linha ${line} - Código de saída: ${exit_code}${NC}" | tee -a "$LOG_FILE"
  exit "$exit_code"
}

trap 'error_handler $? $LINENO' ERR

# Funções de log melhoradas
log_header() {
  echo -e "${BLUE}${BOLD}==> ${1}${NC}" | tee -a "$LOG_FILE"
}

log_success() {
  echo -e "${GREEN}✓ ${1}${NC}" | tee -a "$LOG_FILE"
}

log_warning() {
  echo -e "${YELLOW}⚠ ${1}${NC}" | tee -a "$LOG_FILE"
}

log_error() {
  echo -e "${RED}✗ ${1}${NC}" | tee -a "$LOG_FILE"
}

# Verificação de dependências com suporte a fallback
check_dependency() {
  if command -v "$1" &>/dev/null; then
    log_success "$1 detectado: $(command -v "$1")"
    return 0
  else
    log_warning "$1 não encontrado"
    return 1
  fi
}

# Instalação otimizada do pnpm
install_pnpm() {
  log_header "Instalando pnpm..."
  
  local install_script="https://get.pnpm.io/install.sh"
  
  if [[ -f /etc/arch-release ]]; then
    sudo pacman -S pnpm --noconfirm && pnpm -v | tee -a "$LOG_FILE"
  elif [[ -f /etc/debian_version ]]; then
    curl -fsSL $install_script | sh -
    . ~/.bashrc
  else
    curl -fsSL $install_script | sh -
    . ~/.bashrc
  fi
  
  if ! command -v pnpm &>/dev/null; then
    log_error "Falha na instalação do pnpm"
    exit 1
  fi
}

# Clone seguro do repositório
clone_repo() {
  log_header "Clonando repositório..."
  
  if [[ -d "$PROJECT_DIR" ]]; then
    log_warning "Diretório existente detectado. Atualizando..."
    git -C "$PROJECT_DIR" pull origin main || {
      log_error "Falha ao atualizar repositório"
      exit 1
    }
  else
    git clone --depth 1 --branch main "$REPO_URL" "$PROJECT_DIR" || {
      log_error "Falha ao clonar repositório"
      exit 1
    }
  fi
}

# Instalação paralela de dependências
install_dependencies() {
  log_header "Instalando dependências..."
  
  (
    cd "$PROJECT_DIR"
    pnpm install --frozen-lockfile --shamefully-hoist 2>&1 | tee -a "$LOG_FILE"
  ) || {
    log_error "Falha na instalação das dependências"
    exit 1
  }
}

# Execução otimizada
start_application() {
  log_header "Iniciando aplicação..."
  
  (
    cd "$PROJECT_DIR"
    pnpm run dev 2>&1 | tee -a "$LOG_FILE"
  ) &
}

# Fluxo principal
main() {
  log_header "Iniciando configuração do Nova Commander"
  
  # Verificação de dependências
  check_dependency node || {
    log_error "Node.js não encontrado. Instale via nvm:"
    echo "curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash"
    exit 1
  }
  
  check_dependency pnpm || install_pnpm
  check_dependency git || {
    log_error "Git não encontrado. Instale primeiro:"
    echo "sudo apt install git (Debian/Ubuntu)"
    echo "sudo pacman -S git (Arch)"
    exit 1
  }

  # Operações de projeto
  clone_repo
  install_dependencies
  start_application

  log_success "Configuração concluída com sucesso!"
  echo -e "${BOLD}Acesse: http://localhost:3000${NC}"
}

main "$@"