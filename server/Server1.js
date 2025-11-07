const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bodyParser = require("body-parser");
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const port = 4000;

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());
app.use(express.json());

// ✅ Use .env Mongo URI
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

// Connect to MongoDB (Compass or Atlas)
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Always use `sEmployeesssfinal` DB
const database = mongoose.connection.useDb("employees");

//---------------------------------------------------
// 🔹 Collections API
//---------------------------------------------------
app.get("/collections", async (req, res) => {
  try {
    const nativeConnection = mongoose.connection.client.db("employees");
    const collections = await nativeConnection.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);
    res.json(collectionNames);
  } catch (error) {
    console.error("Error fetching collections:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get columns
app.get("/columns", async (req, res) => {
  const { collection, field } = req.query;
  if (!collection) return res.json([]);

  try {
    if (database.models[collection]) delete database.models[collection];

    const dynamicModel = database.model(
      collection,
      new mongoose.Schema({}, { strict: false }),
      collection
    );

    const sampleDoc = await dynamicModel.findOne({});
    if (!sampleDoc) return res.json([]);

    let target = sampleDoc.toObject();
    if (field && target[field] && typeof target[field] === "object") {
      target = target[field];
    }

    const columnNames = Object.keys(target).filter(
      (key) => key !== "_id" && key !== "__v"
    );

    res.json(columnNames);
  } catch (error) {
    console.error("Error fetching columns:", error);
    res.json([]);
  }
});

// Distinct values
app.get("/values", async (req, res) => {
  const { collection, column } = req.query;
  if (!collection || !column) {
    return res.status(400).json({ error: "Missing collection or column" });
  }

  try {
    if (database.models[collection]) delete database.models[collection];

    const dynamicModel = database.model(
      collection,
      new mongoose.Schema({}, { strict: false }),
      collection
    );

    const distinctValues = await dynamicModel.distinct(column);
    res.json(distinctValues);
  } catch (error) {
    console.error("Error fetching values:", error);
    res.status(500).json({ error: "Failed to fetch values" });
  }
});

//---------------------------------------------------
// 🔹 Excel Headers Save
//---------------------------------------------------
const HeaderSchema = new mongoose.Schema({ headers: [String] });
const HeaderModel = database.model("excels", HeaderSchema);

async function storeHeadersInMongo() {
  try {
    const filePath = path.join(__dirname, "employees.xlsx"); // ✅ make sure file exists
    if (!fs.existsSync(filePath)) {
      console.log("Excel file not found!");
      return;
    }

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const headers = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

    const headerDocument = new HeaderModel({ headers });
    await headerDocument.save();

    console.log("Headers saved to MongoDB:", headers);
  } catch (error) {
    console.error("Error storing headers:", error);
  }
}
storeHeadersInMongo();

//---------------------------------------------------
// 🔹 User Authentication
//---------------------------------------------------
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ use sEmployeesssfinal
const User = database.model("User", userSchema);

// Register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered!" });
    }

    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ token });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Login failed!" });
  }
});
// ✅ Get current logged in user
app.get("/api/auth/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error("Auth /me error:", err);
    res.status(401).json({ error: "Invalid or expired token" });
  }
});


// Forgot Password
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json("User not found");

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetLink = `http://localhost:3000/resetpassword?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset",
      text: `Click this link to reset your password: ${resetLink}`,
    });

    res.json("Password reset link sent to your email");
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json("Server error. Please try again.");
  }
});

// Reset Password
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json("Missing token or password");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json("Invalid or expired token");
    }

    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json("User not found");

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.json("Password has been reset successfully");
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json("Server error. Please try again.");
  }
});

//---------------------------------------------------
// 🔹 Flow Packages
//---------------------------------------------------
const FlowPackageSchema = new mongoose.Schema(
  {
    packageId: { type: String, required: true, unique: true },
    snapshot: { type: mongoose.Schema.Types.Mixed, default: {} },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const FlowPackage = database.model("flow_packages", FlowPackageSchema);

app.post("/api/flows", async (req, res) => {
  try {
    const { packageId, snapshot = {}, notes = "" } = req.body;
    const exists = await FlowPackage.findOne({ packageId });
    if (exists) {
      return res
        .status(400)
        .json({ error: "Package already exists. Use Save to update." });
    }

    const pkg = new FlowPackage({ packageId, snapshot, notes });
    await pkg.save();
    res.status(201).json(pkg);
  } catch (err) {
    console.error("Create package error:", err);
    res.status(500).json({ error: "Failed to create package" });
  }
});

app.put("/api/flows/:packageId", async (req, res) => {
  try {
    const { snapshot, notes } = req.body;
    const updated = await FlowPackage.findOneAndUpdate(
      { packageId: req.params.packageId },
      { $set: { snapshot, notes, updatedAt: new Date() } },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("Update package error:", err);
    res.status(500).json({ error: "Failed to update package" });
  }
});

app.get("/api/flows", async (req, res) => {
  try {
    const docs = await FlowPackage.find().sort({ updatedAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error("List packages error:", err);
    res.status(500).json({ error: "Failed to list packages" });
  }
});

app.get("/api/flows/:packageId", async (req, res) => {
  try {
    const doc = await FlowPackage.findOne({ packageId: req.params.packageId });
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    console.error("Get package error:", err);
    res.status(500).json({ error: "Failed to fetch package" });
  }
});

app.delete("/api/flows/:packageId", async (req, res) => {
  try {
    const deleted = await FlowPackage.findOneAndDelete({
      packageId: req.params.packageId,
    });
    if (!deleted) return res.status(404).json({ error: "Package not found" });
    res.json({ message: "Package deleted successfully" });
  } catch (err) {
    console.error("Delete package error:", err);
    res.status(500).json({ error: "Failed to delete package" });
  }
});

//---------------------------------------------------
// 🔹 Start Server
//---------------------------------------------------
app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));
