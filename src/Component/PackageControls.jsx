import React from "react";
import Store from "../Store";

export default function PackageControls() {
  const handleDownload = () => Store.exportPackageToFile("package1");

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (f) Store.importPackageFromFile(f);
    e.target.value = "";
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={handleDownload} className="px-3 py-1 bg-blue-600 text-white rounded">Download package1</button>

      <label className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer">
        Import package
        <input onChange={handleFile} type="file" accept="application/json" style={{ display: "none" }} />
      </label>
    </div>
  );
}
