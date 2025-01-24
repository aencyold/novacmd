import type { FileItem, FileStats } from '../types/file'

// @ts-ignore
const fs = window.require('fs').promises
// @ts-ignore
const path = window.require('path')
// @ts-ignore
const os = window.require('os')

export async function listDirectory(dirPath: string): Promise<FileItem[]> {
  try {
    const normalizedPath = path.normalize(dirPath.replace('~', os.homedir()))
    await fs.access(normalizedPath, fs.constants.R_OK)
    const entries = await fs.readdir(normalizedPath, { withFileTypes: true })
    const items = await Promise.all(
      entries.map(async (entry: any) => {
        try {
          const fullPath = path.join(normalizedPath, entry.name)
          const stats = await fs.stat(fullPath)
          const mode = stats.mode.toString(8).slice(-3)
          
          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' as const : 'file' as const,
            size: stats.size,
            modified: stats.mtime,
            created: stats.birthtime,
            accessed: stats.atime,
            permissions: mode,
            path: fullPath,
            extension: entry.isFile() ? path.extname(entry.name).slice(1) : undefined
          }
        } catch (error) {
          console.warn(`Erro ao ler arquivo ${entry.name}:`, error)
          return {
            name: entry.name,
            type: entry.isDirectory() ? 'directory' as const : 'file' as const,
            size: 0,
            modified: new Date(),
            created: new Date(),
            accessed: new Date(),
            permissions: '000',
            path: path.join(normalizedPath, entry.name),
            extension: entry.isFile() ? path.extname(entry.name).slice(1) : undefined,
            error: true
          }
        }
      })
    )
    return items.filter(Boolean)
  } catch (error: any) {
    console.error('Erro ao listar diretório:', error)
    if (error.code === 'EACCES') {
      throw new Error('Acesso negado')
    }
    if (error.code === 'ENOENT') {
      throw new Error('Diretório não encontrado')
    }
    throw error
  }
}

export async function createDirectory(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath)
  } catch (error: any) {
    if (error.code === 'EEXIST') {
      throw new Error('Pasta já existe')
    }
    throw error
  }
}

export async function deleteFiles(paths: string[]): Promise<void> {
  await Promise.all(
    paths.map(async (filePath) => {
      try {
        const stats = await fs.stat(filePath)
        if (stats.isDirectory()) {
          await fs.rm(filePath, { recursive: true, force: true })
        } else {
          await fs.unlink(filePath)
        }
      } catch (error) {
        console.error(`Erro ao excluir ${filePath}:`, error)
        throw error
      }
    })
  )
}

export async function copyFiles(files: string[], targetDir: string): Promise<void> {
  await Promise.all(
    files.map(async (sourcePath) => {
      try {
        const stats = await fs.stat(sourcePath)
        const fileName = path.basename(sourcePath)
        const targetPath = path.join(targetDir, fileName)

        if (stats.isDirectory()) {
          await fs.cp(sourcePath, targetPath, { recursive: true })
        } else {
          await fs.copyFile(sourcePath, targetPath)
        }
      } catch (error) {
        console.error(`Erro ao copiar ${sourcePath}:`, error)
        throw error
      }
    })
  )
}

export async function moveFiles(files: string[], targetDir: string): Promise<void> {
  await Promise.all(
    files.map(async (sourcePath) => {
      try {
        const fileName = path.basename(sourcePath)
        const targetPath = path.join(targetDir, fileName)
        await fs.rename(sourcePath, targetPath)
      } catch (error) {
        console.error(`Erro ao mover ${sourcePath}:`, error)
        throw error
      }
    })
  )
}

export async function getDriveInfo(): Promise<{ free: number, total: number }> {
  try {
    // No Linux, vamos pegar informações do diretório raiz
    const stats = await fs.statfs('/')
    return {
      free: stats.bfree * stats.bsize,
      total: stats.blocks * stats.bsize
    }
  } catch (error) {
    console.error('Erro ao obter informações do disco:', error)
    return { free: 0, total: 0 }
  }
}

export async function getDirectoryStats(dirPath: string): Promise<FileStats> {
  try {
    await fs.access(dirPath, fs.constants.R_OK)
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    const stats = entries.reduce(
      (acc: FileStats, entry: any) => {
        if (entry.isDirectory()) acc.totalDirs++
        if (entry.isFile()) acc.totalFiles++
        return acc
      },
      { totalSize: 0, totalFiles: 0, totalDirs: 0 }
    )
    
    const sizes = await Promise.all(
      entries.map(async (entry: any) => {
        try {
          if (entry.isFile()) {
            const fileStat = await fs.stat(path.join(dirPath, entry.name))
            return fileStat.size
          }
          return 0
        } catch (error: any) {
          console.warn(`Erro ao ler tamanho do arquivo ${entry.name}:`, error)
          return 0
        }
      })
    )
    
    stats.totalSize = sizes.reduce((a: number, b: number) => a + b, 0)
    return stats
  } catch (error: any) {
    console.error('Erro ao obter estatísticas do diretório:', error)
    if (error.code === 'EACCES') {
      throw new Error('Acesso negado')
    }
    return { totalSize: 0, totalFiles: 0, totalDirs: 0 }
  }
}

export function getDefaultLocation(): string {
  try {
    return os.homedir()
  } catch (error) {
    console.error('Erro ao obter diretório home:', error)
    return '/'
  }
}

export function getParentDirectory(dirPath: string): string {
  const parent = path.dirname(dirPath)
  return parent === dirPath ? dirPath : parent
}

export async function checkAccess(path: string): Promise<boolean> {
  try {
    await fs.access(path, fs.constants.R_OK)
    return true
  } catch {
    return false
  }
}

export function sanitizePath(filePath: string): string {
  return path.normalize(filePath).replace(/\\/g, '/')
}

export function isPathInside(childPath: string, parentPath: string): boolean {
  const relative = path.relative(parentPath, childPath)
  return Boolean(relative && !relative.startsWith('..') && !path.isAbsolute(relative))
}

export function getSpecialDirectories() {
  const home = os.homedir()
  return {
    home,
    desktop: path.join(home, 'Desktop') || path.join(home, 'Área de Trabalho'),
    documents: path.join(home, 'Documents') || path.join(home, 'Documentos'),
    downloads: path.join(home, 'Downloads'),
    pictures: path.join(home, 'Pictures') || path.join(home, 'Imagens'),
    music: path.join(home, 'Music') || path.join(home, 'Músicas'),
    videos: path.join(home, 'Videos') || path.join(home, 'Vídeos')
  }
} 