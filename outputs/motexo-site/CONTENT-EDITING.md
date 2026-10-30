# Editing the website

Edit **[content.json](./content.json)**. It is the single source for website copy, service/work content, contact details, form labels/messages, accessibility labels and each page's search title/description. Layout, routes, animation timings and the 3D scene stay in code.

## On GitHub

1. Open `outputs/motexo-site/content.json` and click the pencil.
2. Change the text values, preserving keys, quotes and commas.
3. Commit to `main`. Vercel automatically validates and builds it; a successful deployment replaces the live site. A failed build leaves the previous working deployment live.
4. Check https://motexo-technical.vercel.app/ after the deployment is Ready. For review first, propose a branch/pull request instead of committing straight to `main`.

Public repositories support collaboration on Vercel Hobby. If the repository is made private, commits from another author may be blocked by Vercel's author-access rule. The owner can publish approved edits in that case. Making a repository public reveals all tracked source and assets. The editor still needs GitHub collaborator/write access to commit directly. No account sharing is needed. See [Vercel collaboration rules](https://vercel.com/docs/deployments/troubleshoot-project-collaboration).

A single content file is an editing convention: repository write access also permits edits to other files. This change does not invite collaborators, restrict their permissions or change repository visibility.

## Where things are

| Group | What it controls |
| --- | --- |
| `business` | Name, displayed phone, WhatsApp destination, Instagram, address |
| `meta` | Search title and description for all four pages |
| `common`, `navigation`, `footer`, `banner` | Shared labels and contact callouts |
| `story.chapters` | Chapter names, two-line hero headings, descriptions and service-link text |
| `story` | Switch labels, loading copy, chapter controls and venue annotations |
| `expertise`, `services` | Service chooser and five service descriptions, topics, image filenames/alt text/source links |
| `gallery` | Heading, filters, captions and work entries |
| `approach` | Process steps and FAQ entries |
| `pages` | Expertise/work page introductions |
| `contact` | Form text, space options, validation errors, review and WhatsApp draft labels |
| `fallback` | Text shown when JavaScript is disabled |

## Editing rules

- Use plain text, not HTML. Write `\n` inside a string for a line break in headings and multiline copy. For story headings keep exactly two strings in `title`.
- Keep the five service keys (`electrical`, `networking`, `automation`, `spaces`, `events`) and the five chapter keys (`spark`, `power`, `connect`, `space`, `event`). They connect to routes, icons and scenes.
- Work entries need a unique `id`. `category` must be `infrastructure`, `spaces` or `events`. You can add/reorder work entries; the first two appear on the homepage.
- Keep placeholders such as `{service}`, `{title}`, `{count}` and `{number}` unchanged. The website fills these in.
- `business.whatsappNumber` uses country code and digits only; the displayed `phone` must contain the same digits. Both telephone and WhatsApp links use it.
- Existing image filenames can be selected in this file. New photos must also be uploaded to `public/assets/` with accurate dimensions, alt text (services), and original source links. Source photographs and generated illustrations must remain accurately described.
- External links use full `https://` URLs. Text is escaped; scripts/HTML will not run.
- JSON uses double quotes, no comments and no trailing commas. `content.schema.json` provides editor hints; leave that file to developers.
- This is an English content dictionary, ready to reorganize for translations later. It does not add another language or language selector.

## Check locally

```sh
npm run content:check
npm test
npm run build
```

The production build checks required fields, schema/types, contact numbers, template placeholders, work IDs/categories and local asset filenames before publishing. Long copy can still affect wrapping: check desktop and mobile after significant changes.
