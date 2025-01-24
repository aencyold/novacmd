export interface Config {
  [key: string]: any;
}

export interface ExplorerConfig {
  viewMode: 'list' | 'grid' | 'details' | 'tiles';
  sortBy: 'name' | 'size' | 'modified';
  sortOrder: 'asc' | 'desc';
  showHidden: boolean;
  filterExtension: string | null;
  sidebarSearch: string;
  showSidebar: boolean;
  controlButtonsPosition: 'top' | 'bottom' | 'path';
  searchPosition: 'top' | 'bottom' | 'home' | 'path';
  rootDisplay: 'full' | 'name' | 'root' | 'windows';
}

const defaultExplorerConfig: ExplorerConfig = {
  viewMode: 'list',
  sortBy: 'name',
  sortOrder: 'asc',
  showHidden: false,
  filterExtension: null,
  sidebarSearch: '',
  showSidebar: true,
  controlButtonsPosition: 'top',
  searchPosition: 'top',
  rootDisplay: 'full'
};

export const loadConfig = (configName: string = 'explorer'): ExplorerConfig => {
  try {
    const configString = localStorage.getItem(configName);
    return configString ? { ...defaultExplorerConfig, ...JSON.parse(configString) } : defaultExplorerConfig;
  } catch (error) {
    console.error(`Erro ao carregar configuração ${configName}:`, error);
    return defaultExplorerConfig;
  }
};

export const saveConfig = (configName: string = 'explorer', config: ExplorerConfig): void => {
  try {
    localStorage.setItem(configName, JSON.stringify(config));
  } catch (error) {
    console.error(`Erro ao salvar configuração ${configName}:`, error);
  }
}; 