import express from "express";
const router = express.Router();

const BANNER_SIZES = {
  "336x280": { width: 336, height: 280 },
  "300x250": { width: 300, height: 250 },
  "320x320": { width: 320, height: 320 },
  "300x600": { width: 300, height: 600 },
  "728x90": { width: 728, height: 90 },
  "970x250": { width: 970, height: 250 }
};

function generateBannerHtml({ size, title, cta, link, offer }) {
  const selected = BANNER_SIZES[size];
  if (!selected) return `<div>Invalid size: ${size}</div>`;
  return `
    <div style="width:${selected.width}px;height:${selected.height}px;background:linear-gradient(90deg,orange,#50aaff);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;color:#fff;">
      <h2 style="margin:0 0 8px 0;font-size:1.5em;">${title}</h2>
      <div style="font-size:1.2em;margin-bottom:8px;">${offer}</div>
      <a href="${link}" style="background:#fff;color:orange;padding:8px 16px;border-radius:8px;text-decoration:none;font-weight:bold;">${cta}</a>
      <div style="font-size:0.8em;margin-top:8px;">${link}</div>
    </div>
  `;
}

router.post("/upload", (req, res) => {
  const { header, dataRows } = req.body;
  const idx = {};
  header.forEach((h, i) => { idx[h.toLowerCase()] = i; });
  const banners = dataRows.map(row => {
    const size = row[idx["size"]] || "";
    const title = row[idx["title"]] || "";
    const cta = row[idx["cta"]] || "";
    const link = row[idx["link"]] || "";
    const offer = row[idx["offer"]] || "";
    return generateBannerHtml({ size, title, cta, link, offer });
  });
  res.json({ banners });
});

export default router;