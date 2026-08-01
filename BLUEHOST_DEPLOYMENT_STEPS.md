# Complete Step-by-Step Guide: Deploying Adhigam IAS Website on Bluehost

This document provides a clean, end-to-end, step-by-step walkthrough for deploying the **Adhigam IAS** website onto **Bluehost** using a custom registered domain.

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Domain & DNS Configuration on Bluehost](#step-1-domain--dns-configuration-on-bluehost)
3. [Step 2: Preparing the Website Build](#step-2-preparing-the-website-build)
4. [Step 3: Uploading Files to Bluehost cPanel](#step-3-uploading-files-to-bluehost-cpanel)
5. [Step 4: Configuring `.htaccess` for React SPA Client Routing](#step-4-configuring-htaccess-for-react-spa-client-routing)
6. [Step 5: Enabling Free SSL (HTTPS)](#step-5-enabling-free-ssl-https)
7. [Step 6: Setting Up Automated Branch-Based Deployments (Optional & Recommended)](#step-6-setting-up-automated-branch-based-deployments-optional--recommended)
8. [Step 7: Verification & Post-Launch Checklist](#step-7-verification--post-launch-checklist)

---

## 1. Prerequisites

Before starting, ensure you have:
- [x] Active **Bluehost Hosting Account** (Shared Hosting, Choice Plus, Online Store, or VPS).
- [x] Purchased **Domain Name** (e.g. `adhigamias.com`).
- [x] Access to **Bluehost Control Panel** (`https://my.bluehost.com` or `https://yourdomain.com:2083`).
- [x] Node.js (v18 or higher) and `npm` installed on your local computer.

---

## Step 1: Domain & DNS Configuration on Bluehost

If you registered your domain with Bluehost or an external provider (GoDaddy, Namecheap, Google Domains):

1. **Log into Bluehost**:
   - Go to [my.bluehost.com](https://my.bluehost.com) and sign in.
2. **Assign the Domain**:
   - In the left sidebar, click **Domains** -> **My Domains**.
   - If your domain was bought outside Bluehost, click **Assign** and update your domain’s Name Servers at your domain registrar to point to Bluehost:
     ```
     ns1.bluehost.com
     ns2.bluehost.com
     ```
3. **Set Document Root**:
   - Primary domain: points to `/public_html`
   - Addon Domain or Subdomain: points to `/public_html/subdomain_folder` (e.g. `/public_html/staging`).

---

## Step 2: Preparing the Website Build

Open your terminal in the project directory on your computer:

### Option A: Standard Production Build (For Live Website)
```bash
# 1. Install dependencies
npm install

# 2. Build production assets
npm run build
```
- This compiles all React components, Tailwind styles, and icons into the `dist/` directory.
- Assets are minified and optimized for high-speed performance.

### Option B: Debug Build (For Testing on `debug.yourdomain.com`)
```bash
# Build with source maps & detailed console logging
npm run build:debug
```

---

## Step 3: Uploading Files to Bluehost cPanel

### Method 1: Using Bluehost File Manager (Recommended & Fast)

1. **ZIP the Build Output**:
   - Open the `dist/` folder on your local computer.
   - Select **all items inside `dist/`** (including `index.html`, `assets/`, `.htaccess`).
   - Right-click and compress into `dist.zip`.

2. **Upload to Bluehost File Manager**:
   - In Bluehost Portal, go to **Advanced** (or **cPanel**) -> **File Manager**.
   - Double-click `public_html` (or your subdomain folder).
   - Click **Upload** in the top navigation bar.
   - Select and upload `dist.zip`.

3. **Extract Files**:
   - Select `dist.zip` inside `public_html` and click **Extract** in the top toolbar.
   - Confirm extraction path is `/public_html/`.
   - Delete `dist.zip` after extraction.

---

### Method 2: Using FTP (FileZilla Client)

1. Connect to Bluehost via FTP:
   - **Host**: `ftp.yourdomain.com` or your Bluehost Server IP
   - **Username**: Your Bluehost cPanel / FTP Username
   - **Password**: Your FTP Password
   - **Port**: `21` (or `22` for SFTP)
2. Drag and drop all files **inside `dist/`** directly into `/public_html/`.

---

## Step 4: Configuring `.htaccess` for React SPA Client Routing

Because React uses client-side routing (`react-router`), refreshing pages like `yourdomain.com/courses` will trigger a 404 error on Apache unless redirected to `index.html`.

The repository already includes a custom `/public/.htaccess` file which gets bundled into `dist/`.

To verify `.htaccess` is active on Bluehost:
1. In cPanel File Manager, click **Settings** (top right corner).
2. Check **Show Hidden Files (dotfiles)** and click Save.
3. Verify `.htaccess` exists in `public_html`. It must contain:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]
  RewriteRule ^ index.html [L]
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

---

## Step 5: Enabling Free SSL (HTTPS)

To ensure student logins and enquiry forms are secure:

1. In Bluehost Portal, go to **My Sites** -> Select your site -> **Security** tab.
2. Under **Free SSL Certificate (AutoSSL / Let's Encrypt)**, toggle the switch to **ON**.
3. Bluehost will automatically issue and renew the SSL certificate for your domain.

---

## Step 6: Setting Up Automated Branch-Based Deployments (Optional & Recommended)

Instead of manual ZIP uploads, you can automate deployments using GitHub Actions whenever code is pushed:

- **`develop` branch**: Triggers `npm run build:debug` and deploys to `debug.yourdomain.com`.
- **`main` or `master` branch**: Triggers `npm run build` and deploys to live website `yourdomain.com`.

### Steps to Configure:
1. Push your repository to GitHub.
2. In GitHub, go to **Settings** -> **Secrets and variables** -> **Actions** -> **New repository secret**.
3. Add the following secrets:
   - `BLUEHOST_FTP_SERVER`: `ftp.yourdomain.com`
   - `BLUEHOST_FTP_USERNAME`: Your FTP username
   - `BLUEHOST_FTP_PASSWORD`: Your FTP password
   - `BLUEHOST_PROD_FTP_PATH`: `/public_html/`
   - `BLUEHOST_DEBUG_FTP_PATH`: `/public_html/staging/`
4. The workflow in `.github/workflows/deploy.yml` will handle building and syncing files on every push or Pull Request!

---

## Step 7: Verification & Post-Launch Checklist

After deployment completes:

1. **Test Home Page**: Open `https://yourdomain.com` in your browser.
2. **Test Direct Routes**: Refresh the page on `/courses`, `/free-initiatives`, and `/join-us` to ensure Apache `.htaccess` routing works without 404 errors.
3. **Test Quick Inquiry Modal**: Submit a test inquiry to verify lead capture in local storage and WhatsApp link redirects.
4. **Test Responsive Design**: Open the site on mobile devices to confirm the header badge, navigation drawer, and course drawers scale fluidly.
5. **Inspect Console Logs**: Press `F12` -> Console in your browser to verify no missing asset bundle errors occur.
