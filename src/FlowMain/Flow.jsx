// src/FlowMain/Flow.jsx
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { FaPlus, FaMinus, FaExpandArrowsAlt } from "react-icons/fa";
import { toJS } from "mobx";

import Store from "../Store";
import Navbar from "../Component/Navbar";
import FileExplorer from "../Component/FileExplorer";
import FlowCanvas from "./FlowCanvas";


const FlowDiagram = observer(() => {
  useEffect(() => {
    // make sure autosave is running
    Store.setupAutosave();
    // try to restore the current dashboard/user save
    Store.restoreFlow();
  }, []);

  // fetch collections and show popup
  const Tableselect = async () => {
    console.log("Fetching collections...");
    Store.closeColumnPicker();
    await Store.fetchCollections();
    Store.isSidebarVisible1 = true;
  };

  const selectvalue = (name) => {
    Store.tableName = name;
    Store.addCollection(name);
    Store.isSidebarVisible1 = false;
    console.log("Selected:", name, "->", toJS(Store.selectedCollections));
  };

  const handleclose = () => {
    Store.isSidebarVisible1 = false;
  };

  return (
    <div className="w-full h-screen relative">
      {/* Navbar */}
      <Navbar />

      {/* layout: left sidebar (18%) + main (rest) */}
      <div className="flex" >
        {/* Sidebar: narrowed to ~18% */}
        <div style={{ width: "10%", borderRight: "5px solid #ddd", minWidth: 220 }}>
          <FileExplorer />
        </div>

        {/* Main area */}
        <div style={{ flex: 1, position: "relative", }}>
          <FlowCanvas />
        </div>
      </div>

      {/* Top-right buttons: keep them above the table */}
      <div
        style={{
          position: "absolute",
          top: 65,
          right: 24,
          zIndex: 9999,
          display: "flex",
          gap: 12,
        
          padding:"px",
          marginTop:"auto",
          marginBottom:"auto",
          alignItems: "center",
          padding:"30px",
          borderRadius: 8,
        }}
      >
        <button
          className="p-3 rounded-full"
          title="Add / Select collection"
          style={{ background: "#10b981", color: "white", border: "none" }}
          onClick={Tableselect}
        >
          <FaPlus />
        </button>

        <button
          className="px-3 py-2 rounded-md"
          style={{ background: "#2563eb", color: "white", border: "none" }}
          onClick={Store.saveFile}
        >
          Save
        </button>

        <button
          className="px-3 py-2 rounded-md"
          style={{ background: "#2563eb", color: "white", border: "none" }}
          onClick={Store.saveFileAs}
        >
          Save As
        </button>

        <button
          className="px-3 py-2 rounded-md"
          style={{ background: "#2563eb", color: "white", border: "none" }}
          onClick={Store.downloadLastExport}
        >
          Download
        </button>
      </div>

      
      {/* popup modal for selecting collections */}
      {Store.isSidebarVisible1 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "#fff",
            boxShadow: "0 6px 24px rgba(0,0,0,0.2)",
            padding: 20,
            borderRadius: 8,
            zIndex: 2000,
            width: 360,
            maxHeight: "70vh",
            overflowY: "auto",
          }}
        >
          <button onClick={handleclose} style={{ position: "absolute", right: 12, top: 12, border: "none", background: "red", fontSize: 18 , padding:4, }}>
            ✕
          </button>

          <h3 style={{ marginBottom: 12 }}>Select a Collection</h3>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {(Store.tablenames || []).map((table, idx) => (
              <li
                key={idx}
                onClick={() => selectvalue(table)}
                style={{
                  padding: "8px 10px",
                  cursor: "pointer",
                  borderRadius: 6,
                  marginBottom: 6,
                  
                }}
              >
                {table}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default FlowDiagram;
