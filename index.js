const express = require("express");
const app = express();

const port = process.env.PORT || 3000;
const cors = require("cors");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/orders"));

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
