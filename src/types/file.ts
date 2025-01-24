export type FileType = 'file' | 'directory'

export interface FileItem {
  name: string
  type: FileType
  size: number
  modified: Date
  created: Date
  accessed: Date
  permissions: string
  path: string
  extension?: string
}

export interface FileStats {
  totalSize: number
  totalFiles: number
  totalDirs: number
} 