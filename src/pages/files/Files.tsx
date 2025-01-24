import { useState } from 'react'
import { 
  ChevronDown, 
  ChevronRight, 
  File, 
  Folder, 
  Search,
  SortAsc,
  Grid,
  List,
  MoreVertical
} from 'lucide-react'
import type { FileItem } from '../../types/file'

// Mock data
const mockFiles: FileItem[] = [
  {
    name: 'Documentos',
    type: 'directory',
    size: 4096,
    modified: new Date(),
    created: new Date(),
    accessed: new Date(),
    permissions: 'drwxr-xr-x',
    path: '/home/user/Documentos'
  },
  {
    name: 'projeto.tsx',
    type: 'file',
    size: 1024,
    modified: new Date(),
    created: new Date(),
    accessed: new Date(),
    permissions: '-rw-r--r--',
    path: '/home/user/projeto.tsx',
    extension: 'tsx'
  },
  {
    name: 'imagem.png',
    type: 'file',
    size: 2048,
    modified: new Date(),
    created: new Date(),
    accessed: new Date(),
    permissions: '-rw-r--r--',
    path: '/home/user/imagem.png',
    extension: 'png'
  }
]

export default function Files() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedFile, setSelectedFile] = useState<string | null>(null)

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '-'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const sortedFiles = [...mockFiles].sort((a, b) => {
    if (a.type === 'directory' && b.type === 'file') return -1
    if (a.type === 'file' && b.type === 'directory') return 1

    let comparison = 0
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name)
        break
      case 'size':
        comparison = a.size - b.size
        break
      case 'modified':
        comparison = a.modified.getTime() - b.modified.getTime()
        break
    }
    return sortOrder === 'asc' ? comparison : -comparison
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              placeholder="Buscar arquivos..."
              className="bg-white/5 text-xs pl-8 pr-4 py-1.5 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-white/20"
            />
          </div>
          
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
            className="p-1.5 hover:bg-white/10 rounded-md"
          >
            {viewMode === 'list' ? <Grid size={14} /> : <List size={14} />}
          </button>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>{sortedFiles.length} itens</span>
        </div>
      </div>

      {/* File List */}
      <div className="bg-black/40 rounded-lg">
        <div className="grid grid-cols-12 text-xs text-gray-400 p-2 border-b border-white/10">
          <div className="col-span-6 flex items-center gap-1">
            <button 
              onClick={() => {
                if (sortBy === 'name') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy('name')
                  setSortOrder('asc')
                }
              }}
              className="hover:text-white flex items-center gap-1"
            >
              Nome
              {sortBy === 'name' && <SortAsc size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
            </button>
          </div>
          <div className="col-span-2">
            <button 
              onClick={() => {
                if (sortBy === 'size') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy('size')
                  setSortOrder('asc')
                }
              }}
              className="hover:text-white flex items-center gap-1"
            >
              Tamanho
              {sortBy === 'size' && <SortAsc size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
            </button>
          </div>
          <div className="col-span-3">
            <button 
              onClick={() => {
                if (sortBy === 'modified') {
                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
                } else {
                  setSortBy('modified')
                  setSortOrder('asc')
                }
              }}
              className="hover:text-white flex items-center gap-1"
            >
              Modificado
              {sortBy === 'modified' && <SortAsc size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
            </button>
          </div>
          <div className="col-span-1"></div>
        </div>

        <div className="divide-y divide-white/5">
          {sortedFiles.map((file) => (
            <div 
              key={file.path}
              className={`grid grid-cols-12 text-xs p-2 hover:bg-white/5 cursor-pointer
                ${selectedFile === file.path ? 'bg-white/10' : ''}
              `}
              onClick={() => setSelectedFile(file.path)}
            >
              <div className="col-span-6 flex items-center gap-2">
                {file.type === 'directory' ? (
                  <>
                    <ChevronRight size={14} className="text-gray-500" />
                    <Folder size={14} className="text-blue-400" />
                  </>
                ) : (
                  <>
                    <div className="w-3.5" />
                    <File size={14} className="text-gray-400" />
                  </>
                )}
                <span className="truncate">{file.name}</span>
              </div>
              <div className="col-span-2 text-gray-500">{formatSize(file.size)}</div>
              <div className="col-span-3 text-gray-500">{formatDate(file.modified)}</div>
              <div className="col-span-1 flex justify-end">
                <button className="p-1 hover:bg-white/10 rounded-md opacity-0 group-hover:opacity-100">
                  <MoreVertical size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 