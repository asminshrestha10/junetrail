# Add a Product

This guide explains how to add a product review or product listing.

## STEP 1: Open the correct JSON file

Open:

- /data/products.json

This is the file that stores all product entries.

## STEP 2: Copy the template

Open:

- /templates/product-template.json

Copy the full object and paste it into /data/products.json before the final `]`.

## STEP 3: Where to paste the new item

This file is also a JSON array.

Paste the new item:

- before the closing `]` at the end of the file
- after the last product object
- with a comma between product entries

## STEP 4: Understand every important field

```json
{
  "id": "product-006",
  "name": "Product Name",
  "slug": "product-name",
  "brand": "Brand Name",
  "category": "Accessories",
  "price": "$299",
  "rating": "4.8",
  "retailer": "Retailer TBA",
  "affiliateUrl": "",
  "featuredImage": "images/products/product-006.jpg",
  "imageAlt": "Product image for this review.",
  "description": "Short summary of the product.",
  "pros": ["Good value", "Reliable", "Easy to install"],
  "cons": ["Higher cost", "Requires planning"],
  "engineeringOpinion": "Brief technical opinion about why the product matters.",
  "tags": ["travel", "4x4", "gear"],
  "affiliateDisclosure": "JUNE TRAIL may earn a commission from qualifying purchases made through affiliate links. This does not affect our editorial independence or our product assessment.",
  "featured": false,
  "published": true
}
```

Simple explanations:

- `id` = unique product ID like `product-006`
- `name` = product name shown on the page
- `slug` = URL-friendly name, lowercase and hyphenated
- `brand` = product brand name
- `category` = category like `Recovery`, `Power & Charging`, `Suspension`, etc.
- `price` = product price as text
- `rating` = rating value such as `4.8`
- `retailer` = usually `Retailer TBA` until a real retailer is chosen
- `affiliateUrl` = the affiliate link URL for the product
- `featuredImage` = image path for the product
- `imageAlt` = image description for accessibility and SEO
- `description` = short product summary
- `pros` = list of benefits
- `cons` = list of drawbacks
- `engineeringOpinion` = practical technical opinion
- `tags` = keywords
- `affiliateDisclosure` = notice that affiliate links may earn commission
- `featured` = highlight flag
- `published` = `true` means visible; `false` means hidden

## STEP 5: Where to upload the image

Upload the product image into:

- /images/products/

The image should be named consistently with the product ID.

Example:

- `product-006.jpg`

## STEP 6: How to add the image path correctly

Use the path exactly like this:

```json
"featuredImage": "images/products/product-006.jpg"
```

Important:

- The file must exist in the correct folder
- File name and path must match exactly
- Do not use a wrong folder name
- Do not put a local computer path

## STEP 7: How to add an affiliate URL for Products

This part is very important.

In the current site data, the field used is:

- `affiliateUrl`

Example:

```json
"affiliateUrl": "https://www.amazon.com/s?k=product+name"
```

Important rules:

- Paste the actual affiliate URL as a string in double quotes
- Keep it valid and complete
- If you do not have an affiliate URL yet, leave it as an empty string like this:

```json
"affiliateUrl": ""
```

The site expects a string, not a number.

## STEP 8: How to preview/check the content

After saving:

1. Check the products JSON file for correct commas and brackets
2. Open the product page or product list
3. Confirm the name, price, rating and image appear properly
4. Check that the affiliate link field is valid if used

## STEP 9: How to commit and push to GitHub

Run:

```bash
git status
git add .
git commit -m "Add product review"
git push origin main
```

## STEP 10: How to verify the live website

After pushing and the site updates:

1. Open the live website
2. Visit the product list and product page
3. Confirm the product appears correctly
4. Check the image loads
5. Check the product data is correct
6. If affiliate links are enabled, verify they navigate correctly

## COMPLETE EXAMPLE

```json
{
  "id": "product-006",
  "name": "National Luna Fridge Freezer",
  "slug": "national-luna-fridge-freezer",
  "brand": "National Luna",
  "category": "Power & Camping",
  "price": "$1,150",
  "rating": "4.9",
  "retailer": "Retailer TBA",
  "affiliateUrl": "https://www.amazon.com/s?k=national+luna+fridge+freezer",
  "featuredImage": "images/products/product-006.jpg",
  "imageAlt": "A compact fridge freezer designed for 4x4 touring and remote camping.",
  "description": "A dependable way to keep food and drinks cold while travelling or camping off-grid.",
  "pros": ["Excellent cooling performance", "Good for remote travel", "Reliable build quality"],
  "cons": ["Higher cost", "Needs correct installation planning"],
  "engineeringOpinion": "This is the kind of product that matters most when you need real reliability in remote conditions and limited access to supplies.",
  "tags": ["camping", "power", "travel", "fridge"],
  "affiliateDisclosure": "JUNE TRAIL may earn a commission from qualifying purchases made through affiliate links. This does not affect our editorial independence or our product assessment.",
  "featured": false,
  "published": true
}
```

## Common mistakes

- Missing comma between array items or object properties
- Wrong image filename or wrong folder
- Wrong folder such as `images/news/` instead of `images/products/`
- Duplicate `id`
- Duplicate `slug`
- `published` set to `false`
- Invalid JSON syntax
- Using `amazonUrl` instead of the live site field `affiliateUrl`

## Important note about the current site

The example template file may mention a field such as `amazonUrl`, but the live JSON in this project uses `affiliateUrl`.

Always match the actual site data structure.
