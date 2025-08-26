import { FILE_CONSTANTS } from './types';
import type { PageInfo } from './types';

export function getPageTitle(page: any): string {
  if (page.properties?.title?.title?.[0]?.plain_text) {
    return page.properties.title.title[0].plain_text;
  }

  for (const prop of Object.values(page.properties || {})) {
    if ((prop as any)?.type === 'title' && (prop as any)?.title?.[0]?.plain_text) {
      return (prop as any).title[0].plain_text;
    }
  }

  return 'Untitled';
}

export function sanitizeFileName(title: string, fallbackId: string): string {
  const sanitized = title
    .replace(FILE_CONSTANTS.INVALID_FILENAME_CHARS, '-')
    .replace(FILE_CONSTANTS.WHITESPACE, '-')
    .replace(FILE_CONSTANTS.MULTIPLE_DASHES, '-')
    .replace(FILE_CONSTANTS.LEADING_TRAILING_DASHES, '')
    .toLowerCase();

  if (!sanitized) {
    return fallbackId;
  }

  if (sanitized.length > FILE_CONSTANTS.MAX_FILENAME_LENGTH) {
    const truncated = sanitized
      .slice(0, FILE_CONSTANTS.MAX_FILENAME_LENGTH)
      .replace(FILE_CONSTANTS.LEADING_TRAILING_DASHES, '');

    return truncated || fallbackId;
  }

  return sanitized;
}

export function createPageInfo(page: any): PageInfo {
  const title = getPageTitle(page);
  const fileName = sanitizeFileName(title, page.id);

  return {
    id: page.id,
    title,
    last_edited_time: page.last_edited_time,
    fileName,
  };
}
