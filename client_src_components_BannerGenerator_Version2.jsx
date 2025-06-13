import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";

const BANNER_SIZES = [
  { label: "336x280", width: 336, height: 280 },
  { label: "300x250", width: 300, height: 250 },
  { label: "320x320", width: 320, height: 320 },
  { label: "300x600", width: 300, height: 600 },
  { label: "728x90", width: 728, height: 90 },
  { label: "970x250", width: 970, height: 250 }
];

export default function BannerGenerator() {
  const [size, setSize] = useState("");
  const [title, setTitle] = useState("");
  const [cta, setCta] = useState("");
  const [link, setLink] = useState("");
  const [offer, setOffer] = useState("");
  const [type, setType] = useState("html");
  const [output, setOutput] = useState(null);
  const bannerRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);

  const selected = BANNER_SIZES.find(s => s.label === size);

  async function handleGenerate(e) {
    e.preventDefault();
    const res = await fetch("/api/banner/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ size, title, cta, link, offer, type }),
    });
    const data = await res.json();
    setOutput(data.bannerHtml);
    setImageUrl(null);
  }

  async function handleExportImage() {
    if (bannerRef.current) {
      const canvas = await html2canvas(bannerRef.current);
      setImageUrl(canvas.toDataURL("image/png"));
    }
  }

  return (
    <div>
      <h2>Banner Generator</h2>
      <form onSubmit={handleGenerate}>
        <select value={size} onChange={e => setSize(e.target.value)} required>
          <option value="">Select size</option>
          {BANNER_SIZES.map(size => (
            <option key={size.label} value={size.label}>
              {size.label} ({size.width}x{size.height})
            </option>
          ))}
        </select>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required />
        <input value={cta} onChange={e => setCta(e.target.value)} placeholder="CTA" required />
        <input value={link} onChange={e => setLink(e.target.value)} placeholder="Website Link" required />
        <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="Offer Price" required />
        <label>
          Banner Type:&nbsp;
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="html">HTML</option>
            <option value="static">Static Image (PNG)</option>
            <option value="animated">Animated</option>
          </select>
        </label>
        <button type="submit">Generate Banner</button>
      </form>
      {output && (
        <div>
          <h3>Preview</h3>
          <div ref={bannerRef} dangerouslySetInnerHTML={{ __html: output }} />
          {type === "static" && (
            <div>
              <button onClick={handleExportImage}>Export as PNG</button>
              {imageUrl && (
                <div>
                  <a href={imageUrl} download="banner.png">Download PNG</a>
                  <img src={imageUrl} alt="Banner PNG" style={{ maxWidth: 400 }} />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}