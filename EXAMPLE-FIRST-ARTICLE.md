# Example: How to Add Your First JuneTrail News Article

This is the simplest way to start.

## Step 1: Open the news data file

Go to:

`/data/news.json`

## Step 2: Copy the template

Open:

`/templates/news-template.json`

Copy the whole object.

## Step 3: Paste it into the list in /data/news.json

Add it at the end of the array, before the closing `]`.

Example:

```json
{
  "id": "news-006",
  "title": "Australia's remote touring crowd is changing 4x4 setups",
  "slug": "australias-remote-touring-crowd-is-changing-4x4-setups",
  "category": "News",
  "seoTitle": "Australia's remote touring crowd is changing 4x4 setups | JUNE TRAIL",
  "metaDescription": "How remote touring is changing 4x4 gear choices across Australia.",
  "excerpt": "A quieter shift is happening in the market as touring buyers prioritise capability over style.",
  "featuredImage": "images/news/news-006.jpg",
  "imageAlt": "A 4x4 vehicle setup in a remote touring scene.",
  "date": "2026-09-01",
  "author": "Your Name",
  "readTime": "4 min read",
  "content": [
    "Remote touring is growing across Australia and buyers are changing the way they build their vehicles.",
    "More drivers are choosing practical gear such as recovery tools, storage solutions and power systems that make long trips easier.",
    "This trend is changing the market for both new vehicles and aftermarket accessories."
  ],
  "tags": ["touring", "buyers", "travel"],
  "featured": false,
  "published": true
}
```

## Step 4: Save the file

Save `/data/news.json`.

## Step 5: Upload your image

Place the image here:

`/images/news/news-006.jpg`

Use a JPG or PNG file.

## Step 6: Commit and push to GitHub

In GitHub Desktop or VS Code:

1. Save your changes
2. Click Commit
3. Click Push
4. GitHub Pages updates the site

## Step 7: Check the website

Open:

`https://asminshrestha10.github.io/junetrail/`

Your new article should appear in the News section automatically.

## Important

- If it does not appear, check that `published` is `true`
- If it still does not appear, check the image file name matches `featuredImage`
- If the site does not update, push again and wait a few minutes
