#!/bin/bash

# ncmdcli - Simulação da Instalação do novacommander

# Cores ANSI
COR_PRINCIPAL='\033[1;36m'  # Ciano (destaque)
COR_SUCESSO='\033[1;32m'    # Verde (sucesso)
COR_ERRO='\033[1;31m'       # Vermelho (erro)
COR_AVISO='\033[1;33m'      # Amarelo (aviso)
COR_INFO='\033[0;37m'       # Branco (informação)
RESET='\033[0m'

# Símbolos Unicode
SIMBOLO_CHECK="✔"
SIMBOLO_X="✖"
SIMBOLO_DOWNLOAD="⬇"
SIMBOLO_INFO="i"
SIMBOLO_LIXEIRA="🗑"
SIMBOLO_APP="📱"
SIMBOLO_PONTO="•"

# Largura do terminal
COLUMNS=$(tput cols)

# Função para centralizar texto
centralizar() {
  local texto="$1"
  local espacos=$(( (COLUMNS - ${#texto}) / 2 ))
  printf "%${espacos}s%s%${espacos}s\n" " " "$texto" " "
}

# Função para exibir uma linha separadora
exibir_separador() {
  local caractere="$1"
  local quantidade="$2"
  printf "%${quantidade}s" "$(printf "%${quantidade}s" "" | tr ' ' "$caractere")"
  echo ""
}

# Função para exibir informações do aplicativo
exibir_info() {
  clear
  centralizar "${COR_PRINCIPAL}Informações do novacommander${RESET}"
  exibir_separador "=" "$COLUMNS"
  echo -e "  ${SIMBOLO_INFO} Nome: ${COR_PRINCIPAL}novacommander${RESET}"
  echo -e "  ${SIMBOLO_INFO} Versão: ${COR_PRINCIPAL}1.0${RESET}"
  echo -e "  ${SIMBOLO_INFO} Descrição: ${COR_PRINCIPAL}Um aplicativo incrível!${RESET}"
  echo -e "  ${SIMBOLO_INFO} Desenvolvedor: ${COR_PRINCIPAL}Roo${RESET}"
  echo -e "  ${SIMBOLO_INFO} Data de lançamento: ${COR_PRINCIPAL}09/02/2025${RESET}"
  exibir_separador "=" "$COLUMNS"
  read -p "Pressione Enter para voltar ao menu..." -n1 -s
}

# Função para simular a instalação
simular_instalacao() {
  clear
  centralizar "${COR_PRINCIPAL}Instalando...${RESET}"
  exibir_separador "=" "$COLUMNS"
  echo -e "  ${SIMBOLO_DOWNLOAD} Baixando..."
  sleep 2
  echo -e "  ${COR_SUCESSO}[====================] 100%${RESET}"
  sleep 1
  echo -e "  ${COR_INFO}Verificando integridade...${RESET}"
  sleep 1
  echo -e "  ${COR_SUCESSO}[====================] 100%${RESET}"
  sleep 1
  echo -e "  ${COR_INFO}Configurando...${RESET}"
  sleep 1
  echo -e "  ${COR_SUCESSO}[====================] 100%${RESET}"
  sleep 1
  echo -e "${COR_SUCESSO}${SIMBOLO_CHECK} Instalação concluída com sucesso!${RESET}"
  echo -e "${COR_INFO}O aplicativo novacommander foi instalado em /home/user/aplicativos/novacommander.${RESET}"
  echo -e "${COR_INFO}Abrindo o aplicativo...${RESET}"
  sleep 1
  echo -e "${COR_SUCESSO}Bem-vindo ao novacommander!${RESET}"
  exibir_separador "=" "$COLUMNS"
  sleep 1
  read -p "Pressione Enter para voltar ao menu..." -n1 -s
}

# Função para simular a desinstalação
simular_desinstalacao() {
  clear
  centralizar "${COR_PRINCIPAL}Desinstalando...${RESET}"
  exibir_separador "=" "$COLUMNS"
  sleep 2
  echo -e "${COR_ERRO}[====================] 100%${RESET}"
  sleep 1
  echo -e "${COR_ERRO}${SIMBOLO_CHECK} Desinstalação concluída com sucesso!${RESET}"
  exibir_separador "=" "$COLUMNS"
  sleep 1
  read -p "Pressione Enter para voltar ao menu..." -n1 -s
}

# Menu Principal
while true; do
  clear
  centralizar "${COR_PRINCIPAL}Menu Principal${RESET}"
  exibir_separador "=" "$COLUMNS"
  centralizar "${SIMBOLO_APP} novacommander ${SIMBOLO_APP}"
  exibir_separador "=" "$COLUMNS"
  centralizar "${COR_SUCESSO}1) Instalar o aplicativo${RESET}"
  centralizar "${COR_INFO}2) Exibir informações do aplicativo${RESET}"
  centralizar "${COR_AVISO}3) Desinstalar o aplicativo${RESET}"
  centralizar "${COR_INFO}4) Sair${RESET}"
  exibir_separador "-" "$COLUMNS"
  read -p "Escolha uma opção: " opcao

  case $opcao in
    1)
      read -p "Deseja baixar o app? [y/n] " resposta
      if [[ "$resposta" == "y" ]]; then
        simular_instalacao
      else
        echo -e "${COR_ERRO}${SIMBOLO_X} Instalação cancelada.${RESET}"
        sleep 1
      fi
      ;;
    2)
      exibir_info
      ;;
    3)
      read -p "Tem certeza que deseja desinstalar o aplicativo? [y/n] " resposta
      if [[ "$resposta" == "y" ]]; then
        simular_desinstalacao
      else
        echo -e "${COR_AVISO}${SIMBOLO_X} Desinstalação cancelada.${RESET}"
        sleep 1
      fi
      ;;
    4)
      echo -e "${COR_INFO}Saindo...${RESET}"
      exit 0
      ;;
    *)
      echo -e "${COR_ERRO}${SIMBOLO_X} Opção inválida. Tente novamente.${RESET}"
      sleep 1
      ;;
  esac
done