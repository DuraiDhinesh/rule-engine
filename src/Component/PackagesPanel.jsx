// PackagesPanel.jsx
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import Store from "../Store";
import axios from "axios";
import Swal from "sweetalert2";


const PackagesPanel = observer(() => {
  useEffect(() => {
    // fetch packages from DB on mount
    Store.fetchFlowsFromDB();
  }, []);

  return (
    <div className="p-3 bg-gray-50 rounded-lg shadow-md max-h-[60vh] overflow-auto">
      <h3 className="text-lg font-bold mb-2">Saved Packages</h3>
      <button
        className="mb-3 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => Store.fetchFlowsFromDB()}
      >
        Refresh
      </button>

      {Store.packages.length === 0 ? (
        <p className="text-gray-500">No packages saved</p>
      ) : (
        <ul className="space-y-2">
          {Store.packages.map((pkg) => (
            <li
              key={pkg._id || pkg.packageId}
              className="p-2 bg-white border rounded shadow-sm flex flex-col"
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{pkg.packageId}</span>
                <span className="text-xs text-gray-500">
                  {new Date(pkg.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-600">{pkg.notes}</div>
              <div className="flex gap-2 mt-2">
               <button
  className="px-2 py-1 bg-green-500 text-white rounded"
  onClick={async () => {
    const pkg = await axios.get(`http://localhost:4000/api/flows/${pkg._id}`);
    Store.applySnapshot(pkg.data.snapshot); // restore flow in canvas
    Swal.fire("Restored", `${pkg.packageId} loaded`, "success");
  }}
>
  Restore
</button>

                <button
                  className="px-2 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
                  onClick={() => {
                    const blob = new Blob(
                      [JSON.stringify(pkg.snapshot, null, 2)],
                      { type: "application/json" }
                    );
                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `${pkg.packageId}.json`;
                    a.click();
                  }}
                >
                  Download
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default PackagesPanel;
