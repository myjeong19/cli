import * as fs from 'fs';
import * as path from 'path';
import type { PageInfo, PagesData } from './types';

export function loadExistingPagesData(outputDir: string): PagesData | null {
  try {
    const pagesFile = path.join(outputDir, 'pages.json');
    if (!fs.existsSync(pagesFile)) {
      return null;
    }
    const content = fs.readFileSync(pagesFile, 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

export function savePagesData(pages: PageInfo[], outputDir: string): void {
  const pagesData: PagesData = { pages };
  const outputFile = path.join(outputDir, 'pages.json');

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(pagesData, null, 2), 'utf-8');
}

export function getPagesToUpdate(
  newPages: PageInfo[],
  existingData: PagesData | null,
  outputDir: string
): PageInfo[] {
  if (!existingData) {
    return newPages;
  }

  const existingMap = new Map(existingData.pages.map(page => [page.id, page.last_edited_time]));

  return newPages.filter(page => {
    const existingTime = existingMap.get(page.id);
    const jsonFile = path.join(outputDir, `${page.fileName}.json`);

    if (!fs.existsSync(jsonFile)) {
      return true;
    }

    return !existingTime || new Date(page.last_edited_time) > new Date(existingTime);
  });
}
