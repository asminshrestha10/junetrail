# Add a Guide

This guide explains how to add a guide article.

## STEP 1: Open the correct JSON file

Open:

- /data/guides.json

This file stores all guide entries.

## STEP 2: Copy the template

Open:

- /templates/guide-template.json

Copy the full object and paste it into /data/guides.json before the final `]`.

## STEP 3: Where to paste the new item

This file is a JSON array of guide objects.

Paste the new object:

- before the last `]`
- after the last guide entry
- with a comma between entries

## STEP 4: Understand every important field

```json
{
  "id": "guide-006",
  "title": "Your Guide Title",
  "slug": "your-guide-title",
  "category": "Guides",
  "seoTitle": "Your Guide Title | JUNE TRAIL",
  "metaDescription": "Short SEO summary for this guide.",
  "excerpt": "Short summary shown on guide cards.",
  "featuredImage": "images/guides/guide-006.jpg",
  "imageAlt": "Guide image for this article.",
  "date": "2026-09-01",
  "author": "Your Name",
  "content": [
    "Write the first section here.",
    "Write the second section here.",
    "Write the final section here."
  ],
  "tags": ["guide", "4x4", "travel"],
  "featured": false,
  "published": true
}
```

Field meanings:

- `id` = unique guide ID such as `guide-006`
- `title` = guide heading visitors see
- `slug` = URL-friendly version
- `category` = always `"Guides"`
- `seoTitle` = search title
- `metaDescription` = search summary
- `excerpt` = short summary on cards
- `featuredImage` = image path
- `imageAlt` = image accessibility text
- `date` = article date in `YYYY-MM-DD`
- `author` = author name
- `content` = guide body as an array of text sections
- `tags` = keywords
- `featured` = highlight flag
- `published` = `true` means visible; `false` means hidden

## STEP 5: Where to upload the image

Upload the guide image to:

- /images/guides/

## STEP 6: How to add the image path correctly

For example:

```json
"featuredImage": "images/guides/guide-006.jpg"
```

Rules:

- Match the file name exactly
- Match the folder exactly
- Keep the extension right (`.jpg`, `.png`, `.svg`)
- Do not use the wrong path or a missing file

## STEP 7: Add the guide content

Your `content` array can contain several sections that help readers step by step.

Example:

```json
"content": [
  "Start by deciding what type of travel you actually want to do.",
  "Then compare vehicle size, tow ratings and payload needs.",
  "Finally, match the setup to your budget and realistic driving patterns."
]
```

This site expects that array format.

## STEP 8: How to preview/check the content

After editing:

1. Open /data/guides.json
2. Check the new entry sits inside the array
3. Confirm commas and brackets are correct
4. Open the site and navigate to the guides list
5. Ensure the new card and article display correctly

## STEP 9: How to commit and push to GitHub

Run:

```bash
git status
git add .
git commit -m "Add guide"
git push origin main
```

## STEP 10: How to verify the live website

After you push:

1. Open the live site
2. Visit the guides section
3. Confirm the new guide card appears
4. Open the guide page
5. Check the headline, image, and content are correct

## COMPLETE EXAMPLE

```json
{
  "id": "guide-006",
  "title": "A beginner’s guide to planning a safer remote touring trip",
  "slug": "beginner-guide-planning-safer-remote-touring-trip",
  "category": "Guides",
  "seoTitle": "A Beginner's Guide to Planning a Safer Remote Touring Trip | JUNE TRAIL",
  "metaDescription": "A beginner-friendly guide to planning a safer remote touring trip with the right gear, route checks and preparation.",
  "excerpt": "Remote trips become much safer and easier when you plan around your vehicle, route and gear before you leave home.",
  "featuredImage": "images/guides/guide-006.jpg",
  "imageAlt": "A 4x4 vehicle preparing for a remote touring trip with equipment loaded for travel.",
  "date": "2026-09-01",
  "author": "JUNE TRAIL",
  "content": [
    "Before setting off on a remote trail, it helps to plan around the kind of driving you will actually do. A better plan is based on distance, terrain, weather, and how much recovery gear you are realistically carrying.",
    "The next step is to check your vehicle setup. Make sure fuel, spare equipment, charging, and emergency communication are all in place before you leave. Small preparation gaps are often where problems begin.",
    "A safer trip is usually a simpler one: set realistic goals, keep your load well organised and allow enough time for the route. That approach makes the journey calmer and more enjoyable.",
    "Finally, make sure your plan includes a backup and a safe fallback. Remote travel rewards preparation more than speed, and calm planning is often the difference between a good trip and a stressful one."
  ],
  "tags": ["guide", "touring", "remote travel", "safety"],
  "featured": false,
  "published": true
}
```

## Common mistakes

- Missing comma between entries
- Wrong image filename or wrong extension
- Wrong folder such as `images/news/`
- Duplicate `id`
- Duplicate `slug`
- `published` set to `false`
- Invalid JSON caused by broken brackets or trailing commas

If the JSON file highlights errors, it usually means one small formatting mistake is breaking the whole file.
