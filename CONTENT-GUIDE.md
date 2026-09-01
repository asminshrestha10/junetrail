# JuneTrail Content Guide

This project is built so you can add content without editing HTML, CSS, or JavaScript.

You only need to:

1. Open one JSON file
2. Copy a template
3. Change the text
4. Add an image
5. Save
6. Push to GitHub

The website reads the JSON files automatically and updates the pages.

---

## A. How to add News

Go to:

`/data/news.json`

Open the file and add a new object at the end of the array.

Example:

```json
{
  "id": "news-006",
  "title": "My First News Article",
  "slug": "my-first-news-article",
  "category": "News",
  "seoTitle": "My First News Article | JUNE TRAIL",
  "metaDescription": "Short summary for search and browsers.",
  "excerpt": "Short summary shown on cards.",
  "featuredImage": "images/news/news-006.jpg",
  "imageAlt": "A photo showing the story subject.",
  "date": "2026-09-01",
  "author": "Your Name",
  "readTime": "4 min read",
  "content": [
    "Paragraph one.",
    "Paragraph two.",
    "Paragraph three."
  ],
  "tags": ["travel", "4x4"],
  "featured": false,
  "published": true
}
```

Then save the file.

---

## B. How to add a Vehicle

Go to:

`/data/vehicles.json`

Use the template in:

`/templates/vehicle-template.json`

Example:

```json
{
  "id": "vehicle-006",
  "name": "My Vehicle",
  "slug": "my-vehicle",
  "brand": "Brand Name",
  "model": "Model Name",
  "year": 2026,
  "price": "$60,000",
  "engine": "2.0L petrol",
  "power": "150 kW",
  "torque": "350 Nm",
  "transmission": "8-speed automatic",
  "drivetrain": "4WD",
  "towingCapacity": "3,000 kg",
  "payload": "800 kg",
  "featuredImage": "images/vehicles/vehicle-006.jpg",
  "gallery": ["images/vehicles/vehicle-006.jpg"],
  "description": "Short summary.",
  "specifications": {
    "Engine": "2.0L petrol",
    "Transmission": "8-speed automatic",
    "Drive": "4WD"
  },
  "featured": false,
  "published": true
}
```

---

## C. How to add a Product

Go to:

`/data/products.json`

Use the product template and fill in:

- product name
- price
- rating
- description
- pros
- cons
- engineering opinion
- amazonUrl
- affiliateDisclosure

Example:

```json
{
  "id": "product-006",
  "name": "My Product",
  "slug": "my-product",
  "brand": "Brand Name",
  "category": "Accessories",
  "price": "$299",
  "rating": "4.8",
  "featuredImage": "images/products/product-006.jpg",
  "description": "Short summary of the product.",
  "pros": ["Good value", "Easy to use"],
  "cons": ["Higher price"],
  "engineeringOpinion": "This product makes sense for touring setups.",
  "amazonUrl": "https://www.amazon.com/gp/search/?keywords=my%20product",
  "affiliateDisclosure": "Affiliate disclosure: this placeholder Amazon link will be replaced later.",
  "featured": false,
  "published": true
}
```

---

## D. How to add a Guide

Go to:

`/data/guides.json`

Add a new guide object with:

- `title`
- `slug`
- `excerpt`
- `featuredImage`
- `date`
- `content`

Example:

```json
{
  "id": "guide-006",
  "title": "How to Plan a Weekend 4x4 Trip",
  "slug": "how-to-plan-a-weekend-4x4-trip",
  "category": "Guides",
  "excerpt": "A simple guide to planning a safer and easier trip.",
  "featuredImage": "images/guides/guide-006.jpg",
  "date": "2026-09-01",
  "content": [
    "Start with your route and the kind of terrain you expect.",
    "Check your tyres, recovery gear and fuel plan.",
    "Prepare for weather, water and communication needs."
  ],
  "featured": false,
  "published": true
}
```

---

## E. How to add an Engineering article

Go to:

`/data/engineering.json`

Add a new engineering article in the same format.

Example:

```json
{
  "id": "engineering-004",
  "title": "Why Suspension Setup Matters More Than Tyre Size",
  "slug": "why-suspension-setup-matters-more-than-tyre-size",
  "category": "Engineering",
  "excerpt": "Bigger tyres are not always the answer.",
  "featuredImage": "images/engineering/engineering-004.jpg",
  "date": "2026-09-01",
  "content": [
    "Suspension setup affects traction and comfort more than many buyers realise.",
    "A well-matched setup improves reliability and real-world performance.",
    "The correct answer is always to match the vehicle to the terrain."
  ],
  "engineeringDetails": {
    "Focus": "Suspension setup",
    "Why It Matters": "Better control and traction"
  },
  "featured": false,
  "published": true
}
```

---

## F. How to add an image

Use these folders:

- `/images/news/`
- `/images/vehicles/`
- `/images/products/`
- `/images/guides/`
- `/images/engineering/`

Recommended image format:

- JPG or PNG

Recommended image size:

- 1200px wide is a good starting point
- Keep the file size reasonable
- Avoid very large files

Where to upload:

- Open the correct image folder in GitHub
- Drag and drop your image there

How to connect it:

Add the relative path in the JSON file.

Example:

```json
"featuredImage": "images/news/news-006.jpg"
```

How to replace an image:

- upload the new image with the same filename
- or update the JSON path to the new filename

How to remove an unused image:

- delete the file from the folder in GitHub
- or leave it there if it is still used somewhere else

---

## G. How to edit content

Open the correct JSON file, find the item, and change the text.

Examples:

- update the title
- rewrite the summary
- change the author
- change the paragraphs
- change the date

Then save the file.

---

## H. How to delete content

There are two simple options:

1. Delete the object from the array in the JSON file
2. Or set the item to hidden with:

```json
"published": false
```

This is easiest if you are unsure.

---

## I. How to feature content on the homepage

Set this field to `true`:

```json
"featured": true
```

This automatically helps the home page show the item in the main featured sections.

Examples:

- News featured item appears as the main featured story
- Vehicle marked featured can appear in the vehicle list
- Product marked featured can appear in the product area
- Guide and engineering items can be made featured if needed

---

## J. How to publish changes

This is the beginner-friendly workflow:

1. Open the relevant JSON file
2. Edit the content
3. Upload the image if needed
4. Save the file
5. Commit in GitHub Desktop or VS Code
6. Push to GitHub
7. Wait a few minutes
8. Refresh the site

Do not edit HTML for normal content updates.

---

## K. How to undo a mistake using GitHub

If you make a mistake:

1. Open the repository on GitHub
2. Go to the file that changed
3. Click History or Commits
4. Select the last good version
5. Restore or edit the file
6. Commit the fix
7. Push again

If you are using GitHub Desktop, you can also undo the last change before committing.

---

## Example: How to Add Your First JuneTrail News Article

Use this exact example:

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

Then upload:

`/images/news/news-006.jpg`

Then push to GitHub.

---

## SEO fields included in the content structure

Each content type is prepared for:

- SEO title
- meta description
- URL slug
- featured image
- alt text
- category
- tags
- author
- publication date

This is simple and future-ready without being complicated.

---

## Amazon affiliate structure

Products can contain:

- product name
- image
- description
- Amazon URL
- affiliate disclosure
- pros
- cons
- engineering opinion

Do not use real affiliate links yet. Use placeholder Amazon URLs only.

These are clearly marked as affiliate placeholders in the JSON.

---

## Important beginner note

This project is still a static GitHub Pages website.

You do not need to edit HTML files for normal article work.

You only edit JSON files and upload images.

That keeps the project simple, safe, and easy to maintain.
