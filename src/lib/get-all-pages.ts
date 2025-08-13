import { Client } from '@cozy-blog/notion-client';
import { fetchAndSavePageData } from './dump-page';
import type { PageInfo } from './types';
import { createPageInfo } from './page-utils';
import { loadExistingPagesData, savePagesData, getPagesToUpdate } from './file-manager';

export async function getAllPages(
  client: Client,
  outputDir: string,
  imageDir: string
): Promise<void> {
  const pages = await searchAllPages(client);

  if (pages.length === 0) {
    console.log('ℹ️  No pages to sync');
    return;
  }

  const existingPagesData = loadExistingPagesData(outputDir);
  const pagesToUpdate = getPagesToUpdate(pages, existingPagesData, outputDir);

  savePagesData(pages, outputDir);

  if (pagesToUpdate.length === 0) {
    console.log('✅ All pages are up to date');
    return;
  }

  console.log(`📥 Syncing ${pagesToUpdate.length}/${pages.length} pages...`);

  await processPages(pagesToUpdate, client, outputDir, imageDir);

  console.log('✅ Sync completed!');
}

async function searchAllPages(client: Client): Promise<PageInfo[]> {
  try {
    const searchResponse = await client.search({
      filter: {
        value: 'page',
        property: 'object',
      },
    });

    if (!searchResponse.results || searchResponse.results.length === 0) {
      return [];
    }

    const pages: PageInfo[] = searchResponse.results
      .filter((result: any) => result.object === 'page')
      .map((page: any) => createPageInfo(page));

    console.log(`✅ Found ${pages.length} pages`);
    return pages;
  } catch (error) {
    console.error('❌ Error searching pages:', error);
    throw error;
  }
}

async function processPages(
  pages: PageInfo[],
  client: Client,
  outputDir: string,
  imageDir: string
): Promise<void> {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    console.log(`[${i + 1}/${pages.length}] Processing: ${page.title}`);

    try {
      await fetchAndSavePageData({
        client,
        pageId: page.id,
        outputDir: outputDir,
        imageOutDir: imageDir,
        fileName: page.fileName,
      });
    } catch (error) {
      console.error(`❌ Failed: ${page.title}`, String(error));
    }
  }
}
