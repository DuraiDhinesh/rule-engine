import React, { useState } from "react";
import { createPortal } from "react-dom";
import Swal from "sweetalert2";
import Store from "../Store";

export default function EditRulePopup({ rule, onClose }) {
  const [values, setValues] = useState({
    ConditionId: rule.ConditionId || "",
    SelectAttribute: rule.SelectAttribute || "",
    Condition: rule.Condition || "",
    SelectValue: rule.SelectValue || "",
    Flag: rule.Flag || "",
  });

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  const handleSave = () => {
    const engine = Store.engines.find((e) => e.id === rule._engineId);
    if (!engine) return;
    engine.nodes.forEach((id) => {
      const node = Store.nodes.find((n) => n.id === id);
      if (!node) return;
      const field = node.data.label;
      if (values[field] !== undefined) node.data.value = values[field];
    });
    Swal.fire("Updated", "Rule updated successfully!", "success");
    onClose();
  };

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: "Delete Rule?",
      text: "Do you want to delete this entire rule?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (!confirm.isConfirmed) return;
    const eng = Store.engines.find((e) => e.id === rule._engineId);
    if (!eng) return;
    eng.nodes.forEach((id) => Store.removeNode(id));
    Store.engines = Store.engines.filter((e) => e.id !== rule._engineId);
    Swal.fire("Deleted", "Rule removed successfully!", "success");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl p-6 w-[450px] shadow-2xl relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4 text-gray-700">Edit Rule</h3>

        <div className="grid grid-cols-1 gap-3">
          {Object.keys(values).map((key) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                {key}
              </label>
              <input
                name={key}
                value={values[key]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleDelete}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
