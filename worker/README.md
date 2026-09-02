# JUNE TRAIL Admin Worker

This Cloudflare Worker is the secure backend for the JUNE TRAIL admin dashboard.

## Purpose

- verify admin login server-side
- allow authenticated admin actions only
- validate content type and JSON payloads
- update only the allowed repository JSON files
- commit changes to GitHub using a GitHub App installation token
- keep all secrets in Cloudflare Worker environment variables

## Required environment variables

Set these in Cloudflare Worker secret or environment variables:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `SESSION_SECRET`
- `GITHUB_APP_ID`
- `GITHUB_APP_PRIVATE_KEY`
- `GITHUB_INSTALLATION_ID`
- `REPO_OWNER`
- `REPO_NAME`
- `REPO_BRANCH`
- `ALLOWED_ORIGINS`

## GitHub App setup

1. Create a GitHub App in GitHub.
2. Set repository permissions to only the minimum needed, such as `Contents: Read and write`.
3. Install the GitHub App on the `asminshrestha10/junetrail` repository.
4. Copy the App ID, installation ID, and private key into Cloudflare Worker secrets.
5. Keep the key on the server only.

## Local development

```bash
npm install
npx wrangler dev
```

## Deploy

```bash
npx wrangler deploy
```

## Admin API

- `POST /api/admin/login`
- `POST /api/admin/logout`
- `GET /api/admin/session`
- `GET /api/admin/content/:type`
- `POST /api/admin/content/:type`
- `PUT /api/admin/content/:type/:id`
- `DELETE /api/admin/content/:type/:id`
- `POST /api/admin/save`

The browser must not send secrets or tokens.
