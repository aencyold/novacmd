import { useState } from 'react'
import { 
  Home,
  FolderTree,
  Activity,
  StickyNote,
  Music,
  Image,
  Puzzle,
  Palette,
  Settings,
  Menu,
  ChevronRight
} from 'lucide-react'
import HomePage from './pages/home/Home'
import InterfacePage from './pages/interface/Interface'
import ExplorerPage from './pages/explorer/Explorer'
import SettingsPage from './pages/settings/Settings'

const sidebarItems = [
  {
    category: "Principal",
    items: [
      { icon: <Home size={16} />, label: "Início", id: "home" },
      { icon: <FolderTree size={16} />, label: "Explorador", id: "explorer" },
      { icon: <Activity size={16} />, label: "Monitor", id: "monitor" },
    ]
  },
  {
    category: "Essencial",
    items: [
      { icon: <StickyNote size={16} />, label: "Notas", id: "notes" },
      { icon: <Music size={16} />, label: "Música", id: "music" },
      { icon: <Image size={16} />, label: "Galeria", id: "gallery" },
    ]
  },
  {
    category: "Nova Commander",
    items: [
      { icon: <Puzzle size={16} />, label: "Plugins", id: "plugins" },
      { icon: <Palette size={16} />, label: "Interface", id: "interface" },
      { icon: <Settings size={16} />, label: "Configurações", id: "settings" },
    ]
  }
]

function App() {
  const [activeItem, setActiveItem] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const renderContent = () => {
    switch (activeItem) {
      case 'home':
        return <HomePage />
      case 'interface':
        return <InterfacePage />
      case 'explorer':
        return <ExplorerPage setActiveItem={setActiveItem} />
      case 'settings':
        return <SettingsPage />
      default:
        return (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Em desenvolvimento...</p>
          </div>
        )
    }
  }

  // Esconder a sidebar quando estiver no explorador
  const showSidebar = activeItem !== 'explorer'

  return (
    <div className="min-h-screen bg-black text-gray-100 flex text-sm">
      {/* Sidebar - Fixa com scroll independente */}
      {showSidebar && (
        <div className={`${sidebarOpen ? 'w-48' : 'w-16'} fixed top-0 left-0 h-screen bg-black border-r border-white/10 transition-all duration-300 ease-in-out flex flex-col z-10`}>
          <div className="flex items-center justify-between p-3 border-b border-white/10">
            {sidebarOpen && <h1 className="text-sm font-medium">NovaCMD</h1>}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 hover:bg-white/10 rounded-md"
            >
              <Menu size={16} />
            </button>
          </div>

          {sidebarOpen && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <nav className="p-2">
                {sidebarItems.map((category) => (
                  <div key={category.category} className="mb-6">
                    <h2 className="text-[11px] text-gray-500 uppercase tracking-wider px-2 mb-2">
                      {category.category}
                    </h2>
                    <ul className="space-y-1">
                      {category.items.map((item) => (
                        <li key={item.id}>
                          <button
                            onClick={() => setActiveItem(item.id)}
                            className={`w-full flex items-center px-2 py-1.5 rounded-md transition-colors
                              ${activeItem === item.id 
                                ? 'bg-white/10 text-white' 
                                : 'text-gray-400 hover:bg-white/5'
                              }
                            `}
                          >
                            {item.icon}
                            <span className="ml-2 text-xs">{item.label}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </nav>
            </div>
          )}

          {!sidebarOpen && (
            <nav className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20">
              {sidebarItems.map((category) => (
                <div key={category.category} className="mb-6">
                  <ul className="space-y-1">
                    {category.items.map((item) => (
                      <li key={item.id}>
                        <button
                          onClick={() => setActiveItem(item.id)}
                          className={`w-full flex items-center justify-center px-2 py-1.5 rounded-md transition-colors
                            ${activeItem === item.id 
                              ? 'bg-white/10 text-white' 
                              : 'text-gray-400 hover:bg-white/5'
                            }
                          `}
                        >
                          {item.icon}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* Main Content - Com margem para compensar a sidebar fixa */}
      <div className={`flex-1 ${showSidebar ? (sidebarOpen ? 'ml-48' : 'ml-16') : 'ml-0'} transition-all duration-300`}>
        {showSidebar && (
          <div className="flex items-center gap-2 text-xs text-gray-500 p-3 border-b border-white/10">
            <span>NovaCMD</span>
            <ChevronRight size={12} />
            <span className="text-white">{sidebarItems.flatMap(c => c.items).find(i => i.id === activeItem)?.label}</span>
          </div>
        )}
        
        <main className={showSidebar ? 'p-6' : ''}>
          {renderContent()}
        </main>
      </div>
    </div>
  )
}

export default App
