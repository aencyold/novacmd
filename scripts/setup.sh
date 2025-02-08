#!/usr/bin/env bash
set -e

# Cores para formatação
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar dependências
check_dependency() {
  if ! command -v $1 &> /dev/null; then
    echo -e "${RED}Erro: $1 não está instalado.${NC}"
    return 1
  fi
  echo -e "${GREEN}$1 detectado${NC}"
  return 0
}

# Função para instalar pnpm (detecção de distro)
install_pnpm() {
  if [[ -f /etc/arch-release ]]; then
    echo -e "${YELLOW}Detectado Arch Linux. Instalando pnpm com pacman...${NC}"
    sudo pacman -S pnpm --noconfirm
  elif [[ -f /etc/debian_version ]]; then
    echo -e "${YELLOW}Detectado sistema baseado em Debian. Instalando pnpm com apt...${NC}"
    sudo apt update
    sudo apt install -y pnpm
  else
    echo -e "${RED}Sistema operacional não suportado. Instale pnpm manualmente.${NC}"
    exit 1
  fi
}

# Verifica dependências
echo -e "${YELLOW}Verificando dependências...${NC}"

if ! check_dependency node; then
  echo -e "${RED}Node.js é necessário. Instale-o e tente novamente.${NC}"
  exit 1
fi

if ! check_dependency pnpm; then
  echo -e "${YELLOW}pnpm não detectado. Tentando instalar...${NC}"
  install_pnpm
  if ! check_dependency pnpm; then # Verifica novamente após instalação
      exit 1
  fi
fi

if ! check_dependency git; then
  echo -e "${RED}Git é necessário. Instale-o e tente novamente.${NC}"
  exit 1
fi

# Clona o repositório
REPO_URL="https://github.com/aencyproject/novacmd/"
PROJECT_DIR="$HOME/novacmd"

if [ -d "$PROJECT_DIR" ]; then
  echo -e "${YELLOW}O diretório $PROJECT_DIR já existe. Pulando o clone...${NC}"
else
  echo -e "${YELLOW}Clonando o repositório para $PROJECT_DIR...${NC}"
  git clone "$REPO_URL" "$PROJECT_DIR"
fi

# Instala as dependências no diretório clonado
echo -e "${YELLOW}Instalando dependências com pnpm...${NC}"
pnpm install --dir "$PROJECT_DIR"

# Executa o projeto (desenvolvimento) a partir do diretório clonado
echo -e "${YELLOW}Iniciando o aplicativo em modo de desenvolvimento...${NC}"
pnpm start --dir "$PROJECT_DIR"

echo -e "${GREEN}Configuração concluída!${NC}"
