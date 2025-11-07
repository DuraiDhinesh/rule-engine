import React from "react";
import { createPortal } from "react-dom";
import { runInAction } from "mobx";
import Swal from "sweetalert2";
import Store from "../Store";

const FlagPopup = ({ nodeId, onClose }) => {
  const handleSelect = (value) => {
    runInAction(() => {
      const node = Store.nodes.find((n) => n.id === nodeId);
      if (node && node.data) {
        node.data.label1 = value; // ✅ Update node label with True/False
      }
    });

    // ✅ Always show success message
    Swal.fire({
      icon: "success",
      title: "Rule Created",
      text: "Rule created successfully 🎉",
      timer: 2000,
      showConfirmButton: false,
    });

    onClose(); // ✅ Close popup
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "12px",
          width: "300px",
          textAlign: "center",
          boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          Select Flag Value
        </h3>
        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <button
            style={{
              backgroundColor: "#27ae60",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={() => handleSelect("True")}
          >
            TRUE
          </button>
          <button
            style={{
              backgroundColor: "#c0392b",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
            onClick={() => handleSelect("False")}
          >
            FALSE
          </button>
        </div>
        <button
          style={{
            backgroundColor: "#7f8c8d",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "6px",
            fontSize: "14px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body
  );
};

export default FlagPopup;
