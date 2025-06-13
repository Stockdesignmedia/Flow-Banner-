import React from "react";
import BannerGenerator from "./components/BannerGenerator";
import BulkUpload from "./components/BulkUpload";

function App() {
  return (
    <div>
      <h1>Bannerflow Clone</h1>
      <BannerGenerator />
      <BulkUpload />
    </div>
  );
}

export default App;