# Add a Vehicle

This guide explains how to add a new vehicle review or listing.

## STEP 1: Open the correct JSON file

Open:

- /data/vehicles.json

This is where all vehicle entries are stored.

## STEP 2: Copy the template

Open:

- /templates/vehicle-template.json

Copy the full object and paste it into /data/vehicles.json before the final closing bracket.

## STEP 3: Where to paste the new item

The file contains a JSON array of vehicles.

Paste the new object:

- before the final `]`
- after the last existing vehicle object
- with a comma between objects

The new object should not be inserted inside another object.

## STEP 4: Understand every important field

```json
{
  "id": "vehicle-006",
  "name": "Vehicle Name",
  "slug": "vehicle-name",
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
  "category": "Vehicle",
  "featuredImage": "images/vehicles/vehicle-006.jpg",
  "gallery": ["images/vehicles/vehicle-006.jpg"],
  "description": "Short summary shown in cards and listings.",
  "tags": ["touring", "4x4", "vehicle"],
  "specifications": {
    "Engine": "2.0L petrol",
    "Transmission": "8-speed automatic",
    "Drive": "4WD",
    "Towing": "3,000 kg"
  },
  "featured": false,
  "published": true
}
```

Simple explanations:

- `id` = unique vehicle ID like `vehicle-006`
- `name` = the full vehicle name visitors see
- `slug` = URL-friendly version, lowercase and hyphenated
- `brand` = manufacturer name
- `model` = model name
- `year` = vehicle year
- `price` = price text, for example `$72,000`
- `engine` = engine information
- `power` = horsepower or kW output
- `torque` = torque value
- `transmission` = transmission description
- `drivetrain` = 4WD or AWD text
- `towingCapacity` = towing rating
- `payload` = payload rating
- `category` = always `"Vehicle"`
- `featuredImage` = main image path
- `gallery` = array of image paths for gallery items
- `description` = short card text
- `tags` = keyword tags
- `specifications` = object of important spec details
- `featured` = highlight status
- `published` = `true` means visible, `false` means hidden

## STEP 5: Where to upload the image

Upload the main image into:

- /images/vehicles/

If you want to add gallery images, place them in the same folder:

- /images/vehicles/

## STEP 6: How to add the image path correctly

Example:

```json
"featuredImage": "images/vehicles/vehicle-006.jpg"
```

And for gallery:

```json
"gallery": ["images/vehicles/vehicle-006.jpg"]
```

Important:

- The file must exist in the correct folder
- The name must match exactly
- Use lowercase and correct extension
- Do not use the wrong folder name

## STEP 7: How to check the vehicle listing

After saving the file:

1. Open the website
2. Go to the vehicles page
3. Look for the new vehicle card
4. Click through to verify the details and image are correct

## STEP 8: How to commit and push to GitHub

Run:

```bash
git status
git add .
git commit -m "Add vehicle listing"
git push origin main
```

## STEP 9: How to verify the live website

After pushing:

1. Open the live site
2. Check the vehicle listing page
3. Confirm the correct name, image, price and specs show
4. Verify the slug URL is working
5. Check the page loads without errors

## STEP 10: Important notes for beginners

Vehicle data is more detail-heavy than news or blogs.

Be careful with:

- commas between fields
- object braces `{}`
- array items `[]`
- duplicate IDs
- duplicate slugs

## COMPLETE EXAMPLE

```json
{
  "id": "vehicle-006",
  "name": "Toyota Prado 250 Series GX",
  "slug": "toyota-prado-250-series-gx",
  "brand": "Toyota",
  "model": "Prado",
  "year": 2026,
  "price": "$76,000",
  "engine": "2.8L turbo diesel",
  "power": "150 kW",
  "torque": "500 Nm",
  "transmission": "8-speed automatic",
  "drivetrain": "Part-time 4WD",
  "towingCapacity": "3,000 kg",
  "payload": "650 kg",
  "category": "Vehicle",
  "featuredImage": "images/vehicles/vehicle-006.jpg",
  "gallery": ["images/vehicles/vehicle-006.jpg"],
  "description": "A dependable and comfortable wagon for touring, family duty and capable all-weather driving.",
  "tags": ["wagon", "touring", "prado", "4x4"],
  "specifications": {
    "Engine": "2.8L turbo diesel",
    "Transmission": "8-speed automatic",
    "Drive": "Part-time 4WD",
    "Towing": "3,000 kg",
    "GroundClearance": "220 mm",
    "Fuel": "8.3L/100km combined"
  },
  "featured": false,
  "published": true
}
```

## Common mistakes

- Missing comma between properties
- Wrong image filename or wrong extension
- Wrong folder such as `images/blogs/`
- Duplicate `id`
- Duplicate `slug`
- `published` set to `false`
- Invalid JSON because of broken brackets or trailing commas

If the JSON file is not valid, the website will not read the content properly.
