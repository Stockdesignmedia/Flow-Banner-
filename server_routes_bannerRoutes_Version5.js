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

function generateHTMLBanner({ size, title, cta, link, offer }) {
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

function generateAnimatedBanner({ size, title, cta, link, offer }) {
  const selected = BANNER_SIZES[size];
  if (!selected) return `<div>Invalid size: ${size}</div>`;
  return `
    <div style="width:${selected.width}px;height:${selected.height}px;background:linear-gradient(90deg,orange,#50aaff);border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;color:#fff;overflow:hidden;position:relative;">
      <h2 style="margin:0 0 8px 0;font-size:1.5em;animation:slidein 1s;">${title}</h2>
      <div style="font-size:1.2em;margin-bottom:8px;animation:fadein 2s;">${offer}</div>
      <a href="${link}" style="background:#fff;color:orange;padding:8px 16px;border-radius:8px;text-decoration:none;font-weight:bold;animation:bounce 2s infinite;">${cta}</a>
      <div style="font-size:0.8em;margin-top:8px;">${link}</div>
      <style>
        @keyframes slidein { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
      </style>
    </div>
  `;
}

router.post("/generate", (req, res) => {
  const { size, title, cta, link, offer, type } = req.body;
  let bannerHtml;
  if (type === "html" || type === "static") {
    bannerHtml = generateHTMLBanner({ size, title, cta, link, offer });
  } else if (type === "animated") {
    bannerHtml = generateAnimatedBanner({ size, title, cta, link, offer });
  } else {
    bannerHtml = "<div>Invalid type</div>";
  }
  res.json({ bannerHtml });
});

export default router;