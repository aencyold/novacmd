import React from 'react'
import type { ExplorerConfig } from '../utils/config'
import { Settings } from 'lucide-react'

interface ExplorerSettingsProps {
  config: ExplorerConfig
  onConfigChange: (config: ExplorerConfig) => void
  onClose: () => void
}

export function ExplorerSettings({ config, onConfigChange, onClose }: ExplorerSettingsProps) {
  const handleChange = (key: keyof ExplorerConfig, value: any) => {
    onConfigChange({ ...config, [key]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-black rounded-lg p-6 w-[500px] border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Settings size={18} />
            <h2 className="text-sm font-medium">Configurações do Explorador</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Aparência do Root */}
          <div>
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Aparência do Root</h3>
            <select
              value={config.rootDisplay}
              onChange={(e) => handleChange('rootDisplay', e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
            >
              <option value="/">Barra (/)</option>
              <option value="root">Root</option>
              {process.platform === 'win32' && <option value="windows">Windows</option>}
            </select>
          </div>

          {/* Layout */}
          <div>
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Layout</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Posição dos Botões de Controle</label>
                <select
                  value={config.controlButtonsPosition}
                  onChange={(e) => handleChange('controlButtonsPosition', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="top">Topo</option>
                  <option value="path">Antes do Caminho</option>
                </select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Posição da Busca</label>
                <select
                  value={config.searchPosition}
                  onChange={(e) => handleChange('searchPosition', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="home">Ao lado do botão Home</option>
                  <option value="path">Depois do Caminho</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.showSidebar}
                    onChange={(e) => handleChange('showSidebar', e.target.checked)}
                    className="rounded border-white/10 bg-white/5 focus:ring-1 focus:ring-white/20"
                  />
                  <span className="text-sm">Mostrar Barra Lateral</span>
                </label>
              </div>
            </div>
          </div>

          {/* Visualização */}
          <div>
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Visualização</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Modo de Visualização</label>
                <select
                  value={config.viewMode}
                  onChange={(e) => handleChange('viewMode', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="list">Lista</option>
                  <option value="tiles">Blocos</option>
                  <option value="grid">Grade</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={config.showHidden}
                    onChange={(e) => handleChange('showHidden', e.target.checked)}
                    className="rounded border-white/10 bg-white/5 focus:ring-1 focus:ring-white/20"
                  />
                  <span className="text-sm">Mostrar Arquivos Ocultos</span>
                </label>
              </div>
            </div>
          </div>

          {/* Ordenação */}
          <div>
            <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3">Ordenação</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm mb-2 block">Ordenar por</label>
                <select
                  value={config.sortBy}
                  onChange={(e) => handleChange('sortBy', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="name">Nome</option>
                  <option value="size">Tamanho</option>
                  <option value="modified">Data de Modificação</option>
                </select>
              </div>

              <div>
                <label className="text-sm mb-2 block">Ordem</label>
                <select
                  value={config.sortOrder}
                  onChange={(e) => handleChange('sortOrder', e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
                >
                  <option value="asc">Crescente</option>
                  <option value="desc">Decrescente</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm hover:bg-white/5 rounded-md transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
} 