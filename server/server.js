const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 6701;

app.use(bodyParser.json());

app.use(cors());

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://roy:roy@agreee.ftvcyrq.mongodb.net/task2?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define the "Name" model
const Name = mongoose.model("Name", {
  name: String,
});

app.get("/", (req, res) => {
  res.send("<h1>heello </h1>");
});

// Get all names
app.get("/api/names", async (req, res) => {
  try {
    const names = await Name.find();
    res.json(names);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a name by ID
app.get("/api/names/:id", async (req, res) => {
  try {
    const name = await Name.findById(req.params.id);
    if (!name) {
      return res.status(404).json({ error: "Name not found" });
    }
    res.json(name);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create a new name
app.post("/api/names", async (req, res) => {
  const newName = new Name({ name: req.body.name });
  try {
    const savedName = await newName.save();
    res.status(201).json(savedName);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a name by ID
app.put("/api/names/:id", async (req, res) => {
  try {
    const updatedName = await Name.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    if (!updatedName) {
      return res.status(404).json({ error: "Name not found" });
    }
    res.json(updatedName);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a name by ID
app.delete("/api/names/:id", async (req, res) => {
  try {
    const deletedName = await Name.findByIdAndDelete(req.params.id);
    if (!deletedName) {
      return res.status(404).json({ error: "Name not found" });
    }
    res.json({ message: "Name deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
