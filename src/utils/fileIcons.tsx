import React from 'react'
import { 
  Image as ImageIcon,
  FileText,
  FileCode,
  FileMusic,
  FileVideo,
  Package,
  Archive,
  FileCog,
  FileSpreadsheet,
  FileSliders,
  Download,
  ExternalLink
} from 'lucide-react'

export const fileIcons: Record<string, JSX.Element> = {
  // Imagens
  png: <ImageIcon size={16} className="text-green-400" />,
  jpg: <ImageIcon size={16} className="text-green-400" />,
  jpeg: <ImageIcon size={16} className="text-green-400" />,
  gif: <ImageIcon size={16} className="text-green-400" />,
  webp: <ImageIcon size={16} className="text-green-400" />,
  svg: <ImageIcon size={16} className="text-green-400" />,
  ico: <ImageIcon size={16} className="text-green-400" />,
  bmp: <ImageIcon size={16} className="text-green-400" />,
  tiff: <ImageIcon size={16} className="text-green-400" />,
  
  // Documentos
  txt: <FileText size={16} className="text-blue-400" />,
  md: <FileText size={16} className="text-blue-400" />,
  pdf: <FileText size={16} className="text-red-400" />,
  doc: <FileText size={16} className="text-blue-400" />,
  docx: <FileText size={16} className="text-blue-400" />,
  rtf: <FileText size={16} className="text-blue-400" />,
  odt: <FileText size={16} className="text-blue-400" />,
  
  // Planilhas
  xls: <FileSpreadsheet size={16} className="text-green-600" />,
  xlsx: <FileSpreadsheet size={16} className="text-green-600" />,
  csv: <FileSpreadsheet size={16} className="text-green-600" />,
  ods: <FileSpreadsheet size={16} className="text-green-600" />,
  
  // Apresentações
  ppt: <FileSliders size={16} className="text-orange-400" />,
  pptx: <FileSliders size={16} className="text-orange-400" />,
  odp: <FileSliders size={16} className="text-orange-400" />,
  
  // Código
  js: <FileCode size={16} className="text-yellow-400" />,
  ts: <FileCode size={16} className="text-blue-400" />,
  jsx: <FileCode size={16} className="text-blue-400" />,
  tsx: <FileCode size={16} className="text-blue-400" />,
  html: <FileCode size={16} className="text-orange-400" />,
  css: <FileCode size={16} className="text-blue-400" />,
  json: <FileCode size={16} className="text-yellow-400" />,
  py: <FileCode size={16} className="text-blue-500" />,
  java: <FileCode size={16} className="text-red-400" />,
  cpp: <FileCode size={16} className="text-blue-600" />,
  c: <FileCode size={16} className="text-blue-600" />,
  rs: <FileCode size={16} className="text-orange-600" />,
  go: <FileCode size={16} className="text-blue-400" />,
  php: <FileCode size={16} className="text-purple-400" />,
  rb: <FileCode size={16} className="text-red-500" />,
  
  // Áudio
  mp3: <FileMusic size={16} className="text-purple-400" />,
  wav: <FileMusic size={16} className="text-purple-400" />,
  ogg: <FileMusic size={16} className="text-purple-400" />,
  flac: <FileMusic size={16} className="text-purple-400" />,
  m4a: <FileMusic size={16} className="text-purple-400" />,
  aac: <FileMusic size={16} className="text-purple-400" />,
  
  // Vídeo
  mp4: <FileVideo size={16} className="text-pink-400" />,
  webm: <FileVideo size={16} className="text-pink-400" />,
  mkv: <FileVideo size={16} className="text-pink-400" />,
  avi: <FileVideo size={16} className="text-pink-400" />,
  mov: <FileVideo size={16} className="text-pink-400" />,
  wmv: <FileVideo size={16} className="text-pink-400" />,
  flv: <FileVideo size={16} className="text-pink-400" />,
  
  // Compactados
  zip: <Archive size={16} className="text-yellow-400" />,
  rar: <Archive size={16} className="text-yellow-400" />,
  '7z': <Archive size={16} className="text-yellow-400" />,
  tar: <Archive size={16} className="text-yellow-400" />,
  gz: <Archive size={16} className="text-yellow-400" />,
  bz2: <Archive size={16} className="text-yellow-400" />,
  xz: <Archive size={16} className="text-yellow-400" />,
  
  // Executáveis
  exe: <Package size={16} className="text-purple-400" />,
  msi: <Package size={16} className="text-purple-400" />,
  app: <Package size={16} className="text-purple-400" />,
  deb: <Package size={16} className="text-red-400" />,
  rpm: <Package size={16} className="text-red-400" />,
  apk: <Package size={16} className="text-green-400" />,
  dmg: <Package size={16} className="text-gray-400" />,
  
  // Configuração
  ini: <FileCog size={16} className="text-gray-400" />,
  conf: <FileCog size={16} className="text-gray-400" />,
  config: <FileCog size={16} className="text-gray-400" />,
  yml: <FileCog size={16} className="text-gray-400" />,
  yaml: <FileCog size={16} className="text-gray-400" />,
  xml: <FileCog size={16} className="text-gray-400" />,
  toml: <FileCog size={16} className="text-gray-400" />,
  
  // Outros
  iso: <Archive size={16} className="text-purple-600" />,
  img: <Archive size={16} className="text-purple-600" />,
  torrent: <Download size={16} className="text-green-500" />,
  lnk: <ExternalLink size={16} className="text-blue-400" />,
  url: <ExternalLink size={16} className="text-blue-400" />,
  desktop: <ExternalLink size={16} className="text-blue-400" />,
} 