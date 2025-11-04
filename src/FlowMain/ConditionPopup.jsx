import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { runInAction } from "mobx";
import Store from "../Store";

export default function ConditionPopup({ open, onClose, nodeId, collectionName }) {
  const [columns, setColumns] = useState([]);
  const [values, setValues] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [loadingValues, setLoadingValues] = useState(false);
  const [error, setError] = useState("");

  // 🧩 Fetch available columns
  useEffect(() => {
    if (!collectionName) return;
    axios
      .get(`http://localhost:4000/columns?collection=${collectionName}`)
      .then((res) => setColumns(Array.isArray(res.data) ? res.data : []))
      .catch(() => setColumns([]));
  }, [collectionName]);

  // 🔍 Fetch values when column changes
  useEffect(() => {
    if (!selectedColumn) return;
    setLoadingValues(true);
    axios
      .get(`http://localhost:4000/values?collection=${collectionName}&column=${selectedColumn}`)
      .then((res) => setValues(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Error fetching values"))
      .finally(() => setLoadingValues(false));
  }, [selectedColumn, collectionName]);

  const handleSave = () => {
    if (!selectedColumn || !selectedValue) return;

    runInAction(() => {
      const node = Store.nodes.find((n) => n.id === nodeId);
      if (node && node.data) {
        node.data.selectedColumn = selectedColumn;
        node.data.value = selectedValue;
        node.data.label1 = `${selectedColumn} = ${selectedValue}`;
      }
    });

    onClose();
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl p-6 w-[420px] max-h-[80vh] overflow-y-auto relative"
        >
          {/* ❌ Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-pink-500 text-white w-8 h-8 rounded-full hover:bg-pink-600 transition"
          >
            ✕
          </button>

          {/* 🧱 Header */}
          <h3 className="text-lg font-semibold mb-5 text-gray-800 border-b pb-2">
            Add Condition
          </h3>

          {/* 📊 Attribute selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select Attribute
              </label>
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              >
                <option value="">-- Choose Attribute --</option>
                {columns.map((col, idx) => (
                  <option key={idx} value={col}>
                    {col}
                  </option>
                ))}
              </select>
            </div>

            {/* 🎯 Value selection */}
            {selectedColumn && (
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Select Value
                </label>

                {loadingValues ? (
                  <div className="text-gray-400 italic text-sm">Loading...</div>
                ) : error ? (
                  <div className="text-red-500 text-sm">{error}</div>
                ) : (
                  <select
                    value={selectedValue}
                    onChange={(e) => setSelectedValue(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                  >
                    <option value="">-- Choose Value --</option>
                    {values.map((v, idx) => (
                      <option key={idx} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>

          {/* ✅ Save */}
          <div className="mt-6">
            <button
              disabled={!selectedColumn || !selectedValue}
              onClick={handleSave}
              className={`w-full py-2 rounded-md text-white font-medium transition ${
                selectedColumn && selectedValue
                  ? "bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              Save Condition
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
