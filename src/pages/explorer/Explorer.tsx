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
  FolderTree
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
    keywords: ["home", "inicio", "início", "principal"],
    alternativePaths: []
  },
  { 
    icon: <Monitor size={16} />, 
    label: "Área de Trabalho", 
    path: path.join(os.homedir(), "Área de Trabalho"),
    keywords: ["desktop", "area de trabalho", "área de trabalho", "Área\ de\ Trabalho"],
    alternativePaths: ["Desktop"]
  },
  { 
    icon: <Download size={16} />, 
    label: "Downloads", 
    path: path.join(os.homedir(), "Downloads"),
    keywords: ["downloads", "baixados"],
    alternativePaths: []
  },
  { 
    icon: <FileText size={16} />, 
    label: "Documentos", 
    path: path.join(os.homedir(), "Documentos"),
    keywords: ["documents", "documentos", "docs"],
    alternativePaths: ["Documents"]
  },
  { 
    icon: <Music size={16} />, 
    label: "Música", 
    path: path.join(os.homedir(), "Música"),
    keywords: ["music", "musica", "música", "songs"],
    alternativePaths: ["Music", "Musicas", "Músicas"]
  },
  { 
    icon: <Image size={16} />, 
    label: "Imagens", 
    path: path.join(os.homedir(), "Imagens"),
    keywords: ["pictures", "imagens", "fotos", "images"],
    alternativePaths: ["Pictures"]
  },
  { 
    icon: <Video size={16} />, 
    label: "Vídeos", 
    path: path.join(os.homedir(), "Vídeos"),
    keywords: ["videos", "vídeos", "filmes"],
    alternativePaths: ["Videos"]
  },
  { 
    icon: <HardDrive size={16} />, 
    label: "Sistema", 
    path: "/",
    keywords: ["root", "sistema", "system", "/"],
    alternativePaths: []
  }
]

interface ExplorerProps {
  setActiveItem: (item: string) => void
}

export default function Explorer({ setActiveItem }: ExplorerProps) {
  // Estados
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
  const [showSidebar, setShowSidebar] = useState(true)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const [rootDisplay, setRootDisplay] = useState<'root' | 'windows' | 'default'>(
    process.platform === 'win32' ? 'windows' : 'default'
  )

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
      const fileList = files
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

  // Função para verificar e obter o caminho correto
  const getValidPath = (location: typeof quickAccessLocations[0]) => {
    const fs = window.require('fs')
    
    if (fs.existsSync(location.path)) {
      return location.path
    }

    for (const altPath of location.alternativePaths) {
      const fullPath = path.join(os.homedir(), altPath)
      if (fs.existsSync(fullPath)) {
        return fullPath
      }
    }

    return location.path // Retorna o caminho original mesmo se não existir
  }

  // Atualizar quickAccessLocations com caminhos válidos
  const validatedLocations = quickAccessLocations.map(location => ({
    ...location,
    path: getValidPath(location)
  }))

  const handleRootContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    if (process.platform === 'win32') {
      setRootDisplay('windows')
    } else {
      setRootDisplay(rootDisplay === 'root' ? 'default' : 'root')
    }
  }

  // Função para alternar o modo de visualização
  const toggleViewMode = () => {
    const modes: ViewMode[] = ['list', 'tiles', 'grid']
    const currentIndex = modes.indexOf(viewMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setViewMode(modes[nextIndex])
  }

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'list':
        return <List size={14} />
      case 'tiles':
        return <LayoutGrid size={14} />
      case 'grid':
        return <Grid size={14} />
    }
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header - Fixed */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveItem('home')}
              className="hover:bg-white/10 p-1.5 rounded transition-colors"
              title="Voltar para Home"
            >
              <ChevronLeft size={16} />
            </button>
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
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={toggleViewMode}
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title={`Modo de visualização: ${viewMode}`}
            >
              {getViewModeIcon()}
            </button>
            <button 
              onClick={() => loadDirectory(currentPath)} 
              className="p-1.5 hover:bg-white/10 rounded transition-colors"
              title="Atualizar"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className={`p-1.5 hover:bg-white/10 rounded transition-colors ${!showSidebar ? 'bg-white/10' : ''}`}
              title={showSidebar ? 'Ocultar Barra Lateral' : 'Mostrar Barra Lateral'}
            >
              <PanelLeft size={16} />
            </button>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="flex items-center gap-2 px-4 py-1.5 border-b border-white/10 text-xs">
          <div className="flex items-center gap-1 flex-1 bg-black/50 px-2 py-1 rounded">
            {currentPath.split(path.sep).map((segment, i, arr) => (
              <div key={i} className="flex items-center">
                {i > 0 && <ChevronRight size={12} className="mx-1 text-gray-600" />}
                <button 
                  onClick={() => navigateTo(path.join('/', ...arr.slice(0, i + 1)))}
                  onContextMenu={i === 0 ? handleRootContextMenu : undefined}
                  className="hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/5"
                >
                  {i === 0 ? (
                    rootDisplay === 'root' ? 'Root' :
                    rootDisplay === 'windows' ? 'Windows' : '/'
                  ) : segment}
                </button>
              </div>
            ))}
          </div>
          <button 
            className={`p-1.5 hover:bg-white/10 rounded transition-colors ${showHidden ? 'bg-white/10' : ''}`}
            onClick={() => setShowHidden(!showHidden)}
            title={showHidden ? 'Ocultar arquivos ocultos' : 'Mostrar arquivos ocultos'}
          >
            <Eye size={14} />
          </button>
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
      </div>

      {/* Main Content - Com padding-top para compensar o header fixo */}
      <div className="flex-1 flex min-h-0 mt-[132px]">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-48 border-r border-white/10 flex-shrink-0 flex flex-col min-h-0">
            <div className="p-2 text-xs text-gray-400 uppercase tracking-wider">
              Locais
            </div>
            <div className="flex-1 overflow-y-auto scrollbar scrollbar-w-1.5 scrollbar-track-transparent scrollbar-thumb-white/10 hover:scrollbar-thumb-white/20">
              <div className="p-2 space-y-0.5">
                {validatedLocations.map((location) => (
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
            ) : files.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-sm">
                <span>Pasta vazia</span>
              </div>
            ) : (
              <div 
                className={
                  viewMode === 'grid' 
                    ? 'grid grid-cols-10 2xl:grid-cols-12 gap-2' 
                    : viewMode === 'tiles'
                    ? 'grid grid-cols-2 gap-2'
                    : 'space-y-0.5'
                }
              >
                {files.map((file) => (
                  <button
                    key={file.path}
                    onClick={(e) => handleFileClick(file, e)}
                    onContextMenu={(e) => handleContextMenu(e, file)}
                    className={`w-full text-left rounded transition-all relative group
                      ${selectedFiles.has(file.path) ? 'bg-white/20 ring-1 ring-white/40' : 'hover:bg-white/5'}
                      ${viewMode === 'grid'
                        ? 'p-1.5'
                        : viewMode === 'tiles'
                        ? 'p-1.5 flex items-start gap-2'
                        : 'px-1.5 py-1 flex items-center gap-2'
                      }
                    `}
                  >
                    {viewMode === 'grid' ? (
                      <div className="text-center">
                        <div className="flex items-center justify-center h-12 bg-black/50 rounded group-hover:bg-black transition-colors mb-1">
                          {getFileIcon(file)}
                        </div>
                        <div className="truncate text-[11px]">{file.name}</div>
                        <div className="text-[10px] text-gray-500">
                          {file.type === 'file' ? formatSize(file.size) : ''}
                        </div>
                      </div>
                    ) : viewMode === 'tiles' ? (
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
                <span>{files.length} {files.length === 1 ? 'item' : 'itens'}</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span>Espaço livre: {formatSize(driveInfo.free)}</span>
              <span>Total: {formatSize(driveInfo.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Properties Dialog */}
      {showProperties && (
        <PropertiesDialog
          file={showProperties}
          onClose={() => setShowProperties(null)}
        />
      )}
    </div>
  )
} 