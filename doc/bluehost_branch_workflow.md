# Git Branch-Based Bluehost Hosting & Deployment Workflow

This document details the automated Git branch pipeline for managing **Debug** vs. **Production** hosting for the **Adhigam IAS** web application on **Bluehost**.

---

## 🌿 1. Branch Strategy Overview

| Branch Name | Deployment Environment | Build Mode | Domain / URL | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `develop` | **Staging / Debug** | `npm run build:debug` | `debug.yourdomain.com` (or `/staging`) | Internal testing, feature preview, source map debugging, and faculty QA review. |
| `main` / `master` | **Live Production** | `npm run build` | `yourdomain.com` | Live student-facing portal with minified JS/CSS assets and maximum security headers. |

---

## 🔀 2. Pull Request (PR) & Merging Workflow

To ensure code quality and prevent broken builds on the live website, direct commits to `main` or `master` should be blocked.

```
 [ Feature Branch ]  ──>  (PR & Testing)  ──>  [ develop ]  ──> (Staging Build & Debug QA)
                                                                       │
                                                                       │  (Pull Request)
                                                                       ▼
                                                             [ main / master ]
                                                                       │
                                                                       ▼
                                                            (Live Production Build)
```

### Development Step-by-Step Cycle:
1. **Develop New Features**:
   Work on feature branches or directly push to `develop`.
   ```bash
   git checkout develop
   git pull origin develop
   # Make changes & commit
   git commit -m "feat: added new Mains answer review workspace filter"
   git push origin develop
   ```

2. **Automated Debug Build & Deploy**:
   Pushing to `develop` automatically triggers the GitHub Actions CI pipeline (`.github/workflows/deploy.yml`):
   - Executes `npm run build:debug`.
   - Generates sourcemaps (`.map` files) and keeps unminified stack traces.
   - Deploys automatically to Bluehost debug directory (`/public_html/staging/` or `debug.yourdomain.com`).

3. **Verify on Debug Domain**:
   Open `debug.yourdomain.com` on your browser to test features, verify answer submission flows, and inspect console logs.

4. **Create a Pull Request (PR)**:
   Once satisfied with the test results on the debug domain:
   - Open GitHub / GitLab.
   - Create a **Pull Request**: `develop` ➔ `main` (or `master`).
   - GitHub Actions will automatically run the `validate-pr` check (`npm run lint` and `npm run build`) to ensure there are no build breaks.

5. **Merge PR & Trigger Production Launch**:
   - Approve and merge the PR.
   - Pushing to `main` automatically runs `npm run build` (optimized production build).
   - Deploys directly to live Bluehost directory (`/public_html/` ➔ `yourdomain.com`).

---

## ⚙️ 3. Setting Up GitHub Secrets for Bluehost

To enable automated deployment via GitHub Actions, configure the following secrets in your GitHub repository (**Settings** ➔ **Secrets and variables** ➔ **Actions**):

| Secret Name | Description / Example Value |
| :--- | :--- |
| `BLUEHOST_FTP_SERVER` | `ftp.yourdomain.com` or your Bluehost Server IP |
| `BLUEHOST_FTP_USERNAME` | Your Bluehost FTP / cPanel username |
| `BLUEHOST_FTP_PASSWORD` | Your Bluehost FTP password |
| `BLUEHOST_DEBUG_FTP_PATH` | `/public_html/staging/` (Directory for debug build) |
| `BLUEHOST_PROD_FTP_PATH` | `/public_html/` (Directory for live website) |

---

## 🌐 4. Configuring Bluehost Subdomain for Debug Site

To host the `develop` branch alongside your live website on Bluehost:

1. Log into **Bluehost cPanel** (`https://my.bluehost.com`).
2. Go to **Domains** ➔ **Subdomains**.
3. Create a new subdomain:
   - **Subdomain**: `debug` (or `staging`)
   - **Domain**: `yourdomain.com`
   - **Document Root**: `public_html/staging`
4. Enable **Free SSL** for `debug.yourdomain.com` under **My Sites** ➔ **Security**.
5. When the `develop` branch pipeline runs, it will publish directly to `public_html/staging`, serving your debug site at `https://debug.yourdomain.com`.

---

## 🔐 5. Enforcing Branch Protection Rules on GitHub

To mandate PRs before merging into production:

1. On GitHub, go to **Settings** ➔ **Branches**.
2. Click **Add branch protection rule**.
3. **Branch name pattern**: `main` (and another for `master` if applicable).
4. Check **Require a pull request before merging**.
5. Check **Require status checks to pass before merging**:
   - Select `Validate PR Build & Types`.
6. Click **Save changes**.

---

## 🛠️ 6. Local Manual Build Commands

If you need to build manually on your local computer before pushing to Git:

- **Debug Build (with sourcemaps & unminified code)**:
  ```bash
  npm run build:debug
  ```
- **Production Build (minified & optimized)**:
  ```bash
  npm run build
  ```
