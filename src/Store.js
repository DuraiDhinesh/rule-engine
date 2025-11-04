import { observable, action, runInAction, toJS, makeObservable } from "mobx";
import Swal from "sweetalert2";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { reaction } from "mobx";
import { saveAs } from "file-saver";

// ICONS for DB selection
import { SiMysql, SiMongodb, SiApachecassandra, SiArangodb, SiApachecouchdb, SiAmazondynamodb, SiCouchbase } from "react-icons/si";
import { DiPostgresql, DiRedis, DiSqllite } from "react-icons/di";

const API_BASE = "http://localhost:4000/api/flows";

class DataStore {
  // ================================
  //  LOGIN STATE
  // ================================
  username = "";
  password = "";
  isLoggedIn = false;
  loginError = "";
  user = null;

  // ================================
  //  DATABASE SELECTION
  // ================================
  databases = [
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
  ];

  iconsArray = [
    { id: "1", icons: SiMysql, iconname: "MySQL" },
    { id: "2", icons: DiPostgresql, iconname: "PostgreSQL" },
    { id: "3", icons: SiMongodb, iconname: "mongoDB" },
    { id: "4", icons: SiApachecassandra, iconname: "cassandra" },
    { id: "5", icons: SiArangodb, iconname: "ArangoDB" },
    { id: "6", icons: SiApachecouchdb, iconname: "CounchDB" },
    { id: "7", icons: DiRedis, iconname: "redis" },
    { id: "8", icons: DiSqllite, iconname: "SQLite" },
    { id: "9", icons: SiAmazondynamodb, iconname: "DynamoDB" },
    { id: "10", icons: SiCouchbase, iconname: "Couchbase" },
  ];

  visible1 = false;
  setfontcolours = [
    { id: "1", fontcolour: "text-white", bgcolour: "bg-slate-200" },
    { id: "2", fontcolour: "text-black", bgcolour: "bg-black" },
    { id: "3", fontcolour: "text-cyan-400", bgcolour: "bg-cyan-400" }
  ];

  sidebarcolours = [
    { id: "1", backgroundcolour: "bg-slate-200" },
    { id: '2', backgroundcolour: "bg-black" },
    { id: '3', backgroundcolour: "bg-stone-700" },
    { id: "4", backgroundcolour: "bg-sky-950" }
  ];

  fontcolour = "text-white";
  backgroundcolour = "bg-slate-200";
  visibile4 = false;
  initial = false;

  selectedDB = "";
  dashboardName = "";
  dashboardArray = [];
  showDashboardPopup = false;
  dashboard = "";
  databasename = "";

  // ================================
  //  COLLECTIONS & FILE EXPLORER
  // ================================
  tablenames = [];
  explorer = [];
  activeCollection = null;
  selectedCollections = [];

  // ================================
  //  COLUMN PICKER
  // ================================
  columnPicker = {
    open: false,
    loading: false,
    error: "",
    forCollectionId: null,
    forCollectionName: "",
    items: [],
  };

  // ================================
  //  RULE GROUP PICKER
  // ================================
  ruleGroupPicker = {
    open: false,
    forColumnId: null,
    forColumnName: "",
  };

  // ================================
  //  RULE ENGINE NODES
  // ================================
  nodes = [];
  edges = [];
  engines = [];
  ruleOrder = []; // Track the order of RuleIds for drag-and-drop
  currentGroupId = null;
  showAttrPopup = false;

  // layout helpers for stacking engines
  engineDX = 180;
  engineDY = 220;
  engineBaseX = 120;
  engineBaseY = 120;

  // track groups
  activeGroupName = null;
  ruleIdsPerGroup = {};
  globalRuleCounter = 1;

  // ================================
  //  PACKAGES & SAVE/LOAD
  // ================================
  lastExportedData = null;
  currentFileName = null;
  packages = [];
  currentPackageId = null;
  currentPackageMeta = null;
  _setupAutosaveOnce = false;

  constructor() {
    makeObservable(this, {
      // Login
      username: observable,
      password: observable,
      isLoggedIn: observable,
      loginError: observable,
      user: observable,
      login: action,
      logout: action,

      // Database
      selectedDB: observable,
      dashboardName: observable,
      dashboardArray: observable,
      showDashboardPopup: observable,
      selectDatabase: action,
      setDashboardName: action,
      submitDashboard: action,
      visible1: observable,
      setvisible1: action,
      fontcolour: observable,
      backgroundcolour: observable,
      setfontcolours12: action,
      setbackgroundcolour: action,
      visibile4: observable,
      initial: observable,
      goback: action,
      setvisible4: action,
      databasename: observable,
      dashboard: observable,

      // Collections
      tablenames: observable,
      explorer: observable,
      activeCollection: observable,
      selectedCollections: observable,
      fetchCollections: action,
      addCollection: action,
      deleteNode: action,

      // Column Picker
      columnPicker: observable,
      openColumnPicker: action,
      closeColumnPicker: action,
      addColumnFromPicker: action,

      // Rule Group Picker
      ruleGroupPicker: observable,
      openRuleGroupPicker: action,
      closeRuleGroupPicker: action,

      // Rule Engine
      nodes: observable,
      edges: observable,
      engines: observable,
      ruleOrder: observable,
      currentGroupId: observable,
      showAttrPopup: observable,
      activeGroupName: observable,
      ruleIdsPerGroup: observable,
      globalRuleCounter: observable,
      addNode: action,
      addEdge: action,
      setNodes: action,
      setEdges: action,
      clear: action,
      setShowAttrPopup: action,
      createRuleEngineNodes: action,
      removeNode: action,
      updateNodePosition: action,
      setNodeLabel: action,
      finalizeRuleOrGroup: action,
      startNewRuleEngine: action,
      reorderRules: action,

      // Save/Load
      lastExportedData: observable,
      currentFileName: observable,
      packages: observable,
      currentPackageId: observable,
      currentPackageMeta: observable,
      saveFlow: action,
      restoreFlow: action,
      saveFile: action,
      saveFileAs: action,
      downloadLastExport: action,
      fetchFlowsFromDB: action,
      saveFlowToDB: action,
      loadPackageById: action,
      downloadPackage: action,
      importPackage: action,
    });

    this.initializeSampleData();
  }

  // ================================
  //  LOGIN METHODS
  // ================================
  async login() {
    try {
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
  }

  logout() {
    runInAction(() => {
      this.isLoggedIn = false;
      this.username = "";
      this.password = "";
      this.user = null;
    });
  }

  // ================================
  //  DATABASE METHODS
  // ================================
  setvisible1() {
    this.visible1 = !this.visible1;
  }

  setfontcolours12(id) {
    const selectedColor = this.setfontcolours.find(item => item.id === id)?.fontcolour;
    if (selectedColor) {
      this.fontcolour = selectedColor;
    }
  }

  setbackgroundcolour(id) {
    const color = this.sidebarcolours.find(item => item.id === id)?.backgroundcolour;
    if (color) {
      this.backgroundcolour = color;
    }
    if (color === "bg-slate-200") {
      this.fontcolour = "text-black";
    } else {
      this.fontcolour = "text-white";
    }
  }

  goback() {
    this.visibile4 = false;
    this.initial = true;
  }

  setvisible4(id) {
    this.visibile4 = true;
    const db = this.iconsArray.find((item) => item.id === id);
    this.databasename = db ? db.iconname : "Unknown";
  }

  selectDatabase(dbName) {
    runInAction(() => {
      this.selectedDB = dbName;
      this.showDashboardPopup = true;
    });
    Swal.fire("Database Selected", `You selected ${dbName}`, "success");
  }

  setDashboardName(name) {
    if (Array.isArray(this.dashboardArray) && !this.dashboardArray.includes(name)) {
      this.dashboardArray.push(name);
    }
    this.dashboardName = name;
    this.dashboard = name;
    this.showDashboardPopup = false;
    Swal.fire("Dashboard Created", `Welcome to ${name}`, "success");
  }

  submitDashboard(name) {
    if (!Array.isArray(this.dashboardArray)) {
      this.dashboardArray = [];
    }
    if (name && !this.dashboardArray.includes(name)) {
      this.dashboardArray.push(name);
    }
    this.dashboard = name;
    Swal.fire("Dashboard Created", `Welcome to ${name}`, "success");
  }

  // ================================
  //  COLLECTIONS METHODS
  // ================================
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
  }

  makeId(prefix = "id") {
    return `${prefix}_${Math.random().toString(36).slice(2, 8)}_${Date.now().toString(36)}`;
  }

  findNodeById(id, arr = this.explorer) {
    for (const n of arr) {
      if (n.id === id) return n;
      if (n.children?.length) {
        const found = this.findNodeById(id, n.children);
        if (found) return found;
      }
    }
    return null;
  }

  addCollection(collectionName) {
    this.explorer.push({
      id: this.makeId("coll"),
      name: collectionName,
      type: "collection",
      children: []
    });
    this.activeCollection = collectionName;
  }

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
  }

  // ================================
  //  COLUMN PICKER METHODS
  // ================================
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
        url = "http://localhost:4000/collections";
      } else if (node.type === "collection") {
        url = `http://localhost:4000/columns?collection=${encodeURIComponent(node.name)}`;
      } else if (node.type === "column") {
        const parent = this.findParentCollection(nodeId, this.explorer);
        if (!parent) return;
        url = `http://localhost:4000/columns?collection=${encodeURIComponent(parent.name)}&field=${encodeURIComponent(node.name)}`;
      }

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
  }

  findParentCollection(nodeId, arr = this.explorer) {
    for (const n of arr) {
      if (n.id === nodeId && n.type === "collection") return n;
      if (n.children?.length) {
        if (n.children.some((c) => c.id === nodeId)) {
          return n;
        }
        const found = this.findParentCollection(nodeId, n.children);
        if (found) return found;
      }
    }
    return null;
  }

  closeColumnPicker() {
    this.columnPicker.open = false;
    this.columnPicker.loading = false;
    this.columnPicker.error = "";
    this.columnPicker.items = [];
    this.columnPicker.forCollectionId = null;
    this.columnPicker.forCollectionName = "";
  }

  addColumnFromPicker(columnName) {
    const parentId = this.columnPicker.forCollectionId;
    const parent = this.findNodeById(parentId);
    if (!parent) return;

    if (!parent.children) parent.children = [];

    const exists = parent.children.some(
      (c) => c.type === "column" && c.name === columnName
    );
    if (!exists) {
      parent.children.push({
        id: this.makeId("col"),
        name: columnName,
        type: "column",
        children: [],
      });
    }

    this.closeColumnPicker();
  }

  editNode(id) {
    Swal.fire("Edit Node", `Edit node with id: ${id}`, "info");
  }

  // ================================
  //  RULE GROUP PICKER METHODS
  // ================================
  openRuleGroupPicker(columnId, columnName) {
    this.ruleGroupPicker.open = true;
    this.ruleGroupPicker.forColumnId = columnId;
    this.ruleGroupPicker.forColumnName = columnName;
  }

  closeRuleGroupPicker() {
    this.ruleGroupPicker.open = false;
    this.ruleGroupPicker.forColumnId = null;
    this.ruleGroupPicker.forColumnName = "";
  }

  // ================================
  //  RULE ENGINE METHODS
  // ================================
  addNode(node) {
    this.nodes.push(node);
  }

  addEdge(edge) {
    this.edges.push(edge);
  }

  setNodes(nodes) {
    this.nodes = nodes;
  }

  setEdges(edges) {
    this.edges = edges;
  }

  clear() {
    this.nodes = [];
    this.edges = [];
  }

  setShowAttrPopup(value) {
    this.showAttrPopup = value;
  }

  getNextEngineY() {
    return this.engineBaseY + (this.engines?.length || 0) * this.engineDY;
  }

  makeConditionSetId() {
    return `CS_${Math.random().toString(36).slice(2, 8).toUpperCase()}_${Date.now().toString(36)}`;
  }

  getNextRuleLabel() {
    const n = this.globalRuleCounter || 1;
    const label = `Rule_${n}`;
    this.globalRuleCounter = n + 1;
    return label;
  }

  initGlobalRuleCounter() {
    try {
      let max = 0;
      const scanLabel = (val) => {
        if (!val) return;
        const s = String(val);
        const m = s.match(/Rule[_\s]*([0-9]+)/i);
        if (m && m[1]) {
          const num = parseInt(m[1], 10);
          if (!Number.isNaN(num)) max = Math.max(max, num);
        }
      };

      if (this.ruleIdsPerGroup) {
        Object.values(this.ruleIdsPerGroup).forEach(scanLabel);
      }

      (this.nodes || []).forEach((n) => {
        if (n?.data?.label && /RuleId/i.test(n.data.label) && n?.data?.value) {
          scanLabel(n.data.value);
        }
      });

      (this.engines || []).forEach((eng) => {
        if (eng?.groupName && this.ruleIdsPerGroup?.[eng.groupName]) {
          scanLabel(this.ruleIdsPerGroup[eng.groupName]);
        }
        if (eng?.ruleId) scanLabel(eng.ruleId);
      });

      const next = Math.max(1, max + 1);
      if (!this.globalRuleCounter || this.globalRuleCounter < next) {
        this.globalRuleCounter = next;
      }
    } catch (e) {
      console.warn("initGlobalRuleCounter failed:", e);
    }
  }

  // ➕ + button — create new rule/group nodes
createRuleEngineNodes = (choice, collectionName, groupNameInput = null) => {
  const labels = [
    "ConditionSetId",
    "RuleId",
    "SelectAttribute",
    "Condition",
    "SelectValue",
    "Flag",
  ];

  const baseX = 100;
  const baseY = 100 + this.engines.length * 200;

  let ruleName;
  if (choice === "group") {
    const enteredName = (groupNameInput || "").trim();
    const newGroupName =
      enteredName ||
      `group_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;

    this.activeGroupName = newGroupName;

    if (!this.ruleIdsPerGroup[newGroupName]) {
      this.ruleIdsPerGroup[newGroupName] = this.getNextRuleLabel();
    }
    ruleName = this.ruleIdsPerGroup[newGroupName];
  } else {
    if (this.activeGroupName) {
      ruleName = this.ruleIdsPerGroup[this.activeGroupName];
    } else {
      ruleName = this.getNextRuleLabel();
    }
  }

  const newNodes = labels.map((label, i) => {
    let value = "";
    if (label === "ConditionSetId") value = this.makeConditionSetId();
    else if (label === "RuleId") value = ruleName;

    return {
      id: uuidv4(),
      x: baseX + i * 180,
      y: baseY,
      data: { label, value, collection: collectionName },
    };
  });

  const newEdges = newNodes.slice(0, -1).map((node, i) => ({
    id: `e-${node.id}-${newNodes[i + 1].id}`,
    source: node.id,
    target: newNodes[i + 1].id,
  }));

  this.nodes.push(...newNodes);
  this.edges.push(...newEdges);

  this.engines.push({
    id: uuidv4(),
    type: choice,
    groupName: this.activeGroupName || null,
    collection: collectionName,
    nodes: newNodes.map((n) => n.id),
    edges: newEdges.map((e) => e.id),
  });

    // Update ruleOrder
    if (!this.ruleOrder.includes(ruleName)) {
      this.ruleOrder.push(ruleName);
    }
  }

  removeNode(nodeId) {
    this.nodes = this.nodes.filter((n) => n.id !== nodeId);
    this.edges = this.edges.filter((e) => e.source !== nodeId && e.target !== nodeId);
  }

  updateNodePosition(nodeId, x, y) {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (node) {
      node.x = x;
      node.y = y;
    }
  }

  setNodeLabel(nodeId, newLabel) {
    const node = this.nodes.find(n => n.id === nodeId);
    if (node) {
      node.data.label1 = newLabel;
    }
  }

  updateNode(nodeId, newValue) {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (node) {
      node.data.value = newValue;
    }
  }

  addEngine(engine) {
    this.engines.push(engine);
    
    const ruleNode = this.nodes.find(
      (n) => n.data.label === "RuleId" && engine.nodes.includes(n.id)
    );
    if (ruleNode && !this.ruleOrder.includes(ruleNode.data.value)) {
      this.ruleOrder.push(ruleNode.data.value);
    }
  }

  deleteEngine(engineId) {
    this.engines = this.engines.filter((e) => e.id !== engineId);
  }

  reorderRules(newOrder) {
    this.ruleOrder = newOrder;
  }

  finalizeRuleOrGroup(type) {
    if (type === "rule") {
      Swal.fire("Success", "Rule created successfully ✅", "success");
    } else if (type === "group") {
      Swal.fire("Success", "Group created successfully ✅", "success");
    }
  }

  startNewRuleEngine(collectionName, type = "rule", groupName = null) {
    const engineId = uuidv4();
    const rowY = this.getNextEngineY();
    const labels = [
      "ConditionSetId",
      "RuleId",
      "Select Attribute",
      "Condition",
      "Select Value",
      "Flag",
    ];

    let ruleName;
    if (groupName) {
      if (!this.ruleIdsPerGroup[groupName]) {
        this.ruleIdsPerGroup[groupName] = this.getNextRuleLabel();
      }
      ruleName = this.ruleIdsPerGroup[groupName];
    } else {
      ruleName = this.getNextRuleLabel();
    }

    const createdNodeIds = [];
    const createdEdgeIds = [];

    labels.forEach((label, index) => {
      let value = "";
      if (label === "ConditionSetId") {
        value = this.makeConditionSetId();
      } else if (label === "RuleId") {
        value = ruleName;
      }

      const newNode = {
        id: uuidv4(),
        x: this.engineBaseX + index * this.engineDX,
        y: rowY,
        data: {
          label,
          value,
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

    this.engines.push({
      id: engineId,
      type,
      groupName: groupName || null,
      collection: collectionName,
      nodes: createdNodeIds,
      edges: createdEdgeIds,
    });

    // Update ruleOrder
    if (!this.ruleOrder.includes(ruleName)) {
      this.ruleOrder.push(ruleName);
    }
  }

  // ================================
  //  SAMPLE DATA INITIALIZATION
  // ================================
  initializeSampleData() {
    // Sample data for Rule 1
    const rule1Engine1 = {
      id: "engine_1",
      nodes: [],
    };

    const rule1Data1 = {
      ConditionSetId: "CS_001",
      RuleId: "Rule_1",
      ConditionId: "C1",
      SelectAttribute: "Age",
      Condition: "greater than",
      SelectValue: "20",
      Flag: "True",
    };

    Object.entries(rule1Data1).forEach(([label, value]) => {
      const nodeId = `${label}_${Date.now()}_${Math.random()}`;
      this.nodes.push({
        id: nodeId,
        type: "default",
        data: { label, value },
        position: { x: 0, y: 0 },
      });
      rule1Engine1.nodes.push(nodeId);
    });

    this.engines.push(rule1Engine1);

    // Sample data for Rule 1 (second condition)
    const rule1Engine2 = {
      id: "engine_2",
      nodes: [],
    };

    const rule1Data2 = {
      ConditionSetId: "CS_001",
      RuleId: "Rule_1",
      ConditionId: "C2",
      SelectAttribute: "Salary",
      Condition: "greater than",
      SelectValue: "30",
      Flag: "True",
    };

    Object.entries(rule1Data2).forEach(([label, value]) => {
      const nodeId = `${label}_${Date.now()}_${Math.random()}`;
      this.nodes.push({
        id: nodeId,
        type: "default",
        data: { label, value },
        position: { x: 0, y: 0 },
      });
      rule1Engine2.nodes.push(nodeId);
    });

    this.engines.push(rule1Engine2);

    // Sample data for Rule 2
    const rule2Engine1 = {
      id: "engine_3",
      nodes: [],
    };

    const rule2Data1 = {
      ConditionSetId: "CS_002",
      RuleId: "Rule_2",
      ConditionId: "C3",
      SelectAttribute: "Country",
      Condition: "equals",
      SelectValue: "True",
      Flag: "False",
    };

    Object.entries(rule2Data1).forEach(([label, value]) => {
      const nodeId = `${label}_${Date.now()}_${Math.random()}`;
      this.nodes.push({
        id: nodeId,
        type: "default",
        data: { label, value },
        position: { x: 0, y: 0 },
      });
      rule2Engine1.nodes.push(nodeId);
    });

    this.engines.push(rule2Engine1);

    // Initialize rule order
    this.ruleOrder = ["Rule_1", "Rule_2"];
  }

  // ================================
  //  SAVE/LOAD/EXPORT METHODS
  // ================================
  buildSnapshot() {
    const nodes = toJS(this.nodes);
    const edges = toJS(this.edges);
    const engines = toJS(this.engines);
    const ruleIdsPerGroup = toJS(this.ruleIdsPerGroup);
    const explorer = toJS(this.explorer);
    const rules = this.computeRulesFromGraph(nodes, engines);

    return {
      version: 1,
      savedAt: new Date().toISOString(),
      user: this.username || null,
      dashboard: this.dashboard || null,
      databasename: this.databasename || null,
      explorer,
      selectedCollections: toJS(this.selectedCollections || []),
      activeCollection: this.activeCollection || null,
      nodes,
      edges,
      engines,
      ruleIdsPerGroup,
      ruleOrder: toJS(this.ruleOrder),
      globalRuleCounter: this.globalRuleCounter || 1,
      rules,
    };
  }

  applySnapshot(snap) {
    runInAction(() => {
      this.nodes = snap.nodes || [];
      this.edges = snap.edges || [];
      this.engines = snap.engines || [];
      this.ruleIdsPerGroup = snap.ruleIdsPerGroup || {};
      this.ruleOrder = snap.ruleOrder || [];
      this.globalRuleCounter = snap.globalRuleCounter || this.globalRuleCounter || 1;
      this.explorer = snap.explorer || [];
      this.selectedCollections = snap.selectedCollections || [];
      this.activeCollection = snap.activeCollection || null;
      this.dashboard = snap.dashboard || this.dashboard;
      this.databasename = snap.databasename || this.databasename;
    });
  }

  setupAutosave() {
    if (this._setupAutosaveOnce) return;
    this._setupAutosaveOnce = true;

    reaction(
      () => ({
        nodes: toJS(this.nodes),
        edges: toJS(this.edges),
        engines: toJS(this.engines),
        ruleIdsPerGroup: toJS(this.ruleIdsPerGroup),
        ruleOrder: toJS(this.ruleOrder),
        explorer: toJS(this.explorer),
        selectedCollections: toJS(this.selectedCollections || []),
        activeCollection: this.activeCollection,
        dashboard: this.dashboard,
      }),
      () => {
        try {
          const snap = this.buildSnapshot();
          localStorage.setItem(this.saveKey(), JSON.stringify(snap));
        } catch (e) {
          console.warn("Autosave failed:", e);
        }
      },
      { delay: 600 }
    );
  }

  computeRulesFromGraph(nodes, engines) {
    const byId = new Map(nodes.map(n => [n.id, n]));
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
      const parts = {};
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
          parts.value = n?.data?.value ?? null;
        } else if (labelEq(n, L.fl)) {
          parts.flag = n?.data?.value ?? null;
        }
      }
      return {
        groupName: eng.groupName || null,
        type: eng.type || "rule",
        collection: eng.collection || null,
        ...parts,
      };
    });
  }

  // 📥 Download — export last snapshot as JSON/CSV/Word
downloadLastExport = async () => {
  if (!this.lastExportedData) {
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
  const parsed = JSON.parse(this.lastExportedData);

  if (format === "json") {
    blob = new Blob([this.lastExportedData], { type: "application/json" });
    filename = this.currentFileName || "package.json";
  } else if (format === "csv") {
    const csv = this.convertSnapshotToCSV(parsed.snapshot);
    blob = new Blob([csv], { type: "text/csv" });
    filename = (this.currentFileName || "package").replace(/\.json$/, ".csv");
  } else if (format === "word") {
    blob = new Blob(["Word export not implemented yet"], { type: "application/msword" });
    filename = (this.currentFileName || "package").replace(/\.json$/, ".docx");
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);

  Swal.fire("Downloaded", `File saved as ${filename}`, "success");
};

  // 💾 Save — update existing package
saveFile = async () => {
  if (!this.currentPackageId) {
    Swal.fire("No package selected", "Use Save As first to create a package.", "warning");
    return;
  }

  try {
    const snap = this.buildSnapshot();
    const updated = await this.saveFlowToDB(this.currentPackageId, snap, { saveAs: false });

    const userKey = this.saveKey();
    localStorage.setItem(userKey, JSON.stringify(snap));

    this.lastExportedData = JSON.stringify(
      { packageId: this.currentPackageId, snapshot: snap },
      null,
      2
    );
    this.currentFileName = `${this.currentPackageId}.json`;

    Swal.fire("Saved", `Package ${this.currentPackageId} updated successfully.`, "success");
  } catch (err) {
    console.error("Save error:", err);
    Swal.fire("Error", "Save failed", "error");
  }
};

// 💾 Save As — create a new package
saveFileAs = async () => {
  const { value: packageId } = await Swal.fire({
    title: "Save As",
    input: "text",
    inputLabel: "Enter new package name",
    inputPlaceholder: "package2",
    showCancelButton: true,
  });

  if (!packageId) return;

  try {
    const snap = this.buildSnapshot();
    const created = await this.saveFlowToDB(packageId, snap, { saveAs: true });

    const userKey = this.saveKey();
    localStorage.setItem(userKey, JSON.stringify(snap));

    this.lastExportedData = JSON.stringify(
      { packageId, snapshot: snap },
      null,
      2
    );
    this.currentFileName = `${packageId}.json`;

    Swal.fire("Created", `New package ${packageId} saved successfully.`, "success");
  } catch (err) {
    console.error("Save As error:", err);
    Swal.fire("Error", "Save As failed", "error");
  }
};

  convertSnapshotToCSV(snap) {
    if (!snap || !snap.rules || snap.rules.length === 0) return "No data";

    const headers = Object.keys(snap.rules[0]);
    const rows = snap.rules.map((rule) => headers.map((h) => rule[h] ?? ""));

    return [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  }

  saveKey(username = this.username, dashboard = this.dashboard) {
    const user = username || "anon";
    const dash = dashboard || "default";
    return `flowData:${user}:${dash}`;
  }

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
  }

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
  }

  _mergeSnapshots(base = {}, override = {}) {
    const merged = { ...base, ...override };

    merged.nodes = this._mergeById(base.nodes || [], override.nodes || []);
    merged.edges = this._mergeById(base.edges || [], override.edges || []);
    merged.engines = this._mergeById(base.engines || [], override.engines || []);
    merged.rules = this._mergeById(base.rules || [], override.rules || []);
    merged.explorer = this._mergeExplorers(base.explorer || [], override.explorer || []);

    merged.selectedCollections = Array.from(new Set([...(base.selectedCollections || []), ...(override.selectedCollections || [])]));
    merged.ruleIdsPerGroup = { ...(base.ruleIdsPerGroup || {}), ...(override.ruleIdsPerGroup || {}) };
    merged.ruleOrder = Array.from(new Set([...(base.ruleOrder || []), ...(override.ruleOrder || [])]));
    merged.globalRuleCounter = Math.max(base.globalRuleCounter || 0, override.globalRuleCounter || 0);
    merged.activeCollection = override.activeCollection ?? base.activeCollection;
    merged.savedAt = new Date().toISOString();

    return merged;
  }

  saveFlow = () => {
    try {
      const snap = this.buildSnapshot();

      const userKey = this.saveKey();
      localStorage.setItem(userKey, JSON.stringify(snap));

      const anonKey = this.saveKey("anon", "default");
      const anonRaw = localStorage.getItem(anonKey);
      const anonSnap = anonRaw ? JSON.parse(anonRaw) : {};
      const mergedAnon = this._mergeSnapshots(anonSnap, snap);
      localStorage.setItem(anonKey, JSON.stringify(mergedAnon));

      Swal.fire({ icon: "success", title: "Saved", text: `Saved to ${userKey}` });

      const baseName = this.currentFileName ? this.currentFileName.replace(/\.json$/, "") : "package";
      this.saveFlowToDB(baseName, snap, { saveAs: false });
    } catch (e) {
      console.error("saveFlow error:", e);
      Swal.fire({ icon: "error", title: "Save failed" });
    }
  }

  restoreFlow = async (name = null) => {
    try {
      if (name) {
        const flows = await this.fetchFlowsFromDB();
        const match = flows.find(f => f.name === name);

        if (match) {
          this.applySnapshot(match.snapshot);
          this.initGlobalRuleCounter();
          return true;
        }
      }

      const anonKey = this.saveKey("anon", "default");
      const userKey = this.saveKey();

      const anonRaw = localStorage.getItem(anonKey);
      const userRaw = localStorage.getItem(userKey);

      if (!anonRaw && !userRaw) {
        return false;
      }

      const anonSnap = anonRaw ? JSON.parse(anonRaw) : {};
      const userSnap = userRaw ? JSON.parse(userRaw) : {};
      const merged = this._mergeSnapshots(anonSnap, userSnap);

      this.applySnapshot(merged);
      this.initGlobalRuleCounter();

      return true;
    } catch (e) {
      console.error("restoreFlow error:", e);
      return false;
    }
  }

  getPackagesKey(username = this.username, dashboard = this.dashboard) {
    const user = username || "anon";
    const dash = dashboard || "default";
    return `flowPackages:${user}:${dash}`;
  }

  listPackages() {
    try {
      const raw = localStorage.getItem(this.getPackagesKey());
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("listPackages error:", e);
      return [];
    }
  }

  downloadPackage = (packageId) => {
    try {
      const pk = this.listPackages().find((p) => p.id === packageId);
      if (!pk) {
        Swal.fire("Not found", `Package ${packageId} not found`, "error");
        return;
      }
      const blob = new Blob([JSON.stringify(pk, null, 2)], { type: "application/json" });
      saveAs(blob, `${packageId}.json`);
    } catch (err) {
      console.error("downloadPackage error:", err);
      Swal.fire("Error", "Download failed", "error");
    }
  }

  importPackage = (packageId) => {
    try {
      const pk = this.listPackages().find((p) => p.id === packageId);
      if (!pk) {
        Swal.fire("Not found", `Package ${packageId} not found`, "error");
        return;
      }
      this.applySnapshot(pk.snapshot);
      Swal.fire("Imported", `Package ${packageId} applied to workspace`, "success");
    } catch (err) {
      console.error("importPackage error:", err);
      Swal.fire("Error", "Import failed", "error");
    }
  }

  fetchFlowsFromDB = async (params = {}) => {
    try {
      const q = {
        user: this.username || "anon",
        dashboard: this.dashboard || "default",
        ...(params.baseName ? { baseName: params.baseName } : {}),
      };
      const res = await axios.get(API_BASE, { params: q });
      runInAction(() => {
        this.packages = Array.isArray(res.data) ? res.data : [];
      });
      return res.data;
    } catch (err) {
      console.error("fetchFlowsFromDB error:", err);
      return [];
    }
  }

  saveFlowToDB = async (packageId, snapshot, options = {}) => {
    try {
      if (options.saveAs) {
        const payload = { packageId, snapshot, notes: options.notes || "" };
        const res = await axios.post(API_BASE, payload);
        const pkg = res.data;

        runInAction(() => {
          this.packages = [pkg, ...(this.packages || [])];
          this.currentPackageId = pkg.packageId;
          this.currentPackageMeta = pkg;
        });

        Swal.fire("Created", `New package ${pkg.packageId} saved to DB.`, "success");
        return pkg;
      } else {
        const payload = { snapshot, notes: options.notes || "" };
        const res = await axios.put(`${API_BASE}/${packageId}`, payload);
        const updated = res.data;

        runInAction(() => {
          this.packages = (this.packages || []).map((p) =>
            p.packageId === updated.packageId ? updated : p
          );
          this.currentPackageMeta = updated;
          this.currentPackageId = updated.packageId;
        });

        Swal.fire("Saved", `Package ${updated.packageId} updated.`, "success");
        return updated;
      }
    } catch (err) {
      console.error("saveFlowToDB error:", err);
      Swal.fire("Error", "Failed to save package to DB", "error");
      return null;
    }
  }

  loadPackageById = async (packageIdOrDbId) => {
    try {
      const res = await axios.get(`${API_BASE}/${packageIdOrDbId}`);
      const pkg = res.data;
      if (!pkg) {
        Swal.fire("Not found", "Package not found", "error");
        return null;
      }
      runInAction(() => {
        this.applySnapshot(pkg.snapshot || {});
        this.currentPackageId = pkg._id || pkg.packageId || pkg.id;
        this.currentPackageMeta = pkg;
      });
      Swal.fire("Loaded", `Package ${pkg.packageId} loaded.`, "success");
      return pkg;
    } catch (err) {
      console.error("loadPackageById error:", err);
      Swal.fire("Load failed", "Could not load package", "error");
      return null;
    }
  }
}

const Store = new DataStore();
export default Store;
