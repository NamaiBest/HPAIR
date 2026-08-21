# HPAIR

## READY Hub

A clickable demo of READY Hub — VietHope's curated gateway to digital-skills
courses for university students across the Mekong region. See
[`ready-hub/README.md`](ready-hub/README.md) for the full demo walkthrough and
scoring model.

### Run it locally

```bash
cd ready-hub
npm install
npm run dev      # http://localhost:5173
```

### Deployment

Pushing to `main` builds `ready-hub` and publishes it to GitHub Pages via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml). No manual step
required after the initial one-time setup below.

**One-time setup** (repo owner, once): in the repo's Settings → Pages, set
**Source** to **GitHub Actions**. After that, every push to `main` deploys
automatically.
