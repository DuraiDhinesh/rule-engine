import React from "react";
import { observer } from "mobx-react-lite";
import { FaPlus } from "react-icons/fa";
import { CiEdit, CiTrash } from "react-icons/ci";

const ExplorerNode = observer(({ node, store, level = 0 }) => {
//   const handlePlus = () => {
//     store.openColumnPicker(node.id);
//   };
const handlePlus = () => {
  if (node.type === "collection") {
    // collection plus → fetch fields
    store.openColumnPicker(node.id);
  } else if (node.type === "column") {
    if (level >= 2) {
      // only for second-level or deeper columns
      store.openRuleGroupPicker(node.id, node.name);
    } else {
      // for first-level column → fetch subfields
      store.openColumnPicker(node.id);
    }
  }
};

  return (
    <div className="pl-2 ">
      <div
        className="flex items-center gap-2 py-1"
        style={{ marginLeft: level * 15 }} //  indentation by level
      >
        {/* NODE NAME */}
        <span
          className={`truncate ${
            node.type == "root"
             ? "font-bold text-purple-400"       // root node = purple
      : node.type === "collection"
              ? "font-bold text-blue-400"
              : "text-gray-200"
          }`}
        >
          {node.name}
        </span>

        {/* PLUS */}
        <button
          className="p-1 rounded bg-green-500 text-white hover:bg-green-600"
          onClick={handlePlus}
          title="Add child"
        >
          <FaPlus size={12} />
        </button>

        {/* EDIT */}
        <button
          className="p-1 rounded bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => store.editNode(node.id)}
          title="Edit"
        >
          <CiEdit size={14} />
        </button>

        {/* DELETE */}
        <button
          className="p-1 rounded bg-danger text-red-600 hover:text-red-800"
          onClick={() => store.deleteNode(node.id)}
          title="Delete"
        >
          <CiTrash size={14} />
        </button>
      </div>

      {/* my recursion trre*/}
      {node.children?.length > 0 && (
        <div>
          {node.children.map((child) => (
            <ExplorerNode
              key={child.id}
              node={child}
              store={store}
              level={level + 1} //  pass level down for indentation
            />
          ))}
        </div>
      )}
    </div>
  );
});

export default ExplorerNode;
