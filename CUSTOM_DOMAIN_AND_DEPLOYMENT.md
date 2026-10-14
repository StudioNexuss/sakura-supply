# GitHub Hosting & Custom Domain Setup Guide

This guide walks you through publishing this website onto **GitHub Pages** with automated builds and connecting your **custom domain** (e.g., `yourbusiness.com.au` or `yourbusiness.com`).

---

## Part 1: Automated GitHub Pages Hosting Setup

1. **Create a GitHub Repository**:
   - Go to [GitHub.com](https://github.com) and click **New Repository**.
   - Name it (e.g., `storefront` or `apex-collectibles`). You can make it Public or Private.

2. **Push your code to GitHub**:
   In your terminal, run:
   ```bash
   git add .
   git commit -m "Initial commit: Complete storefront website"
   git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPO_NAME>.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Actions for Pages**:
   - Go to your repository on GitHub.
   - Click on **Settings** &rarr; **Pages** (under "Code and automation" in the left sidebar).
   - Under **Build and deployment** &rarr; **Source**, select **GitHub Actions** (instead of "Deploy from a branch").
   - The `.github/workflows/deploy.yml` included in this project will automatically build and deploy the website every time you push changes!

---

## Part 2: Custom Domain Configuration

### Step 1: Add Custom Domain to GitHub
1. In your GitHub repository, navigate to **Settings** &rarr; **Pages**.
2. Scroll to the **Custom domain** section.
3. Enter your domain name (e.g., `apexcollectibles.com.au` or `www.apexcollectibles.com.au`).
4. Click **Save**.
5. Once your DNS records propagate (see Step 2 below), check the box **Enforce HTTPS** to enable free automatic SSL/TLS certificates.

### Step 2: Configure DNS Records at your Domain Registrar
Log into your domain provider (e.g., GoDaddy, Cloudflare, Crazy Domains, Namecheap, VentraIP) and add the following records to your DNS settings:

#### A. For the Apex Domain (e.g., `apexcollectibles.com.au`)
Add four **A** records pointing `@` (or root) to GitHub's server IPs:
- **Type**: `A` | **Host / Name**: `@` | **Value**: `185.199.108.153`
- **Type**: `A` | **Host / Name**: `@` | **Value**: `185.199.109.153`
- **Type**: `A` | **Host / Name**: `@` | **Value**: `185.199.110.153`
- **Type**: `A` | **Host / Name**: `@` | **Value**: `185.199.111.153`

#### B. For the Subdomain / WWW (e.g., `www.apexcollectibles.com.au`)
Add a **CNAME** record:
- **Type**: `CNAME` | **Host / Name**: `www` | **Value**: `<YOUR_GITHUB_USERNAME>.github.io.`

### Step 3: Persist CNAME in your Project
To ensure custom domain settings are never overwritten on future builds:
1. Create a file named `CNAME` in the `public/` directory:
   ```bash
   echo "yourdomain.com.au" > public/CNAME
   ```
2. Commit and push:
   ```bash
   git add public/CNAME
   git commit -m "Add CNAME for custom domain"
   git push
   ```

---

## Part 3: Local Development & Preview

To run and test the website locally anytime:
```bash
# Start local live development server
npm run dev

# Create an optimized production build
npm run build

# Preview production build locally
npm run preview
```
