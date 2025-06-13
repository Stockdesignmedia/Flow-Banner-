import React, { useState } from "react";
import * as XLSX from "xlsx";

export default function BulkUpload() {
  const [banners, setBanners] = useState([]);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setProcessing(true);
    setError("");
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const ws = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
      const [header, ...dataRows] = rows;
      const response = await fetch("/api/bulk/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ header, dataRows }),
      });
      const result = await response.json();
      setBanners(result.banners || []);
    } catch (err) {
      setError("Failed to process file. Ensure it is a valid .xlsx or .csv file.");
    }
    setProcessing(false);
  }

  return (
    <div>
      <h3>Bulk Upload via Excel</h3>
      <input type="file" accept=".xlsx,.csv" onChange={handleFile} />
      {processing && <div>Processing...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {banners.length > 0 && (
        <div>
          <h4>Generated Banners</h4>
          {banners.map((html, idx) => (
            <div key={idx} style={{ margin: "10px", border: "1px solid #ccc" }}>
              <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}