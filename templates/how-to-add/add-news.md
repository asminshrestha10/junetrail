# Add a News Item

This guide is for beginners. If you can copy text, change a few words, and save a file, you can do this.

Important: do not change the website structure or edit old published content. Only add a new item to the JSON file.

## STEP 1: Open the correct JSON file

Open:

- /data/news.json

This is the file that stores all news entries.

## STEP 2: Copy the template

Open this template file:

- /templates/news-template.json

Copy the whole object and paste it into the end of /data/news.json.

You should place the new item before the closing square bracket `]` at the end of the file.

## STEP 3: Where to paste the new item

In /data/news.json, you will see:

- a `[` at the start
- many objects between them
- a final `]` at the end

Paste your new item before the last `]`.

Do not paste it:

- before the first `[`
- in the middle of another object
- after the last `]`

If you paste in the wrong place, the JSON will break.

## STEP 4: Understand every important field

This is the basic News item shape:

```json
{
  "id": "news-007",
  "title": "Your News Title",
  "slug": "your-news-title",
  "category": "News",
  "seoTitle": "Your News Title | JUNE TRAIL",
  "metaDescription": "Short SEO summary for this article.",
  "excerpt": "Short summary shown on the homepage and article cards.",
  "featuredImage": "images/news/news-007.jpg",
  "imageAlt": "Description of the news image for accessibility and SEO.",
  "date": "2026-09-01",
  "author": "Your Name",
  "readTime": "4 min read",
  "content": [
    "Write your first paragraph here.",
    "Write your second paragraph here.",
    "Write your third paragraph here."
  ],
  "tags": ["news", "travel", "australia"],
  "featured": false,
  "published": true
}
```

Simple explanations:

- `id` = unique identifier. Example: `news-007`
  - Must be different from every other item.
  - Never duplicate an ID.
- `title` = the headline visitors see.
- `slug` = the URL-friendly version of the title.
  - Use lowercase letters
  - use hyphens instead of spaces
  - example: `your-news-title`
- `category` = always `"News"`
- `seoTitle` = title used by search engines and browser tab.
- `metaDescription` = short summary for search listings.
- `excerpt` = short summary shown on cards and list pages.
- `featuredImage` = image path used by the site.
- `imageAlt` = text for accessibility and SEO.
- `date` = article date in `YYYY-MM-DD` format.
- `author` = author name.
- `readTime` = readable time like `4 min read`.
- `content` = array of paragraphs.
  - Keep each paragraph as a separate string inside the square brackets.
- `tags` = keywords for filtering and SEO.
- `featured` = `true` means important item; `false` means normal item.
- `published` = `true` means visible live; `false` means hidden.

## STEP 5: Where to upload the image

Upload the image to:

- /images/news/

The image must be placed in the correct folder for the content type.

For News, use:

- /images/news/

## STEP 6: How to add the image path correctly

After uploading the image, make sure the path matches the file name exactly.

Example:

- file saved as: `news-007.jpg`
- folder: `/images/news/`
- correct path: `images/news/news-007.jpg`

Important:

- Do not add the full local computer path.
- Do not use uppercase letters unless the file name has uppercase letters.
- Make sure the file extension matches exactly: `.jpg`, `.jpeg`, `.png`, or `.svg`
- The path in JSON must match the actual file name and folder.

Example:

```json
"featuredImage": "images/news/news-007.jpg"
```

## STEP 7: Add the article content

Inside `content`, add each paragraph like this:

```json
"content": [
  "First paragraph goes here.",
  "Second paragraph goes here.",
  "Third paragraph goes here."
]
```

Keep it readable. One paragraph per sentence block is best.

## STEP 8: How to preview/check the content

After editing the file:

1. Open the JSON file in VS Code.
2. Check that every object has a comma between entries.
3. Confirm the final item ends before the final `]`.
4. Open the site locally in your browser.
5. Check that the new news item appears in the list.
6. Open the article page and confirm the headline, image, and content show correctly.

## STEP 9: How to commit and push to GitHub

In the terminal, run:

```bash
git status
git add .
git commit -m "Add news article"
git push origin main
```

If Git asks for your username or token, enter them.

## STEP 10: How to verify the live website

After pushing:

1. Wait a few minutes for the site to update.
2. Open the live website.
3. Check the news page and article page.
4. Confirm the headline, image, summary, and article content are correct.
5. Confirm the URL slug is correct and matches the article.

## COMPLETE EXAMPLE

```json
{
  "id": "news-007",
  "title": "New 4x4 touring gear is making remote travel easier for families",
  "slug": "new-4x4-touring-gear-making-remote-travel-easier-for-families",
  "category": "News",
  "seoTitle": "New 4x4 Touring Gear Is Making Remote Travel Easier for Families | JUNE TRAIL",
  "metaDescription": "Family-friendly 4x4 touring gear is making remote travel easier, safer and more comfortable for Australian road trippers.",
  "excerpt": "A growing range of practical touring accessories is helping families travel farther with more comfort and less stress.",
  "featuredImage": "images/news/news-007.jpg",
  "imageAlt": "A family preparing for a 4x4 touring trip with accessories loaded in the vehicle.",
  "date": "2026-09-01",
  "author": "JUNE TRAIL",
  "readTime": "5 min read",
  "content": [
    "A growing number of 4x4 owners are switching to practical touring accessories that improve comfort without adding unnecessary complexity. Families especially value gear that makes setup easier and keeps everyday travel more organised.",
    "Storage systems, better lighting and simplified power setups are leading the trend. These additions support longer trips and help reduce the stress of remote travel, especially when gear needs to be packed and used quickly.",
    "The biggest shift is not towards luxury items, but towards smarter products that increase confidence on the road. For many buyers, that is the real win."
  ],
  "tags": ["family", "touring", "gear", "4x4"],
  "featured": false,
  "published": true
}
```

## Common mistakes

- Missing comma between items in the JSON array
- Wrong image file name or wrong extension
- Wrong folder such as using `images/blogs/` instead of `images/news/`
- Duplicate `id`
- Duplicate `slug`
- `published` set to `false`
- Invalid JSON caused by a trailing comma or broken brackets

If the file turns red in VS Code, it usually means the JSON is invalid.
