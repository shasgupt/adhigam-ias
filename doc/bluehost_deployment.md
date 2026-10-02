# Bluehost Deployment Guide — Adhigam IAS Web Portal

This guide provides step-by-step instructions for deploying the **Adhigam IAS** web application to **Bluehost** using your custom registered domain. It covers both standard **Static SPA Hosting (Shared Hosting / cPanel)** and **Node.js Application Hosting (VPS / cPanel Setup Node.js App)**, along with procedures for **Production** and **Debug/Staging** builds.

---

## 📋 Prerequisites

Before starting deployment, ensure you have:
1. **Bluehost Account Access**: Access to your Bluehost Portal or cPanel (`https://my.bluehost.com` or `https://yourdomain.com:2083`).
2. **Domain Assigned**: Your custom domain attached to your Bluehost primary `public_html` directory or configured as an Addon Domain / Subdomain.
3. **Node.js (v18+) & npm** installed on your local computer or build environment.
4. An FTP client (e.g. FileZilla) or access to **Bluehost cPanel File Manager**.

---

## 🛠️ Step 1: Preparing Build Configurations

The repository includes a custom Apache configuration file located at `public/.htaccess`. When you run Vite's build command, files inside `/public` are automatically bundled directly into the `/dist` output folder.

### What `.htaccess` does on Bluehost:
- **SPA Routing**: Redirects all dynamic React paths (`/courses`, `/free-initiatives`, `/join-us`) to `index.html` so client-side routes don't throw Apache 404 errors when refreshed.
- **Security Headers**: Enforces HTTPS framing security (`SAMEORIGIN`), XSS protection, and MIME type sniffing prevention.
- **Gzip Compression**: Compresses HTML, JS, CSS, and JSON assets for fast initial load times on Indian mobile networks.

---

## 🚀 Step 2: Generating Builds (Production vs. Debug)

Run the appropriate command on your local machine before uploading to Bluehost.

### Option A: Standard Production Build (Recommended for Main Site)
```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build
```
- **Output Directory**: `dist/`
- **Output Characteristics**: Minified JS/CSS bundles, stripped console logs, optimized for maximum performance and security.

### Versioned, Build-Tagged Bluehost ZIP

Increment the project version when starting a release, then build and package it. The archive is tagged `release` or `debug` according to the last successful build:

```bash
npm run version:patch
npm run build
npm run package:dist
```

Use `npm run version:minor` or `npm run version:major` for larger releases. Version increments update `package.json` and `package-lock.json` without creating a Git tag. Production builds create `adhigam-ias-v<version>-release.zip`; debug builds create `adhigam-ias-v<version>-debug.zip`. Both archives contain the contents of `dist/`, including hidden files such as `.htaccess`.

Example:
```bash
npm run version:minor
npm run build
npm run package:dist
```
This changes the app version from `1.4.1` to `1.5.0` and creates a ZIP such as `adhigam-ias-v1.5.0-release.zip` for upload to Bluehost.

---

### Option B: Debug / Staging Build (For Testing & Troubleshooting on Bluehost)
If you are deploying to a testing subdomain (e.g. `debug.yourdomain.com` or `/staging`) and need detailed console logs and unminified stack traces:

```bash
# Run automated debug build with sourcemaps & unminified assets
npm run build:debug
```

*For automated Git branch-based hosting (`develop` branch ➔ `debug.yourdomain.com`, `main` branch ➔ `yourdomain.com`), see the dedicated [Git Branch Deployment Guide](./bluehost_branch_workflow.md).*

---

## 📦 Step 3: Deploying to Bluehost Shared Hosting (Standard cPanel Upload)

This is the most common, cost-effective, and reliable method for hosting the Adhigam IAS web portal on Bluehost.

### Method 1: Using Bluehost cPanel File Manager (Easiest)

1. **Compress the Output**:
   - On your local computer, open the generated `dist/` folder.
   - Select **ALL files and folders inside `dist/`** (including `index.html`, `assets/`, `.htaccess`).
   - Create a ZIP archive (e.g., `adhigam-build.zip`).

2. **Log into Bluehost**:
   - Go to [my.bluehost.com](https://my.bluehost.com) and log in.
   - Navigate to **Advanced** (cPanel) -> **File Manager**.

3. **Navigate to Domain Directory**:
   - For primary domain: Go to `/public_html`.
   - For an addon domain or subdomain: Go to `/public_html/your-subdomain-folder`.

4. **Upload & Extract**:
   - Click **Upload** in top menu of File Manager and upload `adhigam-build.zip`.
   - Once uploaded, select `adhigam-build.zip` in File Manager and click **Extract**.
   - Ensure the extracted contents sit directly inside `public_html/` (not nested inside an extra `dist/` folder).

5. **Verify Hidden Files**:
   - In cPanel File Manager, click **Settings** (top right) and check **Show Hidden Files (dotfiles)**.
   - Verify `.htaccess` exists in `public_html/`.

---

### Method 2: Using FTP (FileZilla)

1. Connect to Bluehost via FTP:
   - **Host**: `ftp.yourdomain.com` or your Bluehost server IP
   - **Username**: Your cPanel / FTP username
   - **Password**: Your cPanel / FTP password
   - **Port**: `21` (or `22` for SFTP)

2. Drag all files from your local `dist/` directory into the remote `/public_html/` directory.

---

## ⚡ Step 4: Full-Stack Node.js Hosting (For Express Backend on Bluehost VPS / cPanel Node.js App)

If you are using Bluehost VPS, Dedicated Server, or cPanel with **Setup Node.js App** enabled:

1. **Build Backend**:
   ```bash
   npm run build
   ```
   *This compiles `server.ts` into `dist/server.cjs` and builds client assets into `dist/`.*

2. **Upload Files to Server**:
   - Upload `dist/server.cjs`
   - Upload `dist/` (client static directory)
   - Upload `package.json`

3. **Configure cPanel Setup Node.js App**:
   - Go to cPanel -> **Setup Node.js App**.
   - Click **Create Application**.
   - **Node.js Version**: Select 18.x or 20.x.
   - **Application Mode**: `Production`.
   - **Application Root**: `public_html` or app directory.
   - **Application Startup File**: `dist/server.cjs`.
   - **Environment Variables**: Add `NODE_ENV=production` and `PORT=3000`.
   - Click **Run npm install** to install production dependencies (`express`, etc.).
   - Click **Start Application**.

---

## 🔒 Step 5: Enabling Free SSL (HTTPS) on Bluehost

To ensure secure student logins and WhatsApp/payment inquiries:

1. In Bluehost Portal, go to **My Sites** -> Select site -> **Security**.
2. Under **Free SSL Certificate**, toggle SSL to **ON** (Bluehost AutoSSL / Let's Encrypt).
3. The `.htaccess` file created in `/public/.htaccess` will automatically enforce HTTPS connections.

---

## 🔍 Step 6: Verification & Troubleshooting

### 1. Issue: 404 Error when refreshing pages (e.g. `yourdomain.com/courses`)
- **Cause**: Apache is looking for a physical directory named `/courses`.
- **Fix**: Ensure `.htaccess` is present in `public_html`. Enable "Show Hidden Files" in cPanel File Manager to confirm it was uploaded.

### 2. Issue: Blank White Screen on Site Load
- **Cause**: Asset base path mismatch in `vite.config.ts`.
- **Fix**: Open `vite.config.ts` and ensure `base` is set to `'/'` (or `'./'` if hosting in a subfolder). Re-run `npm run build` and re-upload.

### 3. Issue: Checking Error Logs on Bluehost
- Open cPanel -> **Metrics** -> **Errors**.
- Or inspect logs in File Manager at `/public_html/error_log`.

---

## 🎯 Summary Checklist for Bluehost Launch

- [x] Run `npm run build` locally
- [x] Confirm `.htaccess` is inside `dist/`
- [x] Upload contents of `dist/` to Bluehost `public_html/`
- [x] Enable SSL Certificate on Bluehost Dashboard
- [x] Test deep link navigation (`/courses`, `/free-initiatives`, `/join-us`)
- [x] Verify Quick Inquiry form & WhatsApp links work on mobile devices
