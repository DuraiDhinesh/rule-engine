// src/Component/FileExplorer.jsx
import React from "react";
import { observer } from "mobx-react";
import Swal from "sweetalert2";

import Store from "../Store";
import ExplorerNode from "./ExplorerNode";
import ColumnPickerModal from "./ColumnPickerModal";
import RuleGroupModal from "./RuleGroupModal";

const FileExplorer = observer(() => {
  return (
    <div className="file-explorer p-4 text-black">
      {/* Collections */}
      {Store.explorer.length === 0 ? (
        <p className="text-gray-500">No collections selected</p>
      ) : (
        <ul className="space-y-2">
          {Store.explorer.map((n) => (
            <ExplorerNode key={n.id} node={n} store={Store} />
          ))}
        </ul>
      )}

      {/* Column Picker Modal */}
      <ColumnPickerModal
        open={Store.columnPicker.open}
        loading={Store.columnPicker.loading}
        error={Store.columnPicker.error}
        collectionName={Store.columnPicker.forCollectionName}
        columns={Store.columnPicker.items}
        onClose={() => Store.closeColumnPicker()}
        onSelect={(col) => Store.addColumnFromPicker(col)}
      />

      {/* Rule / Group Modal */}
      <RuleGroupModal
        open={Store.ruleGroupPicker.open}
        onClose={() => Store.closeRuleGroupPicker()}
        onSelect={(choice) => {
          if (choice === "group") {
            Swal.fire({
              title: "Enter group name",
              input: "text",
              inputPlaceholder: "e.g., groupA",
              showCancelButton: true,
              confirmButtonText: "Create",
              inputValidator: (val) =>
                !val || !val.trim() ? "Please enter a group name" : undefined,
            }).then((res) => {
              if (res.isConfirmed) {
                Store.createRuleEngineNodes("group", Store.activeCollection, res.value.trim());
                Swal.fire("Created", "Group engine created successfully!", "success");
                Store.closeRuleGroupPicker();
              }
            });
          } else {
            Store.activeGroupName = null;
            Store.createRuleEngineNodes(choice, Store.activeCollection);
            Swal.fire("Created", "Rule engine created successfully!", "success");
            Store.closeRuleGroupPicker();
          }
        }}
      />
    </div>
  );
});

export default FileExplorer;
