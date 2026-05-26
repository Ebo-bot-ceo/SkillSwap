# SkillSwap

A community skill exchange platform — swap skills, grow together.

## Deploy to Netlify (3 options)

### Option A — Netlify Drop (easiest, 60 seconds)
1. Run `npm install` then `npm run build` in this folder
2. Go to https://app.netlify.com/drop
3. Drag and drop the `dist/` folder onto the page
4. Your site is live instantly ✅

### Option B — Connect GitHub (recommended for ongoing updates)
1. Push this folder to a GitHub repo
2. Go to https://app.netlify.com → "Add new site" → "Import from Git"
3. Select your repo
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Click Deploy ✅

### Option C — Netlify CLI
1. `npm install -g netlify-cli`
2. `netlify login`
3. `npm run build`
4. `netlify deploy --prod --dir=dist`

## Run Locally
```bash
npm install
npm run dev
```
Then open http://localhost:5173
