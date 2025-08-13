#!/usr/bin/env node
import { Command } from 'commander';
import { Client } from '@cozy-blog/notion-client';
import { fetchAndSavePageData } from './dump-page';
import { syncAllPages } from './sync-all-pages';
import dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const program = new Command();

program
  .name('npresso')
  .description('NotionPresso CLI - Export Notion pages to JSON')
  .version('1.0.0')
  .option('--all', 'Get all accessible pages')
  .option('--page <pageUrl>', 'Specific page URL or ID')
  .option('--auth <token>', 'Notion API token (or set NOTION_API_SECRET env var)')
  .option('--output-dir <dir>', 'Output directory for JSON files', 'notion-data')
  .option('--image-dir <dir>', 'Output  directory for images', 'public/notion-data');

program.parse();

const options = program.opts();

async function main() {
  try {
    const apiToken = options.auth || process.env.NOTION_API_SECRET;

    if (!apiToken) {
      console.error('❌ Error: No API token provided.');
      console.error('   Set NOTION_API_SECRET environment variable or use --auth option');
      console.error('   Example: npresso --auth your_api_token');
      process.exit(1);
    }

    const client = new Client({
      auth: apiToken,
    });

    if (options.all) {
      await syncAllPages(client, options.outputDir, options.imageDir);
    } else if (options.page) {
      const pageId = extractPageId(options.page);

      const result = await fetchAndSavePageData({
        client,
        pageId,
        outputDir: options.outputDir,
        imageOutDir: options.imageDir,
        checkExisting: true,
      });

      if (result.skipped) {
        console.log('✅ Page is up to date');
      } else {
        console.log(`📥 Processing: ${result.title}`);
        console.log('✅ Page processing completed!');
      }
    } else {
      console.error('❌ Error: Either --all or --page option is required');
      console.error('   Examples:');
      console.error('   npresso --all');
      console.error('   npresso --page your-page-url');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

function extractPageId(pageUrl: string): string {
  const uuidPattern = /([a-f0-9]{32})/i;
  const match = pageUrl.match(uuidPattern);

  if (match) {
    return match[1];
  }

  const hyphenUuidPattern = /([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i;
  const hyphenMatch = pageUrl.match(hyphenUuidPattern);

  if (hyphenMatch) {
    return hyphenMatch[1].replace(/-/g, '');
  }

  const parts = pageUrl.split('-');
  if (parts.length > 0) {
    const lastPart = parts[parts.length - 1];
    if (/^[a-f0-9]{32}$/i.test(lastPart)) {
      return lastPart;
    }
  }

  return pageUrl;
}

main();
