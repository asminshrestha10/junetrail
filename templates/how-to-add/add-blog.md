# Add a Blog

This guide is for adding a blog article.

## STEP 1: Open the correct JSON file

Open:

- /data/blogs.json

This file stores every blog entry.

## STEP 2: Copy the template

Open:

- /templates/blog-template.json

Copy the whole object and paste it into /data/blogs.json before the closing `]`.

## STEP 3: Where to paste the new item

In /data/blogs.json, the file starts with `[` and ends with `]`.

Paste the new object before the final `]`.

Do not:

- paste inside another object
- place it before the first item
- leave out the comma between objects

## STEP 4: Understand every important field

```json
{
  "id": "blog-002",
  "title": "Your Blog Title",
  "slug": "your-blog-title",
  "category": "Blog",
  "seoTitle": "Your Blog Title | JUNE TRAIL",
  "metaDescription": "Short SEO description for this blog article.",
  "excerpt": "Short summary shown on blog cards.",
  "featuredImage": "images/blogs/blog-002.jpg",
  "imageAlt": "Blog image for this article.",
  "date": "2026-09-01",
  "author": "Your Name",
  "readTime": "5 min read",
  "content": [
    "Write the first paragraph here.",
    "Write the second paragraph here.",
    "Write the final paragraph here."
  ],
  "tags": ["blog", "travel", "4x4"],
  "featured": false,
  "published": true
}
```

Simple meaning of the important fields:

- `id` = unique blog ID, for example `blog-002`
- `title` = the article headline
- `slug` = URL version, lowercase and hyphenated
- `category` = always `"Blog"`
- `seoTitle` = search title
- `metaDescription` = SEO summary
- `excerpt` = short text on cards
- `featuredImage` = image location for the article
- `imageAlt` = image description for accessibility
- `date` = article date in `YYYY-MM-DD`
- `author` = writer name
- `readTime` = estimated reading time
- `content` = article paragraphs
- `tags` = keywords
- `featured` = `true` only for highlight items
- `published` = `true` means live, `false` means hidden

## STEP 5: Where to upload the image

Upload the image to:

- /images/blogs/

For this content type, the folder is specifically:

- /images/blogs/

## STEP 6: How to add the image path correctly

Use the path exactly like this:

```json
"featuredImage": "images/blogs/blog-002.jpg"
```

Correct pattern:

- folder path: `images/blogs/`
- file name: `blog-002.jpg`
- final result: `images/blogs/blog-002.jpg`

Do not use:

- `C:/Users/...`
- a random folder name
- a file that does not exist

## STEP 7: Write the article content

Use the `content` array with one paragraph per item:

```json
"content": [
  "The first section of the blog post goes here.",
  "The second section explains the main point.",
  "The final section gives the takeaway or recommendation."
]
```

This site expects an array of strings.

## STEP 8: How to preview/check the content

After saving:

1. Open /data/blogs.json
2. Make sure every new entry has a comma before the next object
3. Check the article appears in the blog list
4. Open the article page
5. Confirm the title, excerpt, and image display correctly

## STEP 9: How to commit and push to GitHub

Run:

```bash
git status
git add .
git commit -m "Add blog article"
git push origin main
```

## STEP 10: How to verify the live website

After pushing:

1. Open the live site
2. Navigate to the blog section
3. Check that the new article is visible
4. Open the article page and confirm the content loads correctly
5. Check that the URL slug is correct

## COMPLETE EXAMPLE

```json
{
  "id": "blog-002",
  "title": "Why a simpler touring setup is often the better long-term choice",
  "slug": "why-a-simpler-touring-setup-is-often-the-better-long-term-choice",
  "category": "Blog",
  "seoTitle": "Why a Simpler Touring Setup Is Often the Better Long-Term Choice | JUNE TRAIL",
  "metaDescription": "A practical look at how simpler touring setups can be more reliable, more comfortable and easier to live with over time.",
  "excerpt": "The easiest touring setup is rarely the most complicated one; it is the one that does the job without clutter.",
  "featuredImage": "images/blogs/blog-002.jpg",
  "imageAlt": "A well-organised 4x4 touring setup with clean storage and practical accessories.",
  "date": "2026-09-01",
  "author": "JUNE TRAIL",
  "readTime": "6 min read",
  "content": [
    "A simpler touring setup often performs better than a heavily overbuilt one. The reason is straightforward: less complexity usually means fewer failure points, easier maintenance and a calmer travel experience.",
    "When a setup is too crowded with accessories, the vehicle becomes harder to manage and easier to neglect. Storage, power and recovery gear need to work together without creating clutter or confusion.",
    "For most owners, the smarter path is to focus on essentials first and then add gear only when it clearly improves real-world trips. That approach creates a better setup and a more rewarding travel routine."
  ],
  "tags": ["touring", "setup", "simplicity", "4x4"],
  "featured": false,
  "published": true
}
```

## Common mistakes

- Missing comma between objects
- Wrong image filename or extension
- Wrong folder, such as `images/news/` instead of `images/blogs/`
- Duplicate `id`
- Duplicate `slug`
- `published` set to `false`
- Invalid JSON formatting or broken brackets

If the file shows red squiggles in VS Code, the JSON is usually invalid.
