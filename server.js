const express = require("express");
const connectDB = require("./config/db");

const app = express();

connectDB();

// Initalise middleware

app.use(express.json());

//Test API
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/projects", require("./routes/api/projects"));
app.use("/api/tickets", require("./routes/api/tickets"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server started. Listening to the port ${PORT}`)
);
