import React, { useEffect, useState } from 'react'
import { 
  Home,
  Download,
  FileText,
  Image,
  Music,
  Video,
  Monitor
} from 'lucide-react'
import { getSpecialDirectories } from '../utils/filesystem'

interface QuickAccessItem {
  id: string
  icon: React.ReactNode
  label: string
  path: string
}

export function QuickAccess({ onSelect, searchTerm = '' }: { onSelect: (path: string) => void, searchTerm?: string }) {
  const [quickAccessItems, setQuickAccessItems] = useState<QuickAccessItem[]>([])

  useEffect(() => {
    const dirs = getSpecialDirectories()
    setQuickAccessItems([
      { id: 'home', icon: <Home size={16} />, label: 'Home', path: dirs.home },
      { id: 'desktop', icon: <Monitor size={16} />, label: 'Área de Trabalho', path: dirs.desktop },
      { id: 'downloads', icon: <Download size={16} />, label: 'Downloads', path: dirs.downloads },
      { id: 'documents', icon: <FileText size={16} />, label: 'Documentos', path: dirs.documents },
      { id: 'pictures', icon: <Image size={16} />, label: 'Imagens', path: dirs.pictures },
      { id: 'music', icon: <Music size={16} />, label: 'Músicas', path: dirs.music },
      { id: 'videos', icon: <Video size={16} />, label: 'Vídeos', path: dirs.videos }
    ])
  }, [])

  const filteredItems = quickAccessItems.filter(item => {
    const normalizedSearch = searchTerm.toLowerCase()
    const normalizedLabel = item.label.toLowerCase()
    
    // Primeiro tenta match exato
    if (normalizedLabel === normalizedSearch) return true
    
    // Depois tenta match parcial case-insensitive
    return normalizedLabel.includes(normalizedSearch)
  })

  return (
    <div className="space-y-1">
      <h2 className="text-[11px] text-gray-500 uppercase tracking-wider px-2 mb-2">
        Acesso Rápido
      </h2>
      <ul>
        {filteredItems.map(item => (
          <li key={item.id}>
            <button
              onClick={() => onSelect(item.path)}
              className="w-full flex items-center px-2 py-1.5 rounded-md text-gray-400 hover:bg-white/5 transition-colors"
            >
              {item.icon}
              <span className="ml-2 text-xs">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
} 