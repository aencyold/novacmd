import React from 'react'
import { 
  LayoutList,
  Table2,
  LayoutGrid,
  Layers
} from 'lucide-react'

export const viewModes = [
  { id: 'list', icon: <LayoutList size={16} />, label: 'Lista Simples' },
  { id: 'details', icon: <Table2 size={16} />, label: 'Lista Detalhada' },
  { id: 'grid', icon: <LayoutGrid size={16} />, label: 'Grade' },
  { id: 'tiles', icon: <Layers size={16} />, label: 'Blocos' }
] as const

export type ViewMode = typeof viewModes[number]['id'] 