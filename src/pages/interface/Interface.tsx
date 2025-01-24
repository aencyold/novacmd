import { useState, useEffect } from 'react'
import { Sun, Moon, Palette, Type, Maximize, Minimize } from 'lucide-react'

const themeColors = [
  { name: 'Azul', value: 'blue-400' },
  { name: 'Verde', value: 'emerald-400' },
  { name: 'Roxo', value: 'violet-400' },
  { name: 'Rosa', value: 'pink-400' },
  { name: 'Laranja', value: 'orange-400' },
]

const fontSizes = [
  { name: 'Pequeno', value: 'sm' },
  { name: 'Médio', value: 'base' },
  { name: 'Grande', value: 'lg' },
]

export default function Interface() {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [accentColor, setAccentColor] = useState('blue-400')
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base')
  const [compact, setCompact] = useState(true)

  // Aplica as mudanças visuais
  useEffect(() => {
    // Tema
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)

    // Cor de destaque
    document.documentElement.style.setProperty('--accent-color', `var(--${accentColor})`)

    // Tamanho da fonte
    document.documentElement.style.fontSize = {
      sm: '14px',
      base: '16px',
      lg: '18px'
    }[fontSize]

    // Densidade
    document.documentElement.style.setProperty('--spacing', compact ? '0.5rem' : '1rem')
  }, [theme, accentColor, fontSize, compact])

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold">Personalização</h1>
        <p className="text-sm text-gray-400">Customize a aparência do Nova Commander</p>
      </div>

      <div className="space-y-6">
        {/* Theme Switcher */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium">Tema</h2>
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-md
                  ${theme === 'light' 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:bg-white/5'
                  }
                `}
              >
                <Sun size={16} />
                <span className="text-xs">Claro</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-md
                  ${theme === 'dark' 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:bg-white/5'
                  }
                `}
              >
                <Moon size={16} />
                <span className="text-xs">Escuro</span>
              </button>
            </div>
          </div>
        </div>

        {/* Accent Color */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium flex items-center gap-2">
            <Palette size={16} />
            Cor de Destaque
          </h2>
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="grid grid-cols-5 gap-2">
              {themeColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={`p-3 rounded-md flex flex-col items-center gap-2
                    ${accentColor === color.value 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:bg-white/5'
                    }
                  `}
                >
                  <div className={`w-4 h-4 rounded-full bg-${color.value}`} />
                  <span className="text-xs">{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Font Size */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium flex items-center gap-2">
            <Type size={16} />
            Tamanho da Fonte
          </h2>
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-2">
              {fontSizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => setFontSize(size.value as 'sm' | 'base' | 'lg')}
                  className={`p-3 rounded-md text-center
                    ${fontSize === size.value 
                      ? 'bg-white/10 text-white' 
                      : 'text-gray-400 hover:bg-white/5'
                    }
                  `}
                >
                  <span className="text-xs">{size.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Density */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium flex items-center gap-2">
            {compact ? <Minimize size={16} /> : <Maximize size={16} />}
            Densidade
          </h2>
          <div className="bg-black/40 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCompact(true)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-md
                  ${compact 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:bg-white/5'
                  }
                `}
              >
                <Minimize size={16} />
                <span className="text-xs">Compacto</span>
              </button>
              <button
                onClick={() => setCompact(false)}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-md
                  ${!compact 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:bg-white/5'
                  }
                `}
              >
                <Maximize size={16} />
                <span className="text-xs">Confortável</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 