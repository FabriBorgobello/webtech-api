const db = require("../database");
const express = require("express");
const router = express.Router();

// Create an order
router.post("/", (req, res) => {
  const { payment_intent, customer, email } = req.body;
  db.run(
    "INSERT INTO orders (payment_intent, customer, email) VALUES (?, ?, ?)",
    [payment_intent, customer, email],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      res.json({
        id: this.lastID,
        payment_intent,
        customer,
        email,
      });
    }
  );
});

// Read all orders
router.get("/", (req, res) => {
  db.all("SELECT * FROM orders", (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    res.json(rows);
  });
});

// Read a single order by ID
router.get("/:id", (req, res) => {
  const id = req.params.id;
  db.get("SELECT * FROM orders WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json(row);
  });
});

// Update a order by ID
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const { name, price, description, image } = req.body;
  db.run(
    "UPDATE orders SET name = ?, price = ?, description = ?, image = ? WHERE id = ?",
    [name, price, description, image, id],
    function (err) {
      if (err) {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: "Order not found" });
        return;
      }
      res.json({ message: "Order updated successfully" });
    }
  );
});

// Delete a order by ID
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM orders WHERE id = ?", [id], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: "Internal Server Error" });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Order not found" });
      return;
    }
    res.json({ message: "Order deleted successfully" });
  });
});

module.exports = router;
