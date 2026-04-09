# Repository Guidelines

## Project Structure

A Node.js/Express app for finding coworking-friendly cafes worldwide.

```
data/              # City and place data (Markdown + YAML frontmatter)
  <city>/
    index.md       # City metadata
    <place>.md     # Individual place details
images/            # Place photos
  <city>/<place>/*.jpg
views/             # Pug templates
locales/           # i18n translation files
public/            # Static assets
scripts/           # Utility scripts
test/              # Schema validation tests
```

## Development Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Run dev server with nodemon (port 3000) |
| `npm test` | Validate all data against JSON schema |
| `npm run resize` | Resize images to 1200px max width |
| `npm run links` | Check for broken links (server must be running) |

## Coding Style

- **ES Modules**: All files use `import/export` (see `"type": "module"` in `package.json`)
- **Indentation**: 2 spaces
- **Linting**: No explicit linter configured—maintain consistent style with existing code
- **Filenames**: Lowercase with hyphens (e.g., `data-helpers.js`)

## Testing Guidelines

- Schema validation via `test/index.js` using AJV
- Run `npm test` before committing to ensure data integrity
- Tests validate city/place structure, required fields, and timezone correctness

## Commit & Pull Request Guidelines

### Commit Messages
- Use imperative mood: "Add", "Fix", "Update", "Remove"
- Keep summaries under 50 characters
- Examples from history: `Add Intelligentsia`, `Fix img name`, `Updating places`

### Pull Requests
- Include clear description of changes
- Add photos for new places (resized via `npm run resize`)
- Ensure `npm test` passes before submitting
- Reference related issues if applicable

## Agent-Specific Instructions

When editing data files:
- Preserve YAML frontmatter structure exactly
- Use `YY-MM-DD` date format for `added`/`updated` fields
- Coordinates format: `lat,lng` (decimal)
- Image references in frontmatter must match actual filenames in `images/`

When adding new cities:
- Follow template in `CITY.md`
- Timezone must be valid IANA identifier (e.g., `Asia/Tokyo`)
- `id` must match directory name
