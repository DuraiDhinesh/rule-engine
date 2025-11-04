import React from "react";
import { observer } from "mobx-react";
import Swal from "sweetalert2";
import Store from "../Store.js";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaGripVertical,
} from "react-icons/fa";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

//
// 🧩 Reusable Dynamic Drag Row Component
//
const SortableRuleGroup = ({
  ruleId,
  children,
  buttonIcon: ButtonIcon = FaGripVertical,
  buttonTitle = "Drag to reorder",
  buttonClassName = "",
  onButtonClick,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ruleId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <>
      <tr
        ref={setNodeRef}
        style={style}
        className={`transition-colors duration-150 ${
          isDragging ? "bg-blue-200" : "bg-blue-100"
        }`}
      >
        <td colSpan={9} className="px-3 py-2 border text-left font-semibold">
          <div className="flex items-center gap-2">
            <button
              type="button"
              {...attributes}
              {...listeners}
              onClick={onButtonClick}
              className={`inline-flex items-center justify-center p-2 rounded-md 
                cursor-grab active:cursor-grabbing 
                text-gray-600 hover:text-gray-800 hover:bg-blue-200 
                focus:outline-none focus:ring-2 focus:ring-blue-400 
                transition-colors ${buttonClassName}`}
              title={buttonTitle}
            >
              <ButtonIcon
                size={16}
                aria-hidden="true"
                className={`${isDragging ? "text-blue-700" : ""}`}
              />
              
            </button>
            <span className="text-gray-700 font-medium">
              Rule Group: <span className="text-blue-700 ">{ruleId}</span>
            </span>
          </div>
        </td>
      </tr>
      {children}
    </>
  );
};

//
// 🧠 Main FlowCanvas Component
//
const FlowCanvas = observer(() => {
  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Group all engines by RuleId
  const groupedByRuleId = {};
  if (Store.engines && Array.isArray(Store.engines) && Store.nodes && Array.isArray(Store.nodes)) {
    Store.engines.forEach((engine) => {
      if (!engine || !engine.nodes) return;

      const nodes = engine.nodes
        .map((id) => Store.nodes.find((n) => n && n.id === id))
        .filter(Boolean);

      const rowData = {};
      nodes.forEach((node) => {
        if (node && node.data) {
          rowData[node.data.label] = node.data.value;
        }
      });

      const ruleId = rowData.RuleId || "Unassigned";
      if (!groupedByRuleId[ruleId]) groupedByRuleId[ruleId] = [];
      groupedByRuleId[ruleId].push({ engine, rowData });
    });
  }

  // Handle Rule Order
  const ruleIds = Object.keys(groupedByRuleId);
  if (Store.ruleOrder && Array.isArray(Store.ruleOrder)) {
    ruleIds.forEach((ruleId) => {
      if (!Store.ruleOrder.includes(ruleId)) {
        Store.ruleOrder.push(ruleId);
      }
    });
  }

  const orderedRuleIds =
    Store.ruleOrder && Array.isArray(Store.ruleOrder)
      ? Store.ruleOrder.filter((id) => ruleIds.includes(id))
      : ruleIds;

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id && Store.ruleOrder && Array.isArray(Store.ruleOrder)) {
      const oldIndex = Store.ruleOrder.indexOf(active.id);
      const newIndex = Store.ruleOrder.indexOf(over.id);
      const newOrder = arrayMove(Store.ruleOrder, oldIndex, newIndex);
      if (Store.reorderRules) {
        Store.reorderRules(newOrder);
      }
    }
  };
//
// 🔧 Edit / Add / Delete Handlers
//
const handleEditRule = async (engId) => {
  const engine = Store.engines.find((e) => e.id === engId);
  if (!engine) return;

  const nodes = engine.nodes
    .map((id) => Store.nodes.find((n) => n && n.id === id))
    .filter(Boolean);

  const currentData = {};
  nodes.forEach((node) => {
    if (node && node.data) {
      currentData[node.data.label] = node.data.value;
    }
  });

  const { value: formValues } = await Swal.fire({
    title: "Edit Rule",
    html: `
      <input id="swal-condition-id" class="swal2-input" placeholder="ConditionId" value="${currentData.ConditionId || ""}">
      <input id="swal-select-attr" class="swal2-input" placeholder="SelectAttribute" value="${currentData.SelectAttribute || ""}">
      <input id="swal-condition" class="swal2-input" placeholder="Condition" value="${currentData.Condition || ""}">
      <input id="swal-select-value" class="swal2-input" placeholder="SelectValue" value="${currentData.SelectValue || ""}">
      <input id="swal-flag" class="swal2-input" placeholder="Flag" value="${currentData.Flag || ""}">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Save Changes",
    customClass: {
      popup: "swal-custom-popup",
      confirmButton: "swal-confirm-btn",
      cancelButton: "swal-cancel-btn",
    },
    preConfirm: () => {
      return {
        ConditionId: document.getElementById("swal-condition-id").value,
        SelectAttribute: document.getElementById("swal-select-attr").value,
        Condition: document.getElementById("swal-condition").value,
        SelectValue: document.getElementById("swal-select-value").value,
        Flag: document.getElementById("swal-flag").value,
      };
    },
  });

  if (formValues) {
    Store.updateEngineNodeData(engId, formValues);
    Swal.fire({
      icon: "success",
      title: "Rule Updated",
      text: "The rule has been successfully updated.",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

const handleAddRule = async (ruleId) => {
  const { value: formValues } = await Swal.fire({
    title: "Add New Rule",
    html: `
      <input id="swal-condition-id" class="swal2-input" placeholder="ConditionId">
      <input id="swal-select-attr" class="swal2-input" placeholder="SelectAttribute">
      <input id="swal-condition" class="swal2-input" placeholder="Condition">
      <input id="swal-select-value" class="swal2-input" placeholder="SelectValue">
      <input id="swal-flag" class="swal2-input" placeholder="Flag">
    `,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: "Add Rule",
    customClass: {
      popup: "swal-custom-popup",
      confirmButton: "swal-confirm-btn",
      cancelButton: "swal-cancel-btn",
    },
    preConfirm: () => {
      return {
        RuleId: ruleId,
        ConditionId: document.getElementById("swal-condition-id").value,
        SelectAttribute: document.getElementById("swal-select-attr").value,
        Condition: document.getElementById("swal-condition").value,
        SelectValue: document.getElementById("swal-select-value").value,
        Flag: document.getElementById("swal-flag").value,
      };
    },
  });

  if (formValues) {
    Store.addNewEngineForRule(formValues);
    Swal.fire({
      icon: "success",
      title: "Rule Added",
      text: "A new rule has been successfully added.",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

const handleDeleteRule = async (engId) => {
  const result = await Swal.fire({
    title: "Delete this rule?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "swal-custom-popup",
      confirmButton: "swal-confirm-btn-danger",
      cancelButton: "swal-cancel-btn",
    },
  });

  if (result.isConfirmed) {
    Store.deleteEngine(engId);
    Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "The rule has been removed.",
      timer: 1500,
      showConfirmButton: false,
    });
  }
};

  return (
    <>
      {/* SweetAlert2 Styling (untouched) */}
      <style>{`
        .swal-custom-popup { border-radius: 1rem !important; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
        .swal-confirm-btn {
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%) !important;
          color: white !important; border: none !important; border-radius: 0.75rem !important;
          padding: 0.75rem 2rem !important; font-size: 0.9375rem !important; font-weight: 600 !important;
          cursor: pointer !important; transition: all 0.2s ease !important;
          box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3) !important;
        }
        .swal-confirm-btn:hover { transform: translateY(-2px) !important; box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4) !important; }
        .swal-confirm-btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #f87171 100%) !important;
          color: white !important; border: none !important; border-radius: 0.75rem !important;
          padding: 0.75rem 2rem !important; font-size: 0.9375rem !important; font-weight: 600 !important;
          cursor: pointer !important; transition: all 0.2s ease !important;
          box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3) !important;
        }
        .swal-cancel-btn {
          background: white !important; color: #64748b !important; border: 2px solid #e2e8f0 !important;
          border-radius: 0.75rem !important; padding: 0.75rem 2rem !important;
          font-size: 0.9375rem !important; font-weight: 600 !important; cursor: pointer !important;
          transition: all 0.2s ease !important; margin-right: 0.75rem !important;
        }
      `}</style>

      <div className="p-6 w-full h-full bg-white flex flex-col gap-6 rounded-4">
        <h2 className="text-lg font-semibold text-gray-800">Rules & Groups</h2>

        <div className="overflow-x-auto overflow-y-auto max-h-[500px] relative border rounded-lg p-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedRuleIds}
              strategy={verticalListSortingStrategy}
            >
              <table className="w-full border-collapse table-fixed">
                <thead
                  className="text-gray-800"
                  style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 50,
                    backgroundColor: "#2563eb",
                    color: "#fff",
                  }}
                >
                  <tr>
                    <th className="px-3 py-2 border font-medium text-sm text-center w-12"></th>
                    {[
                      "ConditionSetId",
                      "RuleId",
                      "ConditionId",
                      "SelectAttribute",
                      "Condition",
                      "SelectValue",
                      "Flag",
                      "Actions",
                    ].map((col) => (
                      <th
                        key={col}
                        className="px-3 py-2 border font-medium text-sm text-center"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {orderedRuleIds.map((ruleId) => {
                    const engines = groupedByRuleId[ruleId];
                    if (!engines) return null;

                    return (
                      <SortableRuleGroup
                        key={ruleId}
                        ruleId={ruleId}
                        buttonTitle="Reorder group"
                        buttonIcon={FaGripVertical}
                      >
                        {engines.map(({ engine, rowData }, index) => (
                          <tr key={engine.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 border text-center"></td>
                            <td className="px-3 py-2 border text-center">
                              {rowData.ConditionSetId || "-"}
                            </td>
                            <td className="px-3 py-2 border text-center">
                              {rowData.RuleId || "-"}
                            </td>
                            <td className="px-3 py-2 border text-center">
                              {rowData.ConditionId || "-"}
                            </td>
                            <td className="px-3 py-2 border text-center">
                              {rowData.SelectAttribute || "-"}
                            </td>
                            <td className="px-3 py-2 border text-center">
                              {rowData.Condition || "-"}
                            </td>
                            <td className="px-3 py-2 border text-center">
                              {rowData.SelectValue || "-"}
                            </td>
                            <td className="px-3 py-2 border text-center">
                              {rowData.Flag || "-"}
                            </td>
                            <td className="px-3 py-2 border text-center">
                              <div className="flex justify-center gap-3">
                                <button
                                  onClick={() => handleEditRule(engine.id)}
                                  className="text-blue-600 hover:text-blue-800"
                                  title="Edit Rule"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  onClick={() => handleDeleteRule(engine.id)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Delete Rule"
                                >
                                  <FaTrash />
                               </button>
                                {index === engines.length - 1 && engines.length > 1 && (
                                  <button
                                     onClick={() => handleAddRule(ruleId)}
                                    className="text-green-600 hover:text-green-800"
                                    title="Add New Rule"
                                  >
                                    <FaPlus />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </SortableRuleGroup>
                    );
                  })}
                </tbody>
              </table>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );
});

export default FlowCanvas;
