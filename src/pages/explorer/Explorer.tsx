import React, { useState, useEffect, useRef } from 'react'
import { 
  ChevronRight,
  ChevronUp,
  Search,
  File,
  Folder,
  RefreshCw,
  Trash2,
  Copy,
  Scissors,
  FilePlus,
  Download,
  Eye,
  AlertCircle,
  Home as HomeIcon,
  PanelLeft,
  Grid,
  List,
  LayoutGrid,
  Home,
  FolderHeart,
  FileText,
  Music,
  Image,
  Video,
  Monitor,
  HardDrive,
  ChevronLeft,
  FolderTree,
  Settings
} from 'lucide-react'
import type { FileItem } from '../../types/file'
import { fileIcons } from '../../utils/fileIcons'
import { viewModes, type ViewMode } from '../../utils/viewModes'
import { ContextMenu } from '../../components/ContextMenu'
import { 
  listDirectory, 
  getDefaultLocation, 
  getParentDirectory,
  createDirectory,
  deleteFiles,
  copyFiles,
  moveFiles,
  getDriveInfo
} from '../../utils/filesystem'
import { PropertiesDialog } from '@/components/PropertiesDialog'
import { loadConfig, saveConfig, type ExplorerConfig } from '@/utils/config'
import { ExplorerSettings } from '@/components/ExplorerSettings'

// @ts-ignore
const path = window.require('path')
// @ts-ignore
const os = window.require('os')

// Funções utilitárias
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

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(date)
}

const getFileIcon = (file: FileItem) => {
  if (file.type === 'directory') {
    return <Folder size={16} className="text-yellow-400" />
  }
  return fileIcons[file.extension?.toLowerCase() || ''] || <File size={16} />
}

const quickAccessLocations = [
  { 
    icon: <Home size={16} />, 
    label: "Início", 
    path: os.homedir(),
    keywords: ["home", "inicio", "início", "principal"]
  },
  { 
    icon: <Monitor size={16} />, 
    label: "Área de Trabalho", 
    path: path.join(os.homedir(), "Área de Trabalho"),
    keywords: ["desktop", "area de trabalho", "área de trabalho"]
  },
  { 
    icon: <Download size={16} />, 
    label: "Downloads", 
    path: path.join(os.homedir(), "Downloads"),
    keywords: ["downloads", "baixados"]
  },
  { 
    icon: <FileText size={16} />, 
    label: "Documentos", 
    path: path.join(os.homedir(), "Documentos"),
    keywords: ["documents", "documentos", "docs"]
  },
  { 
    icon: <Music size={16} />, 
    label: "Música", 
    path: path.join(os.homedir(), "Música"),
    keywords: ["music", "musica", "música", "songs"]
  },
  { 
    icon: <Image size={16} />, 
    label: "Imagens", 
    path: path.join(os.homedir(), "Imagens"),
    keywords: ["pictures", "imagens", "fotos", "images"]
  },
  { 
    icon: <Video size={16} />, 
    label: "Vídeos", 
    path: path.join(os.homedir(), "Vídeos"),
    keywords: ["videos", "vídeos", "filmes"]
  },
  { 
    icon: <FolderHeart size={16} />, 
    label: "Favoritos", 
    path: path.join(os.homedir(), ".favorites"),
    keywords: ["favorites", "favoritos"]
  },
  { 
    icon: <HardDrive size={16} />, 
    label: "Sistema", 
    path: "/",
    keywords: ["root", "sistema", "system", "/"]
  }
]

interface ExplorerProps {
  setActiveItem: (item: string) => void
}

export default function Explorer({ setActiveItem }: ExplorerProps) {
  // Configurações
  const [config, setConfig] = useState<ExplorerConfig>(loadConfig('explorer'))
  const [showSettings, setShowSettings] = useState(false)

  // Estados existentes
  const [currentPath, setCurrentPath] = useState(getDefaultLocation())
  const [pathHistory, setPathHistory] = useState<string[]>([])
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1)
  const [files, setFiles] = useState<FileItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'modified'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showHidden, setShowHidden] = useState(false)
  const [filterExtension, setFilterExtension] = useState<string | null>(null)
  const [clipboard, setClipboard] = useState<{type: 'copy' | 'cut', files: string[]} | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [driveInfo, setDriveInfo] = useState<{ free: number, total: number }>({ free: 0, total: 0 })
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    file?: FileItem
  } | null>(null)
  const [showProperties, setShowProperties] = useState<FileItem | null>(null)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const [sidebarSearch, setSidebarSearch] = useState("")

  // Efeito para salvar configurações quando mudarem
  useEffect(() => {
    saveConfig('explorer', config)
  }, [config])

  useEffect(() => {
    const handleNavigation = (event: CustomEvent<{ path: string }>) => {
      navigateTo(event.detail.path)
    }

    window.addEventListener('navigate', handleNavigation as EventListener)
    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener)
    }
  }, [])

  useEffect(() => {
    // Inicializar o histórico com o local inicial
    setPathHistory([getDefaultLocation()])
    setCurrentHistoryIndex(0)
  }, [])

  useEffect(() => {
    loadDirectory(currentPath)
  }, [currentPath])

  const handleContextMenu = (event: React.MouseEvent, file?: FileItem) => {
    event.preventDefault()
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      file
    })
  }

  const closeContextMenu = () => {
    setContextMenu(null)
  }

  const handleOpenFile = (file: FileItem) => {
    // TODO: Implementar abertura de arquivos
  }

  const handleRename = (file: FileItem) => {
    // TODO: Implementar renomeação
  }

  const handleProperties = (file: FileItem) => {
    setShowProperties(file)
  }

  const loadDirectory = async (dirPath: string) => {
    try {
      setLoading(true)
      setError(null)
      const files = await listDirectory(dirPath)
      setFiles(files)
      const drive = await getDriveInfo()
      setDriveInfo(drive)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const navigateTo = (path: string, addToHistory = true) => {
    setCurrentPath(path)
    loadDirectory(path)
    
    if (addToHistory) {
      // Remover histórico futuro se estivermos navegando de um ponto intermediário
      const newHistory = pathHistory.slice(0, currentHistoryIndex + 1)
      setPathHistory([...newHistory, path])
      setCurrentHistoryIndex(newHistory.length)
    }
  }

  const navigateBack = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1
      setCurrentHistoryIndex(newIndex)
      navigateTo(pathHistory[newIndex], false)
    }
  }

  const navigateForward = () => {
    if (currentHistoryIndex < pathHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1
      setCurrentHistoryIndex(newIndex)
      navigateTo(pathHistory[newIndex], false)
    }
  }

  const navigateUp = () => {
    const parent = getParentDirectory(currentPath)
    if (parent) {
      navigateTo(parent)
    }
  }

  const handleFileClick = (file: FileItem, event: React.MouseEvent) => {
    if (event.ctrlKey) {
      // Multi-seleção com Ctrl
      const newSelected = new Set(selectedFiles)
      if (newSelected.has(file.path)) {
        newSelected.delete(file.path)
      } else {
        newSelected.add(file.path)
      }
      setSelectedFiles(newSelected)
    } else if (event.shiftKey && selectedFiles.size > 0) {
      // Seleção em grupo com Shift
      const fileList = sortedFiles
      const lastSelected = Array.from(selectedFiles)[selectedFiles.size - 1]
      const lastIndex = fileList.findIndex(f => f.path === lastSelected)
      const currentIndex = fileList.findIndex(f => f.path === file.path)
      const start = Math.min(lastIndex, currentIndex)
      const end = Math.max(lastIndex, currentIndex)
      const newSelected = new Set(selectedFiles)
      for (let i = start; i <= end; i++) {
        newSelected.add(fileList[i].path)
      }
      setSelectedFiles(newSelected)
    } else {
      // Clique simples
      if (file.type === 'directory') {
        navigateTo(file.path)
      } else {
        setSelectedFiles(new Set([file.path]))
        // TODO: Implementar abertura de arquivos
      }
    }
  }

  const handleCopy = () => {
    setClipboard({ type: 'copy', files: Array.from(selectedFiles) })
  }

  const handleCut = () => {
    setClipboard({ type: 'cut', files: Array.from(selectedFiles) })
  }

  const handlePaste = async () => {
    if (!clipboard) return
    
    try {
      if (clipboard.type === 'copy') {
        await copyFiles(clipboard.files, currentPath)
      } else {
        await moveFiles(clipboard.files, currentPath)
      }
      setClipboard(null)
      loadDirectory(currentPath)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteFiles(Array.from(selectedFiles))
      setSelectedFiles(new Set())
      loadDirectory(currentPath)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleNewFolder = async () => {
    if (!newFolderName) return
    
    try {
      await createDirectory(path.join(currentPath, newFolderName))
      setShowNewFolderDialog(false)
      setNewFolderName('')
      loadDirectory(currentPath)
    } catch (error: any) {
      setError(error.message)
    }
  }

  // Ordenar arquivos
  const sortedFiles = [...files].sort((a, b) => {
    if (a.type === 'directory' && b.type === 'file') return -1
    if (a.type === 'file' && b.type === 'directory') return 1

    switch (sortBy) {
      case 'size':
        return sortOrder === 'asc' ? a.size - b.size : b.size - a.size
      case 'modified':
        return sortOrder === 'asc' 
          ? a.modified.getTime() - b.modified.getTime()
          : b.modified.getTime() - a.modified.getTime()
      default:
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
    }
  }).filter(file => {
    if (!showHidden && file.name.startsWith('.')) return false
    if (searchQuery && !file.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    if (filterExtension && file.type === 'file' && file.extension !== filterExtension) return false
    return true
  })

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'a' && event.ctrlKey) {
      event.preventDefault()
      setSelectedFiles(new Set(files.map(f => f.path)))
    } else if (event.key === 'Delete' && selectedFiles.size > 0) {
      event.preventDefault()
      handleDelete()
    } else if (event.key === 'c' && event.ctrlKey && selectedFiles.size > 0) {
      event.preventDefault()
      handleCopy()
    } else if (event.key === 'x' && event.ctrlKey && selectedFiles.size > 0) {
      event.preventDefault()
      handleCut()
    } else if (event.key === 'v' && event.ctrlKey && clipboard) {
      event.preventDefault()
      handlePaste()
    }
  }

  const filteredLocations = quickAccessLocations.filter(location => {
    if (!sidebarSearch) return true
    
    const searchLower = sidebarSearch.toLowerCase()
    
    // Busca exata
    if (location.label.toLowerCase() === searchLower) return true
    if (location.keywords.some(k => k.toLowerCase() === searchLower)) return true
    
    // Busca parcial
    if (location.label.toLowerCase().includes(searchLower)) return true
    if (location.keywords.some(k => k.toLowerCase().includes(searchLower))) return true
    
    return false
  })

  const handleConfigChange = (newConfig: ExplorerConfig) => {
    setConfig(newConfig)
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setActiveItem('home')}
            className="hover:bg-white/10 p-1.5 rounded transition-colors"
            title="Voltar para Home"
          >
            <ChevronLeft size={16} />
          </button>
          {config.controlButtonsPosition === 'top' && (
            <div className="flex items-center gap-1">
              <button
                onClick={navigateBack}
                disabled={currentHistoryIndex <= 0}
                className="hover:bg-white/10 p-1.5 rounded transition-colors disabled:opacity-50"
                title="Voltar"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={navigateForward}
                disabled={currentHistoryIndex >= pathHistory.length - 1}
                className="hover:bg-white/10 p-1.5 rounded transition-colors disabled:opacity-50"
                title="Avançar"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
          {config.searchPosition === 'home' && (
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/50 text-xs pl-8 pr-4 py-1.5 rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all focus:w-64"
              />
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {config.searchPosition === 'path' && (
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/50 text-xs pl-8 pr-4 py-1.5 rounded-md w-48 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all focus:w-64"
              />
            </div>
          )}
          <button
            onClick={() => setConfig({ ...config, showSidebar: !config.showSidebar })}
            className={`p-1.5 hover:bg-white/10 rounded transition-colors ${!config.showSidebar ? 'bg-white/10' : ''}`}
            title={config.showSidebar ? 'Ocultar Barra Lateral' : 'Mostrar Barra Lateral'}
          >
            <PanelLeft size={16} />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Configurações"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="flex items-center gap-2 px-4 py-1.5 border-b border-white/10 text-xs">
        <div className="flex items-center gap-1 flex-1 bg-black/50 px-2 py-1 rounded">
          {config.controlButtonsPosition === 'path' && (
            <div className="flex items-center gap-1 mr-2">
              <button
                onClick={navigateBack}
                disabled={currentHistoryIndex <= 0}
                className="hover:bg-white/10 p-1.5 rounded transition-colors disabled:opacity-50"
                title="Voltar"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={navigateForward}
                disabled={currentHistoryIndex >= pathHistory.length - 1}
                className="hover:bg-white/10 p-1.5 rounded transition-colors disabled:opacity-50"
                title="Avançar"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
          {currentPath.split(path.sep).map((segment, i, arr) => (
            <div key={i} className="flex items-center">
              {i > 0 && <ChevronRight size={12} className="mx-1 text-gray-600" />}
              <button 
                onClick={() => navigateTo(path.join('/', ...arr.slice(0, i + 1)))}
                className="hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/5"
              >
                {i === 0 ? (
                  config.rootDisplay === 'root' ? 'Root' :
                  config.rootDisplay === 'windows' ? 'Windows' : '/'
                ) : segment}
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => loadDirectory(currentPath)} 
            className="p-1.5 hover:bg-white/10 rounded transition-colors"
            title="Atualizar"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            className={`p-1.5 hover:bg-white/10 rounded transition-colors ${config.showHidden ? 'bg-white/10' : ''}`}
            onClick={() => setConfig({ ...config, showHidden: !config.showHidden })}
            title={config.showHidden ? 'Ocultar arquivos ocultos' : 'Mostrar arquivos ocultos'}
          >
            <Eye size={14} />
          </button>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setConfig({ ...config, viewMode: 'list' })}
              className={`p-1.5 hover:bg-white/10 rounded transition-colors ${config.viewMode === 'list' ? 'bg-white/10' : ''}`}
              title="Lista"
            >
              <List size={14} />
            </button>
            <button 
              onClick={() => setConfig({ ...config, viewMode: 'tiles' })}
              className={`p-1.5 hover:bg-white/10 rounded transition-colors ${config.viewMode === 'tiles' ? 'bg-white/10' : ''}`}
              title="Blocos"
            >
              <LayoutGrid size={14} />
            </button>
            <button 
              onClick={() => setConfig({ ...config, viewMode: 'grid' })}
              className={`p-1.5 hover:bg-white/10 rounded transition-colors ${config.viewMode === 'grid' ? 'bg-white/10' : ''}`}
              title="Grade"
            >
              <Grid size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center px-4 py-1.5 border-b border-white/10">
        <div className="flex items-center gap-1">
          <button 
            className="px-2 py-1 hover:bg-white/10 rounded text-xs flex items-center gap-1.5 transition-colors"
            onClick={() => setShowNewFolderDialog(true)}
          >
            <FilePlus size={14} />
            <span>Nova pasta</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <button 
            className="px-2 py-1 hover:bg-white/10 rounded text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            disabled={selectedFiles.size === 0}
            onClick={handleCopy}
          >
            <Copy size={14} />
            <span>Copiar</span>
          </button>
          <button 
            className="px-2 py-1 hover:bg-white/10 rounded text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            disabled={selectedFiles.size === 0}
            onClick={handleCut}
          >
            <Scissors size={14} />
            <span>Recortar</span>
          </button>
          <button 
            className="px-2 py-1 hover:bg-white/10 rounded text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            disabled={!clipboard}
            onClick={handlePaste}
          >
            <Download size={14} />
            <span>Colar</span>
          </button>
          <button 
            className="px-2 py-1 hover:bg-white/10 rounded text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            disabled={selectedFiles.size === 0}
            onClick={handleDelete}
          >
            <Trash2 size={14} />
            <span>Excluir</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Sidebar */}
        {config.showSidebar && (
          <div className="w-48 border-r border-white/10 flex-shrink-0 flex flex-col min-h-0">
            <div className="p-2 text-xs text-gray-400 uppercase tracking-wider">
              Locais
            </div>
            <div className="flex-1 overflow-y-auto scrollbar scrollbar-w-1.5 scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
              <div className="p-2 space-y-0.5">
                {quickAccessLocations.map((location) => (
                  <button 
                    key={location.path}
                    onClick={() => navigateTo(location.path)}
                    className="w-full text-left px-2 py-1.5 rounded hover:bg-white/10 flex items-center gap-2 text-xs transition-colors"
                  >
                    {location.icon}
                    <span>{location.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Files Area */}
        <div className="flex-1 min-h-0 flex flex-col">
          <div ref={mainContentRef} className="flex-1 overflow-y-auto scrollbar scrollbar-w-1.5 scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20 p-2">
            {error ? (
              <div className="flex items-center justify-center h-full text-red-400 text-sm">
                <AlertCircle size={16} className="mr-2" />
                <span>{error}</span>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-full">
                <RefreshCw size={24} className="animate-spin text-gray-400" />
              </div>
            ) : sortedFiles.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                <span>Pasta vazia</span>
              </div>
            ) : (
              <div 
                className={
                  config.viewMode === 'grid' 
                    ? 'grid grid-cols-10 2xl:grid-cols-12 gap-2' 
                    : config.viewMode === 'tiles'
                    ? 'grid grid-cols-2 gap-2'
                    : 'space-y-0.5'
                }
              >
                {sortedFiles.map((file) => (
                  <button
                    key={file.path}
                    onClick={(e) => handleFileClick(file, e)}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                    className={`w-full text-left rounded transition-all relative group
                      ${selectedFiles.has(file.path) ? 'bg-white/20 ring-1 ring-white/40' : 'hover:bg-white/5'}
                      ${config.viewMode === 'grid'
                        ? 'p-1.5'
                        : config.viewMode === 'tiles'
                        ? 'p-1.5 flex items-start gap-2'
                        : 'px-1.5 py-1 flex items-center gap-2'
                      }
                    `}
                  >
                    {config.viewMode === 'grid' ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center h-12 bg-black/50 rounded group-hover:bg-black transition-colors mb-1">
                          {getFileIcon(file)}
                        </div>
                        <div className="truncate text-[11px]">{file.name}</div>
                        <div className="text-[10px] text-gray-500">
                          {file.type === 'file' ? formatSize(file.size) : ''}
                        </div>
                      </div>
                    ) : config.viewMode === 'tiles' ? (
                      <>
                        <div className="flex items-center justify-center w-10 h-10 bg-black/50 rounded flex-shrink-0 group-hover:bg-black transition-colors">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex-1 min-w-0 py-0.5">
                          <div className="truncate text-[11px]">{file.name}</div>
                          <div className="text-[10px] text-gray-500">
                            {file.type === 'file' ? formatSize(file.size) : ''}
                          </div>
                          <div className="text-[10px] text-gray-500">
                            {formatDate(file.modified)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        {getFileIcon(file)}
                        <span className="flex-1 truncate text-[11px]">{file.name}</span>
                        <span className="text-[10px] text-gray-500 flex-shrink-0 w-16 text-right">
                          {file.type === 'file' ? formatSize(file.size) : ''}
                        </span>
                        <span className="text-[10px] text-gray-500 flex-shrink-0 w-24 text-right">
                          {formatDate(file.modified)}
                        </span>
                        <span className="text-[10px] text-gray-500 flex-shrink-0 w-16 text-right">
                          {file.extension || (file.type === 'directory' ? 'Pasta' : '')}
                        </span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Bar */}
          <div className="border-t border-white/10 px-4 py-1.5 text-xs text-gray-400 flex items-center justify-between flex-shrink-0 bg-black/50">
            <div>
              {selectedFiles.size > 0 ? (
                <span>{selectedFiles.size} {selectedFiles.size === 1 ? 'item selecionado' : 'itens selecionados'}</span>
              ) : (
                <span>{sortedFiles.length} {sortedFiles.length === 1 ? 'item' : 'itens'}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Espaço livre: {formatSize(driveInfo.free)}</span>
              <span>Total: {formatSize(driveInfo.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {showSettings && (
        <ExplorerSettings
          config={config}
          onConfigChange={handleConfigChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          file={contextMenu.file}
          onClose={closeContextMenu}
          onOpen={handleOpenFile}
          onRename={handleRename}
          onCopy={handleCopy}
          onCut={handleCut}
          onDelete={handleDelete}
          onProperties={handleProperties}
          onNewFolder={() => setShowNewFolderDialog(true)}
          onPaste={handlePaste}
          onToggleHidden={() => setConfig({ ...config, showHidden: !config.showHidden })}
          onRefresh={() => loadDirectory(currentPath)}
          canPaste={!!clipboard}
          showHidden={config.showHidden}
        />
      )}

      {showNewFolderDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-black rounded-lg p-4 w-96 border border-white/10">
            <h3 className="text-sm font-medium mb-4">Nova Pasta</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nome da pasta"
              className="w-full bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
              autoFocus
            />
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowNewFolderDialog(false)
                  setNewFolderName('')
                }}
                className="px-3 py-1.5 text-sm hover:bg-white/5 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleNewFolder}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-md"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}

      {showProperties && (
        <PropertiesDialog
          file={showProperties}
          onClose={() => setShowProperties(null)}
        />
      )}
    </div>
  )
} 