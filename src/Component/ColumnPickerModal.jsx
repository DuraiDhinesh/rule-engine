import React from "react";
const ColumnPickerModal = ({ open, columns, onClose, onSelect }) => {
  if (!open) return null;
  return (
    <div
  className="fixed inset-0 flex items-center justify-center"

  style={{
    backgroundColor: "transparent",
    zIndex: 9999, // ✅ ensures it's above everything
    position: "fixed", // ✅ enforce fixed positioning
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  }}
>
  <div
    className="bg-white p-4 rounded shadow-md w-64"
    style={{ zIndex: 10000 }} // ✅ inner box above backdrop
  >
    <h3 className="text-lg mb-2">Select Column</h3>
    {columns.length === 0 ? (
      <div className="text-sm text-gray-500">No columns found.</div>
    ) : (
      <ul>
        {columns.map((col, idx) => (
          <li
            key={idx}
            className="p-2 cursor-pointer hover:bg-gray-200"
            onClick={() => onSelect(col)}
          >
            {col}
          </li>
        ))}


      </ul>
    )}
    <button
      onClick={onClose}
      className="mt-3 bg-red-500 text-white px-3 py-1 rounded"
    >
      Close
    </button>
  </div>
</div>

   
  );
};

export default ColumnPickerModal;
