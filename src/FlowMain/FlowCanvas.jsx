import React from "react";
import { observer } from "mobx-react";
import Swal from "sweetalert2";
import Store from "../Store";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";

const FlowCanvas = observer(() => {
  // 🧠 Group all engines by RuleId (same RuleId = same table)
  const groupedByRuleId = {};
  Store.engines.forEach((engine) => {
    const nodes = engine.nodes
      .map((id) => Store.nodes.find((n) => n.id === id))
      .filter(Boolean);
    const rowData = {};
    nodes.forEach((node) => (rowData[node.data.label] = node.data.value));

    const ruleId = rowData.RuleId || "Unassigned";
    if (!groupedByRuleId[ruleId]) groupedByRuleId[ruleId] = [];
    groupedByRuleId[ruleId].push({ engine, rowData });
  });

  // ✏ Edit Rule (redesigned popup)
  const handleEditRule = async (engId) => {
    const engine = Store.engines.find((e) => e.id === engId);
    if (!engine) return;

    const row = {};
    engine.nodes.forEach((id) => {
      const node = Store.nodes.find((n) => n.id === id);
      if (node) row[node.data.label] = node.data.value;
    });

    const { value: formValues } = await Swal.fire({
      title: '<div style="color: #1e293b; font-weight: 700; font-size: 1.5rem; margin-bottom: 0.5rem;">Edit Rule</div>',
      html: `
        <div style="padding: 1rem 0.5rem;">
          <!-- ConditionId Input -->
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; text-align: left;">
              Condition ID
            </label>
            <input 
              id="condId" 
              type="text"
              placeholder="Enter Condition ID" 
              value="${row.ConditionId || ""}"
              style="
                width: 100%;
                padding: 0.75rem 1rem;
                border: 2px solid #e2e8f0;
                border-radius: 0.75rem;
                font-size: 0.9375rem;
                color: #1e293b;
                background: #ffffff;
                transition: all 0.2s ease;
                outline: none;
              "
              onfocus="this.style.borderColor='#6366f1'; this.style.boxShadow='0 0 0 3px rgba(99, 102, 241, 0.1)';"
              onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
            />
          </div>

          ${["SelectAttribute", "Condition", "SelectValue"]
            .map(
              (field) => `
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; text-align: left;">
                  ${field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div class="dropdown-container" style="position: relative;">
                  <div 
                    class="dropdown-trigger" 
                    id="${field}Trigger"
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      width: 100%;
                      padding: 0.75rem 1rem;
                      background: linear-gradient(to bottom, #ffffff, #f8fafc);
                      border: 2px solid #e2e8f0;
                      border-radius: 0.75rem;
                      cursor: pointer;
                      font-size: 0.9375rem;
                      color: #1e293b;
                      transition: all 0.2s ease;
                    "
                    onmouseover="this.style.borderColor='#cbd5e1'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.1)';"
                    onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                  >
                    <span id="${field}Text" style="color: ${row[field] ? '#1e293b' : '#94a3b8'};">
                      ${row[field] || `Select ${field.replace(/([A-Z])/g, ' $1').trim()}`}
                    </span>
                    <svg 
                      class="dropdown-arrow" 
                      style="width: 20px; height: 20px; color: #64748b; transition: transform 0.2s ease;"
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                  <div 
                    class="dropdown-list" 
                    id="${field}List"
                    style="
                      display: none;
                      position: absolute;
                      top: calc(100% + 0.5rem);
                      left: 0;
                      right: 0;
                      background: #ffffff;
                      border: 2px solid #e2e8f0;
                      border-radius: 0.75rem;
                      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
                      z-index: 9999;
                      max-height: 240px;
                      overflow-y: auto;
                      animation: slideDown 0.2s ease;
                    "
                  >
                    ${(field === "SelectAttribute"
                      ? ["Age", "Salary", "Country", "Gender"]
                      : field === "Condition"
                      ? ["equals", "not equals", "greater than", "less than", "contains"]
                      : ["10", "20", "30", "True", "False"]
                    )
                      .map(
                        (v) => `
                        <div 
                          class="dropdown-option" 
                          data-value="${v}"
                          style="
                            padding: 0.75rem 1rem;
                            cursor: pointer;
                            font-size: 0.9375rem;
                            color: #334155;
                            transition: all 0.15s ease;
                            border-left: 3px solid transparent;
                          "
                          onmouseover="this.style.background='#f1f5f9'; this.style.borderLeftColor='#6366f1'; this.style.color='#6366f1';"
                          onmouseout="this.style.background='transparent'; this.style.borderLeftColor='transparent'; this.style.color='#334155';"
                        >
                          ${v}
                        </div>`
                      )
                      .join("")}
                  </div>
                </div>
              </div>`
            )
            .join("")}

          <!-- Flag Toggle -->
          <div style="margin-top: 1.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.75rem; text-align: left;">
              Flag Status
            </label>
            <div style="
              display: flex;
              align-items: center;
              gap: 1rem;
              padding: 1rem;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border: 2px solid #e2e8f0;
              border-radius: 0.75rem;
            ">
              <label class="switch" style="position: relative; display: inline-block; width: 52px; height: 28px; flex-shrink: 0;">
                <input 
                  type="checkbox" 
                  id="flagSwitch" 
                  ${row.Flag === "True" ? "checked" : ""}
                  style="opacity: 0; width: 0; height: 0;"
                />
                <span 
                  class="slider"
                  style="
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
                    border-radius: 28px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                  "
                >
                  <span style="
                    position: absolute;
                    content: '';
                    height: 22px;
                    width: 22px;
                    left: 3px;
                    bottom: 3px;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 50%;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  "></span>
                </span>
              </label>
              <span 
                id="flagLabel"
                style="
                  font-size: 0.9375rem;
                  font-weight: 600;
                  color: ${row.Flag === "True" ? "#6366f1" : "#64748b"};
                  transition: color 0.3s ease;
                "
              >
                ${row.Flag === "True" ? "True" : "False"}
              </span>
            </div>
          </div>
        </div>

        <style>
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          input[type="checkbox"]:checked + .slider {
            background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%) !important;
          }

          input[type="checkbox"]:checked + .slider span {
            transform: translateX(24px);
          }

          .dropdown-list::-webkit-scrollbar {
            width: 6px;
          }

          .dropdown-list::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }

          .dropdown-list::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .dropdown-list::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        </style>
      `,
      didOpen: () => {
        const dropdowns = ["SelectAttribute", "Condition", "SelectValue"];
        dropdowns.forEach((field) => {
          const trigger = document.getElementById(`${field}Trigger`);
          const list = document.getElementById(`${field}List`);
          const text = document.getElementById(`${field}Text`);
          const arrow = trigger?.querySelector(".dropdown-arrow");

          trigger?.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = list?.style.display === "block";
            document.querySelectorAll(".dropdown-list").forEach((el) => (el.style.display = "none"));
            document.querySelectorAll(".dropdown-arrow").forEach((a) => (a.style.transform = "rotate(0deg)"));
            if (list) list.style.display = isOpen ? "none" : "block";
            if (arrow) arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
          });

          list?.querySelectorAll(".dropdown-option").forEach((opt) => {
            opt.addEventListener("click", () => {
              if (text) text.textContent = opt.textContent || "";
              if (text) text.style.color = "#1e293b";
              if (trigger) trigger.setAttribute("data-value", opt.getAttribute("data-value") || "");
              if (list) list.style.display = "none";
              if (arrow) arrow.style.transform = "rotate(0deg)";
            });
          });

          document.addEventListener("click", (e) => {
            if (trigger && list && !trigger.contains(e.target) && !list.contains(e.target)) {
              list.style.display = "none";
              if (arrow) arrow.style.transform = "rotate(0deg)";
            }
          });
        });

        const flagSwitch = document.getElementById("flagSwitch");
        const flagLabel = document.getElementById("flagLabel");
        flagSwitch?.addEventListener("change", () => {
          if (flagLabel) {
            flagLabel.textContent = flagSwitch.checked ? "True" : "False";
            flagLabel.style.color = flagSwitch.checked ? "#6366f1" : "#64748b";
          }
        });
      },
      preConfirm: () => ({
        ConditionId: document.getElementById("condId")?.value || "",
        SelectAttribute:
          document.getElementById("SelectAttributeTrigger")?.getAttribute("data-value") ||
          document.getElementById("SelectAttributeText")?.textContent?.trim() || "",
        Condition:
          document.getElementById("ConditionTrigger")?.getAttribute("data-value") ||
          document.getElementById("ConditionText")?.textContent?.trim() || "",
        SelectValue:
          document.getElementById("SelectValueTrigger")?.getAttribute("data-value") ||
          document.getElementById("SelectValueText")?.textContent?.trim() || "",
        Flag: document.getElementById("flagSwitch")?.checked ? "True" : "False",
      }),
      showCancelButton: true,
      confirmButtonText: "Update Rule",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "swal-custom-popup",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
      width: "600px",
      padding: "2rem",
      background: "#ffffff",
      backdrop: "rgba(0, 0, 0, 0.4)",
    });

    if (formValues) {
      Object.keys(formValues).forEach((label) => {
        if (!formValues[label]) return;
        let node = Store.nodes.find(
          (n) => n.data.label === label && engine.nodes.includes(n.id)
        );
        if (!node) {
          const newNodeId = `${label}_${Date.now()}`;
          const newNode = {
            id: newNodeId,
            type: "default",
            data: { label, value: formValues[label] },
            position: { x: 0, y: 0 },
          };
          Store.nodes.push(newNode);
          engine.nodes.push(newNodeId);
        } else {
          node.data.value = formValues[label];
        }
      });
      Swal.fire({
        title: "Success!",
        text: "Rule updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
    }
  };

  // ➕ Quick Add Rule (no popup)
  const handleQuickAddRule = (ruleId) => {
    const newEngineId = `engine_${Date.now()}`;
    const newEngine = { id: newEngineId, nodes: [] };
    
    const defaultValues = {
      ConditionSetId: `CS_${Date.now()}`,
      RuleId: ruleId,
      ConditionId: "",
      SelectAttribute: "",
      Condition: "",
      SelectValue: "",
      Flag: "False",
    };
    
    Object.keys(defaultValues).forEach((label) => {
      const newNodeId = `${label}_${Date.now()}_${Math.random()}`;
      const newNode = {
        id: newNodeId,
        type: "default",
        data: { label, value: defaultValues[label] },
        position: { x: 0, y: 0 },
      };
      Store.nodes.push(newNode);
      newEngine.nodes.push(newNodeId);
    });

    Store.engines.push(newEngine);
  };

  // ➕ Add Rule to Group (with popup)
  const handleAddRule = async (ruleId) => {
    const { value: formValues } = await Swal.fire({
      title: '<div style="color: #1e293b; font-weight: 700; font-size: 1.5rem; margin-bottom: 0.5rem;">Add New Rule</div>',
      html: `
        <div style="padding: 1rem 0.5rem;">
          <!-- ConditionId Input -->
          <div style="margin-bottom: 1.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; text-align: left;">
              Condition ID
            </label>
            <input 
              id="condId" 
              type="text"
              placeholder="Enter Condition ID" 
              value=""
              style="
                width: 100%;
                padding: 0.75rem 1rem;
                border: 2px solid #e2e8f0;
                border-radius: 0.75rem;
                font-size: 0.9375rem;
                color: #1e293b;
                background: #ffffff;
                transition: all 0.2s ease;
                outline: none;
              "
              onfocus="this.style.borderColor='#6366f1'; this.style.boxShadow='0 0 0 3px rgba(99, 102, 241, 0.1)';"
              onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='none';"
            />
          </div>

          ${["SelectAttribute", "Condition", "SelectValue"]
            .map(
              (field) => `
              <div style="margin-bottom: 1.5rem;">
                <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.5rem; text-align: left;">
                  ${field.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div class="dropdown-container" style="position: relative;">
                  <div 
                    class="dropdown-trigger" 
                    id="${field}Trigger"
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      width: 100%;
                      padding: 0.75rem 1rem;
                      background: linear-gradient(to bottom, #ffffff, #f8fafc);
                      border: 2px solid #e2e8f0;
                      border-radius: 0.75rem;
                      cursor: pointer;
                      font-size: 0.9375rem;
                      color: #94a3b8;
                      transition: all 0.2s ease;
                    "
                    onmouseover="this.style.borderColor='#cbd5e1'; this.style.transform='translateY(-1px)'; this.style.boxShadow='0 4px 6px -1px rgba(0,0,0,0.1)';"
                    onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                  >
                    <span id="${field}Text" style="color: #94a3b8;">
                      Select ${field.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <svg 
                      class="dropdown-arrow" 
                      style="width: 20px; height: 20px; color: #64748b; transition: transform 0.2s ease;"
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                  <div 
                    class="dropdown-list" 
                    id="${field}List"
                    style="
                      display: none;
                      position: absolute;
                      top: calc(100% + 0.5rem);
                      left: 0;
                      right: 0;
                      background: #ffffff;
                      border: 2px solid #e2e8f0;
                      border-radius: 0.75rem;
                      box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
                      z-index: 9999;
                      max-height: 240px;
                      overflow-y: auto;
                      animation: slideDown 0.2s ease;
                    "
                  >
                    ${(field === "SelectAttribute"
                      ? ["Age", "Salary", "Country", "Gender"]
                      : field === "Condition"
                      ? ["equals", "not equals", "greater than", "less than", "contains"]
                      : ["10", "20", "30", "True", "False"]
                    )
                      .map(
                        (v) => `
                        <div 
                          class="dropdown-option" 
                          data-value="${v}"
                          style="
                            padding: 0.75rem 1rem;
                            cursor: pointer;
                            font-size: 0.9375rem;
                            color: #334155;
                            transition: all 0.15s ease;
                            border-left: 3px solid transparent;
                          "
                          onmouseover="this.style.background='#f1f5f9'; this.style.borderLeftColor='#6366f1'; this.style.color='#6366f1';"
                          onmouseout="this.style.background='transparent'; this.style.borderLeftColor='transparent'; this.style.color='#334155';"
                        >
                          ${v}
                        </div>`
                      )
                      .join("")}
                  </div>
                </div>
              </div>`
            )
            .join("")}

          <!-- Flag Toggle -->
          <div style="margin-top: 1.5rem;">
            <label style="display: block; font-size: 0.875rem; font-weight: 600; color: #475569; margin-bottom: 0.75rem; text-align: left;">
              Flag Status
            </label>
            <div style="
              display: flex;
              align-items: center;
              gap: 1rem;
              padding: 1rem;
              background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
              border: 2px solid #e2e8f0;
              border-radius: 0.75rem;
            ">
              <label class="switch" style="position: relative; display: inline-block; width: 52px; height: 28px; flex-shrink: 0;">
                <input 
                  type="checkbox" 
                  id="flagSwitch" 
                  style="opacity: 0; width: 0; height: 0;"
                />
                <span 
                  class="slider"
                  style="
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%);
                    border-radius: 28px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                  "
                >
                  <span style="
                    position: absolute;
                    content: '';
                    height: 22px;
                    width: 22px;
                    left: 3px;
                    bottom: 3px;
                    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
                    border-radius: 50%;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                  "></span>
                </span>
              </label>
              <span 
                id="flagLabel"
                style="
                  font-size: 0.9375rem;
                  font-weight: 600;
                  color: #64748b;
                  transition: color 0.3s ease;
                "
              >
                False
              </span>
            </div>
          </div>
        </div>

        <style>
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          input[type="checkbox"]:checked + .slider {
            background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%) !important;
          }

          input[type="checkbox"]:checked + .slider span {
            transform: translateX(24px);
          }

          .dropdown-list::-webkit-scrollbar {
            width: 6px;
          }

          .dropdown-list::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }

          .dropdown-list::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }

          .dropdown-list::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        </style>
      `,
      didOpen: () => {
        const dropdowns = ["SelectAttribute", "Condition", "SelectValue"];
        dropdowns.forEach((field) => {
          const trigger = document.getElementById(`${field}Trigger`);
          const list = document.getElementById(`${field}List`);
          const text = document.getElementById(`${field}Text`);
          const arrow = trigger?.querySelector(".dropdown-arrow");

          trigger?.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = list?.style.display === "block";
            document.querySelectorAll(".dropdown-list").forEach((el) => (el.style.display = "none"));
            document.querySelectorAll(".dropdown-arrow").forEach((a) => (a.style.transform = "rotate(0deg)"));
            if (list) list.style.display = isOpen ? "none" : "block";
            if (arrow) arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
          });

          list?.querySelectorAll(".dropdown-option").forEach((opt) => {
            opt.addEventListener("click", () => {
              if (text) text.textContent = opt.textContent || "";
              if (text) text.style.color = "#1e293b";
              if (trigger) trigger.setAttribute("data-value", opt.getAttribute("data-value") || "");
              if (list) list.style.display = "none";
              if (arrow) arrow.style.transform = "rotate(0deg)";
            });
          });

          document.addEventListener("click", (e) => {
            if (trigger && list && !trigger.contains(e.target) && !list.contains(e.target)) {
              list.style.display = "none";
              if (arrow) arrow.style.transform = "rotate(0deg)";
            }
          });
        });

        const flagSwitch = document.getElementById("flagSwitch");
        const flagLabel = document.getElementById("flagLabel");
        flagSwitch?.addEventListener("change", () => {
          if (flagLabel) {
            flagLabel.textContent = flagSwitch.checked ? "True" : "False";
            flagLabel.style.color = flagSwitch.checked ? "#6366f1" : "#64748b";
          }
        });
      },
      preConfirm: () => ({
        ConditionId: document.getElementById("condId")?.value || "",
        SelectAttribute:
          document.getElementById("SelectAttributeTrigger")?.getAttribute("data-value") ||
          document.getElementById("SelectAttributeText")?.textContent?.trim() || "",
        Condition:
          document.getElementById("ConditionTrigger")?.getAttribute("data-value") ||
          document.getElementById("ConditionText")?.textContent?.trim() || "",
        SelectValue:
          document.getElementById("SelectValueTrigger")?.getAttribute("data-value") ||
          document.getElementById("SelectValueText")?.textContent?.trim() || "",
        Flag: document.getElementById("flagSwitch")?.checked ? "True" : "False",
        RuleId: ruleId,
      }),
      showCancelButton: true,
      confirmButtonText: "Add Rule",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "swal-custom-popup",
        confirmButton: "swal-confirm-btn",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
      width: "600px",
      padding: "2rem",
      background: "#ffffff",
      backdrop: "rgba(0, 0, 0, 0.4)",
    });

    if (formValues) {
      const newEngineId = `engine_${Date.now()}`;
      const newEngine = { id: newEngineId, nodes: [] };
      
      Object.keys(formValues).forEach((label) => {
        if (!formValues[label]) return;
        const newNodeId = `${label}_${Date.now()}_${Math.random()}`;
        const newNode = {
          id: newNodeId,
          type: "default",
          data: { label, value: formValues[label] },
          position: { x: 0, y: 0 },
        };
        Store.nodes.push(newNode);
        newEngine.nodes.push(newNodeId);
      });

      Store.engines.push(newEngine);
      
      Swal.fire({
        title: "Success!",
        text: "Rule added successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "swal-confirm-btn",
        },
        buttonsStyling: false,
      });
    }
  };

  // 🗑 Delete Rule
  const handleDeleteRule = (engId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        confirmButton: "swal-confirm-btn-danger",
        cancelButton: "swal-cancel-btn",
      },
      buttonsStyling: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Store.engines = Store.engines.filter((e) => e.id !== engId);
        Swal.fire({
          title: "Deleted!",
          text: "Rule deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            confirmButton: "swal-confirm-btn",
          },
          buttonsStyling: false,
        });
      }
    });
  };

  return (
    <>
      <style>{`
        .swal-custom-popup {
          border-radius: 1rem !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
        }

        .swal-confirm-btn {
          background: linear-gradient(135deg, #6366f1 0%, #818cf8 100%) !important;
          color: white !important;
          border: none !important;
          border-radius: 0.75rem !important;
          padding: 0.75rem 2rem !important;
          font-size: 0.9375rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.3) !important;
        }

        .swal-confirm-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4) !important;
        }

        .swal-confirm-btn-danger {
          background: linear-gradient(135deg, #ef4444 0%, #f87171 100%) !important;
          color: white !important;
          border: none !important;
          border-radius: 0.75rem !important;
          padding: 0.75rem 2rem !important;
          font-size: 0.9375rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.3) !important;
        }

        .swal-confirm-btn-danger:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.4) !important;
        }

        .swal-cancel-btn {
          background: white !important;
          color: #64748b !important;
          border: 2px solid #e2e8f0 !important;
          border-radius: 0.75rem !important;
          padding: 0.75rem 2rem !important;
          font-size: 0.9375rem !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.2s ease !important;
          margin-right: 0.75rem !important;
        }

        .swal-cancel-btn:hover {
          background: #f8fafc !important;
          border-color: #cbd5e1 !important;
          color: #475569 !important;
        }
      `}</style>

      <div className="p-6 w-full h-full bg-white flex flex-col gap-6 rounded-4">
        <h2 className="text-lg font-semibold text-gray-800">Rules & Groups</h2>

        <div className="overflow-x-auto overflow-y-auto max-h-[500px] relative border rounded-lg p-3">
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
              <tr className="rounded-4">
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
              {Object.entries(groupedByRuleId).map(([ruleId, engines]) => (
                <React.Fragment key={ruleId}>
                  <tr className="bg-blue-100">
                    <td colSpan={8} className="px-3 py-2 border text-left font-semibold">
                      
                    </td>
                  </tr>
                  {engines.map(({ engine, rowData }, index) => (
                    <tr key={engine.id} className="hover:bg-gray-50">
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
                              onClick={() => handleQuickAddRule(ruleId)}
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
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
});

export default FlowCanvas;
