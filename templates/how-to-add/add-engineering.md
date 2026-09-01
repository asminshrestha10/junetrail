# Add an Engineering Article

This guide explains how to add an engineering article.

## STEP 1: Open the correct JSON file

Open:

- /data/engineering.json

This file stores all engineering content entries.

## STEP 2: Copy the template

Open:

- /templates/engineering-template.json

Copy the entire object and paste it into /data/engineering.json before the final closing bracket.

## STEP 3: Where to paste the new item

The file is a JSON array.

Paste the new item:

- before the last `]`
- after the last engineering object
- with a comma between objects

Do not paste it inside another object.

## STEP 4: Understand every important field

```json
{
  "id": "engineering-004",
  "title": "Your Engineering Article Title",
  "slug": "your-engineering-article-title",
  "category": "Engineering",
  "seoTitle": "Your Engineering Article Title | JUNE TRAIL",
  "metaDescription": "Short SEO summary for this engineering article.",
  "excerpt": "Short summary shown in lists and cards.",
  "featuredImage": "images/engineering/engineering-004.jpg",
  "imageAlt": "Engineering article image.",
  "date": "2026-09-01",
  "author": "Your Name",
  "content": [
    "Explain the concept clearly.",
    "Add a second explanation paragraph.",
    "Add a third paragraph with practical examples."
  ],
  "engineeringDetails": {
    "Focus": "Vehicle setup",
    "Why It Matters": "Better real-world performance"
  },
  "tags": ["engineering", "suspension", "capacity"],
  "featured": false,
  "published": true
}
```

Field explanations:

- `id` = unique engineering ID like `engineering-004`
- `title` = engineering headline seen by visitors
- `slug` = URL-friendly final part of the page address
- `category` = always `"Engineering"`
- `seoTitle` = title shown in search and browser tabs
- `metaDescription` = short SEO summary
- `excerpt` = brief summary used on cards
- `featuredImage` = path to the article image
- `imageAlt` = description of the image for SEO and accessibility
- `date` = date in `YYYY-MM-DD`
- `author` = article author
- `content` = array of text paragraphs for the article
- `engineeringDetails` = object that explains the key focus and why it matters
- `tags` = relevant keywords
- `featured` = highlight status
- `published` = `true` means visible, `false` means hidden

## STEP 5: Where to upload the image

Upload the image to:

- /images/engineering/

This is the folder for engineering content.

## STEP 6: How to add the image path correctly

Use the exact path like this:

```json
"featuredImage": "images/engineering/engineering-004.jpg"
```

Important:

- The file must exist in the folder
- The file name must match exactly
- Use the correct extension
- Do not use a different folder or a broken name

## STEP 7: Add the technical content

Use the `content` array to explain the concept clearly.

Example:

```json
"content": [
  "This system matters because it affects how the vehicle behaves under load.",
  "A simple explanation is that the vehicle needs the right balance between traction, comfort and control.",
  "The real-world result is better behaviour on difficult terrain and safer touring setups."
]
```

Keep the explanation simple and practical.

## STEP 8: How to preview/check the content

After editing:

1. Open /data/engineering.json
2. Confirm your new item is inside the array
3. Check commas, quotes, and brackets
4. Open the engineering section on the site
5. Verify the title, image and article contents display properly

## STEP 9: How to commit and push to GitHub

Run:

```bash
git status
git add .
git commit -m "Add engineering article"
git push origin main
```

## STEP 10: How to verify the live website

After the change is pushed:

1. Open the live website
2. Go to the engineering section
3. Confirm the new entry is visible
4. Open the article page and check the image and content
5. Confirm the URL slug matches the article properly

## COMPLETE EXAMPLE

```json
{
  "id": "engineering-004",
  "title": "Why weight distribution matters more than raw power in touring setups",
  "slug": "why-weight-distribution-matters-more-than-raw-power-in-touring-setups",
  "category": "Engineering",
  "seoTitle": "Why Weight Distribution Matters More Than Raw Power in Touring Setups | JUNE TRAIL",
  "metaDescription": "Weight distribution affects stability, traction and safety in touring setups more than a headline power figure alone.",
  "excerpt": "A well-balanced touring vehicle often behaves better than a heavier, more powerful one with poor load management.",
  "featuredImage": "images/engineering/engineering-004.jpg",
  "imageAlt": "A 4x4 touring setup with weight distributed across the vehicle and cargo area.",
  "date": "2026-09-01",
  "author": "JUNE TRAIL",
  "content": [
    "Weight distribution is one of the biggest factors in how a vehicle behaves, especially when it is loaded for long travel or work use. A high-output engine alone does not guarantee stability or confidence on rough ground.",
    "If the weight sits too far rearward, too far forward, or unevenly across the axle line, the vehicle can become harder to control, less stable in corners and less confident on uneven surfaces. That is why the engineering decision is often about balance rather than raw numbers.",
    "For touring setups, better weight distribution usually improves traction, reduces tyre wear, and creates a calmer ride. In practical terms, the result is a vehicle that feels more predictable and more capable without needing expensive upgrades for the sake of appearance."
  ],
  "engineeringDetails": {
    "Focus": "Load balance and chassis behaviour",
    "Why It Matters": "Better stability, traction and safer touring performance"
  },
  "tags": ["engineering", "weight distribution", "touring", "suspension"],
  "featured": false,
  "published": true
}
```

## Common mistakes

- Missing comma between items or properties
- Wrong image filename or extension
- Wrong folder such as `images/products/` instead of `images/engineering/`
- Duplicate `id`
- Duplicate `slug`
- `published` set to `false`
- Invalid JSON from broken brackets or extra commas

If the file turns red in VS Code, the JSON formatting is usually the issue.
