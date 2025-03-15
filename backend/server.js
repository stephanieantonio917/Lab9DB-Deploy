require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Puppy, sequelize } = require("./puppy"); // ✅ Import both Puppy model & Sequelize instance

// ✅ Create Express App
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Test Database Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Sequelize successfully connected to the database!");
  } catch (error) {
    console.error("❌ Sequelize connection error:", error);
  }
})();

// ✅ Test Route to Check If Server is Running
app.get("/", (req, res) => {
  res.send("✅ Express server is running!");
});

// ✅ Get all puppies
app.get("/puppies", async (req, res) => {
  try {
    const puppies = await Puppy.findAll();
    res.json(puppies);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch puppies" });
  }
});

// ✅ Get a single puppy by ID
app.get("/puppies/:id", async (req, res) => {
  const puppyId = parseInt(req.params.id, 10);
  if (isNaN(puppyId) || puppyId <= 0) {
    return res.status(400).json({ error: "Invalid puppy ID" });
  }

  try {
    const puppy = await Puppy.findByPk(puppyId);
    if (!puppy) return res.status(404).json({ error: "Puppy not found" });

    res.json(puppy);
  } catch (error) {
    res.status(500).json({ error: "Error fetching puppy" });
  }
});

// ✅ Add a new puppy
app.post("/puppies", async (req, res) => {
  try {
    const newPuppy = await Puppy.create(req.body);
    res.status(201).json(newPuppy);
  } catch (error) {
    res.status(400).json({ error: "Error adding puppy" });
  }
});

// ✅ Update a puppy by ID
app.put("/puppies/:id", async (req, res) => {
  const puppyId = parseInt(req.params.id, 10);
  if (isNaN(puppyId) || puppyId <= 0) {
    return res.status(400).json({ error: "Invalid puppy ID" });
  }

  try {
    const updated = await Puppy.update(req.body, { where: { pet_id: puppyId } });
    if (updated[0] === 0) return res.status(404).json({ error: "Puppy not found" });

    res.json({ message: "Puppy updated successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Error updating puppy" });
  }
});

// ✅ Delete a puppy by ID
app.delete("/puppies/:id", async (req, res) => {
  const puppyId = parseInt(req.params.id, 10);
  if (isNaN(puppyId) || puppyId <= 0) {
    return res.status(400).json({ error: "Invalid puppy ID" });
  }

  try {
    const deleted = await Puppy.destroy({ where: { pet_id: puppyId } });
    if (!deleted) return res.status(404).json({ error: "Puppy not found" });

    res.json({ message: "Puppy deleted successfully!" });
  } catch (error) {
    res.status(400).json({ error: "Error deleting puppy" });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
