import { useState } from 'react'
import { 
  FolderCog,
  FileJson,
  Keyboard,
  Languages,
  Bell,
  Shield,
  Terminal,
  Info,
  ChevronRight,
  Search,
  Palette
} from 'lucide-react'

type SettingType = 'checkbox' | 'shortcut' | 'select' | 'text' | 'link'

interface BaseSetting {
  type: SettingType
  label: string
}

interface CheckboxSetting extends BaseSetting {
  type: 'checkbox'
  value: boolean
}

interface ShortcutSetting extends BaseSetting {
  type: 'shortcut'
  value: string
}

interface SelectSetting extends BaseSetting {
  type: 'select'
  value: string
  options: { label: string, value: string }[]
}

interface TextSetting extends BaseSetting {
  type: 'text'
  value: string
}

interface LinkSetting extends BaseSetting {
  type: 'link'
  value: string
}

type Setting = CheckboxSetting | ShortcutSetting | SelectSetting | TextSetting | LinkSetting

const settingsSections = [
  {
    category: "Geral",
    items: [
      {
        icon: <FolderCog size={16} />,
        label: "Pastas e Arquivos",
        description: "Configurações de exibição e comportamento",
        settings: [
          { type: 'checkbox' as const, label: 'Mostrar arquivos ocultos', value: false },
          { type: 'checkbox' as const, label: 'Confirmar antes de excluir', value: true },
          { type: 'checkbox' as const, label: 'Abrir na última pasta visitada', value: true },
          { type: 'checkbox' as const, label: 'Mostrar extensões de arquivo', value: true },
          { type: 'checkbox' as const, label: 'Mostrar tamanho das pastas', value: false },
          { type: 'select' as const, label: 'Ação de duplo clique', value: 'open', 
            options: [
              { label: 'Abrir', value: 'open' },
              { label: 'Editar', value: 'edit' },
              { label: 'Propriedades', value: 'properties' }
            ]
          },
        ]
      },
      {
        icon: <FileJson size={16} />,
        label: "Formatos de Arquivo",
        description: "Associações e visualizações",
        settings: [
          { type: 'checkbox' as const, label: 'Visualização rápida de imagens', value: true },
          { type: 'checkbox' as const, label: 'Visualização rápida de textos', value: true },
          { type: 'checkbox' as const, label: 'Visualização rápida de PDFs', value: true },
          { type: 'checkbox' as const, label: 'Visualização rápida de vídeos', value: true },
          { type: 'checkbox' as const, label: 'Mostrar miniaturas de imagens', value: true },
        ]
      },
    ]
  },
  {
    category: "Interface",
    items: [
      {
        icon: <Keyboard size={16} />,
        label: "Atalhos",
        description: "Teclas de atalho personalizadas",
        settings: [
          { type: 'shortcut' as const, label: 'Atualizar', value: 'F5' },
          { type: 'shortcut' as const, label: 'Nova pasta', value: 'Ctrl+N' },
          { type: 'shortcut' as const, label: 'Excluir', value: 'Delete' },
          { type: 'shortcut' as const, label: 'Copiar', value: 'Ctrl+C' },
          { type: 'shortcut' as const, label: 'Colar', value: 'Ctrl+V' },
          { type: 'shortcut' as const, label: 'Recortar', value: 'Ctrl+X' },
          { type: 'shortcut' as const, label: 'Selecionar tudo', value: 'Ctrl+A' },
          { type: 'shortcut' as const, label: 'Pesquisar', value: 'Ctrl+F' },
        ]
      },
      {
        icon: <Languages size={16} />,
        label: "Idioma",
        description: "Linguagem e formatos",
        settings: [
          { 
            type: 'select' as const, 
            label: 'Idioma', 
            value: 'pt-BR',
            options: [
              { label: 'Português (Brasil)', value: 'pt-BR' },
              { label: 'English', value: 'en' },
              { label: 'Español', value: 'es' },
            ]
          },
          {
            type: 'select' as const,
            label: 'Formato de data',
            value: 'dd/MM/yyyy',
            options: [
              { label: 'DD/MM/YYYY', value: 'dd/MM/yyyy' },
              { label: 'MM/DD/YYYY', value: 'MM/dd/yyyy' },
              { label: 'YYYY-MM-DD', value: 'yyyy-MM-dd' },
            ]
          },
          {
            type: 'select' as const,
            label: 'Formato de hora',
            value: 'HH:mm',
            options: [
              { label: '24 horas', value: 'HH:mm' },
              { label: '12 horas', value: 'hh:mm a' },
            ]
          },
        ]
      },
      {
        icon: <Palette size={16} />,
        label: "Aparência",
        description: "Personalização visual",
        settings: [
          {
            type: 'select' as const,
            label: 'Tema',
            value: 'dark',
            options: [
              { label: 'Escuro', value: 'dark' },
              { label: 'Claro', value: 'light' },
              { label: 'Sistema', value: 'system' },
            ]
          },
          {
            type: 'select' as const,
            label: 'Cor de destaque',
            value: 'blue',
            options: [
              { label: 'Azul', value: 'blue' },
              { label: 'Verde', value: 'green' },
              { label: 'Roxo', value: 'purple' },
              { label: 'Rosa', value: 'pink' },
              { label: 'Laranja', value: 'orange' },
            ]
          },
          { type: 'checkbox' as const, label: 'Mostrar animações', value: true },
          { type: 'checkbox' as const, label: 'Modo compacto', value: false },
        ]
      },
    ]
  },
  {
    category: "Sistema",
    items: [
      {
        icon: <Bell size={16} />,
        label: "Notificações",
        description: "Alertas e avisos",
        settings: [
          { type: 'checkbox' as const, label: 'Notificar ao concluir operações', value: true },
          { type: 'checkbox' as const, label: 'Notificar sobre erros', value: true },
        ]
      },
      {
        icon: <Shield size={16} />,
        label: "Segurança",
        description: "Permissões e proteções",
        settings: [
          { type: 'checkbox' as const, label: 'Verificar arquivos suspeitos', value: true },
          { type: 'checkbox' as const, label: 'Backup automático de configurações', value: false },
        ]
      },
      {
        icon: <Terminal size={16} />,
        label: "Avançado",
        description: "Opções para usuários avançados",
        settings: [
          { type: 'checkbox' as const, label: 'Modo desenvolvedor', value: false },
          { type: 'checkbox' as const, label: 'Logs detalhados', value: false },
        ]
      },
    ]
  },
  {
    category: "Sobre",
    items: [
      {
        icon: <Info size={16} />,
        label: "Informações",
        description: "Versão e créditos",
        settings: [
          { type: 'text' as const, label: 'Versão', value: '1.0.0' },
          { type: 'text' as const, label: 'Desenvolvido por', value: 'Nova Team' },
          { type: 'link' as const, label: 'Verificar atualizações', value: '#' },
        ]
      },
    ]
  }
]

export default function Settings() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSections = settingsSections.map(section => ({
    ...section,
    items: section.items.filter(item => 
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.settings.some(setting => setting.label.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  })).filter(section => section.items.length > 0)

  const renderSetting = (setting: Setting) => {
    switch (setting.type) {
      case 'checkbox':
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={setting.value}
              onChange={() => {}}
              className="rounded border-white/20 bg-white/5 text-blue-400 focus:ring-0 focus:ring-offset-0"
            />
            <span className="text-xs">{setting.label}</span>
          </label>
        )
      case 'shortcut':
        return (
          <div className="flex items-center justify-between">
            <span className="text-xs">{setting.label}</span>
            <kbd className="px-2 py-0.5 text-[10px] font-mono bg-white/5 rounded">
              {setting.value}
            </kbd>
          </div>
        )
      case 'select':
        return (
          <div className="flex items-center justify-between">
            <span className="text-xs">{setting.label}</span>
            <select 
              value={setting.value}
              onChange={() => {}}
              className="text-xs bg-white/5 border border-white/10 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-white/20"
            >
              {setting.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )
      case 'text':
        return (
          <div className="flex items-center justify-between">
            <span className="text-xs">{setting.label}</span>
            <span className="text-xs text-gray-400">{setting.value}</span>
          </div>
        )
      case 'link':
        return (
          <a 
            href={setting.value}
            className="text-xs text-blue-400 hover:underline"
          >
            {setting.label}
          </a>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar configurações..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/20"
        />
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {filteredSections.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-medium mb-4">{section.category}</h2>
            <div className="space-y-4">
              {section.items.map((item) => (
                <div
                  key={item.label}
                  className="bg-white/5 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedSection(
                      expandedSection === item.label ? null : item.label
                    )}
                    className="w-full p-4 flex items-center justify-between hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-white/5 text-blue-400">
                        {item.icon}
                      </div>
                      <div className="text-left">
                        <h3 className="font-medium">{item.label}</h3>
                        <p className="text-sm text-gray-400">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transform transition-transform ${
                        expandedSection === item.label ? 'rotate-90' : ''
                      }`}
                    />
                  </button>
                  
                  {expandedSection === item.label && (
                    <div className="p-4 border-t border-white/10 space-y-4">
                      {item.settings.map((setting, index) => (
                        <div key={index} className="flex items-center gap-4">
                          {renderSetting(setting)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 