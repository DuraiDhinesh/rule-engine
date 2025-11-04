import { motion, AnimatePresence } from "framer-motion";

export default function SelectAttributePopup({
  open,
  columns,
  onSelect,
  onClose,
}) {
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
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", duration: 0.4 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl p-6 w-[400px] max-h-[80vh] overflow-y-auto relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-pink-500 text-white w-8 h-8 rounded-full hover:bg-pink-600 transition"
          >
            ✕
          </button>

          {/* Header */}
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            Select Attribute
          </h3>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search attributes..."
            className="w-full border border-gray-300 rounded-md p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* List of Columns */}
          <ul className="space-y-1 max-h-60 overflow-y-auto">
            {columns?.length > 0 ? (
              columns.map((col, idx) => (
                <li
                  key={idx}
                  onClick={() => onSelect(col)}
                  className="p-2 cursor-pointer rounded-md hover:bg-blue-50 transition text-gray-700"
                >
                  {col}
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No attributes found.</p>
            )}
          </ul>

          <button
            className="mt-6 w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-md hover:from-blue-600 hover:to-blue-800 transition"
            onClick={onClose}
          >
            Done
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
