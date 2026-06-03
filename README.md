# Astorre — AI Workforce Platform (website)

Static marketing + investor site for Astorre. Ready to deploy on **GitHub Pages**.

## Structure
```
.
├── index.html      # Entry point (homepage) — fully self-contained
├── .nojekyll       # Tells GitHub Pages to serve all files as-is
└── assets/
    └── team/       # Team member photos (4 images)
```
The live manager-dashboard demo (hero + Platform tab) is embedded directly
inside `index.html`, so the only external files the site needs are the four
team photos in `assets/team/`. Upload **everything in this folder** to the
repository root.

## Deploy to GitHub Pages
1. Create a new GitHub repository and push the **contents of this folder** to the `main` branch root (so `index.html` sits at the repository root).
2. In the repo go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Select branch **main** and folder **/ (root)**, then **Save**.
5. Your site goes live at `https://<username>.github.io/<repo>/` within a minute or two.

### Custom domain
1. In **Settings → Pages → Custom domain**, enter your domain (e.g. `astorre.io`) and Save — this creates a `CNAME` file in the repo.
2. At your DNS provider add records pointing to GitHub Pages:
   - **Apex domain** (`astorre.io`): four `A` records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **Subdomain** (`www.astorre.io`): one `CNAME` record → `<username>.github.io`
3. Back in **Settings → Pages**, tick **Enforce HTTPS** once the certificate is issued.

All asset paths are relative, so the site works at a repo subpath or a custom domain without changes.
