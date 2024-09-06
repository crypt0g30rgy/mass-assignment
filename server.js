const express = require('express')
const app = express()
require("dotenv").config({ path: "./.env" });
const PORT = process.env.PORT || 3000;
const connectDb = require("./utils/connectDB");
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express");

app.use(express.json())

connectDb();

const options = require('./swagger');

// API Enpoints
app.use("/", require("./routes/index"));

//Addig API Docs
const specs = swaggerJsdoc(options);


app.use(
  "/api",
  swaggerUi.serve,
  swaggerUi.setup(specs)
)

// Handles when a user request a non existent page the server responded with stack traces like filesystem paths
app.use((req, res, next) => {
    res.status(404).json({PathException: "Endpoint Not Found"});
});

app.listen(PORT, () => {
  console.log(`API running on port http://localhost:${PORT}`)
})