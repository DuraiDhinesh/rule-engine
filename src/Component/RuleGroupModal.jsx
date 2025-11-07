import React from "react";

const RuleGroupModal = ({ open, onClose, onSelect }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-72 text-center min-h-[200px]">
        <h3 className="text-lg font-bold mb-4">Choose Option</h3>
        
        <div className="flex flex-col gap-3">
          {/* Rule Button */}
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={() => onSelect("rule")}
          >
            Rule
          </button>

          {/* Group Button */}
          <button
            className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            onClick={() => onSelect("group")}
          >
            Group
          </button>
        </div>

        <button
          className="mt-4 text-red-500 underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default RuleGroupModal;
