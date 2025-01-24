import React from 'react'
import { 
  ExternalLink,
  Edit,
  Copy,
  Scissors,
  Trash2,
  Info,
  FilePlus,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react'
import type { FileItem } from '../types/file'

interface ContextMenuProps {
  x: number
  y: number
  file?: FileItem
  onClose: () => void
  onOpen?: (file: FileItem) => void
  onRename?: (file: FileItem) => void
  onCopy?: () => void
  onCut?: () => void
  onDelete?: () => void
  onProperties?: (file: FileItem) => void
  onNewFolder?: () => void
  onPaste?: () => void
  onToggleHidden?: () => void
  onRefresh?: () => void
  canPaste?: boolean
  showHidden?: boolean
}

export function ContextMenu({
  x,
  y,
  file,
  onClose,
  onOpen,
  onRename,
  onCopy,
  onCut,
  onDelete,
  onProperties,
  onNewFolder,
  onPaste,
  onToggleHidden,
  onRefresh,
  canPaste,
  showHidden
}: ContextMenuProps) {
  return (
    <div 
      className="fixed bg-gray-900 rounded-lg shadow-lg py-1 border border-white/10 w-48"
      style={{ 
        left: Math.min(x, window.innerWidth - 192),
        top: Math.min(y, window.innerHeight - 320)
      }}
    >
      {file ? (
        <>
          <button 
            onClick={() => {
              onOpen?.(file)
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
          >
            <ExternalLink size={14} />
            <span>Abrir</span>
          </button>
          <button 
            onClick={() => {
              onRename?.(file)
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
          >
            <Edit size={14} />
            <span>Renomear</span>
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button 
            onClick={() => {
              onCopy?.()
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
          >
            <Copy size={14} />
            <span>Copiar</span>
          </button>
          <button 
            onClick={() => {
              onCut?.()
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
          >
            <Scissors size={14} />
            <span>Recortar</span>
          </button>
          <button 
            onClick={() => {
              onDelete?.()
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2 text-red-400"
          >
            <Trash2 size={14} />
            <span>Excluir</span>
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button 
            onClick={() => {
              onProperties?.(file)
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
          >
            <Info size={14} />
            <span>Propriedades</span>
          </button>
        </>
      ) : (
        <>
          <button 
            onClick={() => {
              onNewFolder?.()
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
          >
            <FilePlus size={14} />
            <span>Nova pasta</span>
          </button>
          <button 
            onClick={() => {
              onPaste?.()
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
            disabled={!canPaste}
          >
            <Download size={14} />
            <span>Colar</span>
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button 
            onClick={() => {
              onToggleHidden?.()
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
          >
            <Eye size={14} />
            <span>{showHidden ? 'Ocultar arquivos ocultos' : 'Mostrar arquivos ocultos'}</span>
          </button>
          <button 
            onClick={() => {
              onRefresh?.()
              onClose()
            }}
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-white/5 flex items-center gap-2"
          >
            <RefreshCw size={14} />
            <span>Atualizar</span>
          </button>
        </>
      )}
    </div>
  )
} 