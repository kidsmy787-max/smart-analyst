# Ku-host BURE kwenye Render.com — Smart Analyst

Hatua za kupata tovuti yako (duka + admin) ikiwa hewani bila malipo.
Muda: dakika ~10.

---

## HATUA 1 — Tengeneza akaunti
1. Nenda https://render.com → **Get Started** → jisajili (rahisi zaidi kwa GitHub).

## HATUA 2 — Weka code kwenye GitHub
Render inasoma code kutoka GitHub.
1. Tengeneza akaunti GitHub (kama huna): https://github.com
2. Tengeneza repo mpya, jina: `smart-analyst` (chagua **Public** au Private).
3. Pakia faili ZOTE za project (kila kitu ndani ya folda `smart-analyst`)
   kwenye repo hiyo. Njia rahisi:
   - Kwenye ukurasa wa repo bofya **"Add file" → "Upload files"**
   - Buruta faili zote (server.js, package.json, render.yaml, README,
     folda `public/`, `data/`, `uploads/`) → **Commit changes**.
   - USIPAKIE folda `node_modules` (Render itaijenga yenyewe).

## HATUA 3 — Tengeneza Web Service kwenye Render

### Njia A — Kutumia render.yaml (rahisi, inapendekezwa)
1. Kwenye Render dashboard: **New +** → **Blueprint**.
2. Chagua repo yako ya GitHub → Render itasoma `render.yaml` yenyewe.
3. Itakuomba uweke:
   - `ADMIN_USER`  → jina lako la kuingia (mfano: `juma`)
   - `ADMIN_PASS`  → password IMARA (mfano: `Simu#2026$Dar`)
   (`SESSION_SECRET` inatengenezwa yenyewe.)
4. Bofya **Apply / Create**.

### Njia B — Kwa mkono (kama Blueprint haikutumika)
1. **New +** → **Web Service** → chagua repo yako.
2. Jaza:
   - Runtime: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: **Free**
3. Bonyeza **Advanced** → **Add Environment Variable**:
   - `ADMIN_USER` = jina lako
   - `ADMIN_PASS` = password yako imara
   - `SESSION_SECRET` = neno lolote refu la siri
   - `DATA_ROOT` = `/var/data`
4. **Add Disk** (ili picha zisipotee):
   - Name: `smart-analyst-data`
   - Mount Path: `/var/data`
   - Size: `1 GB`
5. Bofya **Create Web Service**.

## HATUA 4 — Subiri i-deploy
- Render ita-"Build" na "Deploy" (dakika 2-4).
- Ukiona **"Live"**, utapata URL kama: `https://smart-analyst.onrender.com`

## HATUA 5 — Tumia
- **Duka (wateja):**  `https://smart-analyst.onrender.com`
- **Admin (wewe):**   `https://smart-analyst.onrender.com/admin.html`
  Ingia na `ADMIN_USER` / `ADMIN_PASS` ulizoweka, kisha pakia bidhaa + picha.

---

## MAMBO MUHIMU YA KUJUA (Free plan)
- **Server "hulala":** ikiwa hakuna mgeni kwa ~dakika 15, server inalala.
  Mgeni wa kwanza baada ya hapo atasubiri sekunde ~30-50 tovuti iamke.
  (Ukiongeza malipo kidogo huondoa hili.)
- **Disk ya 1GB** inatosha maelfu ya picha. Ndiyo inayohifadhi picha na
  bidhaa zako ili zisipotee server inaporestart. HAKIKISHA umeiongeza.
- **Badilisha password:** usibaki na `smart2026`. Weka yako kwenye
  Environment Variables kama hatua zilivyoeleza.
- **Namba ya WhatsApp:** ni +255 757 979 362 (ndani ya public/index.html).

## Kuboresha baadaye
Ukibadilisha code, i-push tena GitHub — Render ita-deploy upya yenyewe.
