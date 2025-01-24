import { 
  FolderTree, 
  Activity, 
  StickyNote, 
  Music, 
  Image,
  Puzzle,
  Palette,
  Settings,
  Clock,
  Cpu,
  HardDrive
} from 'lucide-react'

const quickActions = [
  {
    category: "Acesso Rápido",
    items: [
      { icon: <FolderTree size={16} />, label: "Explorador", id: "explorer", description: "Navegue pelos seus arquivos" },
      { icon: <Activity size={16} />, label: "Monitor", id: "monitor", description: "Monitore seu sistema" },
      { icon: <Image size={16} />, label: "Galeria", id: "gallery", description: "Visualize suas mídias" },
    ]
  },
  {
    category: "Sistema",
    items: [
      { icon: <Cpu size={16} />, label: "CPU", value: "3.2 GHz", description: "4 cores / 8 threads" },
      { icon: <HardDrive size={16} />, label: "Armazenamento", value: "512 GB", description: "230 GB livre" },
      { icon: <Clock size={16} />, label: "Uptime", value: "2h 30m", description: "Última inicialização: 14:30" },
    ]
  }
]

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Bem-vindo ao Nova Commander</h1>
        <p className="text-sm text-gray-400">Um gerenciador de arquivos moderno e eficiente para seu sistema</p>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6">
        {quickActions.map((section) => (
          <div key={section.category}>
            <h2 className="text-sm font-medium mb-3">{section.category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <button
                  key={'id' in item ? item.id : item.label}
                  className="bg-black/40 p-4 rounded-lg text-left hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md bg-white/5 text-blue-400 group-hover:bg-white/10">
                      {item.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{item.label}</span>
                        {'value' in item && (
                          <span className="text-xs text-emerald-400">{item.value}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-sm font-medium mb-3">Atividade Recente</h2>
        <div className="bg-black/40 rounded-lg divide-y divide-white/5">
          {[1,2,3].map((i) => (
            <div key={i} className="p-3 flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-xs text-gray-300">arquivo_{i}.txt</span>
              <span className="text-xs text-gray-500 ml-auto">há {i}m</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 