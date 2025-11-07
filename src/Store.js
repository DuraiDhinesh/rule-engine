import { observable, action, runInAction, toJS } from "mobx";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { reaction } from "mobx";

import { saveAs } from "file-saver"; // make sure you have this at the top

// ICONS for DB selection
import { SiMysql, SiMongodb, SiApachecassandra, SiArangodb, SiApachecouchdb, SiAmazondynamodb, SiCouchbase } from "react-icons/si";
import { DiPostgresql, DiRedis, DiSqllite } from "react-icons/di";
// near the top of Store.js
const API_BASE = "http://localhost:4000/api/flows";

const Store = observable({
  // ================================
  //  LOGIN STATE
  // ================================
  username: "",
  password: "",
  isLoggedIn: false,
  loginError: "",
  user: null,

  async login() {
    try {
      //  Example login API call
      const res = await axios.post("http://localhost:4000/login", {
        username: this.username,
        password: this.password,
      });

      if (res.data.success) {
        runInAction(() => {
          this.isLoggedIn = true;
          this.user = res.data.user;
        });

        Swal.fire("Login Successful", "Welcome to the Rule Engine!", "success");
      } else {
        runInAction(() => {
          this.loginError = "Invalid credentials";
        });

        Swal.fire("Login Failed", "Invalid username or password", "error");
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire("Error", "Something went wrong while logging in", "error");
    }
  },

  logout() {
    runInAction(() => {
      this.isLoggedIn = false;
      this.username = "";
      this.password = "";
      this.user = null;
    });
  },

  // ================================
  //  DATABASE SELECTION
  // ================================
  databases: [
    { name: "MongoDB", icon: SiMongodb },
    { name: "MySQL", icon: SiMysql },
    { name: "PostgreSQL", icon: DiPostgresql },
    { name: "Cassandra", icon: SiApachecassandra },
    { name: "ArangoDB", icon: SiArangodb },
    { name: "CouchDB", icon: SiApachecouchdb },
    { name: "Redis", icon: DiRedis },
    { name: "SQLite", icon: DiSqllite },
    { name: "DynamoDB", icon: SiAmazondynamodb },
    { name: "Couchbase", icon: SiCouchbase },
  ],

    iconsArray : [{
        id : "1",
        icons : SiMysql,
        iconname : "MySQL"
    },
{
    id : "2",
    icons : DiPostgresql,
    iconname : "PostgreSQL"
},
{
    id : "3",
    icons : SiMongodb,
    iconname :"mongoDB"
},
{
    id : "4",
    icons : SiApachecassandra,
    iconname : "cassandra"
},
{
    id : "5",
    icons : SiArangodb,
    iconname : "ArangoDB"
},
{
    id : "6",
    icons : SiApachecouchdb,
    iconname : "CounchDB"
},
{
    id : "7",
    icons : DiRedis,
    iconname : "redis"
},
{
    id : "8",
    icons : DiSqllite,
    iconname : "SQLite"
},
{
    id : "9",
    icons : SiAmazondynamodb,
    iconname : "DynamoDB"
},
{
    id : "10",
    icons : SiCouchbase,
    iconname : "Couchbase"
},
],
 setvisible1 : action(()=>{
        Store.visible1 = !Store.visible1
        console.log("visibile")
    }),

    setfontcolours : [{

        id : "1",
        fontcolour : "text-white",
        bgcolour : "bg-slate-200"

    },
{
    id : "2",
    fontcolour : "text-black",
    bgcolour : "bg-black"

},
{
    id : "3",
    fontcolour : "text-cyan-400",
    bgcolour : "bg-cyan-400"
}
],
 sidebarcolours : [{

        id : "1",
        backgroundcolour : "bg-slate-200",
    },
    {
        id : '2',
        backgroundcolour : "bg-black"
    },
    {
        id : '3',
        backgroundcolour : "bg-stone-700"
    },
    {
        id : "4",
        backgroundcolour :"bg-sky-950"
    }
],

setfontcolours12: action((id) => {
    const selectedColor = Store.setfontcolours.find(item => item.id === id)?.fontcolour;
    
    if (selectedColor) {
        Store.fontcolour = selectedColor;
    }
}),

 setbackgroundcolour : action((id)=>{

    const color = Store.sidebarcolours.find(item => item.id === id) ?.backgroundcolour;
    if(color){
        Store.backgroundcolour = color
    }

    if(color == "bg-slate-200")
    {
        Store.fontcolour = "text-black"
    }
    else{
        Store.fontcolour = "text-white"
    }
 }),
  visibile4 : false,
  initial : false,

  goback : action(() => {
        Store.visibile4 = false;
        Store.initial = true; 
      }),
  setvisible4 : action((id )=>{
        Store.visibile4 = true
        const db = Store.iconsArray.find((item) => item.id === id)
        Store.databasename = db ? db.iconname : "Unknown"
    }),
  selectedDB: "",
  dashboardName: "",
  dashboardArray: [],
  showDashboardPopup: false,

  selectDatabase(dbName) {
    runInAction(() => {
      this.selectedDB = dbName;
      this.showDashboardPopup = true;
    });
    Swal.fire("Database Selected", `You selected ${dbName}`, "success");
  },

  setDashboardName(name) {
    if (Array.isArray(this.dashboardArray) && !this.dashboardArray.includes(name)) {
      this.dashboardArray.push(name);
    }
    this.dashboardName = name;
    this.showDashboardPopup = false;
    Swal.fire("Dashboard Created", `Welcome to ${name}`, "success");
  },

  submitDashboard: action((name) => {
    if (!Array.isArray(Store.dashboardArray)) {
      Store.dashboardArray = [];
    }

    if (name && !Store.dashboardArray.includes(name)) {
      Store.dashboardArray.push(name);
    }

    Swal.fire("Dashboard Created", `Welcome to ${name}`, "success");
  }),
// ================================
  //  COLLECTIONS & FILE EXPLORER
  // ================================
  tablenames: [],       // collections from backend
  explorer: [],         // [{ id, name, type: 'collection'|'column', children: [] }]
  
  // fetch all collections from backend
  async fetchCollections() {
    try {
      const res = await fetch("http://localhost:4000/collections");
      const data = await res.json();

      runInAction(() => {
        this.tablenames = Array.isArray(data) ? data : [];
      });
    } catch (err) {
      console.error("Error fetching collections:", err);
    }
  },

  // === Utility ===
  makeId(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
  },

  findNodeById(id, arr = this.explorer) {
    for (const n of arr) {
      if (n.id === id) return n;
      if (n.children?.length) {
        const found = this.findNodeById(id, n.children);
        if (found) return found;
      }
    }
    return null;
  },

  addCollection: action((collectionName) => {
  const exists = Store.explorer.some(n => n.type === "collection" && n.name === collectionName);
  //if (!exists) {
    Store.explorer.push({
      id: Store.makeId("coll"),   // <== this id will be used later
      name: collectionName,
      type: "collection",
      children: []
    });
  //}
    Store.activeCollection = collectionName;
}),


  deleteNode(id) {
    const remove = (arr) => {
      const idx = arr.findIndex((n) => n.id === id);
      if (idx >= 0) {
        arr.splice(idx, 1);
        return true;
      }
      for (const n of arr) {
        if (n.children?.length && remove(n.children)) return true;
      }
      return false;
    };
    remove(this.explorer);
  },

  // ================================
  //  COLUMN PICKER
  // ================================
  columnPicker: {
    open: false,
    loading: false,
    error: "",
    forCollectionId: null,
    forCollectionName: "",
    items: [],
  },
// Store.js
async openColumnPicker(nodeId) {
  const node = this.findNodeById(nodeId);
  if (!node) return;

  this.columnPicker.open = true;
  this.columnPicker.loading = true;
  this.columnPicker.items = [];
  this.columnPicker.forCollectionId = node.id;
  this.columnPicker.forCollectionName = node.name;

  try {
    let url;
if (node.type === "root") {
  // Main plus: get collections
  url = "http://localhost:4000/collections";
} else if (node.type === "collection") {
  // Collection plus: get fields
  url = `http://localhost:4000/columns?collection=${encodeURIComponent(node.name)}`;
} else if (node.type === "column") {
  // Column plus: get subfields
  const parent = this.findParentCollection(nodeId, this.explorer);
  if (!parent) return;
  url = `http://localhost:4000/columns?collection=${encodeURIComponent(
    parent.name
  )}&field=${encodeURIComponent(node.name)}`;
}


    console.log("Fetching from:", url);

    const res = await fetch(url);
    const cols = await res.json();

    runInAction(() => {
      this.columnPicker.items = Array.isArray(cols) ? cols : [];
      this.columnPicker.loading = false;
    });
  } catch (err) {
    runInAction(() => {
      this.columnPicker.error = err.message;
      this.columnPicker.loading = false;
    });
  }
},

// Helper to find parent collection for a column
findParentCollection(nodeId, arr = this.explorer) {
  for (const n of arr) {
    if (n.id === nodeId && n.type === "collection") return n;
    if (n.children?.length) {
      if (n.children.some((c) => c.id === nodeId)) {
        return n; // found parent
      }
      const found = this.findParentCollection(nodeId, n.children);
      if (found) return found;
    }
  }
  return null;
},



  closeColumnPicker() {
    this.columnPicker.open = false;
    this.columnPicker.loading = false;
    this.columnPicker.error = "";
    this.columnPicker.items = [];
    this.columnPicker.forCollectionId = null;
    this.columnPicker.forCollectionName = "";
  },

addColumnFromPicker(columnName) {
  const parentId = this.columnPicker.forCollectionId;
  const parent = this.findNodeById(parentId);
  if (!parent) return;

  if (!parent.children) parent.children = [];

  // Prevent duplicates
  const exists = parent.children.some(
    (c) => c.type === "column" && c.name === columnName
  );
  if (!exists) {
    parent.children.push({
      id: this.makeId("col"),
      name: columnName,
      type: "column",   //  still column, but nested
      children: [],
    });
  }

  this.closeColumnPicker();
},

  editNode(id) {
    Swal.fire("Edit Node", `Edit node with id: ${id}`, "info");
  },
deleteNode(id) {
  const remove = (arr) => {
    const idx = arr.findIndex((n) => n.id === id);
    if (idx >= 0) {
      arr.splice(idx, 1);
      return true;
    }
    for (const n of arr) {
      if (n.children?.length && remove(n.children)) return true;
    }
    return false;
  };
  remove(this.explorer);
},


////////////////rule group popup///////
ruleGroupPicker: {
  open: false,
  forColumnId: null,
  forColumnName: "",
},
openRuleGroupPicker(columnId, columnName) {
  this.ruleGroupPicker.open = true;
  this.ruleGroupPicker.forColumnId = columnId;
  this.ruleGroupPicker.forColumnName = columnName;
},

closeRuleGroupPicker() {
  this.ruleGroupPicker.open = false;
  this.ruleGroupPicker.forColumnId = null;
  this.ruleGroupPicker.forColumnName = "";
},

//////////rulegroupnodescreation///////////////////
  nodes :[],
  edges :[],
  engines : [], // To store multiple rule engines
  currentGroupId : null,
  showAttrPopup : false,
// layout helpers for stacking engines
engineDX: 180,        // horizontal gap between the 6 nodes
engineDY: 220,        // vertical gap between engines (rows)
engineBaseX: 120,     // left margin of nodes
engineBaseY: 120,     // top margin of first engine

// track groups
activeGroupName: null,   // if user created a group, new "rule" clicks will use this
// ruleCounter: 1,          // global rule numbering for standalone rules / new groups
// ruleIdsPerGroup: {},     // { [groupName]: "Rule N" }
// 🔹 NEW separation
// groupCounter: 1,             // assigns Rule 1, Rule 2… across groups
ruleIdsPerGroup: {},         // { groupName: "Rule X" }
// standaloneRuleCounter: 1,    // standalone rules always increment globally
globalRuleCounter: 1,

  addNode(node) {
    this.nodes.push(node);
  },

  addEdge(edge) {
    this.edges.push(edge);
  },

  setNodes(nodes) {
    this.nodes = nodes;
  },

  setEdges(edges) {
    this.edges = edges;
  },

  clear() {
    this.nodes = [];
    this.edges = [];
  },
setShowAttrPopup(value) {
  this.showAttrPopup = value;
},

getNextEngineY() {
  // place each new engine in a new "row" under the previous ones
  return this.engineBaseY + (this.engines?.length || 0) * this.engineDY;
},

makeConditionSetId() {
  return `condSet_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
},

//////////////////for groupname and new rule id req/////////
// helper: return next Rule label and advance counter
getNextRuleLabel() {
  const n = this.globalRuleCounter || 1;
  const label = `Rule ${n}`;
  this.globalRuleCounter = n + 1;
  return label;
},

// initialize counter from existing data (call this after restore or app load)
initGlobalRuleCounter() {
  try {
    let max = 0;
    const scanLabel = (val) => {
      if (!val) return;
      const s = String(val);
      const m = s.match(/Rule\s*([0-9]+)/i) || s.match(/rule_(\d+)/i);
      if (m && m[1]) {
        const num = parseInt(m[1], 10);
        if (!Number.isNaN(num)) max = Math.max(max, num);
      }
    };

    // scan ruleIdsPerGroup values
    if (this.ruleIdsPerGroup) {
      Object.values(this.ruleIdsPerGroup).forEach(scanLabel);
    }

    // scan nodes for RuleId node values
    (this.nodes || []).forEach((n) => {
      if (n?.data?.label && /RuleId/i.test(n.data.label) && n?.data?.value) {
        scanLabel(n.data.value);
      }
    });

    // scan engines for groupName or rule label if present
    (this.engines || []).forEach((eng) => {
      if (eng?.groupName && this.ruleIdsPerGroup?.[eng.groupName]) {
        scanLabel(this.ruleIdsPerGroup[eng.groupName]);
      }
      // fallback: if engine stores ruleId in a field, scan it here
      if (eng?.ruleId) scanLabel(eng.ruleId);
    });

    // ensure next counter is max + 1 (and at least 1)
    const next = Math.max(1, max + 1);
    if (!this.globalRuleCounter || this.globalRuleCounter < next) {
      this.globalRuleCounter = next;
    }
  } catch (e) {
    console.warn("initGlobalRuleCounter failed:", e);
  }
},


//////////////////////////////////////////////// 


createRuleEngineNodes(choice, collectionName,groupNameInput = null) {
  const labels = [
    "ConditionSetId",
    "RuleId",
    "SelectAttribute",
    "Condition",
    "SelectValue",
    "Flag",
  ];

  // ✅ Decide Y offset so each new engine goes below the previous ones
  const baseX = 100;
  const baseY = 100 + this.engines.length * 200;


//////for new ruleid req////////
let ruleName;

if (choice === "group") {
  // Creating a new named group
  const enteredName = (groupNameInput || "").trim();
  const newGroupName =
    enteredName ||
    `group_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;

  this.activeGroupName = newGroupName;

  // Assign the group a Rule label only once (never reuse previous numbers)
  if (!this.ruleIdsPerGroup[newGroupName]) {
    this.ruleIdsPerGroup[newGroupName] = this.getNextRuleLabel();
  }
  ruleName = this.ruleIdsPerGroup[newGroupName];
} else {
  // Creating a standalone rule (or creating a rule while a group is active)
  if (this.activeGroupName) {
    // if currently inside a group — reuse group's Rule label
    ruleName = this.ruleIdsPerGroup[this.activeGroupName];
  } else {
    // standalone rule -> allocate next global Rule label
    ruleName = this.getNextRuleLabel();
  }
}
////////////////////////////////////


  const newNodes = labels.map((label, i) => {
    let value = "";
    if (label === "ConditionSetId") {
      value = this.makeConditionSetId(); // always unique
    } else if (label === "RuleId") {
      value = ruleName;
    }

    return {
      id: uuidv4(),
      x: baseX + i * 180,
      y: baseY,
      data: {
        label,          // 🔑 first line in node
        value,          // 🔑 second line in node
        collection: collectionName,
      },
    };
  });

  const newEdges = newNodes.slice(0, -1).map((node, i) => ({
    id: `e-${node.id}-${newNodes[i + 1].id}`,
    source: node.id,
    target: newNodes[i + 1].id,
  }));

  // add to global store
  this.nodes.push(...newNodes);
  this.edges.push(...newEdges);

  // keep track of this engine for layout
  this.engines.push({
    id: uuidv4(),
    type: choice,
    groupName: this.activeGroupName || null,
    collection: collectionName,
    nodes: newNodes.map((n) => n.id),
    edges: newEdges.map((e) => e.id),
  });
},



  // helper: remove node
  removeNode(nodeId) {
    this.nodes = this.nodes.filter((n) => n.id !== nodeId);
    this.edges = this.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
  },

  // helper: update node position
  updateNodePosition(nodeId, x, y) {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (node) {
      node.x = x;
      node.y = y;
    }
  },
  ////////////////select attribute helper////
  setNodeLabel(nodeId, newLabel) {
  const node = this.nodes.find(n => n.id === nodeId);
  if (node) {
    node.data.label1 = newLabel;
  }
},


/////// you shoul call this sucess mesage when rule group created////
finalizeRuleOrGroup(type) {
  if (type === "rule") {
    alert("Rule created successfully ✅");
  } else if (type === "group") {
    alert("Group created successfully ✅");
  }
},
//////for new rule group creation conditionsetid unique/////
// Generate unique ConditionSetId
makeConditionSetId() {
  return `condSet_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
},

// Generate unique RuleId (different per rule/group)
makeRuleId(groupName = null) {
  // If groupName is provided, all rules in same group get same RuleId
  if (!groupName) return `rule_${Math.random().toString(36).slice(2, 6)}`;
  if (!this.ruleIdsPerGroup) this.ruleIdsPerGroup = {};
  if (!this.ruleIdsPerGroup[groupName]) {
    this.ruleIdsPerGroup[groupName] = `rule_${Math.random().toString(36).slice(2, 6)}`;
  }
  return this.ruleIdsPerGroup[groupName];
},

startNewRuleEngine(collectionName, type = "rule", groupName = null) {
  const engineId = uuidv4();

  // decide Y row for this engine
  const rowY = this.getNextEngineY();
  const labels = [
    "ConditionSetId",
    "RuleId",
    "Select Attribute",
    "Condition",
    "Select Value",
    "Flag",
  ];

 
//added below for new rule req
let ruleName;
if (groupName) {
  if (!this.ruleIdsPerGroup[groupName]) {
    this.ruleIdsPerGroup[groupName] = this.getNextRuleLabel();
  }
  ruleName = this.ruleIdsPerGroup[groupName];
} else {
  ruleName = this.getNextRuleLabel();
}
/////

  const createdNodeIds = [];
  const createdEdgeIds = [];

  labels.forEach((label, index) => {
    // assign node value line for ConditionSetId / RuleId
    let value = "";
    if (label === "ConditionSetId") {
      value = this.makeConditionSetId(); // always unique
    } else if (label === "RuleId") {
      value = ruleName; // Rule 1 / Rule 2 etc, or reused inside group
    }

    const newNode = {
      id: uuidv4(),
      x: this.engineBaseX + index * this.engineDX,
      y: rowY,
      data: {
        label,
        value,              // shows as 2nd line in your Node
        collection: collectionName,
      },
    };

    this.nodes.push(newNode);
    createdNodeIds.push(newNode.id);

    if (index > 0) {
      const edge = {
        id: `e-${createdNodeIds[index - 1]}-${newNode.id}`,
        source: createdNodeIds[index - 1],
        target: newNode.id,
      };
      this.edges.push(edge);
      createdEdgeIds.push(edge.id);
    }
  });

  // keep a record of this engine so we can position the next one
  this.engines.push({
    id: engineId,
    type,
    groupName: groupName || null,
    collection: collectionName,
    nodes: createdNodeIds,
    edges: createdEdgeIds,
  });
 },
// ////////////////////////////////////save///////////////////////////////////////////


// ---- B.3 Build a stable snapshot of everything you need ----
buildSnapshot() {
  const nodes = toJS(this.nodes);
  const edges = toJS(this.edges);
  const engines = toJS(this.engines);
  const ruleIdsPerGroup = toJS(this.ruleIdsPerGroup);
  const explorer = toJS(this.explorer);

  // optional: derive a readable rule list for quick checks
  const rules = this.computeRulesFromGraph(nodes, engines);

  return {
    version: 1,
    savedAt: new Date().toISOString(),
    user: this.username || null,
    dashboard: this.dashboard || null,
    databasename: this.databasename || null,

    // UI + context
    explorer,
    selectedCollections: toJS(this.selectedCollections || []),
    activeCollection: this.activeCollection || null,

    // graph + layout
    nodes,
    edges,
    engines,
    ruleIdsPerGroup,
    ruleCounter: this.ruleCounter || 1,
    /////added below line for new ruleid req///
     globalRuleCounter: this.globalRuleCounter || 1,
     //////////////////////

    // readable rules
    rules,
  };
},

// ---- C.4 Apply a snapshot back into the store ----
applySnapshot(snap) {
  runInAction(() => {
    this.nodes = snap.nodes || [];
    this.edges = snap.edges || [];
    this.engines = snap.engines || [];
    this.ruleIdsPerGroup = snap.ruleIdsPerGroup || {};
    this.ruleCounter = snap.ruleCounter || 1;
    //added below line for new ruleid req
    this.globalRuleCounter = snap.globalRuleCounter || this.globalRuleCounter || 1;
    //////////////////

    this.explorer = snap.explorer || [];
    this.selectedCollections = snap.selectedCollections || [];
    this.activeCollection = snap.activeCollection || null;

    this.dashboard = snap.dashboard || this.dashboard;
    this.databasename = snap.databasename || this.databasename;
  });
},

// ---- F.7 Autosave (debounced) any time nodes/edges/engines change ----
_setupAutosaveOnce: false,
setupAutosave() {
  if (this._setupAutosaveOnce) return;
  this._setupAutosaveOnce = true;

  // mobx reaction with debounce
  reaction(
    () => ({
      nodes: toJS(this.nodes),
      edges: toJS(this.edges),
      engines: toJS(this.engines),
      ruleIdsPerGroup: toJS(this.ruleIdsPerGroup),
      explorer: toJS(this.explorer),
      selectedCollections: toJS(this.selectedCollections || []),
      activeCollection: this.activeCollection,
      dashboard: this.dashboard,
    }),
    () => {
      try {
        const snap = Store.buildSnapshot();
        localStorage.setItem(Store.saveKey(), JSON.stringify(snap));
      } catch (e) {
        console.warn("Autosave failed:", e);
      }
    },
    { delay: 600 } // debounce writes
  );
},

// ---- G. 8(used by B) Create readable rule objects from your 6-node engines ----
computeRulesFromGraph(nodes, engines) {
  const byId = new Map(nodes.map(n => [n.id, n]));
  const get = (n, keys) => keys.find(k => n?.data?.label === k);

  const labelEq = (n, lbls) => lbls.includes(n?.data?.label);
  const L = {
    cs: ["ConditionSetId"],
    ri: ["RuleId"],
    sa: ["SelectAttribute", "Select Attribute"],
    co: ["Condition"],
    sv: ["SelectValue", "Select Value"],
    fl: ["Flag"],
  };

  return (engines || []).map((eng) => {
    const parts = { };
    for (const id of eng.nodes || []) {
      const n = byId.get(id);
      if (labelEq(n, L.cs)) parts.conditionSetId = n?.data?.value;
      else if (labelEq(n, L.ri)) parts.ruleId = n?.data?.value;
      else if (labelEq(n, L.sa)) {
        parts.attribute = n?.data?.selectedColumn || n?.data?.label1 || null;
        parts.attrType = n?.data?.type || null;
      } else if (labelEq(n, L.co)) {
        parts.condition = n?.data?.condition || n?.data?.label1 || n?.data?.value || null;
      } else if (labelEq(n, L.sv)) {
        parts.value = n?.data?.value ?? null; // you format value in SelectValuePopup
      } else if (labelEq(n, L.fl)) {
        parts.flag = n?.data?.value ?? null; // true/false text
      }
    }
    return {
      groupName: eng.groupName || null,
      type: eng.type || "rule",
      collection: eng.collection || null,
      ...parts,
    };
  });
},
// ////////////////////////////save///////////////////////////////////////////
///////////newly added code for save save as download 
// ------------------ File Save / Download Helpers ------------------

// cache last exported data so Download button works
lastExportedData: null,
currentFileName: null,
// ------------------ Download (Always from last saved snapshot) ------------------
downloadLastExport: action(async () => {
  if (!Store.lastExportedData) {
    Swal.fire("No data", "Please Save or Save As first.", "warning");
    return;
  }

  const { value: format } = await Swal.fire({
    title: "Choose format",
    input: "select",
    inputOptions: {
      json: "JSON",
      csv: "CSV",
      word: "Word (.docx)"
    },
    inputPlaceholder: "Select a format",
    showCancelButton: true,
  });

  if (!format) return;

  let blob, filename;
  const parsed = JSON.parse(Store.lastExportedData);

  if (format === "json") {
    blob = new Blob([Store.lastExportedData], { type: "application/json" });
    filename = Store.currentFileName || "package.json";
  } else if (format === "csv") {
    const csv = Store.convertSnapshotToCSV(parsed.snapshot);
    blob = new Blob([csv], { type: "text/csv" });
    filename = (Store.currentFileName || "package").replace(/\.json$/, ".csv");
  } else if (format === "word") {
    blob = new Blob(["Word export not implemented yet"], { type: "application/msword" });
    filename = (Store.currentFileName || "package").replace(/\.json$/, ".docx");
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);

  Swal.fire("Downloaded", `File saved as ${filename}`, "success");
}),


///////
// ------------------ Save (Update existing package) ------------------
saveFile: action(async () => {
  if (!Store.currentPackageId) {
    Swal.fire("No package selected", "Use Save As first to create a package.", "warning");
    return;
  }

  try {
    const snap = Store.buildSnapshot();

    // 1. Update in DB
    const updated = await Store.saveFlowToDB(Store.currentPackageId, snap, { saveAs: false });

    // 2. Update in localStorage
    const userKey = Store.saveKey();
    localStorage.setItem(userKey, JSON.stringify(snap));

    // 3. Cache for download
    Store.lastExportedData = JSON.stringify({ packageId: Store.currentPackageId, snapshot: snap }, null, 2);
    Store.currentFileName = `${Store.currentPackageId}.json`;

    Swal.fire("Saved", `Package ${Store.currentPackageId} updated successfully.`, "success");
  } catch (err) {
    console.error("Save error:", err);
    Swal.fire("Error", "Save failed", "error");
  }
}),

// ------------------ Save As (Create new package) ------------------
saveFileAs: action(async () => {
  const { value: packageId } = await Swal.fire({
    title: "Save As",
    input: "text",
    inputLabel: "Enter new package name",
    inputPlaceholder: "package2",
    showCancelButton: true,
  });

  if (!packageId) return;

  try {
    const snap = Store.buildSnapshot();

    // 1. Save new package in DB
    const created = await Store.saveFlowToDB(packageId, snap, { saveAs: true });

    // 2. Update in localStorage
    const userKey = Store.saveKey();
    localStorage.setItem(userKey, JSON.stringify(snap));

    // 3. Cache for download
    Store.lastExportedData = JSON.stringify({ packageId, snapshot: snap }, null, 2);
    Store.currentFileName = `${packageId}.json`;

    Swal.fire("Created", `New package ${packageId} saved successfully.`, "success");
  } catch (err) {
    console.error("Save As error:", err);
    Swal.fire("Error", "Save As failed", "error");
  }
}),

///////////////////////////////////////////////////changed 6th method autodownload in exportflow and added above function here/////

convertSnapshotToCSV: (snap) => {
  if (!snap || !snap.rules || snap.rules.length === 0) return "No data";

  const headers = Object.keys(snap.rules[0]); // auto-detect fields
  const rows = snap.rules.map((rule) => headers.map((h) => rule[h] ?? ""));
  
  return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
},


// ------------------ 1Namespaced key helper ------------------
saveKey(username = Store.username, dashboard = Store.dashboard) {
  const user = username || "anon";
  const dash = dashboard || "default";
  return `flowData:${user}:${dash}`;
},

// ------------------2 Merge helpers ------------------
_mergeById(a = [], b = []) {
  const map = new Map();
  (a || []).forEach(item => { if (item?.id) map.set(item.id, item); });
  (b || []).forEach(item => {
    if (!item) return;
    if (item.id && map.has(item.id)) {
      map.set(item.id, { ...map.get(item.id), ...item });
    } else if (item.id) {
      map.set(item.id, item);
    } else {
      map.set(JSON.stringify(item) + Math.random(), item);
    }
  });
  return Array.from(map.values());
},

_mergeExplorers(a = [], b = []) {
  const byName = new Map();
  (a || []).forEach(col => { if (col?.name) byName.set(col.name, { ...col }); });
  (b || []).forEach(col => {
    if (!col?.name) return;
    const existing = byName.get(col.name);
    if (!existing) {
      byName.set(col.name, { ...col });
    } else {
      const childMap = new Map();
      (existing.children || []).forEach(c => childMap.set(c.id || c.name, c));
      (col.children || []).forEach(c => {
        const key = c.id || c.name;
        childMap.set(key, { ...(childMap.get(key) || {}), ...c });
      });
      existing.children = Array.from(childMap.values());
      byName.set(col.name, { ...existing, ...col });
    }
  });
  return Array.from(byName.values());
},

_mergeSnapshots(base = {}, override = {}) {
  const merged = { ...base, ...override };

  merged.nodes = this._mergeById(base.nodes || [], override.nodes || []);
  merged.edges = this._mergeById(base.edges || [], override.edges || []);
  merged.engines = this._mergeById(base.engines || [], override.engines || []);
  merged.rules = this._mergeById(base.rules || [], override.rules || []);
  merged.explorer = this._mergeExplorers(base.explorer || [], override.explorer || []);

  merged.selectedCollections = Array.from(new Set([...(base.selectedCollections || []), ...(override.selectedCollections || [])]));
  merged.ruleIdsPerGroup = { ...(base.ruleIdsPerGroup || {}), ...(override.ruleIdsPerGroup || {}) };
  merged.ruleCounter = Math.max(base.ruleCounter || 0, override.ruleCounter || 0);
  merged.activeCollection = override.activeCollection ?? base.activeCollection;
  merged.savedAt = new Date().toISOString();

  return merged;
},

// ------------------ 5Save Flow ------------------
saveFlow: action(() => {
  try {
    const snap = Store.buildSnapshot();

    const userKey = Store.saveKey();
    localStorage.setItem(userKey, JSON.stringify(snap));
    console.log("Saved snapshot to user key:", userKey);

    const anonKey = Store.saveKey("anon", "default");
    const anonRaw = localStorage.getItem(anonKey);
    const anonSnap = anonRaw ? JSON.parse(anonRaw) : {};
    const mergedAnon = Store._mergeSnapshots(anonSnap, snap);
    localStorage.setItem(anonKey, JSON.stringify(mergedAnon));
    console.log("Merged snapshot into anon key:", anonKey);

    Swal.fire({ icon: "success", title: "Saved", text: `Saved to ${userKey} and merged into ${anonKey}` });
    ///addind to db
      // Store.saveFlowToDB(userKey, snap);
      const baseName = Store.currentFileName ? Store.currentFileName.replace(/\.json$/, "") : "package";
      Store.saveFlowToDB(baseName, snap, { saveAs: false });

      //////
  } catch (e) {
    console.error("saveFlow error:", e);
    Swal.fire({ icon: "error", title: "Save failed" });
  }
  /////
  
  /////
}),

// ------------------ 6Restore Flow ------------------
restoreFlow: action(async (name = null) => {
  try {
    // 🔥 1. Try to fetch from backend if a name is provided
    if (name) {
      const flows = await Store.fetchFlowsFromDB();
      const match = flows.find(f => f.name === name);

      if (match) {
        Store.applySnapshot(match.snapshot);

        // re-init rule counter for new snapshot
        Store.initGlobalRuleCounter();

        console.log(`✅ Restored snapshot from DB for flow: ${name}`);
        return true;
      }
    }

    // 🔥 2. Fallback to localStorage (your existing logic)
    const anonKey = Store.saveKey("anon", "default");
    const userKey = Store.saveKey();

    const anonRaw = localStorage.getItem(anonKey);
    const userRaw = localStorage.getItem(userKey);

    if (!anonRaw && !userRaw) {
      console.log("No flows found in DB or localStorage.");
      return false;
    }

    const anonSnap = anonRaw ? JSON.parse(anonRaw) : {};
    const userSnap = userRaw ? JSON.parse(userRaw) : {};
    const merged = Store._mergeSnapshots(anonSnap, userSnap);

    Store.applySnapshot(merged);

    // re-init rule counter
    Store.initGlobalRuleCounter();

    console.log("✅ Restored merged snapshot from anon + user keys (localStorage)");
    return true;

  } catch (e) {
    console.error("restoreFlow error:", e);
    return false;
  }
}),


/////////////////////////////////////////exportimport///////////////////////

// ------------------ Package export / release helpers ------------------


// namespaced key for storing packages on client
getPackagesKey(username = this.username, dashboard = this.dashboard) {
  const user = username || "anon";
  const dash = dashboard || "default";
  return `flowPackages:${user}:${dash}`;
},

// list packages (returns array)
listPackages() {
  try {
    const raw = localStorage.getItem(this.getPackagesKey());
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn("listPackages error:", e);
    return [];
  }
},

// download a package by id (client-side file download)
downloadPackage: action((packageId) => {
  try {
    const pk = this.listPackages().find((p) => p.id === packageId);
    if (!pk) {
      Swal.fire("Not found", `Package ${packageId} not found`, "error");
      return;
    }
    const blob = new Blob([JSON.stringify(pk, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${packageId}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  } catch (err) {
    console.error("downloadPackage error:", err);
    Swal.fire("Error", "Download failed", "error");
  }
}),


// import (apply) a package by id into current workspace
importPackage: action((packageId) => {
  try {
    const pk = this.listPackages().find((p) => p.id === packageId);
    if (!pk) {
      Swal.fire("Not found", `Package ${packageId} not found`, "error");
      return;
    }
    // pk.snapshot is the object we saved earlier
    this.applySnapshot(pk.snapshot);
    Swal.fire("Imported", `Package ${packageId} applied to workspace`, "success");
  } catch (err) {
    console.error("importPackage error:", err);
    Swal.fire("Error", "Import failed", "error");
  }
}),


// Primary export function: prompts for base name + notes, creates next release, saves to localStorage and triggers download.
// If Store.exportEndpoint is set (string), tries to POST to server as well (optional).

// // --- Save flow to backend (MongoDB) ---

 // client packages cache
packages: [],       // will hold list of packages from DB
currentPackageId: null,  // when user has an active package loaded
currentPackageMeta: null, // optional full package object

// fetch packages for the current user/dashboard
fetchFlowsFromDB: action(async (params = {}) => {
  try {
    const q = {
      user: Store.username || "anon",
      dashboard: Store.dashboard || "default",
      ...(params.baseName ? { baseName: params.baseName } : {}),
    };
    const res = await axios.get(API_BASE, { params: q });
    runInAction(() => {
      Store.packages = Array.isArray(res.data) ? res.data : [];
    });
    return res.data;
  } catch (err) {
    console.error("fetchFlowsFromDB error:", err);
    return [];
  }
}),

// create or update package in DB.
// - if options.saveAs === true -> always create new package (POST)
// - if Store.currentPackageId exists and options.saveAs !== true -> update (PUT)
// baseOrName: when creating, provide baseName (string). When updating, baseOrName can be unused.

// create or update package in DB
saveFlowToDB: action(async (packageId, snapshot, options = {}) => {
  try {
    if (options.saveAs) {
      // --- Save As (new package, always POST) ---
      const payload = { packageId, snapshot, notes: options.notes || "" };
      const res = await axios.post(API_BASE, payload);
      const pkg = res.data;

      runInAction(() => {
        Store.packages = [pkg, ...(Store.packages || [])];
        Store.currentPackageId = pkg.packageId;
        Store.currentPackageMeta = pkg;
      });

      Swal.fire("Created", `New package ${pkg.packageId} saved to DB.`, "success");
      return pkg;
    } else {
      // --- Save (update existing or create if missing, thanks to upsert) ---
      const payload = { snapshot, notes: options.notes || "" };
      const res = await axios.put(`${API_BASE}/${packageId}`, payload);
      const updated = res.data;

      runInAction(() => {
        Store.packages = (Store.packages || []).map((p) =>
          p.packageId === updated.packageId ? updated : p
        );
        Store.currentPackageMeta = updated;
        Store.currentPackageId = updated.packageId;
      });

      Swal.fire("Saved", `Package ${updated.packageId} updated (or created).`, "success");
      return updated;
    }
  } catch (err) {
    console.error("saveFlowToDB error:", err);
    Swal.fire("Error", "Failed to save package to DB", "error");
    return null;
  }
}),

// load package by id into the workspace
loadPackageById: action(async (packageIdOrDbId) => {
  try {
    const res = await axios.get(`${API_BASE}/${packageIdOrDbId}`);
    const pkg = res.data;
    if (!pkg) { Swal.fire("Not found", "Package not found", "error"); return null; }
    runInAction(() => {
      Store.applySnapshot(pkg.snapshot || {});
      Store.currentPackageId = pkg._id || pkg.packageId || pkg.id;
      Store.currentPackageMeta = pkg;
    });
    Swal.fire("Loaded", `Package ${pkg.packageId} loaded.`, "success");
    return pkg;
  } catch (err) {
    console.error("loadPackageById error:", err);
    Swal.fire("Load failed", "Could not load package", "error");
    return null;
  }
}),




});

export default Store;
