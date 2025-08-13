import { Client } from '@cozy-blog/notion-client';
import * as fs from 'fs';
import * as path from 'path';
import { updateImageOnBlocks } from './download-image';
import { getPageTitle, sanitizeFileName } from './page-utils';

export async function fetchAndSavePageData({
  client,
  pageId,
  outputDir,
  imageOutDir,
  fileName,
  checkExisting = false,
}: {
  client: Client;
  pageId: string;
  outputDir: string;
  imageOutDir: string;
  fileName?: string;
  checkExisting?: boolean;
}): Promise<{ title: string; skipped: boolean }> {
  const fullPage = await client.fetchFullPage(pageId);
  const title = getPageTitle(fullPage);
  const finalFileName = fileName || sanitizeFileName(title, pageId);

  const outputFile = path.join(outputDir, `${finalFileName}.json`);
  const finalImageOutDir = path.join(imageOutDir, finalFileName);

  if (checkExisting && fs.existsSync(outputFile)) {
    return { title, skipped: true };
  }

  fs.mkdirSync(finalImageOutDir, { recursive: true });

  await updateImageOnBlocks({
    blocks: fullPage.blocks,
    imageDir: finalImageOutDir,
    pageId,
  });

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(fullPage, null, 2), 'utf-8');

  return { title, skipped: false };
}
