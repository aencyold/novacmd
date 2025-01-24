import React from 'react'
import { X, File, Folder } from 'lucide-react'
import type { FileItem } from '../types/file'

interface PropertiesDialogProps {
  file: FileItem
  onClose: () => void
}

export function PropertiesDialog({ file, onClose }: PropertiesDialogProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short'
    }).format(date)
  }

  const formatSize = (size: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let value = size
    let unit = 0
    while (value > 1024 && unit < units.length - 1) {
      value /= 1024
      unit++
    }
    return `${value.toFixed(1)} ${units[unit]}`
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-gray-900 rounded-lg p-4 w-96 border border-white/10" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Propriedades</h3>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-md">
            <X size={14} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            {file.type === 'directory' ? <Folder size={32} /> : <File size={32} />}
            <div>
              <div className="text-sm font-medium">{file.name}</div>
              <div className="text-xs text-gray-400">{file.type === 'directory' ? 'Pasta' : 'Arquivo'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs">
              <span className="text-gray-400">Localização:</span>
              <span className="ml-2">{file.path}</span>
            </div>
            {file.type === 'file' && (
              <div className="text-xs">
                <span className="text-gray-400">Tamanho:</span>
                <span className="ml-2">{formatSize(file.size)}</span>
              </div>
            )}
            <div className="text-xs">
              <span className="text-gray-400">Criado em:</span>
              <span className="ml-2">{formatDate(file.created)}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">Modificado em:</span>
              <span className="ml-2">{formatDate(file.modified)}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">Último acesso:</span>
              <span className="ml-2">{formatDate(file.accessed)}</span>
            </div>
            <div className="text-xs">
              <span className="text-gray-400">Permissões:</span>
              <span className="ml-2">{file.permissions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 