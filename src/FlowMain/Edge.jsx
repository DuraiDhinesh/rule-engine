import React, { useState } from "react";
import { observer } from "mobx-react";
import Store from "../Store";
import { MdDelete } from "react-icons/md";

const Edge = observer(({ source, target, style,edge }) => {
  const [showDelete, setShowDelete] = useState(false);

  const sourceNode = Store.nodes.find((node) => node.id === source);
  const targetNode = Store.nodes.find((node) => node.id === target);

  const handleLineClick = (id) => {
    setShowDelete(!showDelete);
Store.edgeId = id
  };

  // const onEdgeButtonClick = () => {
  //   Store.edges = Store.edges.filter((ed) => ed.id !== Store.edgeId)
  //   setShowDelete(!showDelete);
  // };

  

  return (
    <>
      <style>
        {`
          @keyframes dash {
            from {
              stroke-dashoffset: 0;
            }
            to {
              stroke-dashoffset: 24;
            }
          }
        `}
      </style>

      <line
        x1={sourceNode.x + 12}
        y1={sourceNode.y + 12}
        x2={targetNode.x + 12}
        y2={targetNode.y + 12}
        onClick={() =>handleLineClick(edge.id)}
        stroke="black"
        strokeWidth="8"
        strokeDasharray="6"
        style={{
          animation: "dash 4s linear infinite",
          cursor: "pointer",
          ...style,
        }}
      />

      {/*  */}
    </>
  );
});

export default Edge;


// {showDelete && (
//   <foreignObject
//     width={30}
//     height={30}
//     x={midX - 20} // Center the foreignObject horizontally
//     y={midY - 20} // Center the foreignObject vertically
//   >
//     {/* Delete button */}
//     <div
//      onClick={() => {
          
//       onEdgeButtonClick()
//      }}
//       style={{
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: "red",
//         borderRadius: "50%",
//         height: "100%",
//         width: "100%",
//         boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//         cursor: "pointer",
//       }}
//     >
//       <button
       
//         style={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           background: "none",
//           border: "none",
//           outline: "none",
//           cursor: "pointer",
//           color: "white",
//           fontSize: "24px",
//           height: "100%",
//           width: "100%",
//           padding: 0,
//         }}
//       >
//         <MdDelete />
//       </button>
//     </div>
//   </foreignObject>
// )}