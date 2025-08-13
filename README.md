# NotionPresso CLI

A CLI tool to extract Notion page data and save it locally in JSON format.

## Key Features

- **Automatic Page Discovery**: Extract all accessible pages with `--all` option
- **Individual Page Extraction**: Process specific pages using URL
- **Environment Variable Support**: Auto-read API keys from `.env` file
- **Smart File Naming**: Readable file names based on page titles
- **Image Download**: Automatic download and local storage of page images
- **Bookmark Metadata**: Extended bookmark information extraction
- **Smart Updates**: Selective updates for changed pages only

## Installation

### npm Installation (Coming Soon)

```bash
npm install -g @notionpresso/cli
```

### Local Build

```bash
git clone https://github.com/notionpresso/cli.git
cd cli
npm install
npm run build
```

## Usage

### 1. Environment Setup (Recommended)

Create a `.env` file in your project root with your Notion API token:

```bash
echo "NOTION_API_SECRET=secret_your_internal_integration_secret_here" > .env
```

> 💡 **How to get your API token:**
>
> 1. Go to [Notion Integrations](https://www.notion.so/my-integrations)
> 2. Create a new integration or select existing one
> 3. Copy the "Internal Integration Token" (starts with `secret_`)
> 4. Share your Notion pages with the integration

### 2. Extract All Pages

```bash
npresso --all
```

### 3. Extract Individual Page

```bash
npresso --page <NotionPageURL>

# With direct token specification
npresso --page <NotionPageURL> --auth <YourAPIToken>
```

## Command Options

- `--all`: Automatically find and extract all accessible pages
- `--page <pageUrl>`: Specify a particular page URL or ID
- `--auth <token>`: Notion API token (recommend using `NOTION_API_SECRET` env var)
- `--output-dir <dir>`: JSON file output directory (default: `notion-data`)
- `--image-dir <dir>`: Image file output directory (default: `public/notion-data`)

## Output Structure

### File Structure

```
notion-data/
├── pages.json              ← List of all pages (when using --all)
├── my-blog-post.json       ← Individual page data (title-based filename)
└── about-me.json

public/notion-data/
├── my-blog-post/           ← Per-page image folder
│   ├── image1.png
│   └── image2.jpg
└── about-me/
    └── profile.jpg
```

### pages.json Format

```json
{
  "pages": [
    {
      "id": "page-id",
      "title": "My Blog Post",
      "last_edited_time": "2024-01-01T10:00:00.000Z",
      "fileName": "my-blog-post"
    }
  ]
}
```

## Usage Examples

### Initial Setup

```bash
# 1. Set API key
echo "NOTION_API_SECRET=secret_your_internal_integration_secret_here" > .env

# 2. Extract all pages
npresso --all
```

### Individual Page Processing

```bash
npresso --page https://notion.so/user/My-Page-abc123def456
```

### Custom Directories

```bash
npresso --all --output-dir custom-data --image-dir assets/images
```

## Key Improvements

- ✅ **Automatic Page Discovery**: No manual URL input needed with Search API
- ✅ **Readable File Names**: Title-based filenames instead of IDs
- ✅ **Environment Variable Support**: No need to input token every time
- ✅ **Image Download**: Complete offline backup
- ✅ **Incremental Updates**: Fast sync by processing only changed pages
- ✅ **Page List Generation**: `pages.json` for frontend integration

## Limitations

- Notion API Search functionality may not discover all pages
- Pages must be shared with the integration to be accessible
- Processing large numbers of pages may take time

## Contributing

Contributions are welcome! Please see the [Contributing Guide](./CONTRIBUTING.md) for details.

## License

MIT License
