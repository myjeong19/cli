export interface PageInfo {
  id: string;
  title: string;
  last_edited_time: string;
  fileName: string;
}

export interface PagesData {
  pages: PageInfo[];
}

export const FILE_CONSTANTS = {
  INVALID_FILENAME_CHARS: /[<>:"/\\|?*]/g,
  MAX_FILENAME_LENGTH: 50,
  WHITESPACE: /\s+/g,
  MULTIPLE_DASHES: /-+/g,
  LEADING_TRAILING_DASHES: /^-|-$/g,
} as const;

export const LOG_SYMBOLS = {
  START: '🚀',
  SEARCH: '🔍',
  SUCCESS: '✅',
  ERROR: '❌',
  INFO: 'ℹ️',
  SYNC: '📥',
  FILE: '📄',
} as const;
