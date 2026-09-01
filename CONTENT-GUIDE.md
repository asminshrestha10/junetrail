# JuneTrail Content Guide

This project is designed to be simple. You do not need to create a new HTML file for every article.

Instead, you add your content to a JSON file in the `/data` folder. The website reads those files and shows the content automatically.

## 1) How to add a new news article

Open the file:

`/data/news.json`

Add a new object at the end of the list. Example:

```json
{
  "id": "news-006",
  "title": "My New News Story",
  "slug": "my-new-news-story",
  "category": "News",
  "excerpt": "Short summary of the story.",
  "featuredImage": "images/news/news-006.jpg",
  "date": "2026-09-01",
  "author": "Your Name",
  "readTime": "4 min read",
  "content": [
    "Paragraph one.",
    "Paragraph two."
  ],
  "tags": ["news", "travel"],
  "featured": false,
  "published": true
}
```

Then save the file.

## 2) How to add a new vehicle

Open:

`/data/vehicles.json`

Add a vehicle object like this:

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
    "Transmission": "8-speed automatic"
  },
  "featured": false,
  "published": true
}
```

## 3) How to add a new product

Open:

`/data/products.json`

Add a product like this:

```json
{
  "id": "product-006",
  "name": "My Product",
  "slug": "my-product",
  "brand": "Brand Name",
  "category": "Accessories",
  "price": "$199",
  "rating": "4.7",
  "featuredImage": "images/products/product-006.jpg",
  "description": "Short summary of the product.",
  "pros": ["Good value", "Reliable"],
  "cons": ["Only if needed"],
  "engineeringOpinion": "This is useful for touring setups.",
  "amazonUrl": "https://www.amazon.com/gp/search/?keywords=my%20product",
  "affiliateDisclosure": "Affiliate disclosure: this placeholder Amazon link will be replaced later.",
  "featured": false,
  "published": true
}
```

## 4) How to add a new guide

Open:

`/data/guides.json`

Add an object like this:

```json
{
  "id": "guide-006",
  "title": "My Guide Title",
  "slug": "my-guide-title",
  "category": "Guides",
  "excerpt": "Short summary of the guide.",
  "featuredImage": "images/guides/guide-006.jpg",
  "date": "2026-09-01",
  "content": [
    "Paragraph one.",
    "Paragraph two."
  ],
  "featured": false,
  "published": true
}
```

## 5) How to add an engineering article

Open:

`/data/engineering.json`

Add an object like this:

```json
{
  "id": "engineering-004",
  "title": "My Engineering Article",
  "slug": "my-engineering-article",
  "category": "Engineering",
  "excerpt": "Short summary.",
  "featuredImage": "images/engineering/engineering-004.jpg",
  "date": "2026-09-01",
  "content": [
    "Paragraph one.",
    "Paragraph two."
  ],
  "engineeringDetails": {
    "Focus": "Vehicle setup",
    "Why It Matters": "Better real-world performance"
  },
  "featured": false,
  "published": true
}
```

## 6) Where to put images

Put your images in these folders:

- `/images/news/`
- `/images/vehicles/`
- `/images/products/`
- `/images/guides/`
- `/images/engineering/`

Use matching file names to the values in your JSON. Example:

`images/news/news-006.jpg`

If you do not have a file yet, the site will still load the page with a placeholder image or a blank-safe fallback.

## 7) How to change an existing article

Open the relevant JSON file and find the item by its `id` or `slug`.

Then change the text or values you want.

Example:

- change the title
- change the author
- change the excerpt
- change the content paragraphs
- change the tags

Save the file and the website will update automatically when the page is refreshed.

## 8) How to remove an article

Find the item in the correct JSON file and delete that object from the array.

Then save the file.

If you want to hide an item without deleting it, set:

```json
"published": false
```

## 9) How to publish changes through GitHub

1. Open your project in GitHub Desktop or VS Code.
2. Save your changes.
3. Commit the changes.
4. Push to GitHub.
5. GitHub Pages will publish the updated site automatically.

## Example first article

If you want your first real piece, start with a news article.

Open `/data/news.json` and add one object at the end. Then create a matching image file in `/images/news/`.

That is the easiest way to start.

## Important note

This project is still a simple static website. It is not a full CMS yet. But it is beginner-friendly and easy to maintain.
