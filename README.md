# Smart Analyst — Online Shop + Admin Panel

Duka la mtandaoni la simu na vifaa vya ICT, likiwa na **admin panel** ya
kupakia picha za bidhaa. Bidhaa zinahifadhiwa kwenye **server**, kwa hiyo
zinaonekana kwa **kila mtu** anayefungua tovuti.

## Maudhui
```
smart-analyst/
├── server.js            -> backend (Node.js + Express)
├── package.json
├── public/
│   ├── index.html       -> duka (shop) — wateja wanaona hapa
│   └── admin.html       -> admin panel — wewe unapakia bidhaa
├── data/products.json   -> database ya bidhaa (JSON)
└── uploads/             -> picha za bidhaa zinazopakiwa
```

## Kuendesha kwenye kompyuta yako (local)
Unahitaji **Node.js 18+**.
```bash
cd smart-analyst
npm install
npm start
```
Kisha fungua:
- Duka:        http://localhost:3000
- Admin panel: http://localhost:3000/admin.html

## Kuingia kwenye Admin (Login)
Default:
- Username: `admin`
- Password: `smart2026`

**MUHIMU:** badilisha password kabla ya ku-host. Weka kwenye environment
variables (salama zaidi) au badilisha moja kwa moja mwanzoni mwa `server.js`:
```
ADMIN_USER, ADMIN_PASS, SESSION_SECRET
```
Mfano wa kuendesha na password yako:
```bash
ADMIN_USER=juma ADMIN_PASS=SirihiYangu123 SESSION_SECRET=neno-la-siri npm start
```

## Jinsi ya kutumia Admin
1. Fungua `/admin.html`, ingia.
2. Bofya "Click or drop a product photo", chagua picha.
3. Jaza jina, bei, kundi (new / used / computers / accessories), maelezo.
4. Bofya **Save**. Bidhaa inaonekana mara moja kwenye duka.
5. Unaweza **Edit** au **Delete** bidhaa yoyote.

## Ku-host mtandaoni (ionekane kwa kila mtu)
Tovuti hii inahitaji sehemu inayoendesha Node.js (si hosting ya kawaida ya
HTML tu). Chaguo rahisi:
- **Render.com** (free): unganisha repo, Build `npm install`, Start `npm start`.
- **Railway.app** au **VPS** yoyote (Ubuntu + Node + pm2).

Hakikisha folda `data/` na `uploads/` zina ruhusa ya kuandika (write), na
ikiwezekana zihifadhiwe kwenye "persistent disk" ili bidhaa na picha
zisipotee kila server inaporestart.

## Namba ya WhatsApp
Order zinatumwa kwa **+255 757 979 362** (imewekwa kwenye `public/index.html`
kama `WA = "255757979362"`). Badilisha hapo ukitaka namba nyingine.
