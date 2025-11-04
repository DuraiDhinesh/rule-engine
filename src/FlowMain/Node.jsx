import React, { useRef, useEffect, useState, useCallback } from "react";
import { select } from "d3-selection";
import { drag as d3Drag } from "d3-drag";
import { observer } from "mobx-react";
import Store from "../Store";
import { CiEdit } from "react-icons/ci";
import { FaCaretDown, FaPlus } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { v4 as uuidv4 } from 'uuid';
import { toJS } from "mobx";
import { GoPlus } from "react-icons/go";
import SelectAttributePopup from "./SelectAttributePopup"; 
import { runInAction } from "mobx";
import FlagPopup from "./FlagPopup";
import ConditionPopup from "./ConditionPopup";
import SelectValuePopup from "./SelectValuePopup"
import Swal from "sweetalert2";



const Node = observer(({ node, style, grouppopup }) => {
  const nodeRef = useRef();
  const [startNode, setStartNode] = useState(null);
  const [showAttrPopup, setShowAttrPopup] = useState(false);
  const [showFlagPopup, setShowFlagPopup] = useState(false);
  const [showConditionPopup, setShowConditionPopup] = useState(false);
  const [showSelectValuePopup, setShowSelectValuePopup] = useState(false);





  const handleRemoveNode = () => {
    Store.removeNode(node.id);
  };

  const togglePopup = (id, label) => {
    const nodes = Store.nodes.find((nodes) => nodes.id === id);
    if (nodes) {
      // nodes.data.mainpopup = !nodes.data.mainpopup;
    runInAction(() => {
  node.data.mainpopup = !node.data?.mainpopup;
});
 const onClose = () => {
  setShowAttrPopup(false);
  runInAction(() => { node.data.mainpopup = false; });
};
 }
    Store.activeNodeId = id;
    Store.activeNodeLabel = label;
  };

  const handleDrag = d3Drag()
    .on("drag", (event) => {
      Store.updateNodePosition(node.id, event.x, event.y);
    });

  useEffect(() => {
    select(nodeRef.current).call(handleDrag);
  }, [handleDrag]);

  const startConnection = (nodeId, isSource) => {
    if (isSource) {
      setStartNode(nodeId);
    } else if (startNode) {
      const newEdge = {
        id: `e${startNode}-${nodeId}`,
        source: startNode,
        target: nodeId,
      };
      Store.edges = [...Store.edges, newEdge];
      setStartNode(null);
    }
  };

  return (
    <>
      {node.data?.mainpopup && (
        <foreignObject x={node.x - 300} y={node.y - 70} width="400" height="180">
          <div
            className="visible1"
            style={{
              position: "relative",
              height: "250px",
              width: "300px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Edit Icon */}
            <div
       
onClick={() => {
  const label = node.data?.label;
  if (label === "SelectValue" || label === "Select Value") {
    // reset trick to ensure it opens every time (if you experienced "only once" issue)
    setShowSelectValuePopup(false);
    setTimeout(() => setShowSelectValuePopup(true), 0);
  } else if (label === "SelectAttribute") {
    setShowAttrPopup(false);
    setTimeout(() => setShowAttrPopup(true), 0);
  } else if (label === "Flag") {
    setShowFlagPopup(false);
    setTimeout(() => setShowFlagPopup(true), 0);
  } else if (label === "Condition") {
    setShowConditionPopup(false);
    setTimeout(() => setShowConditionPopup(true), 0);
  }
}}


              style={{
                position: "absolute",
                top: "20px",
                left: "240px",
                borderRadius: "50%",
                padding: "10px",
                margin: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "34px",
                height: "34px",
                fontSize: "15px",
                cursor: "pointer",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(52, 152, 219, 0.9)",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <CiEdit style={{ color: "black" }} />
            </div>

            {/* Plus Icon */}
            {Store.activeNodeLabel !== 'Flag' ? (
              <div
                className="icon"
                onClick={() => Store.samplefunction(node.id, node.data?.label)}
                style={{
                  position: "absolute",
                  top: "75px",
                  left: "200px",
                  borderRadius: "50%",
                  padding: "10px",
                  margin: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "34px",
                  height: "34px",
                  fontSize: "15px",
                  cursor: "pointer",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(39, 174, 96, 0.9)",
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                <FaPlus style={{ color: "black" }} />
              </div>
            ) : (
              <div
                className="icon"
                onClick={() => grouppopup()}
                style={{
                  position: "absolute",
                  top: "75px",
                  left: "200px",
                  borderRadius: "50%",
                  padding: "10px",
                  margin: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "34px",
                  height: "34px",
                  fontSize: "15px",
                  cursor: "pointer",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: "rgba(155, 89, 182, 0.9)",
                  boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
                }}
              >
                <FaCaretDown style={{ color: "black" }} />
              </div>
 

            )}

            {/* Delete Icon */}
            <div
              className="icon"
              style={{
                position: "absolute",
                top: "130px",
                left: "240px",
                borderRadius: "50%",
                padding: "10px",
                margin: "5px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "34px",
                height: "34px",
                fontSize: "15px",
                cursor: "pointer",
                transform: "translate(-50%, -50%)",
                backgroundColor: "rgba(44, 62, 80, 0.9)",
                boxShadow: "0 0 5px rgba(0, 0, 0, 0.2)",
              }}
            >
              <IoCloseOutline style={{ color: "black" }} onClick={handleRemoveNode} />
            </div>
          </div>
        </foreignObject>
      )}

      {/* slect Attribute Popup (Always triggered by edit button now) */}
      {showAttrPopup && (
        <SelectAttributePopup
          nodeId={node.id}
          collectionName={node.data.collection || Store.activeCollection}
          onClose={() => {
            console.log("Closing popup for node:", node.data.label);
            setShowAttrPopup(false);
          }}
        />
      )}
{/* //////flagpopup////// */}
      {showFlagPopup && (
  <FlagPopup
    nodeId={node.id}
    onClose={() => setShowFlagPopup(false)}
  />
)}
{/* ///////////conditionpopup//// */}
{showConditionPopup && (
  <ConditionPopup
    nodeId={node.id}
    onClose={() => setShowConditionPopup(false)}
  />
)}
{/* /////selectvaluepop////////////// */}
{showSelectValuePopup && (
  <SelectValuePopup
    nodeId={node.id}
    collectionName={node.data.collection || Store.activeCollection}
    operator={node.data.condition} // optional
    onClose={() => setShowSelectValuePopup(false)}
  />
)}

{/* Node SVG */}
      <g
        ref={nodeRef}
        onClick={() => togglePopup(node.id, node.data?.label)}
        style={{
          cursor: "pointer",
          ...style,
          position: "relative",
        }}
        transform={`translate(${node.x}, ${node.y})`}
      >
        <rect
          x={-40}
          y={-20}
          width={126}
          height={60}
          fill="white"
          rx={12}
          ry={12}
          style={{
            filter: "drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1))",
            transition: "all 0.3s ease",
          }}
        />

        {/* Node Labels */}
        {/* <text
          x="18"
          y="-5"
          textAnchor="middle"
          dy=".3em"
          fontSize="12"
          fontWeight="bold"
          style={{ fill: "black" }}
        >
          {node.data?.label}
        </text> */}
  {/* Node Labels (always visible inside rect) */}
<text
  x="20"
  y="-5"
  textAnchor="middle"
  fontSize="12"
  fontWeight="bold"
  style={{ fill: "black" }}
>
  {node.data.label}
</text>

{node.data.value && (
  <text
    x="20"
    y="12"
    textAnchor="middle"
    fontSize="11"
    style={{ fill: "#555" }}
  >
    {node.data.value}
  </text>
)}


        {node.data?.label1 && (
          <text
            x="14"
            y="14"
            textAnchor="middle"
            dy=".3em"
            fontSize="12"
            style={{ fill: "black" }}
          >
            {node.data?.label1}
          </text>
        )}

        {/* Edge connection points */}
        <text
          type="source"
          x="87"
          textAnchor="middle"
          dy=".3em"
          fontSize="50"
          fill="black"
          onClick={() => startConnection(node.id, true)}
          style={{ cursor: "pointer" }}
        >
          .
        </text>
        <text
          type="target"
          x="-42"
          textAnchor="middle"
          dy=".3em"
          fontSize="50"
          fill="black"
          onClick={() => startConnection(node.id, false)}
          style={{ cursor: "pointer" }}
        >
          .
        </text>
      </g>
    </>
  );
});

export default Node;
